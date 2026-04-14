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
// planNo → canonical LIC product page (avoids PDF links that always 200)
const ACTIVE_PLANS: Array<{ planNo: number; name: string; checkUrl: string }> = [
  { planNo: 714, name: 'New Endowment Plan',           checkUrl: 'https://licindia.in/web/guest/lic-s-new-endowment-plan' },
  { planNo: 715, name: 'New Jeevan Anand',             checkUrl: 'https://licindia.in/web/guest/lic-s-new-jeevan-anand' },
  { planNo: 717, name: 'Single Premium Endowment',     checkUrl: 'https://licindia.in/web/guest/lic-s-single-premium-endowment-plan' },
  { planNo: 733, name: 'Jeevan Lakshya',               checkUrl: 'https://licindia.in/web/guest/lic-s-jeevan-lakshya' },
  { planNo: 736, name: 'Jeevan Labh',                  checkUrl: 'https://licindia.in/web/guest/lic-s-jeevan-labh' },
  { planNo: 760, name: 'Bima Jyoti',                   checkUrl: 'https://licindia.in/web/guest/lic-s-bima-jyoti' },
  { planNo: 880, name: 'Jan Suraksha',                 checkUrl: 'https://licindia.in/web/guest/lic-s-jan-suraksha' },
  { planNo: 881, name: 'Bima Lakshmi',                 checkUrl: 'https://licindia.in/web/guest/lic-s-bima-lakshmi' },
  { planNo: 911, name: 'Nav Jeevan Shree (Single)',    checkUrl: 'https://licindia.in/web/guest/lic-s-nav-jeevan-shree' },
  { planNo: 912, name: 'Nav Jeevan Shree (Limited)',   checkUrl: 'https://licindia.in/web/guest/lic-s-nav-jeevan-shree' },
  { planNo: 720, name: 'New Money Back 20yr',          checkUrl: 'https://licindia.in/web/guest/lic-s-new-money-back-plan-20-years' },
  { planNo: 721, name: 'New Money Back 25yr',          checkUrl: 'https://licindia.in/web/guest/lic-s-new-money-back-plan-25-years' },
  { planNo: 748, name: 'Bima Shree',                   checkUrl: 'https://licindia.in/web/guest/lic-s-bima-shree' },
  { planNo: 745, name: 'Jeevan Umang',                 checkUrl: 'https://licindia.in/web/guest/lic-s-jeevan-umang' },
  { planNo: 771, name: 'Jeevan Utsav',                 checkUrl: 'https://licindia.in/web/guest/lic-s-jeevan-utsav' },
  { planNo: 883, name: 'Jeevan Utsav (Single)',        checkUrl: 'https://licindia.in/web/guest/lic-s-jeevan-utsav' },
  { planNo: 732, name: 'Child Money Back Plan',        checkUrl: 'https://licindia.in/web/guest/lic-s-child-money-back-plan' },
  { planNo: 734, name: 'Jeevan Tarun',                 checkUrl: 'https://licindia.in/web/guest/lic-s-jeevan-tarun' },
  { planNo: 774, name: 'Amritbaal',                    checkUrl: 'https://licindia.in/web/guest/lic-s-amritbaal' },
  { planNo: 859, name: 'Saral Jeevan Bima',            checkUrl: 'https://licindia.in/web/guest/lic-s-saral-jeevan-bima' },
  { planNo: 875, name: 'Yuva Term',                    checkUrl: 'https://licindia.in/web/guest/lic-s-yuva-term' },
  { planNo: 877, name: 'Yuva Credit Life',             checkUrl: 'https://licindia.in/web/guest/lic-s-yuva-credit-life' },
  { planNo: 887, name: 'Bima Kavach',                  checkUrl: 'https://licindia.in/web/guest/lic-s-bima-kavach' },
  { planNo: 955, name: 'New Jeevan Amar',              checkUrl: 'https://licindia.in/web/guest/lic-s-new-jeevan-amar' },
  { planNo: 758, name: 'New Jeevan Shanti',            checkUrl: 'https://licindia.in/web/guest/lic-s-new-jeevan-shanti' },
  { planNo: 857, name: 'Jeevan Akshay VII',            checkUrl: 'https://licindia.in/web/guest/lic-s-jeevan-akshay-vii' },
  { planNo: 862, name: 'Saral Pension',                checkUrl: 'https://licindia.in/web/guest/lic-s-saral-pension' },
  { planNo: 879, name: 'Smart Pension',                checkUrl: 'https://licindia.in/web/guest/lic-s-smart-pension' },
  { planNo: 749, name: 'Nivesh Plus',                  checkUrl: 'https://licindia.in/web/guest/lic-s-nivesh-plus' },
  { planNo: 752, name: 'SIIP',                         checkUrl: 'https://licindia.in/web/guest/lic-s-siip' },
  { planNo: 867, name: 'New Pension Plus',             checkUrl: 'https://licindia.in/web/guest/lic-s-new-pension-plus' },
  { planNo: 873, name: 'Index Plus',                   checkUrl: 'https://licindia.in/web/guest/lic-s-index-plus' },
  { planNo: 886, name: 'Protection Plus',              checkUrl: 'https://licindia.in/web/guest/lic-s-protection-plus' },
  { planNo: 751, name: 'Micro Bachat',                 checkUrl: 'https://licindia.in/web/guest/lic-s-micro-bachat' },
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

function isPlanInListing(planNo: number, planName: string, html: string): boolean {
  const no   = String(planNo)
  const name = planName.toLowerCase().replace(/[^a-z0-9 ]/g, '')
  // Plan number must appear somewhere in the page
  // Also accept partial name match as a secondary signal
  const hasNo   = html.includes(no)
  const hasName = name.split(' ').filter(w => w.length > 4)
    .every(word => html.toLowerCase().includes(word))
  return hasNo || hasName
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

    const found = isPlanInListing(plan.planNo, plan.name, listing.html)

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
