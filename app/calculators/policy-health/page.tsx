'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useLang } from '@/lib/LangContext'
import { Calculator, Info, Phone, RefreshCw, AlertCircle, ArrowRight, ArrowLeft, CheckCircle2, MessageCircle } from 'lucide-react'
import { fmt, fmtSA } from '@/lib/format'
import { ADVISOR_PHONE } from '@/lib/constants'
import WhatsAppShare from '@/components/WhatsAppShare'
import type { PolicyHealthResult } from '@/lib/types/calculator'

type PlanType = 'endowment' | 'term' | 'ulip' | 'money-back' | 'whole-life'

export default function PolicyHealthCalculatorPage() {
  const { t, lang } = useLang()
  const p = t.policyHealth || {
    title: 'Policy Health Score',
    subtitle: "Get a free health score for your insurance portfolio. Find out if you're underinsured, overinsured, or just right.",
    step1: 'Your Policy',
    step2: 'About You',
    step3: 'Your Protection',
    planType: 'Plan Type',
    sumAssured: 'Sum Assured (₹)',
    annualPremium: 'Annual Premium (₹)',
    policyYear: 'Policy Year',
    age: 'Current Age',
    annualIncome: 'Annual Income (₹)',
    dependents: 'Number of Dependents',
    hasTerm: 'Do you have term insurance?',
    hasHealth: 'Do you have health insurance?',
    checkScore: 'Check My Score',
    newBadge: 'New',
    scoreTitle: 'Your Insurance Health Score',
    grade: 'Grade',
    recommendationsTitle: 'Recommended Next Steps',
    detailedReview: 'Want a detailed review? Talk to Ajay sir.',
    shareWhatsApp: 'Share your score',
    shareText: 'My insurance health score is {score}/100 ({grade}). Check yours free at poddarwealth.com/calculators/policy-health',
    yes: 'Yes',
    no: 'No',
    planTypes: {
      endowment: 'Endowment Plan',
      term: 'Term Insurance',
      ulip: 'ULIP Plan',
      'money-back': 'Money-Back Plan',
      'whole-life': 'Whole Life Insurance'
    },
    breakdown: {
      coverageAdequacy: 'Coverage Adequacy',
      premiumAffordability: 'Premium Affordability',
      maturityProgress: 'Policy Progress',
      protectionMix: 'Protection Mix',
      dependentCoverage: 'Dependent Coverage'
    }
  }

  // Wizard State
  const [step, setStep] = useState(1)

  // Step 1: Your Policy
  const [planType, setPlanType] = useState<PlanType>('endowment')
  const [sumAssured, setSumAssured] = useState<number>(500000)
  const [annualPremium, setAnnualPremium] = useState<number>(30000)
  const [policyYear, setPolicyYear] = useState<number>(3)

  // Step 2: About You
  const [currentAge, setCurrentAge] = useState<number>(35)
  const [annualIncome, setAnnualIncome] = useState<number>(600000)
  const [dependents, setDependents] = useState<number>(2)

  // Step 3: Your Protection
  const [hasTermInsurance, setHasTermInsurance] = useState<boolean>(false)
  const [hasHealthInsurance, setHasHealthInsurance] = useState<boolean>(true)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<PolicyHealthResult | null>(null)

  const handleNext = () => {
    setError(null)
    if (step === 1) {
      if (sumAssured <= 0) {
        setError(lang === 'en' ? 'Sum Assured must be greater than 0' : 'बीमा राशि 0 से अधिक होनी चाहिए')
        return
      }
      if (annualPremium <= 0) {
        setError(lang === 'en' ? 'Annual Premium must be greater than 0' : 'वार्षिक प्रीमियम 0 से अधिक होना चाहिए')
        return
      }
      if (policyYear < 0) {
        setError(lang === 'en' ? 'Policy Year cannot be negative' : 'पॉलिसी वर्ष ऋणात्मक नहीं हो सकता')
        return
      }
      setStep(2)
    } else if (step === 2) {
      if (currentAge < 18 || currentAge > 80) {
        setError(lang === 'en' ? 'Age must be between 18 and 80' : 'उम्र 18 से 80 के बीच होनी चाहिए')
        return
      }
      if (annualIncome <= 0) {
        setError(lang === 'en' ? 'Annual Income must be greater than 0' : 'वार्षिक आय 0 से अधिक होनी चाहिए')
        return
      }
      if (dependents < 0) {
        setError(lang === 'en' ? 'Number of dependents cannot be negative' : 'आश्रितों की संख्या ऋणात्मक नहीं हो सकती')
        return
      }
      setStep(3)
    }
  }

  const handleBack = () => {
    setError(null)
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setResult(null)
    setLoading(true)

    try {
      const res = await fetch('/api/calculators/policy-health', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sumAssured,
          annualPremium,
          policyYear,
          currentAge,
          annualIncome,
          dependents,
          hasHealthInsurance,
          hasTermInsurance,
          planType
        })
      })

      if (!res.ok) {
        const errData = await res.json()
        throw new Error(errData.error || 'Failed to calculate score')
      }

      const data: PolicyHealthResult = await res.json()
      setResult(data)

      // Track calculator completion
      fetch('/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: 'calc_run',
          sheetName: 'Policy Health Calculator',
          data: {
            planType,
            sa: sumAssured,
            annualPremium,
            policyYear,
            age: currentAge,
            income: annualIncome,
            dependents,
            hasTerm: hasTermInsurance,
            hasHealth: hasHealthInsurance,
            score: data.totalScore,
            grade: data.grade,
            session: typeof window !== 'undefined' ? (sessionStorage.getItem('sid') ?? '') : '',
          }
        })
      }).catch(() => {})

    } catch (err: any) {
      setError(err.message || 'An error occurred during calculation.')
    } finally {
      setLoading(false)
    }
  }

  // Score circular gauge configuration
  const radius = 65
  const circ = 2 * Math.PI * radius // ~408.4

  const getScoreColor = (score: number) => {
    if (score < 50) return 'text-red-500 stroke-red-500'
    if (score < 65) return 'text-amber-500 stroke-amber-500'
    if (score < 80) return 'text-yellow-500 stroke-yellow-500'
    if (score < 90) return 'text-green-500 stroke-green-500'
    return 'text-emerald-500 stroke-emerald-500'
  }

  const getScoreBgColor = (score: number) => {
    if (score < 50) return 'bg-red-50 border-red-200 text-red-700'
    if (score < 65) return 'bg-amber-50 border-amber-200 text-amber-700'
    if (score < 80) return 'bg-yellow-50 border-yellow-200 text-yellow-700'
    if (score < 90) return 'bg-green-50 border-green-200 text-green-700'
    return 'bg-emerald-50 border-emerald-200 text-emerald-700'
  }

  const getWhatsAppCTAUrl = (score: number, grade: string) => {
    const msg = `Hi Ajay sir, I checked my Insurance Health Score on poddarwealth.com and got a score of ${score}/100 (Grade ${grade}). Here are my inputs:
- Plan Type: ${planType}
- Sum Assured: ₹${sumAssured.toLocaleString('en-IN')}
- Annual Premium: ₹${annualPremium.toLocaleString('en-IN')}
- Policy Year: ${policyYear}
- Age: ${currentAge}
- Annual Income: ₹${annualIncome.toLocaleString('en-IN')}
- Dependents: ${dependents}
- Has Term: ${hasTermInsurance ? 'Yes' : 'No'}
- Has Health: ${hasHealthInsurance ? 'Yes' : 'No'}

Please help me review these gaps and suggest the right plans.`
    return `https://wa.me/91${ADVISOR_PHONE}?text=${encodeURIComponent(msg)}`
  }

  const planTypesList = [
    { value: 'endowment' as const, label: p.planTypes.endowment },
    { value: 'term' as const, label: p.planTypes.term },
    { value: 'ulip' as const, label: p.planTypes.ulip },
    { value: 'money-back' as const, label: p.planTypes['money-back'] },
    { value: 'whole-life' as const, label: p.planTypes['whole-life'] },
  ]

  const customShareText = result
    ? p.shareText.replace('{score}', result.totalScore.toString()).replace('{grade}', result.grade)
    : ''

  return (
    <div className="min-h-screen bg-warm pt-[78px]">
      {/* Hero Header */}
      <div className="bg-navy py-12 px-6 text-center relative overflow-hidden">
        <div 
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, #f5c842 0%, transparent 60%), radial-gradient(circle at 80% 50%, #f5c842 0%, transparent 60%)' }} 
        />
        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-gold/10 border border-gold/20 text-gold px-4 py-1.5 rounded-full text-[11px] font-bold tracking-widest uppercase mb-4">
            <Calculator className="w-3.5 h-3.5" /> {p.title}
          </div>
          <h1 className="font-display text-[28px] md:text-[40px] font-bold text-white leading-tight mb-3">
            {p.title}
          </h1>
          <p className="text-white/60 text-[14px] max-w-xl mx-auto">
            {p.subtitle}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Wizard Form Side (Steps 1-3) */}
          <div className="lg:col-span-6 bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 md:p-8">
            {/* Step Indicators */}
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-50">
              {[
                { stepNum: 1, label: p.step1 },
                { stepNum: 2, label: p.step2 },
                { stepNum: 3, label: p.step3 }
              ].map(({ stepNum, label }) => (
                <div key={stepNum} className="flex flex-col items-center flex-1 relative">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                    step === stepNum 
                      ? 'bg-amber-500 text-white' 
                      : step > stepNum 
                        ? 'bg-green-500 text-white' 
                        : 'bg-gray-100 text-gray-500'
                  }`}>
                    {stepNum}
                  </div>
                  <span className="text-[10px] md:text-[11px] font-bold mt-2 text-gray-500 text-center">{label}</span>
                </div>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* STEP 1: Your Policy */}
              {step === 1 && (
                <div className="space-y-5">
                  <h2 className="font-display font-bold text-lg text-navy mb-4">
                    {lang === 'en' ? 'Enter Policy Details' : 'पॉलिसी विवरण दर्ज करें'}
                  </h2>

                  {/* Plan Type Grid */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-3">
                      {p.planType}
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {planTypesList.map((plan) => (
                        <label 
                          key={plan.value}
                          className={`flex items-center gap-3 p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                            planType === plan.value 
                              ? 'border-amber-500 bg-amber-50/20' 
                              : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50'
                          }`}
                        >
                          <input 
                            type="radio" 
                            name="planType"
                            value={plan.value}
                            checked={planType === plan.value}
                            onChange={() => setPlanType(plan.value)}
                            className="text-amber-500 focus:ring-amber-500 border-gray-300"
                          />
                          <span className="text-13 font-semibold text-slate-800">{plan.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Sum Assured */}
                  <div>
                    <label htmlFor="sumAssured" className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                      {p.sumAssured}
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 font-semibold text-sm">₹</span>
                      <input
                        id="sumAssured"
                        type="number"
                        min={10000}
                        step={10000}
                        required
                        value={sumAssured}
                        onChange={(e) => setSumAssured(Math.max(0, parseInt(e.target.value) || 0))}
                        className="w-full h-11 pl-8 pr-4 border border-gray-200 rounded-xl bg-gray-50 text-sm font-semibold focus:outline-none focus:border-gold focus:bg-white transition-all text-navy"
                      />
                    </div>
                    <div className="text-right text-[10px] font-bold text-gold mt-1">
                      {fmtSA(sumAssured)}
                    </div>
                  </div>

                  {/* Annual Premium */}
                  <div>
                    <label htmlFor="annualPremium" className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                      {p.annualPremium}
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 font-semibold text-sm">₹</span>
                      <input
                        id="annualPremium"
                        type="number"
                        min={1000}
                        step={500}
                        required
                        value={annualPremium}
                        onChange={(e) => setAnnualPremium(Math.max(0, parseInt(e.target.value) || 0))}
                        className="w-full h-11 pl-8 pr-4 border border-gray-200 rounded-xl bg-gray-50 text-sm font-semibold focus:outline-none focus:border-gold focus:bg-white transition-all text-navy"
                      />
                    </div>
                    <div className="text-right text-[10px] font-bold text-gold mt-1">
                      {fmt(annualPremium)}
                    </div>
                  </div>

                  {/* Policy Year */}
                  <div>
                    <label htmlFor="policyYear" className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                      {p.policyYear}
                    </label>
                    <input
                      id="policyYear"
                      type="number"
                      min={0}
                      max={40}
                      required
                      value={policyYear}
                      onChange={(e) => setPolicyYear(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-full h-11 px-3 border border-gray-200 rounded-xl bg-gray-50 text-sm font-semibold focus:outline-none focus:border-gold focus:bg-white transition-all text-navy"
                    />
                  </div>
                </div>
              )}

              {/* STEP 2: About You */}
              {step === 2 && (
                <div className="space-y-5">
                  <h2 className="font-display font-bold text-lg text-navy mb-4">
                    {lang === 'en' ? 'Tell Us About You' : 'अपने बारे में बताएं'}
                  </h2>

                  {/* Age */}
                  <div>
                    <label htmlFor="currentAge" className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                      {p.age}
                    </label>
                    <input
                      id="currentAge"
                      type="number"
                      min={18}
                      max={80}
                      required
                      value={currentAge}
                      onChange={(e) => setCurrentAge(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-full h-11 px-3 border border-gray-200 rounded-xl bg-gray-50 text-sm font-semibold focus:outline-none focus:border-gold focus:bg-white transition-all text-navy"
                    />
                  </div>

                  {/* Income */}
                  <div>
                    <label htmlFor="annualIncome" className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                      {p.annualIncome}
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 font-semibold text-sm">₹</span>
                      <input
                        id="annualIncome"
                        type="number"
                        min={50000}
                        step={50000}
                        required
                        value={annualIncome}
                        onChange={(e) => setAnnualIncome(Math.max(0, parseInt(e.target.value) || 0))}
                        className="w-full h-11 pl-8 pr-4 border border-gray-200 rounded-xl bg-gray-50 text-sm font-semibold focus:outline-none focus:border-gold focus:bg-white transition-all text-navy"
                      />
                    </div>
                    <div className="text-right text-[10px] font-bold text-gold mt-1">
                      {fmt(annualIncome)}
                    </div>
                  </div>

                  {/* Dependents */}
                  <div>
                    <label htmlFor="dependents" className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                      {p.dependents}
                    </label>
                    <input
                      id="dependents"
                      type="number"
                      min={0}
                      max={15}
                      required
                      value={dependents}
                      onChange={(e) => setDependents(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-full h-11 px-3 border border-gray-200 rounded-xl bg-gray-50 text-sm font-semibold focus:outline-none focus:border-gold focus:bg-white transition-all text-navy"
                    />
                  </div>
                </div>
              )}

              {/* STEP 3: Your Protection */}
              {step === 3 && (
                <div className="space-y-6">
                  <h2 className="font-display font-bold text-lg text-navy mb-4">
                    {lang === 'en' ? 'Existing Protection Covers' : 'मौजूदा सुरक्षा कवर'}
                  </h2>

                  {/* Has Term Insurance */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-800 mb-3">
                      {p.hasTerm}
                    </label>
                    <div className="flex gap-4">
                      <button
                        type="button"
                        onClick={() => setHasTermInsurance(true)}
                        className={`flex-1 h-11 font-bold text-sm rounded-xl border transition-all ${
                          hasTermInsurance 
                            ? 'bg-amber-500 border-amber-500 text-white' 
                            : 'bg-white border-gray-200 text-slate-600 hover:border-gray-300'
                        }`}
                      >
                        {p.yes}
                      </button>
                      <button
                        type="button"
                        onClick={() => setHasTermInsurance(false)}
                        className={`flex-1 h-11 font-bold text-sm rounded-xl border transition-all ${
                          !hasTermInsurance 
                            ? 'bg-amber-500 border-amber-500 text-white' 
                            : 'bg-white border-gray-200 text-slate-600 hover:border-gray-300'
                        }`}
                      >
                        {p.no}
                      </button>
                    </div>
                  </div>

                  {/* Has Health Insurance */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-800 mb-3">
                      {p.hasHealth}
                    </label>
                    <div className="flex gap-4">
                      <button
                        type="button"
                        onClick={() => setHasHealthInsurance(true)}
                        className={`flex-1 h-11 font-bold text-sm rounded-xl border transition-all ${
                          hasHealthInsurance 
                            ? 'bg-amber-500 border-amber-500 text-white' 
                            : 'bg-white border-gray-200 text-slate-600 hover:border-gray-300'
                        }`}
                      >
                        {p.yes}
                      </button>
                      <button
                        type="button"
                        onClick={() => setHasHealthInsurance(false)}
                        className={`flex-1 h-11 font-bold text-sm rounded-xl border transition-all ${
                          !hasHealthInsurance 
                            ? 'bg-amber-500 border-amber-500 text-white' 
                            : 'bg-white border-gray-200 text-slate-600 hover:border-gray-300'
                        }`}
                      >
                        {p.no}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Local validations errors */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                  <span className="text-[11px] font-medium text-red-700">{error}</span>
                </div>
              )}

              {/* Navigation Actions */}
              <div className="flex gap-4 pt-4 border-t border-gray-50">
                {step > 1 && (
                  <button
                    type="button"
                    onClick={handleBack}
                    className="inline-flex h-12 px-6 border border-gray-200 rounded-xl font-bold text-sm items-center justify-center gap-2 text-slate-600 hover:bg-gray-50 active:scale-[0.98] transition-all cursor-pointer"
                  >
                    <ArrowLeft size={16} /> {lang === 'en' ? 'Back' : 'पीछे'}
                  </button>
                )}

                {step < 3 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="flex-1 h-12 bg-navy hover:bg-navy/90 text-white font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {lang === 'en' ? 'Continue' : 'आगे बढ़ें'} <ArrowRight size={16} />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 h-12 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
                  >
                    {loading ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>{lang === 'en' ? 'Checking...' : 'जांच की जा रही है...'}</span>
                      </>
                    ) : (
                      <>
                        <Calculator className="w-4 h-4" />
                        <span>{p.checkScore}</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Results Side */}
          <div className="lg:col-span-6 space-y-6">
            {!result && !loading && (
              <div className="bg-white rounded-2xl border border-dashed border-gray-200 h-96 flex flex-col items-center justify-center text-center p-8">
                <Calculator className="w-12 h-12 text-gray-200 mb-3" />
                <div className="font-display font-bold text-gray-500 text-[17px] mb-1">
                  {lang === 'en' ? 'Ready to Audit Portfolio' : 'ऑडिट के लिए तैयार'}
                </div>
                <div className="text-[12px] text-gray-400 max-w-xs leading-relaxed">
                  {lang === 'en' 
                    ? 'Enter your policy and profile inputs. Click Check My Score to run a security health audit.'
                    : 'अपनी पॉलिसी और प्रोफाइल इनपुट दर्ज करें। सुरक्षा ऑडिट चलाने के लिए मेरा स्कोर चेक करें पर क्लिक करें।'}
                </div>
              </div>
            )}

            {result && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-6 md:p-8 space-y-6">
                
                {/* Score Section */}
                <div className="flex flex-col items-center text-center">
                  <h3 className="font-display font-bold text-lg text-navy mb-4 border-b border-gray-50 pb-2 w-full">
                    {p.scoreTitle}
                  </h3>

                  {/* Circular SVG Gauge */}
                  <div className="relative w-[150px] h-[150px] flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle 
                        cx="75" 
                        cy="75" 
                        r={radius} 
                        className="stroke-gray-100" 
                        strokeWidth="10" 
                        fill="transparent" 
                      />
                      <circle 
                        cx="75" 
                        cy="75" 
                        r={radius} 
                        className={`transition-all duration-1000 ${getScoreColor(result.totalScore)}`} 
                        strokeWidth="10" 
                        fill="transparent" 
                        strokeDasharray={circ}
                        strokeDashoffset={circ - (circ * result.totalScore) / 100}
                        strokeLinecap="round"
                      />
                    </svg>
                    
                    <div className="absolute flex flex-col items-center">
                      <span className="text-4xl font-extrabold text-slate-900">{result.totalScore}</span>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">/ 100</span>
                    </div>
                  </div>

                  {/* Grade Badge */}
                  <div className={`mt-4 px-5 py-1.5 rounded-full border text-sm font-bold flex items-center gap-1.5 uppercase ${getScoreBgColor(result.totalScore)}`}>
                    <span>{p.grade}:</span>
                    <span className="text-base font-extrabold">{result.grade}</span>
                  </div>

                  <p className="mt-4 text-sm font-medium text-slate-600 leading-relaxed max-w-sm">
                    {result.summary}
                  </p>
                </div>

                {/* Breakdown Cards Grid */}
                <div className="grid grid-cols-1 gap-4 pt-4 border-t border-gray-50">
                  {[
                    { key: 'coverageAdequacy', title: p.breakdown.coverageAdequacy, val: result.breakdown.coverageAdequacy },
                    { key: 'premiumAffordability', title: p.breakdown.premiumAffordability, val: result.breakdown.premiumAffordability },
                    { key: 'maturityProgress', title: p.breakdown.maturityProgress, val: result.breakdown.maturityProgress },
                    { key: 'protectionMix', title: p.breakdown.protectionMix, val: result.breakdown.protectionMix },
                    { key: 'dependentCoverage', title: p.breakdown.dependentCoverage, val: result.breakdown.dependentCoverage }
                  ].map((card) => {
                    const colorMap = getScoreColor((card.val.score / card.val.max) * 100)
                    const fillPct = (card.val.score / card.val.max) * 100

                    return (
                      <div key={card.key} className="border border-gray-100 rounded-xl p-4 bg-gray-50/50">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-13 font-bold text-slate-800">{card.title}</span>
                          <span className="text-xs font-bold text-slate-500">
                            {card.val.score} / {card.val.max}
                          </span>
                        </div>
                        {/* Progress Bar */}
                        <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden mb-2">
                          <div 
                            className={`h-full rounded-full transition-all duration-500 ${
                              fillPct < 50 ? 'bg-red-500' : fillPct < 70 ? 'bg-amber-500' : 'bg-green-500'
                            }`}
                            style={{ width: `${fillPct}%` }}
                          />
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed font-medium">
                          {card.val.comment}
                        </p>
                      </div>
                    )
                  })}
                </div>

                {/* Recommendations Section */}
                <div className="bg-amber-50/80 border border-amber-100 rounded-2xl p-6 space-y-4">
                  <h4 className="font-display font-bold text-[16px] text-amber-900">
                    {p.recommendationsTitle}
                  </h4>
                  <div className="space-y-3">
                    {result.recommendations.map((rec, i) => (
                      <p key={i} className="text-[13px] text-slate-700 leading-relaxed font-medium">
                        {rec}
                      </p>
                    ))}
                  </div>
                  
                  <div className="border-t border-amber-200/50 pt-4 mt-2">
                    <p className="text-xs font-bold text-slate-800 mb-3">{p.detailedReview}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <a
                        href={getWhatsAppCTAUrl(result.totalScore, result.grade)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex h-11 bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-xs rounded-xl items-center justify-center gap-2 transition-all shadow-md"
                      >
                        <MessageCircle size={16} />
                        {lang === 'en' ? 'Discuss on WhatsApp' : 'व्हाट्सएप पर चर्चा करें'}
                      </a>
                      <a
                        href={`tel:${ADVISOR_PHONE}`}
                        className="inline-flex h-11 bg-navy hover:bg-navy/95 text-white font-bold text-xs rounded-xl items-center justify-center gap-2 transition-all shadow-md"
                      >
                        <Phone size={14} />
                        {lang === 'en' ? 'Call Ajay Sir' : 'अजय सर को कॉल करें'}
                      </a>
                    </div>
                  </div>
                </div>

                {/* Share Section */}
                <div className="flex items-center justify-between border-t border-gray-100 pt-5">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{p.shareWhatsApp}</span>
                  <WhatsAppShare text={customShareText} className="shadow-none py-2 px-4" />
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}
