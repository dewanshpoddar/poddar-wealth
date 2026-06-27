'use client'
import React, { Suspense, useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import { Award, ShieldAlert, ShieldCheck, Download, MessageCircle, Share2, TrendingUp } from 'lucide-react'
import QuickPick from '@/components/ui/QuickPick'
import SliderField from '@/components/ui/SliderField'
import CalculatorShell from '@/components/calculators/CalculatorShell'
import ResultPanel from '@/components/calculators/ResultPanel'
import { getSharedInputs, updateSession, addResult, getLeadInfo } from '@/lib/calculator-session'
import { useLang } from '@/lib/LangContext'
import { ADVISOR_PHONE } from '@/lib/constants'

const incomeOptions = [
  { label: '₹1.8L', value: 180000 },
  { label: '₹3L', value: 300000 },
  { label: '₹5L', value: 500000 },
  { label: '₹8L', value: 800000 },
  { label: '₹12L', value: 1200000 },
]

const policyOptions = [
  { label: '1', value: 1 },
  { label: '2', value: 2 },
  { label: '3', value: 3 },
  { label: '4', value: 4 },
  { label: '5', value: 5 },
  { label: '6+', value: 6 },
]

const yesNoOptions = [
  { label: 'Yes', value: true },
  { label: 'No', value: false },
]

const HEALTH_FAQ = [
  {
    question: 'What is a Policy Health Score?',
    answer: 'Your Policy Health Score measures the overall health of your insurance portfolio based on coverage adequacy, premium affordability, protection mix (term + health), maturity progress, and dependent protection.'
  },
  {
    question: 'Why is a term plan plus health plan important?',
    answer: 'Term insurance replaces your income if you pass away. Health insurance covers medical bills during your life. Both are the foundational pillars of financial security.'
  },
  {
    question: 'How can I improve my Policy Health Score?',
    answer: 'You can improve your score by closing coverage gaps (adding term cover to reach 10x-15x income), purchasing a family health floater, or reviewing high-premium low-cover policies.'
  }
]

function getGrade(score: number): string {
  if (score >= 90) return 'A+'
  if (score >= 80) return 'A'
  if (score >= 65) return 'B+'
  if (score >= 50) return 'C'
  return 'D'
}

function PolicyHealthCalcContent() {
  const searchParams = useSearchParams()
  const { lang } = useLang()
  const resultRef = useRef<HTMLDivElement | null>(null)

  const [annualIncome, setAnnualIncome] = useState<number>(300000)
  const [totalCover, setTotalCover] = useState<string>('')
  const [hasHealth, setHasHealth] = useState<boolean>(false)
  const [hasTerm, setHasTerm] = useState<boolean>(false)
  const [policiesCount, setPoliciesCount] = useState<number>(1)

  // Advanced inputs
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [premiumAmount, setPremiumAmount] = useState<string>('')
  const [age, setAge] = useState<number>(30)
  const [dependents, setDependents] = useState<number>(2)
  const [policyYear, setPolicyYear] = useState<number>(3)

  // Calculations state
  const [hasCalculated, setHasCalculated] = useState(false)
  const [totalScore, setTotalScore] = useState<number>(0)
  const [grade, setGrade] = useState<string>('B+')
  const [downloading, setDownloading] = useState<boolean>(false)
  const [isUnlocked, setIsUnlocked] = useState(false)

  const [coverageScore, setCoverageScore] = useState<number>(0)
  const [affordabilityScore, setAffordabilityScore] = useState<number>(0)
  const [maturityScore, setMaturityScore] = useState<number>(0)
  const [protectionScore, setProtectionScore] = useState<number>(0)
  const [dependentScore, setDependentScore] = useState<number>(0)

  const [coverageComment, setCoverageComment] = useState<string>('')
  const [affordabilityComment, setAffordabilityComment] = useState<string>('')
  const [maturityComment, setMaturityComment] = useState<string>('')
  const [protectionComment, setProtectionComment] = useState<string>('')
  const [dependentComment, setDependentComment] = useState<string>('')
  const [topImprovement, setTopImprovement] = useState<string>('')

  // Parse URL query params & session storage pre-fill
  useEffect(() => {
    const qAge = searchParams.get('age')
    const qSa = searchParams.get('sa')
    
    if (qAge) setAge(Number(qAge))
    if (qSa) setTotalCover(String(qSa))

    // Session pre-fill fallback
    const sessionInputs = getSharedInputs()
    if (!qAge && sessionInputs.age) setAge(sessionInputs.age)
    if (!qSa && sessionInputs.sumAssured) setTotalCover(String(sessionInputs.sumAssured))
    if (sessionInputs.annualIncome) setAnnualIncome(sessionInputs.annualIncome)

    // Check session for phone auto-unlock
    const lead = getLeadInfo()
    if (lead && lead.phone) {
      setIsUnlocked(true)
    }
  }, [searchParams])

  const handleCalculate = () => {
    const coverVal = totalCover ? Number(totalCover) : 0
    const annualPremium = premiumAmount ? Number(premiumAmount) : coverVal * 0.05

    // 1. Coverage Adequacy (35 pts)
    const idealCover = annualIncome * 10
    const coverageRatio = idealCover > 0 ? (coverVal / idealCover) : 0
    const covScore = Math.min(35, Math.round(coverageRatio * 35))
    setCoverageScore(covScore)
    const covPct = Math.round(coverageRatio * 100)
    setCoverageComment(coverageRatio >= 1
      ? `Your cover is ${covPct}% of the recommended sum. Well protected.`
      : `Your cover is only ${covPct}% of the recommended ₹${(idealCover/100000).toFixed(1)}L. Consider top-up term plan.`
    )

    // 2. Premium Affordability (20 pts)
    const premiumRatio = annualIncome > 0 ? (annualPremium / annualIncome) : 0
    let affScore = 20
    let affComment = ''
    if (premiumRatio <= 0.05) {
      affScore = 20
      affComment = `You spend ${(premiumRatio * 100).toFixed(1)}% of income on premiums. Very affordable.`
    } else if (premiumRatio <= 0.10) {
      affScore = 15
      affComment = `You spend ${(premiumRatio * 100).toFixed(1)}% of income on premiums. Moderate and manageable.`
    } else if (premiumRatio <= 0.15) {
      affScore = 10
      affComment = `You spend ${(premiumRatio * 100).toFixed(1)}% of income. High. Consider reviewing multiple policies.`
    } else {
      affScore = 5
      affComment = `You spend ${(premiumRatio * 100).toFixed(1)}% of income on premiums. High stress. Review portfolio.`
    }
    setAffordabilityScore(affScore)
    setAffordabilityComment(affComment)

    // 3. Policy Maturity Progress (15 pts)
    let matScore = 3
    let matComment = ''
    if (policyYear >= 10) {
      matScore = 15
      matComment = `${policyYear} years paid. Strong surrender value and loan eligibility.`
    } else if (policyYear >= 5) {
      matScore = 10
      matComment = `${policyYear} years paid. Good progress. Keep going.`
    } else if (policyYear >= 3) {
      matScore = 7
      matComment = `${policyYear} years paid. Past the early lock-in period.`
    } else {
      matScore = 3
      matComment = `Only ${policyYear} years paid. Policy requires at least 3 years to build cash value.`
    }
    setMaturityScore(matScore)
    setMaturityComment(matComment)

    // 4. Protection Mix (20 pts)
    const protScore = (hasTerm ? 10 : 0) + (hasHealth ? 10 : 0)
    setProtectionScore(protScore)
    setProtectionComment(
      protScore === 20
        ? 'You have both term and health insurance. Good protection foundation.'
        : hasTerm
          ? 'You have term cover but no health insurance. Add family health floater.'
          : hasHealth
            ? 'You have health cover but no term plan. Term cover is recommended.'
            : 'No term or health plans detected. Critical coverage gap.'
    )

    // 5. Dependent Coverage (10 pts)
    let depScore = 10
    let depComment = ''
    if (dependents === 0) {
      depScore = 10
      depComment = 'No dependents. No coverage gap.'
    } else {
      const coverPerDependent = coverVal / dependents
      if (coverPerDependent >= 2000000) {
        depScore = 10
        depComment = `₹${(coverPerDependent/100000).toFixed(1)}L per dependent. Adequate cover.`
      } else if (coverPerDependent >= 1000000) {
        depScore = 7
        depComment = `₹${(coverPerDependent/100000).toFixed(1)}L per dependent. Consider increasing sum assured.`
      } else if (coverPerDependent >= 500000) {
        depScore = 4
        depComment = `₹${(coverPerDependent/100000).toFixed(1)}L per dependent. Under-insured for family.`
      } else {
        depScore = 2
        depComment = `₹${(coverPerDependent/100000).toFixed(1)}L per dependent. Critical cover gap.`
      }
    }
    setDependentScore(depScore)
    setDependentComment(depComment)

    const finalScore = covScore + affScore + matScore + protScore + depScore
    setTotalScore(finalScore)
    const gr = getGrade(finalScore)
    setGrade(gr)

    let suggestion = ''
    if (!hasHealth) {
      suggestion = 'Adding a ₹5L family health floater will protect you from hospital bills and lift your score to A!'
    } else if (!hasTerm) {
      suggestion = 'Adding a pure term plan of ₹50L will close your primary income cover gap and lift your score to A!'
    } else if (coverageRatio < 0.5) {
      suggestion = 'Topping up your life coverage to reach 10x annual income will lift your score from B to A!'
    } else if (premiumRatio > 0.15) {
      suggestion = 'Your premiums are high. Restructuring multiple low-cover endowment policies will lower cost and improve score.'
    } else {
      suggestion = 'Your portfolio is in good shape. Consider adding critical illness rider to reach A+ score!'
    }
    setTopImprovement(suggestion)
    setHasCalculated(true)

    // Save to session
    updateSession({ age, sumAssured: coverVal, annualIncome })
    addResult('healthScore', { score: finalScore, grade: gr })
  }

  const handleDownload = async () => {
    setDownloading(true)
    try {
      const res = await fetch('/api/reports/wealth-blueprint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Valued Client',
          sumAssured: totalCover ? Number(totalCover) : 0,
          annualPremium: premiumAmount ? Number(premiumAmount) : 0,
          policyYear,
          currentAge: age,
          annualIncome,
          dependents,
          hasHealthInsurance: hasHealth,
          hasTermInsurance: hasTerm,
          planType: 'endowment',
          totalScore,
          grade,
          breakdown: {
            coverageAdequacy: { score: coverageScore, max: 35, comment: coverageComment },
            premiumAffordability: { score: affordabilityScore, max: 20, comment: affordabilityComment },
            maturityProgress: { score: maturityScore, max: 15, comment: maturityComment },
            protectionMix: { score: protectionScore, max: 20, comment: protectionComment },
            dependentCoverage: { score: dependentScore, max: 10, comment: dependentComment },
          },
          summary: `Your Policy Health Score is ${grade} (${totalScore}/100). ${topImprovement}`
        })
      })
      if (!res.ok) throw new Error('Failed to generate report')
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `policy-health-report.pdf`
      a.click()
      URL.revokeObjectURL(url)
    } catch (err) {
      alert('Failed to download report. Please try again.')
    } finally {
      setDownloading(false)
    }
  }

  const handleReset = () => {
    setAnnualIncome(300000)
    setTotalCover('')
    setHasHealth(false)
    setHasTerm(false)
    setPoliciesCount(1)
    setPremiumAmount('')
    setAge(30)
    setDependents(2)
    setPolicyYear(3)
    setTotalScore(0)
    setHasCalculated(false)
  }

  const visibleRows = [
    { label: 'Annual Income', value: `₹${annualIncome.toLocaleString('en-IN')}` },
    { label: 'Total Current Coverage', value: `₹${(totalCover ? Number(totalCover) : 0).toLocaleString('en-IN')}` },
    { label: 'Total Portfolio Score', value: `${totalScore}/100`, isTotal: true },
  ]

  const gatedRows = [
    { label: 'Coverage Adequacy (max 35)', value: `${coverageScore}/35` },
    { label: 'Premium Affordability (max 20)', value: `${affordabilityScore}/20` },
    { label: 'Maturity Progress (max 15)', value: `${maturityScore}/15` },
    { label: 'Protection Mix (max 20)', value: `${protectionScore}/20` },
    { label: 'Dependent Coverage (max 10)', value: `${dependentScore}/10` },
  ]

  const msg = hasCalculated ? `Namaste Ajay ji, I checked my Policy Health Score on Poddar Wealth.
My score is ${grade} (${totalScore}/100).
Gaps & Suggestions: ${topImprovement}
Can you suggest options to optimize my insurance portfolio?` : ''

  const crossLinks = [
    {
      label: 'Get details on Term Life security plans →',
      href: '/services/term-life',
      colorClass: 'text-[#d97706] hover:text-amber-700',
      icon: TrendingUp
    },
    {
      label: 'Discuss health audit details with Ajay ji →',
      href: `https://wa.me/91${ADVISOR_PHONE}?text=${encodeURIComponent(msg)}`,
      colorClass: 'text-[#059669] hover:text-emerald-700',
      icon: MessageCircle
    },
    {
      label: 'Share portfolio score →',
      onClick: () => {
        if (navigator.share) {
          navigator.share({
            title: 'Policy Health Score Audit',
            text: `My insurance portfolio health score is ${grade} (${totalScore}/100). Try check yours:`,
            url: window.location.href
          }).catch(console.error)
        } else {
          navigator.clipboard.writeText(`My insurance portfolio health score is ${grade} (${totalScore}/100). Check yours: ${window.location.href}`)
          alert('Copied link!')
        }
      },
      colorClass: 'text-gray-500 hover:text-gray-700',
      icon: Share2
    }
  ]

  return (
    <CalculatorShell
      activeTabId="health"
      title="Policy Health Score"
      infoTooltip="Check the financial health of your insurance policies. Portfolio health is evaluated across 5 key dimensions: coverage adequacy, affordability, plan progress, term/health protection mix, and dependent cover."
      faq={HEALTH_FAQ}
      age={age}
      sa={totalCover ? Number(totalCover) : 0}
      term={15}
      hasCalculated={hasCalculated}
      onCalculate={handleCalculate}
      calculateButtonText="Check Portfolio Health"
      formFields={
        <>
          <QuickPick
            label="Annual Income"
            value={annualIncome}
            onChange={(val) => { setAnnualIncome(val); setHasCalculated(false) }}
            options={incomeOptions}
            showCustom
            customPlaceholder="Enter custom annual income"
            customSuffix="/yr"
          />

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">Total Life Coverage (Sum Assured) (₹)</label>
            <input
              type="number"
              value={totalCover}
              onChange={(e) => { setTotalCover(e.target.value); setHasCalculated(false) }}
              placeholder="Enter total sum assured of all current policies"
              className="w-full h-11 px-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs font-medium text-gray-900"
            />
          </div>

          <QuickPick
            label="Do you have health insurance?"
            value={hasHealth}
            onChange={(val) => { setHasHealth(val as boolean); setHasCalculated(false) }}
            options={yesNoOptions}
          />

          <QuickPick
            label="Do you have a pure term life plan?"
            value={hasTerm}
            onChange={(val) => { setHasTerm(val as boolean); setHasCalculated(false) }}
            options={yesNoOptions}
          />

          <QuickPick
            label="Number of Insurance Policies"
            value={policiesCount}
            onChange={(val) => { setPoliciesCount(val); setHasCalculated(false) }}
            options={policyOptions}
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
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Total Annual Premiums Paid (₹)</label>
                  <input
                    type="number"
                    value={premiumAmount}
                    onChange={(e) => { setPremiumAmount(e.target.value); setHasCalculated(false) }}
                    placeholder="Enter total annual premium paid across policies"
                    className="w-full h-11 px-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs font-medium text-gray-900"
                  />
                </div>

                <SliderField
                  label="Your Age"
                  value={age}
                  onChange={(val) => { setAge(val); setHasCalculated(false) }}
                  min={18}
                  max={75}
                  unit=" yrs"
                />

                <SliderField
                  label="Number of Dependents"
                  value={dependents}
                  onChange={(val) => { setDependents(val); setHasCalculated(false) }}
                  min={0}
                  max={8}
                  unit=" members"
                />

                <SliderField
                  label="Average Years Paid (Progress)"
                  value={policyYear}
                  onChange={(val) => { setPolicyYear(val); setHasCalculated(false) }}
                  min={0}
                  max={25}
                  unit=" yrs"
                />
              </div>
            )}
          </div>
        </>
      }
      resultPanel={
        hasCalculated && (
          <ResultPanel
            value={`${grade} (${totalScore}/100)`}
            rawValue={totalScore}
            isCurrency={false}
            valueSuffix="/100"
            label="Portfolio Health Score"
            contextText={`Income: ₹${annualIncome.toLocaleString('en-IN')}/yr · Policies: ${policiesCount} · Age: ${age}`}
            humanLineText={`Grade: ${grade} — ${totalScore >= 80 ? 'Good coverage foundation!' : 'Portfolio needs improvement!'}`}
            HumanLineIcon={Award}
            visibleRows={visibleRows}
            gatedRows={gatedRows}
            insightText={`Your biggest improvement area: ${topImprovement}`}
            crossLinks={crossLinks}
            isUnlocked={isUnlocked}
            onUnlock={(ph) => setIsUnlocked(true)}
            calculatorName="health"
            inputs={{ annualIncome, totalCover, hasHealth, hasTerm, policiesCount, premiumAmount, age, dependents, policyYear }}
            whatsappMessage={msg}
          >
            {/* Audited progress dimensions visible when unlocked */}
            {isUnlocked && (
              <div className="mt-4 space-y-3.5 p-4 rounded-xl bg-white border border-gray-100 text-xs text-gray-800 animate-fadeIn">
                <div className="font-semibold text-gray-900 border-b border-gray-50 pb-1.5 text-xs">
                  Detailed Dimension Scores:
                </div>
                
                <div>
                  <div className="flex justify-between text-xs font-medium text-gray-700 mb-1">
                    <span>Coverage Adequacy</span>
                    <span>{coverageScore}/35</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${coverageScore >= 25 ? 'bg-emerald-600' : 'bg-amber-500'}`}
                      style={{ width: `${(coverageScore / 35) * 100}%` }}
                    />
                  </div>
                  <div className="text-[10px] text-gray-500 mt-1 leading-relaxed">{coverageComment}</div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-medium text-gray-700 mb-1">
                    <span>Premium Affordability</span>
                    <span>{affordabilityScore}/20</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${affordabilityScore >= 15 ? 'bg-emerald-600' : 'bg-amber-500'}`}
                      style={{ width: `${(affordabilityScore / 20) * 100}%` }}
                    />
                  </div>
                  <div className="text-[10px] text-gray-500 mt-1 leading-relaxed">{affordabilityComment}</div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-medium text-gray-700 mb-1">
                    <span>Policy Maturity Progress</span>
                    <span>{maturityScore}/15</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${maturityScore >= 10 ? 'bg-emerald-600' : 'bg-amber-500'}`}
                      style={{ width: `${(maturityScore / 15) * 100}%` }}
                    />
                  </div>
                  <div className="text-[10px] text-gray-500 mt-1 leading-relaxed">{maturityComment}</div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-medium text-gray-700 mb-1">
                    <span>Protection Mix</span>
                    <span>{protectionScore}/20</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${protectionScore === 20 ? 'bg-emerald-600' : 'bg-amber-500'}`}
                      style={{ width: `${(protectionScore / 20) * 100}%` }}
                    />
                  </div>
                  <div className="text-[10px] text-gray-500 mt-1 leading-relaxed">{protectionComment}</div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-medium text-gray-700 mb-1">
                    <span>Dependent Coverage</span>
                    <span>{dependentScore}/10</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${dependentScore >= 7 ? 'bg-emerald-600' : 'bg-amber-500'}`}
                      style={{ width: `${(dependentScore / 10) * 100}%` }}
                    />
                  </div>
                  <div className="text-[10px] text-gray-500 mt-1 leading-relaxed">{dependentComment}</div>
                </div>

                {/* Report Download PDF button */}
                <button
                  onClick={handleDownload}
                  disabled={downloading}
                  className="w-full flex items-center justify-center gap-1.5 h-10 border border-blue-200 hover:border-blue-300 text-blue-600 bg-blue-50/50 hover:bg-blue-50 text-[11px] font-bold rounded-lg transition-colors cursor-pointer disabled:opacity-50 mt-3"
                >
                  <Download className="w-3.5 h-3.5" />
                  {downloading ? 'Generating PDF...' : 'Download Full PDF Report'}
                </button>
              </div>
            )}
          </ResultPanel>
        )
      }
      resultRef={resultRef}
    />
  )
}

export default function PolicyHealthCalculatorPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0f1225]"></div>
      </div>
    }>
      <PolicyHealthCalcContent />
    </Suspense>
  )
}
