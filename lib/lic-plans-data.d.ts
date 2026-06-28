/**
 * Type declarations for lib/lic-plans-data.js
 */

export interface LICPlan {
  planNo: number
  name: string
  category: 'endowment' | 'moneyback' | 'wholelife' | 'term' | 'child' | 'pension' | 'ulip'
  desc?: string
  minAge: number
  maxAge: number
  minSA: number
  maxSA?: number
  minTerm?: number
  maxTerm?: number
  xirr?: string
  keyFeatures?: string[]
  [key: string]: any
}

export interface PremiumResult {
  basePremium: number
  modeRebate: number
  saRebate: number
  netPremium: number
  gstYear1: number
  gstPctYear1: number
  instalment1: number
  instalment2: number
  totalPaid: number
  [key: string]: any
}

export interface BenefitRow {
  year: number
  age: number
  premiumPaid?: number
  cumPremiumPaid: number
  annualBonus?: number
  cumBonus?: number
  deathBenefit: number
  gsv?: number
  maturityPayout?: number
}

export interface CalculatePremiumParams {
  planNo: number
  sa: number
  age: number
  term: number
  ppt: number
  mode: 'yearly' | 'halfyearly' | 'quarterly' | 'monthly'
  gender?: 'male' | 'female'
  smoker?: boolean
  [key: string]: any
}

export interface AdvisePlansParams {
  age: number
  goal: string
  budget: number
  hasDependents: boolean
}

export declare const PLANS: LICPlan[]
export declare const RIDERS: Record<string, any>
export declare const GST_RULES: Record<string, { year1: number; year2plus?: number }>
export declare const MODE_REBATE: Record<string, number>
export declare const SA_REBATE: (sa: number) => number
export declare const BONUS_RATES_2026: Record<number, { srb?: number; ga?: number; fab?: number }>
export declare const TABULAR_RATES: Record<number, Record<number, Record<number, number>>>

export declare function calculatePremium(params: CalculatePremiumParams): PremiumResult
export declare function calculateMaturity(params: any): any
export declare function generateBenefitTable(params: any): BenefitRow[]
export declare function getPPT(plan: LICPlan, term: number, age: number): number
export declare function getTabularRate(planNo: number, age: number, term: number): number
export declare function advisePlans(params: AdvisePlansParams): LICPlan[]

declare const _default: {
  PLANS: LICPlan[]
  RIDERS: Record<string, any>
  GST_RULES: Record<string, { year1: number; year2plus?: number }>
  MODE_REBATE: Record<string, number>
  SA_REBATE: (sa: number) => number
  BONUS_RATES_2026: Record<number, { srb?: number; ga?: number; fab?: number }>
  TABULAR_RATES: Record<number, Record<number, Record<number, number>>>
  calculatePremium: (params: CalculatePremiumParams) => PremiumResult
  calculateMaturity: (params: any) => any
  generateBenefitTable: (params: any) => BenefitRow[]
  getPPT: (plan: LICPlan, term: number, age: number) => number
  getTabularRate: (planNo: number, age: number, term: number) => number
  advisePlans: (params: AdvisePlansParams) => LICPlan[]
}
export default _default
