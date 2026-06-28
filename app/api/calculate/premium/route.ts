import { NextRequest, NextResponse } from 'next/server'
import { getActivePlans } from '@/lib/lic-engine/plan-loader'
import { interpolateRate } from '@/lib/lic-engine/interpolate'
import licData from '@/lib/lic-plans-data.js'
const { GST_RULES, MODE_REBATE, SA_REBATE, getTabularRate, getPPT, PLANS } = licData as any

const DISCLAIMER =
  'Premium figures are indicative. Actual premium may vary. Please verify with an authorised LIC agent. IRDAI Reg No: ...'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { planNo, age, term, sa, mode = 'yearly', smoker = false, gender = 'male' } = body

    if (!planNo || !age || !term || !sa) {
      return NextResponse.json({ error: 'planNo, age, term, sa are required' }, { status: 400 })
    }

    // Validate: decision calculator — active plans only
    const activePlans = getActivePlans()
    const plan = activePlans.find(p => p.planNo === Number(planNo))
    if (!plan) {
      return NextResponse.json({ error: 'Plan not found or not currently active' }, { status: 404 })
    }

    // Validate eligibility
    if (plan.minAge !== null && age < plan.minAge) {
      return NextResponse.json({ error: `Minimum entry age for this plan is ${plan.minAge}` }, { status: 422 })
    }
    if (plan.maxAge !== null && age > plan.maxAge) {
      return NextResponse.json({ error: `Maximum entry age for this plan is ${plan.maxAge}` }, { status: 422 })
    }

    // Compute PPT from legacy JS (handles all ppt variants)
    const legacyPlan = PLANS.find((p: { planNo: number }) => p.planNo === Number(planNo))
    if (!legacyPlan) {
      return NextResponse.json({ error: 'Plan not found in rate table' }, { status: 404 })
    }
    const ppt = getPPT(legacyPlan!, term, age)

    let rate: number
    let rateSource: 'brochure' | 'estimated'

    // Try bilinear interpolation from lic-kb-live.json tabular rates
    if (plan.tabularRates && Object.keys(plan.tabularRates).length > 0) {
      rate = interpolateRate(plan.tabularRates, age, term)
      rateSource = 'brochure'
    } else {
      // Fall back to sparse table nearest-neighbour from lic-plans-data.js
      rate = getTabularRate(Number(planNo), age, term)
      rateSource = 'estimated'
    }

    let basePremium = (rate * sa) / 1000

    // Adjustments
    if (smoker && plan.category === 'term') basePremium *= 1.25
    if (gender === 'female' && plan.category === 'term') basePremium *= 0.925

    const modeRebatePct: number = MODE_REBATE[mode] || 0
    const modeRebateAmt = basePremium * modeRebatePct
    const saRebatePer1000: number = SA_REBATE(sa)
    const saRebateAmt = (saRebatePer1000 * sa) / 1000
    const netPremium = basePremium - modeRebateAmt - saRebateAmt

    // GST
    const gstCategory = (legacyPlan as { gstCategory?: string })?.gstCategory ?? 'endowment'
    const gstRules: { year1: number; year2plus?: number } =
      GST_RULES[gstCategory] || GST_RULES.endowment
    const gst1 = netPremium * gstRules.year1
    const gst2 = netPremium * (gstRules.year2plus || 0)

    const yearlyYear1 = Math.round(netPremium + gst1)
    const yearlyYear2 = Math.round(netPremium + gst2)

    const modeDiv: Record<string, number> = { yearly: 1, halfyearly: 2, quarterly: 4, monthly: 12 }
    const div = modeDiv[mode] || 1
    const instalment1 = Math.round(yearlyYear1 / div)
    const instalment2 = Math.round(yearlyYear2 / div)
    const totalPaid = yearlyYear1 + yearlyYear2 * (ppt - 1)

    return NextResponse.json({
      planNo: plan.planNo,
      planName: plan.name,
      basePremium: Math.round(basePremium),
      modeRebate: Math.round(modeRebateAmt),
      modeRebatePct: modeRebatePct * 100,
      saRebate: Math.round(saRebateAmt),
      saRebatePer1000,
      netPremium: Math.round(netPremium),
      gstYear1: Math.round(gst1),
      gstYear2: Math.round(gst2),
      gstPctYear1: gstRules.year1 * 100,
      gstPctYear2: (gstRules.year2plus || 0) * 100,
      yearlyYear1,
      yearlyYear2plus: yearlyYear2,
      instalment1,
      instalment2,
      totalPaid: Math.round(totalPaid),
      ppt,
      rateSource,
      disclaimer: DISCLAIMER,
    })
  } catch (err) {
    console.error('[api/calculate/premium]', err)
    return NextResponse.json({ error: 'Calculation failed' }, { status: 500 })
  }
}
