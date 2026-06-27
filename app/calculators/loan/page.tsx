'use client'
import React, { Suspense, useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import { Landmark, MessageCircle, Share2, TrendingUp, ShieldCheck } from 'lucide-react'
import { PLANS, calculatePremium, getPPT } from '@/lib/lic-plans-data.js'
import QuickPick from '@/components/ui/QuickPick'
import SliderField from '@/components/ui/SliderField'
import CalculatorShell from '@/components/calculators/CalculatorShell'
import ResultPanel from '@/components/calculators/ResultPanel'
import { getSharedInputs, updateSession, addResult, getLeadInfo } from '@/lib/calculator-session'
import { useLang } from '@/lib/LangContext'
import { ADVISOR_PHONE } from '@/lib/constants'

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
  const { lang } = useLang()
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
  const [isUnlocked, setIsUnlocked] = useState(false)
  
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

    // Check session for phone auto-unlock
    const lead = getLeadInfo()
    if (lead && lead.phone) {
      setIsUnlocked(true)
    }
  }, [searchParams])

  const handleCalculate = () => {
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

    const loanLimit = Math.round(finalSurrender * 0.90)
    setMaxLoan(loanLimit)

    const rate = 0.095
    const annInterest = Math.round(loanLimit * rate)
    setAnnualInterest(annInterest)
    setMonthlyInterest(Math.round(annInterest / 12))

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

  const visibleRows = [
    { label: 'Accrued Policy Surrender Value', value: `₹${surrenderValue.toLocaleString('en-IN')}` },
    { label: 'Loan Limit (% of Surrender Value)', value: '90.0%' },
    { label: 'Maximum Loan Eligible', value: `₹${maxLoan.toLocaleString('en-IN')}`, isTotal: true },
  ]

  const gatedRows = [
    { label: 'Annual Interest Rate', value: '9.5% p.a.' },
    { label: 'Year 1 Interest Paid', value: `₹${interest1yr.toLocaleString('en-IN')}` },
    { label: 'Year 3 Compound Interest Accrued', value: `₹${interest3yr.toLocaleString('en-IN')}` },
    { label: 'Year 5 Compound Interest Accrued', value: `₹${interest5yr.toLocaleString('en-IN')}` },
  ]

  const plan = PLANS.find(p => p.planNo === planNo)
  const msg = hasCalculated ? `Namaste Ajay ji, I checked policy loan eligibility.
Sum Assured: ₹${Math.round(sa).toLocaleString('en-IN')}
Plan: ${plan?.name} (Plan ${planNo})
Years paid: ${yearsPaid}/${term}
Surrender value: ₹${Math.round(surrenderValue).toLocaleString('en-IN')}
Eligible loan limit: ₹${Math.round(maxLoan).toLocaleString('en-IN')}.
How can I apply for this loan?` : ''

  const crossLinks = [
    {
      label: 'Compare: surrendering gives cash but you lose cover →',
      href: `/calculators/surrender-value?sa=${sa}&term=${term}`,
      colorClass: 'text-[#d97706] hover:text-amber-700',
      icon: TrendingUp
    },
    {
      label: 'Apply for loan with Ajay ji →',
      href: `https://wa.me/91${ADVISOR_PHONE}?text=${encodeURIComponent(msg)}`,
      colorClass: 'text-[#059669] hover:text-emerald-700',
      icon: MessageCircle
    },
    {
      label: 'Share this loan calculation →',
      onClick: () => {
        if (navigator.share) {
          navigator.share({
            title: 'LIC Policy Loan Calculator Result',
            text: `Calculated my LIC policy loan limit: max loan ₹${maxLoan.toLocaleString('en-IN')} on ₹${Math.round(sa).toLocaleString('en-IN')} cover.`,
            url: window.location.href
          }).catch(console.error)
        } else {
          navigator.clipboard.writeText(`Calculated my LIC policy loan limit: max loan ₹${maxLoan.toLocaleString('en-IN')} on ₹${Math.round(sa).toLocaleString('en-IN')} cover. Try here: ${window.location.href}`)
          alert('Copied link!')
        }
      },
      colorClass: 'text-gray-500 hover:text-gray-700',
      icon: Share2
    }
  ]

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
            <label className="text-xs font-semibold text-gray-700 mb-1.5 block">Select LIC Plan</label>
            <select
              value={planNo}
              onChange={(e) => { setPlanNo(Number(e.target.value)); setHasCalculated(false) }}
              className="w-full h-11 px-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs font-medium text-gray-900 bg-white"
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
              className="text-xs text-blue-600 font-semibold cursor-pointer select-none"
            >
              {showAdvanced ? 'Advanced options ▴' : 'Advanced options ▾'}
            </button>

            {showAdvanced && (
              <div className="mt-4 space-y-4 border-t border-gray-100 pt-4 animate-fadeIn">
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
          <ResultPanel
            value={`₹${maxLoan.toLocaleString('en-IN')}`}
            rawValue={maxLoan}
            label="Maximum Loan Eligible"
            contextText={`${plan?.name} (Plan ${planNo}) · ₹${(sa / 100000).toFixed(0)}L SA · Paid ${yearsPaid}/${term} yrs`}
            humanLineText={`Interest starts at ~₹${monthlyInterest}/month (9.5% p.a.)`}
            HumanLineIcon={Landmark}
            visibleRows={visibleRows}
            gatedRows={gatedRows}
            insightText={`Get ₹${maxLoan.toLocaleString('en-IN')} today. Your policy, cover, and maturity all stay intact. Repay interest/principal anytime before maturity.`}
            crossLinks={crossLinks}
            isUnlocked={isUnlocked}
            onUnlock={(ph) => setIsUnlocked(true)}
            calculatorName="loan"
            inputs={{ planNo, sa, term, yearsPaid, bonusRate }}
            whatsappMessage={msg}
          >
            {/* Interest compound projection details inside children when unlocked */}
            {isUnlocked && (
              <div className="mt-4 p-4 rounded-xl bg-white border border-gray-100 text-xs text-gray-800 space-y-2 animate-fadeIn">
                <div className="font-semibold text-gray-900 border-b border-gray-50 pb-1 text-xs">
                  Interest Accrual Projections (9.5% p.a. compounded half-yearly):
                </div>
                <div className="flex justify-between items-center">
                  <span>Interest after 1 Year:</span>
                  <span className="font-semibold text-gray-900">₹{interest1yr.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Interest after 3 Years:</span>
                  <span className="font-semibold text-gray-900">₹{interest3yr.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Interest after 5 Years:</span>
                  <span className="font-semibold text-gray-900">₹{interest5yr.toLocaleString('en-IN')}</span>
                </div>
                <div className="pt-1.5 border-t border-gray-50 text-[10px] text-gray-400 flex items-center gap-1 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                  <span>Borrowing keeps your life insurance policy active.</span>
                </div>
              </div>
            )}
          </ResultPanel>
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
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0f1225]"></div>
      </div>
    }>
      <LoanCalcContent />
    </Suspense>
  )
}
