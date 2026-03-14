import { RedditPost, RedditSignals } from '@/types'

const BASE = 'https://www.reddit.com'
const USER_AGENT = 'server:ForkPulse:1.0 (repo intelligence scanner)'

const STOP = new Set(['with', 'that', 'this', 'from', 'your', 'have', 'using', 'build', 'built',
  'tool', 'tools', 'simple', 'easy', 'fast', 'based', 'open', 'source', 'free', 'into', 'makes',
  'allows', 'helps', 'support', 'provide', 'about', 'when', 'which', 'their'])

function parsePost(child: any): RedditPost {
  const d = child.data
  return {
    id: d.id,
    title: d.title ?? '',
    subreddit: d.subreddit ?? '',
    score: d.score ?? 0,
    numComments: d.num_comments ?? 0,
    url: `https://reddit.com${d.permalink}`,
    selftext: (d.selftext ?? '').slice(0, 300),
    createdAt: new Date((d.created_utc ?? 0) * 1000).toISOString(),
  }
}

async function searchPosts(query: string): Promise<{ posts: RedditPost[]; total: number }> {
  const url = `${BASE}/search.json?q=${encodeURIComponent(query)}&sort=top&t=year&limit=20&type=link`
  const res = await fetch(url, { headers: { 'User-Agent': USER_AGENT } })
  if (!res.ok) return { posts: [], total: 0 }
  const data = await res.json()
  const posts = (data.data?.children ?? []).map(parsePost)
  return { posts, total: data.data?.dist ?? posts.length }
}

function buildDomainQuery(description: string, topics: string[]): string {
  const topicTerms = topics.map(t => t.replace(/-/g, ' ')).slice(0, 4).join(' ')
  const descTerms = description
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 4 && !STOP.has(w))
    .slice(0, 4)
    .join(' ')
  return [topicTerms, descTerms].filter(Boolean).join(' ').trim().slice(0, 100)
}

export async function fetchRedditSignals(
  repoName: string,
  repoDescription: string = '',
  topics: string[] = [],
): Promise<RedditSignals> {
  const domainQuery = buildDomainQuery(repoDescription, topics) || repoName

  console.log(`[reddit] nameQuery="${repoName}" domainQuery="${domainQuery}"`)

  const [nameResult, domainResult] = await Promise.allSettled([
    searchPosts(repoName),
    searchPosts(domainQuery),
  ])

  const seen = new Set<string>()
  const posts: RedditPost[] = []
  let totalResults = 0

  for (const result of [nameResult, domainResult]) {
    if (result.status === 'fulfilled') {
      totalResults += result.value.total
      for (const post of result.value.posts) {
        if (!seen.has(post.id)) {
          seen.add(post.id)
          posts.push(post)
        }
      }
    }
  }

  posts.sort((a, b) => (b.score + b.numComments) - (a.score + a.numComments))

  console.log(`[reddit] posts=${posts.length} totalResults=${totalResults}`)

  return { query: domainQuery, totalResults, posts }
}
