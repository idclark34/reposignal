import { NextRequest, NextResponse } from 'next/server'
import { synthesize } from '@/lib/synthesize'
import { RawSignals } from '@/types'

export async function POST(req: NextRequest) {
  try {
    const signals: RawSignals = await req.json()
    const report = await synthesize(signals)
    return NextResponse.json({ report })
  } catch (err: any) {
    return NextResponse.json({ error: err.message ?? 'Synthesis failed' }, { status: 500 })
  }
}
