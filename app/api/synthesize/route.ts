import { NextRequest } from 'next/server'
import { synthesize } from '@/lib/synthesize'
import { RawSignals } from '@/types'
import { checkBodySize } from '@/lib/guards'

// Allow up to 5 min for Sonnet synthesis + Haiku humanizer chain
export const maxDuration = 300

export async function POST(req: NextRequest) {
  const sizeErr = checkBodySize(req, 512 * 1024) // 512KB
  if (sizeErr) return sizeErr

  let signals: RawSignals
  try {
    signals = await req.json()
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid request body' }), {
      status: 400, headers: { 'Content-Type': 'application/json' },
    })
  }

  const enc = new TextEncoder()

  // Stream keepalive newlines every 8 seconds so Cloudflare's 100s tunnel
  // timeout doesn't fire while Claude is thinking. The final payload is the
  // last non-empty line; everything before it is whitespace the client ignores.
  const stream = new ReadableStream({
    async start(ctrl) {
      const ping = setInterval(() => {
        try { ctrl.enqueue(enc.encode('\n')) } catch {}
      }, 8_000)

      try {
        const { summary, fullReport } = await synthesize(signals)
        clearInterval(ping)
        ctrl.enqueue(enc.encode(JSON.stringify({ summary, fullReport, report: fullReport })))
        ctrl.close()
      } catch (err: any) {
        clearInterval(ping)
        ctrl.enqueue(enc.encode(JSON.stringify({ error: err.message ?? 'Synthesis failed' })))
        ctrl.close()
      }
    },
  })

  return new Response(stream, {
    headers: { 'Content-Type': 'application/x-ndjson' },
  })
}
