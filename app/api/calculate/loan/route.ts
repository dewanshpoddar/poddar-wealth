import { NextRequest, NextResponse } from 'next/server'
import { getAllPlans } from '@/lib/lic-engine/plan-loader'
import { interpolateGSV } from '@/lib/lic-engine/interpolate'

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
    const body = await req.json()
    const { planNo, sa, annualPremium, yearsCompleted, ppt, term } = body

    if (!planNo || !sa || !annualPremium || !yearsCompleted || !term) {
      return NextResponse.json(
        { error: 'planNo, sa, annualPremium, yearsCompleted, term are required' },
        { status: 400 }
      )
    }

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
