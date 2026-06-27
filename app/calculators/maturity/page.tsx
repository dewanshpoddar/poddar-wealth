'use client'
import React, { Suspense, useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import { TrendingUp, Coffee, MessageCircle, Share2 } from 'lucide-react'
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
  const { lang } = useLang()
  const resultRef = useRef<HTMLDivElement | null>(null)

  // Endowment and Money-back plans eligible for maturity calculations
  const majorPlans = PLANS.filter(p => p.status !== 'withdrawn' && ['endowment', 'moneyback', 'wholelife', 'child'].includes(p.category || ''))

  const [planNo, setPlanNo] = useState<number>(majorPlans[0]?.planNo || 915)
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

    // Check if session has phone to auto-unlock
    const lead = getLeadInfo()
    if (lead && lead.phone) {
      setIsUnlocked(true)
    }
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

    // Save to session
    updateSession({ age, sumAssured: sa, policyTerm: term })
    addResult('maturity', { value: mat, totalPaid: totalPremPaid, netGain: mat - totalPremPaid })
  }

  const handleReset = () => {
    setPlanNo(majorPlans[0]?.planNo || 915)
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

  const visibleRows = [
    { label: 'Basic Sum Assured', value: `₹${Math.round(sa).toLocaleString('en-IN')}` },
    { label: 'Policy Term', value: `${term} Years` },
    { label: 'Total Premiums Paid', value: `₹${Math.round(totalPaid).toLocaleString('en-IN')}`, isTotal: true },
  ]

  const gatedRows = [
    { label: 'Accrued Bonus (SRB)', value: `₹${Math.round(accruedBonus).toLocaleString('en-IN')}` },
    { label: 'Final Additional Bonus (FAB)', value: `₹${Math.round(fabVal).toLocaleString('en-IN')}` },
    { label: 'Net Gain', value: `₹${Math.round(maturityVal - totalPaid).toLocaleString('en-IN')}`, isTotal: true },
    { label: 'Effective Compound Return', value: `${effectiveReturn}% p.a.` },
    { label: 'Equivalent FD rate (taxable)', value: `${(effectiveReturn * 1.3).toFixed(1)}% p.a.` },
  ]

  const plan = PLANS.find(p => p.planNo === planNo)
  const msg = hasCalculated ? `Namaste Ajay ji, I calculated my LIC policy maturity.
Sum Assured: ₹${Math.round(sa).toLocaleString('en-IN')}
Plan: ${plan?.name} (Plan ${planNo})
Age: ${age}
Term: ${term} Years
Maturity Amount: ₹${Math.round(maturityVal).toLocaleString('en-IN')}
Total Premiums Paid: ₹${Math.round(totalPaid).toLocaleString('en-IN')}
Effective returns: ${effectiveReturn}% p.a.
Can you suggest how to optimize my returns?` : ''

  const crossLinks = [
    {
      label: 'Check matching coverage needs →',
      href: `/calculators/life-insurance?age=${age}&sa=${sa}&term=${term}`,
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
            title: 'LIC Maturity Calculator Result',
            text: `Estimated my LIC maturity value: ₹${Math.round(maturityVal).toLocaleString('en-IN')} on ₹${Math.round(sa).toLocaleString('en-IN')} sum assured.`,
            url: window.location.href
          }).catch(console.error)
        } else {
          navigator.clipboard.writeText(`Estimated my LIC maturity value: ₹${Math.round(maturityVal).toLocaleString('en-IN')} on ₹${Math.round(sa).toLocaleString('en-IN')} sum assured. Try here: ${window.location.href}`)
          alert('Link copied!')
        }
      },
      colorClass: 'text-gray-500 hover:text-gray-700',
      icon: Share2
    }
  ]

  const bars = [
    { label: 'Total premiums paid', value: totalPaid, max: maturityVal, colorClass: 'bg-blue-500', displayValue: `₹${Math.round(totalPaid).toLocaleString('en-IN')}` },
    { label: 'Maturity value', value: maturityVal, max: maturityVal, colorClass: 'bg-emerald-500', displayValue: `₹${Math.round(maturityVal).toLocaleString('en-IN')}` }
  ]

  return (
    <CalculatorShell
      activeTabId="maturity"
      title="Maturity Calculator"
      infoTooltip="Estimate the maturity value of your traditional endowment policy. Maturity is calculated as Sum Assured + simple reversionary bonus + final additional bonus (FAB) if applicable."
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
            <label className="text-xs font-semibold text-gray-700 mb-1.5 block">Select LIC Plan</label>
            <select
              value={planNo}
              onChange={(e) => handlePlanChange(Number(e.target.value))}
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
              className="text-xs text-blue-600 font-semibold cursor-pointer select-none"
            >
              {showAdvanced ? 'Advanced options ▴' : 'Advanced options ▾'}
            </button>

            {showAdvanced && (
              <div className="mt-4 space-y-4 border-t border-gray-100 pt-4 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-700">Include Final Additional Bonus (FAB)</span>
                  <input
                    type="checkbox"
                    checked={includeFAB}
                    onChange={(e) => { setIncludeFAB(e.target.checked); setHasCalculated(false) }}
                    className="w-4 h-4 text-[#0f1225] accent-[#0f1225] rounded border-gray-300"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Custom Annual Premium (Optional)</label>
                  <input
                    type="number"
                    value={customPremium}
                    onChange={(e) => { setCustomPremium(e.target.value); setHasCalculated(false) }}
                    placeholder="Enter custom annual premium"
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
            value={`₹${Math.round(maturityVal).toLocaleString('en-IN')}`}
            rawValue={maturityVal}
            label="Estimated Maturity Amount"
            contextText={`${plan?.name} · ₹${(sa / 100000).toFixed(0)}L SA · ${term}yr term`}
            humanLineText={`You pay ₹${Math.round(totalPaid).toLocaleString('en-IN')} → You get ₹${Math.round(maturityVal).toLocaleString('en-IN')}`}
            visibleRows={visibleRows}
            gatedRows={gatedRows}
            insightText={`Your ₹${Math.round(sa).toLocaleString('en-IN')} policy grows to ₹${Math.round(maturityVal).toLocaleString('en-IN')} — that's ~${effectiveReturn}% p.a. tax-free returns. Equivalent to ~${(effectiveReturn * 1.3).toFixed(1)}% p.a. taxable FD return for individuals in the 30% tax slab.`}
            crossLinks={crossLinks}
            isUnlocked={isUnlocked}
            onUnlock={(ph) => setIsUnlocked(true)}
            calculatorName="maturity"
            inputs={{ planNo, sa, age, term, bonusRate, includeFAB, customPremium }}
            whatsappMessage={msg}
          >
            {/* CSS-based bars rendered inside ResultPanel children */}
            <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
              <h4 className="text-[10px] uppercase tracking-wider text-gray-400 font-bold select-none">
                Payment vs Return Comparison
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

export default function MaturityCalculatorPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0f1225]"></div>
      </div>
    }>
      <MaturityCalcContent />
    </Suspense>
  )
}
