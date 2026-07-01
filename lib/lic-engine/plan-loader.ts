/**
 * Plan data layer — Supabase primary, lic-kb-live.json fallback.
 * Decision calculators call getActivePlans() — forward-looking, buy decisions.
 * Analysis calculators call getAllPlans() — backward-looking, existing policies.
 */
import fs from 'fs'
import path from 'path'
import { createClient } from '@supabase/supabase-js'
import type { LicPlanRecord } from './types'

const KB_PATH = path.join(process.cwd(), 'lib/data/lic-kb-live.json')

// ─── Supabase client (server-side only) ──────────────────────────────────────

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return null
  return createClient(url, key)
}

// ─── Supabase row shape (matches lic_plans table columns) ────────────────────

interface DBPlan {
  plan_no: number | null
  name: string
  uin: string | null
  status: string
  category: string | null
  min_age: number | null
  max_age: number | null
  min_sa: number | null
  max_sa: number | null
  premium_type: string | null
  death_formula: string | null
  maturity_formula: string | null
  survival_benefit: string | null
  bonus_rate_fy25: number | null
  fab_rate: number | null
  gsv_start_year: number | null
  gsv_formula: string | null
  loan_max_pct: number | null
  loan_interest_rate: number | null
  gst_first_yr_pct: number | null
  gst_renewal_pct: number | null
  brochure_url: string | null
  superseded_by_uin: string | null
}

function normaliseFromDB(row: DBPlan & { id?: number }): NormalisedPlan {
  return {
    planNo: row.plan_no,
    name: row.name,
    uin: row.uin,
    status: row.status === 'active' ? 'Active' : 'Withdrawn',
    category: row.category ?? '',
    minAge: row.min_age,
    maxAge: row.max_age,
    minSA: row.min_sa,
    maxSA: row.max_sa,
    policyTermOptions: null,
    ppt: row.premium_type,
    deathBenefitFormula: row.death_formula,
    maturityBenefitFormula: row.maturity_formula,
    survivalBenefit: row.survival_benefit,
    bonusRateFY25: row.bonus_rate_fy25,
    fabRate: row.fab_rate,
    surrenderAfterYears: row.gsv_start_year,
    gsvFormula: row.gsv_formula,
    loanAvailable: (row.loan_max_pct ?? 0) > 0,
    loanMaxPct: row.loan_max_pct,
    loanInterestRate: row.loan_interest_rate,
    gstYear1Pct: row.gst_first_yr_pct,
    gstYear2Pct: row.gst_renewal_pct,
    saRebate: null,
    brochureUrl: row.brochure_url,
    tabularRates: null, // populated by enrichWithBrochureRates() when approved rates exist
    gsvFactors: null,
    supersedingUIN: row.superseded_by_uin,
    raw: row as unknown as LicPlanRecord,
    _dbId: row.id,
  }
}

/**
 * Fetches approved premium rates from lic_premium_rates and populates
 * plan.tabularRates in-place. No-ops silently when no approved brochure exists.
 */
async function enrichWithBrochureRates(
  plan: NormalisedPlan,
  sb: ReturnType<typeof getSupabase>
): Promise<void> {
  if (!sb || !(plan as NormalisedPlan & { _dbId?: number })._dbId) return
  const dbId = (plan as NormalisedPlan & { _dbId: number })._dbId

  const { data: approved } = await sb
    .from('lic_brochures')
    .select('id')
    .eq('plan_id', dbId)
    .eq('status', 'approved')
    .limit(1)

  if (!approved?.length) return

  const { data: rates, error } = await sb
    .from('lic_premium_rates')
    .select('age, term, rate_per_1000')
    .eq('plan_id', dbId)

  if (error || !rates?.length) return

  const grid: Record<number, Record<number, number>> = {}
  for (const r of rates) {
    grid[r.age] = grid[r.age] ?? {}
    grid[r.age][r.term] = Number(r.rate_per_1000)
  }
  if (Object.keys(grid).length) plan.tabularRates = grid
}

// ─── JSON fallback (lic-kb-live.json) ────────────────────────────────────────

let _plans: LicPlanRecord[] = []
let _loaded = false

function loadPlans(): LicPlanRecord[] {
  if (_loaded) return _plans
  try {
    const raw = fs.readFileSync(KB_PATH, 'utf8')
    const data = JSON.parse(raw)
    _plans = Array.isArray(data) ? data : (data.plans ?? data.data ?? [])
    _loaded = true
  } catch (err) {
    console.error('[plan-loader] Failed to load lic-kb-live.json:', err)
  }
  return _plans
}

