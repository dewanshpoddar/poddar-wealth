/**
 * Vercel Cron Job — Fortnightly plan-withdrawal check
 * Runs on the 1st and 15th of each month at 06:00 UTC (11:30 IST)
 *
 * What it does:
 *  1. Pings the brochure/product URL of each active plan on licindia.in
 *  2. If a plan returns 404 / redirects away / times out → flags it as
 *     "possibly withdrawn" in lib/data/plan-flags.json
 *  3. Does NOT auto-withdraw anything — that requires manual confirmation
 *     via POST /api/admin/plan-flags  (set status: "withdrawn")
 *  4. Sends a webhook notification if NOTIFY_WEBHOOK_URL env var is set
 *     (supports any URL that accepts a POST with JSON body — Slack, Discord,
 *      Make, n8n, custom endpoint, etc.)
 *
 * Auth: Vercel sends Authorization: Bearer <CRON_SECRET>
 */

import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const FLAGS_PATH = path.join(process.cwd(), 'lib/data/plan-flags.json')

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

async function checkUrl(url: string): Promise<{ ok: boolean; status: number | null }> {
  try {
    const res = await fetch(url, {
      method: 'GET',
      redirect: 'follow',
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; PoddarWealthMonitor/1.0)' },
      signal: AbortSignal.timeout(12000),
    })
    // LIC returns 200 even for removed pages sometimes, but body contains "Page Not Found"
    if (!res.ok) return { ok: false, status: res.status }
    const body = await res.text()
    const notFound = /page not found|this page (has been|is no longer)|plan.*withdrawn|no longer available/i.test(body)
    return { ok: !notFound, status: res.status }
  } catch (_) {
    return { ok: false, status: null }
  }
}

async function sendWebhookNotification(flagged: PlanFlag[]) {
  const webhookUrl = process.env.NOTIFY_WEBHOOK_URL
  if (!webhookUrl || flagged.length === 0) return

  const lines = flagged.map(f =>
    `• Plan ${f.planNo} — ${f.name} (HTTP ${f.httpStatus ?? 'timeout'}) | ${f.checkedUrl}`
  ).join('\n')

  const body = {
    text: `⚠️ *Poddar Wealth — Plan Status Alert*\n\n${flagged.length} plan(s) may have been withdrawn from LIC's website and need your review:\n\n${lines}\n\nReview & confirm at: https://poddarwealth.com/api/admin/plan-flags`,
    // Slack/Discord compatible
    embeds: [{
      title: 'LIC Plan Withdrawal Alert',
      description: lines,
      color: 0xf59e0b,
    }],
  }

  try {
    await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(8000),
    })
  } catch (err) {
    console.error('[check-plan-status] Webhook failed:', err)
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

  for (const plan of ACTIVE_PLANS) {
    const key = String(plan.planNo)
    const existing = flags[key]

    // Skip plans already manually confirmed withdrawn — don't re-check
    if (existing?.status === 'withdrawn') continue

    const { ok, status } = await checkUrl(plan.checkUrl)

    if (ok) {
      // Plan is live — update last checked, clear any prior flag
      flags[key] = {
        planNo:       plan.planNo,
        name:         plan.name,
        status:       'ok',
        httpStatus:   status,
        firstFlagged: null,
        lastChecked:  now,
        checkedUrl:   plan.checkUrl,
      }
    } else {
      const alreadyFlagged = existing?.status === 'flagged'
      flags[key] = {
        planNo:       plan.planNo,
        name:         plan.name,
        status:       'flagged',
        httpStatus:   status,
        firstFlagged: existing?.firstFlagged ?? now,
        lastChecked:  now,
        checkedUrl:   plan.checkUrl,
        note:         existing?.note,
      }
      if (!alreadyFlagged) newlyFlagged.push(flags[key])
    }
  }

  writeFlags(flags)

  if (newlyFlagged.length > 0) {
    await sendWebhookNotification(newlyFlagged)
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
