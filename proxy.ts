import { NextRequest, NextResponse } from 'next/server'

// Per-route request limits (per IP, per 60-second window)
const LIMITS: Record<string, number> = {
  '/api/synthesize':      5,   // Claude Sonnet — most expensive
  '/api/playbooks':       10,  // Claude Haiku
  '/api/sources/github':  20,  // GitHub API
  '/api/sources/hn':      20,  // HN Algolia
  '/api/sources/reddit':  20,  // Reddit API
}

// In-memory sliding window store: "ip:path" -> { count, windowStart }
// Persists across requests within a single edge function instance.
// Not globally consistent across Vercel instances — intentional tradeoff
// (no Redis dependency) that still stops most scripted abuse.
const store = new Map<string, { count: number; windowStart: number }>()
const WINDOW_MS = 60_000

function getLimit(pathname: string): number | null {
  for (const [path, rpm] of Object.entries(LIMITS)) {
    if (pathname === path || pathname.startsWith(path + '/')) return rpm
  }
  return null
}

function getIP(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
    req.headers.get('x-real-ip') ??
    'unknown'
  )
}

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl
  const limit = getLimit(pathname)
  if (!limit) return NextResponse.next()

  const ip = getIP(req)
  const key = `${ip}:${pathname}`
  const now = Date.now()

  let entry = store.get(key)
  if (!entry || now - entry.windowStart > WINDOW_MS) {
    entry = { count: 0, windowStart: now }
    store.set(key, entry)
  }
  entry.count++

  const remaining = Math.max(0, limit - entry.count)
  const headers = {
    'X-RateLimit-Limit':     String(limit),
    'X-RateLimit-Remaining': String(remaining),
    'X-RateLimit-Reset':     String(Math.ceil((entry.windowStart + WINDOW_MS) / 1000)),
  }

  if (entry.count > limit) {
    return new NextResponse(
      JSON.stringify({ error: 'Rate limit exceeded. Try again in a minute.' }),
      { status: 429, headers: { 'Content-Type': 'application/json', 'Retry-After': '60', ...headers } }
    )
  }

  // Periodic cleanup — remove entries older than 2 windows
  if (store.size > 500) {
    for (const [k, v] of store) {
      if (now - v.windowStart > WINDOW_MS * 2) store.delete(k)
    }
  }

  const res = NextResponse.next()
  Object.entries(headers).forEach(([k, v]) => res.headers.set(k, v))
  return res
}

export const config = {
  matcher: [
    '/api/synthesize',
    '/api/playbooks',
    '/api/sources/github',
    '/api/sources/hn',
    '/api/sources/reddit',
  ],
}
