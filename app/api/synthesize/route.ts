import { NextRequest } from 'next/server'
import { synthesizeStreaming } from '@/lib/synthesize'
import { RawSignals } from '@/types'
import { checkBodySize } from '@/lib/guards'

// Sonnet report call can take up to ~30s; keep generous ceiling
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

  // Stream NDJSON: keepalive newlines every 8s to prevent Cloudflare 524,
  // then one JSON line per chunk (summary first, report second).
  const stream = new ReadableStream({
    async start(ctrl) {
      const ping = setInterval(() => {
        try { ctrl.enqueue(enc.encode('\n')) } catch {}
      }, 8_000)

      try {
        for await (const chunk of synthesizeStreaming(signals)) {
          ctrl.enqueue(enc.encode(JSON.stringify(chunk) + '\n'))
        }
        clearInterval(ping)
        ctrl.close()
      } catch (err) {
        clearInterval(ping)
        console.error('[synthesize route] error:', err)
        ctrl.enqueue(enc.encode(JSON.stringify({ error: 'Synthesis failed' }) + '\n'))
        ctrl.close()
      }
    },
  })

  return new Response(stream, {
    headers: { 'Content-Type': 'application/x-ndjson' },
  })
}
