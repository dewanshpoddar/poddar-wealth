/**
 * Calculator tools for the Poddar Ji chatbot.
 * Called after Groq tool_call resolution — direct function imports, no HTTP round-trip.
 */
import { createClient } from '@supabase/supabase-js'

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return null
  return createClient(url, key)
}

// ─── Tool definitions sent to Groq ───────────────────────────────────────────

export const TOOL_DEFINITIONS = [
  {
    type: 'function' as const,
    function: {
      name: 'find_plan',
      description: 'Search for a LIC plan by name or product family. Use this when the user mentions a plan by name (e.g. "Jeevan Anand", "Jeevan Labh", "Tech Term") to resolve the plan_no before calling calculator tools.',
      parameters: {
        type: 'object',
        properties: {
          query: { type: 'string', description: 'Plan name or family to search, e.g. "Jeevan Anand" or "money back"' },
        },
        required: ['query'],
      },
    },
  },
  {
    type: 'function' as const,
    function: {
      name: 'calculate_premium',
      description: 'Calculate LIC premium for a given plan, age, sum assured, and term. Returns yearly premium with GST breakdown.',
      parameters: {
        type: 'object',
        properties: {
          planNo: { type: 'number', description: 'LIC plan number (table number)' },
          age:    { type: 'number', description: 'Entry age in years' },
          sa:     { type: 'number', description: 'Sum assured in rupees' },
          term:   { type: 'number', description: 'Policy term in years' },
          mode:   { type: 'string', enum: ['yearly', 'halfyearly', 'quarterly', 'monthly'], description: 'Premium payment mode' },
          gender: { type: 'string', enum: ['male', 'female'] },
        },
        required: ['planNo', 'age', 'sa', 'term'],
      },
    },
  },
  {
    type: 'function' as const,
    function: {
      name: 'calculate_maturity',
      description: 'Calculate indicative maturity benefit (SA + bonuses) for a LIC plan.',
      parameters: {
        type: 'object',
        properties: {
          planNo: { type: 'number' },
          sa:     { type: 'number', description: 'Sum assured in rupees' },
          term:   { type: 'number', description: 'Policy term in years' },
        },
        required: ['planNo', 'sa', 'term'],
      },
    },
  },
  {
    type: 'function' as const,
    function: {
      name: 'calculate_surrender',
      description: 'Calculate surrender value for an existing LIC policy.',
      parameters: {
        type: 'object',
        properties: {
          planNo:          { type: 'number' },
          sa:              { type: 'number' },
          annualPremium:   { type: 'number' },
          yearsCompleted:  { type: 'number', description: 'Number of years premiums paid' },
          term:            { type: 'number' },
        },
        required: ['planNo', 'sa', 'annualPremium', 'yearsCompleted', 'term'],
      },
    },
  },
  {
    type: 'function' as const,
    function: {
      name: 'calculate_loan',
      description: 'Calculate maximum loan available against a LIC policy.',
      parameters: {
        type: 'object',
        properties: {
          planNo:         { type: 'number' },
          sa:             { type: 'number' },
          annualPremium:  { type: 'number' },
          yearsCompleted: { type: 'number' },
          term:           { type: 'number' },
        },
        required: ['planNo', 'sa', 'annualPremium', 'yearsCompleted', 'term'],
      },
    },
  },
  {
    type: 'function' as const,
    function: {
      name: 'get_plan_info',
      description: 'Get details about a specific LIC plan: eligibility, features, loan terms, bonus rates.',
      parameters: {
        type: 'object',
        properties: {
          planNo: { type: 'number' },
        },
        required: ['planNo'],
      },
    },
  },
]

// ─── Tool executor ────────────────────────────────────────────────────────────

type ToolArgs = Record<string, unknown>

export async function executeTool(name: string, args: ToolArgs): Promise<string> {
  try {
    switch (name) {
      case 'find_plan':     return await findPlan(args)
      case 'calculate_premium':  return await calcPremium(args)
      case 'calculate_maturity': return await calcMaturity(args)
      case 'calculate_surrender':return await calcSurrender(args)
      case 'calculate_loan':     return await calcLoan(args)
      case 'get_plan_info':      return await getPlanInfo(args)
      default: return `Unknown tool: ${name}`
    }
  } catch (err) {
    return `Tool error: ${err instanceof Error ? err.message : String(err)}`
  }
}

// ─── Tool implementations ─────────────────────────────────────────────────────

async function findPlan(args: ToolArgs): Promise<string> {
  const query = String(args.query ?? '').trim().toLowerCase()
  const sb = getSupabase()
  if (!sb) return 'Database unavailable'

  const { data } = await sb
    .from('lic_plans')
    .select('plan_no, name, product_family, status, category, min_age, max_age, min_sa, bonus_rate_fy25')
    .or(`name.ilike.%${query}%,product_family.ilike.%${query}%`)
    .eq('is_current_version', true)
    .order('status', { ascending: true }) // active first
    .limit(5)

  if (!data?.length) return `No plan found matching "${args.query}". Ask the user to clarify the plan name.`

  return JSON.stringify(
    data.map(p => ({
      planNo: p.plan_no,
      name: p.name,
      family: p.product_family,
      status: p.status,
      category: p.category,
      minAge: p.min_age,
      maxAge: p.max_age,
      minSA: p.min_sa,
      bonusRateFY25: p.bonus_rate_fy25,
    }))
  )
}

