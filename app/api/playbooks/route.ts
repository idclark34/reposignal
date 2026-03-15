import { NextRequest, NextResponse } from 'next/server'
import { matchPlaybooks } from '@/lib/playbooks'
import { RawSignals } from '@/types'
import { checkBodySize } from '@/lib/guards'

export async function POST(req: NextRequest) {
  const sizeErr = checkBodySize(req, 256 * 1024) // 256KB
  if (sizeErr) return sizeErr

  try {
    const { signals, report }: { signals: RawSignals; report: string } = await req.json()
    const result = await matchPlaybooks(signals, report)
    return NextResponse.json(result)
  } catch (err: any) {
    return NextResponse.json({ error: err.message ?? 'Playbook matching failed' }, { status: 500 })
  }
}
