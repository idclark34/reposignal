import Anthropic from '@anthropic-ai/sdk'
import { RawSignals, PlaybooksResponse } from '@/types'
import { PLAYBOOKS } from '@/data/playbooks'

const client = new Anthropic()

export async function matchPlaybooks(signals: RawSignals, report: string): Promise<PlaybooksResponse> {
  const { github, hn, reddit } = signals

  const hnTitles = (hn?.stories ?? []).slice(0, 3).map(s => s.title).join('; ')
  const redditTitles = (reddit?.posts ?? []).slice(0, 3).map(p => `"${p.title}" (${p.subreddit})`).join('; ')

  const userPrompt = `Name: ${github.name}
Description: ${github.description}
Language: ${github.language}, Stars: ${github.stars}
Topics: ${github.topics.join(', ')}
HN signals: ${hnTitles || 'none found'}
Reddit signals: ${redditTitles || 'none found'}
Report summary: ${report.slice(0, 400)}

Available playbooks:
${PLAYBOOKS.map(p => `- id:"${p.id}" name:"${p.name}" categories:[${p.categories.join(', ')}] — ${p.tagline}`).join('\n')}

Return ONLY valid JSON: { "matches": [{ "id": "...", "matchScore": 8, "matchReason": "..." }, ...] }
Select the 2 best matches. matchReason must reference specific signals from their repo data. Each matchReason should be 2-3 sentences.`

  try {
    const message = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 512,
      messages: [{ role: 'user', content: userPrompt }],
    })

    const text = message.content[0].type === 'text' ? message.content[0].text : ''

    let parsed: { matches: { id: string; matchScore: number; matchReason: string }[] }
    try {
      // Strip any markdown code fences if present
      const jsonText = text.replace(/^```(?:json)?\s*/m, '').replace(/\s*```\s*$/m, '').trim()
      parsed = JSON.parse(jsonText)
    } catch {
      // Fallback: return first 2 playbooks with generic reason
      return {
        matches: PLAYBOOKS.slice(0, 2).map(p => ({
          playbook: p,
          matchReason: `${p.name}'s growth playbook shares key parallels with your project's positioning and target developer audience.`,
          matchScore: 5,
        })),
      }
    }

    const matches = (parsed.matches ?? []).slice(0, 2).map(m => {
      const playbook = PLAYBOOKS.find(p => p.id === m.id) ?? PLAYBOOKS[0]
      return {
        playbook,
        matchReason: m.matchReason,
        matchScore: m.matchScore,
      }
    })

    return { matches }
  } catch (err) {
    throw err
  }
}
