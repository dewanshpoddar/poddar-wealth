import { NextRequest, NextResponse } from 'next/server'
import { getAllPlans } from '@/lib/lic-engine/plan-loader'
import { interpolateGSV } from '@/lib/lic-engine/interpolate'

import { validateParams, type ValidationSchema } from '@/lib/server-utils'

const DISCLAIMER =
  'Loan eligibility is indicative. Actual loan amount depends on surrender value at time of application. Interest is charged at LIC declared rate.'

function fallbackGsvPct(policyYear: number): number {
  if (policyYear < 3) return 0
  if (policyYear <= 3) return 0.30
  if (policyYear <= 5) return 0.50
  if (policyYear <= 7) return 0.55
  if (policyYear <= 9) return 0.60
  if (policyYear <= 11) return 0.65
  if (policyYear <= 13) return 0.70
  if (policyYear <= 15) return 0.80
  return 0.90
}

export async function POST(req: NextRequest) {
  try {
    let body: any
    try {
      body = await req.json()
    } catch {
      return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
    }

    const loanSchema: ValidationSchema = {
      planNo: { type: 'number', required: true, min: 1, max: 2000 },
      sa: { type: 'number', required: true, min: 1000 },
      annualPremium: { type: 'number', required: true, min: 100 },
      yearsCompleted: { type: 'number', required: true, min: 0, max: 100 },
      ppt: { type: 'number', required: false, min: 1, max: 100 },
      term: { type: 'number', required: true, min: 1, max: 100 },
    }

    const validation = validateParams(body, loanSchema)
    if (!validation.success) {
      return NextResponse.json({ error: validation.error }, { status: 400 })
    }

    const { planNo, sa, annualPremium, yearsCompleted, ppt, term } = validation.data

    const allPlans = getAllPlans()
    const plan = allPlans.find(p => p.planNo === Number(planNo))
    // plan is optional — fall back gracefully if not in KB

    const minYears = plan?.surrenderAfterYears ?? 3
    if (yearsCompleted < minYears) {
      return NextResponse.json(
        { error: `Loan available only after ${minYears} years of premium payment` },
        { status: 422 }
      )
    }

    const premiumsPaidYears = Math.min(yearsCompleted, ppt ?? term)
    const premiumsPaidTotal = annualPremium * premiumsPaidYears

    let gsvFactor: number
    let rateSource: 'brochure' | 'estimated'

    if (plan?.gsvFactors && Object.keys(plan.gsvFactors).length > 0) {
      gsvFactor = interpolateGSV(plan.gsvFactors, yearsCompleted) / 100
      rateSource = 'brochure'
    } else {
      gsvFactor = fallbackGsvPct(yearsCompleted)
      rateSource = 'estimated'
    }

    const surrenderValueBasis = Math.round(premiumsPaidTotal * gsvFactor)

    // LIC loans: up to 90% of surrender value (plan.loanMaxPct or 90)
    const loanPct = (plan?.loanMaxPct ?? 90) / 100
    const maxLoan = Math.round(surrenderValueBasis * loanPct)

    // Interest rate from plan data or LIC standard rate
    const interestRate = plan?.loanInterestRate ?? 9.0
    const monthlyInterest = Math.round((maxLoan * (interestRate / 100)) / 12)

    return NextResponse.json({
      planNo: Number(planNo),
      planName: plan?.name ?? `Plan ${planNo}`,
      surrenderValueBasis,
      maxLoan,
      loanMaxPct: plan?.loanMaxPct ?? 90,
      interestRate,
      monthlyInterest,
      annualInterest: monthlyInterest * 12,
      rateSource,
      disclaimer: DISCLAIMER,
    })
  } catch (err) {
    console.error('[api/calculate/loan]', err)
    return NextResponse.json({ error: 'Calculation failed' }, { status: 500 })
  }
}
