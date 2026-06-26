'use client'
import React, { Suspense, useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import { Sun } from 'lucide-react'
import QuickPick from '@/components/ui/QuickPick'
import SliderField from '@/components/ui/SliderField'
import CalculatorShell from '@/components/calculators/CalculatorShell'
import ResultCard from '@/components/calculators/ResultCard'
import ResultBreakdown from '@/components/calculators/ResultBreakdown'
import ActionBar from '@/components/calculators/ActionBar'

const expenseOptions = [
  { label: '₹15K', value: 15000 },
  { label: '₹25K', value: 25000 },
  { label: '₹40K', value: 40000 },
  { label: '₹60K', value: 60000 },
]

const retireAgeOptions = [
  { label: '55 Yrs', value: 55 },
  { label: '58 Yrs', value: 58 },
  { label: '60 Yrs', value: 60 },
  { label: '65 Yrs', value: 65 },
]

const RETIREMENT_FAQ = [
  {
    question: 'How much corpus do I need for retirement?',
    answer: 'Your retirement corpus depends on your current monthly expenses, entry age, retirement age, expected inflation rate, and expected returns on investments during retirement.'
  },
  {
    question: 'Why is inflation important in retirement planning?',
    answer: 'Inflation reduces the purchasing power of money over time. A monthly expense of ₹40,000 today will grow significantly over 20-30 years due to inflation, meaning you need a larger corpus to support the same lifestyle.'
  },
  {
    question: 'What is a pension plan or annuity?',
    answer: 'A pension plan is an insurance policy where you pay premiums to accumulate a corpus, and after retirement, the insurer pays you a guaranteed monthly or annual income (annuity) for life.'
  }
]

function RetirementCalcContent() {
  const searchParams = useSearchParams()
  const resultRef = useRef<HTMLDivElement | null>(null)

  const [age, setAge] = useState<number>(30)
  const [monthlyExpense, setMonthlyExpense] = useState<number>(25000)
  const [retirementAge, setRetirementAge] = useState<number>(60)

  // Advanced Options
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [inflation, setInflation] = useState<number>(6)
  const [returnRate, setReturnRate] = useState<number>(8)
  const [existingSavings, setExistingSavings] = useState<string>('')
  const [epfContribution, setEpfContribution] = useState<string>('')
  const [lifeExpectancy, setLifeExpectancy] = useState<number>(85)

  // Calculation Results
  const [hasCalculated, setHasCalculated] = useState(false)
  const [futureExpense, setFutureExpense] = useState<number>(0)
  const [requiredCorpus, setRequiredCorpus] = useState<number>(0)
  const [monthlySip, setMonthlySip] = useState<number>(0)
  const [yearsToRetire, setYearsToRetire] = useState<number>(30)

  // Parse URL query params
  useEffect(() => {
    const qAge = searchParams.get('age')
    const qSa = searchParams.get('sa')
    
    if (qAge) setAge(Number(qAge))
    if (qSa) {
      // Use sum assured to guess current monthly expenses (e.g. SA / 240)
      const guessedExpense = Math.ceil((Number(qSa) / 240) / 5000) * 5000
      setMonthlyExpense(Math.max(15000, Math.min(guessedExpense, 60000)))
    }
  }, [searchParams])

  const handleCalculate = () => {
    const years = retirementAge - age
    const retirementYears = lifeExpectancy - retirementAge
    setYearsToRetire(years)

    // Compounded future monthly expense
    const futExpense = monthlyExpense * Math.pow(1 + inflation / 100, years)
    setFutureExpense(futExpense)

    // Calculate required corpus with inflation-adjusted (real) return during retirement
    // Real Return = (Nominal Return - Inflation)
    const realReturn = (returnRate - inflation) / 100
    let annuityFactor = retirementYears
    if (realReturn !== 0) {
      annuityFactor = (1 - Math.pow(1 + realReturn, -retirementYears)) / realReturn
    }
    
    // Future value of existing savings at retirement
    const existing = existingSavings ? Number(existingSavings) : 0
    const epf = epfContribution ? Number(epfContribution) : 0
    const accumulatedSavings = existing * Math.pow(1 + returnRate / 100, years)
    
    // Monthly EPF contribution compounded at EPF rate (approx 8.1%)
    const epfRate = 0.081 / 12
    const totalEpfMonths = years * 12
    const accumulatedEpf = epf > 0
      ? epf * ((Math.pow(1 + epfRate, totalEpfMonths) - 1) / epfRate) * (1 + epfRate)
      : 0

    // Base corpus needed for inflation-adjusted retirement income
    const baseCorpusNeeded = futExpense * 12 * annuityFactor
    const netCorpusNeeded = Math.max(baseCorpusNeeded - accumulatedSavings - accumulatedEpf, 0)
    setRequiredCorpus(baseCorpusNeeded)

    // Calculate required monthly savings (SIP)
    const monthlyRate = returnRate / 12 / 100
    const totalMonths = years * 12
    let sipFactor = totalMonths
    if (monthlyRate !== 0) {
      sipFactor = ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate) * (1 + monthlyRate)
    }

    const requiredSip = netCorpusNeeded / sipFactor
    setMonthlySip(Math.max(requiredSip, 0))
    setHasCalculated(true)
  }

  const handleReset = () => {
    setAge(30)
    setMonthlyExpense(25000)
    setRetirementAge(60)
    setInflation(6)
    setReturnRate(8)
    setExistingSavings('')
    setEpfContribution('')
    setLifeExpectancy(85)
    setFutureExpense(0)
    setRequiredCorpus(0)
    setMonthlySip(0)
    setYearsToRetire(30)
    setHasCalculated(false)
  }

  const totalSipPaid = monthlySip * 12 * yearsToRetire

  const breakdownRows = hasCalculated ? [
    { label: 'Current Monthly Expenses', value: `₹${Math.round(monthlyExpense).toLocaleString('en-IN')}` },
    { label: 'Inflation Adjusted Monthly Expenses', value: `₹${Math.round(futureExpense).toLocaleString('en-IN')}` },
    { label: 'Total Retirement Corpus Required', value: `₹${Math.round(requiredCorpus).toLocaleString('en-IN')}`, isTotal: true },
    { label: 'Required Monthly SIP Savings', value: `₹${Math.round(monthlySip).toLocaleString('en-IN')}/month`, isTotal: true },
    { label: 'Accumulated EPF & Savings Payout', value: `₹${Math.round((requiredCorpus - (monthlySip * ((((Math.pow(1 + (returnRate / 12 / 100), yearsToRetire * 12) - 1) / (returnRate / 12 / 100)) * (1 + (returnRate / 12 / 100))))))).toLocaleString('en-IN')}` }
  ] : []

  const bars = hasCalculated ? [
    { label: 'Your savings path (Total SIP Paid)', value: totalSipPaid, max: requiredCorpus, colorClass: 'bg-blue-500', displayValue: `₹${Math.round(totalSipPaid).toLocaleString('en-IN')}` },
    { label: 'Retirement need (Target Corpus)', value: requiredCorpus, max: requiredCorpus, colorClass: 'bg-emerald-500', displayValue: `₹${Math.round(requiredCorpus).toLocaleString('en-IN')}` }
  ] : []

  const msg = hasCalculated ? `Namaste Ajay ji, I used your retirement calculator.
Current age ${age}, retire at ${retirementAge}, current expense ₹${(monthlyExpense).toLocaleString('en-IN')}/mo. Target corpus ₹${Math.round(requiredCorpus).toLocaleString('en-IN')}, requires SIP ₹${Math.round(monthlySip).toLocaleString('en-IN')}/mo.
Can we discuss pension plans?` : ''
  const whatsappUrl = `https://wa.me/919415313434?text=${encodeURIComponent(msg)}`

  return (
    <CalculatorShell
      activeTabId="retirement"
      title="Retirement Planner"
      infoTooltip="Calculate how much you need to save monthly to accumulate a corpus that can sustain your current lifestyle during retirement, adjusted for inflation and investment returns."
      faq={RETIREMENT_FAQ}
      age={age}
      sa={Math.round(requiredCorpus / 10)} // proxy sum assured
      term={retirementAge - age}
      hasCalculated={hasCalculated}
      onCalculate={handleCalculate}
      calculateButtonText="Calculate SIP Needed"
      formFields={
        <>
          <SliderField
            label="Current Age"
            value={age}
            onChange={(val) => { setAge(val); setHasCalculated(false) }}
            min={18}
            max={55}
            unit=" yrs"
          />

          <QuickPick
            label="Monthly Expenses Today"
            value={monthlyExpense}
            onChange={(val) => { setMonthlyExpense(val); setHasCalculated(false) }}
            options={expenseOptions}
            showCustom
            customPlaceholder="Enter custom monthly expenses"
            customSuffix="/mo"
          />

          <QuickPick
            label="Retirement Age Target"
            value={retirementAge}
            onChange={(val) => { setRetirementAge(val); setHasCalculated(false) }}
            options={retireAgeOptions}
          />

          <div>
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="text-sm text-blue-600 font-semibold cursor-pointer"
            >
              {showAdvanced ? 'Advanced options ▴' : 'Advanced options ▾'}
            </button>

            {showAdvanced && (
              <div className="mt-4 space-y-5 border-t border-gray-100 pt-4 animate-fadeIn">
                <SliderField
                  label="Expected Inflation Rate"
                  value={inflation}
                  onChange={(val) => { setInflation(val); setHasCalculated(false) }}
                  min={4}
                  max={10}
                  step={0.5}
                  unit="%"
                />

                <SliderField
                  label="Expected Investment Return (ROI)"
                  value={returnRate}
                  onChange={(val) => { setReturnRate(val); setHasCalculated(false) }}
                  min={6}
                  max={14}
                  step={0.5}
                  unit="%"
                />

                <SliderField
                  label="Life Expectancy"
                  value={lifeExpectancy}
                  onChange={(val) => { setLifeExpectancy(val); setHasCalculated(false) }}
                  min={70}
                  max={90}
                  unit=" yrs"
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Existing Savings Corpus (₹)</label>
                  <input
                    type="number"
                    value={existingSavings}
                    onChange={(e) => { setExistingSavings(e.target.value); setHasCalculated(false) }}
                    placeholder="Enter total investments, mutual funds, FDs"
                    className="w-full h-11 px-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-base text-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Monthly EPF Contribution (₹)</label>
                  <input
                    type="number"
                    value={epfContribution}
                    onChange={(e) => { setEpfContribution(e.target.value); setHasCalculated(false) }}
                    placeholder="Enter employee + employer monthly EPF"
                    className="w-full h-11 px-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-base text-gray-900"
                  />
                </div>
              </div>
            )}
          </div>
        </>
      }
      resultPanel={
        hasCalculated && (
          <div className="space-y-4">
            <ResultCard
              value={`₹${Math.round(monthlySip).toLocaleString('en-IN')}/month`}
              label="Required Monthly SIP Savings"
              subtext={`To build a corpus of ₹${Math.round(requiredCorpus).toLocaleString('en-IN')} by age ${retirementAge}`}
              type="neutral"
              inlineLinkText="Explore pension plans → Retirement Services"
              inlineLinkHref="/services/retirement"
              insightText={`Today's ₹${Math.round(monthlyExpense).toLocaleString('en-IN')}/month becomes ₹${Math.round(futureExpense).toLocaleString('en-IN')}/month in ${yearsToRetire} years. Start with ₹${Math.round(monthlySip).toLocaleString('en-IN')}/month today — the earlier, the less you need.`}
              InsightIcon={Sun}
            />

            <ResultBreakdown rows={breakdownRows} bars={bars} />

            <ActionBar
              whatsappUrl={whatsappUrl}
              onReset={handleReset}
              resultRef={resultRef}
            />
          </div>
        )
      }
      resultRef={resultRef}
    />
  )
}

export default function RetirementCalculatorPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    }>
      <RetirementCalcContent />
    </Suspense>
  )
}
