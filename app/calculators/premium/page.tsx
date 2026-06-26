'use client'
import React, { Suspense, useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import { Shield } from 'lucide-react'
import { PLANS, calculatePremium, calculateMaturity, getPPT } from '@/lib/lic-plans-data.js'
import QuickPick from '@/components/ui/QuickPick'
import SliderField from '@/components/ui/SliderField'
import CalculatorShell from '@/components/calculators/CalculatorShell'
import ResultCard from '@/components/calculators/ResultCard'
import ResultBreakdown from '@/components/calculators/ResultBreakdown'
import ActionBar from '@/components/calculators/ActionBar'

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
  const resultRef = useRef<HTMLDivElement | null>(null)

  // Filter out discontinuted/withdrawn plans
  const activePlans = PLANS.filter(p => p.status !== 'withdrawn')

  const [planNo, setPlanNo] = useState<number>(915)
  const [sa, setSa] = useState<number>(1000000)
  const [age, setAge] = useState<number>(30)
  const [term, setTerm] = useState<number>(20)

  // Advanced Options
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [mode, setMode] = useState<'yearly'|'halfyearly'|'quarterly'|'monthly'>('yearly')
  const [gender, setGender] = useState<'male'|'female'>('male')
  const [smoker, setSmoker] = useState<boolean>(false)

  // Result state
  const [hasCalculated, setHasCalculated] = useState(false)
  const [premResult, setPremResult] = useState<any | null>(null)

  // Parse URL query params
  useEffect(() => {
    const qAge = searchParams.get('age')
    const qSa = searchParams.get('sa')
    const qTerm = searchParams.get('term')

    if (qAge) setAge(Number(qAge))
    if (qSa) setSa(Number(qSa))
    if (qTerm) setTerm(Number(qTerm))
  }, [searchParams])

  const selectedPlan = PLANS.find(p => p.planNo === planNo)

  const handlePlanChange = (num: number) => {
    setPlanNo(num)
    setHasCalculated(false)
    const newPlan = PLANS.find(p => p.planNo === num)
    if (newPlan) {
      if (newPlan.minSA && sa < newPlan.minSA) setSa(newPlan.minSA)
      if (newPlan.minAge && age < newPlan.minAge) setAge(newPlan.minAge)
      if (newPlan.maxAge && age > newPlan.maxAge) setAge(newPlan.maxAge)
      if (newPlan.minTerm && term < newPlan.minTerm) setTerm(newPlan.minTerm)
      if (newPlan.maxTerm && term > newPlan.maxTerm) setTerm(newPlan.maxTerm)
    }
  }

  const handleCalculate = () => {
    if (!selectedPlan) return
    const ppt = getPPT(selectedPlan, term, age)
    const res = calculatePremium({ planNo, sa, age, term, ppt, mode, smoker, gender })
    setPremResult(res)
    setHasCalculated(true)
  }

  const handleReset = () => {
    setPlanNo(915)
    setSa(1000000)
    setAge(30)
    setTerm(20)
    setMode('yearly')
    setGender('male')
    setSmoker(false)
    setPremResult(null)
    setHasCalculated(false)
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

  const breakdownRows = premResult ? [
    { label: 'Base Tabular Premium', value: `₹${Math.round(premResult.netPremium).toLocaleString('en-IN')}` },
    { label: 'GST (First Year)', value: `₹${Math.round(premResult.gstYear1).toLocaleString('en-IN')}` },
    { label: 'First Year Premium', value: `₹${Math.round(premResult.yearlyYear1).toLocaleString('en-IN')}`, isTotal: true },
    { label: 'Subsequent Years Premium (incl. GST)', value: `₹${Math.round(premResult.yearlyYear2plus).toLocaleString('en-IN')}` },
    { label: 'Total Premiums Paid Over Term', value: `₹${Math.round(premResult.totalPaid).toLocaleString('en-IN')}`, isTotal: true },
  ] : []

  const msg = premResult && selectedPlan ? `Namaste Ajay ji, I used your premium calculator.
₹${Math.round(sa).toLocaleString('en-IN')} cover, ${selectedPlan.name} (Plan ${planNo}), age ${age}, term ${term}yr → ₹${Math.round(displayAmount).toLocaleString('en-IN')}/${modeLabel}.
Can you suggest the best plan?` : ''
  const whatsappUrl = `https://wa.me/919415313434?text=${encodeURIComponent(msg)}`

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
      calculateButtonText="Calculate Premium"
      formFields={
        <>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1.5 block">Select LIC Plan</label>
            <select
              value={planNo}
              onChange={(e) => handlePlanChange(Number(e.target.value))}
              className="w-full h-11 px-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-base text-gray-900 bg-white"
            >
              {activePlans.map(plan => (
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
              className="text-sm text-blue-600 font-semibold cursor-pointer"
            >
              {showAdvanced ? 'Advanced options ▴' : 'Advanced options ▾'}
            </button>

            {showAdvanced && (
              <div className="mt-4 space-y-5 border-t border-gray-100 pt-4 animate-fadeIn">
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
                  label="Smoker"
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
          <div className="space-y-4">
            <ResultCard
              value={`₹${Math.round(displayAmount).toLocaleString('en-IN')}/${modeLabel}`}
              label="Estimated premium"
              subtext={`₹${dailyEquivalent} per day — less than your chai`}
              type="neutral"
              inlineLinkText="See what this grows to → Maturity Calculator"
              inlineLinkHref={`/calculators/maturity?age=${age}&sa=${sa}&term=${term}`}
              insightText={`For ₹${dailyEquivalent}/day, your family gets ₹${Math.round(sa).toLocaleString('en-IN')} protection plus maturity benefits. Talk to Ajay ji to finalize →`}
              InsightIcon={Shield}
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

export default function PremiumCalculatorPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    }>
      <PremiumCalcContent />
    </Suspense>
  )
}
