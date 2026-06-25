'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useLang } from '@/lib/LangContext'
import { Calculator, Info, Phone, RefreshCw, AlertCircle, TrendingUp, CheckCircle, Share2 } from 'lucide-react'
import { PLANS } from '@/lib/lic-plans-data.js'
import { fmt, fmtSA } from '@/lib/format'
import { ADVISOR_PHONE } from '@/lib/constants'
import WhatsAppShare from '@/components/WhatsAppShare'
import CalculatorCTA from '@/components/calculators/CalculatorCTA'
import { MaturityResult } from '@/lib/types/calculator'

export default function MaturityCalculatorPage() {
  const { t, lang } = useLang()
  const s = t.maturityCalculator || {
    title: 'LIC Maturity Calculator 2026',
    subtitle: 'Estimate the maturity returns for your LIC policies. Free online tool.',
    planLabel: 'Select LIC Plan',
    ageLabel: 'Age (18-60)',
    sumAssuredLabel: 'Sum Assured (₹)',
    termLabel: 'Policy Term (Years)',
    premiumModeLabel: 'Premium Payment Mode',
    calculateButton: 'Calculate Maturity Amount',
    resultTitle: 'Estimated Maturity Returns',
    totalPremiumsPaid: 'Total Premiums You\'ll Pay',
    estimatedMaturity: 'Estimated Maturity Amount',
    accruedBonus: 'Accrued Bonus',
    estimatedFAB: 'Estimated FAB (Final Additional Bonus)',
    effectiveReturn: 'Effective Return',
    disclaimer: 'Disclaimer',
    exactQuery: 'Get exact projection? Talk to Ajay sir',
    whatsappCTA: 'Discuss Projections on WhatsApp',
    disclaimerText: 'This is an indicative calculation. Actual maturity depends on LIC\'s declared bonus rates which vary annually. Contact Ajay sir for exact projections.',
    loading: 'Calculating...'
  }

  // Filter for plans that are eligible (typically Endowment, Money Back, Child, Whole Life plans)
  const majorPlans = PLANS.filter(p => p.status !== 'withdrawn' && ['endowment', 'wholelife', 'child'].includes(p.category || ''))

  const [planNumber, setPlanNumber] = useState(majorPlans[0]?.planNo?.toString() || '915')
  const [age, setAge] = useState<number>(30)
  const [sumAssured, setSumAssured] = useState<number>(500000)
  const [term, setTerm] = useState<number>(20)
  const [premiumMode, setPremiumMode] = useState<'yearly' | 'half-yearly' | 'quarterly' | 'monthly'>('yearly')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<MaturityResult | null>(null)

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setResult(null)

    if (age < 18 || age > 60) {
      setError(lang === 'en' ? 'Age must be between 18 and 60 years.' : 'आयु 18 से 60 वर्ष के बीच होनी चाहिए।')
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/calculators/maturity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planNumber,
          age,
          sumAssured,
          term,
          premiumMode
        })
      })

      if (!res.ok) {
        const errData = await res.json()
        throw new Error(errData.error || 'Failed to calculate')
      }

      const data: MaturityResult = await res.json()
      setResult(data)

      // Track calculation event
      fetch('/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: 'calc_run',
          sheetName: 'Maturity Calculator',
          data: {
            planNo: planNumber,
            age,
            sa: sumAssured,
            term,
            mode: premiumMode,
            totalPaid: data.totalPremiumsPaid,
            maturity: data.estimatedMaturity,
            bonus: data.accruedBonus,
            fab: data.estimatedFAB,
            returnRate: data.effectiveReturn,
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

  const shareText = result
    ? `*LIC Maturity Calculator Quote - Poddar Wealth*
Plan: LIC Plan ${planNumber}
Age: ${age} years | Term: ${term} years
Sum Assured: ${fmtSA(sumAssured)}
Payment Mode: ${premiumMode.toUpperCase()}

*Total Premiums:* ${fmt(result.totalPremiumsPaid)}
*Maturity Value:* ${fmt(result.estimatedMaturity)}
*Bonus + FAB:* ${fmt(result.accruedBonus + result.estimatedFAB)}
*Effective Return:* ${result.effectiveReturn}% p.a.

Estimate yours here: `
    : ''

  const getWhatsAppCTAUrl = () => {
    if (!result) return ''
    const msg = `Hi Ajay sir, I calculated my LIC Maturity Returns on poddarwealth.com:
Plan: LIC Plan ${planNumber}
Age: ${age} yrs | Term: ${term} yrs
Sum Assured: ₹${sumAssured.toLocaleString('en-IN')}
Mode: ${premiumMode.toUpperCase()}
Total Premiums: ₹${result.totalPremiumsPaid.toLocaleString('en-IN')}
Estimated Maturity: ₹${result.estimatedMaturity.toLocaleString('en-IN')}
Effective Return: ${result.effectiveReturn}% p.a.
Can you please suggest the best combination for maximizing my returns?`
    return `https://wa.me/91${ADVISOR_PHONE}?text=${encodeURIComponent(msg)}`
  }

  return (
    <div className="min-h-screen bg-warm pt-[78px]">
      {/* Hero Header */}
      <div className="bg-navy py-12 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, #f5c842 0%, transparent 60%), radial-gradient(circle at 80% 50%, #f5c842 0%, transparent 60%)' }} />
        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-gold/10 border border-gold/20 text-gold px-4 py-1.5 rounded-full text-[11px] font-bold tracking-widest uppercase mb-4">
            <Calculator className="w-3.5 h-3.5" /> {lang === 'en' ? 'LIC Maturity Calculator' : 'LIC मैच्योरिटी कैलकुलेटर'}
          </div>
          <h1 className="font-display text-[28px] md:text-[40px] font-bold text-white leading-tight mb-3">
            {s.title}
          </h1>
          <p className="text-white/60 text-[14px] max-w-xl mx-auto">
            {s.subtitle}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Form Side */}
          <div className="lg:col-span-6 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
            <h2 className="font-display font-bold text-xl text-navy mb-6">
              {lang === 'en' ? 'Enter Growth Parameters' : 'ग्रोथ पैरामीटर दर्ज करें'}
            </h2>

            <form onSubmit={handleCalculate} className="space-y-5">
              {/* Plan Selector */}
              <div>
                <label htmlFor="planNumber" className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  {s.planLabel}
                </label>
                <select
                  id="planNumber"
                  value={planNumber}
                  onChange={(e) => setPlanNumber(e.target.value)}
                  className="w-full h-11 px-3 border border-gray-200 rounded-xl bg-gray-50 text-sm font-semibold focus:outline-none focus:border-gold focus:bg-white transition-all text-navy"
                >
                  {majorPlans.map((plan) => (
                    <option key={plan.planNo} value={plan.planNo}>
                      Plan {plan.planNo} - {plan.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Age */}
                <div>
                  <label htmlFor="age" className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                    {s.ageLabel}
                  </label>
                  <input
                    id="age"
                    type="number"
                    min={18}
                    max={60}
                    required
                    value={age}
                    onChange={(e) => setAge(Math.max(1, parseInt(e.target.value) || 18))}
                    className="w-full h-11 px-3 border border-gray-200 rounded-xl bg-gray-50 text-sm font-semibold focus:outline-none focus:border-gold focus:bg-white transition-all text-navy"
                  />
                </div>

                {/* Term */}
                <div>
                  <label htmlFor="term" className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                    {s.termLabel}
                  </label>
                  <select
                    id="term"
                    value={term}
                    onChange={(e) => setTerm(parseInt(e.target.value))}
                    className="w-full h-11 px-3 border border-gray-200 rounded-xl bg-gray-50 text-sm font-semibold focus:outline-none focus:border-gold focus:bg-white transition-all text-navy"
                  >
                    <option value={10}>10 Years</option>
                    <option value={15}>15 Years</option>
                    <option value={20}>20 Years</option>
                    <option value={25}>25 Years</option>
                    <option value={30}>30 Years</option>
                  </select>
                </div>
              </div>

              {/* Sum Assured */}
              <div>
                <label htmlFor="sumAssured" className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  {s.sumAssuredLabel}
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 font-semibold text-sm">₹</span>
                  <input
                    id="sumAssured"
                    type="number"
                    min={50000}
                    step={50000}
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

              {/* Premium Mode Radio */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  {s.premiumModeLabel}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(['yearly', 'half-yearly', 'quarterly', 'monthly'] as const).map((mode) => (
                    <label
                      key={mode}
                      className={`flex flex-col items-center justify-center border rounded-xl py-2 px-1 cursor-pointer transition-all ${
                        premiumMode === mode
                          ? 'border-navy bg-navy/5 text-navy font-bold'
                          : 'border-gray-100 bg-gray-50 hover:bg-gray-100/50 text-gray-600'
                      }`}
                    >
                      <input
                        type="radio"
                        name="premiumMode"
                        value={mode}
                        checked={premiumMode === mode}
                        onChange={() => setPremiumMode(mode)}
                        className="sr-only"
                      />
                      <span className="text-xs capitalize">
                        {mode.replace('-', ' ')}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                  <span className="text-[11px] font-medium text-red-700">{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>{s.loading}</span>
                  </>
                ) : (
                  <>
                    <Calculator className="w-4 h-4" />
                    <span>{s.calculateButton}</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Results Side */}
          <div className="lg:col-span-6 space-y-6">
            {!result && !loading && (
              <div className="bg-white rounded-2xl border border-dashed border-gray-200 h-96 flex flex-col items-center justify-center text-center p-8">
                <Calculator className="w-12 h-12 text-gray-200 mb-3" />
                <div className="font-display font-bold text-gray-500 text-[17px] mb-1">
                  {lang === 'en' ? 'Estimate Growth' : 'ग्रोथ का अनुमान लगाएं'}
                </div>
                <div className="text-[12px] text-gray-500 max-w-xs">
                  {lang === 'en' 
                    ? 'Fill the form and hit calculate to visualize your estimated premiums, accrued bonuses and projected maturity amount.'
                    : 'विवरण भरें और अपने अनुमानित प्रीमियम, अर्जित बोनस और अनुमानित परिपक्वता राशि की कल्पना करने के लिए गणना करें पर क्लिक करें।'}
                </div>
              </div>
            )}

            {result && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8 space-y-6">
                <div>
                  <h3 className="font-display font-bold text-lg text-navy mb-4 border-b border-gray-50 pb-2">
                    {s.resultTitle}
                  </h3>

                  {/* Estimated Maturity Amount */}
                  <div className="bg-amber-50/20 rounded-2xl p-6 text-center border border-amber-100/50">
                    <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">{s.estimatedMaturity}</div>
                    <div className="text-3xl font-bold text-amber-600">{fmt(result.estimatedMaturity)}</div>
                    <div className="text-[11px] text-amber-700 mt-1">({result.estimatedMaturity.toLocaleString('en-IN')})</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Total Premiums */}
                  <div className="border border-gray-100 rounded-xl p-4 bg-slate-50">
                    <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">{s.totalPremiumsPaid}</div>
                    <div className="text-base font-bold text-navy">{fmt(result.totalPremiumsPaid)}</div>
                  </div>

                  {/* Effective Return */}
                  <div className="border border-gray-100 rounded-xl p-4 bg-emerald-50/10 border-emerald-100/50">
                    <div className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider mb-1">{s.effectiveReturn}</div>
                    <div className="text-base font-bold text-emerald-700">{result.effectiveReturn}% p.a.</div>
                  </div>

                  {/* Accrued Bonus */}
                  <div className="border border-gray-100 rounded-xl p-4">
                    <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">{s.accruedBonus}</div>
                    <div className="text-base font-bold text-navy">{fmt(result.accruedBonus)}</div>
                  </div>

                  {/* FAB */}
                  <div className="border border-gray-100 rounded-xl p-4">
                    <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">{s.estimatedFAB}</div>
                    <div className="text-base font-bold text-navy">{fmt(result.estimatedFAB)}</div>
                  </div>
                </div>

                {/* Calculator CTA Card */}
                <CalculatorCTA
                  serviceLink="/services/retirement"
                  serviceLabelEn="Reinvest Your Maturity Amount"
                  serviceLabelHi="अपनी मैच्योरिटी राशि को पुनर्निवेश करें"
                  whatsappMessage={`Hi Ajay sir, I calculated my LIC maturity amount as ${fmt(result.estimatedMaturity)} on poddarwealth.com and want to discuss reinvestment and retirement options.`}
                />

                {/* WhatsAppShare Result */}
                <div className="flex items-center justify-between border-t border-gray-100 pt-5">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">{lang === 'en' ? 'Share Results' : 'परिणाम साझा करें'}</span>
                  <WhatsAppShare text={shareText} className="shadow-none py-2 px-4" />
                </div>

                {/* Disclaimer */}
                <div className="flex gap-2 text-gray-500 border-t border-gray-50 pt-4">
                  <Info className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                  <p className="text-[10px] leading-relaxed">{result.disclaimer || s.disclaimerText}</p>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}
