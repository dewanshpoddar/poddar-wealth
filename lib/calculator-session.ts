const SESSION_KEY = 'pw-calc-session'

export interface CalculatorSession {
  age?: number
  sumAssured?: number
  policyTerm?: number
  annualIncome?: number
  monthlyExpenses?: number

  phone?: string
  name?: string
  email?: string
  dob?: string

  results: {
    premium?: { amount: number; plan: string; frequency: string }
    maturity?: { value: number; totalPaid: number; netGain: number }
    coverage?: { need: number; gap: number; existing: number }
    retirement?: { corpus: number; monthlySip: number }
    surrender?: { value: number; loss: number; loanAlternative: number }
    loan?: { maxLoan: number; surrenderValue: number }
    healthScore?: { score: number; grade: string }
  }

  calculatorsUsed: string[]
  firstCalcAt?: string
  lastCalcAt?: string
}

const EMPTY_SESSION: CalculatorSession = { results: {}, calculatorsUsed: [] }

// Module-level fallback when sessionStorage is unavailable (SSR, incognito edge cases)
let memoryFallback: CalculatorSession | null = null

function isStorageAvailable(): boolean {
  if (typeof window === 'undefined') return false
  try {
    const k = '__pw_test__'
    sessionStorage.setItem(k, '1')
    sessionStorage.removeItem(k)
    return true
  } catch {
    return false
  }
}

export function getSession(): CalculatorSession {
  if (isStorageAvailable()) {
    try {
      const raw = sessionStorage.getItem(SESSION_KEY)
      if (raw) return { ...EMPTY_SESSION, ...JSON.parse(raw) }
    } catch {
      // corrupt data — reset
    }
  }
  return memoryFallback ?? { ...EMPTY_SESSION }
}

export function updateSession(partial: Partial<CalculatorSession>): void {
  const current = getSession()
  const next: CalculatorSession = {
    ...current,
    ...partial,
    results: { ...current.results, ...(partial.results ?? {}) },
    calculatorsUsed: partial.calculatorsUsed ?? current.calculatorsUsed,
  }
  if (isStorageAvailable()) {
    try {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(next))
      return
    } catch {
      // quota exceeded — fall through to memory
    }
  }
  memoryFallback = next
}

export function getSharedInputs(): Pick<
  CalculatorSession,
  'age' | 'sumAssured' | 'policyTerm' | 'annualIncome' | 'monthlyExpenses'
> {
  const s = getSession()
  return {
    age: s.age,
    sumAssured: s.sumAssured,
    policyTerm: s.policyTerm,
    annualIncome: s.annualIncome,
    monthlyExpenses: s.monthlyExpenses,
  }
}

export function addResult(calculator: string, result: Record<string, unknown>): void {
  const current = getSession()
  const now = new Date().toISOString()
  const used = current.calculatorsUsed.includes(calculator)
    ? current.calculatorsUsed
    : [...current.calculatorsUsed, calculator]

  updateSession({
    results: { ...current.results, [calculator]: result } as CalculatorSession['results'],
    calculatorsUsed: used,
    firstCalcAt: current.firstCalcAt ?? now,
    lastCalcAt: now,
  })
}

export function getLeadInfo(): Pick<CalculatorSession, 'phone' | 'name' | 'email' | 'dob'> | null {
  const s = getSession()
  if (!s.phone) return null
  return { phone: s.phone, name: s.name, email: s.email, dob: s.dob }
}

export function hasCompletedMultiple(): boolean {
  return getSession().calculatorsUsed.length >= 2
}
