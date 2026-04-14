/**
 * Vercel Cron Job — Fortnightly plan-withdrawal check
 * Runs on the 1st and 15th of each month at 06:00 UTC (11:30 IST)
 *
 * What it does:
 *  1. Pings the brochure/product URL of each active plan on licindia.in
 *  2. If a plan returns 404 / redirects away / times out → flags it as
 *     "possibly withdrawn" in lib/data/plan-flags.json
 *  3. Does NOT auto-withdraw anything — sends alert to Admin Notifications
 *     tab in Google Sheets via ADMIN_SHEETS_WEBHOOK_URL
 *  4. To confirm a withdrawal: just tell Claude in chat → it updates
 *     lic-plans-data.js, rebuilds lic-plans.json, and pushes the change
 *
 * Auth: Vercel sends Authorization: Bearer <CRON_SECRET>
 */

import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { adminNotify } from '@/lib/admin-notify'

// /tmp is the only writable directory in Vercel serverless functions
const FLAGS_PATH = path.join('/tmp', 'plan-flags.json')

// ── Active plans to monitor ─────────────────────────────────────────────────
// aliases: alternative names LIC uses on their listing pages
const ACTIVE_PLANS: Array<{ planNo: number; name: string; aliases?: string[] }> = [
  { planNo: 714, name: 'New Endowment Plan' },
  { planNo: 715, name: 'New Jeevan Anand' },
  { planNo: 717, name: 'Single Premium Endowment' },
  { planNo: 733, name: 'Jeevan Lakshya',            aliases: ['lakshya', 'jeevan lakshya'] },
  { planNo: 736, name: 'Jeevan Labh' },
  { planNo: 760, name: 'Bima Jyoti' },
  { planNo: 880, name: 'Jan Suraksha' },
  { planNo: 881, name: 'Bima Lakshmi' },
  { planNo: 911, name: 'Nav Jeevan Shree' },
  { planNo: 912, name: 'Nav Jeevan Shree' },
  { planNo: 720, name: 'New Money Back 20',          aliases: ['money back plan-20', 'money back 20'] },
  { planNo: 721, name: 'New Money Back 25',          aliases: ['money back plan-25', 'money back 25'] },
  { planNo: 748, name: 'Bima Shree' },
  { planNo: 745, name: 'Jeevan Umang',               aliases: ['umang', 'jeevan umang'] },
  { planNo: 771, name: 'Jeevan Utsav' },
  { planNo: 883, name: 'Jeevan Utsav' },
  { planNo: 732, name: 'Child Money Back Plan',      aliases: ['child money back'] },
  { planNo: 734, name: 'Jeevan Tarun',               aliases: ['tarun', 'jeevan tarun'] },
  { planNo: 774, name: 'Amritbaal' },
  { planNo: 859, name: 'Saral Jeevan Bima' },
  { planNo: 875, name: 'Yuva Term' },
  { planNo: 877, name: 'Yuva Credit Life' },
  { planNo: 887, name: 'Bima Kavach' },
  { planNo: 955, name: 'New Jeevan Amar' },
  { planNo: 758, name: 'New Jeevan Shanti' },
  { planNo: 857, name: 'Jeevan Akshay',              aliases: ['akshay vii', 'jeevan akshay'] },
  { planNo: 862, name: 'Saral Pension' },
  { planNo: 879, name: 'Smart Pension' },
  { planNo: 749, name: 'Nivesh Plus' },
  { planNo: 752, name: 'SIIP' },
  { planNo: 867, name: 'New Pension Plus' },
  { planNo: 873, name: 'Index Plus' },
  { planNo: 886, name: 'Protection Plus' },
  { planNo: 751, name: 'Micro Bachat' },
]

// ── Helpers ─────────────────────────────────────────────────────────────────

function readFlags(): Record<string, PlanFlag> {
  try {
    if (fs.existsSync(FLAGS_PATH)) return JSON.parse(fs.readFileSync(FLAGS_PATH, 'utf8'))
  } catch (_) {}
  return {}
}

function writeFlags(flags: Record<string, PlanFlag>) {
  const dir = path.dirname(FLAGS_PATH)
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
  fs.writeFileSync(FLAGS_PATH, JSON.stringify(flags, null, 2))
}

interface PlanFlag {
  planNo:       number
  name:         string
  status:       'ok' | 'flagged' | 'withdrawn'
  httpStatus:   number | null
  firstFlagged: string | null
  lastChecked:  string
  checkedUrl:   string
  note?:        string
}

/**
 * Fetch LIC's "Individual Plans" listing page once and return the full HTML.
 * Much more reliable than hitting 34 separate plan pages (LIC blocks bots on those).
 * The listing page shows all currently active plans with their plan numbers.
 */
