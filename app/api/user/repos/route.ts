import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { NextResponse } from 'next/server'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.accessToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const res = await fetch('https://api.github.com/user/repos?sort=pushed&per_page=100&type=owner', {
    headers: { Authorization: `Bearer ${session.accessToken}` },
  })
  const repos = await res.json()
  return NextResponse.json(repos)
}
