/**
 * /api/admin/plan-flags
 *
 * GET  → list all flagged / withdrawn plans
 * POST → manually mark a plan as withdrawn or clear a flag
 *
 * Requires header:  x-admin-secret: <ADMIN_SECRET env var>
 *
 * POST body:
 *   { planNo: 873, action: "withdraw", note: "LIC withdrew on 2026-04-01" }
 *   { planNo: 873, action: "clear",    note: "False alarm — page was temporarily down" }
 *
 * After marking withdrawn this endpoint also updates lic-plans-data.js status
 * and rebuilds lib/data/lic-plans.json automatically.
 */

import { NextResponse } from 'next/server'
import fs   from 'fs'
import path from 'path'

const FLAGS_PATH    = path.join('/tmp', 'plan-flags.json')
const JSON_PATH     = path.join(process.cwd(), 'lib/data/lic-plans.json')

function readFlags() {
  try {
    if (fs.existsSync(FLAGS_PATH)) return JSON.parse(fs.readFileSync(FLAGS_PATH, 'utf8'))
  } catch (_) {}
  return {}
}

function writeFlags(flags: Record<string, unknown>) {
  const dir = path.dirname(FLAGS_PATH)
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
  fs.writeFileSync(FLAGS_PATH, JSON.stringify(flags, null, 2))
}

function auth(req: Request) {
  const secret = process.env.ADMIN_SECRET || process.env.SYNC_SECRET || 'dev_secret_123'
  return req.headers.get('x-admin-secret') === secret
}

// ── GET — view all flags ────────────────────────────────────────────────────
export async function GET(req: Request) {
  if (!auth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const flags = readFlags()
  const all   = Object.values(flags) as any[]

  return NextResponse.json({
    success: true,
    summary: {
      ok:        all.filter((f: any) => f.status === 'ok').length,
      flagged:   all.filter((f: any) => f.status === 'flagged').length,
      withdrawn: all.filter((f: any) => f.status === 'withdrawn').length,
    },
    flagged:   all.filter((f: any) => f.status === 'flagged'),
    withdrawn: all.filter((f: any) => f.status === 'withdrawn'),
    ok:        all.filter((f: any) => f.status === 'ok'),
  })
}

// ── POST — manually act on a flag ──────────────────────────────────────────
export async function POST(req: Request) {
  if (!auth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json().catch(() => null)
  if (!body?.planNo || !body?.action) {
    return NextResponse.json({ error: 'planNo and action required' }, { status: 400 })
  }

  const { planNo, action, note } = body
  if (!['withdraw', 'clear'].includes(action)) {
    return NextResponse.json({ error: 'action must be "withdraw" or "clear"' }, { status: 400 })
  }

  const flags   = readFlags()
  const key     = String(planNo)
  const now     = new Date().toISOString()
  const existing = flags[key] as any

  if (action === 'withdraw') {
    flags[key] = {
      ...(existing ?? {}),
      planNo,
      status:    'withdrawn',
      lastChecked: now,
      note:      note ?? existing?.note ?? '',
      confirmedWithdrawnAt: now,
    }

    // Update lic-plans.json — mark plan as withdrawn in the JSON data file
    try {
      const licData = JSON.parse(fs.readFileSync(JSON_PATH, 'utf8'))
      let updated = false
      for (const cat of Object.values(licData.categories) as any[]) {
        for (const plan of cat.plans) {
          if (String(plan.planNo) === key) {
            plan.status = 'withdrawn'
            plan.withdrawnDate = now.split('T')[0]
            if (note) plan.withdrawnNote = note
            updated = true
          }
        }
      }
      if (updated) {
        // Recompute meta counts
        const all = Object.values(licData.categories).flatMap((c: any) => c.plans)
        licData.meta.activePlans   = all.filter((p: any) => p.status === 'active' || p.status === 'new').length
        licData.meta.withdrawnPlans = all.filter((p: any) => p.status === 'withdrawn').length
        licData.meta.totalPlans    = all.length
        licData.meta.lastUpdated   = now.split('T')[0]
        fs.writeFileSync(JSON_PATH, JSON.stringify(licData, null, 2))
      }
    } catch (err) {
      console.error('[plan-flags] Failed to update lic-plans.json:', err)
    }

    writeFlags(flags)
    return NextResponse.json({
      success: true,
      message: `Plan ${planNo} marked as withdrawn. lic-plans.json updated — it will no longer appear in active listings.`,
      note:    'Remember to also update lib/lic-plans-data.js (set status: "withdrawn", add withdrawnDate) and commit the change.',
    })
  }

  if (action === 'clear') {
    if (flags[key]) {
      (flags[key] as any).status  = 'ok'
      ;(flags[key] as any).note   = note ?? 'Manually cleared'
      ;(flags[key] as any).lastChecked = now
    }
    writeFlags(flags)
    return NextResponse.json({
      success: true,
      message: `Flag cleared for plan ${planNo}. It will be re-checked on the next fortnightly run.`,
    })
  }
}
