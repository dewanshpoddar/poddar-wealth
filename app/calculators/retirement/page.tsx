'use client'
import { useState } from 'react'
import { useLang } from '@/lib/LangContext'
import Link from 'next/link'
import { Calculator, ArrowRight, Info, TrendingUp } from 'lucide-react'
import { PLANS, advisePlans } from '@/lib/lic-plans-data.js'
import { fmt } from '@/lib/format'
import { openLeadPopup } from '@/lib/events'

export default function RetirementCalcPage() {
  const { t } = useLang()
  const [form, setForm] = useState({ currentAge: 30, retirementAge: 60, monthlyExpense: 40000, inflation: 6 })
  const [result, setResult] = useState<null | {
    corpus: number
    monthlyAtRetirement: number
    yearsToRetire: number
    monthlySavingsNeeded: number
    suggestedPlans: any[]
  }>(null)

  const calculate = () => {
    const yearsToRetire        = form.retirementAge - form.currentAge
    const inflationFactor      = Math.pow(1 + form.inflation / 100, yearsToRetire)
    const monthlyAtRetirement  = form.monthlyExpense * inflationFactor
    const yearsInRetirement    = 85 - form.retirementAge
    const corpus               = monthlyAtRetirement * 12 * yearsInRetirement

    const monthlyRate          = 0.12 / 12
    const months               = yearsToRetire * 12
    const sipFactor            = (Math.pow(1 + monthlyRate, months) - 1) / monthlyRate * (1 + monthlyRate)
    const monthlySavingsNeeded = corpus / sipFactor

    const suggestedPlans = advisePlans({
      age: form.currentAge,
      goal: 'retirement',
      budget: monthlySavingsNeeded * 12,
      hasDependents: false,
    })

    setResult({ corpus, monthlyAtRetirement, yearsToRetire, monthlySavingsNeeded, suggestedPlans })
  }

  return (
    <div className="pt-20">
      <section className="bg-gradient-to-br from-amber-800 to-orange-900 hero-pattern py-14">
        <div className="section-container text-center text-white">
          <div className="inline-flex items-center gap-2 bg-white/15 border border-white/25 rounded-full px-4 py-2 text-sm font-medium mb-5">
            <Calculator className="w-4 h-4" /> Retirement Calculator
          </div>
          <h1 className="font-display font-bold text-4xl md:text-5xl text-white mb-4">{t.retirementCalc.title}</h1>
          <p className="text-white/75 text-lg max-w-xl mx-auto">{t.retirementCalc.subtitle}</p>
        </div>
      </section>

      {/* ── STEP 1: Corpus need ── */}
      <section className="section-padding bg-slate-50">
        <div className="section-container">
          <div className="max-w-4xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Inputs */}
              <div className="bg-white rounded-3xl shadow-card p-8">
                <h2 className="font-display font-bold text-2xl text-slate-900 mb-6">Your Retirement Details</h2>
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      {t.retirementCalc.currentAge}: <span className="text-amber-600">{form.currentAge} years</span>
                    </label>
                    <input type="range" min="20" max="55" value={form.currentAge}
                      onChange={e => setForm({ ...form, currentAge: +e.target.value })}
                      className="w-full accent-amber-600 h-2 rounded-full" />
                    <div className="flex justify-between text-xs text-slate-400 mt-1"><span>20</span><span>55</span></div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      {t.retirementCalc.retirementAge}: <span className="text-amber-600">{form.retirementAge} years</span>
                    </label>
                    <input type="range" min="45" max="70" value={form.retirementAge}
                      onChange={e => setForm({ ...form, retirementAge: +e.target.value })}
                      className="w-full accent-amber-600 h-2 rounded-full" />
                    <div className="flex justify-between text-xs text-slate-400 mt-1"><span>45</span><span>70</span></div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">{t.retirementCalc.monthlyExpense}</label>
                    <input type="number" value={form.monthlyExpense}
                      onChange={e => setForm({ ...form, monthlyExpense: +e.target.value })}
                      className="input-field" placeholder="40000" />
                    <div className="text-xs text-slate-400 mt-1">= {fmt(form.monthlyExpense)}/month today</div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      {t.retirementCalc.inflation}: <span className="text-amber-600">{form.inflation}%</span>
                    </label>
                    <input type="range" min="4" max="10" step="0.5" value={form.inflation}
                      onChange={e => setForm({ ...form, inflation: +e.target.value })}
                      className="w-full accent-amber-600 h-2 rounded-full" />
                    <div className="flex justify-between text-xs text-slate-400 mt-1"><span>4%</span><span>10%</span></div>
                  </div>
                  <button onClick={calculate}
                    className="w-full justify-center text-base py-4 mt-2 inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white font-semibold px-6 rounded-xl transition-all">
                    {t.retirementCalc.calculate}
                  </button>
                </div>
              </div>

              {/* Corpus result */}
              <div>
                {result ? (
                  <div className="bg-gradient-to-br from-amber-700 to-orange-800 rounded-3xl p-8 text-white h-full flex flex-col justify-between">
                    <div>
                      <div className="text-white/70 text-sm mb-2">{t.retirementCalc.resultTitle}</div>
                      <div className="font-display font-bold text-4xl text-white mb-6">{fmt(result.corpus)}</div>
                      <div className="space-y-3">
                        {[
                          { label: 'Years to Retirement',              value: `${result.yearsToRetire} years` },
                          { label: 'Monthly Expense at Retirement',    value: `${fmt(result.monthlyAtRetirement)}/mo` },
                          { label: 'Monthly Savings Needed (12% p.a.)',value: `${fmt(result.monthlySavingsNeeded)}/mo` },
                        ].map(({ label, value }) => (
                          <div key={label} className="bg-white/15 rounded-2xl p-4">
                            <div className="text-white/70 text-xs mb-1">{label}</div>
                            <div className="font-bold text-lg">{value}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <p className="text-white/50 text-xs mt-4">↓ Scroll down to see matched LIC pension plans</p>
                  </div>
                ) : (
                  <div className="bg-white rounded-3xl shadow-card p-8 h-full flex flex-col items-center justify-center text-center min-h-80">
                    <span className="text-6xl mb-4">🌅</span>
                    <h3 className="font-display font-bold text-xl text-slate-900 mb-2">Plan Your Retirement</h3>
                    <p className="text-slate-400 text-sm">Enter your details and click calculate to discover how much you need.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STEP 2: LIC Pension Plan Suggestions ── */}
      {result && result.suggestedPlans.length > 0 && (
        <section className="section-padding bg-white border-t border-slate-100">
          <div className="section-container">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 bg-amber-50 text-amber-700 px-4 py-1.5 rounded-full text-sm font-semibold mb-3">
                  <TrendingUp className="w-4 h-4" /> LIC Plans Matched to Your Goal
                </div>
                <h2 className="font-display font-bold text-2xl text-slate-900">
                  To build <span className="text-amber-600">{fmt(result.corpus)}</span>, consider these LIC plans
                </h2>
                <p className="text-slate-500 text-sm mt-2">
                  Selected based on your age ({form.currentAge} yrs) and retirement horizon ({result.yearsToRetire} yrs)
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                {result.suggestedPlans.map((plan: any) => (
                  <div key={plan.planNo} className="bg-slate-50 border border-slate-100 rounded-2xl p-5 hover:border-amber-200 hover:shadow-md transition-all">
                    <div className="flex items-start justify-between mb-3">
                      <span className="text-xs font-bold text-slate-400 bg-white px-2 py-0.5 rounded border border-slate-100">
                        Plan {plan.planNo}
                      </span>
                      <span className="text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded">
                        {plan.xirr} XIRR
                      </span>
                    </div>
                    <h3 className="font-display font-bold text-slate-900 text-base mb-1 leading-tight">{plan.name}</h3>
                    <p className="text-slate-500 text-xs mb-3 leading-relaxed">{plan.desc}</p>
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      <div className="bg-white rounded-lg p-2 border border-slate-100">
                        <div className="text-xs text-slate-400">Entry Age</div>
                        <div className="text-xs font-bold text-slate-700">{plan.minAge}–{plan.maxAge} yrs</div>
                      </div>
                      <div className="bg-white rounded-lg p-2 border border-slate-100">
                        <div className="text-xs text-slate-400">Min SA</div>
                        <div className="text-xs font-bold text-slate-700">{fmt(plan.minSA)}</div>
                      </div>
                    </div>
                    <ul className="space-y-1 mb-4">
                      {plan.keyFeatures?.slice(0, 3).map((f: string, i: number) => (
                        <li key={i} className="text-xs text-slate-600 flex items-start gap-1.5">
                          <span className="text-amber-500 mt-0.5">•</span>{f}
                        </li>
                      ))}
                    </ul>
                    <button
                      onClick={() => openLeadPopup(`Retirement plan interest: ${plan.name} (Plan ${plan.planNo})`)}
                      className="w-full bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold py-2.5 rounded-xl transition-colors flex items-center justify-center gap-1.5">
                      Get a Quote <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Disclaimer */}
      <section className="pb-12 bg-white">
        <div className="section-container">
          <div className="max-w-5xl mx-auto">
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
              <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-amber-800 text-sm">
                Results assume life expectancy of 85 years and 12% investment returns. Actual results vary based on your savings rate, asset allocation, and inflation. Plan suggestions are illustrative.{' '}
                <Link href="/contact" className="underline font-semibold">Consult Ajay for a personalised retirement plan.</Link>
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
