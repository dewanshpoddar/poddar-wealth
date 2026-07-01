import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { parseBrochurePdf } from '@/lib/brochure-parser'

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!
  return createClient(url, key)
}

function isAdmin(req: NextRequest): boolean {
  const secret = process.env.ADMIN_SECRET
  const header = req.headers.get('x-admin-secret')
  const cookie = req.cookies.get('admin_auth')?.value
  return cookie === 'true' || (!!secret && header === secret)
}

// GET — list lic_brochures from Supabase for the admin UI
export async function GET(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const sb = getSupabase()
  const { data, error } = await sb
    .from('lic_brochures')
    .select('id, plan_id, plan_no, brochure_url, status, extracted_at, approved_at, lic_plans(name, category)')
    .order('plan_no', { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ brochures: data ?? [] })
}

// POST — download PDF, parse rates, upsert into lic_premium_rates
export async function POST(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json() as { plan_id?: number; brochure_url?: string }
  const { plan_id, brochure_url } = body

  if (!plan_id || !brochure_url) {
    return NextResponse.json({ error: 'plan_id and brochure_url required' }, { status: 400 })
  }

  const sb = getSupabase()

  // Mark in_progress
  await sb.from('lic_brochures').update({ status: 'in_progress' }).eq('id', plan_id)

  let parsed
  try {
    parsed = await parseBrochurePdf(brochure_url)
  } catch (err) {
    await sb.from('lic_brochures').update({ status: 'pending' }).eq('id', plan_id)
    return NextResponse.json({ error: `PDF parse failed: ${err instanceof Error ? err.message : String(err)}` }, { status: 422 })
  }

  // Fetch plan_id from lic_plans using the brochure's plan_id (which is actually lic_brochures.id)
  // First get the plan_id FK on this brochure row
  const { data: brochureRow, error: brErr } = await sb
    .from('lic_brochures')
    .select('plan_id, plan_no')
    .eq('id', plan_id)
    .single()

  if (brErr || !brochureRow) {
    return NextResponse.json({ error: 'Brochure row not found' }, { status: 404 })
  }

  // Upsert premium rates into lic_premium_rates
  const rateRows: { plan_id: number; age: number; term: number; rate_per_1000: number; source: string }[] = []
  for (const [ageStr, terms] of Object.entries(parsed.rates)) {
    for (const [termStr, rate] of Object.entries(terms)) {
      rateRows.push({
        plan_id: brochureRow.plan_id,
        age:     parseInt(ageStr),
        term:    parseInt(termStr),
        rate_per_1000: rate,
        source:  parsed.source === 'llm' ? 'brochure_llm' : 'brochure',
      })
    }
  }

  if (rateRows.length > 0) {
    const { error: rateErr } = await sb
      .from('lic_premium_rates')
      .upsert(rateRows, { onConflict: 'plan_id,age,term' })
    if (rateErr) console.error('[brochures/extract] rate upsert error:', rateErr.message)
  }

  // Upsert GSV factors into lic_gsv_factors (term-aware)
  const gsvRows: { plan_id: number; plan_no: number; policy_year: number; term: number; gsv_pct: number; source: string }[] = []
  const src = parsed.source === 'llm' ? 'brochure_llm' : 'brochure'
  for (const [termStr, yearMap] of Object.entries(parsed.gsvByTerm)) {
    for (const [yearStr, pct] of Object.entries(yearMap)) {
      gsvRows.push({ plan_id: brochureRow.plan_id, plan_no: brochureRow.plan_no, policy_year: parseInt(yearStr), term: parseInt(termStr), gsv_pct: pct, source: src })
    }
  }
  // Also persist term-agnostic factors with term=0 as a sentinel
  if (gsvRows.length === 0) {
    for (const [yearStr, pct] of Object.entries(parsed.gsvFactors)) {
      gsvRows.push({ plan_id: brochureRow.plan_id, plan_no: brochureRow.plan_no, policy_year: parseInt(yearStr), term: 0, gsv_pct: pct, source: src })
    }
  }
  if (gsvRows.length > 0) {
    const { error: gsvErr } = await sb
      .from('lic_gsv_factors')
      .upsert(gsvRows, { onConflict: 'plan_id,policy_year,term' })
    if (gsvErr) console.error('[brochures/extract] gsv upsert error:', gsvErr.message)
  }

  // Update brochure status to extracted
  await sb.from('lic_brochures').update({
    status: 'extracted',
    extracted_at: new Date().toISOString(),
  }).eq('id', plan_id)

  // Audit log
  await sb.from('admin_audit_log').insert({
    action: 'BROCHURE_EXTRACTED',
    table_name: 'lic_brochures',
    record_id: String(plan_id),
    notes: JSON.stringify({
      plan_no: brochureRow.plan_no,
      url: brochure_url,
      source: parsed.source,
      rowCount: parsed.rowCount,
    }),
  })

  return NextResponse.json({
    success: true,
    source: parsed.source,
    rowCount: parsed.rowCount,
    ratesInserted: rateRows.length,
    gsvFactors: parsed.gsvFactors,
    preview: Object.entries(parsed.rates).slice(0, 3).map(([age, terms]) => ({ age, terms })),
  })
}
