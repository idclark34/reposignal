import { GitHubSignals } from '@/types'

const GITHUB_API = 'https://api.github.com'

function githubHeaders() {
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  }
  if (process.env.GITHUB_TOKEN) {
    headers['Authorization'] = `Bearer ${process.env.GITHUB_TOKEN}`
  }
  return headers
}

export async function fetchGitHubSignals(owner: string, repo: string): Promise<GitHubSignals> {
  const headers = githubHeaders()
  const base = `${GITHUB_API}/repos/${owner}/${repo}`

  const [repoRes, readmeRes, commitsRes, issuesRes, langsRes, contribRes] = await Promise.allSettled([
    fetch(base, { headers }),
    fetch(`${base}/readme`, { headers }),
    fetch(`${base}/commits?per_page=20`, { headers }),
    fetch(`${base}/issues?sort=comments&state=open&per_page=10`, { headers }),
    fetch(`${base}/languages`, { headers }),
    fetch(`${base}/contributors?per_page=1&anon=true`, { headers }),
  ])

  if (repoRes.status === 'rejected' || !repoRes.value.ok) {
    throw new Error(`Failed to fetch repo: ${owner}/${repo}`)
  }

  const repoData = await repoRes.value.json()

  let readme = ''
  if (readmeRes.status === 'fulfilled' && readmeRes.value.ok) {
    const readmeData = await readmeRes.value.json()
    readme = Buffer.from(readmeData.content, 'base64').toString('utf-8')
  }

  let recentCommits: GitHubSignals['recentCommits'] = []
  if (commitsRes.status === 'fulfilled' && commitsRes.value.ok) {
    const commitsData = await commitsRes.value.json()
    recentCommits = commitsData.map((c: any) => ({
      message: c.commit?.message?.split('\n')[0] ?? '',
      date: c.commit?.author?.date ?? '',
    }))
  }

  let topIssues: GitHubSignals['topIssues'] = []
  if (issuesRes.status === 'fulfilled' && issuesRes.value.ok) {
    const issuesData = await issuesRes.value.json()
    topIssues = issuesData
      .filter((i: any) => !i.pull_request)
      .map((i: any) => ({
        title: i.title ?? '',
        body: (i.body ?? '').slice(0, 500),
        comments: i.comments ?? 0,
        labels: (i.labels ?? []).map((l: any) => l.name),
      }))
  }

  let languages: Record<string, number> = {}
  if (langsRes.status === 'fulfilled' && langsRes.value.ok) {
    languages = await langsRes.value.json()
  }

  let contributors = 0
  if (contribRes.status === 'fulfilled' && contribRes.value.ok) {
    const linkHeader = contribRes.value.headers.get('link') ?? ''
    const match = linkHeader.match(/page=(\d+)>; rel="last"/)
    contributors = match ? parseInt(match[1], 10) : 1
  }

  console.log('[github] fetched:', repoData.full_name)

  return {
    name: repoData.name,
    description: repoData.description ?? '',
    readme,
    topics: repoData.topics ?? [],
    language: repoData.language ?? '',
    languages,
    stars: repoData.stargazers_count ?? 0,
    forks: repoData.forks_count ?? 0,
    watchers: repoData.watchers_count ?? 0,
    openIssues: repoData.open_issues_count ?? 0,
    license: repoData.license?.name ?? null,
    createdAt: repoData.created_at,
    updatedAt: repoData.updated_at,
    recentCommits,
    topIssues,
    contributors,
    hasWebsite: !!repoData.homepage,
    websiteUrl: repoData.homepage ?? null,
  }
}
