import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const LEADS_PATH = path.join(process.cwd(), 'lib/data/leads-cache.json')

export interface Lead {
  id: string
  name: string
  phone: string
  email?: string
  source: string
  pageUrl?: string
  intent?: string
  status: 'new' | 'contacted' | 'meeting' | 'converted' | 'lost'
  notes?: string
  referralCode?: string
  createdAt: string
  updatedAt: string
}

function auth(req: NextRequest) {
  const secret = process.env.ADMIN_SECRET
  if (!secret) return false
  return req.headers.get('x-admin-secret') === secret
}

function readLeads(): Lead[] {
  try { return JSON.parse(fs.readFileSync(LEADS_PATH, 'utf8')) } catch { return [] }
}
function writeLeads(leads: Lead[]) {
  fs.writeFileSync(LEADS_PATH, JSON.stringify(leads, null, 2))
}

// GET — list all leads, with optional ?status= filter
export async function GET(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const statusFilter = searchParams.get('status')

  let leads = readLeads()
  if (statusFilter) leads = leads.filter(l => l.status === statusFilter)

  leads.sort((a, b) => b.createdAt.localeCompare(a.createdAt))

  const summary = {
    total: leads.length,
    new: leads.filter(l => l.status === 'new').length,
    contacted: leads.filter(l => l.status === 'contacted').length,
    meeting: leads.filter(l => l.status === 'meeting').length,
    converted: leads.filter(l => l.status === 'converted').length,
    lost: leads.filter(l => l.status === 'lost').length,
  }

  return NextResponse.json({ success: true, summary, leads })
}

// PATCH — update lead status + notes
export async function PATCH(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json().catch(() => null)
  if (!body?.id) return NextResponse.json({ error: 'id required' }, { status: 400 })

  const validStatuses = ['new', 'contacted', 'meeting', 'converted', 'lost']
  if (body.status && !validStatuses.includes(body.status)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
  }

  const leads = readLeads()
  const idx = leads.findIndex(l => l.id === body.id)
  if (idx === -1) return NextResponse.json({ error: 'Lead not found' }, { status: 404 })

  if (body.status) leads[idx].status = body.status
  if (body.notes !== undefined) leads[idx].notes = body.notes
  leads[idx].updatedAt = new Date().toISOString()

  writeLeads(leads)
  return NextResponse.json({ success: true, lead: leads[idx] })
}

// POST — add a lead manually (or from a sync)
export async function POST(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json().catch(() => null)
  if (!body?.name || !body?.phone) {
    return NextResponse.json({ error: 'name and phone required' }, { status: 400 })
  }

  const leads = readLeads()
  const newLead: Lead = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    name: body.name,
    phone: body.phone,
    email: body.email,
    source: body.source ?? 'manual',
    pageUrl: body.pageUrl,
    intent: body.intent,
    status: 'new',
    notes: body.notes,
    referralCode: body.referralCode,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  leads.unshift(newLead)
  writeLeads(leads)

  return NextResponse.json({ success: true, lead: newLead }, { status: 201 })
}
