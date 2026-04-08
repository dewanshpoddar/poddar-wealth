'use client'
import { useState, useMemo } from 'react'
import { useLang } from '@/lib/LangContext'
import Link from 'next/link'
import { Calculator, ArrowRight, Info, ChevronDown, ChevronUp, Shield } from 'lucide-react'
// @ts-ignore
import { calculatePremium, generateBenefitTable, PLANS, getPPT } from '@/lib/lic-plans-data.js'

function fmt(n: number) {
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(2)} Cr`
  if (n >= 100000)   return `₹${(n / 100000).toFixed(1)} L`
  return `₹${n.toLocaleString('en-IN')}`
}

const TERM_PLANS = (PLANS as any[]).filter((p: any) => p.category === 'term')
const ENDOWMENT_PLANS = (PLANS as any[]).filter((p: any) => ['endowment', 'wholelife'].includes(p.category))

export default function LifeInsuranceCalcPage() {
  const { t } = useLang()

  // Step 1 — coverage need
  const [form, setForm]     = useState({ age: 30, income: 600000, dependents: 2, existing: 0 })
  const [need, setNeed]     = useState<null | { recommended: number; breakdown: { label: string; amount: number }[] }>(null)

  // Step 2 — plan quote
  const [planNo, setPlanNo] = useState<number | null>(null)
  const [sa, setSa]         = useState(0)
  const [term, setTerm]     = useState(20)
  const [mode, setMode]     = useState<'yearly'|'halfyearly'|'quarterly'|'monthly'>('yearly')
  const [showTable, setShowTable] = useState(false)

  const calculateNeed = () => {
    const yearsToRetirement  = Math.max(60 - form.age, 5)
    const incomeReplacement  = form.income * yearsToRetirement * 0.7
    const dependentBonus     = form.dependents * form.income * 3
    const totalNeeded        = incomeReplacement + dependentBonus
    const recommended        = Math.max(totalNeeded - form.existing, 0)
    setNeed({
      recommended,
      breakdown: [
        { label: 'Income Replacement (till retirement)', amount: incomeReplacement },
        { label: 'Dependent Support Buffer',             amount: dependentBonus },
        { label: 'Less: Existing Coverage',              amount: -form.existing },
        { label: 'Recommended Coverage',                 amount: recommended },
      ]
    })
    // Pre-fill SA with recommended rounded to nearest 5L
    const roundedSA = Math.ceil(recommended / 500000) * 500000
    setSa(roundedSA)
    setPlanNo(TERM_PLANS[0]?.planNo ?? null)
  }

  const selectedPlan = useMemo(() => (PLANS as any[]).find((p: any) => p.planNo === planNo), [planNo])
  const ppt = useMemo(() => {
    if (!selectedPlan) return term
    return getPPT(selectedPlan, term, form.age)
  }, [selectedPlan, term, form.age])

  const premResult = useMemo(() => {
    if (!planNo || !sa || sa < 100000) return null
    return calculatePremium({ planNo, sa, age: form.age, term, ppt, mode })
  }, [planNo, sa, form.age, term, ppt, mode])

  const benefitTable = useMemo(() => {
    if (!premResult || !planNo) return []
    return generateBenefitTable({ planNo, sa, age: form.age, term, ppt, premResult: premResult as any })
  }, [premResult, planNo, sa, form.age, term, ppt])

  const xirr = useMemo(() => {
    if (!premResult || !benefitTable.length) return null
    const lastRow = benefitTable[benefitTable.length - 1]
    if (!lastRow.maturityPayout) return null
    return ((Math.pow(lastRow.maturityPayout / premResult.totalPaid, 1 / term) - 1) * 100).toFixed(1)
  }, [premResult, benefitTable, term])

  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="bg-hero-gradient hero-pattern py-14">
        <div className="section-container text-center text-white">
          <div className="inline-flex items-center gap-2 bg-white/15 border border-white/25 rounded-full px-4 py-2 text-sm font-medium mb-5">
            <Calculator className="w-4 h-4" /> Life Insurance Calculator
          </div>
          <h1 className="font-display font-bold text-4xl md:text-5xl text-white mb-4">{t.lifeCalc.title}</h1>
          <p className="text-white/75 text-lg max-w-xl mx-auto">{t.lifeCalc.subtitle}</p>
        </div>
      </section>

      {/* ── STEP 1: Coverage Need ── */}
      <section className="section-padding bg-slate-50">
        <div className="section-container">
          <div className="max-w-4xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Inputs */}
              <div className="bg-white rounded-3xl shadow-card p-8">
                <h2 className="font-display font-bold text-2xl text-slate-900 mb-6">
                  Step 1 — How much cover do you need?
                </h2>
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      {t.lifeCalc.age}: <span className="text-brand-600">{form.age} years</span>
                    </label>
                    <input type="range" min="18" max="60" value={form.age}
                      onChange={e => setForm({ ...form, age: +e.target.value })}
                      className="w-full accent-brand-600 h-2 rounded-full" />
                    <div className="flex justify-between text-xs text-slate-400 mt-1"><span>18</span><span>60</span></div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">{t.lifeCalc.income}</label>
                    <input type="number" value={form.income}
                      onChange={e => setForm({ ...form, income: +e.target.value })}
                      className="input-field" placeholder="600000" />
                    <div className="text-xs text-slate-400 mt-1">= {fmt(form.income)} per year</div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      {t.lifeCalc.dependents}: <span className="text-brand-600">{form.dependents}</span>
                    </label>
                    <input type="range" min="0" max="6" value={form.dependents}
                      onChange={e => setForm({ ...form, dependents: +e.target.value })}
                      className="w-full accent-brand-600 h-2 rounded-full" />
                    <div className="flex justify-between text-xs text-slate-400 mt-1"><span>0</span><span>6</span></div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">{t.lifeCalc.existing}</label>
                    <input type="number" value={form.existing}
                      onChange={e => setForm({ ...form, existing: +e.target.value })}
                      className="input-field" placeholder="0" />
                  </div>
                  <button onClick={calculateNeed} className="btn-primary w-full justify-center text-base py-4 mt-2">
                    {t.lifeCalc.calculate}
                  </button>
                </div>
              </div>

              {/* Coverage result */}
              <div>
                {need ? (
                  <div className="bg-brand-700 rounded-3xl p-8 text-white h-full flex flex-col justify-between">
                    <div>
                      <div className="text-white/70 text-sm mb-2">{t.lifeCalc.resultSubtitle}</div>
                      <div className="font-display font-bold text-5xl text-white mb-1">{fmt(need.recommended)}</div>
                      <div className="text-white/70 text-sm mb-8">Recommended Life Cover</div>
                      <h3 className="font-semibold text-white mb-4 text-sm">{t.lifeCalc.breakdown}</h3>
                      <div className="space-y-3">
                        {need.breakdown.map((row, i) => (
                          <div key={i} className={`flex justify-between text-sm ${i === need.breakdown.length - 1 ? 'border-t border-white/30 pt-3 font-bold' : 'text-white/80'}`}>
                            <span>{row.label}</span>
                            <span className={row.amount < 0 ? 'text-red-300' : ''}>
                              {row.amount < 0 ? '-' : ''}{fmt(Math.abs(row.amount))}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <p className="text-white/50 text-xs mt-6">Scroll down to get an actual LIC premium quote for this cover ↓</p>
                  </div>
                ) : (
                  <div className="bg-white rounded-3xl shadow-card p-8 h-full flex flex-col items-center justify-center text-center min-h-80">
                    <Calculator className="w-16 h-16 text-brand-200 mb-4" />
                    <h3 className="font-display font-bold text-xl text-slate-900 mb-2">Enter Your Details</h3>
                    <p className="text-slate-400 text-sm">Fill in your information and click Calculate.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STEP 2: LIC Plan Quote (shown after step 1) ── */}
      {need && (
        <section className="section-padding bg-white border-t border-slate-100">
          <div className="section-container">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-10">
                <div className="inline-flex items-center gap-2 bg-brand-50 text-brand-700 px-4 py-1.5 rounded-full text-sm font-semibold mb-3">
                  <Shield className="w-4 h-4" /> Step 2 — Get a Real LIC Premium Quote
                </div>
                <h2 className="font-display font-bold text-2xl text-slate-900">
                  Your coverage need is <span className="text-brand-600">{fmt(need.recommended)}</span>.
                  Here's what LIC charges.
                </h2>
              </div>

              {/* Plan selection + config */}
              <div className="grid lg:grid-cols-3 gap-6 mb-8">
                {/* Plan picker */}
                <div className="bg-slate-50 rounded-2xl p-5">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Choose Plan</div>
                  <div className="space-y-2">
                    {[...TERM_PLANS, ...ENDOWMENT_PLANS].map((p: any) => (
                      <button key={p.planNo}
                        onClick={() => setPlanNo(p.planNo)}
                        className={`w-full text-left px-3 py-2.5 rounded-xl text-sm transition-all border
                          ${planNo === p.planNo
                            ? 'bg-brand-700 text-white border-brand-700 font-semibold'
                            : 'bg-white text-slate-700 border-slate-100 hover:border-brand-200'}`}>
                        <div className="font-medium leading-tight">{p.name}</div>
                        <div className={`text-xs mt-0.5 ${planNo === p.planNo ? 'text-white/70' : 'text-slate-400'}`}>
                          Plan {p.planNo} · {p.category} · {p.xirr} XIRR
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sliders */}
                <div className="bg-slate-50 rounded-2xl p-5 space-y-5">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Adjust Parameters</div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">
                      Sum Assured: <span className="text-brand-600">{fmt(sa)}</span>
                    </label>
                    <input type="range" min="500000" max="10000000" step="500000" value={sa}
                      onChange={e => setSa(+e.target.value)}
                      className="w-full accent-brand-600 h-2 rounded-full" />
                    <div className="flex justify-between text-xs text-slate-400 mt-1"><span>₹5L</span><span>₹1Cr</span></div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">
                      Policy Term: <span className="text-brand-600">{term} years</span>
                    </label>
                    <input type="range" min="10" max="35" step="1" value={term}
                      onChange={e => setTerm(+e.target.value)}
                      className="w-full accent-brand-600 h-2 rounded-full" />
                    <div className="flex justify-between text-xs text-slate-400 mt-1"><span>10 yrs</span><span>35 yrs</span></div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Payment Mode</label>
                    <div className="grid grid-cols-2 gap-2">
                      {(['yearly','halfyearly','quarterly','monthly'] as const).map(m => (
                        <button key={m} onClick={() => setMode(m)}
                          className={`py-1.5 rounded-lg text-xs font-semibold transition-all border
                            ${mode === m ? 'bg-brand-700 text-white border-brand-700' : 'bg-white text-slate-600 border-slate-200 hover:border-brand-300'}`}>
                          {m.charAt(0).toUpperCase() + m.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Premium output */}
                <div className="bg-brand-700 rounded-2xl p-5 text-white flex flex-col justify-between">
                  <div className="text-xs font-bold text-white/60 uppercase tracking-wider mb-3">Premium Breakdown</div>
                  {premResult ? (
                    <>
                      <div>
                        <div className="text-white/70 text-xs mb-1">Year 1 Premium ({mode})</div>
                        <div className="font-display font-bold text-3xl mb-4">
                          {fmt(premResult.instalment1)}
                        </div>
                        <div className="space-y-2 text-sm">
                          {[
                            ['Base Premium',    premResult.basePremium],
                            ['Mode Rebate',    -premResult.modeRebate],
                            ['SA Rebate',      -premResult.saRebate],
                            ['Net Premium',     premResult.netPremium],
                            [`GST (${premResult.gstPctYear1}%)`, premResult.gstYear1],
                          ].map(([l,v]: any) => (
                            <div key={l} className="flex justify-between text-white/80">
                              <span>{l}</span>
                              <span className={v < 0 ? 'text-green-300' : ''}>{v < 0 ? '-' : ''}{fmt(Math.abs(v))}</span>
                            </div>
                          ))}
                          <div className="flex justify-between border-t border-white/20 pt-2 font-semibold">
                            <span>Year 2+ ({mode})</span>
                            <span>{fmt(premResult.instalment2)}</span>
                          </div>
                          <div className="flex justify-between text-white/70">
                            <span>Total over {ppt} yrs</span>
                            <span>{fmt(premResult.totalPaid)}</span>
                          </div>
                          {xirr && (
                            <div className="flex justify-between text-green-300 font-semibold pt-1">
                              <span>Approx. XIRR</span>
                              <span>{xirr}%</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => window.dispatchEvent(new CustomEvent('open-lead-popup', { detail: { intent: `Premium quote: ${selectedPlan?.name} Plan ${planNo}, ${fmt(sa)} cover` } }))}
                        className="mt-4 w-full bg-white text-brand-700 font-bold py-2.5 rounded-xl text-sm hover:bg-brand-50 transition-colors flex items-center justify-center gap-2">
                        Get Official Quote <ArrowRight className="w-4 h-4" />
                      </button>
                    </>
                  ) : (
                    <div className="text-white/50 text-sm">Select a plan and set parameters above.</div>
                  )}
                </div>
              </div>

              {/* Benefit table toggle */}
              {benefitTable.length > 0 && (
                <div className="bg-slate-50 rounded-2xl overflow-hidden">
                  <button
                    onClick={() => setShowTable(v => !v)}
                    className="w-full flex items-center justify-between px-6 py-4 text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-colors">
                    <span>Year-by-Year Benefit Table — {selectedPlan?.name}</span>
                    {showTable ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                  {showTable && (
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs">
                        <thead className="bg-brand-700 text-white">
                          <tr>
                            {['Year','Age','Premium Paid','Cum. Paid','Annual Bonus','Cum. Bonus','Death Benefit','Surrender Value','Maturity'].map(h => (
                              <th key={h} className="px-3 py-2.5 text-left font-semibold whitespace-nowrap">{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {benefitTable.map((row: any, i: number) => (
                            <tr key={row.year} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                              <td className="px-3 py-2 font-semibold text-brand-700">{row.year}</td>
                              <td className="px-3 py-2">{row.age}</td>
                              <td className="px-3 py-2">{row.premiumPaid ? fmt(row.premiumPaid) : '—'}</td>
                              <td className="px-3 py-2">{fmt(row.cumPremiumPaid)}</td>
                              <td className="px-3 py-2">{row.annualBonus ? fmt(row.annualBonus) : '—'}</td>
                              <td className="px-3 py-2">{row.cumBonus ? fmt(row.cumBonus) : '—'}</td>
                              <td className="px-3 py-2 font-semibold text-red-600">{fmt(row.deathBenefit)}</td>
                              <td className="px-3 py-2 text-amber-600">{row.gsv ? fmt(row.gsv) : '—'}</td>
                              <td className="px-3 py-2 font-bold text-green-700">{row.maturityPayout ? fmt(row.maturityPayout) : '—'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
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
                Premium figures are illustrative based on LIC tabular rates (2026). Actual premiums depend on underwriting, medical tests, and current LIC circulars. Bonus rates are historical and not guaranteed.
                {' '}<Link href="/contact" className="underline font-semibold">Get a precise quote from Ajay.</Link>
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
