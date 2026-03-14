import { NextRequest, NextResponse } from 'next/server'
import { fetchHNSignals } from '@/lib/hn'

export async function POST(req: NextRequest) {
  try {
    const { repoName, repoDescription, topics } = await req.json()
    if (!repoName) {
      return NextResponse.json({ error: 'repoName required' }, { status: 400 })
    }
    const hn = await fetchHNSignals(repoName, repoDescription, topics ?? [])
    return NextResponse.json(hn)
  } catch (err: any) {
    return NextResponse.json({ error: err.message ?? 'HN fetch failed' }, { status: 500 })
  }
}