async function fetchLicPlanListing(): Promise<{ html: string; status: number } | null> {
  const URLS = [
    'https://licindia.in/web/guest/individual-plans',
    'https://licindia.in/web/guest/all-plans',
    'https://licindia.in/web/guest/buy-online',
  ]
  for (const url of URLS) {
    try {
      const res = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'text/html,application/xhtml+xml,*/*',
          'Accept-Language': 'en-IN,en;q=0.9',
        },
        signal: AbortSignal.timeout(15000),
        redirect: 'follow',
      })
      if (res.ok) {
        const html = await res.text()
        if (html.length > 5000) return { html, status: res.status }
      }
    } catch (_) {}
  }
  return null
}

function isPlanInListing(
  planNo: number,
  planName: string,
  html: string,
  aliases: string[] = []
): boolean {
  const lower = html.toLowerCase()
  const no    = String(planNo)

  // 1. Plan number appears in the page (most reliable signal)
  if (lower.includes(no)) return true

  // 2. All significant words of the plan name appear in the page
  const nameWords = planName.toLowerCase()
    .replace(/[^a-z0-9 ]/g, ' ')
    .split(' ')
    .filter(w => w.length > 3)
  if (nameWords.length > 0 && nameWords.every(w => lower.includes(w))) return true

  // 3. Any alias matches
  for (const alias of aliases) {
    if (lower.includes(alias.toLowerCase())) return true
  }

  return false
}

async function sendPlanAlerts(flagged: PlanFlag[]) {
  for (const f of flagged) {
    await adminNotify({
      type:     'PLAN_ALERT',
      severity: 'warn',
      route:    '/api/cron/check-plan-status',
      message:  `Plan ${f.planNo} — ${f.name} may have been withdrawn from LIC's website`,
      detail:   `HTTP status: ${f.httpStatus ?? 'timeout'}\nChecked URL: ${f.checkedUrl}\nFirst flagged: ${f.firstFlagged}\nTell Claude: "Mark plan ${f.planNo} ${f.name} as withdrawn"`,
      planNo:   f.planNo,
      planName: f.name,
    })
  }
}

// ── Handler ─────────────────────────────────────────────────────────────────

export async function GET(req: Request) {
  const authHeader = req.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET?.trim()
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const now    = new Date().toISOString()
  const flags  = readFlags()
  const newlyFlagged: PlanFlag[] = []

  // Fetch LIC listing once — check all 34 plans against it
  const listing = await fetchLicPlanListing()

  if (!listing) {
    // Can't reach LIC at all — notify but don't flag individual plans
    await adminNotify({
      type: 'SCRAPE_FAIL', severity: 'warn',
      route: '/api/cron/check-plan-status',
      message: 'Could not reach LIC website for plan status check — all checks skipped',
      detail: 'licindia.in did not respond on any of the listing URLs tried',
    })
    return NextResponse.json({ success: true, checkedAt: now, total: 0, ok: 0, flagged: 0, withdrawn: 0, newlyFlagged: [], note: 'LIC site unreachable — skipped' })
  }

  for (const plan of ACTIVE_PLANS) {
    const key = String(plan.planNo)
    const existing = flags[key]

    // Skip plans already manually confirmed withdrawn
    if (existing?.status === 'withdrawn') continue

    const found = isPlanInListing(plan.planNo, plan.name, listing.html, plan.aliases)

    if (found) {
      flags[key] = {
        planNo:       plan.planNo,
        name:         plan.name,
        status:       'ok',
        httpStatus:   listing.status,
        firstFlagged: null,
        lastChecked:  now,
        checkedUrl:   'lic listing page',
      }
    } else {
      const alreadyFlagged = existing?.status === 'flagged'
      flags[key] = {
        planNo:       plan.planNo,
        name:         plan.name,
        status:       'flagged',
        httpStatus:   listing.status,
        firstFlagged: existing?.firstFlagged ?? now,
        lastChecked:  now,
        checkedUrl:   'lic listing page',
        note:         existing?.note,
      }
      if (!alreadyFlagged) newlyFlagged.push(flags[key])
    }
  }

  writeFlags(flags)

  if (newlyFlagged.length > 0) {
    await sendPlanAlerts(newlyFlagged)
    console.warn('[check-plan-status] Newly flagged plans:', newlyFlagged.map(f => `${f.planNo} ${f.name}`).join(', '))
  }

  const summary = {
    checkedAt:    now,
    total:        ACTIVE_PLANS.length,
    ok:           Object.values(flags).filter(f => f.status === 'ok').length,
    flagged:      Object.values(flags).filter(f => f.status === 'flagged').length,
    withdrawn:    Object.values(flags).filter(f => f.status === 'withdrawn').length,
    newlyFlagged: newlyFlagged.map(f => ({ planNo: f.planNo, name: f.name })),
  }

  return NextResponse.json({ success: true, ...summary })
}
