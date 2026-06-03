// Test: curl -X POST http://localhost:3000/api/calculators/surrender-value \
//   -H "Content-Type: application/json" \
//   -d '{"planNumber":"915","sumAssured":500000,"premiumsPaid":150000,"policyYear":5,"annualPremium":30000}'
import { NextRequest, NextResponse } from 'next/server'
import { checkRateLimit } from '@/lib/rate-limit'
import { logger } from '@/lib/logger'
import type { SurrenderValueResult } from '@/lib/types/calculator'

const ROUTE = '/api/calculators/surrender-value'

function validateInput(body: unknown): body is {
  planNumber: string
  sumAssured: number
  premiumsPaid: number
  policyYear: number
  annualPremium: number
} {
  if (typeof body !== 'object' || body === null) return false
  const b = body as Record<string, unknown>
  return (
    typeof b.planNumber === 'string' && b.planNumber.length > 0 &&
    typeof b.sumAssured === 'number' && b.sumAssured > 0 &&
    typeof b.premiumsPaid === 'number' && b.premiumsPaid > 0 &&
    typeof b.policyYear === 'number' && Number.isInteger(b.policyYear) && b.policyYear > 0 &&
    typeof b.annualPremium === 'number' && b.annualPremium > 0
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
    return NextResponse.json({ error: 'Invalid input: planNumber, sumAssured, premiumsPaid, policyYear, annualPremium are required' }, { status: 400 })
  }

  const { sumAssured, premiumsPaid, policyYear, annualPremium } = body

  if (policyYear < 3) {
    return NextResponse.json(
      { error: 'Policy cannot be surrendered before completing 3 years of premium payments.' },
      { status: 400 }
    )
  }

  // GSV uses premiums excluding 1st year
  const eligiblePremiums = premiumsPaid - annualPremium
  const gsvRate = 0.30 + (policyYear - 3) * 0.02
  const guaranteedSurrenderValue = Math.round(eligiblePremiums * gsvRate)

  // Estimated paid-up value (proxy for SSV base — assume 20-year term)
  const estimatedPaidUpValue = Math.round((sumAssured * policyYear) / 20)

  const surrenderRatio = premiumsPaid > 0 ? guaranteedSurrenderValue / premiumsPaid : 0

  const recommendation =
    surrenderRatio < 0.7
      ? "Don't surrender — you'll lose 30%+ of your investment. Consider paid-up or loan instead."
      : 'Surrender value is reasonable but consider holding to maturity for full benefit.'

  logger.info(ROUTE, 'surrender-value calculated', {
    ip,
    policyYear,
    guaranteedSurrenderValue,
    surrenderRatio: surrenderRatio.toFixed(2),
  })

  const result: SurrenderValueResult = {
    guaranteedSurrenderValue,
    estimatedPaidUpValue,
    totalPremiumsPaid: premiumsPaid,
    surrenderRatio: Math.round(surrenderRatio * 100) / 100,
    recommendation,
    disclaimer:
      'Special Surrender Value is usually higher than GSV. ' +
      'Contact Ajay sir at 9415313434 for exact calculation. ' +
      'This estimate is based on LIC general guidelines and may vary by plan.',
  }

  return NextResponse.json(result)
}
