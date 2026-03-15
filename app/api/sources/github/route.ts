import { NextRequest, NextResponse } from 'next/server'
import { fetchGitHubSignals } from '@/lib/github'
import { checkBodySize, validateRepoParams } from '@/lib/guards'

export async function POST(req: NextRequest) {
  const sizeErr = checkBodySize(req, 4 * 1024) // 4KB — just owner + repo
  if (sizeErr) return sizeErr

  try {
    const { owner, repo } = await req.json()
    const validErr = validateRepoParams(owner, repo)
    if (validErr) return validErr

    const github = await fetchGitHubSignals(owner, repo)
    return NextResponse.json(github)
  } catch (err: any) {
    return NextResponse.json({ error: err.message ?? 'GitHub fetch failed' }, { status: 500 })
  }
}
