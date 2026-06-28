import { NextRequest, NextResponse } from 'next/server'
import { getAllPlans } from '@/lib/lic-engine/plan-loader'
import licData from '@/lib/lic-plans-data.js'
const { BONUS_RATES_2026 } = licData as any

const DISCLAIMER =
  'Paid-up values are indicative. Actual paid-up benefits depend on LIC assessment at time of request. Future bonus accrual stops on paid-up conversion.'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { planNo, sa, yearsCompleted, ppt, term } = body

    if (!planNo || !sa || !yearsCompleted || !term) {
      return NextResponse.json(
        { error: 'planNo, sa, yearsCompleted, term are required' },
        { status: 400 }
      )
    }

    const allPlans = getAllPlans()
    const plan = allPlans.find(p => p.planNo === Number(planNo))
    if (!plan) {
      return NextResponse.json({ error: 'Plan not found' }, { status: 404 })
    }

    const minYears = plan.surrenderAfterYears ?? 3
    if (yearsCompleted < minYears) {
      return NextResponse.json(
        { error: `Policy must be in force for at least ${minYears} years to convert to paid-up` },
        { status: 422 }
      )
    }

    const effectivePPT = ppt ?? term
    const yearsRatio = Math.min(yearsCompleted, effectivePPT) / effectivePPT

    // Paid-up SA = original SA × (years paid / PPT)
    const paidUpSA = Math.round(sa * yearsRatio)

    // Vested bonuses accrued up to paid-up date
    let vestedBonuses = 0
    const bonusData = BONUS_RATES_2026[Number(planNo)]
    const bonusRatePer1000 = plan.bonusRateFY25 ?? bonusData?.srb ?? bonusData?.ga ?? null
    if (bonusRatePer1000 !== null) {
      vestedBonuses = Math.round((bonusRatePer1000 * sa / 1000) * yearsCompleted)
    }

    // Death benefit on paid-up policy = paid-up SA + vested bonuses (no future bonus)
    const deathBenefitPaidUp = paidUpSA + vestedBonuses

    // Maturity on paid-up policy = paid-up SA + vested bonuses (FAB typically not applicable)
    const maturityPaidUp = paidUpSA + vestedBonuses

    return NextResponse.json({
      planNo: plan.planNo,
      planName: plan.name,
      originalSA: sa,
      paidUpSA,
      yearsRatio: Math.round(yearsRatio * 100),
      vestedBonuses,
      deathBenefitPaidUp,
      maturityPaidUp,
      note: 'No new bonuses will accrue after paid-up conversion. Policy remains in force for death benefit.',
      disclaimer: DISCLAIMER,
    })
  } catch (err) {
    console.error('[api/calculate/paid-up]', err)
    return NextResponse.json({ error: 'Calculation failed' }, { status: 500 })
  }
}
