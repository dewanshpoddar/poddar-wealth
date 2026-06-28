import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import type { BrochureEntry } from '@/lib/lic-engine/types'

const BROCHURE_PATH = path.join(process.cwd(), 'lib/data/brochure-status.json')

function readBrochures(): BrochureEntry[] {
  try { return JSON.parse(fs.readFileSync(BROCHURE_PATH, 'utf8')) } catch { return [] }
}

function writeBrochures(entries: BrochureEntry[]): void {
  fs.writeFileSync(BROCHURE_PATH, JSON.stringify(entries, null, 2))
}

function isAdmin(req: NextRequest): boolean {
  const adminSecret = process.env.ADMIN_SECRET
  const header = req.headers.get('x-admin-secret')
  const cookie = req.cookies.get('admin_auth')?.value
  if (cookie === 'true') return true
  if (adminSecret && header === adminSecret) return true
  return false
}

// GET — list all brochure entries with optional filter
export async function GET(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const filter = searchParams.get('filter') // 'retail' | 'pending' | 'approved' | 'missing'

  let entries = readBrochures()

  if (filter === 'retail') {
    entries = entries.filter(e => e.category_type === 'retail_individual')
  } else if (filter === 'pending') {
    entries = entries.filter(e => e.extraction_status === 'pending' && e.category_type === 'retail_individual')
  } else if (filter === 'approved') {
    entries = entries.filter(e => e.extraction_status === 'approved')
  } else if (filter === 'missing') {
    entries = entries.filter(e => e.url_status === 'missing' && e.category_type === 'retail_individual')
  }

  const stats = {
    total_retail: entries.filter(e => e.category_type === 'retail_individual').length,
    url_known: entries.filter(e => e.url_status === 'known').length,
    url_missing: entries.filter(e => e.url_status === 'missing' && e.category_type === 'retail_individual').length,
    pending: entries.filter(e => e.extraction_status === 'pending' && e.category_type === 'retail_individual').length,
    extracted: entries.filter(e => e.extraction_status === 'extracted').length,
    approved: entries.filter(e => e.extraction_status === 'approved').length,
  }

  return NextResponse.json({ stats, entries })
}

// PATCH — update a single entry (add URL, update status, approve)
export async function PATCH(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json() as {
    plan_no: number | null
    plan_name?: string
    brochure_url?: string
    extraction_status?: BrochureEntry['extraction_status']
    fields_extracted?: string[]
    tabular_rates_complete?: boolean
    gsv_factors_complete?: boolean
    bonus_rates_verified?: boolean
    notes?: string
    approve?: boolean
  }

  const entries = readBrochures()
  const idx = entries.findIndex(e =>
    body.plan_no != null
      ? e.plan_no === body.plan_no
      : e.plan_name === body.plan_name
  )

  if (idx === -1) return NextResponse.json({ error: 'Plan not found' }, { status: 404 })

  const entry = entries[idx]

  if (body.brochure_url) {
    entry.brochure_url = body.brochure_url
    entry.url_status = 'known'
    if (entry.extraction_status === 'not_applicable') entry.extraction_status = 'pending'
  }
  if (body.extraction_status) entry.extraction_status = body.extraction_status
  if (body.fields_extracted) entry.fields_extracted = body.fields_extracted
  if (body.tabular_rates_complete !== undefined) entry.tabular_rates_complete = body.tabular_rates_complete
  if (body.gsv_factors_complete !== undefined) entry.gsv_factors_complete = body.gsv_factors_complete
  if (body.bonus_rates_verified !== undefined) entry.bonus_rates_verified = body.bonus_rates_verified
  if (body.notes !== undefined) entry.notes = body.notes

  if (body.approve) {
    entry.extraction_status = 'approved'
    entry.approved_by = 'admin'
    entry.approved_at = new Date().toISOString()
  }

  entries[idx] = entry
  writeBrochures(entries)

  return NextResponse.json({ success: true, entry })
}
