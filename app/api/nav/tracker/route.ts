import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const HISTORY_PATH = path.join(process.cwd(), 'lib/data/nav-history.json')

const FUND_NAMES: Record<string, string> = {
  LFGF: 'Growth Fund',
  LFBF: 'Bond Fund',
  LFSF: 'Secured Fund',
  LFMF: 'Money Market Fund',
  LFBP: 'Balanced Plus Fund',
  LFGP: 'Growth Plus Fund',
  LFRI: 'RISE Fund',
  LFSP: 'Short Term Debt Fund',
  LFGS: 'G-Sec Fund',
  LFEQ: 'Equity Fund',
}

function readHistory(): Record<string, Array<{ date: string; nav: number; change?: number }>> {
  try { return JSON.parse(fs.readFileSync(HISTORY_PATH, 'utf8')) } catch { return {} }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const fund = searchParams.get('fund')?.toUpperCase()
  const period = searchParams.get('period') ?? '30d'

  const days = period === '7d' ? 7 : period === '90d' ? 90 : period === '365d' ? 365 : 30

  const history = readHistory()

  if (fund) {
    if (!FUND_NAMES[fund]) {
      return NextResponse.json({ error: 'Unknown fund code' }, { status: 400 })
    }
    const entries = (history[fund] ?? []).slice(0, days)
    const current = entries[0]
    const prev1d = entries[1]
    const prev7d = entries[6]
    const prev30d = entries[29]

    return NextResponse.json(
      {
        fund,
        name: FUND_NAMES[fund],
        currentNav: current?.nav ?? null,
        currentDate: current?.date ?? null,
        change1d: current && prev1d ? +(current.nav - prev1d.nav).toFixed(4) : null,
        change7d: current && prev7d ? +(current.nav - prev7d.nav).toFixed(4) : null,
        change30d: current && prev30d ? +(current.nav - prev30d.nav).toFixed(4) : null,
        history: entries,
      },
      { headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200' } },
    )
  }

  // Return summary for all funds
  const summary = Object.entries(FUND_NAMES).map(([code, name]) => {
    const entries = history[code] ?? []
    const current = entries[0]
    const prev = entries[1]
    return {
      fund: code,
      name,
      currentNav: current?.nav ?? null,
      currentDate: current?.date ?? null,
      change1d: current && prev ? +(current.nav - prev.nav).toFixed(4) : null,
    }
  })

  return NextResponse.json(
    { funds: summary, asOf: new Date().toISOString() },
    { headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200' } },
  )
}
