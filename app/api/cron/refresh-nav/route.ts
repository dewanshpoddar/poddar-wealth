/**
 * Vercel Cron Job — Daily NAV refresh
 * Called automatically by Vercel at 18:30 IST (13:00 UTC) every day
 * This is after LIC publishes updated NAV post market close (~6 PM IST)
 *
 * Vercel cron jobs authenticate with CRON_SECRET env var.
 */

import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { adminNotify } from '@/lib/admin-notify'

const CACHE_PATH = path.join('/tmp', 'nav-cache.json')

const FALLBACK_NAV: Record<string, Record<string, { nav: number; date: string; source?: string }>> = {
  "749": {
    bond:     { nav: 28.45, date: '2026-04-13' },
    secured:  { nav: 32.18, date: '2026-04-13' },
    balanced: { nav: 45.62, date: '2026-04-13' },
    growth:   { nav: 68.94, date: '2026-04-13' },
  },
  "752": {
    bond:     { nav: 24.82, date: '2026-04-13' },
    secured:  { nav: 28.56, date: '2026-04-13' },
    balanced: { nav: 38.74, date: '2026-04-13' },
    growth:   { nav: 54.21, date: '2026-04-13' },
  },
  "867": {
    pension_bond:     { nav: 22.14, date: '2026-04-13' },
    pension_secured:  { nav: 25.88, date: '2026-04-13' },
    pension_balanced: { nav: 34.42, date: '2026-04-13' },
    pension_growth:   { nav: 48.66, date: '2026-04-13' },
  },
  "873": {
    flexi_growth:       { nav: 18.92, date: '2026-04-13' },
    flexi_smart_growth: { nav: 20.14, date: '2026-04-13' },
  },
  "886": {
    bond:               { nav: 15.24, date: '2026-04-13' },
    secured:            { nav: 17.86, date: '2026-04-13' },
    balanced:           { nav: 24.58, date: '2026-04-13' },
    growth:             { nav: 38.42, date: '2026-04-13' },
    flexi_growth:       { nav: 16.74, date: '2026-04-13' },
    flexi_smart_growth: { nav: 18.32, date: '2026-04-13' },
  },
}

async function scrapeNavFromLIC() {
  const NAV_URL = 'https://licindia.in/plan-nav1'
  const today = new Date().toISOString().split('T')[0]

  const res = await fetch(NAV_URL, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      'Accept': 'text/html,application/xhtml+xml',
    },
    signal: AbortSignal.timeout(20000),
  })

  if (!res.ok) throw new Error(`LIC site returned HTTP ${res.status}`)

  const html = await res.text()
  const navData: Record<string, Record<string, { nav: number; date: string }>> = {}

  // Parse HTML table rows — LIC's table: Plan Name | Fund Name | NAV | Date
  const rowRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/gi
  const cellRegex = /<td[^>]*>([\s\S]*?)<\/td>/gi
  let rowMatch

  while ((rowMatch = rowRegex.exec(html)) !== null) {
    const cells: string[] = []
    let cellMatch
    const cellRe = new RegExp(cellRegex.source, 'gi')
    while ((cellMatch = cellRe.exec(rowMatch[1])) !== null) {
      cells.push(cellMatch[1].replace(/<[^>]+>/g, '').trim())
    }
    if (cells.length < 3) continue

    const planNo = detectPlan(cells[0])
    const fundId = detectFund(cells[1])
    const nav = parseFloat(cells[2].replace(/[^\d.]/g, ''))
    const date = parseDate(cells[3] || '') || today

    if (planNo && fundId && nav && !isNaN(nav)) {
      if (!navData[planNo]) navData[planNo] = {}
      navData[planNo][fundId] = { nav, date }
    }
  }

  return navData
}

function detectPlan(text: string): string | null {
  const t = text.toLowerCase()
  if (t.includes('siip') || t.includes('752')) return '752'
  if (t.includes('nivesh') || t.includes('749')) return '749'
  if (t.includes('index plus') || t.includes('873')) return '873'
  if (t.includes('pension plus') || t.includes('867') || t.includes('new pension')) return '867'
  if (t.includes('protection plus') || t.includes('886')) return '886'
  return null
}

function detectFund(text: string): string | null {
  const t = text.toLowerCase()
  if (t.includes('flexi smart')) return 'flexi_smart_growth'
  if (t.includes('flexi')) return 'flexi_growth'
  if (t.includes('pension growth')) return 'pension_growth'
  if (t.includes('pension balanced')) return 'pension_balanced'
  if (t.includes('pension secured')) return 'pension_secured'
  if (t.includes('pension bond')) return 'pension_bond'
  if (t.includes('growth')) return 'growth'
  if (t.includes('balanced')) return 'balanced'
  if (t.includes('secured')) return 'secured'
  if (t.includes('bond')) return 'bond'
  return null
}

function parseDate(str: string): string | null {
  const m = str.match(/(\d{2})[\/\-](\d{2})[\/\-](\d{4})/)
  if (m) return `${m[3]}-${m[2]}-${m[1]}`
  return null
}

export async function GET(req: Request) {
  // Vercel authenticates cron jobs with Authorization: Bearer <CRON_SECRET>
  const authHeader = req.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET?.trim()

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const startedAt = new Date().toISOString()
  let scraped: Record<string, Record<string, { nav: number; date: string }>> = {}
  let source = 'fallback'
  let errorMsg: string | null = null

  try {
    scraped = await scrapeNavFromLIC()
    source = Object.keys(scraped).length > 0 ? 'live' : 'fallback'
  } catch (err) {
    errorMsg = err instanceof Error ? err.message : 'Scrape failed'
    console.error('[cron/refresh-nav] Scrape error:', errorMsg)
    adminNotify({
      type: 'SCRAPE_FAIL', severity: 'warn', route: '/api/cron/refresh-nav',
      message: `NAV scrape from licindia.in failed — serving fallback NAV values`,
      detail: errorMsg,
    }).catch(() => {})
  }

  // Merge scraped data with fallback (scraped wins where available)
  const merged: Record<string, Record<string, { nav: number; date: string; source?: string }>> = {}
  for (const [planNo, funds] of Object.entries(FALLBACK_NAV)) {
    merged[planNo] = { ...funds }
    for (const [fundId, val] of Object.entries(funds)) {
      merged[planNo][fundId] = { ...val, source: 'fallback' }
    }
  }
  for (const [planNo, funds] of Object.entries(scraped)) {
    if (!merged[planNo]) merged[planNo] = {}
    for (const [fundId, val] of Object.entries(funds)) {
      merged[planNo][fundId] = { ...val, source: 'live' }
    }
  }

  const result = { nav: merged, source, scrapedAt: startedAt, error: errorMsg }

  // Write to /tmp cache file (persists within the same Vercel instance lifecycle)
  try {
    fs.writeFileSync(CACHE_PATH, JSON.stringify(result, null, 2))
  } catch (writeErr) {
    console.error('[cron/refresh-nav] Cache write failed:', writeErr)
  }

  return NextResponse.json({
    success: true,
    source,
    scrapedAt: startedAt,
    plansUpdated: Object.keys(scraped),
    error: errorMsg,
  })
}
