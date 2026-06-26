'use client'
import React, { Suspense, useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import { AlertTriangle, ShieldCheck } from 'lucide-react'
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

function SurrenderCalcContent() {
  const searchParams = useSearchParams()
  const resultRef = useRef<HTMLDivElement | null>(null)

  const majorPlans = PLANS.filter(p => p.status !== 'withdrawn' && ['endowment', 'moneyback', 'wholelife', 'child'].includes(p.category || ''))

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
  const [totalPaid, setTotalPaid] = useState<number>(0)
  const [gsvVal, setGsvVal] = useState<number>(0)
  const [ssvVal, setSsvVal] = useState<number>(0)
  const [surrenderValue, setSurrenderValue] = useState<number>(0)
  const [lossAmount, setLossAmount] = useState<number>(0)
  const [lossPercent, setLossPercent] = useState<number>(0)
  
  // Alternatives inline calculations
  const [loanAmount, setLoanAmount] = useState<number>(0)
  const [reducedSA, setReducedSA] = useState<number>(0)
  const [reducedMaturity, setReducedMaturity] = useState<number>(0)

  // Parse URL query params & session storage pre-fill
  useEffect(() => {
    const qAge = searchParams.get('age')
    const qSa = searchParams.get('sa')
    const qTerm = searchParams.get('term')

    if (qSa) setSa(Number(qSa))
    if (qTerm) setTerm(Number(qTerm))

    // Session pre-fill fallback
    const sessionInputs = getSharedInputs()
    if (!qSa && sessionInputs.sumAssured) setSa(sessionInputs.sumAssured)
    if (!qTerm && sessionInputs.policyTerm) setTerm(sessionInputs.policyTerm)
  }, [searchParams])

  const selectedPlan = PLANS.find(p => p.planNo === planNo)

  const handleCalculate = () => {
    // 1. Determine annual premium
    let annualPremium = 0
    if (annualPremiumInput && !isNaN(Number(annualPremiumInput)) && Number(annualPremiumInput) > 0) {
      annualPremium = Number(annualPremiumInput)
    } else {
      if (selectedPlan) {
        // Assume age 30 for baseline rate lookup if not in query
        const baselineAge = searchParams.get('age') ? Number(searchParams.get('age')) : 30
        const ppt = getPPT(selectedPlan, term, baselineAge)
        const premRes = calculatePremium({ planNo, sa, age: baselineAge, term, ppt, mode: 'yearly' })
        annualPremium = premRes ? premRes.yearlyYear1 : sa * 0.05
      } else {
        annualPremium = sa * 0.05
      }
    }

    const totalPaidSum = annualPremium * yearsPaid
    setTotalPaid(totalPaidSum)

    // 2. GSV calculation: GSV = total_premiums_paid * GSV_factor
    const gsvFactor = getGsvFactor(yearsPaid)
    // GSV excludes first year premium in traditional calculations
    const eligiblePremsForGsv = Math.max(totalPaidSum - annualPremium, 0)
    const gsv = Math.round(eligiblePremsForGsv * gsvFactor)
    setGsvVal(gsv)

    // 3. SSV calculation: SSV = (Paid-up SA + Accrued Bonus) * SSV_factor
    const paidUpSA = Math.round(sa * (yearsPaid / term))
    const accruedBonus = Math.round((bonusRate * sa / 1000) * yearsPaid)
    
    const remainingTerm = term - yearsPaid
    const ssvFactor = Math.max(0.1, 0.9 - (remainingTerm * 0.035)) // LIC SSV factor proxy
    const ssv = Math.round((paidUpSA + accruedBonus) * ssvFactor)
    setSsvVal(ssv)

    // 4. Max Surrender Value
    const finalSurrender = Math.max(gsv, ssv)
    setSurrenderValue(finalSurrender)

    const loss = totalPaidSum - finalSurrender
    setLossAmount(loss)
    setLossPercent(Math.round((loss / totalPaidSum) * 100))

    // Alternatives Calculated Inline
    setLoanAmount(Math.round(finalSurrender * 0.90))
    setReducedSA(paidUpSA)
    setReducedMaturity(paidUpSA + accruedBonus)
    setHasCalculated(true)

    // Save to session
    updateSession({ sumAssured: sa, policyTerm: term })
    addResult('surrender', { value: finalSurrender, loss, loanAlternative: Math.round(finalSurrender * 0.90) })
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

  const breakdownRows = hasCalculated ? [
    { label: 'Total Premiums Paid', value: `₹${Math.round(totalPaid).toLocaleString('en-IN')}` },
    { label: 'Guaranteed Surrender Value (GSV)', value: `₹${gsvVal.toLocaleString('en-IN')}` },
    { label: 'Special Surrender Value (SSV)', value: `₹${ssvVal.toLocaleString('en-IN')}` },
    { label: 'Final Cash Surrender Value', value: `₹${surrenderValue.toLocaleString('en-IN')}`, isTotal: true },
    { label: 'Net Loss on Surrender', value: `₹${lossAmount.toLocaleString('en-IN')} (${lossPercent}%)`, isTotal: true }
  ] : []

  const bars = hasCalculated ? [
    { label: 'Total premiums paid', value: totalPaid, max: totalPaid, colorClass: 'bg-blue-500', displayValue: `₹${Math.round(totalPaid).toLocaleString('en-IN')}` },
    { label: 'Surrender value cash payout', value: surrenderValue, max: totalPaid, colorClass: 'bg-amber-400', displayValue: `₹${Math.round(surrenderValue).toLocaleString('en-IN')}` }
  ] : []

  const plan = PLANS.find(p => p.planNo === planNo)
  const msg = hasCalculated ? `Namaste Ajay ji, I checked the surrender value of my LIC policy.
₹${Math.round(sa).toLocaleString('en-IN')} cover, ${plan?.name} (Plan ${planNo}), paid for ${yearsPaid}/${term}yr. Total paid ₹${Math.round(totalPaid).toLocaleString('en-IN')} → surrender cash ₹${Math.round(surrenderValue).toLocaleString('en-IN')}.
Should I surrender or take a policy loan?` : ''
  const whatsappUrl = `https://wa.me/919415313434?text=${encodeURIComponent(msg)}`

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
      calculateButtonText="Calculate Surrender Value"
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
            min={2}
            max={term}
            unit=" yrs"
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Annual Premium Paid (Optional)</label>
            <input
              type="number"
              value={annualPremiumInput}
              onChange={(e) => { setAnnualPremiumInput(e.target.value); setHasCalculated(false) }}
              placeholder="Will auto-estimate if left blank"
              className="w-full h-11 px-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-base text-gray-900"
            />
          </div>

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
              value={`₹${surrenderValue.toLocaleString('en-IN')}`}
              label="Estimated Cash Surrender Value"
              subtext={`You paid ₹${Math.round(totalPaid).toLocaleString('en-IN')}. Net loss of ₹${lossAmount.toLocaleString('en-IN')} (${lossPercent}%)`}
              type="caution"
              insightText={`Surrendering costs ₹${lossAmount.toLocaleString('en-IN')}. A policy loan gives ₹${loanAmount.toLocaleString('en-IN')} NOW while keeping your full ₹${sa.toLocaleString('en-IN')} cover. Better deal.`}
              InsightIcon={AlertTriangle}
              rawValue={surrenderValue}
              shareText={`I calculated my LIC policy surrender value on Poddar Wealth: ₹${Math.round(sa).toLocaleString('en-IN')} cover, ${plan?.name}, ${yearsPaid}/${term}yr paid → surrender cash value ₹${surrenderValue.toLocaleString('en-IN')} (loss: ₹${lossAmount.toLocaleString('en-IN')}). Try it: poddarwealth.com/calculators/surrender-value`}
            >
              {/* Calculated alternatives display panel */}
              <div className="mt-4 p-4 rounded-xl bg-white/70 border border-amber-200/50 text-xs text-gray-800 space-y-3">
                <div className="font-semibold text-gray-900 border-b border-amber-200/40 pb-1 text-sm">
                  Before you surrender, compare:
                </div>
                <div>
                  <div className="font-bold flex items-center gap-1">
                    <span>💰 Policy Loan:</span>
                    <span className="text-emerald-700">Get ₹{loanAmount.toLocaleString('en-IN')} now</span>
                  </div>
                  <div className="text-gray-500 mt-0.5">Keep your ₹{sa.toLocaleString('en-IN')} cover + full maturity benefits.</div>
                </div>
                <div>
                  <div className="font-bold flex items-center gap-1">
                    <span>📋 Reduced Paid-up:</span>
                    <span className="text-blue-700">Stop premiums, keep ₹{reducedSA.toLocaleString('en-IN')} cover</span>
                  </div>
                  <div className="text-gray-500 mt-0.5">Maturity value is preserved at a reduced ₹{reducedMaturity.toLocaleString('en-IN')}.</div>
                </div>
                <div className="pt-1.5 border-t border-amber-200/40 text-[10px] text-gray-500 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                  <span>Talk to Ajay ji before making any decision.</span>
                </div>
              </div>
            </ResultCard>

            <LeadCapture
              calculatorId="surrender-value"
              inputs={{ planNo, sa, term, yearsPaid, annualPremiumInput, bonusRate }}
              result={{ surrenderValue, loss: lossAmount, loanAlternative: loanAmount }}
              hasCalculated={hasCalculated}
              whatsappMessage={msg}
              onReset={handleReset}
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

export default function SurrenderValueCalculatorPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    }>
      <SurrenderCalcContent />
    </Suspense>
  )
}
