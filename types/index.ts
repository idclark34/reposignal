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
  keyFiles: { path: string; content: string }[]
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

export interface ReportSummary {
  icp: string
  topChannel: string
  trendDirection: 'rising' | 'stable' | 'declining'
  audienceSize: 'small' | 'medium' | 'large'
  launchReadiness: number
  topSubreddits: string[]
  painPhrases: string[]
  showHNHeadline: string
  biggestRisk: string
  winningAngle: string
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

export type PlaybookPlatform = 'twitter' | 'hn' | 'reddit' | 'producthunt' | 'newsletter'

export interface PlaybookContentExample {
  platform: PlaybookPlatform
  text: string
  engagement: string
  context?: string
}

export interface PlaybookMilestone {
  label: string
  description: string
  timeframe: string
}

export interface PlaybookEntry {
  id: string
  name: string
  tagline: string
  repo: string
  currentStars: string
  categories: string[]
  stack: string[]
  launchYear: number
  channels: PlaybookPlatform[]
  contentExamples: PlaybookContentExample[]
  milestones: PlaybookMilestone[]
  lessons: string[]
  channelNotes: string
}

export interface PlaybookMatch {
  playbook: PlaybookEntry
  matchReason: string
  matchScore: number
}

export interface PlaybooksResponse {
  matches: PlaybookMatch[]
}
