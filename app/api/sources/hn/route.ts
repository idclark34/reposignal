import { NextRequest, NextResponse } from 'next/server'
import { fetchHNSignals } from '@/lib/hn'
import { checkBodySize } from '@/lib/guards'

export async function POST(req: NextRequest) {
  const sizeErr = checkBodySize(req, 32 * 1024) // 32KB
  if (sizeErr) return sizeErr

  try {
    const body = await req.json()
    const { repoName, repoDescription, topics } = body

    if (typeof repoName !== 'string' || !repoName.trim()) {
      return NextResponse.json({ error: 'repoName required' }, { status: 400 })
    }
    if (repoName.length > 200) {
      return NextResponse.json({ error: 'repoName too long' }, { status: 400 })
    }
    if (repoDescription !== undefined && (typeof repoDescription !== 'string' || repoDescription.length > 1000)) {
      return NextResponse.json({ error: 'repoDescription invalid' }, { status: 400 })
    }
    const safeTopics = Array.isArray(topics)
      ? topics.slice(0, 20).filter((t): t is string => typeof t === 'string').map(t => t.slice(0, 100))
      : []

    const hn = await fetchHNSignals(repoName.slice(0, 200), repoDescription?.slice(0, 1000), safeTopics)
    return NextResponse.json(hn)
  } catch (err: any) {
    return NextResponse.json({ error: 'HN fetch failed' }, { status: 500 })
  }
}
