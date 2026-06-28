import { NextRequest, NextResponse } from 'next/server'
import { getAllPlans } from '@/lib/lic-engine/plan-loader'
import { interpolateGSV } from '@/lib/lic-engine/interpolate'
import { validateParams, type ValidationSchema } from '@/lib/server-utils'

const DISCLAIMER =
  'Surrender values are indicative. Actual GSV/SSV is determined by LIC at time of surrender. Consider loan against policy before surrendering.'

// Standard GSV factor table (% of premiums paid) for plans without brochure data
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

    const surrenderSchema: ValidationSchema = {
      planNo: { type: 'number', required: true, min: 1, max: 2000 },
      sa: { type: 'number', required: true, min: 1000 },
      annualPremium: { type: 'number', required: true, min: 100 },
      yearsCompleted: { type: 'number', required: true, min: 0, max: 100 },
      ppt: { type: 'number', required: false, min: 1, max: 100 },
      term: { type: 'number', required: true, min: 1, max: 100 },
    }

    const validation = validateParams(body, surrenderSchema)
    if (!validation.success) {
      return NextResponse.json({ error: validation.error }, { status: 400 })
    }

    const { planNo, sa, annualPremium, yearsCompleted, ppt, term } = validation.data

    // Analysis calculator — all plans including withdrawn; plan optional (use fallback logic if missing)
    const allPlans = getAllPlans()
    const plan = allPlans.find(p => p.planNo === Number(planNo))

    const minYears = plan?.surrenderAfterYears ?? 3
    if (yearsCompleted < minYears) {
      return NextResponse.json(
        { error: `This plan requires at least ${minYears} years of premiums before surrender is allowed` },
        { status: 422 }
      )
    }

    const premiumsPaidYears = Math.min(yearsCompleted, ppt ?? term)
    const premiumsPaidTotal = annualPremium * premiumsPaidYears

    // GSV calculation
    let gsvFactor: number
    let rateSource: 'brochure' | 'estimated'

    if (plan?.gsvFactors && Object.keys(plan.gsvFactors).length > 0) {
      gsvFactor = interpolateGSV(plan.gsvFactors, yearsCompleted) / 100
      rateSource = 'brochure'
    } else {
      gsvFactor = fallbackGsvPct(yearsCompleted)
      rateSource = 'estimated'
    }

    const gsv = Math.round(premiumsPaidTotal * gsvFactor)

    // SSV estimate: typically 30% of paid-up SA + vested bonuses (simplified)
    const paidUpSA = Math.round(sa * (premiumsPaidYears / (ppt ?? term)))
    const ssvEstimate = Math.round(paidUpSA * 0.30)

    const payable = Math.max(gsv, ssvEstimate)

    // Loss calculation
    const lossOnSurrender = premiumsPaidTotal - payable
    const remainingYears = term - yearsCompleted

    // IRR if surrendered now (simple approximation)
    const irrIfSurrendered =
      payable > 0 && premiumsPaidTotal > 0
        ? Number(((Math.pow(payable / premiumsPaidTotal, 1 / yearsCompleted) - 1) * 100).toFixed(2))
        : 0

    let recommendation: 'HOLD' | 'SURRENDER' | 'CONSIDER_LOAN'
    if (yearsCompleted < term * 0.5) {
      recommendation = 'HOLD'
    } else if (lossOnSurrender > annualPremium * 2) {
      recommendation = 'CONSIDER_LOAN'
    } else {
      recommendation = remainingYears > 5 ? 'HOLD' : 'SURRENDER'
    }

    return NextResponse.json({
      planNo: Number(planNo),
      planName: plan?.name ?? `Plan ${planNo}`,
      premiumsPaidTotal,
      gsv,
      ssvEstimate,
      payable,
      lossOnSurrender,
      gsvFactor: Math.round(gsvFactor * 100),
      recommendation,
      irrIfSurrendered,
      rateSource,
      disclaimer: DISCLAIMER,
    })
  } catch (err) {
    console.error('[api/calculate/surrender]', err)
    return NextResponse.json({ error: 'Calculation failed' }, { status: 500 })
  }
}
