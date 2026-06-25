'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useLang } from '@/lib/LangContext'
import { Calculator, Info, Phone, RefreshCw, AlertCircle, TrendingUp, CheckCircle, Share2, HelpCircle, MessageCircle } from 'lucide-react'
import { PLANS } from '@/lib/lic-plans-data.js'
import { fmt, fmtSA } from '@/lib/format'
import { ADVISOR_PHONE } from '@/lib/constants'
import WhatsAppShare from '@/components/WhatsAppShare'
import CalculatorCTA from '@/components/calculators/CalculatorCTA'
import { SurrenderValueResult } from '@/lib/types/calculator'

export default function SurrenderValueCalculatorPage() {
  const { t, lang } = useLang()
  const s = t.surrenderCalculator || {
    title: 'LIC Surrender Value Calculator 2026',
    subtitle: 'Calculate your LIC policy surrender value instantly. Free online tool.',
    planLabel: 'Select LIC Plan',
    sumAssuredLabel: 'Sum Assured (₹)',
    annualPremiumLabel: 'Annual Premium (₹)',
    totalPremiumsPaidLabel: 'Total Premiums Paid (₹)',
    policyYearLabel: 'Policy Year (Completed)',
    calculateButton: 'Calculate Surrender Value',
    resultTitle: 'Surrender Value Estimate',
    guaranteedSurrenderValue: 'Guaranteed Surrender Value',
    estimatedPaidUpValue: 'Estimated Paid-up Value',
    surrenderRatio: 'Surrender Ratio',
    recommendation: 'Recommendation',
    disclaimer: 'Disclaimer',
    exactQuery: 'Want exact calculation? Talk to Ajay sir',
    whatsappCTA: 'Discuss with Ajay Sir on WhatsApp',
    disclaimerText: 'Special Surrender Value (SSV) is usually higher than Guaranteed Surrender Value (GSV). Talk to Ajay sir for exact values.',
    errorCompletedYears: 'LIC policies require at least 3 completed policy years of premium payments to acquire a surrender value.',
    loading: 'Calculating...'
  }

  // Filter plans to display active ones or major ones
  const majorPlans = PLANS.filter(p => p.status !== 'withdrawn' && ['endowment', 'moneyback', 'wholelife', 'child'].includes(p.category || ''))

  const [planNumber, setPlanNumber] = useState(majorPlans[0]?.planNo?.toString() || '915')
  const [sumAssured, setSumAssured] = useState<number>(500000)
  const [annualPremium, setAnnualPremium] = useState<number>(250000 / 10) // default estimate
  const [premiumsPaid, setPremiumsPaid] = useState<number>(75000)
  const [policyYear, setPolicyYear] = useState<number>(4)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<SurrenderValueResult | null>(null)

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setResult(null)

    if (policyYear < 3) {
      setError(s.errorCompletedYears)
      return
    }

    if (premiumsPaid < annualPremium * policyYear) {
      setError(lang === 'en' 
        ? 'Total premiums paid cannot be less than Annual Premium multiplied by completed years.'
        : 'कुल भुगतान किया गया प्रीमियम, वार्षिक प्रीमियम और पूरे किए गए वर्षों के गुणनफल से कम नहीं हो सकता।'
      )
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/calculators/surrender-value', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planNumber,
          sumAssured,
          premiumsPaid,
          policyYear,
          annualPremium
        })
      })

      if (!res.ok) {
        const errData = await res.json()
        throw new Error(errData.error || 'Failed to calculate')
      }

      const data: SurrenderValueResult = await res.json()
      setResult(data)

      // Track calculation event
      fetch('/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: 'calc_run',
          sheetName: 'Surrender Calculator',
          data: {
            planNo: planNumber,
            sa: sumAssured,
            annualPremium,
            premiumsPaid,
            policyYear,
            gsv: data.guaranteedSurrenderValue,
            paidUp: data.estimatedPaidUpValue,
            ratio: data.surrenderRatio,
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

  const getRatioBadgeColor = (ratio: number) => {
    if (ratio < 0.7) return 'bg-red-50 text-red-700 border-red-200'
    if (ratio <= 0.85) return 'bg-amber-50 text-amber-700 border-amber-200'
    return 'bg-green-50 text-green-700 border-green-200'
  }

  const getRatioColor = (ratio: number) => {
    if (ratio < 0.7) return 'text-red-600'
    if (ratio <= 0.85) return 'text-amber-600'
    return 'text-green-600'
  }

  const shareText = result
    ? `*LIC Surrender Value Quote - Poddar Wealth*
Plan Number: ${planNumber}
Sum Assured: ${fmtSA(sumAssured)}
Annual Premium: ${fmt(annualPremium)}
Total Premiums Paid: ${fmt(premiumsPaid)}
Policy Year: ${policyYear}

*Guaranteed Surrender Value:* ${fmt(result.guaranteedSurrenderValue)}
*Estimated Paid-up Value:* ${fmt(result.estimatedPaidUpValue)}
*Surrender Ratio:* ${(result.surrenderRatio * 100).toFixed(0)}%

Calculate yours online: `
    : ''

  const getWhatsAppCTAUrl = () => {
    if (!result) return ''
    const msg = `Hi Ajay sir, I calculated my LIC Surrender Value on poddarwealth.com:
Plan Number: ${planNumber}
Sum Assured: ₹${sumAssured.toLocaleString('en-IN')}
Annual Premium: ₹${annualPremium.toLocaleString('en-IN')}
Total Premiums Paid: ₹${premiumsPaid.toLocaleString('en-IN')}
Policy Year: ${policyYear}
Guaranteed Surrender Value: ₹${result.guaranteedSurrenderValue.toLocaleString('en-IN')}
Please help me verify if this is accurate or if I have a higher Special Surrender Value.`
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
            <Calculator className="w-3.5 h-3.5" /> {lang === 'en' ? 'LIC Surrender Value Calculator' : 'LIC सरेंडर वैल्यू कैलकुलेटर'}
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
              {lang === 'en' ? 'Enter Policy Details' : 'पॉलिसी विवरण दर्ज करें'}
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
                  {s.annualPremiumLabel}
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 font-semibold text-sm">₹</span>
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

              {/* Total Premiums Paid */}
              <div>
                <label htmlFor="premiumsPaid" className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  {s.totalPremiumsPaidLabel}
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 font-semibold text-sm">₹</span>
                  <input
                    id="premiumsPaid"
                    type="number"
                    min={3000}
                    step={1000}
                    required
                    value={premiumsPaid}
                    onChange={(e) => setPremiumsPaid(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full h-11 pl-8 pr-4 border border-gray-200 rounded-xl bg-gray-50 text-sm font-semibold focus:outline-none focus:border-gold focus:bg-white transition-all text-navy"
                  />
                </div>
                <div className="text-right text-[10px] font-bold text-gold mt-1">
                  {fmt(premiumsPaid)}
                </div>
              </div>

              {/* Policy Year */}
              <div>
                <label htmlFor="policyYear" className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  {s.policyYearLabel}
                </label>
                <input
                  id="policyYear"
                  type="number"
                  min={1}
                  max={40}
                  required
                  value={policyYear}
                  onChange={(e) => setPolicyYear(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full h-11 px-3 border border-gray-200 rounded-xl bg-gray-50 text-sm font-semibold focus:outline-none focus:border-gold focus:bg-white transition-all text-navy"
                />
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
                  {lang === 'en' ? 'Ready to Calculate' : 'गणना के लिए तैयार'}
                </div>
                <div className="text-[12px] text-gray-500 max-w-xs">
                  {lang === 'en' 
                    ? 'Enter your policy parameters and click calculate to estimate your policy\'s current value.'
                    : 'अपनी पॉलिसी के पैरामीटर दर्ज करें और अपनी पॉलिसी के वर्तमान मूल्य का अनुमान लगाने के लिए गणना करें पर क्लिक करें।'}
                </div>
              </div>
            )}

            {result && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8 space-y-6">
                <div>
                  <h3 className="font-display font-bold text-lg text-navy mb-4 border-b border-gray-50 pb-2">
                    {s.resultTitle}
                  </h3>

                  {/* Guaranteed Surrender Value */}
                  <div className="bg-slate-50 rounded-2xl p-6 text-center border border-gray-100">
                    <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">{s.guaranteedSurrenderValue}</div>
                    <div className="text-3xl font-bold text-navy">{fmt(result.guaranteedSurrenderValue)}</div>
                    <div className="text-[11px] text-gray-500 mt-1">({result.guaranteedSurrenderValue.toLocaleString('en-IN')})</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Estimated Paid-up Value */}
                  <div className="border border-gray-100 rounded-xl p-4">
                    <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">{s.estimatedPaidUpValue}</div>
                    <div className="text-lg font-bold text-navy">{fmt(result.estimatedPaidUpValue)}</div>
                  </div>

                  {/* Surrender Ratio */}
                  <div className={`border rounded-xl p-4 ${getRatioBadgeColor(result.surrenderRatio)}`}>
                    <div className="text-[10px] font-bold uppercase tracking-wider mb-1 opacity-70">{s.surrenderRatio}</div>
                    <div className="text-lg font-bold">{(result.surrenderRatio * 100).toFixed(0)}%</div>
                  </div>
                </div>

                {/* Recommendation */}
                <div className="border border-gray-100 rounded-xl p-4 bg-amber-50/20">
                  <div className="flex gap-2">
                    <TrendingUp className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">{s.recommendation}</div>
                      <p className="text-xs font-medium text-slate-700 leading-relaxed">{result.recommendation}</p>
                    </div>
                  </div>
                </div>

                {/* Calculator CTA Card */}
                <CalculatorCTA
                  serviceLink="/services/life-insurance"
                  serviceLabelEn="Explore Alternatives to Surrender"
                  serviceLabelHi="सरेंडर करने के विकल्प देखें"
                  secondaryLabelEn="Talk to Ajay sir before surrendering"
                  secondaryLabelHi="सरेंडर करने से पहले अजय सर से बात करें"
                  whatsappMessage="Hi Ajay sir, I calculated my LIC surrender value on poddarwealth.com and want to discuss alternatives before surrendering."
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
