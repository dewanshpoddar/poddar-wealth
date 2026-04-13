import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Simple in-memory rate limiter (resets on cold start — acceptable for edge)
// 30 requests per IP per 60 seconds across all /api/* routes
const hits = new Map<string, { n: number; t: number }>()

export function middleware(req: NextRequest) {
  if (!req.nextUrl.pathname.startsWith('/api/')) return NextResponse.next()

  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    req.headers.get('x-real-ip') ??
    'unknown'

  const now = Date.now()
  const WINDOW = 60_000  // 1 minute
  const LIMIT  = 30      // max requests per window

  const entry = hits.get(ip) ?? { n: 0, t: now }

  if (now - entry.t > WINDOW) {
    // Window expired — reset
    hits.set(ip, { n: 1, t: now })
  } else if (entry.n >= LIMIT) {
    return NextResponse.json(
      { error: 'Too many requests. Please wait a minute and try again.' },
      { status: 429 }
    )
  } else {
    hits.set(ip, { n: entry.n + 1, t: entry.t })
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/api/:path*',
}
