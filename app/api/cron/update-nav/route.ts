import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { checkAndFireAlerts } from '@/lib/nav-alerts'

const HISTORY_PATH = path.join(process.cwd(), 'lib/data/nav-history.json')
const MAX_HISTORY = 365

// LIC ULIP fund codes and their names
const FUND_CODES = ['LFGF', 'LFBF', 'LFSF', 'LFMF', 'LFBP', 'LFGP', 'LFRI', 'LFSP', 'LFGS', 'LFEQ']

function readHistory(): Record<string, Array<{ date: string; nav: number; change?: number }>> {
  try { return JSON.parse(fs.readFileSync(HISTORY_PATH, 'utf8')) } catch { return {} }
}

function writeHistory(h: Record<string, Array<{ date: string; nav: number; change?: number }>>) {
  fs.writeFileSync(HISTORY_PATH, JSON.stringify(h, null, 2))
}

async function fetchNavFromLIC(): Promise<Record<string, number> | null> {
  try {
    // LIC publishes NAV at this public URL for ULIP funds
    const res = await fetch(
      'https://www.licindia.in/Products/Investment-Plans/Linked-Products/Nav-Rates',
      { headers: { 'User-Agent': 'Mozilla/5.0' }, signal: AbortSignal.timeout(10000) },
    )
    if (!res.ok) return null
    const html = await res.text()

    // Parse fund code → NAV from the HTML table
    const navMap: Record<string, number> = {}
    const rows = html.matchAll(/LF(GF|BF|SF|MF|BP|GP|RI|SP|GS|EQ)[^\d]*(\d+\.\d+)/g)
    for (const [, code, nav] of rows) {
      navMap[`LF${code}`] = parseFloat(nav)
    }
    return Object.keys(navMap).length > 0 ? navMap : null
  } catch {
    return null
  }
}

export async function GET(req: NextRequest) {
  // Verify CRON_SECRET
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const today = new Date().toISOString().split('T')[0]
  const history = readHistory()
  const results: Record<string, string> = {}

  const navData = await fetchNavFromLIC()

  for (const fund of FUND_CODES) {
    if (!history[fund]) history[fund] = []

    const latest = navData?.[fund]
    if (!latest) {
      results[fund] = 'scrape_failed'
      continue
    }

    // Skip if already have today's data
    if (history[fund][0]?.date === today) {
      results[fund] = 'already_current'
      continue
    }

    const prev = history[fund][0]?.nav
    const entry = {
      date: today,
      nav: latest,
      change: prev != null ? +(latest - prev).toFixed(4) : 0,
    }

    history[fund].unshift(entry)
    history[fund] = history[fund].slice(0, MAX_HISTORY)

    await checkAndFireAlerts(fund, latest)
    results[fund] = `updated_${latest}`
  }

  writeHistory(history)

  return NextResponse.json({ success: true, date: today, results })
}
