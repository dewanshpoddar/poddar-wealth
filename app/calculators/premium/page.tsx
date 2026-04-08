'use client'
import { useState, useMemo } from 'react'
import Link from 'next/link'
import {
  Calculator, ArrowRight, ChevronDown, ChevronUp,
  Share2, CheckCircle2, Info, Search, Shield, TrendingUp, Star
} from 'lucide-react'
// @ts-ignore
import PLANS, { calculatePremium, calculateMaturity, generateBenefitTable, getPPT, RIDERS } from '@/lib/lic-plans-data.js'

/* ─── helpers ─────────────────────────────── */
function fmt(n: number) {
  if (!n && n !== 0) return '—'
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(2)} Cr`
  if (n >= 100000)   return `₹${(n / 100000).toFixed(1)} L`
  return `₹${Math.round(n).toLocaleString('en-IN')}`
}
function fmtSA(n: number) {
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(1)} Cr`
  if (n >= 100000)   return `₹${(n / 100000).toFixed(0)} L`
  return `₹${n.toLocaleString('en-IN')}`
}

/* ─── constants ───────────────────────────── */
const CATEGORIES = [
  { key: 'all',       label: 'All Plans',    icon: '📋' },
  { key: 'endowment', label: 'Endowment',    icon: '🏦' },
  { key: 'moneyback', label: 'Money Back',   icon: '💰' },
  { key: 'wholelife', label: 'Whole Life',   icon: '♾️' },
  { key: 'term',      label: 'Term',         icon: '🛡️' },
  { key: 'child',     label: 'Child',        icon: '🎓' },
  { key: 'pension',   label: 'Pension',      icon: '📈' },
  { key: 'ulip',      label: 'ULIP',         icon: '📊' },
]

const CAT_BADGE: Record<string, string> = {
  endowment: 'bg-blue-50 text-blue-700',
  moneyback: 'bg-green-50 text-green-700',
  wholelife: 'bg-purple-50 text-purple-700',
  term:      'bg-red-50 text-red-700',
  child:     'bg-amber-50 text-amber-700',
  pension:   'bg-indigo-50 text-indigo-700',
  ulip:      'bg-teal-50 text-teal-700',
}

const SA_PRESETS = [500000, 1000000, 2500000, 5000000, 10000000]

