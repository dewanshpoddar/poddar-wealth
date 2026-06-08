export interface WealthBlueprintInput {
  name: string
  age: number
  income: number
  existingCover: number
  existingPolicies: number
  hasTerm: boolean
  hasHealth: boolean
  hasPension: boolean
  dependents: number
  loans: number
}

export interface ScoreCategory {
  name: string
  score: number
  maxScore: number
  comment: string
}

export interface WealthBlueprintResults {
  totalScore: number
  maxScore: number
  grade: string
  categories: ScoreCategory[]
  recommendations: string[]
}

export interface WealthBlueprintReportInput extends WealthBlueprintInput {
  results: WealthBlueprintResults
}
