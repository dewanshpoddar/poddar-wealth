import { NextRequest, NextResponse } from 'next/server'
import { getPlanByNo } from '@/lib/lic-engine/plan-loader'
import licData from '@/lib/lic-plans-data.js'
const { BONUS_RATES_2026 } = (licData as any) ?? {}

import { validateParams, type ValidationSchema } from '@/lib/server-utils'

const DISCLAIMER =
  'Paid-up values are indicative. Actual paid-up benefits depend on LIC assessment at time of request. Future bonus accrual stops on paid-up conversion.'

export async function POST(req: NextRequest) {
  try {
    let body: any
    try {
      body = await req.json()
    } catch {
      return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
    }

    const paidUpSchema: ValidationSchema = {
      planNo: { type: 'number', required: true, min: 1, max: 2000 },
      sa: { type: 'number', required: true, min: 1000 },
      yearsCompleted: { type: 'number', required: true, min: 0, max: 100 },
      ppt: { type: 'number', required: false, min: 1, max: 100 },
      term: { type: 'number', required: true, min: 1, max: 100 },
    }

    const validation = validateParams(body, paidUpSchema)
    if (!validation.success) {
      return NextResponse.json({ error: validation.error }, { status: 400 })
    }

    const { planNo, sa, yearsCompleted, ppt, term } = validation.data

    const plan = await getPlanByNo(Number(planNo))
    // plan optional — fall back gracefully if not in KB

    const minYears = plan?.surrenderAfterYears ?? 3
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
    const bonusRatePer1000 = plan?.bonusRateFY25 ?? bonusData?.srb ?? bonusData?.ga ?? null
    if (bonusRatePer1000 !== null) {
      vestedBonuses = Math.round((bonusRatePer1000 * sa / 1000) * yearsCompleted)
    }

    // Death benefit on paid-up policy = paid-up SA + vested bonuses (no future bonus)
    const deathBenefitPaidUp = paidUpSA + vestedBonuses

    // Maturity on paid-up policy = paid-up SA + vested bonuses (FAB typically not applicable)
    const maturityPaidUp = paidUpSA + vestedBonuses

    return NextResponse.json({
      planNo: Number(planNo),
      planName: plan?.name ?? `Plan ${planNo}`,
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