/* ─── page ────────────────────────────────── */
export default function PremiumCalculatorPage() {
  /* plan browser */
  const [activeCat, setActiveCat]     = useState('all')
  const [search, setSearch]           = useState('')
  const [selectedPlan, setSelectedPlan] = useState<any>(null)

  /* calculator inputs */
  const [age,    setAge]    = useState(30)
  const [sa,     setSa]     = useState(1000000)
  const [term,   setTerm]   = useState(20)
  const [mode,   setMode]   = useState<'yearly'|'halfyearly'|'quarterly'|'monthly'>('yearly')
  const [gender, setGender] = useState<'male'|'female'>('male')
  const [smoker, setSmoker] = useState(false)

  /* results */
  const [premResult,   setPremResult]   = useState<any>(null)
  const [matResult,    setMatResult]    = useState<any>(null)
  const [benefitTable, setBenefitTable] = useState<any[]>([])
  const [showTable,    setShowTable]    = useState(false)
  const [showAllRows,  setShowAllRows]  = useState(false)

  /* derived */
  const filteredPlans = useMemo(() => {
    const base = activeCat === 'all' ? PLANS as any[] : (PLANS as any[]).filter((p: any) => p.category === activeCat)
    if (!search.trim()) return base
    const q = search.toLowerCase()
    return base.filter((p: any) => p.name.toLowerCase().includes(q) || String(p.planNo).includes(q))
  }, [activeCat, search])

  const ppt = useMemo(() => {
    if (!selectedPlan) return term
    return getPPT(selectedPlan, term, age)
  }, [selectedPlan, term, age])

  const isTermPlan    = selectedPlan?.category === 'term'
  const isPensionPlan = selectedPlan?.category === 'pension'

  /* term constraints from selected plan */
  const minTerm = selectedPlan?.minTerm ?? 10
  const maxTerm = selectedPlan?.maxTerm ?? 35
  const safeterm = Math.max(minTerm, Math.min(term, maxTerm))

  function handleSelectPlan(plan: any) {
    setSelectedPlan(plan)
    setPremResult(null)
    setMatResult(null)
    setBenefitTable([])
    setShowTable(false)
    setShowAllRows(false)
    // Set reasonable defaults for the plan
    if (plan.minTerm) setTerm(Math.max(plan.minTerm, Math.min(term, plan.maxTerm ?? 35)))
  }

  function calculate() {
    if (!selectedPlan) return
    const prem = calculatePremium({ planNo: selectedPlan.planNo, sa, age, term: safeterm, ppt, mode, smoker, gender })
    const mat  = calculateMaturity({ planNo: selectedPlan.planNo, sa, term: safeterm })
    const table = generateBenefitTable({ planNo: selectedPlan.planNo, sa, age, term: safeterm, ppt, premResult: prem as any })
    setPremResult(prem)
    setMatResult(mat)
    setBenefitTable(table ?? [])
  }

  const xirr = useMemo(() => {
    if (!premResult || !matResult?.maturity || !safeterm) return null
    const val = ((Math.pow(matResult.maturity / premResult.totalPaid, 1 / safeterm) - 1) * 100)
    return val > 0 ? val.toFixed(1) : null
  }, [premResult, matResult, safeterm])

  const multiplier = useMemo(() => {
    if (!premResult || !matResult?.maturity) return null
    return (matResult.maturity / premResult.totalPaid).toFixed(2)
  }, [premResult, matResult])

  const tax80C = useMemo(() => {
    if (!premResult) return null
    return Math.min(premResult.netPremium, 150000) * 0.3
  }, [premResult])

  function whatsappShare() {
    if (!selectedPlan || !premResult) return
    const matLine = matResult?.maturity ? `Maturity Value: ${fmt(matResult.maturity)}\n` : 'Pure term plan (no maturity)\n'
    const msg = [
      `*LIC Premium Quote — Poddar Wealth*`,
      ``,
      `Plan: LIC's ${selectedPlan.name} (Plan ${selectedPlan.planNo})`,
      `Sum Assured: ${fmtSA(sa)}  |  Age: ${age} yrs  |  Term: ${safeterm} yrs`,
      ``,
      `Annual Premium (Yr 1): ${fmt(premResult.yearlyYear1)}`,
      `Monthly Instalment: ${fmt(premResult.instalment1)}`,
      `Total Paid: ${fmt(premResult.totalPaid)}`,
      matLine.trim(),
      xirr ? `Expected XIRR: ~${xirr}%` : '',
      ``,
      `Get exact quote from Ajay sir 👇`,
      `https://poddarwealth.com/contact`,
    ].filter(Boolean).join('\n')
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank')
  }

  /* visible table rows */
  const visibleRows = showAllRows ? benefitTable : benefitTable.slice(0, 10)

  return (
    <div className="min-h-screen bg-warm pt-[78px]">

      {/* ── Hero ─────────────────────────────── */}
      <div className="bg-navy py-10 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, #f5c842 0%, transparent 60%), radial-gradient(circle at 80% 50%, #f5c842 0%, transparent 60%)' }} />
        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-gold/10 border border-gold/20 text-gold px-4 py-1.5 rounded-full text-[11px] font-bold tracking-widest uppercase mb-4">
            <Calculator className="w-3.5 h-3.5" /> LIC Premium Calculator
          </div>
          <h1 className="font-display text-[28px] md:text-[40px] font-bold text-white leading-tight mb-3">
            Calculate Your <span className="text-gold">Exact LIC Premium</span>
          </h1>
          <p className="text-white/60 text-[14px] max-w-xl mx-auto">
            28 plans · real tabular rates · year-by-year benefit table · tax savings · instant WhatsApp share
          </p>
        </div>
      </div>

      {/* ── Main layout ──────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
        <div className="flex flex-col lg:flex-row gap-6">

          {/* ══ LEFT — Plan Browser ═══════════════ */}
          <div className="lg:w-[380px] lg:flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-sm border border-[rgba(184,134,11,0.1)] overflow-hidden lg:sticky lg:top-[86px]">

              {/* Category tabs */}
              <div className="p-3 border-b border-gray-50">
                <div className="flex flex-wrap gap-1.5">
                  {CATEGORIES.map(c => (
                    <button key={c.key} onClick={() => setActiveCat(c.key)}
                      className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all
                        ${activeCat === c.key
                          ? 'bg-navy text-white'
                          : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}>
                      {c.icon} {c.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Search */}
              <div className="px-3 pt-3 pb-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                  <input value={search} onChange={e => setSearch(e.target.value)}
                    placeholder="Search plan name or number…"
                    className="w-full pl-8 pr-3 py-2 text-[12px] border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:border-gold/40 focus:bg-white transition-all" />
                </div>
              </div>

              {/* Plan list */}
              <div className="overflow-y-auto max-h-[460px] px-2 pb-2">
                {filteredPlans.length === 0 ? (
                  <div className="py-8 text-center text-[12px] text-gray-400">No plans found</div>
                ) : filteredPlans.map((plan: any) => (
                  <button key={plan.planNo} onClick={() => handleSelectPlan(plan)}
                    className={`w-full text-left p-3 rounded-xl mb-1 transition-all border
                      ${selectedPlan?.planNo === plan.planNo
                        ? 'bg-gold/8 border-gold/30 shadow-sm'
                        : 'border-transparent hover:bg-gray-50 hover:border-gray-100'}`}>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className={`text-[11px] font-bold mb-1 ${selectedPlan?.planNo === plan.planNo ? 'text-gold' : 'text-gray-900'}`}>
                          LIC's {plan.name}
                        </div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[9px] text-gray-400 bg-gray-50 border border-gray-100 px-1.5 py-0.5 rounded font-medium">
                            Plan {plan.planNo}
                          </span>
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${CAT_BADGE[plan.category] ?? 'bg-gray-50 text-gray-600'}`}>
                            {plan.category}
                          </span>
                          {plan.xirr && (
                            <span className="text-[9px] text-green-600 font-semibold">{plan.xirr} XIRR</span>
                          )}
                        </div>
                      </div>
                      {selectedPlan?.planNo === plan.planNo && (
                        <CheckCircle2 className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ══ RIGHT — Calculator ════════════════ */}
          <div className="flex-1 min-w-0">

            {/* No plan selected placeholder */}
            {!selectedPlan && (
              <div className="bg-white rounded-2xl border border-dashed border-gray-200 h-64 flex flex-col items-center justify-center text-center p-8">
                <Calculator className="w-12 h-12 text-gray-200 mb-3" />
                <div className="font-display font-bold text-gray-400 text-[17px] mb-1">Select a plan to calculate</div>
                <div className="text-[12px] text-gray-300">Choose any LIC plan from the list on the left</div>
              </div>
            )}

            {selectedPlan && (
              <div className="space-y-4">

                {/* Plan banner */}
                <div className="bg-navy rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded mb-2 ${CAT_BADGE[selectedPlan.category] ?? ''}`}>
                      {selectedPlan.category?.toUpperCase()}
                    </div>
                    <div className="text-white font-display font-bold text-[20px] leading-tight">
                      LIC's {selectedPlan.name}
                      <span className="text-white/40 font-sans text-[12px] ml-2 font-normal">Plan {selectedPlan.planNo}</span>
                    </div>
                    <div className="text-white/60 text-[12px] mt-1 max-w-lg">{selectedPlan.desc}</div>
                  </div>
                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    {selectedPlan.xirr && (
                      <div className="bg-gold/10 border border-gold/20 text-gold text-[11px] font-bold px-3 py-1 rounded-full">
                        {selectedPlan.xirr} expected XIRR
                      </div>
                    )}
                    <div className="text-[10px] text-white/30 font-medium">
                      Entry age {selectedPlan.minAge}–{selectedPlan.maxAge} yrs
                    </div>
                  </div>
                </div>

                {/* Inputs */}
                <div className="bg-white rounded-2xl shadow-sm border border-[rgba(184,134,11,0.08)] p-5">
                  <h2 className="font-display font-bold text-[16px] text-navy mb-5">Enter Your Details</h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Age */}
                    <div>
                      <label className="block text-[12px] font-semibold text-gray-600 mb-1.5">
                        Your Age: <span className="text-gold">{age} years</span>
                      </label>
                      <input type="range" min={selectedPlan.minAge ?? 18} max={selectedPlan.maxAge ?? 65}
                        value={age} onChange={e => setAge(+e.target.value)}
                        className="w-full accent-[#b8860b] h-1.5 rounded-full" />
                      <div className="flex justify-between text-[10px] text-gray-300 mt-0.5">
                        <span>{selectedPlan.minAge ?? 18}</span><span>{selectedPlan.maxAge ?? 65}</span>
                      </div>
                    </div>

                    {/* Policy term */}
                    <div>
                      <label className="block text-[12px] font-semibold text-gray-600 mb-1.5">
                        Policy Term: <span className="text-gold">{safeterm} years</span>
                        {ppt !== safeterm && <span className="text-gray-400 ml-1">(PPT: {ppt} yrs)</span>}
                      </label>
                      <input type="range" min={minTerm} max={maxTerm}
                        value={safeterm} onChange={e => setTerm(+e.target.value)}
                        className="w-full accent-[#b8860b] h-1.5 rounded-full" />
                      <div className="flex justify-between text-[10px] text-gray-300 mt-0.5">
                        <span>{minTerm} yrs</span><span>{maxTerm} yrs</span>
                      </div>
                    </div>

                    {/* Sum Assured */}
                    <div className="sm:col-span-2">
                      <label className="block text-[12px] font-semibold text-gray-600 mb-1.5">
                        Sum Assured: <span className="text-gold">{fmtSA(sa)}</span>
                        {selectedPlan.minSA > sa && <span className="text-red-400 text-[10px] ml-1">(min {fmtSA(selectedPlan.minSA)})</span>}
                      </label>
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        {SA_PRESETS.map(v => (
                          <button key={v} onClick={() => setSa(v)}
                            className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border transition-all
                              ${sa === v ? 'bg-gold text-white border-gold' : 'bg-gray-50 text-gray-500 border-gray-100 hover:border-gold/30'}`}>
                            {fmtSA(v)}
                          </button>
                        ))}
                      </div>
                      <input type="range" min={selectedPlan.minSA ?? 100000} max={10000000} step={100000}
                        value={sa} onChange={e => setSa(+e.target.value)}
                        className="w-full accent-[#b8860b] h-1.5 rounded-full" />
                    </div>

                    {/* Mode */}
                    <div>
                      <label className="block text-[12px] font-semibold text-gray-600 mb-1.5">Premium Mode</label>
                      <div className="grid grid-cols-4 gap-1">
                        {(['yearly','halfyearly','quarterly','monthly'] as const).map(m => (
                          <button key={m} onClick={() => setMode(m)}
                            className={`text-[10px] font-bold py-1.5 rounded-lg border transition-all
                              ${mode === m ? 'bg-navy text-white border-navy' : 'bg-gray-50 text-gray-500 border-gray-100 hover:border-navy/20'}`}>
                            {m === 'halfyearly' ? 'Half-yr' : m.charAt(0).toUpperCase() + m.slice(1)}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Gender + Smoker */}
                    <div>
                      <label className="block text-[12px] font-semibold text-gray-600 mb-1.5">Gender</label>
                      <div className="flex gap-2">
                        {(['male','female'] as const).map(g => (
                          <button key={g} onClick={() => setGender(g)}
                            className={`flex-1 text-[11px] font-bold py-1.5 rounded-lg border transition-all
                              ${gender === g ? 'bg-navy text-white border-navy' : 'bg-gray-50 text-gray-500 border-gray-100'}`}>
                            {g === 'male' ? '♂ Male' : '♀ Female'}
                          </button>
                        ))}
                      </div>
                      {isTermPlan && (
                        <button onClick={() => setSmoker(s => !s)}
                          className={`mt-2 w-full text-[11px] font-bold py-1.5 rounded-lg border transition-all
                            ${smoker ? 'bg-red-50 text-red-600 border-red-200' : 'bg-gray-50 text-gray-500 border-gray-100'}`}>
                          🚬 Smoker {smoker ? '(+25% surcharge)' : '(click if applicable)'}
                        </button>
                      )}
                    </div>
                  </div>

                  <button onClick={calculate}
                    className="mt-5 w-full bg-gold hover:bg-gold-hover text-white font-bold py-3.5 rounded-xl transition-all text-[14px] flex items-center justify-center gap-2 shadow-md">
                    <Calculator className="w-4 h-4" /> Calculate Premium
                  </button>
                </div>

                {/* ── RESULTS ── */}
                {premResult && (
                  <>
                    {/* 4 metric cards */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {[
                        { label: 'Year 1 Annual',   value: fmt(premResult.yearlyYear1),    sub: 'incl. 4.5% GST',    color: 'text-navy' },
                        { label: 'Monthly Instal.', value: fmt(premResult.instalment1),    sub: `${mode} mode`,      color: 'text-navy' },
                        { label: 'Total Paid',      value: fmt(premResult.totalPaid),      sub: `over ${ppt} years`, color: 'text-gray-700' },
                        isTermPlan
                          ? { label: 'Life Cover',     value: fmtSA(sa),                      sub: 'death benefit',     color: 'text-red-600' }
                          : { label: 'Maturity Value', value: matResult?.maturity ? fmt(matResult.maturity) : '—', sub: 'estimated', color: 'text-green-700' },
                      ].map(({ label, value, sub, color }) => (
                        <div key={label} className="bg-white rounded-2xl p-4 border border-[rgba(184,134,11,0.08)] shadow-sm">
                          <div className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider mb-1">{label}</div>
                          <div className={`font-display font-bold text-[18px] ${color}`}>{value}</div>
                          <div className="text-[10px] text-gray-300 mt-0.5">{sub}</div>
                        </div>
                      ))}
                    </div>

                    {/* Progress bar — paid vs maturity */}
                    {!isTermPlan && matResult?.maturity > 0 && (
                      <div className="bg-white rounded-2xl p-5 border border-[rgba(184,134,11,0.08)] shadow-sm">
                        <div className="flex justify-between items-end mb-3">
                          <div>
                            <div className="text-[11px] text-gray-400 font-semibold uppercase tracking-wider mb-0.5">Money at Work</div>
                            <div className="text-[13px] text-gray-600">
                              You invest <span className="font-bold text-navy">{fmt(premResult.totalPaid)}</span>
                              {' '}and receive <span className="font-bold text-green-700">{fmt(matResult.maturity)}</span>
                            </div>
                          </div>
                          {multiplier && (
                            <div className="text-right">
                              <div className="text-[11px] text-gray-400">Multiplier</div>
                              <div className="font-display font-bold text-[22px] text-gold">{multiplier}×</div>
                            </div>
                          )}
                        </div>
                        <div className="h-5 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-navy to-blue-600 rounded-full"
                            style={{ width: `${Math.min((premResult.totalPaid / matResult.maturity) * 100, 100)}%` }} />
                        </div>
                        <div className="flex justify-between text-[10px] mt-1">
                          <span className="text-navy font-semibold">Total Paid: {fmt(premResult.totalPaid)}</span>
                          <span className="text-green-700 font-semibold">Maturity: {fmt(matResult.maturity)}</span>
                        </div>
                        {xirr && (
                          <div className="mt-3 inline-flex items-center gap-1.5 bg-green-50 border border-green-100 text-green-700 px-3 py-1.5 rounded-full text-[11px] font-bold">
                            <TrendingUp className="w-3 h-3" /> Expected XIRR: ~{xirr}% p.a.
                          </div>
                        )}
                      </div>
                    )}

                    {/* Premium breakdown table */}
                    <div className="bg-white rounded-2xl border border-[rgba(184,134,11,0.08)] shadow-sm overflow-hidden">
                      <div className="px-5 py-3.5 border-b border-gray-50">
                        <div className="font-bold text-[13px] text-navy">Premium Breakdown</div>
                      </div>
                      <div className="divide-y divide-gray-50">
                        {[
                          { label: 'Tabular Rate',         value: `₹/1000 SA`,                   note: 'per LIC table',         bold: false },
                          { label: 'Base Premium',         value: fmt(premResult.basePremium),    note: '',                      bold: false },
                          { label: 'Mode Rebate',          value: `− ${fmt(premResult.modeRebate)}`, note: `${premResult.modeRebatePct}% for ${mode}`, bold: false },
                          { label: 'SA Rebate',            value: `− ${fmt(premResult.saRebate)}`, note: `₹${premResult.saRebatePer1000}/1000 SA`,    bold: false },
                          { label: 'Net Premium',          value: fmt(premResult.netPremium),     note: '',                      bold: true  },
                          { label: `GST Yr 1 (${premResult.gstPctYear1}%)`, value: fmt(premResult.gstYear1), note: '', bold: false },
                          { label: 'Final Premium Yr 1',  value: fmt(premResult.yearlyYear1),    note: 'annual',                bold: true  },
                          { label: `GST Yr 2+ (${premResult.gstPctYear2}%)`, value: fmt(premResult.gstYear2), note: '', bold: false },
                          { label: 'Final Premium Yr 2+', value: fmt(premResult.yearlyYear2plus), note: 'annual',               bold: true  },
                        ].map(row => (
                          <div key={row.label} className="flex justify-between items-center px-5 py-2.5">
                            <div>
                              <span className={`text-[12px] ${row.bold ? 'font-bold text-navy' : 'text-gray-500'}`}>{row.label}</span>
                              {row.note && <span className="text-[10px] text-gray-300 ml-2">{row.note}</span>}
                            </div>
                            <span className={`text-[13px] ${row.bold ? 'font-bold text-navy' : 'text-gray-600'} ${row.value.startsWith('−') ? 'text-green-600' : ''}`}>
                              {row.value}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Tax benefits + Key insights */}
                    <div className="grid sm:grid-cols-2 gap-4">

                      {/* Tax benefits */}
                      <div className="bg-white rounded-2xl p-5 border border-[rgba(184,134,11,0.08)] shadow-sm">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-7 h-7 rounded-lg bg-green-50 flex items-center justify-center">
                            <CheckCircle2 className="w-4 h-4 text-green-600" />
                          </div>
                          <div className="font-bold text-[13px] text-navy">Tax Benefits</div>
                        </div>
                        <div className="space-y-2.5">
                          <div className="flex justify-between">
                            <div>
                              <div className="text-[12px] font-semibold text-gray-700">Section 80C Deduction</div>
                              <div className="text-[10px] text-gray-400">Up to ₹1.5L from taxable income</div>
                            </div>
                            <div className="text-[13px] font-bold text-green-700">
                              {tax80C ? `Save ~${fmt(tax80C)}` : '—'}
                            </div>
                          </div>
                          <div className="flex justify-between">
                            <div>
                              <div className="text-[12px] font-semibold text-gray-700">Section 10(10D) Maturity</div>
                              <div className="text-[10px] text-gray-400">Maturity proceeds tax-free*</div>
                            </div>
                            <div className="text-[13px] font-bold text-green-700">Tax Free</div>
                          </div>
                          <div className="text-[10px] text-gray-300 mt-1">* Subject to conditions. Consult a tax advisor.</div>
                        </div>
                      </div>

                      {/* Riders */}
                      <div className="bg-white rounded-2xl p-5 border border-[rgba(184,134,11,0.08)] shadow-sm">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center">
                            <Shield className="w-4 h-4 text-blue-600" />
                          </div>
                          <div className="font-bold text-[13px] text-navy">Available Riders</div>
                        </div>
                        {selectedPlan.riders?.length ? (
                          <div className="space-y-1.5">
                            {selectedPlan.riders.map((rId: string) => {
                              const r = (RIDERS as any)[rId]
                              if (!r) return null
                              return (
                                <div key={rId} className="flex items-start gap-2">
                                  <span className="text-gold text-[12px] mt-0.5">+</span>
                                  <div>
                                    <div className="text-[11px] font-semibold text-gray-700">{r.name}</div>
                                    <div className="text-[10px] text-gray-400 leading-relaxed">{r.desc}</div>
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        ) : (
                          <div className="text-[12px] text-gray-400">No riders available for this plan.</div>
                        )}
                      </div>
                    </div>

                    {/* Key insights */}
                    {!isTermPlan && (
                      <div className="bg-gold/5 border border-gold/15 rounded-2xl p-5">
                        <div className="flex items-center gap-2 mb-3">
                          <Star className="w-4 h-4 text-gold" />
                          <div className="font-bold text-[13px] text-gold">Key Insights</div>
                        </div>
                        <div className="grid sm:grid-cols-3 gap-3">
                          {[
                            { label: 'Expected XIRR',    value: xirr ? `~${xirr}% p.a.` : selectedPlan.xirr ?? '—' },
                            { label: 'Money Multiplier', value: multiplier ? `${multiplier}×` : '—' },
                            { label: 'Bonus Earned',     value: matResult?.totalBonus ? fmt(matResult.totalBonus) : '—' },
                          ].map(({ label, value }) => (
                            <div key={label} className="bg-white rounded-xl p-3 border border-gold/10">
                              <div className="text-[10px] text-gray-400 mb-0.5">{label}</div>
                              <div className="font-display font-bold text-[18px] text-navy">{value}</div>
                            </div>
                          ))}
                        </div>
                        <div className="mt-3 text-[11px] text-gray-500 leading-relaxed">
                          Based on LIC declared bonus rates (2026). Past bonus performance is not a guarantee of future rates.
                          Actual XIRR depends on bonus declarations each year.
                        </div>
                      </div>
                    )}

                    {/* Year-by-year benefit table */}
                    {benefitTable.length > 0 && (
                      <div className="bg-white rounded-2xl border border-[rgba(184,134,11,0.08)] shadow-sm overflow-hidden">
                        <button onClick={() => setShowTable(v => !v)}
                          className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors">
                          <div className="font-bold text-[13px] text-navy flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-gold" />
                            Year-by-Year Benefit Table
                            <span className="text-[10px] text-gray-400 font-normal">({benefitTable.length} years)</span>
                          </div>
                          {showTable ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                        </button>
                        {showTable && (
                          <>
                            <div className="overflow-x-auto">
                              <table className="w-full">
                                <thead>
                                  <tr className="bg-navy text-white text-[10px]">
                                    {['Year','Age','Premium','Cum. Paid','SA','Annual Bonus','Cum. Bonus','Death Benefit','Surrender Val.','Survival / Maturity'].map(h => (
                                      <th key={h} className="px-3 py-2.5 text-left font-bold whitespace-nowrap">{h}</th>
                                    ))}
                                  </tr>
                                </thead>
                                <tbody className="text-[11px]">
                                  {visibleRows.map((row: any, i: number) => (
                                    <tr key={row.year}
                                      className={`${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/60'}
                                        ${row.maturityPayout ? 'bg-green-50' : ''}
                                        ${row.survivalPayout ? 'bg-amber-50/60' : ''}`}>
                                      <td className="px-3 py-2 font-bold text-gold">{row.year}</td>
                                      <td className="px-3 py-2 text-gray-500">{row.age}</td>
                                      <td className="px-3 py-2">{row.premiumPaid ? fmt(row.premiumPaid) : '—'}</td>
                                      <td className="px-3 py-2 font-semibold">{fmt(row.cumPremiumPaid)}</td>
                                      <td className="px-3 py-2">{fmtSA(sa)}</td>
                                      <td className="px-3 py-2 text-blue-600">{row.annualBonus ? fmt(row.annualBonus) : '—'}</td>
                                      <td className="px-3 py-2 text-blue-700 font-semibold">{row.cumBonus ? fmt(row.cumBonus) : '—'}</td>
                                      <td className="px-3 py-2 font-bold text-red-600">{fmt(row.deathBenefit)}</td>
                                      <td className="px-3 py-2 text-amber-600">{row.gsv ? fmt(row.gsv) : '—'}</td>
                                      <td className="px-3 py-2 font-bold text-green-700">
                                        {row.maturityPayout ? `🎉 ${fmt(row.maturityPayout)}` : row.survivalPayout ? `💰 ${fmt(row.survivalPayout)}` : '—'}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                            {benefitTable.length > 10 && (
                              <button onClick={() => setShowAllRows(v => !v)}
                                className="w-full py-2.5 text-[11px] font-bold text-gold hover:text-gold-hover border-t border-gray-50 hover:bg-gray-50 transition-colors">
                                {showAllRows ? `Show less ↑` : `Show all ${benefitTable.length} years ↓`}
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    )}

                    {/* CTAs */}
                    <div className="flex flex-col sm:flex-row gap-3">
                      <button
                        onClick={() => window.dispatchEvent(new CustomEvent('open-lead-popup', {
                          detail: { intent: `Premium quote: LIC's ${selectedPlan.name} (Plan ${selectedPlan.planNo}), ${fmtSA(sa)} SA, Age ${age}` }
                        }))}
                        className="flex-1 bg-gold hover:bg-gold-hover text-white font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-md text-[13px]">
                        Get Exact Quote from Ajay Sir <ArrowRight className="w-4 h-4" />
                      </button>
                      <button onClick={whatsappShare}
                        className="sm:w-auto bg-green-500 hover:bg-green-600 text-white font-bold py-3.5 px-6 rounded-xl transition-all flex items-center justify-center gap-2 text-[13px]">
                        <Share2 className="w-4 h-4" /> WhatsApp
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 pb-10">
        <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 flex items-start gap-3">
          <Info className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
          <p className="text-[11px] text-amber-700 leading-relaxed">
            <strong>Disclaimer:</strong> Premium calculations are illustrative based on LIC tabular rates and are not official LIC quotes.
            Bonus rates (SRB/FAB) are based on 2026 historical declarations and are not guaranteed for future years.
            Actual premiums depend on LIC underwriting rules, medical examination results, and current circulars.
            Tax benefits are subject to applicable Income Tax provisions.
            {' '}<Link href="/contact" className="underline font-semibold">Contact Ajay Kumar Poddar for an official LIC quote.</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
