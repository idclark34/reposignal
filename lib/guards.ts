import { NextRequest, NextResponse } from 'next/server'

// Valid GitHub owner/repo: alphanumeric, hyphens, underscores, dots. 1–100 chars.
const REPO_SLUG = /^[a-zA-Z0-9._-]{1,100}$/

export function validateRepoParams(
  owner: unknown,
  repo: unknown
): NextResponse | null {
  if (typeof owner !== 'string' || typeof repo !== 'string') {
    return NextResponse.json({ error: 'owner and repo must be strings' }, { status: 400 })
  }
  if (!REPO_SLUG.test(owner)) {
    return NextResponse.json({ error: 'Invalid owner name' }, { status: 400 })
  }
  if (!REPO_SLUG.test(repo)) {
    return NextResponse.json({ error: 'Invalid repo name' }, { status: 400 })
  }
  return null
}

export function checkBodySize(req: NextRequest, maxBytes: number): NextResponse | null {
  const contentLength = req.headers.get('content-length')
  if (contentLength && parseInt(contentLength, 10) > maxBytes) {
    return NextResponse.json(
      { error: `Request body too large (max ${Math.round(maxBytes / 1024)}KB)` },
      { status: 413 }
    )
  }
  return null
}
