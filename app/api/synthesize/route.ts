import { NextRequest, NextResponse } from 'next/server'
import { synthesize } from '@/lib/synthesize'
import { RawSignals } from '@/types'
import { checkBodySize } from '@/lib/guards'

// Allow up to 5 min for Sonnet synthesis + Haiku humanizer chain
// Vercel Hobby caps at 60s; Pro/Enterprise allows 300s
export const maxDuration = 300

export async function POST(req: NextRequest) {
  const sizeErr = checkBodySize(req, 512 * 1024) // 512KB
  if (sizeErr) return sizeErr

  try {
    const signals: RawSignals = await req.json()
    const { summary, fullReport } = await synthesize(signals)
    return NextResponse.json({ summary, fullReport, report: fullReport })
  } catch (err: any) {
    return NextResponse.json({ error: err.message ?? 'Synthesis failed' }, { status: 500 })
  }
}
