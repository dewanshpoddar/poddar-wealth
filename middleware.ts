import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// ── In-memory rate limiter (API routes only) ──────────────────────────────────
// Note: resets on cold start — acceptable at this scale.
// For distributed rate limiting, replace with Vercel KV.
const hits = new Map<string, { n: number; t: number }>()
const WINDOW = 60_000
const LIMIT  = 30

// ── Language resolution (mirrors LangContext priority chain) ─────────────────
function resolveLang(req: NextRequest): 'en' | 'hi' {
  // 1. URL param
  const param = req.nextUrl.searchParams.get('lang')
  if (param === 'hi') return 'hi'
  if (param === 'en') return 'en'
  // 2. Cookie
  const cookie = req.cookies.get('pw_lang')?.value
  if (cookie === 'hi') return 'hi'
  if (cookie === 'en') return 'en'
  // 3. Accept-Language header (proxy for navigator.languages on server)
  const acceptLang = req.headers.get('accept-language') ?? ''
  if (acceptLang.toLowerCase().startsWith('hi')) return 'hi'
  return 'en'
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // ── API rate limiting ───────────────────────────────────────────────────────
  if (pathname.startsWith('/api/')) {
    const ip =
      req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
      req.headers.get('x-real-ip') ??
      'unknown'

    const now   = Date.now()
    const entry = hits.get(ip) ?? { n: 0, t: now }

    if (now - entry.t > WINDOW) {
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

  // ── Language handling (page routes only) ─────────────────────────────────────
  const lang = resolveLang(req)
  const hasParam = req.nextUrl.searchParams.has('lang')

  // If ?lang= param present: promote to cookie and redirect to clean URL
  if (hasParam) {
    const cleanUrl = req.nextUrl.clone()
    cleanUrl.searchParams.delete('lang')
    const res = NextResponse.redirect(cleanUrl)
    res.cookies.set('pw_lang', lang, {
      path: '/',
      maxAge: 60 * 60 * 24 * 365,  // 1 year
      sameSite: 'lax',
    })
    return res
  }

  // Forward resolved lang as header so server components can read it
  const res = NextResponse.next({
    request: { headers: new Headers({ ...Object.fromEntries(req.headers), 'x-lang': lang }) },
  })

  // Refresh cookie on every page visit (extends expiry)
  res.cookies.set('pw_lang', lang, {
    path: '/',
    maxAge: 60 * 60 * 24 * 365,
    sameSite: 'lax',
  })

  return res
}

export const config = {
  // Match all routes except static files, images, and Next.js internals
  matcher: ['/((?!_next/static|_next/image|favicon|assets|.*\\.(?:svg|png|jpg|jpeg|webp|ico|css|js)).*)'],
}
