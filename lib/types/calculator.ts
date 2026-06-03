// Surrender Value Calculator
export interface SurrenderValueInput {
  planNumber: string
  sumAssured: number
  premiumsPaid: number
  policyYear: number
  annualPremium: number
}

export interface SurrenderValueResult {
  guaranteedSurrenderValue: number
  estimatedPaidUpValue: number
  totalPremiumsPaid: number
  surrenderRatio: number
  recommendation: string
  disclaimer: string
}

// Maturity Calculator
export interface MaturityInput {
  planNumber: string
  age: number
  sumAssured: number
  term: number
  premiumMode: 'yearly' | 'half-yearly' | 'quarterly' | 'monthly'
}

export interface MaturityResult {
  totalPremiumsPaid: number
  estimatedMaturity: number
  accruedBonus: number
  estimatedFAB: number
  effectiveReturn: number
  disclaimer: string
}

// Policy Health Score
export interface PolicyHealthInput {
  sumAssured: number
  annualPremium: number
  policyYear: number
  currentAge: number
  annualIncome: number
  dependents: number
  hasHealthInsurance: boolean
  hasTermInsurance: boolean
  planType: 'endowment' | 'term' | 'ulip' | 'money-back' | 'whole-life'
}

export interface PolicyHealthBreakdown {
  score: number
  max: number
  comment: string
}

export interface PolicyHealthResult {
  totalScore: number
  grade: 'A+' | 'A' | 'B' | 'C' | 'D'
  breakdown: {
    coverageAdequacy: PolicyHealthBreakdown
    premiumAffordability: PolicyHealthBreakdown
    maturityProgress: PolicyHealthBreakdown
    protectionMix: PolicyHealthBreakdown
    dependentCoverage: PolicyHealthBreakdown
  }
  recommendations: string[]
  summary: string
}

// Loan Against Policy Calculator
export interface LoanInput {
  planNumber: string
  sumAssured: number
  policyYear: number
  bonusAccrued?: number
}

export interface LoanResult {
  maxLoanAmount: number
  estimatedInterestRate: number
  monthlyInterest: number
  annualInterest: number
  note: string
  disclaimer: string
}
