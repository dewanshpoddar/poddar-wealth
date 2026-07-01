import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function getSupabase() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
}

function isAdmin(req: NextRequest): boolean {
  const secret = process.env.ADMIN_SECRET
  const header = req.headers.get('x-admin-secret')
  const cookie = req.cookies.get('admin_auth')?.value
  return cookie === 'true' || (!!secret && header === secret)
}

// POST — approve an extracted brochure: flip status + audit log
export async function POST(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json() as { plan_id?: number }
  const { plan_id } = body
  if (!plan_id) return NextResponse.json({ error: 'plan_id required' }, { status: 400 })

  const sb = getSupabase()

  const { data: row, error: fetchErr } = await sb
    .from('lic_brochures')
    .select('id, plan_id, plan_no, status')
    .eq('id', plan_id)
    .single()

  if (fetchErr || !row) return NextResponse.json({ error: 'Brochure not found' }, { status: 404 })
  if (row.status !== 'extracted') {
    return NextResponse.json({ error: `Cannot approve — status is '${row.status}', expected 'extracted'` }, { status: 422 })
  }

  const now = new Date().toISOString()

  const { error: updateErr } = await sb
    .from('lic_brochures')
    .update({ status: 'approved', approved_at: now })
    .eq('id', plan_id)

  if (updateErr) return NextResponse.json({ error: updateErr.message }, { status: 500 })

  // Audit log
  await sb.from('admin_audit_log').insert({
    action: 'BROCHURE_APPROVED',
    table_name: 'lic_brochures',
    record_id: String(plan_id),
    notes: JSON.stringify({ plan_no: row.plan_no, approved_at: now }),
  })

  return NextResponse.json({ success: true, plan_id, approved_at: now })
}
