import { HNSignals, HNStory, HNComment } from '@/types'

const HN_API = 'https://hn.algolia.com/api/v1'

// Common words that add no search value
const STOP = new Set(['with', 'that', 'this', 'from', 'your', 'have', 'using', 'build', 'built',
  'tool', 'tools', 'simple', 'easy', 'fast', 'based', 'open', 'source', 'free', 'into', 'makes',
  'allows', 'helps', 'support', 'provide', 'about', 'when', 'which', 'their'])

function parseStory(hit: any): HNStory {
  return {
    objectId: hit.objectID,
    title: hit.title ?? '',
    url: hit.url ?? null,
    author: hit.author ?? '',
    points: hit.points ?? 0,
    numComments: hit.num_comments ?? 0,
    createdAt: hit.created_at ?? '',
  }
}

function parseComment(hit: any): HNComment {
  return {
    objectId: hit.objectID,
    text: (hit.comment_text ?? '').replace(/<[^>]+>/g, '').slice(0, 400),
    storyTitle: hit.story_title ?? '',
    author: hit.author ?? '',
    createdAt: hit.created_at ?? '',
  }
}

function buildDomainQuery(description: string, topics: string[]): string {
  // Topics are usually the best search terms — they're curated by the author
  const topicTerms = topics
    .map(t => t.replace(/-/g, ' '))
    .slice(0, 4)
    .join(' ')

  // Pull meaningful words from the description
  const descTerms = description
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 4 && !STOP.has(w))
    .slice(0, 4)
    .join(' ')

  return [topicTerms, descTerms].filter(Boolean).join(' ').trim().slice(0, 100)
}

export async function fetchHNSignals(
  repoName: string,
  repoDescription: string = '',
  topics: string[] = [],
): Promise<HNSignals> {
  const domainQuery = buildDomainQuery(repoDescription, topics) || repoName

  console.log(`[hn] nameQuery="${repoName}" domainQuery="${domainQuery}"`)

  // Run 4 searches in parallel:
  // - repo name: finds direct mentions and Show HN posts
  // - domain: finds pain point discussions in the problem space
  const [nameStoriesRes, nameCommentsRes, domainStoriesRes, domainCommentsRes] = await Promise.allSettled([
    fetch(`${HN_API}/search?query=${encodeURIComponent(repoName)}&tags=story&hitsPerPage=15`),
    fetch(`${HN_API}/search?query=${encodeURIComponent(repoName)}&tags=comment&hitsPerPage=20`),
    fetch(`${HN_API}/search?query=${encodeURIComponent(domainQuery)}&tags=story&hitsPerPage=20`),
    fetch(`${HN_API}/search?query=${encodeURIComponent(domainQuery)}&tags=comment&hitsPerPage=30`),
  ])

  // Merge + deduplicate stories
  const seenStoryIds = new Set<string>()
  const stories: HNStory[] = []
  let totalStories = 0

  for (const res of [nameStoriesRes, domainStoriesRes]) {
    if (res.status === 'fulfilled' && res.value.ok) {
      const data = await res.value.json()
      totalStories += data.nbHits ?? 0
      for (const hit of data.hits ?? []) {
        if (!seenStoryIds.has(hit.objectID)) {
          seenStoryIds.add(hit.objectID)
          stories.push(parseStory(hit))
        }
      }
    }
  }

  // Merge + deduplicate comments
  const seenCommentIds = new Set<string>()
  const topComments: HNComment[] = []
  let totalComments = 0

  for (const res of [nameCommentsRes, domainCommentsRes]) {
    if (res.status === 'fulfilled' && res.value.ok) {
      const data = await res.value.json()
      totalComments += data.nbHits ?? 0
      for (const hit of data.hits ?? []) {
        if (!seenCommentIds.has(hit.objectID)) {
          seenCommentIds.add(hit.objectID)
          topComments.push(parseComment(hit))
        }
      }
    }
  }

  // Sort stories by signal strength (points + comments)
  stories.sort((a, b) => (b.points + b.numComments) - (a.points + a.numComments))

  const showHNPosts = stories.filter(s => s.title.startsWith('Show HN:'))

  console.log(`[hn] stories=${stories.length} (${totalStories} total hits) comments=${topComments.length} (${totalComments} total hits)`)

  return {
    query: domainQuery,
    totalStories,
    totalComments,
    stories,
    showHNPosts,
    topComments,
  }
}
