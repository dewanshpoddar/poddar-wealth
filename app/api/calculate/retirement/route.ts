import { NextRequest, NextResponse } from 'next/server'

const DISCLAIMER =
  'Retirement projections use assumed growth rates and are not guaranteed. Actual returns depend on investment performance and prevailing bonus rates.'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      currentAge,
      retirementAge = 60,
      monthlyExpenses,
      inflationRate = 6,
      expectedReturn = 7,
      existingCorpus = 0,
      monthlyInvestment = 0,
    } = body

    if (!currentAge || !monthlyExpenses) {
      return NextResponse.json({ error: 'currentAge and monthlyExpenses are required' }, { status: 400 })
    }

    const yearsToRetire = Math.max(Number(retirementAge) - Number(currentAge), 1)
    const lifeExpectancy = 80
    const retirementYears = lifeExpectancy - Number(retirementAge)

    const monthlyExp = Number(monthlyExpenses)
    const inflation = Number(inflationRate) / 100
    const returns = Number(expectedReturn) / 100

    // Future monthly expenses at retirement (inflation-adjusted)
    const futureMonthlyExpenses = Math.round(monthlyExp * Math.pow(1 + inflation, yearsToRetire))

    // Corpus needed at retirement using present value of annuity
    // Real return rate (returns - inflation)
    const realRate = (returns - inflation) / 12
    const n = retirementYears * 12
    let corpusRequired: number
    if (realRate <= 0) {
      corpusRequired = futureMonthlyExpenses * n
    } else {
      corpusRequired = Math.round(futureMonthlyExpenses * ((1 - Math.pow(1 + realRate, -n)) / realRate))
    }

    // Future value of existing corpus
    const existingCorpusFV = Math.round(
      Number(existingCorpus) * Math.pow(1 + returns, yearsToRetire)
    )

    // Future value of monthly SIP
    const monthlyReturn = returns / 12
    const sipMonths = yearsToRetire * 12
    const sipFV =
      monthlyReturn > 0
        ? Math.round(
            Number(monthlyInvestment) *
              ((Math.pow(1 + monthlyReturn, sipMonths) - 1) / monthlyReturn) *
              (1 + monthlyReturn)
          )
        : Number(monthlyInvestment) * sipMonths

    const projectedCorpus = existingCorpusFV + sipFV
    const shortfall = Math.max(corpusRequired - projectedCorpus, 0)

    // Required monthly SIP to close the gap
    let additionalSIPRequired = 0
    if (shortfall > 0 && monthlyReturn > 0 && sipMonths > 0) {
      additionalSIPRequired = Math.round(
        shortfall /
          (((Math.pow(1 + monthlyReturn, sipMonths) - 1) / monthlyReturn) * (1 + monthlyReturn))
      )
    }

    return NextResponse.json({
      currentAge: Number(currentAge),
      retirementAge: Number(retirementAge),
      yearsToRetire,
      retirementYears,
      currentMonthlyExpenses: monthlyExp,
      futureMonthlyExpenses,
      corpusRequired,
      projectedCorpus,
      existingCorpusFV,
      sipFV,
      shortfall,
      additionalSIPRequired,
      isOnTrack: shortfall === 0,
      disclaimer: DISCLAIMER,
    })
  } catch (err) {
    console.error('[api/calculate/retirement]', err)
    return NextResponse.json({ error: 'Calculation failed' }, { status: 500 })
  }
}
