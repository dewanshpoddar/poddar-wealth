'use client'
// @ts-nocheck
import React, { Suspense, useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import { PLANS } from '@/lib/lic-plans-data.js'
import { Coffee, TrendingUp, MessageCircle, Share2, Shield } from 'lucide-react'
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

const freqOptions = [
  { label: 'Yearly', value: 'yearly' },
  { label: 'Half-Yearly', value: 'halfyearly' },
  { label: 'Quarterly', value: 'quarterly' },
  { label: 'Monthly', value: 'monthly' },
]

const genderOptions = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
]

const smokerOptions = [
  { label: 'No', value: false },
  { label: 'Yes', value: true },
]

const PREMIUM_FAQ = [
  {
    question: 'How is the LIC premium calculated?',
    answer: 'LIC premiums are calculated based on tabular rates from official brochures, determined by your entry age, policy term, and sum assured. Taxes (GST) and optional rider premiums are added to this base rate.'
  },
  {
    question: 'Can I pay my LIC premium in installments?',
    answer: 'Yes, LIC allows premium payments in Yearly, Half-Yearly, Quarterly, and Monthly modes. Electronic clearance (NACH) is usually required for monthly payments.'
  },
  {
    question: 'What happens if I miss my premium due date?',
    answer: 'LIC offers a grace period of 30 days for yearly/half-yearly/quarterly modes, and 15 days for monthly mode. If unpaid past the grace period, the policy lapses, but can be revived within 5 years.'
  }
]

