import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import type { DataChange } from '@/lib/lic-engine/types'

const STAGING_PATH = path.join(process.cwd(), 'lib/data/lic-kb-staging.json')
const LOG_PATH = path.join(process.cwd(), 'lib/data/lic-update-log.json')
const LIVE_PATH = path.join(process.cwd(), 'lib/data/lic-kb-live.json')

function readStaging(): DataChange[] {
  try { return JSON.parse(fs.readFileSync(STAGING_PATH, 'utf8')) } catch { return [] }
}
function readLog(): DataChange[] {
  try { return JSON.parse(fs.readFileSync(LOG_PATH, 'utf8')) } catch { return [] }
}
function writeStaging(changes: DataChange[]): void {
  fs.writeFileSync(STAGING_PATH, JSON.stringify(changes, null, 2))
}
function writeLog(log: DataChange[]): void {
  fs.writeFileSync(LOG_PATH, JSON.stringify(log, null, 2))
}

function isAdmin(req: NextRequest): boolean {
  const adminSecret = process.env.ADMIN_SECRET
  const header = req.headers.get('x-admin-secret')
  const cookie = req.cookies.get('admin_auth')?.value
  if (cookie === 'true') return true
  if (adminSecret && header === adminSecret) return true
  return false
}

// GET — list pending changes + recent log
export async function GET(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const pending = readStaging().filter(c => c.status === 'pending')
  const log = readLog().slice(-50).reverse() // last 50, newest first

  return NextResponse.json({
    pending_count: pending.length,
    pending,
    recent_log: log,
  })
}

// POST — approve or reject a change
export async function POST(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id, action, notes } = await req.json() as {
    id: string
    action: 'approve' | 'reject'
    notes?: string
  }

  if (!id || !['approve', 'reject'].includes(action)) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  const staging = readStaging()
  const idx = staging.findIndex(c => c.id === id)
  if (idx === -1) return NextResponse.json({ error: 'Change not found' }, { status: 404 })

  const change = staging[idx]
  change.status = action === 'approve' ? 'approved' : 'rejected'
  change.reviewed_by = 'admin'
  change.reviewed_at = new Date().toISOString()
  if (notes) change.notes = notes

  // If approved, apply to live knowledge base
  if (action === 'approve') {
    try {
      const live = JSON.parse(fs.readFileSync(LIVE_PATH, 'utf8'))
      const plans: Record<string, unknown>[] = Array.isArray(live) ? live : (live.plans ?? [])

      const planIdx = plans.findIndex(p => {
        const pno = p['Plan No']
        return pno != null && Math.round(parseFloat(String(pno))) === change.plan_no
      })

      if (planIdx !== -1 && change.field && change.new_value !== undefined) {
        plans[planIdx][change.field] = change.new_value
        fs.writeFileSync(LIVE_PATH, JSON.stringify(plans, null, 2))
      }
    } catch (err) {
      console.error('[data-updates] Failed to apply change to live KB:', err)
      return NextResponse.json({ error: 'Change approved but failed to apply to live KB' }, { status: 500 })
    }
  }

  // Move from staging to log
  staging.splice(idx, 1)
  writeStaging(staging)
  const log = readLog()
  log.push(change)
  writeLog(log)

  return NextResponse.json({ success: true, change })
}

// PUT — add a new change to staging (used by scraper cron)
export async function PUT(req: NextRequest) {
  const cronSecret = process.env.CRON_SECRET?.trim()
  const authHeader = req.headers.get('authorization')
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const change = await req.json() as Omit<DataChange, 'id' | 'detected_at' | 'status'>
  const newChange: DataChange = {
    ...change,
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    detected_at: new Date().toISOString(),
    status: 'pending',
  }

  const staging = readStaging()
  // Deduplicate: skip if same plan+field already pending
  const dup = staging.find(c =>
    c.plan_no === newChange.plan_no &&
    c.field === newChange.field &&
    c.type === newChange.type &&
    c.status === 'pending'
  )
  if (dup) return NextResponse.json({ skipped: true, reason: 'Duplicate pending change' })

  staging.push(newChange)
  writeStaging(staging)

  return NextResponse.json({ success: true, id: newChange.id })
}
