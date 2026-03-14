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

export interface HNStory {
  objectId: string
  title: string
  url: string | null
  author: string
  points: number
  numComments: number
  createdAt: string
}

export interface HNComment {
  objectId: string
  text: string
  storyTitle: string
  author: string
  createdAt: string
}

export interface HNSignals {
  query: string
  totalStories: number
  totalComments: number
  stories: HNStory[]
  showHNPosts: HNStory[]
  topComments: HNComment[]
}

export interface RedditPost {
  id: string
  title: string
  subreddit: string
  score: number
  numComments: number
  url: string
  selftext: string
  createdAt: string
}

export interface RedditSignals {
  query: string
  totalResults: number
  posts: RedditPost[]
}

export interface RawSignals {
  github: GitHubSignals
  hn?: HNSignals
  reddit?: RedditSignals
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
