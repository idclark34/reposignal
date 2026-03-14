import Anthropic from '@anthropic-ai/sdk'
import { RawSignals } from '@/types'

const client = new Anthropic()

export async function synthesize(signals: RawSignals): Promise<string> {
  const { github } = signals

  const systemPrompt = `You are a product marketing strategist specializing in developer tools and indie software products.
You are given real data collected from multiple sources about a GitHub repository.
Your job is to produce specific, grounded marketing recommendations based ONLY on what the data shows.
Do not make up audiences, pain points, or channels that aren't evidenced in the data.
If the data is thin on a topic, say so rather than guessing.`

  const userPrompt = `Analyze this GitHub repository and produce a marketing intelligence report.

## Repository
Name: ${github.name}
Description: ${github.description}
Primary Language: ${github.language}
Stars: ${github.stars} | Forks: ${github.forks}
Topics: ${github.topics.join(', ')}
License: ${github.license ?? 'None'}
Created: ${github.createdAt} | Last Updated: ${github.updatedAt}
Contributors: ${github.contributors}
Open Issues: ${github.openIssues}
${github.hasWebsite ? `Website: ${github.websiteUrl}` : 'No website listed'}

## README (first 3000 chars)
${github.readme.slice(0, 3000)}

## Recent Commit Messages (last 20)
${github.recentCommits.map(c => `- ${c.message}`).join('\n')}

## Top Open Issues (by comment count)
${github.topIssues.map(i => `- [${i.comments} comments] ${i.title}`).join('\n')}

---

Produce a marketing report with these exact sections:

1. **ICP (Ideal Customer Profile)** — Based on who is filing issues, commit patterns, and the README, who is the actual target user? Be specific. Not "developers" — "solo devs building X who struggle with Y."

2. **Positioning Angle** — What is the single strongest angle to lead with? What problem language resonates most?

3. **Top 3 Launch Channels** — Ranked by evidence in the data. For each: the community/platform, why the data supports it, and what angle to use there specifically.

4. **Show HN Headline** — Write 3 candidate Show HN titles based on the project.

5. **Content Ideas** — 5 specific tweet/post ideas grounded in the pain language found in the data.

6. **Timing Recommendation** — Based on GitHub activity (commit frequency, issue velocity), is this project ready to launch publicly?

7. **Gaps & Risks** — What does the data suggest is missing or risky about the current positioning?`

  console.log('[synthesize] calling Claude API')

  const message = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 2048,
    system: systemPrompt,
    messages: [{ role: 'user', content: userPrompt }],
  })

  const content = message.content[0]
  if (content.type !== 'text') throw new Error('Unexpected response type from Claude')

  console.log('[synthesize] done, tokens used:', message.usage)
  return content.text
}
