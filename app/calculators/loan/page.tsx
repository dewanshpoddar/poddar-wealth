'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useLang } from '@/lib/LangContext'
import { Calculator, Info, Phone, RefreshCw, AlertCircle, TrendingUp, CheckCircle, Share2, HelpCircle, MessageCircle } from 'lucide-react'
import { PLANS } from '@/lib/lic-plans-data.js'
import { fmt, fmtSA } from '@/lib/format'
import { ADVISOR_PHONE } from '@/lib/constants'
import WhatsAppShare from '@/components/WhatsAppShare'
import { LoanResult } from '@/lib/types/calculator'

export default function LoanCalculatorPage() {
  const { t, lang } = useLang()
  const l = t.loanCalculator || {
    title: 'LIC Loan Against Policy Calculator',
    subtitle: 'Calculate the maximum loan amount available against your LIC policy. Free online tool.',
    planLabel: 'Select LIC Plan',
    sumAssuredLabel: 'Sum Assured (₹)',
    policyYearLabel: 'Policy Years Completed',
    bonusAccruedLabel: 'Bonus Accrued (₹, Optional)',
    bonusHelper: 'Leave blank if unsure — we\'ll estimate without bonus',
    calculateButton: 'Calculate Loan Amount',
    resultTitle: 'Loan Eligibility Details',
    maxLoanAmount: 'Maximum Loan Amount',
    estimatedInterestRate: 'Estimated Interest Rate',
    monthlyInterest: 'Monthly Interest Obligation',
    annualInterest: 'Annual Interest Obligation',
    disclaimer: 'Disclaimer',
    applyQuery: 'Apply for loan through Ajay sir',
    whatsappCTA: 'Apply via Ajay Sir on WhatsApp',
    disclaimerText: 'This is an estimate based on LIC general guidelines. Actual loan eligibility is determined by LIC branch after policy verification.',
    errorCompletedYears: 'Loan against policy is only available after completing at least 3 policy years.',
    loading: 'Calculating...'
  }

  // Filter plans to display active ones or major ones
  const majorPlans = PLANS.filter(p => p.status !== 'withdrawn' && ['endowment', 'wholelife', 'child', 'saving'].includes(p.category || ''))

  const [planNumber, setPlanNumber] = useState(majorPlans[0]?.planNo?.toString() || '915')
  const [sumAssured, setSumAssured] = useState<number>(500000)
  const [policyYear, setPolicyYear] = useState<number>(5)
  const [bonusInput, setBonusInput] = useState<string>('')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<LoanResult | null>(null)

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setResult(null)

    if (policyYear < 3) {
      setError(l.errorCompletedYears)
      return
    }

    setLoading(true)

    const payload: Record<string, any> = {
      planNumber,
      sumAssured,
      policyYear,
    }

    const parsedBonus = parseFloat(bonusInput)
    if (!isNaN(parsedBonus) && parsedBonus > 0) {
      payload.bonusAccrued = parsedBonus
    }

    try {
      const res = await fetch('/api/calculators/loan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (!res.ok) {
        const errData = await res.json()
        throw new Error(errData.error || 'Failed to calculate')
      }

      const data: LoanResult = await res.json()
      setResult(data)

      // Track calculation event
      fetch('/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: 'calc_run',
          sheetName: 'Loan Calculator',
          data: {
            planNo: planNumber,
            sa: sumAssured,
            policyYear,
            bonus: parsedBonus || 0,
            loanEligible: data.maxLoanAmount,
            interestRate: data.estimatedInterestRate,
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
    ? `*LIC Loan Against Policy Quote — Poddar Wealth*
Plan: LIC Plan ${planNumber}
Policy Years completed: ${policyYear}
Sum Assured: ${fmtSA(sumAssured)}

*Maximum Loan Eligible:* ${fmt(result.maxLoanAmount)}
*Interest Rate:* ${result.estimatedInterestRate}% p.a.
*Monthly Interest Payment:* ${fmt(result.monthlyInterest)}
*Annual Interest Payment:* ${fmt(result.annualInterest)}

Estimate your borrowing capacity here: `
    : ''

  const getWhatsAppCTAUrl = () => {
    if (!result) return ''
    const msg = `Hi Ajay sir, I checked my LIC Loan eligibility on poddarwealth.com:
Plan: LIC Plan ${planNumber}
Years Completed: ${policyYear}
Sum Assured: ₹${sumAssured.toLocaleString('en-IN')}
Maximum Loan: ₹${result.maxLoanAmount.toLocaleString('en-IN')}
Please help me apply for this loan or check if I have a higher loan value based on my actual bonus.`
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
            <Calculator className="w-3.5 h-3.5" /> {lang === 'en' ? 'LIC Loan Against Policy Calculator' : 'LIC पॉलिसी पर लोन कैलकुलेटर'}
          </div>
          <h1 className="font-display text-[28px] md:text-[40px] font-bold text-white leading-tight mb-3">
            {l.title}
          </h1>
          <p className="text-white/60 text-[14px] max-w-xl mx-auto">
            {l.subtitle}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Form Side */}
          <div className="lg:col-span-6 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
            <h2 className="font-display font-bold text-xl text-navy mb-6">
              {lang === 'en' ? 'Check Borrowing Limit' : 'लोन की सीमा जांचें'}
            </h2>

            <form onSubmit={handleCalculate} className="space-y-5">
              {/* Plan Selector */}
              <div>
                <label htmlFor="planNumber" className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  {l.planLabel}
                </label>
                <select
                  id="planNumber"
                  value={planNumber}
                  onChange={(e) => setPlanNumber(e.target.value)}
                  className="w-full h-11 px-3 border border-gray-200 rounded-xl bg-gray-50 text-sm font-semibold focus:outline-none focus:border-gold focus:bg-white transition-all text-navy"
                >
                  {majorPlans.map((plan) => (
                    <option key={plan.planNo} value={plan.planNo}>
                      Plan {plan.planNo} — {plan.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sum Assured */}
              <div>
                <label htmlFor="sumAssured" className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  {l.sumAssuredLabel}
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

              {/* Policy Year */}
              <div>
                <label htmlFor="policyYear" className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  {l.policyYearLabel}
                </label>
                <input
                  id="policyYear"
                  type="number"
                  min={1}
                  max={45}
                  required
                  value={policyYear}
                  onChange={(e) => setPolicyYear(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full h-11 px-3 border border-gray-200 rounded-xl bg-gray-50 text-sm font-semibold focus:outline-none focus:border-gold focus:bg-white transition-all text-navy"
                />
              </div>

              {/* Bonus Accrued */}
              <div>
                <label htmlFor="bonusInput" className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  {l.bonusAccruedLabel}
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 font-semibold text-sm">₹</span>
                  <input
                    id="bonusInput"
                    type="number"
                    min={0}
                    step={5000}
                    value={bonusInput}
                    onChange={(e) => setBonusInput(e.target.value)}
                    className="w-full h-11 pl-8 pr-4 border border-gray-200 rounded-xl bg-gray-50 text-sm font-semibold focus:outline-none focus:border-gold focus:bg-white transition-all text-navy"
                    placeholder="e.g. 50000"
                  />
                </div>
                <div className="text-[10px] text-gray-400 mt-1 italic leading-relaxed">
                  {l.bonusHelper}
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
                    <span>{l.loading}</span>
                  </>
                ) : (
                  <>
                    <Calculator className="w-4 h-4" />
                    <span>{l.calculateButton}</span>
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
                  {lang === 'en' ? 'Check Loan Limit' : 'लोन की सीमा चेक करें'}
                </div>
                <div className="text-[12px] text-gray-400 max-w-xs">
                  {lang === 'en' 
                    ? 'Enter policy parameters to check the estimated loan amount you can avail against your LIC policy.'
                    : 'अपनी एलआईसी पॉलिसी के खिलाफ आप जो अनुमानित लोन राशि प्राप्त कर सकते हैं उसकी जांच करने के लिए पॉलिसी मापदंड दर्ज करें।'}
                </div>
              </div>
            )}

            {result && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8 space-y-6">
                <div>
                  <h3 className="font-display font-bold text-lg text-navy mb-4 border-b border-gray-50 pb-2">
                    {l.resultTitle}
                  </h3>

                  {/* Maximum Loan Amount */}
                  <div className="bg-slate-50 rounded-2xl p-6 text-center border border-gray-100">
                    <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">{l.maxLoanAmount}</div>
                    <div className="text-3xl font-bold text-navy">{fmt(result.maxLoanAmount)}</div>
                    <div className="text-[11px] text-gray-400 mt-1">({result.maxLoanAmount.toLocaleString('en-IN')})</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Estimated Interest Rate */}
                  <div className="border border-gray-100 rounded-xl p-4">
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">{l.estimatedInterestRate}</div>
                    <div className="text-base font-bold text-navy">{result.estimatedInterestRate.toFixed(1)}% p.a.</div>
                  </div>

                  {/* Annual Interest */}
                  <div className="border border-gray-100 rounded-xl p-4">
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">{l.annualInterest}</div>
                    <div className="text-base font-bold text-navy">{fmt(result.annualInterest)}</div>
                  </div>

                  {/* Monthly Interest */}
                  <div className="border border-gray-100 rounded-xl p-4 sm:col-span-2">
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">{l.monthlyInterest}</div>
                    <div className="text-base font-bold text-navy">{fmt(result.monthlyInterest)}</div>
                  </div>
                </div>

                {/* WhatsApp Sir CTA */}
                <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5 text-center space-y-4">
                  <div className="flex justify-center gap-2 text-amber-600">
                    <CheckCircle className="w-5 h-5 flex-shrink-0" />
                    <span className="text-xs font-bold">{l.applyQuery}</span>
                  </div>
                  <a
                    href={getWhatsAppCTAUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex h-11 bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-xs rounded-xl items-center justify-center gap-2 transition-all shadow-md shadow-green-500/10 cursor-pointer"
                  >
                    <MessageCircle size={16} className="text-white" />
                    {l.whatsappCTA}
                  </a>
                </div>

                {/* WhatsAppShare Result */}
                <div className="flex items-center justify-between border-t border-gray-100 pt-5">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{lang === 'en' ? 'Share Results' : 'परिणाम साझा करें'}</span>
                  <WhatsAppShare text={shareText} className="shadow-none py-2 px-4" />
                </div>

                {/* Disclaimer */}
                <div className="flex gap-2 text-gray-400 border-t border-gray-50 pt-4">
                  <Info className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                  <p className="text-[10px] leading-relaxed">{result.disclaimer || l.disclaimerText}</p>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}