async function calcPremium(args: ToolArgs): Promise<string> {
  const mod = await import('@/lib/lic-plans-data.js')
  const calculatePremium = (mod as unknown as { calculatePremium: (opts: unknown) => { error?: string; [k: string]: unknown } }).calculatePremium
  const result = calculatePremium({
    planNo: Number(args.planNo),
    age:    Number(args.age),
    sa:     Number(args.sa),
    term:   Number(args.term),
    mode:   String(args.mode ?? 'yearly'),
    gender: String(args.gender ?? 'male'),
  })
  if (result?.error) return result.error
  return JSON.stringify({ ...result, note: 'Indicative. Verify exact premium with authorised LIC agent.' })
}

async function calcMaturity(args: ToolArgs): Promise<string> {
  const sb = getSupabase()
  const planNo = Number(args.planNo)
  const sa     = Number(args.sa)
  const term   = Number(args.term)

  let bonusRate: number | null = null
  if (sb) {
    const { data } = await sb.from('lic_plans').select('bonus_rate_fy25, fab_rate, name')
      .eq('plan_no', planNo).eq('is_current_version', true).limit(1)
    if (data?.[0]) bonusRate = data[0].bonus_rate_fy25 ?? null
  }
  if (bonusRate === null) {
    const { BONUS_RATES_2026 } = await import('@/lib/lic-plans-data.js') as {
      BONUS_RATES_2026: Record<number, { srb?: number; ga?: number }>
    }
    const legacy = BONUS_RATES_2026?.[planNo]
    bonusRate = legacy?.srb ?? legacy?.ga ?? null
  }

  if (bonusRate === null) return `No bonus rate available for Plan ${planNo}. Maturity cannot be computed.`

  const totalSRB = Math.round((bonusRate * sa / 1000) * term)
  return JSON.stringify({
    planNo, sa, term,
    basicSA: sa, totalSRB,
    totalMaturity: sa + totalSRB,
    bonusRateUsed: bonusRate,
    note: 'Indicative. Based on FY2024-25 declared bonus. Actual may vary.',
  })
}

async function calcSurrender(args: ToolArgs): Promise<string> {
  const planNo         = Number(args.planNo)
  void args.sa // passed by LLM for context, GSV uses premiums only
  const annualPremium  = Number(args.annualPremium)
  const yearsCompleted = Number(args.yearsCompleted)
  const term           = Number(args.term)

  if (yearsCompleted < 3) return 'Surrender not allowed before 3 years of premium payment.'

  const gsvTable: Record<number, number> = { 3:.30, 5:.50, 7:.55, 9:.60, 11:.65, 13:.70, 15:.80, 16:.90 }
  const yr = [3,5,7,9,11,13,15,16].reduce((prev, y) => yearsCompleted >= y ? y : prev, 3)
  const gsvFactor = gsvTable[yr]
  const premiumsPaid = annualPremium * Math.min(yearsCompleted, term)
  const gsv = Math.round(premiumsPaid * gsvFactor)
  const loss = premiumsPaid - gsv
  const rec  = yearsCompleted < term * 0.5 ? 'HOLD' : loss > annualPremium * 2 ? 'CONSIDER_LOAN' : 'SURRENDER'

  return JSON.stringify({ planNo, gsv, premiumsPaid, lossOnSurrender: loss, recommendation: rec,
    note: 'Indicative GSV. Actual depends on LIC assessment at time of surrender.' })
}

async function calcLoan(args: ToolArgs): Promise<string> {
  const planNo         = Number(args.planNo)
  void args.sa // passed by LLM for context, GSV uses premiums only
  const annualPremium  = Number(args.annualPremium)
  const yearsCompleted = Number(args.yearsCompleted)
  const term           = Number(args.term)

  if (yearsCompleted < 3) return 'Loan not available before 3 years of premium payment.'

  const gsvTable: Record<number, number> = { 3:.30, 5:.50, 7:.55, 9:.60, 11:.65, 13:.70, 15:.80, 16:.90 }
  const yr = [3,5,7,9,11,13,15,16].reduce((prev, y) => yearsCompleted >= y ? y : prev, 3)
  const premiumsPaid = annualPremium * Math.min(yearsCompleted, term)
  const sv = Math.round(premiumsPaid * gsvTable[yr])
  const maxLoan = Math.round(sv * 0.90)
  const rate = 9.5
  return JSON.stringify({ planNo, surrenderValueBasis: sv, maxLoan, interestRate: rate,
    monthlyInterest: Math.round((maxLoan * rate / 100) / 12),
    note: 'Loan up to 90% of surrender value at 9.5% p.a. Verify with LIC branch.' })
}

async function getPlanInfo(args: ToolArgs): Promise<string> {
  const sb = getSupabase()
  if (!sb) return 'Database unavailable'
  const { data } = await sb.from('lic_plans')
    .select('plan_no,name,product_family,status,category,min_age,max_age,min_sa,max_sa,bonus_rate_fy25,fab_rate,loan_max_pct,loan_interest_rate,gsv_start_year,death_formula,maturity_formula,brochure_url,irr_min,irr_max,available_riders')
    .eq('plan_no', Number(args.planNo))
    .eq('is_current_version', true)
    .limit(1)
  if (!data?.length) return `Plan ${args.planNo} not found`
  const p = data[0]
  return JSON.stringify({
    planNo: p.plan_no, name: p.name, family: p.product_family,
    status: p.status, category: p.category,
    eligibility: { minAge: p.min_age, maxAge: p.max_age, minSA: p.min_sa, maxSA: p.max_sa },
    bonus: { rateFY25: p.bonus_rate_fy25, fabRate: p.fab_rate },
    loan: { maxPct: p.loan_max_pct, rate: p.loan_interest_rate },
    surrenderFrom: p.gsv_start_year,
    irrRange: p.irr_min ? `${p.irr_min}%-${p.irr_max}%` : null,
    riders: p.available_riders,
    brochureUrl: p.brochure_url,
  })
}
