import { NextRequest, NextResponse } from 'next/server'
import { getActivePlans } from '@/lib/lic-engine/plan-loader'
import licData from '@/lib/lic-plans-data.js'
const { BONUS_RATES_2026 } = (licData as any) ?? {}

const DISCLAIMER =
  'Maturity projections are indicative and based on current bonus rates declared by LIC. Actual bonus declarations may vary each year. Not a guaranteed return.'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { planNo, sa, term } = body

    if (!planNo || !sa || !term) {
      return NextResponse.json({ error: 'planNo, sa, term are required' }, { status: 400 })
    }

    // KB lookup optional — fall back to BONUS_RATES_2026 if plan not in KB
    const activePlans = getActivePlans()
    const plan = activePlans.find(p => p.planNo === Number(planNo))

    let bonusRatePer1000: number | null = plan?.bonusRateFY25 ?? null
    let fabRatePer1000: number | null = plan?.fabRate ?? null
    let bonusSource: 'live_kb' | 'estimated' = plan ? 'live_kb' : 'estimated'

    if (bonusRatePer1000 === null) {
      const legacy = BONUS_RATES_2026?.[Number(planNo)]
      if (legacy) {
        bonusRatePer1000 = legacy.srb ?? legacy.ga ?? null
        fabRatePer1000 = legacy.fab ?? null
      }
      bonusSource = 'estimated'
    }

    let totalSRB = 0
    let fabEstimate = 0

    if (bonusRatePer1000 !== null) {
      totalSRB = Math.round((bonusRatePer1000 * sa / 1000) * term)
    }
    if (fabRatePer1000 !== null) {
      fabEstimate = Math.round(fabRatePer1000 * sa / 1000)
    }

    const totalMaturity = sa + totalSRB + fabEstimate

    return NextResponse.json({
      planNo: Number(planNo),
      planName: plan?.name ?? `Plan ${planNo}`,
      basicSA: sa,
      totalSRB,
      fabEstimate,
      totalMaturity,
      years: term,
      bonusRateUsed: bonusRatePer1000 ?? 0,
      bonusSource,
      disclaimer: DISCLAIMER,
    })
  } catch (err) {
    console.error('[api/calculate/maturity]', err)
    return NextResponse.json({ error: 'Calculation failed' }, { status: 500 })
  }
}
