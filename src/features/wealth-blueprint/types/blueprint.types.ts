export type Employment = 'salaried' | 'freelance' | 'business'
export type CityTier   = 'metro' | 'tier2' | 'tier3'
export type Goal       = 'home' | 'education' | 'retire' | 'wealth' | 'health' | 'travel'

export interface WealthProfile {
  age: number
  monthlyIncome: number
  employment: Employment
  cityTier: CityTier
  isMarried: boolean
  spouseIncomeL: number
  children: number
  childAges: number[]
  hasAgedParents: boolean
  existingLifeCoverL: number
  existingHealthL: number
  homeLoanL: number
  otherLoansL: number
  equityL: number
  debtSavingsL: number
  realEstateL: number
  retirementAge: number
  goals: Goal[]
}
