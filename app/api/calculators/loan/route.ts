// Test: curl -X POST http://localhost:3000/api/calculators/loan \
//   -H "Content-Type: application/json" \
//   -d '{"planNumber":"915","sumAssured":500000,"policyYear":5,"bonusAccrued":50000}'
import { NextRequest, NextResponse } from 'next/server'
import { checkRateLimit } from '@/lib/rate-limit'
import { logger } from '@/lib/logger'
import { ADVISOR_PHONE } from '@/lib/constants'
import type { LoanResult } from '@/lib/types/calculator'

const ROUTE = '/api/calculators/loan'
const INTEREST_RATE = 0.095

function validateInput(body: unknown): body is {
  planNumber: string
  sumAssured: number
  policyYear: number
  bonusAccrued?: number
} {
  if (typeof body !== 'object' || body === null) return false
  const b = body as Record<string, unknown>
  return (
    typeof b.planNumber === 'string' && b.planNumber.length > 0 &&
    typeof b.sumAssured === 'number' && b.sumAssured > 0 &&
    typeof b.policyYear === 'number' && Number.isInteger(b.policyYear) && b.policyYear > 0 &&
    (b.bonusAccrued === undefined || (typeof b.bonusAccrued === 'number' && b.bonusAccrued >= 0))
  )
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') ?? 'unknown'
  const { allowed } = await checkRateLimit(ip, 15, 3600, 'rl-calc-loan')
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
      error: 'Invalid input: planNumber, sumAssured, policyYear required; bonusAccrued optional',
    }, { status: 400 })
  }

  const { sumAssured, policyYear, bonusAccrued = 0 } = body

  if (policyYear < 3) {
    return NextResponse.json(
      { error: 'Loan against policy requires at least 3 completed policy years.' },
      { status: 400 }
    )
  }

  // GSV formula (annual premium estimated at 5% of SA)
  const annualPremium = sumAssured * 0.05
  const totalPremiumsPaid = annualPremium * policyYear
  const eligiblePremiums = totalPremiumsPaid - annualPremium
  const gsvRate = 0.30 + (policyYear - 3) * 0.02
  const gsv = eligiblePremiums * gsvRate

  const loanBase = gsv + bonusAccrued
  const maxLoanAmount = Math.round(loanBase * 0.90)
  const annualInterest = Math.round(maxLoanAmount * INTEREST_RATE)
  const monthlyInterest = Math.round(annualInterest / 12)

  logger.info(ROUTE, 'loan calculated', {
    ip,
    policyYear,
    maxLoanAmount,
    annualInterest,
  })

  const result: LoanResult = {
    maxLoanAmount,
    estimatedInterestRate: INTEREST_RATE * 100,
    monthlyInterest,
    annualInterest,
    note: `Exact loan amount depends on policy status and current LIC guidelines. Contact Ajay sir at ${ADVISOR_PHONE}.`,
    disclaimer:
      'This is an estimate based on LIC general guidelines. Actual loan eligibility is determined by LIC branch after policy verification.',
  }

  return NextResponse.json(result)
}
