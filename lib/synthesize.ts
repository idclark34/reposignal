import Anthropic from '@anthropic-ai/sdk'
import { RawSignals, ReportSummary } from '@/types'
import { humanizeReport } from '@/lib/humanize'

const client = new Anthropic()

export async function synthesize(signals: RawSignals): Promise<{ summary: ReportSummary | null; fullReport: string }> {
  const { github, hn, reddit } = signals

  const systemPrompt = `You are a product analyst specializing in developer tools and indie software.
You have been given real data from multiple sources about a GitHub repository — including its actual source code, README, issues, and real community discussions from Hacker News and Reddit.

Your job is to produce a specific, evidence-based intelligence report.

Rules:
- Every claim about pain points or audience MUST be backed by specific evidence from the data (quote actual HN/Reddit posts/comments, cite issue titles, reference what the code actually does)
- Do NOT make up audiences, channels, or pain points that aren't evidenced in the data
- When HN or Reddit data is available, treat it as ground truth about what real users complain about — quote it directly
- When the code files contradict the README, trust the code
- If data is thin on a topic, say so explicitly rather than guessing`

  const hnSection = hn
    ? `
## Hacker News (query: "${hn.query}")
Total mentions: ${hn.totalStories} stories · ${hn.totalComments} comments

Top stories:
${hn.stories.slice(0, 10).map(s => `- [${s.points}pts, ${s.numComments} comments] "${s.title}"`).join('\n') || 'None'}

Show HN posts:
${hn.showHNPosts.slice(0, 5).map(s => `- [${s.points}pts, ${s.numComments} comments] "${s.title}"`).join('\n') || 'None'}

Community comments (verbatim pain language — use these quotes):
${hn.topComments.slice(0, 12).map(c => `- "${c.text}" (on: ${c.storyTitle})`).join('\n') || 'None'}
`
    : '## Hacker News\nNo data available.\n'

  const redditSection = reddit
    ? `
## Reddit (query: "${reddit.query}")
Total results: ${reddit.totalResults}

Top posts:
${reddit.posts.slice(0, 10).map(p =>
  `- [r/${p.subreddit}, ${p.score}↑, ${p.numComments} comments] "${p.title}"${p.selftext ? `\n  > ${p.selftext.slice(0, 150)}` : ''}`
).join('\n') || 'None'}
`
    : '## Reddit\nNo data available.\n'

  const codeSection = github.keyFiles.length > 0
    ? `
## Key Source Files (actual code — use this to understand what the app really does)
${github.keyFiles.map(f => `### ${f.path}\n\`\`\`\n${f.content}\n\`\`\``).join('\n\n')}
`
    : ''

  const userPrompt = `Analyze this repository and produce a marketing intelligence report grounded in the evidence below.

First, output a JSON block wrapped in <summary> tags with exactly this structure:

<summary>
{
  "icp": "One sentence describing the ideal user",
  "topChannel": "Single best launch channel",
  "trendDirection": "rising",
  "audienceSize": "medium",
  "launchReadiness": 72,
  "topSubreddits": ["r/name1", "r/name2", "r/name3"],
  "painPhrases": ["phrase1", "phrase2", "phrase3"],
  "showHNHeadline": "Best Show HN headline candidate",
  "biggestRisk": "One sentence on the biggest positioning risk",
  "winningAngle": "The single strongest marketing angle"
}
</summary>

trendDirection must be exactly one of: "rising", "stable", "declining"
audienceSize must be exactly one of: "small", "medium", "large"
launchReadiness must be an integer 0-100
topSubreddits must include the "r/" prefix
painPhrases must be 3 short phrases (under 8 words each) quoting actual user pain language from the data

Then write the full report below.

---


## Repository
Name: ${github.name}
Description: ${github.description}
Language: ${github.language} | Stars: ${github.stars} | Forks: ${github.forks} | Contributors: ${github.contributors}
Topics: ${github.topics.join(', ') || 'none'}
License: ${github.license ?? 'None'}
Created: ${github.createdAt.slice(0, 10)} | Last updated: ${github.updatedAt.slice(0, 10)}
Open issues: ${github.openIssues}
${github.hasWebsite ? `Website: ${github.websiteUrl}` : 'No website listed'}

## README
${github.readme.slice(0, 2500)}

## Recent Commits (last 20)
${github.recentCommits.map(c => `- ${c.date.slice(0, 10)}  ${c.message}`).join('\n')}

## Top Open Issues (by comment count)
${github.topIssues.map(i => `- [${i.comments} comments] ${i.title}\n  ${i.body.slice(0, 200)}`).join('\n') || 'None'}
${codeSection}
${hnSection}
${redditSection}

---

Produce a report with these exact sections. Each section must cite specific evidence from the data above.

1. **What This App Actually Does** — Based on the code and README, describe precisely what the app does. What problem does it solve? What are the key technical components? This should be more specific than the README — use the code files.

2. **ICP (Ideal Customer Profile)** — Who is the actual target user? Cite specific evidence: issue authors, the language in HN/Reddit posts, what the code structure implies about sophistication level. Not "developers" — "solo devs who ship side projects and struggle with X, evidenced by [specific HN comment / issue]."

3. **Positioning Angle** — The single strongest angle based on real pain language from the community data. Quote the most compelling HN or Reddit post/comment that captures the pain this app solves.

4. **Top 3 Launch Channels** — Ranked by evidence. For each: name the specific community, cite why (e.g. "r/SideProject has 12 posts with 500+ upvotes about this exact problem"), and give the exact angle to use there.

5. **Build-in-Public Content Ideas** — 5 specific posts grounded in real community pain language. For each, note which HN/Reddit signal it came from.

6. **Deployment & Launch Readiness** — Is this app ready to launch? What's missing? Cite commit velocity, open issue quality, and any gaps between what the code does vs what the README promises.

7. **Gaps & Risks** — What does the data say is missing, risky, or likely to confuse the target user on first encounter?`

  console.log('[synthesize] calling Claude, context size ~', userPrompt.length, 'chars')

  const message = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 4096,
    system: systemPrompt,
    messages: [{ role: 'user', content: userPrompt }],
  })

  const content = message.content[0]
  if (content.type !== 'text') throw new Error('Unexpected response type from Claude')

  const raw = content.text
  const summaryMatch = raw.match(/<summary>([\s\S]*?)<\/summary>/)
  let summary: ReportSummary | null = null
  let fullReport = raw

  if (summaryMatch) {
    try {
      summary = JSON.parse(summaryMatch[1].trim())
      // Clamp launchReadiness to 0-100
      if (summary) summary.launchReadiness = Math.max(0, Math.min(100, Math.round(summary.launchReadiness)))
    } catch {
      // summary stays null
    }
    const afterTag = raw.indexOf('</summary>') + '</summary>'.length
    fullReport = raw.slice(afterTag).trim()
  }

  console.log('[synthesize] done, tokens used:', message.usage, '| summary parsed:', !!summary)

  // Race humanizer against a 25-second timeout — if Claude is slow, return the original
  const humanizedReport = await Promise.race([
    humanizeReport(fullReport),
    new Promise<string>(resolve => setTimeout(() => resolve(fullReport), 25_000)),
  ])
  return { summary, fullReport: humanizedReport }
}
