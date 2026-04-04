'use client'
import { useState } from 'react'
import { useLang } from '@/lib/LangContext'
import Link from 'next/link'
import { Calculator, ArrowRight, Info } from 'lucide-react'

function formatCurrency(amount: number): string {
  if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)} Cr`
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)} Lakh`
  return `₹${amount.toLocaleString('en-IN')}`
}

export default function LifeInsuranceCalcPage() {
  const { t } = useLang()
  const [form, setForm] = useState({ age: 30, income: 600000, dependents: 2, existing: 0 })
  const [result, setResult] = useState<null | { recommended: number; breakdown: { label: string; amount: number }[] }>(null)

  const calculate = () => {
    const yearsToRetirement = Math.max(60 - form.age, 5)
    const incomeReplacement = form.income * yearsToRetirement * 0.7
    const dependentBonus = form.dependents * form.income * 3
    const totalNeeded = incomeReplacement + dependentBonus
    const recommended = Math.max(totalNeeded - form.existing, 0)

    setResult({
      recommended,
      breakdown: [
        { label: 'Income Replacement (till retirement)', amount: incomeReplacement },
        { label: 'Dependent Support Buffer', amount: dependentBonus },
        { label: 'Less: Existing Coverage', amount: -form.existing },
        { label: 'Recommended Coverage', amount: recommended },
      ]
    })
  }

  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="bg-hero-gradient hero-pattern py-16">
        <div className="section-container text-center text-white">
          <div className="inline-flex items-center gap-2 bg-white/15 border border-white/25 rounded-full px-4 py-2 text-sm font-medium mb-5">
            <Calculator className="w-4 h-4" /> Calculator
          </div>
          <h1 className="font-display font-bold text-4xl md:text-5xl text-white mb-4">{t.lifeCalc.title}</h1>
          <p className="text-white/75 text-lg max-w-xl mx-auto">{t.lifeCalc.subtitle}</p>
        </div>
      </section>

      {/* Calculator */}
      <section className="section-padding bg-slate-50">
        <div className="section-container">
          <div className="max-w-4xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Input form */}
              <div className="bg-white rounded-3xl shadow-card p-8">
                <h2 className="font-display font-bold text-2xl text-slate-900 mb-6">Enter Your Details</h2>
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">{t.lifeCalc.age}: <span className="text-brand-600">{form.age} years</span></label>
                    <input type="range" min="18" max="60" value={form.age} onChange={e => setForm({...form, age: +e.target.value})}
                      className="w-full accent-brand-600 h-2 rounded-full" />
                    <div className="flex justify-between text-xs text-slate-400 mt-1"><span>18</span><span>60</span></div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">{t.lifeCalc.income}</label>
                    <input type="number" value={form.income} onChange={e => setForm({...form, income: +e.target.value})}
                      className="input-field" placeholder="600000" />
                    <div className="text-xs text-slate-400 mt-1">= {formatCurrency(form.income)} per year</div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">{t.lifeCalc.dependents}: <span className="text-brand-600">{form.dependents}</span></label>
                    <input type="range" min="0" max="6" value={form.dependents} onChange={e => setForm({...form, dependents: +e.target.value})}
                      className="w-full accent-brand-600 h-2 rounded-full" />
                    <div className="flex justify-between text-xs text-slate-400 mt-1"><span>0</span><span>6</span></div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">{t.lifeCalc.existing}</label>
                    <input type="number" value={form.existing} onChange={e => setForm({...form, existing: +e.target.value})}
                      className="input-field" placeholder="0" />
                  </div>

                  <button onClick={calculate} className="btn-primary w-full justify-center text-base py-4 mt-2">
                    {t.lifeCalc.calculate}
                  </button>
                </div>
              </div>

              {/* Results */}
              <div>
                {result ? (
                  <div className="bg-brand-700 rounded-3xl p-8 text-white h-full flex flex-col justify-between">
                    <div>
                      <div className="text-white/70 text-sm mb-2">{t.lifeCalc.resultSubtitle}</div>
                      <div className="font-display font-bold text-5xl text-white mb-1">
                        {formatCurrency(result.recommended)}
                      </div>
                      <div className="text-white/70 text-sm mb-8">Life Insurance Cover</div>

                      <h3 className="font-semibold text-white mb-4 text-sm">{t.lifeCalc.breakdown}</h3>
                      <div className="space-y-3">
                        {result.breakdown.map((row, i) => (
                          <div key={i} className={`flex justify-between text-sm ${i === result.breakdown.length - 1 ? 'border-t border-white/30 pt-3 font-bold' : 'text-white/80'}`}>
                            <span>{row.label}</span>
                            <span className={row.amount < 0 ? 'text-red-300' : ''}>{row.amount < 0 ? '-' : ''}{formatCurrency(Math.abs(row.amount))}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mt-8 space-y-3">
                      <Link href="/contact" className="inline-flex items-center justify-center gap-2 bg-white text-brand-700 font-bold px-6 py-3 rounded-xl w-full hover:bg-brand-50 transition-colors">
                        {t.lifeCalc.cta} <ArrowRight className="w-4 h-4" />
                      </Link>
                      <div className="flex items-start gap-2 text-white/60 text-xs">
                        <Info className="w-3 h-3 flex-shrink-0 mt-0.5" />
                        This is a simplified estimate. Ajay will create a precise plan for your situation.
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white rounded-3xl shadow-card p-8 h-full flex flex-col items-center justify-center text-center min-h-80">
                    <Calculator className="w-16 h-16 text-brand-200 mb-4" />
                    <h3 className="font-display font-bold text-xl text-slate-900 mb-2">Enter Your Details</h3>
                    <p className="text-slate-400 text-sm">Fill in your information and click Calculate to see your recommended coverage amount.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Disclaimer */}
            <div className="mt-6 bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
              <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-amber-800 text-sm">This calculator provides an estimate for illustration purposes. Actual coverage needs depend on your liabilities, goals, and family situation. Get a free personalized analysis from Ajay.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
