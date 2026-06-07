export interface PolicyAnalysis {
  policyType: string
  policyNumber: string
  sumAssured: string
  premium: string
  startDate: string
  maturityDate: string
  nominee: string
  status: string
  bonusAccrued: string
  loanOutstanding: string
  benefits: string
  summary: string
  recommendation: string
}

export interface AnalyzerResponse {
  success: true
  analysis: PolicyAnalysis
  disclaimer: string
}

export interface AnalyzerError {
  success: false
  error: string
}
