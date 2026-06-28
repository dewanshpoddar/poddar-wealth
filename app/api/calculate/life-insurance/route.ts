import { NextRequest, NextResponse } from 'next/server'

const DISCLAIMER =
  'Coverage need is an estimate using the Human Life Value (HLV) method. Actual requirement may vary. This is not a recommendation to purchase any specific policy.'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      monthlyIncome,
      age,
      dependents = 2,
      method = 'simple',
      existingCover = 0,
      outstandingLoans = 0,
      educationFund = 0,
      spouseWorking = false,
    } = body

    if (!monthlyIncome || !age) {
      return NextResponse.json({ error: 'monthlyIncome and age are required' }, { status: 400 })
    }

    const annualIncome = monthlyIncome * 12
    const loans = Number(outstandingLoans)
    const education = Number(educationFund)
    const existing = Number(existingCover)
    const emergency = Math.round(annualIncome * 0.5)

    let totalNeeded: number
    let incomeReplacement: number
    let dependentSupport: number = 0

    if (method === 'simple') {
      totalNeeded = annualIncome * 15
      incomeReplacement = totalNeeded
    } else {
      const yearsTo60 = Math.max(60 - Number(age), 5)
      incomeReplacement = Math.round(annualIncome * yearsTo60 * 0.7)
      const spouseFactor = spouseWorking ? 0.7 : 1.0
      dependentSupport = Math.round(Number(dependents) * annualIncome * 2 * spouseFactor)
      totalNeeded = incomeReplacement + dependentSupport + loans + education + emergency
    }

    const recommendedCover = Math.max(totalNeeded, 0)
    const coverageGap = Math.max(recommendedCover - existing, 0)
    const estimatedTermCostMonthly = coverageGap > 0 ? Math.round(coverageGap * 0.000125) : 0
    const coverageMultiple = annualIncome > 0 ? Math.round((recommendedCover / annualIncome) * 10) / 10 : 0

    return NextResponse.json({
      recommendedCover,
      coverageGap,
      existingCover: existing,
      incomeReplacement,
      dependentSupport,
      outstandingLoans: loans,
      educationFund: education,
      emergencyFund: method === 'hlv' ? emergency : 0,
      annualIncome,
      coverageMultiple,
      estimatedTermCostMonthly,
      method,
      isAdequate: existing >= recommendedCover,
      disclaimer: DISCLAIMER,
    })
  } catch (err) {
    console.error('[api/calculate/life-insurance]', err)
    return NextResponse.json({ error: 'Calculation failed' }, { status: 500 })
  }
}
