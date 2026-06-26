'use client'
import React, { Suspense, useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import { Shield, AlertTriangle } from 'lucide-react'
import QuickPick from '@/components/ui/QuickPick'
import SliderField from '@/components/ui/SliderField'
import CalculatorShell from '@/components/calculators/CalculatorShell'
import ResultCard from '@/components/calculators/ResultCard'
import ResultBreakdown from '@/components/calculators/ResultBreakdown'
import ActionBar from '@/components/calculators/ActionBar'

const incomeOptions = [
  { label: '₹15K', value: 15000 },
  { label: '₹25K', value: 25000 },
  { label: '₹40K', value: 40000 },
  { label: '₹60K', value: 60000 },
  { label: '₹1L', value: 100000 },
]

const depOptions = [
  { label: '1', value: 1 },
  { label: '2', value: 2 },
  { label: '3', value: 3 },
  { label: '4', value: 4 },
  { label: '5', value: 5 },
  { label: '6', value: 6 },
]

const methodOptions = [
  { label: 'Simple (15x Income)', value: 'simple' },
  { label: 'Detailed HLV Method', value: 'hlv' },
]

const COVERAGE_FAQ = [
  {
    question: 'What is the Human Life Value (HLV) method?',
    answer: 'The HLV method calculates the financial value of a human life based on future earnings potential, dependents, outstanding debts, and upcoming capital requirements (like child education), minus existing assets.'
  },
  {
    question: 'How much life insurance cover is recommended?',
    answer: 'As a rule of thumb, you should have life insurance coverage equal to at least 10 to 15 times your annual income. This ensures your family can maintain their lifestyle in your absence.'
  },
  {
    question: 'How does a coverage gap affect my family?',
    answer: 'A coverage gap means your family is under-insured. In your absence, they may struggle to clear loans or maintain daily expenses. A term policy can close this gap affordably.'
  }
]

function CoverageCalcContent() {
  const searchParams = useSearchParams()
  const resultRef = useRef<HTMLDivElement | null>(null)

  const [monthlyIncome, setMonthlyIncome] = useState<number>(40000)
  const [age, setAge] = useState<number>(30)
  const [dependents, setDependents] = useState<number>(2)
  
  // Advanced & Detailed inputs
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [method, setMethod] = useState<'simple' | 'hlv'>('simple')
  const [existingCover, setExistingCover] = useState<string>('')
  const [outstandingLoans, setOutstandingLoans] = useState<string>('')
  const [educationFund, setEducationFund] = useState<string>('')
  const [spouseWorking, setSpouseWorking] = useState<boolean>(false)

  // Calculations state
  const [hasCalculated, setHasCalculated] = useState(false)
  const [recommendedCover, setRecommendedCover] = useState<number>(0)
  const [gapVal, setGapVal] = useState<number>(0)
  const [incomeReplacement, setIncomeReplacement] = useState<number>(0)
  const [dependentSupport, setDependentSupport] = useState<number>(0)
  const [emergencyFund, setEmergencyFund] = useState<number>(0)
  const [monthlyPremiumEstimate, setMonthlyPremiumEstimate] = useState<number>(0)

  // Parse URL query params
  useEffect(() => {
    const qAge = searchParams.get('age')
    const qSa = searchParams.get('sa')
    
    if (qAge) setAge(Number(qAge))
    if (qSa) {
      // Set existing cover as the URL SA to see if there is any remaining gap
      setExistingCover(String(qSa))
    }
  }, [searchParams])

  const handleCalculate = () => {
    const annualIncome = monthlyIncome * 12
    const loans = outstandingLoans ? Number(outstandingLoans) : 0
    const education = educationFund ? Number(educationFund) : 0
    const existing = existingCover ? Number(existingCover) : 0
    const emergency = Math.round(annualIncome * 0.5) // 6 months of income

    let totalNeeded = 0
    let incReplace = 0
    let depSupport = 0

    if (method === 'simple') {
      totalNeeded = annualIncome * 15
      incReplace = annualIncome * 15
    } else {
      // HLV Method
      const yearsTo60 = Math.max(60 - age, 5)
      incReplace = Math.round(annualIncome * yearsTo60 * 0.7)
      
      // Dependent support: 3x annual income per dependent (reduced by 30% if spouse is working)
      const spouseFactor = spouseWorking ? 0.7 : 1.0
      depSupport = Math.round(dependents * annualIncome * 2 * spouseFactor)
      
      totalNeeded = incReplace + depSupport + loans + education + emergency
    }

    const recommended = Math.max(totalNeeded, 0)
    const gap = Math.max(recommended - existing, 0)
    
    // Estimate term premium for the gap (approx ₹1.5 per ₹1000 SA per year, or ₹0.125 per ₹1000 SA per month)
    const estMonthlyPrem = gap > 0 ? Math.round(gap * 0.000125) : 0

    setRecommendedCover(recommended)
    setGapVal(gap)
    setIncomeReplacement(incReplace)
    setDependentSupport(depSupport)
    setEmergencyFund(emergency)
    setMonthlyPremiumEstimate(estMonthlyPrem)
    setHasCalculated(true)
  }

  const handleReset = () => {
    setMonthlyIncome(40000)
    setAge(30)
    setDependents(2)
    setMethod('simple')
    setExistingCover('')
    setOutstandingLoans('')
    setEducationFund('')
    setSpouseWorking(false)
    setRecommendedCover(0)
    setGapVal(0)
    setIncomeReplacement(0)
    setDependentSupport(0)
    setEmergencyFund(0)
    setMonthlyPremiumEstimate(0)
    setHasCalculated(false)
  }

  const isGap = gapVal > 0

  const breakdownRows = hasCalculated ? (
    method === 'simple' ? [
      { label: 'Annual Income', value: `₹${(monthlyIncome * 12).toLocaleString('en-IN')}` },
      { label: 'Coverage Multiple (15x)', value: '15.0' },
      { label: 'Recommended Life Cover', value: `₹${recommendedCover.toLocaleString('en-IN')}`, isTotal: true },
      { label: 'Existing Coverage Deducted', value: `₹${(existingCover ? Number(existingCover) : 0).toLocaleString('en-IN')}` },
      { label: 'Net Insurance Gap', value: `₹${gapVal.toLocaleString('en-IN')}`, isTotal: true }
    ] : [
      { label: 'Income Replacement (to 60)', value: `₹${incomeReplacement.toLocaleString('en-IN')}` },
      { label: 'Dependent Support Buffer', value: `₹${dependentSupport.toLocaleString('en-IN')}` },
      { label: 'Outstanding Loans', value: `₹${(outstandingLoans ? Number(outstandingLoans) : 0).toLocaleString('en-IN')}` },
      { label: 'Education Target Fund', value: `₹${(educationFund ? Number(educationFund) : 0).toLocaleString('en-IN')}` },
      { label: 'Emergency Fund (6mo income)', value: `₹${emergencyFund.toLocaleString('en-IN')}` },
      { label: 'Total Recommended Cover', value: `₹${recommendedCover.toLocaleString('en-IN')}`, isTotal: true },
      { label: 'Less: Existing Cover', value: `₹${(existingCover ? Number(existingCover) : 0).toLocaleString('en-IN')}` },
      { label: 'Net Insurance Gap', value: `₹${gapVal.toLocaleString('en-IN')}`, isTotal: true }
    ]
  ) : []

  const msg = hasCalculated ? `Namaste Ajay ji, I calculated my life insurance coverage need.
Income ₹${(monthlyIncome).toLocaleString('en-IN')}/mo, age ${age}, HLV recommended cover is ₹${recommendedCover.toLocaleString('en-IN')}. My insurance gap is ₹${gapVal.toLocaleString('en-IN')}.
Can you suggest a term policy to cover this?` : ''
  const whatsappUrl = `https://wa.me/919415313434?text=${encodeURIComponent(msg)}`

  return (
    <CalculatorShell
      activeTabId="coverage"
      title="Coverage Calculator"
      infoTooltip="Calculate how much life insurance coverage you need to secure your family's financial future. Compares your requirements against existing policies to calculate your protection gap."
      faq={COVERAGE_FAQ}
      age={age}
      sa={recommendedCover}
      term={20}
      hasCalculated={hasCalculated}
      onCalculate={handleCalculate}
      calculateButtonText="Calculate Coverage Needs"
      formFields={
        <>
          <QuickPick
            label="Monthly Income"
            value={monthlyIncome}
            onChange={(val) => { setMonthlyIncome(val); setHasCalculated(false) }}
            options={incomeOptions}
            showCustom
            customPlaceholder="Enter custom monthly income"
            customSuffix="/mo"
          />

          <SliderField
            label="Current Age"
            value={age}
            onChange={(val) => { setAge(val); setHasCalculated(false) }}
            min={18}
            max={65}
            unit=" yrs"
          />

          <QuickPick
            label="Number of Dependents"
            value={dependents}
            onChange={(val) => { setDependents(val); setHasCalculated(false) }}
            options={depOptions}
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
                  label="Calculation Method"
                  value={method}
                  onChange={(val) => { setMethod(val as any); setHasCalculated(false) }}
                  options={methodOptions}
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Existing Life Coverage (₹)</label>
                  <input
                    type="number"
                    value={existingCover}
                    onChange={(e) => { setExistingCover(e.target.value); setHasCalculated(false) }}
                    placeholder="Enter total SA of current policies"
                    className="w-full h-11 px-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-base text-gray-900"
                  />
                </div>

                {method === 'hlv' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Outstanding Loans / Debts (₹)</label>
                      <input
                        type="number"
                        value={outstandingLoans}
                        onChange={(e) => { setOutstandingLoans(e.target.value); setHasCalculated(false) }}
                        placeholder="Enter total mortgage, personal, or car loans"
                        className="w-full h-11 px-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-base text-gray-900"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Future Education Fund Goal (₹)</label>
                      <input
                        type="number"
                        value={educationFund}
                        onChange={(e) => { setEducationFund(e.target.value); setHasCalculated(false) }}
                        placeholder="Enter total target educational corpus"
                        className="w-full h-11 px-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-base text-gray-900"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Is your spouse earning?</span>
                      <input
                        type="checkbox"
                        checked={spouseWorking}
                        onChange={(e) => { setSpouseWorking(e.target.checked); setHasCalculated(false) }}
                        className="w-5 h-5 accent-blue-500 rounded border-gray-300"
                      />
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </>
      }
      resultPanel={
        hasCalculated && (
          <div className="space-y-4">
            <ResultCard
              value={`₹${recommendedCover.toLocaleString('en-IN')}`}
              label="Recommended Total Coverage"
              subtext={isGap ? `You have a coverage gap of ₹${gapVal.toLocaleString('en-IN')}` : 'Your existing cover is adequate!'}
              type={isGap ? 'caution' : 'positive'}
              inlineLinkText="Find plans at this coverage → Premium Calculator"
              inlineLinkHref={`/calculators/premium?age=${age}&sa=${gapVal > 0 ? gapVal : recommendedCover}&term=20`}
              insightText={
                isGap
                  ? `Your family needs ₹${recommendedCover.toLocaleString('en-IN')} to maintain their lifestyle. Adding ₹${gapVal.toLocaleString('en-IN')} term cover costs just ~₹${monthlyPremiumEstimate}/month. To close the gap, explore term plans →`
                  : `Your family gets 12× annual income in coverage — within the recommended 15× range. You are well protected!`
              }
              InsightIcon={isGap ? AlertTriangle : Shield}
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

export default function CoverageCalculatorPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    }>
      <CoverageCalcContent />
    </Suspense>
  )
}
