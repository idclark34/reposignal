import { HNSignals, HNStory, HNComment } from '@/types'

const HN_API = 'https://hn.algolia.com/api/v1'

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

export async function fetchHNSignals(repoName: string, repoDescription: string = ''): Promise<HNSignals> {
  // Build a focused query from the repo name and key description words
  const descWords = repoDescription
    .split(/\s+/)
    .filter(w => w.length > 4)
    .slice(0, 4)
    .join(' ')
  const query = descWords ? `${repoName} ${descWords}` : repoName

  const [storiesRes, commentsRes] = await Promise.allSettled([
    fetch(`${HN_API}/search?query=${encodeURIComponent(repoName)}&tags=story&hitsPerPage=20`),
    fetch(`${HN_API}/search?query=${encodeURIComponent(repoName)}&tags=comment&hitsPerPage=30`),
  ])

  let stories: HNStory[] = []
  let totalStories = 0
  if (storiesRes.status === 'fulfilled' && storiesRes.value.ok) {
    const data = await storiesRes.value.json()
    totalStories = data.nbHits ?? 0
    stories = (data.hits ?? []).map(parseStory)
  }

  const showHNPosts = stories.filter(s => s.title.startsWith('Show HN:'))

  let topComments: HNComment[] = []
  let totalComments = 0
  if (commentsRes.status === 'fulfilled' && commentsRes.value.ok) {
    const data = await commentsRes.value.json()
    totalComments = data.nbHits ?? 0
    topComments = (data.hits ?? []).map(parseComment)
  }

  console.log(`[hn] query="${repoName}" stories=${totalStories} comments=${totalComments}`)

  return {
    query: repoName,
    totalStories,
    totalComments,
    stories,
    showHNPosts,
    topComments,
  }
}
