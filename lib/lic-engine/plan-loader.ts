/**
 * Loads lic-kb-live.json once at module level (server-side singleton).
 * Decision calculators call getActivePlans() — forward-looking, buy decisions.
 * Analysis calculators call getAllPlans() — backward-looking, existing policies.
 */
import fs from 'fs'
import path from 'path'
import type { LicPlanRecord } from './types'

const KB_PATH = path.join(process.cwd(), 'lib/data/lic-kb-live.json')

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
export function getAllPlans(): NormalisedPlan[] {
  return loadPlans().map(normalise)
}

/** Active plans only — use for decision calculators (premium, maturity, recommend) */
export function getActivePlans(): NormalisedPlan[] {
  return loadPlans()
    .filter(p => p.Status === 'Active')
    .map(normalise)
}

/** Lookup by plan number — searches all 399 plans including withdrawn */
export function getPlanByNo(planNo: number): NormalisedPlan | null {
  const all = loadPlans()
  // Prefer active version if multiple exist
  const matches = all.filter(p => parsePlanNo(p) === planNo)
  if (!matches.length) return null
  const active = matches.find(p => p.Status === 'Active')
  return normalise(active ?? matches[0])
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
