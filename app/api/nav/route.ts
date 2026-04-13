/**
 * /api/nav — LIC ULIP NAV endpoint
 *
 * GET /api/nav              → returns all ULIP NAV values (cached, refreshes if stale)
 * GET /api/nav?plan=752     → returns NAV for a specific plan
 * POST /api/nav/refresh     → force refresh from licindia.in (admin use)
 *
 * Cache TTL: 8 hours (NAV updates once daily after market close)
 */

import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const CACHE_PATH = path.join(process.cwd(), 'lib/data/nav-cache.json')

// Fallback NAV — used when cache is missing and scraper fails
const FALLBACK_NAV: Record<string, Record<string, { nav: number; date: string }>> = {
  "749": {
    bond:     { nav: 28.45, date: '2026-04-11' },
    secured:  { nav: 32.18, date: '2026-04-11' },
    balanced: { nav: 45.62, date: '2026-04-11' },
    growth:   { nav: 68.94, date: '2026-04-11' },
  },
  "752": {
    bond:     { nav: 24.82, date: '2026-04-11' },
    secured:  { nav: 28.56, date: '2026-04-11' },
    balanced: { nav: 38.74, date: '2026-04-11' },
    growth:   { nav: 54.21, date: '2026-04-11' },
  },
  "867": {
    pension_bond:     { nav: 22.14, date: '2026-04-11' },
    pension_secured:  { nav: 25.88, date: '2026-04-11' },
    pension_balanced: { nav: 34.42, date: '2026-04-11' },
    pension_growth:   { nav: 48.66, date: '2026-04-11' },
  },
  "873": {
    flexi_growth:       { nav: 18.92, date: '2026-04-11' },
    flexi_smart_growth: { nav: 20.14, date: '2026-04-11' },
  },
  "886": {
    bond:               { nav: 15.24, date: '2026-04-11' },
    secured:            { nav: 17.86, date: '2026-04-11' },
    balanced:           { nav: 24.58, date: '2026-04-11' },
    growth:             { nav: 38.42, date: '2026-04-11' },
    flexi_growth:       { nav: 16.74, date: '2026-04-11' },
    flexi_smart_growth: { nav: 18.32, date: '2026-04-11' },
  },
}

function readCache() {
  try {
    if (fs.existsSync(CACHE_PATH)) {
      return JSON.parse(fs.readFileSync(CACHE_PATH, 'utf8'))
    }
  } catch (_) {}
  return null
}

function isCacheStale(cache: { scrapedAt?: string }): boolean {
  if (!cache?.scrapedAt) return true
  const age = Date.now() - new Date(cache.scrapedAt).getTime()
  return age > 8 * 60 * 60 * 1000 // 8 hours
}

async function triggerBackgroundRefresh() {
  // Fire-and-forget: refresh the cache without blocking the response
  try {
    const { refreshNavCache } = await import('@/scripts/nav-scraper')
    refreshNavCache().catch(console.error)
  } catch (_) {
    // scraper unavailable in edge runtime — skip
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const planFilter = searchParams.get('plan')

  let cache = readCache()

  // If cache is stale, trigger background refresh and serve stale data
  if (!cache || isCacheStale(cache)) {
    triggerBackgroundRefresh()
  }

  const navData = cache?.nav ?? FALLBACK_NAV
  const source  = cache?.source ?? 'fallback'
  const scrapedAt = cache?.scrapedAt ?? null

  // Convert numeric keys to string for consistent client access
  const normalized: Record<string, Record<string, { nav: number; date: string }>> = {}
  for (const [key, funds] of Object.entries(navData)) {
    normalized[String(key)] = funds as Record<string, { nav: number; date: string }>
  }

  let result = normalized

  if (planFilter) {
    const planData = normalized[planFilter]
    if (!planData) {
      return NextResponse.json({ success: false, error: `No NAV data for plan ${planFilter}` }, { status: 404 })
    }
    result = { [planFilter]: planData }
  }

  return NextResponse.json(
    { success: true, nav: result, source, scrapedAt, note: 'NAV updates daily after market close (~6–7 PM IST)' },
    { headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=3600' } }
  )
}

// POST /api/nav — force refresh (requires auth header)
export async function POST(req: Request) {
  const secret = req.headers.get('x-nav-secret')
  const expectedSecret = process.env.SYNC_SECRET || 'dev_secret_123'

  if (secret !== expectedSecret) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { refreshNavCache } = await import('@/scripts/nav-scraper')
    const result = await refreshNavCache()
    return NextResponse.json({
      success: true,
      source: result.source,
      scrapedAt: result.scrapedAt,
      plans: Object.keys(result.nav),
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}