function parsePlanNo(p: LicPlanRecord): number | null {
  const raw = p['Plan No']
  if (raw == null || raw === 'UNKNOWN') return null
  const n = parseFloat(String(raw))
  return isNaN(n) ? null : Math.round(n)
}

function parseNum(v: unknown): number | null {
  if (v == null || v === '' || String(v).toUpperCase().startsWith('UNKNOWN')) return null
  const n = parseFloat(String(v))
  return isNaN(n) ? null : n
}

/** Normalised plan shape used by calculators */
export interface NormalisedPlan {
  planNo: number | null
  name: string
  uin: string | null
  status: 'Active' | 'Withdrawn'
  category: string
  minAge: number | null
  maxAge: number | null
  minSA: number | null
  maxSA: number | null
  policyTermOptions: string | null
  ppt: string | null
  deathBenefitFormula: string | null
  maturityBenefitFormula: string | null
  survivalBenefit: string | null
  bonusRateFY25: number | null     // per ₹1000 SA
  fabRate: number | null
  surrenderAfterYears: number | null
  gsvFormula: string | null
  loanAvailable: boolean
  loanMaxPct: number | null
  loanInterestRate: number | null
  gstYear1Pct: number | null
  gstYear2Pct: number | null
  saRebate: string | null          // raw string from JSON
  brochureUrl: string | null
  tabularRates: Record<number, Record<number, number>> | null
  gsvFactors: Record<number, number> | null
  supersedingUIN: string | null
  raw: LicPlanRecord               // full original record
  _dbId?: number                   // internal Supabase row id — not for external use
}

function normalise(p: LicPlanRecord): NormalisedPlan {
  const bonusRaw = p['Bonus Rate FY2024-25 (per ₹1000 SA)']
  const bonusNum = bonusRaw != null && !String(bonusRaw).startsWith('UNKNOWN')
    ? parseFloat(String(bonusRaw))
    : null

  const url = p['Official Brochure URL']
  const cleanUrl = url && !String(url).startsWith('UNKNOWN') && url !== 'N/A' ? url : null

  return {
    planNo: parsePlanNo(p),
    name: p['Product Name'],
    uin: p.UIN ?? null,
    status: p.Status,
    category: p.Category ?? '',
    minAge: parseNum(p['Min Entry Age']),
    maxAge: parseNum(p['Max Entry Age']),
    minSA: parseNum(p['Min Sum Assured']),
    maxSA: parseNum(p['Max Sum Assured']),
    policyTermOptions: p['Policy Term Options'] ?? null,
    ppt: p['Premium Paying Term'] ?? null,
    deathBenefitFormula: p['Death Benefit Formula'] ?? null,
    maturityBenefitFormula: p['Maturity Benefit Formula'] ?? null,
    survivalBenefit: p['Survival Benefit'] ?? null,
    bonusRateFY25: isNaN(bonusNum as number) ? null : bonusNum,
    fabRate: parseNum(p['FAB Rate']),
    surrenderAfterYears: parseNum(p['Surrender After Years']),
    gsvFormula: p['GSV Formula'] ?? null,
    loanAvailable: String(p['Loan Available'] ?? '').toLowerCase().includes('yes'),
    loanMaxPct: parseNum(p['Loan Max Percent']),
    loanInterestRate: parseNum(p['Loan Interest Rate']),
    gstYear1Pct: p.gst_first_yr_pct ?? null,
    gstYear2Pct: p.gst_renewal_pct ?? null,
    saRebate: p['High SA Rebate'] ?? null,
    brochureUrl: cleanUrl,
    tabularRates: p.tabular_rates ?? null,
    gsvFactors: p.gsv_factors ?? null,
    supersedingUIN: p['Superseded By UIN'] ?? null,
    raw: p,
  }
}

// ─── Public API ───────────────────────────────────────────────────────────────

/** All 399 plans — use for analysis calculators (surrender, loan, paid-up) */
export async function getAllPlans(): Promise<NormalisedPlan[]> {
  const sb = getSupabase()
  if (sb) {
    const { data, error } = await sb.from('lic_plans').select('*').order('plan_no')
    if (!error && data?.length) return data.map(normaliseFromDB)
    console.warn('[plan-loader] Supabase getAllPlans failed, falling back to JSON:', error?.message)
  }
  return loadPlans().map(normalise)
}

