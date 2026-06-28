// ─── Raw plan record as stored in lic-kb-live.json ───────────────────────────

export interface LicPlanRecord {
  'Internal Product ID'?: string
  'Product Family'?: string
  'Product Name': string
  'Plan No'?: number | string | null
  UIN?: string
  Version?: string
  Category?: string
  Subcategory?: string
  Type?: string
  Status: 'Active' | 'Withdrawn'
  'Status Reason'?: string
  'Active From'?: string
  'Active To'?: string
  'Min Entry Age'?: string | number
  'Max Entry Age'?: string | number
  'Min Sum Assured'?: string | number
  'Max Sum Assured'?: string | number
  'Policy Term Options'?: string
  'Premium Paying Term'?: string
  'Max Maturity Age'?: string | number
  'Premium Mode'?: string
  'Premium Type'?: string
  'High SA Rebate'?: string
  'Death Benefit Formula'?: string
  'Death Benefit Min Guarantee'?: string
  'Maturity Benefit Formula'?: string
  'Survival Benefit'?: string
  'Guaranteed Additions'?: string
  'Simple Reversionary Bonus'?: string
  'Final Additional Bonus'?: string
  'Loyalty Addition'?: string
  'Surrender After Years'?: string | number
  'GSV Formula'?: string
  'SSV Available'?: string
  'Loan Available'?: string
  'Loan Interest Rate'?: string
  'Loan Max Percent'?: string | number
  'Available Riders'?: string
  'Section 80C'?: string
  'Section 10_10D'?: string
  'GST Applicable'?: string
  'Official Brochure URL'?: string
  'Bonus Rate FY2024-25 (per ₹1000 SA)'?: string | number
  'FAB Rate'?: string | number
  'Loyalty Addition Rate'?: string | number
  gst_first_yr_pct?: number
  gst_renewal_pct?: number
  'Supersedes UIN'?: string
  'Superseded By UIN'?: string
  'Active Plan Classification'?: string
  Serviceable?: string
  'LIC Claim Settlement Ratio'?: string
  // Populated after brochure extraction + admin approval
  tabular_rates?: TabularRateGrid
  gsv_factors?: GSVFactorGrid
}

// age → term → rate per ₹1000 SA
export type TabularRateGrid = Record<number, Record<number, number>>

// policy_year → gsv_percent
export type GSVFactorGrid = Record<number, number>

// ─── Calculator I/O ───────────────────────────────────────────────────────────

export interface PremiumInput {
  planNo: number
  age: number
  term: number
  sa: number
  mode?: 'yearly' | 'halfyearly' | 'quarterly' | 'monthly'
  smoker?: boolean
  gender?: 'male' | 'female'
}

export interface PremiumResult {
  annual: number
  halfYearly: number
  quarterly: number
  monthly: number
  netPremium: number
  gstYear1: number
  gstYear2: number
  totalFirstYear: number
  totalOutgo: number
  modeRebatePct: number
  saRebatePer1000: number
  gstPctYear1: number
  gstPctYear2: number
  rateSource: 'brochure' | 'estimated'
  disclaimer: string
}

export interface MaturityResult {
  basicSA: number
  totalSRB: number
  fabEstimate: number
  totalMaturity: number
  years: number
  bonusRateUsed: number
  disclaimer: string
}

export interface SurrenderResult {
  gsv: number
  ssvEstimate: number
  payable: number
  premiumsPaidTotal: number
  lossOnSurrender: number
  recommendation: 'HOLD' | 'SURRENDER' | 'CONSIDER_LOAN'
  irrIfSurrendered: number
}

export interface LoanResult {
  maxLoan: number
  interestRate: number
  surrenderValueBasis: number
  monthlyInterest: number
}

export interface PaidUpResult {
  originalSA: number
  paidUpSA: number
  vestedBonuses: number
  deathBenefitPaidUp: number
  maturityPaidUp: number
}

export interface DeathBenefitResult {
  saOnDeath: number
  vestedBonuses: number
  fabEstimate: number
  totalDeathBenefit: number
  minGuarantee: number
  formulaUsed: string
}

export interface TaxResult {
  section80CEligible: boolean
  max80CDeduction: number
  actualDeduction: number
  section1010DExempt: boolean
  exemptionCondition: string
  gstRate: number
  tdsApplicable: boolean
  tdsNote: string
}

export interface IRRResult {
  irrPercent: number
  totalInvested: number
  totalReturned: number
  wealthMultiple: number
  equivalentFDRate: string
  verdict: string
}

// ─── Brochure workflow ────────────────────────────────────────────────────────

export type UrlStatus = 'known' | 'missing' | 'not_applicable'
export type ExtractionStatus = 'pending' | 'in_progress' | 'extracted' | 'approved' | 'not_applicable'

export interface BrochureEntry {
  plan_no: number | null
  plan_name: string
  category_type: 'retail_individual' | 'group_govt' | 'rider'
  lic_category: string
  priority: number | null
  brochure_url: string | null
  url_status: UrlStatus
  extraction_status: ExtractionStatus
  fields_extracted: string[]
  tabular_rates_complete: boolean
  gsv_factors_complete: boolean
  bonus_rates_verified: boolean
  approved_by: string | null
  approved_at: string | null
  notes: string
}

// ─── Data pipeline diff ───────────────────────────────────────────────────────

export type ChangeType =
  | 'PLAN_WITHDRAWN'
  | 'NEW_PLAN_DETECTED'
  | 'BONUS_RATE_CHANGED'
  | 'ELIGIBILITY_CHANGED'
  | 'BROCHURE_URL_UPDATED'
  | 'GSV_FORMULA_CHANGED'

export interface DataChange {
  id: string
  type: ChangeType
  plan_no: number | null
  plan_name: string
  field?: string
  old_value?: unknown
  new_value?: unknown
  confidence: number
  source: string
  evidence?: string
  detected_at: string
  status: 'pending' | 'approved' | 'rejected'
  reviewed_by?: string
  reviewed_at?: string
  notes?: string
}
