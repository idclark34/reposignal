import { NextRequest, NextResponse } from 'next/server'
import { fetchGitHubSignals } from '@/lib/github'
import { fetchHNSignals } from '@/lib/hn'
import { synthesize } from '@/lib/synthesize'
import { AnalysisRequest, RawSignals } from '@/types'

export async function POST(req: NextRequest) {
  try {
    const body: AnalysisRequest = await req.json()
    const { owner, repo } = body

    if (!owner || !repo) {
      return NextResponse.json({ error: 'owner and repo are required' }, { status: 400 })
    }

    console.log(`[analyze] starting analysis for ${owner}/${repo}`)

    const github = await fetchGitHubSignals(owner, repo)
    const hn = await fetchHNSignals(github.name, github.description)

    const signals: RawSignals = {
      github,
      hn,
      fetchedAt: new Date().toISOString(),
    }

    const report = await synthesize(signals)

    return NextResponse.json({ signals, report, cached: false })
  } catch (err: any) {
    console.error('[analyze] error:', err)
    return NextResponse.json({ error: err.message ?? 'Analysis failed' }, { status: 500 })
  }
}
