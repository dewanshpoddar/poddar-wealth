// Test: curl -X POST http://localhost:3000/api/calculators/maturity \
//   -H "Content-Type: application/json" \
//   -d '{"planNumber":"915","age":30,"sumAssured":500000,"term":20,"premiumMode":"yearly"}'
import { NextRequest, NextResponse } from 'next/server'
import { checkRateLimit } from '@/lib/rate-limit'
import { logger } from '@/lib/logger'
import type { MaturityResult } from '@/lib/types/calculator'

const ROUTE = '/api/calculators/maturity'

const BONUS_RATES: Record<string, number> = {
  '915': 50, // Jeevan Anand
  '936': 54, // Jeevan Labh
  '714': 44, // New Endowment
  '745': 52, // Jeevan Umang
  '733': 48, // Jeevan Lakshya
}
const DEFAULT_BONUS_RATE = 46

const PREMIUM_MODE_FACTORS: Record<string, number> = {
  'yearly':      1,
  'half-yearly': 0.51 * 2,
  'quarterly':   0.26 * 4,
  'monthly':     0.088 * 12,
}

type PremiumMode = 'yearly' | 'half-yearly' | 'quarterly' | 'monthly'

function validateInput(body: unknown): body is {
  planNumber: string
  age: number
  sumAssured: number
  term: number
  premiumMode: PremiumMode
} {
  if (typeof body !== 'object' || body === null) return false
  const b = body as Record<string, unknown>
  const validModes: PremiumMode[] = ['yearly', 'half-yearly', 'quarterly', 'monthly']
  return (
    typeof b.planNumber === 'string' && b.planNumber.length > 0 &&
    typeof b.age === 'number' && Number.isInteger(b.age) && b.age >= 1 && b.age <= 70 &&
    typeof b.sumAssured === 'number' && b.sumAssured > 0 &&
    typeof b.term === 'number' && Number.isInteger(b.term) && b.term >= 5 && b.term <= 40 &&
    typeof b.premiumMode === 'string' && validModes.includes(b.premiumMode as PremiumMode)
  )
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') ?? 'unknown'
  const { allowed } = checkRateLimit(ip)
  if (!allowed) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  if (!validateInput(body)) {
    return NextResponse.json({
      error: 'Invalid input: planNumber, age (1-70), sumAssured, term (5-40), premiumMode (yearly/half-yearly/quarterly/monthly) required',
    }, { status: 400 })
  }

  const { planNumber, sumAssured, term, premiumMode } = body

  const bonusRate = BONUS_RATES[planNumber] ?? DEFAULT_BONUS_RATE
  const accruedBonus = Math.round(bonusRate * (sumAssured / 1000) * term)

  const estimatedFAB =
    term >= 15 ? Math.round(sumAssured * 0.05) :
    term >= 10 ? Math.round(sumAssured * 0.03) :
    0

  const estimatedMaturity = sumAssured + accruedBonus + estimatedFAB

  // Base annual premium ≈ 5% of SA (indicative)
  const baseAnnualPremium = sumAssured * 0.05
  const annualPremiumByMode = baseAnnualPremium * PREMIUM_MODE_FACTORS[premiumMode]
  const totalPremiumsPaid = Math.round(annualPremiumByMode * term)

  const effectiveReturn =
    totalPremiumsPaid > 0
      ? Math.round(((estimatedMaturity - totalPremiumsPaid) / totalPremiumsPaid) * 100)
      : 0

  logger.info(ROUTE, 'maturity calculated', {
    ip,
    planNumber,
    term,
    estimatedMaturity,
    effectiveReturn,
  })

  const result: MaturityResult = {
    totalPremiumsPaid,
    estimatedMaturity,
    accruedBonus,
    estimatedFAB,
    effectiveReturn,
    disclaimer:
      "This is an indicative calculation. Actual maturity depends on LIC's declared bonus rates which " +
      'vary annually. Contact Ajay sir for exact projections.',
  }

  return NextResponse.json(result)
}