function PremiumCalcContent() {
  const searchParams = useSearchParams()
  const { lang } = useLang()
  const resultRef = useRef<HTMLDivElement | null>(null)

  // Filter out discontinued/withdrawn plans
  const activePlans = PLANS.filter((p: any) => p.status !== 'withdrawn')

  const [planNo, setPlanNo] = useState<number>(915)
  const [sa, setSa] = useState<number>(1000000)
  const [age, setAge] = useState<number>(30)
  const [term, setTerm] = useState<number>(20)

  // Advanced Options
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [mode, setMode] = useState<'yearly'|'halfyearly'|'quarterly'|'monthly'>('yearly')
  const [gender, setGender] = useState<'male'|'female'>('male')
  const [smoker, setSmoker] = useState<boolean>(false)

  // Calculation State
  const [hasCalculated, setHasCalculated] = useState(false)
  const [premResult, setPremResult] = useState<any | null>(null)
  const [isCalculating, setIsCalculating] = useState(false)
  const [calcError, setCalcError] = useState<string | null>(null)
  const [isUnlocked, setIsUnlocked] = useState(false)

  // Parse URL query params & session storage pre-fill
  useEffect(() => {
    const qAge = searchParams.get('age')
    const qSa = searchParams.get('sa')
    const qTerm = searchParams.get('term')

    if (qAge) setAge(Number(qAge))
    if (qSa) setSa(Number(qSa))
    if (qTerm) setTerm(Number(qTerm))

    // Session pre-fill fallback
    const sessionInputs = getSharedInputs()
    if (!qAge && sessionInputs.age) setAge(sessionInputs.age)
    if (!qSa && sessionInputs.sumAssured) setSa(sessionInputs.sumAssured)
    if (!qTerm && sessionInputs.policyTerm) setTerm(sessionInputs.policyTerm)

    // Check if phone exists in session for auto-unlock
    const lead = getLeadInfo()
    if (lead && lead.phone) {
      setIsUnlocked(true)
    }
  }, [searchParams])

  const selectedPlan = PLANS.find((p: any) => p.planNo === planNo)

  const handlePlanChange = (num: number) => {
    setPlanNo(num)
    setHasCalculated(false)
    const newPlan = PLANS.find((p: any) => p.planNo === num)
    if (newPlan) {
      if (newPlan.minSA && sa < newPlan.minSA) setSa(newPlan.minSA)
      if (newPlan.minAge && age < newPlan.minAge) setAge(newPlan.minAge)
      if (newPlan.maxAge && age > newPlan.maxAge) setAge(newPlan.maxAge)
      if (newPlan.minTerm && term < newPlan.minTerm) setTerm(newPlan.minTerm)
      if (newPlan.maxTerm && term > newPlan.maxTerm) setTerm(newPlan.maxTerm)
    }
  }

  const handleCalculate = async () => {
    if (!selectedPlan) return
    setIsCalculating(true)
    setCalcError(null)
    try {
      const res = await fetch('/api/calculate/premium', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planNo, sa, age, term, mode, smoker, gender }),
      })
      const data = await res.json()
      if (!res.ok) { setCalcError(data.error || 'Calculation failed'); return }
      setPremResult(data)
      setHasCalculated(true)
      updateSession({ age, sumAssured: sa, policyTerm: term })
      addResult('premium', { amount: data.yearlyYear1, plan: selectedPlan.name, frequency: mode })
    } catch {
      setCalcError('Network error. Please try again.')
    } finally {
      setIsCalculating(false)
    }
  }

  // Pre-calculated values for UI display
  let displayAmount = 0
  let modeLabel = 'year'
  if (premResult) {
    if (mode === 'yearly') {
      displayAmount = premResult.yearlyYear1
      modeLabel = 'year'
    } else if (mode === 'halfyearly') {
      displayAmount = premResult.instalment1
      modeLabel = 'half-year'
    } else if (mode === 'quarterly') {
      displayAmount = premResult.instalment1
      modeLabel = 'quarter'
    } else if (mode === 'monthly') {
      displayAmount = premResult.instalment1
      modeLabel = 'month'
    }
  }

  const dailyEquivalent = premResult ? Math.round(premResult.yearlyYear1 / 365) : 0

  const visibleRows = premResult ? [
    { label: 'Sum Assured', value: `₹${Math.round(sa).toLocaleString('en-IN')}` },
    { label: 'Policy Term', value: `${term} Years` },
    { label: 'Premium Mode', value: mode.charAt(0).toUpperCase() + mode.slice(1) },
    { label: 'Base Tabular Premium', value: `₹${Math.round(premResult.netPremium).toLocaleString('en-IN')}` },
    { label: 'GST (First Year)', value: `₹${Math.round(premResult.gstYear1).toLocaleString('en-IN')}` },
    { label: 'First Year Premium', value: `₹${Math.round(premResult.yearlyYear1).toLocaleString('en-IN')}`, isTotal: true },
  ] : []

  const gatedRows = premResult ? [
    { label: 'Subsequent Years Premium (incl. GST)', value: `₹${Math.round(premResult.yearlyYear2plus).toLocaleString('en-IN')}` },
    { label: 'Total Premiums Paid Over Term', value: `₹${Math.round(premResult.totalPaid).toLocaleString('en-IN')}`, isTotal: true },
  ] : []

  const msg = premResult && selectedPlan 
    ? `Namaste Ajay ji, I calculated my LIC premium.
Sum Assured: ₹${Math.round(sa).toLocaleString('en-IN')}
Plan: ${selectedPlan.name} (Plan ${planNo})
Age: ${age}
Term: ${term} Years
Premium: ₹${Math.round(displayAmount).toLocaleString('en-IN')}/${modeLabel} (₹${dailyEquivalent}/day).
Can you suggest the best configuration?` 
    : ''

  const crossLinks = premResult ? [
    {
      label: 'See what this grows to at maturity →',
      href: `/calculators/maturity?age=${age}&sa=${sa}&term=${term}`,
      colorClass: 'text-[#d97706] hover:text-amber-700',
      icon: TrendingUp
    },
    {
      label: 'Discuss options with Ajay ji →',
      href: `https://wa.me/91${ADVISOR_PHONE}?text=${encodeURIComponent(msg)}`,
      colorClass: 'text-[#059669] hover:text-emerald-700',
      icon: MessageCircle
    },
    {
      label: 'Share this result →',
      onClick: () => {
        if (navigator.share) {
          navigator.share({
            title: 'LIC Premium Calculator Result',
            text: `Calculated my LIC premium: ₹${Math.round(sa).toLocaleString('en-IN')} cover, term ${term}yr → ₹${Math.round(displayAmount).toLocaleString('en-IN')}/${modeLabel}.`,
            url: window.location.href
          }).catch(console.error)
        } else {
          navigator.clipboard.writeText(`Calculated my LIC premium: ₹${Math.round(sa).toLocaleString('en-IN')} cover, term ${term}yr → ₹${Math.round(displayAmount).toLocaleString('en-IN')}/${modeLabel}. Try it here: ${window.location.href}`)
          alert('Link copied to clipboard!')
        }
      },
      colorClass: 'text-gray-500 hover:text-gray-700',
      icon: Share2
    }
  ] : []

  const formattedValStr = premResult 
    ? `₹${Math.round(displayAmount).toLocaleString('en-IN')}/${modeLabel}` 
    : ''

  return (
    <CalculatorShell
      activeTabId="premium"
      title="Premium Calculator"
      infoTooltip="Calculate premium rates for LIC plans. Tabular rates are derived from official brochures. Total premium includes first year GST and applicable modal factors."
      faq={PREMIUM_FAQ}
      age={age}
      sa={sa}
      term={term}
      hasCalculated={hasCalculated}
      onCalculate={handleCalculate}
      calculateButtonText={isCalculating ? 'Calculating...' : 'Calculate Premium'}
      formFields={
        <>
          {calcError && (
            <div className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{calcError}</div>
          )}
          <div>
            <label className="text-xs font-semibold text-gray-700 mb-1.5 block">Select LIC Plan</label>
            <select
              value={planNo}
              onChange={(e) => handlePlanChange(Number(e.target.value))}
              className="w-full h-11 px-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs font-medium text-gray-900 bg-white"
            >
              {activePlans.map((plan: any) => (
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

          <SliderField
            label="Entry Age"
            value={age}
            onChange={(val) => { setAge(val); setHasCalculated(false) }}
            min={selectedPlan?.minAge ?? 18}
            max={selectedPlan?.maxAge ?? 65}
            unit=" yrs"
          />

          <QuickPick
            label="Policy Term"
            value={term}
            onChange={(val) => { setTerm(val); setHasCalculated(false) }}
            options={termOptions}
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
                <QuickPick
                  label="Premium Mode"
                  value={mode}
                  onChange={(val) => { setMode(val as any); setHasCalculated(false) }}
                  options={freqOptions}
                />

                <QuickPick
                  label="Gender"
                  value={gender}
                  onChange={(val) => { setGender(val as any); setHasCalculated(false) }}
                  options={genderOptions}
                />

                <QuickPick
                  label="Smoker Status"
                  value={smoker}
                  onChange={(val) => { setSmoker(val as any); setHasCalculated(false) }}
                  options={smokerOptions}
                />
              </div>
            )}
          </div>
        </>
      }
      resultPanel={
        premResult && (
          <ResultPanel
            value={formattedValStr}
            rawValue={displayAmount}
            valueSuffix={`/${modeLabel}`}
            label="Estimated premium"
            contextText={`${selectedPlan?.name} (Plan ${planNo}) · ₹${(sa / 100000).toFixed(0)}L SA · ${term}yr term`}
            humanLineText={`₹${dailyEquivalent}/day — less than your daily chai`}
            HumanLineIcon={Coffee}
            visibleRows={visibleRows}
            gatedRows={gatedRows}
            insightText={`For ₹${dailyEquivalent}/day, you protect your family with ₹${Math.round(sa).toLocaleString('en-IN')} coverage plus receive standard maturity returns.`}
            crossLinks={crossLinks}
            isUnlocked={isUnlocked}
            onUnlock={(ph) => setIsUnlocked(true)}
            calculatorName="premium"
            inputs={{ planNo, sa, age, term, mode, gender, smoker }}
            whatsappMessage={msg}
          />
        )
      }
      resultRef={resultRef}
    />
  )
}

export default function PremiumCalculatorPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0f1225]"></div>
      </div>
    }>
      <PremiumCalcContent />
    </Suspense>
  )
}
