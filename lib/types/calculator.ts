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
