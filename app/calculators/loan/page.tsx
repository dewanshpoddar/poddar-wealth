'use client'
import React, { Suspense, useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import { Landmark, ShieldCheck } from 'lucide-react'
import { PLANS, calculatePremium, getPPT } from '@/lib/lic-plans-data.js'
import QuickPick from '@/components/ui/QuickPick'
import SliderField from '@/components/ui/SliderField'
import CalculatorShell from '@/components/calculators/CalculatorShell'
import ResultCard from '@/components/calculators/ResultCard'
import ResultBreakdown from '@/components/calculators/ResultBreakdown'
import ActionBar from '@/components/calculators/ActionBar'
import LeadCapture from '@/components/calculators/LeadCapture'
import { getSharedInputs, updateSession, addResult } from '@/lib/calculator-session'
import { useLang } from '@/lib/LangContext'

const saOptions = [
  { label: '₹3L', value: 300000 },
  { label: '₹5L', value: 500000 },
  { label: '₹10L', value: 1000000 },
  { label: '₹25L', value: 2500000 },
  { label: '₹50L', value: 5000000 },
]

const termOptions = [
  { label: '15 Years', value: 15 },
  { label: '20 Years', value: 20 },
  { label: '25 Years', value: 25 },
  { label: '30 Years', value: 30 },
]

const LOAN_FAQ = [
  {
    question: 'How much loan can I get against my LIC policy?',
    answer: 'You can get a loan of up to 90% of the policy\'s accrued Cash Surrender Value. The policy must have run for at least 3 completed years (or 2 years for limited payment plans).'
  },
  {
    question: 'What is the interest rate on LIC policy loans?',
    answer: 'The interest rate on policy loans is determined by LIC, currently averaging 9.5% per annum, compounded half-yearly. It is usually much lower than personal bank loans.'
  },
  {
    question: 'Do I have to repay the policy loan immediately?',
    answer: 'No. You can pay back only the interest, or repay the principal in parts. If unpaid, the outstanding loan + interest is deducted from your maturity or death claim payout.'
  }
]

function getGsvFactor(yearsPaid: number): number {
  if (yearsPaid < 2) return 0
  if (yearsPaid === 2) return 0.30
  if (yearsPaid === 3) return 0.30
  if (yearsPaid <= 6) return 0.50
  if (yearsPaid === 7 || yearsPaid === 8) return 0.55
  if (yearsPaid === 9) return 0.60
  if (yearsPaid === 10) return 0.65
  if (yearsPaid === 11) return 0.70
  if (yearsPaid === 12) return 0.75
  if (yearsPaid === 13) return 0.80
  if (yearsPaid === 14) return 0.85
  return 0.90
}

function LoanCalcContent() {
  const searchParams = useSearchParams()
  const resultRef = useRef<HTMLDivElement | null>(null)

  const majorPlans = PLANS.filter(p => p.status !== 'withdrawn' && ['endowment', 'moneyback', 'wholelife', 'child'].includes(p.category || ''))

  const [planNo, setPlanNo] = useState<number>(majorPlans[0]?.planNo || 715)
  const [sa, setSa] = useState<number>(1000000)
  const [term, setTerm] = useState<number>(20)
  const [yearsPaid, setYearsPaid] = useState<number>(5)

  // Advanced Options
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [bonusRate, setBonusRate] = useState<number>(48)

  // Calculation Results
  const [hasCalculated, setHasCalculated] = useState(false)
  const [surrenderValue, setSurrenderValue] = useState<number>(0)
  const [maxLoan, setMaxLoan] = useState<number>(0)
  const [annualInterest, setAnnualInterest] = useState<number>(0)
  const [monthlyInterest, setMonthlyInterest] = useState<number>(0)
  
  // Repayment projection
  const [interest1yr, setInterest1yr] = useState<number>(0)
  const [interest3yr, setInterest3yr] = useState<number>(0)
  const [interest5yr, setInterest5yr] = useState<number>(0)

  // Parse URL query params & session storage pre-fill
  useEffect(() => {
    const qSa = searchParams.get('sa')
    const qTerm = searchParams.get('term')

    if (qSa) setSa(Number(qSa))
    if (qTerm) setTerm(Number(qTerm))

    // Session pre-fill fallback
    const sessionInputs = getSharedInputs()
    if (!qSa && sessionInputs.sumAssured) setSa(sessionInputs.sumAssured)
    if (!qTerm && sessionInputs.policyTerm) setTerm(sessionInputs.policyTerm)
  }, [searchParams])

  const handleCalculate = () => {
    // 1. Estimate annual premium
    const selectedPlan = PLANS.find(p => p.planNo === planNo)
    let annualPremium = 0
    if (selectedPlan) {
      const baselineAge = searchParams.get('age') ? Number(searchParams.get('age')) : 30
      const ppt = getPPT(selectedPlan, term, baselineAge)
      const premRes = calculatePremium({ planNo, sa, age: baselineAge, term, ppt, mode: 'yearly' })
      annualPremium = premRes ? premRes.yearlyYear1 : sa * 0.05
    } else {
      annualPremium = sa * 0.05
    }

    const totalPaidSum = annualPremium * yearsPaid

    // 2. Surrender value (needed as base for loan)
    const gsvFactor = getGsvFactor(yearsPaid)
    const eligiblePremsForGsv = Math.max(totalPaidSum - annualPremium, 0)
    const gsv = Math.round(eligiblePremsForGsv * gsvFactor)

    const paidUpSA = Math.round(sa * (yearsPaid / term))
    const accruedBonus = Math.round((bonusRate * sa / 1000) * yearsPaid)
    const remainingTerm = term - yearsPaid
    const ssvFactor = Math.max(0.1, 0.9 - (remainingTerm * 0.035))
    const ssv = Math.round((paidUpSA + accruedBonus) * ssvFactor)

    const finalSurrender = Math.max(gsv, ssv)
    setSurrenderValue(finalSurrender)

    // 3. Max loan = 90% of surrender value
    const loanLimit = Math.round(finalSurrender * 0.90)
    setMaxLoan(loanLimit)

    // 4. Interest rates (LIC policy loan rate is ~9.5% p.a. compounded half-yearly)
    const rate = 0.095
    const annInterest = Math.round(loanLimit * rate)
    setAnnualInterest(annInterest)
    setMonthlyInterest(Math.round(annInterest / 12))

    // Compound interest projections (compounded half-yearly)
    // Formula: A = P(1 + r/2)^(2t), Interest = A - P
    const getCompoundInterest = (years: number) => {
      const totalAmount = loanLimit * Math.pow(1 + rate / 2, 2 * years)
      return Math.round(totalAmount - loanLimit)
    }

    setInterest1yr(getCompoundInterest(1))
    setInterest3yr(getCompoundInterest(3))
    setInterest5yr(getCompoundInterest(5))
    setHasCalculated(true)

    // Save to session
    updateSession({ sumAssured: sa, policyTerm: term })
    addResult('loan', { maxLoan: loanLimit, surrenderValue: finalSurrender })
  }

  const handleReset = () => {
    setPlanNo(majorPlans[0]?.planNo || 715)
    setSa(1000000)
    setTerm(20)
    setYearsPaid(5)
    setBonusRate(48)
    setMaxLoan(0)
    setSurrenderValue(0)
    setAnnualInterest(0)
    setMonthlyInterest(0)
    setInterest1yr(0)
    setInterest3yr(0)
    setInterest5yr(0)
    setHasCalculated(false)
  }

  const breakdownRows = hasCalculated ? [
    { label: 'Estimated Cash Surrender Value', value: `₹${surrenderValue.toLocaleString('en-IN')}` },
    { label: 'Loan Limit (% of Surrender Value)', value: '90.0%' },
    { label: 'Maximum Loan Eligible', value: `₹${maxLoan.toLocaleString('en-IN')}`, isTotal: true },
    { label: 'Annual Interest Rate', value: '9.5% p.a.' },
    { label: 'Year 1 Interest Paid', value: `₹${interest1yr.toLocaleString('en-IN')}` },
    { label: 'Year 3 Compound Interest Accrued', value: `₹${interest3yr.toLocaleString('en-IN')}` },
    { label: 'Year 5 Compound Interest Accrued', value: `₹${interest5yr.toLocaleString('en-IN')}` },
  ] : []

  const plan = PLANS.find(p => p.planNo === planNo)
  const msg = hasCalculated ? `Namaste Ajay ji, I checked policy loan eligibility.
₹${Math.round(sa).toLocaleString('en-IN')} cover, ${plan?.name} (Plan ${planNo}), paid for ${yearsPaid}/${term}yr. Surrender value ₹${Math.round(surrenderValue).toLocaleString('en-IN')} → eligible loan ₹${Math.round(maxLoan).toLocaleString('en-IN')}.
How can I apply for this policy loan?` : ''
  const whatsappUrl = `https://wa.me/919415313434?text=${encodeURIComponent(msg)}`

  return (
    <CalculatorShell
      activeTabId="loan"
      title="Loan Against Policy"
      infoTooltip="Calculate the maximum loan amount you can claim against your LIC policy. Loans are offered up to 90% of the surrender value for in-force plans. The policy must have run for at least 3 completed years."
      faq={LOAN_FAQ}
      sa={sa}
      term={term}
      hasCalculated={hasCalculated}
      onCalculate={handleCalculate}
      calculateButtonText="Calculate Loan Limit"
      formFields={
        <>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1.5 block">Select LIC Plan</label>
            <select
              value={planNo}
              onChange={(e) => { setPlanNo(Number(e.target.value)); setHasCalculated(false) }}
              className="w-full h-11 px-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-base text-gray-900 bg-white"
            >
              {majorPlans.map(plan => (
                <option key={plan.planNo} value={plan.planNo}>
                  Plan {plan.planNo} - {plan.name}
                </option>
              ))}
            </select>
          </div>

          <QuickPick
            label="Sum Assured"
            value={sa}
            onChange={(val) => { setSa(val); setHasCalculated(false) }}
            options={saOptions}
            showCustom
            customPlaceholder="Enter custom sum assured"
            customSuffix="SA"
          />

          <QuickPick
            label="Policy Term"
            value={term}
            onChange={(val) => { setTerm(val); setHasCalculated(false) }}
            options={termOptions}
          />

          <SliderField
            label="Policy Years Paid"
            value={yearsPaid}
            onChange={(val) => { setYearsPaid(val); setHasCalculated(false) }}
            min={3}
            max={term}
            unit=" yrs"
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
                  label="Average Annual Bonus Rate"
                  value={bonusRate}
                  onChange={(val) => { setBonusRate(val); setHasCalculated(false) }}
                  min={30}
                  max={60}
                  unit=" ₹"
                />
              </div>
            )}
          </div>
        </>
      }
      resultPanel={
        hasCalculated && (
          <div className="space-y-4">
            <ResultCard
              value={`₹${maxLoan.toLocaleString('en-IN')}`}
              label="Maximum Loan Eligible"
              subtext={`Interest starts at ~₹${monthlyInterest}/month (9.5% p.a.)`}
              type="positive"
              inlineLinkText="Compare: surrendering gives ₹ more but you lose cover →"
              inlineLinkHref={`/calculators/surrender-value?age=${searchParams.get('age') || 30}&sa=${sa}&term=${term}`}
              insightText={`Get ₹${maxLoan.toLocaleString('en-IN')} today. Your policy, cover, and maturity all stay intact. Repay interest/principal anytime before maturity.`}
              InsightIcon={Landmark}
              rawValue={maxLoan}
              shareText={`I calculated my LIC policy loan limit on Poddar Wealth: ₹${Math.round(sa).toLocaleString('en-IN')} cover, ${yearsPaid}/${term}yr paid → loan capacity ₹${maxLoan.toLocaleString('en-IN')}. Try it: poddarwealth.com/calculators/loan`}
            >
              <div className="mt-4 p-4 rounded-xl bg-white/70 border border-emerald-200/50 text-xs text-gray-800 space-y-2">
                <div className="font-semibold text-gray-900 border-b border-emerald-200/40 pb-1 text-sm">
                  Interest Accrual Projection:
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span>Interest after 1 Year:</span>
                  <span className="font-bold">₹{interest1yr.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span>Interest after 3 Years:</span>
                  <span className="font-bold">₹{interest3yr.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span>Interest after 5 Years:</span>
                  <span className="font-bold">₹{interest5yr.toLocaleString('en-IN')}</span>
                </div>
                <div className="pt-1.5 border-t border-emerald-200/40 text-[10px] text-gray-500 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                  <span>Borrowing keeps your ₹{sa.toLocaleString('en-IN')} life cover active.</span>
                </div>
              </div>
            </ResultCard>

            <LeadCapture
              calculatorId="loan"
              inputs={{ planNo, sa, term, yearsPaid, bonusRate }}
              result={{ maxLoan, surrenderValue }}
              hasCalculated={hasCalculated}
              whatsappMessage={msg}
              onReset={handleReset}
            />

            <ResultBreakdown rows={breakdownRows} />

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

export default function LoanCalculatorPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    }>
      <LoanCalcContent />
    </Suspense>
  )
}
