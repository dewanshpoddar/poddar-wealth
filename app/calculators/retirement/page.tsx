'use client'
import { useState } from 'react'
import { useLang } from '@/lib/LangContext'
import Link from 'next/link'
import { Calculator, ArrowRight, Info } from 'lucide-react'

function formatCurrency(amount: number): string {
  if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)} Crore`
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(0)} Lakh`
  return `₹${amount.toLocaleString('en-IN')}`
}

export default function RetirementCalcPage() {
  const { t } = useLang()
  const [form, setForm] = useState({ currentAge: 30, retirementAge: 60, monthlyExpense: 40000, inflation: 6 })
  const [result, setResult] = useState<null | { corpus: number; monthlyAtRetirement: number; yearsToRetire: number; monthlySavingsNeeded: number }>(null)

  const calculate = () => {
    const yearsToRetire = form.retirementAge - form.currentAge
    const inflationFactor = Math.pow(1 + form.inflation / 100, yearsToRetire)
    const monthlyAtRetirement = form.monthlyExpense * inflationFactor
    const yearsInRetirement = 85 - form.retirementAge
    const corpus = monthlyAtRetirement * 12 * yearsInRetirement

    // Rough SIP calculation assuming 12% returns
    const monthlyRate = 0.12 / 12
    const months = yearsToRetire * 12
    const sipFactor = (Math.pow(1 + monthlyRate, months) - 1) / monthlyRate * (1 + monthlyRate)
    const monthlySavingsNeeded = corpus / sipFactor

    setResult({ corpus, monthlyAtRetirement, yearsToRetire, monthlySavingsNeeded })
  }

  return (
    <div className="pt-20">
      <section className="bg-gradient-to-br from-amber-800 to-orange-900 hero-pattern py-16">
        <div className="section-container text-center text-white">
          <div className="inline-flex items-center gap-2 bg-white/15 border border-white/25 rounded-full px-4 py-2 text-sm font-medium mb-5">
            <Calculator className="w-4 h-4" /> Retirement Calculator
          </div>
          <h1 className="font-display font-bold text-4xl md:text-5xl text-white mb-4">{t.retirementCalc.title}</h1>
          <p className="text-white/75 text-lg max-w-xl mx-auto">{t.retirementCalc.subtitle}</p>
        </div>
      </section>

      <section className="section-padding bg-slate-50">
        <div className="section-container">
          <div className="max-w-4xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Inputs */}
              <div className="bg-white rounded-3xl shadow-card p-8">
                <h2 className="font-display font-bold text-2xl text-slate-900 mb-6">Your Retirement Details</h2>
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">{t.retirementCalc.currentAge}: <span className="text-amber-600">{form.currentAge} years</span></label>
                    <input type="range" min="20" max="55" value={form.currentAge} onChange={e => setForm({...form, currentAge: +e.target.value})}
                      className="w-full accent-amber-600 h-2 rounded-full" />
                    <div className="flex justify-between text-xs text-slate-400 mt-1"><span>20</span><span>55</span></div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">{t.retirementCalc.retirementAge}: <span className="text-amber-600">{form.retirementAge} years</span></label>
                    <input type="range" min="45" max="70" value={form.retirementAge} onChange={e => setForm({...form, retirementAge: +e.target.value})}
                      className="w-full accent-amber-600 h-2 rounded-full" />
                    <div className="flex justify-between text-xs text-slate-400 mt-1"><span>45</span><span>70</span></div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">{t.retirementCalc.monthlyExpense}</label>
                    <input type="number" value={form.monthlyExpense} onChange={e => setForm({...form, monthlyExpense: +e.target.value})}
                      className="input-field" placeholder="40000" />
                    <div className="text-xs text-slate-400 mt-1">= {formatCurrency(form.monthlyExpense)}/month today</div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">{t.retirementCalc.inflation}: <span className="text-amber-600">{form.inflation}%</span></label>
                    <input type="range" min="4" max="10" step="0.5" value={form.inflation} onChange={e => setForm({...form, inflation: +e.target.value})}
                      className="w-full accent-amber-600 h-2 rounded-full" />
                    <div className="flex justify-between text-xs text-slate-400 mt-1"><span>4%</span><span>10%</span></div>
                  </div>

                  <button onClick={calculate} className="w-full justify-center text-base py-4 mt-2 inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white font-semibold px-6 rounded-xl transition-all">
                    {t.retirementCalc.calculate}
                  </button>
                </div>
              </div>

              {/* Results */}
              <div>
                {result ? (
                  <div className="bg-gradient-to-br from-amber-700 to-orange-800 rounded-3xl p-8 text-white h-full flex flex-col justify-between">
                    <div>
                      <div className="text-white/70 text-sm mb-2">{t.retirementCalc.resultTitle}</div>
                      <div className="font-display font-bold text-4xl text-white mb-6">
                        {formatCurrency(result.corpus)}
                      </div>

                      <div className="space-y-4">
                        <div className="bg-white/15 rounded-2xl p-4">
                          <div className="text-white/70 text-xs mb-1">Years to Retirement</div>
                          <div className="font-bold text-xl">{result.yearsToRetire} years</div>
                        </div>
                        <div className="bg-white/15 rounded-2xl p-4">
                          <div className="text-white/70 text-xs mb-1">Monthly Expense at Retirement</div>
                          <div className="font-bold text-xl">{formatCurrency(result.monthlyAtRetirement)}/month</div>
                        </div>
                        <div className="bg-white/15 rounded-2xl p-4">
                          <div className="text-white/70 text-xs mb-1">Monthly SIP Needed (at 12% returns)</div>
                          <div className="font-bold text-xl">{formatCurrency(result.monthlySavingsNeeded)}/month</div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 space-y-3">
                      <Link href="/contact" className="inline-flex items-center justify-center gap-2 bg-white text-amber-700 font-bold px-6 py-3 rounded-xl w-full hover:bg-amber-50 transition-colors">
                        {t.retirementCalc.cta} <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white rounded-3xl shadow-card p-8 h-full flex flex-col items-center justify-center text-center min-h-80">
                    <span className="text-6xl mb-4">🌅</span>
                    <h3 className="font-display font-bold text-xl text-slate-900 mb-2">Plan Your Retirement</h3>
                    <p className="text-slate-400 text-sm">Enter your details and click calculate to discover how much you need to save for a comfortable retirement.</p>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
              <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-amber-800 text-sm">Results assume life expectancy of 85 years and 12% investment returns. Actual results vary. Consult Ajay for a personalized retirement plan.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
