import { NextRequest, NextResponse } from 'next/server'
import { getPlanByNo } from '@/lib/lic-engine/plan-loader'
import { interpolateRate } from '@/lib/lic-engine/interpolate'
import { GST_RULES, MODE_REBATE, SA_REBATE, getTabularRate, getPPT, PLANS } from '@/lib/lic-plans-data.js'

import { validateParams, type ValidationSchema } from '@/lib/server-utils'

const DISCLAIMER =
  'Premium figures are indicative. Actual premium may vary. Please verify with an authorised LIC agent. IRDAI Reg No: ...'

export async function POST(req: NextRequest) {
  try {
    let body: any
    try {
      body = await req.json()
    } catch {
      return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
    }

    const premiumSchema: ValidationSchema = {
      planNo: { type: 'number', required: true, min: 1, max: 2000 },
      age: { type: 'number', required: true, min: 0, max: 120 },
      term: { type: 'number', required: true, min: 1, max: 100 },
      sa: { type: 'number', required: true, min: 1000 },
      mode: { type: 'string', required: false, enum: ['yearly', 'halfyearly', 'quarterly', 'monthly'] },
      smoker: { type: 'boolean', required: false },
      gender: { type: 'string', required: false, enum: ['male', 'female'] }
    }

    const validation = validateParams(body, premiumSchema)
    if (!validation.success) {
      return NextResponse.json({ error: validation.error }, { status: 400 })
    }

    const { planNo, age, term, sa, mode = 'yearly', smoker = false, gender = 'male' } = validation.data

    // Look up in legacy JS first (always available, 123 plans)
    const legacyPlan = PLANS.find((p: { planNo: number }) => p.planNo === Number(planNo))
    if (!legacyPlan) {
      return NextResponse.json({ error: 'Plan not found' }, { status: 404 })
    }
    const ppt = getPPT(legacyPlan, term, age)

    // Supabase → KB fallback for bilinear interpolation
    const plan = await getPlanByNo(Number(planNo))

    let rate: number
    let rateSource: 'brochure' | 'estimated'

    if (plan?.tabularRates && Object.keys(plan.tabularRates).length > 0) {
      rate = interpolateRate(plan.tabularRates, age, term)
      rateSource = 'brochure'
    } else {
      rate = getTabularRate(Number(planNo), age, term)
      rateSource = 'estimated'
    }

    let basePremium = (rate * sa) / 1000

    // Adjustments
    const category = plan?.category ?? (legacyPlan as any).category ?? ''
    if (smoker && category === 'term') basePremium *= 1.25
    if (gender === 'female' && category === 'term') basePremium *= 0.925

    const modeRebatePct: number = MODE_REBATE[mode] || 0
    const modeRebateAmt = basePremium * modeRebatePct
    const saRebatePer1000: number = SA_REBATE(sa)
    const saRebateAmt = (saRebatePer1000 * sa) / 1000
    const netPremium = basePremium - modeRebateAmt - saRebateAmt

    // GST
    const gstCategory = (legacyPlan as any)?.gstCategory ?? 'endowment'
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
      planNo: Number(planNo),
      planName: plan?.name ?? (legacyPlan as any).name,
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