/** Active plans only — use for decision calculators (premium, maturity, recommend) */
export async function getActivePlans(): Promise<NormalisedPlan[]> {
  const sb = getSupabase()
  if (sb) {
    const { data, error } = await sb
      .from('lic_plans')
      .select('*')
      .eq('status', 'active')
      .order('plan_no')
    if (!error && data?.length) return data.map(normaliseFromDB)
    console.warn('[plan-loader] Supabase getActivePlans failed, falling back to JSON:', error?.message)
  }
  return loadPlans().filter(p => p.Status === 'Active').map(normalise)
}

/** Lookup by plan number — current version, enriched with approved brochure rates */
export async function getPlanByNo(planNo: number): Promise<NormalisedPlan | null> {
  const sb = getSupabase()
  if (sb) {
    const { data, error } = await sb
      .from('lic_plans')
      .select('*')
      .eq('plan_no', planNo)
      .order('is_current_version', { ascending: false })
      .limit(1)
    if (!error && data?.length) {
      const plan = normaliseFromDB(data[0])
      await enrichWithBrochureRates(plan, sb)
      return plan
    }
    if (error) console.warn('[plan-loader] Supabase getPlanByNo failed, falling back to JSON:', error.message)
  }
  const all = loadPlans()
  const matches = all.filter(p => parsePlanNo(p) === planNo)
  if (!matches.length) return null
  const active = matches.find(p => p.Status === 'Active')
  return normalise(active ?? matches[0])
}

/** Lookup by UIN — for specific version lookups (e.g. existing policyholder on V02) */
export async function getPlanByUIN(uin: string): Promise<NormalisedPlan | null> {
  const sb = getSupabase()
  if (sb) {
    const { data, error } = await sb
      .from('lic_plans')
      .select('*')
      .eq('uin', uin)
      .limit(1)
    if (!error && data?.length) return normaliseFromDB(data[0])
    if (error) console.warn('[plan-loader] Supabase getPlanByUIN failed, falling back to JSON:', error.message)
  }
  const all = loadPlans()
  const match = all.find(p => p.UIN === uin)
  return match ? normalise(match) : null
}

/**
 * Looks up GSV factors for a specific plan + term from lic_gsv_factors.
 * Returns a policy_year→gsv_pct grid for the given term (or nearest term),
 * plus the data source. Falls back to empty when no approved data exists.
 */
export async function lookupGsvFactors(
  planDbId: number | undefined,
  term: number,
): Promise<{ grid: Record<number, number>; source: 'brochure' | 'interpolated' | 'estimated' }> {
  const sb = getSupabase()
  if (!sb || !planDbId) return { grid: {}, source: 'estimated' }

  // Confirm approved brochure exists
  const { data: approved } = await sb
    .from('lic_brochures')
    .select('id')
    .eq('plan_id', planDbId)
    .eq('status', 'approved')
    .limit(1)

  if (!approved?.length) return { grid: {}, source: 'estimated' }

  // Try exact term match first
  const { data: exact } = await sb
    .from('lic_gsv_factors')
    .select('policy_year, gsv_pct')
    .eq('plan_id', planDbId)
    .eq('term', term)

  if (exact?.length) {
    const grid: Record<number, number> = {}
    for (const r of exact) grid[r.policy_year] = Number(r.gsv_pct)
    return { grid, source: 'brochure' }
  }

  // No exact term — find nearest term with data
  const { data: allRows } = await sb
    .from('lic_gsv_factors')
    .select('policy_year, gsv_pct, term')
    .eq('plan_id', planDbId)
    .order('term', { ascending: true })

  if (!allRows?.length) return { grid: {}, source: 'estimated' }

  // Pick the term closest to requested
  const terms = [...new Set(allRows.map(r => r.term as number))]
  const closestTerm = terms.reduce((a, b) => Math.abs(b - term) < Math.abs(a - term) ? b : a)
  const grid: Record<number, number> = {}
  for (const r of allRows.filter(r => r.term === closestTerm)) {
    grid[r.policy_year] = Number(r.gsv_pct)
  }
  return { grid, source: 'interpolated' }
}

/** Stats for health checks and admin dashboard */
export function getPlanStats() {
  const all = loadPlans()
  const active = all.filter(p => p.Status === 'Active')
  const categories = active.reduce<Record<string, number>>((acc, p) => {
    const cat = p.Category ?? 'Unknown'
    acc[cat] = (acc[cat] ?? 0) + 1
    return acc
  }, {})
  return {
    total: all.length,
    active: active.length,
    withdrawn: all.length - active.length,
    categories,
  }
}
