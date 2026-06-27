'use client'
import React, { Suspense, useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import { Sun, MessageCircle, Share2, TrendingUp } from 'lucide-react'
import QuickPick from '@/components/ui/QuickPick'
import SliderField from '@/components/ui/SliderField'
import CalculatorShell from '@/components/calculators/CalculatorShell'
import ResultPanel from '@/components/calculators/ResultPanel'
import { getSharedInputs, updateSession, addResult, getLeadInfo } from '@/lib/calculator-session'
import { useLang } from '@/lib/LangContext'
import { ADVISOR_PHONE } from '@/lib/constants'

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
  const { lang } = useLang()
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
  const [isUnlocked, setIsUnlocked] = useState(false)

  // Parse URL query params & session storage pre-fill
  useEffect(() => {
    const qAge = searchParams.get('age')
    const qSa = searchParams.get('sa')
    
    if (qAge) setAge(Number(qAge))
    if (qSa) {
      const guessedExpense = Math.ceil((Number(qSa) / 240) / 5000) * 5000
      setMonthlyExpense(Math.max(15000, Math.min(guessedExpense, 60000)))
    }

    // Session pre-fill fallback
    const sessionInputs = getSharedInputs()
    if (!qAge && sessionInputs.age) setAge(sessionInputs.age)
    if (!qSa && sessionInputs.monthlyExpenses) setMonthlyExpense(sessionInputs.monthlyExpenses)
    if (sessionInputs.policyTerm) setRetirementAge(Math.min(65, Math.max(50, (sessionInputs.age || 30) + sessionInputs.policyTerm)))

    // Check if session has phone auto-unlock
    const lead = getLeadInfo()
    if (lead && lead.phone) {
      setIsUnlocked(true)
    }
  }, [searchParams])

  const handleCalculate = () => {
    const years = retirementAge - age
    const retirementYears = lifeExpectancy - retirementAge
    setYearsToRetire(years)

    const futExpense = monthlyExpense * Math.pow(1 + inflation / 100, years)
    setFutureExpense(futExpense)

    const realReturn = (returnRate - inflation) / 100
    let annuityFactor = retirementYears
    if (realReturn !== 0) {
      annuityFactor = (1 - Math.pow(1 + realReturn, -retirementYears)) / realReturn
    }
    
    const existing = existingSavings ? Number(existingSavings) : 0
    const epf = epfContribution ? Number(epfContribution) : 0
    const accumulatedSavings = existing * Math.pow(1 + returnRate / 100, years)
    
    const epfRate = 0.081 / 12
    const totalEpfMonths = years * 12
    const accumulatedEpf = epf > 0
      ? epf * ((Math.pow(1 + epfRate, totalEpfMonths) - 1) / epfRate) * (1 + epfRate)
      : 0

    const baseCorpusNeeded = futExpense * 12 * annuityFactor
    const netCorpusNeeded = Math.max(baseCorpusNeeded - accumulatedSavings - accumulatedEpf, 0)
    setRequiredCorpus(baseCorpusNeeded)

    const monthlyRate = returnRate / 12 / 100
    const totalMonths = years * 12
    let sipFactor = totalMonths
    if (monthlyRate !== 0) {
      sipFactor = ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate) * (1 + monthlyRate)
    }

    const requiredSip = netCorpusNeeded / sipFactor
    setMonthlySip(Math.max(requiredSip, 0))
    setHasCalculated(true)

    // Save to session
    updateSession({ age, policyTerm: years, monthlyExpenses: monthlyExpense })
    addResult('retirement', { corpus: baseCorpusNeeded, monthlySip: requiredSip })
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

  const visibleRows = [
    { label: 'Current Monthly Expenses', value: `₹${Math.round(monthlyExpense).toLocaleString('en-IN')}` },
    { label: 'Expected Retirement Age', value: `${retirementAge} Years` },
    { label: 'Inflation Adjusted Expenses', value: `₹${Math.round(futureExpense).toLocaleString('en-IN')}/mo`, isTotal: true },
  ]

  const gatedRows = [
    { label: 'Required Target Corpus', value: `₹${Math.round(requiredCorpus).toLocaleString('en-IN')}`, isTotal: true },
    { label: 'Expected Inflation Rate', value: `${inflation}% p.a.` },
    { label: 'Expected Return rate on SIP', value: `${returnRate}% p.a.` },
    { label: 'Monthly Savings Needed (SIP)', value: `₹${Math.round(monthlySip).toLocaleString('en-IN')}/mo`, isTotal: true },
  ]

  const msg = hasCalculated ? `Namaste Ajay ji, I used your retirement calculator.
Current age: ${age}
Retire at: ${retirementAge}
Current expense: ₹${(monthlyExpense).toLocaleString('en-IN')}/mo
Required corpus: ₹${Math.round(requiredCorpus).toLocaleString('en-IN')}
Suggested monthly SIP: ₹${Math.round(monthlySip).toLocaleString('en-IN')}/mo.
Can we discuss my retirement plan options?` : ''

  const crossLinks = [
    {
      label: 'Explore retirement pension options →',
      href: '/services/retirement',
      colorClass: 'text-[#d97706] hover:text-amber-700',
      icon: TrendingUp
    },
    {
      label: 'Discuss timeline with Ajay ji →',
      href: `https://wa.me/91${ADVISOR_PHONE}?text=${encodeURIComponent(msg)}`,
      colorClass: 'text-[#059669] hover:text-emerald-700',
      icon: MessageCircle
    },
    {
      label: 'Share this planner results →',
      onClick: () => {
        if (navigator.share) {
          navigator.share({
            title: 'LIC Retirement Planner Result',
            text: `Calculated my retirement SIP target: ₹${Math.round(monthlySip).toLocaleString('en-IN')}/mo to get ₹${Math.round(requiredCorpus).toLocaleString('en-IN')} corpus.`,
            url: window.location.href
          }).catch(console.error)
        } else {
          navigator.clipboard.writeText(`Calculated my retirement SIP target: ₹${Math.round(monthlySip).toLocaleString('en-IN')}/mo to get ₹${Math.round(requiredCorpus).toLocaleString('en-IN')} corpus. Try here: ${window.location.href}`)
          alert('Link copied!')
        }
      },
      colorClass: 'text-gray-500 hover:text-gray-700',
      icon: Share2
    }
  ]

  const bars = [
    { label: 'Total savings path (Total SIP Paid)', value: totalSipPaid, max: requiredCorpus, colorClass: 'bg-blue-500', displayValue: `₹${Math.round(totalSipPaid).toLocaleString('en-IN')}` },
    { label: 'Retirement target corpus', value: requiredCorpus, max: requiredCorpus, colorClass: 'bg-emerald-500', displayValue: `₹${Math.round(requiredCorpus).toLocaleString('en-IN')}` }
  ]

  return (
    <CalculatorShell
      activeTabId="retirement"
      title="Retirement Planner"
      infoTooltip="Calculate how much you need to save monthly to accumulate a corpus that can sustain your current lifestyle during retirement, adjusted for inflation and investment returns."
      faq={RETIREMENT_FAQ}
      age={age}
      sa={Math.round(requiredCorpus / 10)}
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
              className="text-xs text-blue-600 font-semibold cursor-pointer select-none"
            >
              {showAdvanced ? 'Advanced options ▴' : 'Advanced options ▾'}
            </button>

            {showAdvanced && (
              <div className="mt-4 space-y-4 border-t border-gray-100 pt-4 animate-fadeIn">
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
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Existing Savings Corpus (₹)</label>
                  <input
                    type="number"
                    value={existingSavings}
                    onChange={(e) => { setExistingSavings(e.target.value); setHasCalculated(false) }}
                    placeholder="Enter total investments, mutual funds, FDs"
                    className="w-full h-11 px-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs font-medium text-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Monthly EPF Contribution (₹)</label>
                  <input
                    type="number"
                    value={epfContribution}
                    onChange={(e) => { setEpfContribution(e.target.value); setHasCalculated(false) }}
                    placeholder="Enter employee + employer monthly EPF"
                    className="w-full h-11 px-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs font-medium text-gray-900"
                  />
                </div>
              </div>
            )}
          </div>
        </>
      }
      resultPanel={
        hasCalculated && (
          <ResultPanel
            value={`₹${Math.round(monthlySip).toLocaleString('en-IN')}/mo`}
            rawValue={monthlySip}
            valueSuffix="/mo"
            label="Required Monthly SIP"
            contextText={`Retire at ${retirementAge} · Expenses: ₹${monthlyExpense.toLocaleString('en-IN')}/mo`}
            humanLineText={`Target Corpus: ₹${Math.round(requiredCorpus).toLocaleString('en-IN')} by age ${retirementAge}`}
            HumanLineIcon={Sun}
            visibleRows={visibleRows}
            gatedRows={gatedRows}
            insightText={`Today's ₹${Math.round(monthlyExpense).toLocaleString('en-IN')}/month becomes ₹${Math.round(futureExpense).toLocaleString('en-IN')}/month in ${yearsToRetire} years. Start with ₹${Math.round(monthlySip).toLocaleString('en-IN')}/month today — the earlier you start, the less you need to save.`}
            crossLinks={crossLinks}
            isUnlocked={isUnlocked}
            onUnlock={(ph) => setIsUnlocked(true)}
            calculatorName="retirement"
            inputs={{ age, monthlyExpense, retirementAge, inflation, returnRate, existingSavings, epfContribution, lifeExpectancy }}
            whatsappMessage={msg}
          >
            {/* CSS-based comparison bars */}
            <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
              <h4 className="text-[10px] uppercase tracking-wider text-gray-400 font-bold select-none">
                Savings vs Required Corpus
              </h4>
              {bars.map((bar, idx) => {
                const pct = Math.max(5, (bar.value / bar.max) * 100)
                return (
                  <div key={idx} className="space-y-1 animate-fadeIn">
                    <div className="flex justify-between items-center text-[10px] text-gray-500">
                      <span>{bar.label}</span>
                      <span className="font-semibold text-gray-950">{bar.displayValue}</span>
                    </div>
                    <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${
                          bar.colorClass === 'bg-blue-500' ? 'bg-[#0f1225]' : 'bg-emerald-600'
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </ResultPanel>
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
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0f1225]"></div>
      </div>
    }>
      <RetirementCalcContent />
    </Suspense>
  )
}
