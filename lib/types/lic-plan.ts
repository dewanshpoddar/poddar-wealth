/**
 * Type definitions for LIC Plans and Calculator Results
 */

export interface FundOption {
  id: string
  name: string
  risk: 'Low' | 'Low-Med' | 'Medium' | 'High' | string
  desc: string
}

export interface PPTOption {
  ppt: number
  term: number
}

export interface MoneybackPayout {
  year: number
  pct: number
}

export interface LicPlan {
  id: string
  planNo: number
  name: string
  shortName: string
  category: 'endowment' | 'moneyback' | 'wholelife' | 'term' | 'child' | 'pension' | 'ulip'
  type: string
  status: 'active' | 'withdrawn'
  withdrawnDate?: string
  desc?: string
  minAge: number
  maxAge: number
  minSA: number
  maxSA?: number
  minPurchasePrice?: number
  minTerm?: number
  maxTerm?: number
  minPremium?: number
  ppt: number | string // e.g. "same", "single", "limited", "term_minus_3", "term_minus_5"
  gstCategory: string
  riders: string[]
  keyFeatures?: string[]
  tags?: string[]
  xirr?: string
  fundOptions?: FundOption[]
  annuityOptions?: string[]
  defaultGender?: 'male' | 'female'
  defaultMaturityAge?: number
  maturityAgeOptions?: number[]
  pptOptions?: PPTOption[] | number[]
  moneybkPayouts?: MoneybackPayout[]
  deathBenefitFormula?: string
  maturityPct?: number
  smokerNonSmokerRates?: boolean
  bimaLakshmiOption?: boolean
}

export interface PremiumResult {
  basePremium: number
  modeRebate: number
  saRebate: number
  netPremium: number
  gstYear1: number
  gstYear2: number
  yearlyYear1: number
  yearlyYear2plus: number
  instalment1: number
  instalment2: number
  totalPaid: number
  modeRebatePct?: number
  saRebatePer1000?: number
  gstPctYear1?: number
  gstPctYear2?: number
  isPensionAnnuity?: boolean
  annuityRate?: number
  purchasePrice?: number
  annualPension?: number
  monthlyPension?: number
  quarterlyPension?: number
  halfYearlyPension?: number
  gst?: number
  totalPayable?: number
  isUlip?: boolean
}

export interface MaturityResult {
  maturity: number
  totalBonus: number
  fab: number
  totalSRB?: number // Referenced in ResultsPanel.tsx (possible bug/legacy code)
}

export interface BenefitRow {
  year: number
  age: number
  premiumPaid?: number
  cumPremiumPaid: number
  sumAssured?: number
  annualBonus?: number
  cumBonus?: number
  deathBenefit: number
  survivalPayout?: number | null
  maturityPayout?: number | null
  gsv?: number
}

export interface CalculatePremiumParams {
  planNo: number
  sa: number
  age: number
  term: number
  ppt: number
  mode: 'yearly' | 'halfyearly' | 'quarterly' | 'monthly'
  smoker?: boolean
  gender?: 'male' | 'female'
}
