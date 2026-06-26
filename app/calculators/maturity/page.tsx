'use client'
import React, { Suspense, useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import { TrendingUp } from 'lucide-react'
import { PLANS, calculatePremium, getPPT } from '@/lib/lic-plans-data.js'
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

const MATURITY_FAQ = [
  {
    question: 'What is the LIC maturity amount?',
    answer: 'The maturity amount is the total sum paid to the policyholder at the end of the policy term, consisting of the basic Sum Assured plus accrued Simple Reversionary Bonuses and any Final Additional Bonus (FAB).'
  },
  {
    question: 'How is the rate of return (CAGR) calculated?',
    answer: 'The effective annual return is calculated based on the total premiums paid versus the final maturity amount received, compounded over the policy term.'
  },
  {
    question: 'Are maturity proceeds taxable?',
    answer: 'Maturity proceeds from traditional LIC policies are generally tax-free under Section 10(10D), provided the Sum Assured is at least 10 times the annual premium.'
  }
]

function MaturityCalcContent() {
  const searchParams = useSearchParams()
  const resultRef = useRef<HTMLDivElement | null>(null)

  // Endowment and Money-back plans eligible for maturity calculations
  const majorPlans = PLANS.filter(p => p.status !== 'withdrawn' && ['endowment', 'moneyback', 'wholelife', 'child'].includes(p.category || ''))

  const [planNo, setPlanNo] = useState<number>(majorPlans[0]?.planNo || 715)
  const [sa, setSa] = useState<number>(1000000)
  const [age, setAge] = useState<number>(30)
  const [term, setTerm] = useState<number>(20)
  const [bonusRate, setBonusRate] = useState<number>(48)

  // Advanced Options
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [includeFAB, setIncludeFAB] = useState<boolean>(true)
  const [customPremium, setCustomPremium] = useState<string>('')

  // Result state
  const [hasCalculated, setHasCalculated] = useState(false)
  const [maturityVal, setMaturityVal] = useState<number>(0)
  const [totalPaid, setTotalPaid] = useState<number>(0)
  const [accruedBonus, setAccruedBonus] = useState<number>(0)
  const [fabVal, setFabVal] = useState<number>(0)
  const [effectiveReturn, setEffectiveReturn] = useState<number>(0)

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
    // 1. Calculate accrued bonus
    const bonus = Math.round(bonusRate * (sa / 1000) * term)
    
    // 2. Calculate FAB (if included)
    const fab = includeFAB
      ? (term >= 15 ? Math.round(sa * 0.05) : term >= 10 ? Math.round(sa * 0.03) : 0)
      : 0
    
    const mat = sa + bonus + fab

    // 3. Estimate annual premium
    let annualPremium = 0
    if (customPremium && !isNaN(Number(customPremium)) && Number(customPremium) > 0) {
      annualPremium = Number(customPremium)
    } else {
      if (selectedPlan) {
        const ppt = getPPT(selectedPlan, term, age)
        const premRes = calculatePremium({ planNo, sa, age, term, ppt, mode: 'yearly' })
        annualPremium = premRes ? premRes.yearlyYear1 : sa * 0.05
      } else {
        annualPremium = sa * 0.05
      }
    }

    const totalPremPaid = annualPremium * term
    const cagr = totalPremPaid > 0 ? ((Math.pow(mat / totalPremPaid, 1 / term) - 1) * 100) : 0

    setMaturityVal(mat)
    setTotalPaid(totalPremPaid)
    setAccruedBonus(bonus)
    setFabVal(fab)
    setEffectiveReturn(Number(cagr.toFixed(2)))
    setHasCalculated(true)
  }

  const handleReset = () => {
    setPlanNo(majorPlans[0]?.planNo || 715)
    setSa(1000000)
    setAge(30)
    setTerm(20)
    setBonusRate(48)
    setIncludeFAB(true)
    setCustomPremium('')
    setMaturityVal(0)
    setTotalPaid(0)
    setAccruedBonus(0)
    setFabVal(0)
    setEffectiveReturn(0)
    setHasCalculated(false)
  }

  const breakdownRows = hasCalculated ? [
    { label: 'Basic Sum Assured', value: `₹${Math.round(sa).toLocaleString('en-IN')}` },
    { label: 'Accrued Bonus (SRB)', value: `₹${Math.round(accruedBonus).toLocaleString('en-IN')}` },
    { label: 'Final Additional Bonus (FAB)', value: `₹${Math.round(fabVal).toLocaleString('en-IN')}` },
    { label: 'Total Maturity Return', value: `₹${Math.round(maturityVal).toLocaleString('en-IN')}`, isTotal: true },
    { label: 'Total Premiums Paid', value: `₹${Math.round(totalPaid).toLocaleString('en-IN')}` },
    { label: 'Net Gain', value: `₹${Math.round(maturityVal - totalPaid).toLocaleString('en-IN')}`, isTotal: true },
    { label: 'Effective Compound Return', value: `${effectiveReturn}% p.a.` }
  ] : []

  const bars = hasCalculated ? [
    { label: 'Total premiums paid', value: totalPaid, max: maturityVal, colorClass: 'bg-blue-500', displayValue: `₹${Math.round(totalPaid).toLocaleString('en-IN')}` },
    { label: 'Maturity value', value: maturityVal, max: maturityVal, colorClass: 'bg-emerald-500', displayValue: `₹${Math.round(maturityVal).toLocaleString('en-IN')}` }
  ] : []

  const plan = PLANS.find(p => p.planNo === planNo)
  const msg = hasCalculated ? `Namaste Ajay ji, I used your maturity calculator.
₹${Math.round(sa).toLocaleString('en-IN')} cover, ${plan?.name} (Plan ${planNo}), age ${age}, term ${term}yr → maturity ₹${Math.round(maturityVal).toLocaleString('en-IN')} (approx returns ${effectiveReturn}%).
Can you suggest how to maximize returns?` : ''
  const whatsappUrl = `https://wa.me/919415313434?text=${encodeURIComponent(msg)}`

  return (
    <CalculatorShell
      activeTabId="maturity"
      title="Maturity Calculator"
      infoTooltip="Estimate the maturity value of your endowment policy. Maturity is calculated as basic Sum Assured + simple reversionary bonus + final additional bonus (FAB) if applicable."
      faq={MATURITY_FAQ}
      age={age}
      sa={sa}
      term={term}
      hasCalculated={hasCalculated}
      onCalculate={handleCalculate}
      calculateButtonText="Calculate Maturity Amount"
      formFields={
        <>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1.5 block">Select LIC Plan</label>
            <select
              value={planNo}
              onChange={(e) => handlePlanChange(Number(e.target.value))}
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

          <SliderField
            label="Bonus Rate (per ₹1000 SA / yr)"
            value={bonusRate}
            onChange={(val) => { setBonusRate(val); setHasCalculated(false) }}
            min={30}
            max={60}
            unit=" ₹"
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
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Include Final Additional Bonus (FAB)</span>
                  <input
                    type="checkbox"
                    checked={includeFAB}
                    onChange={(e) => { setIncludeFAB(e.target.checked); setHasCalculated(false) }}
                    className="w-5 h-5 accent-blue-500 rounded border-gray-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Custom Annual Premium (Optional)</label>
                  <input
                    type="number"
                    value={customPremium}
                    onChange={(e) => { setCustomPremium(e.target.value); setHasCalculated(false) }}
                    placeholder="Enter custom annual premium amount"
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
              value={`₹${Math.round(maturityVal).toLocaleString('en-IN')}`}
              label="Estimated Maturity Amount"
              subtext={`You pay ₹${Math.round(totalPaid).toLocaleString('en-IN')} → You get ₹${Math.round(maturityVal).toLocaleString('en-IN')}`}
              type="positive"
              inlineLinkText="Need this much coverage? → Coverage Calculator"
              inlineLinkHref={`/calculators/life-insurance?age=${age}&sa=${sa}&term=${term}`}
              insightText={`Your ₹${Math.round(sa).toLocaleString('en-IN')} policy grows to ₹${Math.round(maturityVal).toLocaleString('en-IN')} — that's ~${effectiveReturn}% CAGR returns PLUS you had life cover the entire ${term} years.`}
              InsightIcon={TrendingUp}
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

export default function MaturityCalculatorPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    }>
      <MaturityCalcContent />
    </Suspense>
  )
}
