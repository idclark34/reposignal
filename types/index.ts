export interface GitHubSignals {
  name: string
  description: string
  readme: string
  topics: string[]
  language: string
  languages: Record<string, number>
  stars: number
  forks: number
  watchers: number
  openIssues: number
  license: string | null
  createdAt: string
  updatedAt: string
  recentCommits: {
    message: string
    date: string
  }[]
  topIssues: {
    title: string
    body: string
    comments: number
    labels: string[]
  }[]
  contributors: number
  hasWebsite: boolean
  websiteUrl: string | null
}

export interface RawSignals {
  github: GitHubSignals
  fetchedAt: string
}

export interface AnalysisRequest {
  owner: string
  repo: string
}

export interface AnalysisResponse {
  signals: RawSignals
  report: string
  cached: boolean
}
