export interface Plan {
  id: string
  name: { en: string; hi: string }
  planNo: string
  tagline: { en: string; hi: string }
  keyBenefit: { en: string; hi: string }
  category: string
  entryAge: string
  sumAssured: string
  premiumPayment: string
  highlights: { en: string; hi: string }[]
  officialUrl: string
  status: string
}

export interface Category {
  label: { en: string; hi: string }
  tagline: { en: string; hi: string }
  icon: string
  color: string
  plans: Plan[]
}

export interface LicData {
  meta: any
  categories: Record<string, Category>
}
