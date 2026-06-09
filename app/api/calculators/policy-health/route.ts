// Test: curl -X POST http://localhost:3000/api/calculators/policy-health \
//   -H "Content-Type: application/json" \
//   -d '{"sumAssured":1000000,"annualPremium":50000,"policyYear":5,"currentAge":35,"annualIncome":600000,"dependents":2,"hasHealthInsurance":true,"hasTermInsurance":false,"planType":"endowment"}'
import { NextRequest, NextResponse } from 'next/server'
import { checkRateLimit } from '@/lib/rate-limit'
import { logger } from '@/lib/logger'
import type { PolicyHealthResult } from '@/lib/types/calculator'

const ROUTE = '/api/calculators/policy-health'
const ADVISOR_PHONE = '9415313434'

type PlanType = 'endowment' | 'term' | 'ulip' | 'money-back' | 'whole-life'

function validateInput(body: unknown): body is {
  sumAssured: number
  annualPremium: number
  policyYear: number
  currentAge: number
  annualIncome: number
  dependents: number
  hasHealthInsurance: boolean
  hasTermInsurance: boolean
  planType: PlanType
} {
  if (typeof body !== 'object' || body === null) return false
  const b = body as Record<string, unknown>
  const validPlanTypes: PlanType[] = ['endowment', 'term', 'ulip', 'money-back', 'whole-life']
  return (
    typeof b.sumAssured === 'number' && b.sumAssured > 0 &&
    typeof b.annualPremium === 'number' && b.annualPremium > 0 &&
    typeof b.policyYear === 'number' && Number.isInteger(b.policyYear) && b.policyYear >= 0 &&
    typeof b.currentAge === 'number' && Number.isInteger(b.currentAge) && b.currentAge >= 18 && b.currentAge <= 80 &&
    typeof b.annualIncome === 'number' && b.annualIncome > 0 &&
    typeof b.dependents === 'number' && Number.isInteger(b.dependents) && b.dependents >= 0 &&
    typeof b.hasHealthInsurance === 'boolean' &&
    typeof b.hasTermInsurance === 'boolean' &&
    typeof b.planType === 'string' && validPlanTypes.includes(b.planType as PlanType)
  )
}

function toINR(amount: number): string {
  if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)} crore`
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)} lakh`
  return `₹${Math.round(amount).toLocaleString('en-IN')}`
}

