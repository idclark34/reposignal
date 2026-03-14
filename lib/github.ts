import { GitHubSignals } from '@/types'

const GITHUB_API = 'https://api.github.com'

const SKIP_DIRS = ['node_modules', '.next', 'dist', 'build', '.git', '__pycache__',
  'vendor', '.cache', 'coverage', '.turbo', 'out', 'public', 'static', 'assets']

const DEP_FILES = ['package.json', 'requirements.txt', 'Cargo.toml', 'go.mod',
  'pyproject.toml', 'Gemfile', 'composer.json', 'build.gradle']

const SKIP_FILES = ['package-lock.json', 'yarn.lock', 'pnpm-lock.yaml', 'bun.lockb',
  'Cargo.lock', 'poetry.lock']

const SOURCE_EXTS = new Set(['.ts', '.tsx', '.js', '.jsx', '.py', '.go', '.rs',
  '.rb', '.java', '.cs', '.swift', '.kt', '.cpp', '.c', '.h'])

function scoreFile(path: string): number {
  const parts = path.split('/')
  const name = parts[parts.length - 1]
  const ext = name.includes('.') ? '.' + name.split('.').pop()! : ''
  const depth = parts.length

  if (SKIP_DIRS.some(d => parts.includes(d))) return 0
  if (SKIP_FILES.includes(name)) return 0
  if (name.endsWith('.d.ts') || name.endsWith('.min.js') || name.endsWith('.min.css')) return 0
  if (name.includes('.test.') || name.includes('.spec.') || name.includes('.stories.')) return 0

  // Dependency / config files — highest value for understanding the project
  if (DEP_FILES.includes(name)) return depth === 1 ? 100 : 60

  // Entry points near the root
  const entryNames = ['index.ts', 'index.js', 'main.ts', 'main.js', 'main.py',
    'app.ts', 'app.js', 'app.py', 'server.ts', 'server.js']
  if (entryNames.includes(name)) return depth <= 2 ? 90 : 50

  // Core source dirs
  const coreDirs = ['src', 'lib', 'app', 'api', 'routes', 'server', 'core', 'services']
  const inCoreDir = coreDirs.some(d => parts[0] === d || parts[1] === d)
  if (inCoreDir && SOURCE_EXTS.has(ext)) return depth <= 3 ? 70 : 40

  if (SOURCE_EXTS.has(ext) && depth <= 2) return 30

  return 0
}

function trimPackageJson(raw: string): string {
  try {
    const p = JSON.parse(raw)
    return JSON.stringify({
      name: p.name,
      description: p.description,
      scripts: p.scripts,
      dependencies: Object.keys(p.dependencies ?? {}),
      devDependencies: Object.keys(p.devDependencies ?? {}).slice(0, 8),
    }, null, 2)
  } catch {
    return raw.slice(0, 1500)
  }
}

async function fetchKeySourceFiles(
  owner: string,
  repo: string,
  headers: Record<string, string>,
): Promise<{ path: string; content: string }[]> {
  const treeRes = await fetch(
    `${GITHUB_API}/repos/${owner}/${repo}/git/trees/HEAD?recursive=1`,
    { headers },
  )
  if (!treeRes.ok) return []

  const tree = await treeRes.json()

  const candidates = ((tree.tree ?? []) as any[])
    .filter(f => f.type === 'blob' && (f.size ?? 0) < 40000)
    .map(f => ({ path: f.path as string, score: scoreFile(f.path) }))
    .filter(f => f.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 10)

  const fetched = await Promise.allSettled(
    candidates.map(f =>
      fetch(`${GITHUB_API}/repos/${owner}/${repo}/contents/${f.path}`, { headers })
    ),
  )

  const keyFiles: { path: string; content: string }[] = []
  for (let i = 0; i < fetched.length; i++) {
    const res = fetched[i]
    if (res.status !== 'fulfilled' || !res.value.ok) continue
    const data = await res.value.json()
    if (data.encoding !== 'base64') continue

    const raw = Buffer.from(data.content, 'base64').toString('utf-8')
    const name = candidates[i].path.split('/').pop()!
    const content = name === 'package.json' ? trimPackageJson(raw) : raw.slice(0, 1500)
    keyFiles.push({ path: candidates[i].path, content })
  }

  console.log(`[github] fetched ${keyFiles.length} key files:`, keyFiles.map(f => f.path))
  return keyFiles
}

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

  // Fetch actual source files — runs after we have the tree
  const keyFiles = await fetchKeySourceFiles(owner, repo, headers)

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
    keyFiles,
  }
}
