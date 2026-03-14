import { NextRequest, NextResponse } from 'next/server'
import { fetchGitHubSignals } from '@/lib/github'

export async function POST(req: NextRequest) {
  try {
    const { owner, repo } = await req.json()
    if (!owner || !repo) {
      return NextResponse.json({ error: 'owner and repo required' }, { status: 400 })
    }
    const github = await fetchGitHubSignals(owner, repo)
    return NextResponse.json(github)
  } catch (err: any) {
    return NextResponse.json({ error: err.message ?? 'GitHub fetch failed' }, { status: 500 })
  }
}