function getGrade(score: number): 'A+' | 'A' | 'B' | 'C' | 'D' {
  if (score >= 90) return 'A+'
  if (score >= 80) return 'A'
  if (score >= 65) return 'B'
  if (score >= 50) return 'C'
  return 'D'
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') ?? 'unknown'
  const { allowed } = await checkRateLimit(ip, 15, 3600, 'rl-calc-policy-health')
  if (!allowed) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  if (!validateInput(body)) {
    return NextResponse.json({
      error: 'Invalid input. Required: sumAssured, annualPremium, policyYear, currentAge (18-80), annualIncome, dependents, hasHealthInsurance, hasTermInsurance, planType',
    }, { status: 400 })
  }

  const { sumAssured, annualPremium, policyYear, currentAge, annualIncome, dependents, hasHealthInsurance, hasTermInsurance } = body

  // ── 1. Coverage Adequacy (35 pts) ────────────────────────────────────────────
  const idealCover = annualIncome * 10
  const coverageRatio = sumAssured / idealCover
  const coverageScore = Math.min(35, Math.round(coverageRatio * 35))
  const coveragePct = Math.round(coverageRatio * 100)
  const coverageComment = coverageRatio >= 1
    ? `Your cover is ${coveragePct}% of the recommended ${toINR(idealCover)}. Well protected.`
    : `Your cover is only ${coveragePct}% of the recommended ${toINR(idealCover)}. Consider a top-up term plan.`

  // ── 2. Premium Affordability (20 pts) ────────────────────────────────────────
  const premiumRatio = annualPremium / annualIncome
  let affordabilityScore: number
  let affordabilityComment: string
  if (premiumRatio <= 0.05) {
    affordabilityScore = 20
    affordabilityComment = `You spend ${(premiumRatio * 100).toFixed(1)}% of income on premium. Very affordable.`
  } else if (premiumRatio <= 0.10) {
    affordabilityScore = 15
    affordabilityComment = `You spend ${(premiumRatio * 100).toFixed(1)}% of income on premium. Moderate but manageable.`
  } else if (premiumRatio <= 0.15) {
    affordabilityScore = 10
    affordabilityComment = `You spend ${(premiumRatio * 100).toFixed(1)}% of income on premium. Consider reviewing if you have multiple policies.`
  } else {
    affordabilityScore = 5
    affordabilityComment = `You spend ${(premiumRatio * 100).toFixed(1)}% of income on premium. This is high. Review your portfolio.`
  }

  // ── 3. Policy Maturity Progress (15 pts) ─────────────────────────────────────
  let maturityScore: number
  let maturityComment: string
  if (policyYear >= 10) {
    maturityScore = 15
    maturityComment = `${policyYear} years paid. Your policy has strong surrender value and loan eligibility.`
  } else if (policyYear >= 5) {
    maturityScore = 10
    maturityComment = `${policyYear} years paid. Good progress. Keep going.`
  } else if (policyYear >= 3) {
    maturityScore = 7
    maturityComment = `${policyYear} years paid. Don't surrender now — you're past the critical early period.`
  } else {
    maturityScore = 3
    maturityComment = `Only ${policyYear} year${policyYear === 1 ? '' : 's'} paid. Never surrender at this stage — you'll lose all premium.`
  }

  // ── 4. Protection Mix (20 pts) ───────────────────────────────────────────────
  const protectionScore = (hasTermInsurance ? 10 : 0) + (hasHealthInsurance ? 10 : 0)
  let protectionComment: string
  if (protectionScore === 20) {
    protectionComment = 'You have both term and health insurance. Good foundation.'
  } else if (hasTermInsurance && !hasHealthInsurance) {
    protectionComment = 'You have term cover but no health insurance. Add a health floater immediately.'
  } else if (!hasTermInsurance && hasHealthInsurance) {
    protectionComment = `No term plan detected. At age ${currentAge}, a ${toINR(idealCover)} term plan costs roughly ${toINR(Math.round(idealCover * 0.008 / 12))}/month.`
  } else {
    protectionComment = 'No term plan and no health insurance. These are your first priorities before investment-linked plans.'
  }

  // ── 5. Dependent Coverage (10 pts) ───────────────────────────────────────────
  let dependentScore: number
  let dependentComment: string
  if (dependents === 0) {
    dependentScore = 10
    dependentComment = 'No dependents. No coverage gap from this angle.'
  } else {
    const coverPerDependent = sumAssured / dependents
    if (coverPerDependent >= 2000000) {
      dependentScore = 10
      dependentComment = `${toINR(Math.round(coverPerDependent))} per dependent. Adequate coverage per family member.`
    } else if (coverPerDependent >= 1000000) {
      dependentScore = 7
      dependentComment = `${toINR(Math.round(coverPerDependent))} per dependent. Consider increasing cover as family needs grow.`
    } else if (coverPerDependent >= 500000) {
      dependentScore = 4
      dependentComment = `Only ${toINR(Math.round(coverPerDependent))} per dependent. This is under-insured for a family.`
    } else {
      dependentScore = 2
      dependentComment = `Only ${toINR(Math.round(coverPerDependent))} per dependent. Your family is significantly under-insured.`
    }
  }

  // ── Total + Grade ─────────────────────────────────────────────────────────────
  const totalScore = coverageScore + affordabilityScore + maturityScore + protectionScore + dependentScore
  const grade = getGrade(totalScore)

  // ── Recommendations ───────────────────────────────────────────────────────────
  const recommendations: string[] = []

  if (coverageRatio < 0.5) {
    recommendations.push(`Your cover is only ${coveragePct}% of what's recommended. A term plan can top this up for as little as ₹500/month.`)
  }
  if (!hasTermInsurance) {
    const approxMonthly = Math.round(idealCover * 0.008 / 12)
    recommendations.push(`You don't have a term plan. At age ${currentAge}, ${toINR(idealCover)} in term cover costs roughly ${toINR(approxMonthly)}/month.`)
  }
  if (!hasHealthInsurance) {
    recommendations.push('No health cover detected. Medical emergencies are the #1 cause of financial distress in India. A family floater starts at ₹1,500/month.')
  }
  if (dependents > 0 && sumAssured / dependents < 1000000) {
    recommendations.push(`Each family member has under ₹10 lakh in cover. Consider increasing your sum assured.`)
  }
  if (premiumRatio > 0.15) {
    recommendations.push(`You're spending ${(premiumRatio * 100).toFixed(1)}% of income on premiums. Review all your policies — some may be duplicative or underperforming.`)
  }
  if (policyYear < 3) {
    recommendations.push(`Your policy is only ${policyYear} year${policyYear === 1 ? '' : 's'} old. Don't surrender — you'll lose everything paid so far.`)
  }

  recommendations.push(`Talk to Ajay sir for a free policy review: ${ADVISOR_PHONE}`)

  // ── Summary ───────────────────────────────────────────────────────────────────
  const gradeDescriptions: Record<string, string> = {
    'A+': 'Excellent protection. Your policy portfolio is in great shape.',
    'A':  'Strong coverage with minor gaps. A few adjustments will get you to excellent.',
    'B':  'Decent foundation but meaningful gaps. Worth reviewing.',
    'C':  'Significant gaps in protection. Action needed this year.',
    'D':  'Critical gaps. Your family is financially vulnerable. Please review immediately.',
  }
  const summary = gradeDescriptions[grade]

  logger.info(ROUTE, 'policy-health calculated', {
    ip,
    totalScore,
    grade,
    currentAge,
    coveragePct,
  })

  const result: PolicyHealthResult = {
    totalScore,
    grade,
    breakdown: {
      coverageAdequacy:    { score: coverageScore,    max: 35, comment: coverageComment },
      premiumAffordability:{ score: affordabilityScore, max: 20, comment: affordabilityComment },
      maturityProgress:    { score: maturityScore,    max: 15, comment: maturityComment },
      protectionMix:       { score: protectionScore,  max: 20, comment: protectionComment },
      dependentCoverage:   { score: dependentScore,   max: 10, comment: dependentComment },
    },
    recommendations,
    summary,
  }

  return NextResponse.json(result)
}
