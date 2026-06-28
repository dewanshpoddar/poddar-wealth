'use client'
// @ts-nocheck
import React, { Suspense, useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import { PLANS } from '@/lib/lic-plans-data.js'
import { AlertTriangle, MessageCircle, Share2, TrendingUp, ShieldCheck } from 'lucide-react'
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

const SURRENDER_FAQ = [
  {
    question: 'Why does surrendering a policy result in a loss?',
    answer: 'LIC policies are long-term contracts. Early surrender forces the insurer to pay out ahead of schedule, recovering administrative and mortality costs from your accumulated premiums, leading to a financial loss.'
  },
  {
    question: 'What is the difference between GSV and SSV?',
    answer: 'Guaranteed Surrender Value (GSV) is the minimum cash value guaranteed by contract. Special Surrender Value (SSV) is calculated based on paid-up sum assured plus bonuses multiplied by a factor determined by LIC, usually higher than GSV.'
  },
  {
    question: 'Can I avoid surrendering my policy?',
    answer: 'Yes, you can make the policy paid-up (stop paying premiums but keep a reduced sum assured cover till maturity) or take a policy loan of up to 90% of the surrender value to meet short-term liquidity needs without losing cover.'
  }
]


function SurrenderCalcContent() {
  const searchParams = useSearchParams()
  const { lang } = useLang()
  const resultRef = useRef<HTMLDivElement | null>(null)

  const majorPlans = PLANS.filter((p: any) => p.status !== 'withdrawn' && ['endowment', 'moneyback', 'wholelife', 'child'].includes(p.category || ''))

  const [planNo, setPlanNo] = useState<number>(majorPlans[0]?.planNo || 715)
  const [sa, setSa] = useState<number>(1000000)
  const [term, setTerm] = useState<number>(20)
  const [yearsPaid, setYearsPaid] = useState<number>(5)
  const [annualPremiumInput, setAnnualPremiumInput] = useState<string>('')

  // Advanced Options
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [bonusRate, setBonusRate] = useState<number>(48)

  // Calculation Results
  const [hasCalculated, setHasCalculated] = useState(false)
  const [isCalculating, setIsCalculating] = useState(false)
  const [calcError, setCalcError] = useState<string | null>(null)
  const [totalPaid, setTotalPaid] = useState<number>(0)
  const [gsvVal, setGsvVal] = useState<number>(0)
  const [ssvVal, setSsvVal] = useState<number>(0)
  const [surrenderValue, setSurrenderValue] = useState<number>(0)
  const [lossAmount, setLossAmount] = useState<number>(0)
  const [lossPercent, setLossPercent] = useState<number>(0)
  const [isUnlocked, setIsUnlocked] = useState(false)
  
  // Alternatives inline calculations
  const [loanAmount, setLoanAmount] = useState<number>(0)
  const [reducedSA, setReducedSA] = useState<number>(0)
  const [reducedMaturity, setReducedMaturity] = useState<number>(0)

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

    // Check if session has phone auto-unlock
    const lead = getLeadInfo()
    if (lead && lead.phone) {
      setIsUnlocked(true)
    }
  }, [searchParams])

  const handleCalculate = async () => {
    setIsCalculating(true)
    setCalcError(null)
    try {
      // Resolve annual premium — use input or fetch from premium API
      let annualPremium = 0
      if (annualPremiumInput && Number(annualPremiumInput) > 0) {
        annualPremium = Number(annualPremiumInput)
      } else {
        const baselineAge = searchParams.get('age') ? Number(searchParams.get('age')) : 30
        const premRes = await fetch('/api/calculate/premium', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ planNo, sa, age: baselineAge, term, mode: 'yearly' }),
        })
        const premData = premRes.ok ? await premRes.json() : null
        annualPremium = premData?.yearlyYear1 ?? sa * 0.05
      }

      const res = await fetch('/api/calculate/surrender', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planNo, sa, annualPremium, yearsCompleted: yearsPaid, ppt: term, term }),
      })
      const data = await res.json()
      if (!res.ok) { setCalcError(data.error || 'Calculation failed'); return }

      setTotalPaid(data.premiumsPaidTotal)
      setGsvVal(data.gsv)
      setSsvVal(data.ssvEstimate)
      setSurrenderValue(data.payable)
      setLossAmount(data.lossOnSurrender)
      setLossPercent(Math.round((data.lossOnSurrender / data.premiumsPaidTotal) * 100))
      setLoanAmount(Math.round(data.payable * 0.90))
      setReducedSA(Math.round(sa * (yearsPaid / term)))
      setReducedMaturity(Math.round(sa * (yearsPaid / term)) + Math.round((bonusRate * sa / 1000) * yearsPaid))
      setHasCalculated(true)

      updateSession({ sumAssured: sa, policyTerm: term })
      addResult('surrender', { value: data.payable, loss: data.lossOnSurrender, loanAlternative: Math.round(data.payable * 0.90) })
    } catch {
      setCalcError('Network error. Please try again.')
    } finally {
      setIsCalculating(false)
    }
  }

  const handleReset = () => {
    setPlanNo(majorPlans[0]?.planNo || 715)
    setSa(1000000)
    setTerm(20)
    setYearsPaid(5)
    setAnnualPremiumInput('')
    setBonusRate(48)
    setSurrenderValue(0)
    setTotalPaid(0)
    setLossAmount(0)
    setLossPercent(0)
    setLoanAmount(0)
    setReducedSA(0)
    setReducedMaturity(0)
    setHasCalculated(false)
  }

  const visibleRows = [
    { label: 'Total Premiums Paid', value: `₹${Math.round(totalPaid).toLocaleString('en-IN')}` },
    { label: 'Paid Years / Policy Term', value: `${yearsPaid} / ${term} Years` },
    { label: 'Estimated Surrender Payout', value: `₹${surrenderValue.toLocaleString('en-IN')}`, isTotal: true },
  ]

  const gatedRows = [
    { label: 'Guaranteed Surrender Value (GSV)', value: `₹${gsvVal.toLocaleString('en-IN')}` },
    { label: 'Special Surrender Value (SSV)', value: `₹${ssvVal.toLocaleString('en-IN')}` },
    { label: 'Net Loss on Surrender', value: `₹${lossAmount.toLocaleString('en-IN')} (${lossPercent}%)`, isTotal: true },
    { label: 'Available Policy Loan (90%)', value: `₹${loanAmount.toLocaleString('en-IN')}` },
    { label: 'Reduced Paid-up sum assured', value: `₹${reducedSA.toLocaleString('en-IN')}` },
  ]

  const plan = PLANS.find((p: any) => p.planNo === planNo)
  const msg = hasCalculated ? `Namaste Ajay ji, I checked the surrender value of my LIC policy.
Sum Assured: ₹${Math.round(sa).toLocaleString('en-IN')}
Plan: ${plan?.name} (Plan ${planNo})
Years paid: ${yearsPaid}/${term}
Total paid: ₹${Math.round(totalPaid).toLocaleString('en-IN')}
Surrender value: ₹${Math.round(surrenderValue).toLocaleString('en-IN')}
Loss: ₹${Math.round(lossAmount).toLocaleString('en-IN')}
Should I surrender or take a policy loan?` : ''

  const crossLinks = [
    {
      label: 'Check Policy Loan alternatives →',
      href: `/calculators/loan?sa=${sa}&term=${term}`,
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
      label: 'Share this calculation →',
      onClick: () => {
        if (navigator.share) {
          navigator.share({
            title: 'LIC Surrender Value Calculator Result',
            text: `Estimated surrender value of my LIC policy: ₹${surrenderValue.toLocaleString('en-IN')} (loss: ₹${lossAmount.toLocaleString('en-IN')}).`,
            url: window.location.href
          }).catch(console.error)
        } else {
          navigator.clipboard.writeText(`Estimated surrender value of my LIC policy: ₹${surrenderValue.toLocaleString('en-IN')} (loss: ₹${lossAmount.toLocaleString('en-IN')}). Try it: ${window.location.href}`)
          alert('Copied link!')
        }
      },
      colorClass: 'text-gray-500 hover:text-gray-700',
      icon: Share2
    }
  ]

  const bars = [
    { label: 'Total premiums paid', value: totalPaid, max: totalPaid, colorClass: 'bg-blue-500', displayValue: `₹${Math.round(totalPaid).toLocaleString('en-IN')}` },
    { label: 'Surrender value cash payout', value: surrenderValue, max: totalPaid, colorClass: 'bg-amber-400', displayValue: `₹${Math.round(surrenderValue).toLocaleString('en-IN')}` }
  ]

  return (
    <CalculatorShell
      activeTabId="surrender"
      title="Surrender Value Calculator"
      infoTooltip="Calculate the cash surrender value of your LIC policy. Traditional policies require at least 2 completed years of premium payments to acquire a surrender value. Special Surrender Value (SSV) is usually higher than GSV."
      faq={SURRENDER_FAQ}
      sa={sa}
      term={term}
      hasCalculated={hasCalculated}
      onCalculate={handleCalculate}
      calculateButtonText={isCalculating ? 'Calculating...' : 'Calculate Surrender Value'}
      formFields={
        <>
          <div>
            <label className="text-xs font-semibold text-gray-700 mb-1.5 block">Select LIC Plan</label>
            <select
              value={planNo}
              onChange={(e) => { setPlanNo(Number(e.target.value)); setHasCalculated(false) }}
              className="w-full h-11 px-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs font-medium text-gray-900 bg-white"
            >
              {majorPlans.map((plan: any) => (
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
            min={2}
            max={term}
            unit=" yrs"
          />

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">Annual Premium Paid (Optional)</label>
            <input
              type="number"
              value={annualPremiumInput}
              onChange={(e) => { setAnnualPremiumInput(e.target.value); setHasCalculated(false) }}
              placeholder="Will auto-estimate if left blank"
              className="w-full h-11 px-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs font-medium text-gray-900"
            />
          </div>

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
            value={`₹${surrenderValue.toLocaleString('en-IN')}`}
            rawValue={surrenderValue}
            label="Estimated Surrender Value"
            contextText={`${plan?.name} (Plan ${planNo}) · ₹${(sa / 100000).toFixed(0)}L SA · Paid ${yearsPaid}/${term} yrs`}
            humanLineText={`You paid ₹${Math.round(totalPaid).toLocaleString('en-IN')} → Payout: ₹${surrenderValue.toLocaleString('en-IN')}`}
            visibleRows={visibleRows}
            gatedRows={gatedRows}
            insightText={`Surrendering costs ₹${lossAmount.toLocaleString('en-IN')} in lost premiums. A policy loan gives ₹${loanAmount.toLocaleString('en-IN')} cash immediately while keeping your full ₹${sa.toLocaleString('en-IN')} life cover.`}
            crossLinks={crossLinks}
            isUnlocked={isUnlocked}
            onUnlock={(ph) => setIsUnlocked(true)}
            calculatorName="surrender"
            inputs={{ planNo, sa, term, yearsPaid, annualPremiumInput, bonusRate }}
            whatsappMessage={msg}
          >
            {/* CSS-based bars */}
            <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
              <h4 className="text-[10px] uppercase tracking-wider text-gray-400 font-bold select-none">
                Surrender Value Payout vs Paid Premiums
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
                          bar.colorClass === 'bg-blue-500' ? 'bg-[#0f1225]' : 'bg-[#d97706]'
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Unlocked alternatives display block */}
            {isUnlocked && (
              <div className="mt-4 p-4 rounded-xl bg-amber-50/30 border border-amber-200/50 text-xs text-gray-800 space-y-3 animate-fadeIn">
                <div className="font-semibold text-gray-900 border-b border-amber-200/30 pb-1 text-xs">
                  Compare surrendering with alternative options:
                </div>
                <div>
                  <div className="font-bold flex items-center gap-1">
                    <span>💰 Option A — Policy Loan:</span>
                    <span className="text-emerald-700">Get ₹{loanAmount.toLocaleString('en-IN')} cash now</span>
                  </div>
                  <div className="text-gray-500 mt-0.5">Retain your full ₹{sa.toLocaleString('en-IN')} life coverage and maturity benefits.</div>
                </div>
                <div>
                  <div className="font-bold flex items-center gap-1">
                    <span>📋 Option B — Reduced Paid-up:</span>
                    <span className="text-blue-700">Stop premiums, keep ₹{reducedSA.toLocaleString('en-IN')} cover</span>
                  </div>
                  <div className="text-gray-500 mt-0.5">Policy maturity value is preserved at a lower ₹{reducedMaturity.toLocaleString('en-IN')}.</div>
                </div>
                <div className="pt-1.5 border-t border-amber-200/30 text-[10px] text-gray-400 flex items-center gap-1 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                  <span>Talk to Ajay ji before surrendering or stopping payments.</span>
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

export default function SurrenderValueCalculatorPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0f1225]"></div>
      </div>
    }>
      <SurrenderCalcContent />
    </Suspense>
  )
}
