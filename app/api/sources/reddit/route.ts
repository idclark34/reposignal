import { NextRequest, NextResponse } from 'next/server'
import { fetchRedditSignals } from '@/lib/reddit'

export async function POST(req: NextRequest) {
  try {
    const { repoName, repoDescription, topics } = await req.json()
    if (!repoName) {
      return NextResponse.json({ error: 'repoName required' }, { status: 400 })
    }
    const reddit = await fetchRedditSignals(repoName, repoDescription, topics ?? [])
    return NextResponse.json(reddit)
  } catch (err: any) {
    return NextResponse.json({ error: err.message ?? 'Reddit fetch failed' }, { status: 500 })
  }
}
