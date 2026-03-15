import { NextRequest, NextResponse } from 'next/server'
import { synthesize } from '@/lib/synthesize'
import { RawSignals } from '@/types'

export async function POST(req: NextRequest) {
  try {
    const signals: RawSignals = await req.json()
    const { summary, fullReport } = await synthesize(signals)
    return NextResponse.json({ summary, fullReport, report: fullReport })
  } catch (err: any) {
    return NextResponse.json({ error: err.message ?? 'Synthesis failed' }, { status: 500 })
  }
}
