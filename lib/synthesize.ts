import Anthropic from '@anthropic-ai/sdk'
import { RawSignals, ReportSummary } from '@/types'

const client = new Anthropic()

// ── Shared context builder ────────────────────────────────────────────────────
function buildContext(signals: RawSignals) {
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
    ? `\n## Key Source Files (actual code — use this to understand what the app really does)\n${github.keyFiles.map(f => `### ${f.path}\n\`\`\`\n${f.content}\n\`\`\``).join('\n\n')}\n`
    : ''

  const repoContext = `## Repository
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
${redditSection}`

  return { systemPrompt, repoContext }
}

// ── Call 1: summary JSON via Haiku (fast) ────────────────────────────────────
async function callSummaryJSON(
  systemPrompt: string,
  repoContext: string,
): Promise<ReportSummary | null> {
  const userPrompt = `Analyze this repository data and output ONLY a JSON object wrapped in <summary> tags. No other text before or after.

<summary>
{
  "icp": "One sentence describing the ideal user",
  "topChannel": "Single best launch channel",
  "trendDirection": "rising",
  "audienceSize": "medium",
  "launchReadiness": 72,
  "topSubreddits": ["SideProject", "golang", "webdev"],
  "painPhrases": ["phrase1", "phrase2", "phrase3"],
  "showHNHeadline": "Best Show HN headline candidate",
  "biggestRisk": "One sentence on the biggest positioning risk",
  "winningAngle": "The single strongest marketing angle"
}
</summary>

Rules:
- trendDirection must be exactly one of: "rising", "stable", "declining"
- audienceSize must be exactly one of: "small", "medium", "large"
- launchReadiness must be an integer 0-100
- topSubreddits must NOT include the "r/" prefix — just the subreddit name
- painPhrases must be 3 short phrases (under 8 words each) quoting actual user pain language from the data

---

${repoContext}`

  const message = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 400,
    system: systemPrompt,
    messages: [{ role: 'user', content: userPrompt }],
  })

  const text = message.content[0].type === 'text' ? message.content[0].text : ''
  const match = text.match(/<summary>([\s\S]*?)<\/summary>/)
  if (!match) {
    console.warn('[synthesize] summary JSON not found in Haiku response')
    return null
  }
  try {
    const summary = JSON.parse(match[1].trim()) as ReportSummary
    summary.launchReadiness = Math.max(0, Math.min(100, Math.round(summary.launchReadiness)))
    console.log('[synthesize] summary done, tokens:', message.usage)
    return summary
  } catch {
    console.warn('[synthesize] summary JSON parse failed')
    return null
  }
}

// ── Call 2: full prose report via Sonnet ─────────────────────────────────────
async function callFullReport(
  systemPrompt: string,
  repoContext: string,
): Promise<string> {
  const userPrompt = `Analyze this repository and write a marketing intelligence report grounded in the evidence below.

Produce a report with these exact sections. Each section must cite specific evidence from the data above.

1. **What This App Actually Does** — Based on the code and README, describe precisely what the app does. What problem does it solve? What are the key technical components? This should be more specific than the README — use the code files.

2. **ICP (Ideal Customer Profile)** — Who is the actual target user? Cite specific evidence: issue authors, the language in HN/Reddit posts, what the code structure implies about sophistication level. Not "developers" — "solo devs who ship side projects and struggle with X, evidenced by [specific HN comment / issue]."

3. **Positioning Angle** — The single strongest angle based on real pain language from the community data. Quote the most compelling HN or Reddit post/comment that captures the pain this app solves.

4. **Top 3 Launch Channels** — Ranked by evidence. For each: name the specific community, cite why (e.g. "r/SideProject has 12 posts with 500+ upvotes about this exact problem"), and give the exact angle to use there.

5. **Build-in-Public Content Ideas** — 5 specific posts grounded in real community pain language. For each, note which HN/Reddit signal it came from.

6. **Deployment & Launch Readiness** — Is this app ready to launch? What's missing? Cite commit velocity, open issue quality, and any gaps between what the code does vs what the README promises.

7. **Gaps & Risks** — What does the data say is missing, risky, or likely to confuse the target user on first encounter?

---

${repoContext}`

  const message = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 2500,
    system: systemPrompt,
    messages: [{ role: 'user', content: userPrompt }],
  })

  console.log('[synthesize] report done, tokens:', message.usage)
  return message.content[0].type === 'text' ? message.content[0].text : ''
}

// ── Streaming export ─────────────────────────────────────────────────────────
export type SynthesisChunk =
  | { type: 'summary'; summary: ReportSummary | null }
  | { type: 'report'; fullReport: string }

// Backwards-compatible wrapper for legacy callers
export async function synthesize(signals: RawSignals): Promise<{ summary: ReportSummary | null; fullReport: string }> {
  let summary: ReportSummary | null = null
  let fullReport = ''
  for await (const chunk of synthesizeStreaming(signals)) {
    if (chunk.type === 'summary') summary = chunk.summary
    if (chunk.type === 'report') fullReport = chunk.fullReport
  }
  return { summary, fullReport }
}

export async function* synthesizeStreaming(signals: RawSignals): AsyncGenerator<SynthesisChunk> {
  const { systemPrompt, repoContext } = buildContext(signals)
  console.log('[synthesize] starting parallel calls, context ~', repoContext.length, 'chars')

  // Fire both calls immediately — they run concurrently
  const summaryP = callSummaryJSON(systemPrompt, repoContext)
  const reportP = callFullReport(systemPrompt, repoContext)

  // Yield summary as soon as Haiku responds (~3-5s)
  const summary = await summaryP
  yield { type: 'summary', summary }

  // Yield report when Sonnet finishes (runs in parallel with above)
  const fullReport = await reportP
  yield { type: 'report', fullReport }
}
