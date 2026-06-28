import { NextRequest, NextResponse } from 'next/server'

import { validateParams, type ValidationSchema } from '@/lib/server-utils'

const DISCLAIMER =
  'Coverage need is an estimate using the Human Life Value (HLV) method. Actual requirement may vary. This is not a recommendation to purchase any specific policy.'

export async function POST(req: NextRequest) {
  try {
    let body: any
    try {
      body = await req.json()
    } catch {
      return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
    }

    const lifeInsuranceSchema: ValidationSchema = {
      monthlyIncome: { type: 'number', required: true, min: 100 },
      age: { type: 'number', required: true, min: 18, max: 120 },
      dependents: { type: 'number', required: false, min: 0, max: 20 },
      method: { type: 'string', required: false, enum: ['simple', 'hlv'] },
      existingCover: { type: 'number', required: false, min: 0 },
      outstandingLoans: { type: 'number', required: false, min: 0 },
      educationFund: { type: 'number', required: false, min: 0 },
      spouseWorking: { type: 'boolean', required: false },
    }

    const validation = validateParams(body, lifeInsuranceSchema)
    if (!validation.success) {
      return NextResponse.json({ error: validation.error }, { status: 400 })
    }

    const {
      monthlyIncome,
      age,
      dependents = 2,
      method = 'simple',
      existingCover = 0,
      outstandingLoans = 0,
      educationFund = 0,
      spouseWorking = false,
    } = validation.data

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
