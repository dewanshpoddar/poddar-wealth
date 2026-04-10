'use client'
import { useState, useMemo } from 'react'
import Link from 'next/link'
import {
  Calculator, ArrowRight, ChevronDown, ChevronUp,
  Share2, CheckCircle2, Info, Search, Shield, TrendingUp, Star
} from 'lucide-react'
import { PLANS, calculatePremium, calculateMaturity, generateBenefitTable, getPPT, RIDERS } from '@/lib/lic-plans-data.js'
import { fmt, fmtSA, toWords } from '@/lib/format'
import { SA_PRESETS, MODE_LABEL } from '@/lib/constants'
import { openLeadPopup } from '@/lib/events'

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

const CAT_AVATAR_COLOR: Record<string, string> = {
  endowment: 'bg-blue-600',
  moneyback: 'bg-green-600',
  wholelife: 'bg-purple-600',
  term:      'bg-red-600',
  child:     'bg-amber-600',
  pension:   'bg-indigo-600',
  ulip:      'bg-teal-600',
}


/* ─── page ────────────────────────────────── */
export default function PremiumCalculatorPage() {
  /* plan browser */
  const [activeCat,     setActiveCat]     = useState('all')
  const [search,        setSearch]        = useState('')
  const [quickPlanNo,   setQuickPlanNo]   = useState('')
  const [quickAge,      setQuickAge]      = useState('')
  const [selectedPlan,  setSelectedPlan]  = useState<any>(null)

  /* client identity */
  const [clientName,  setClientName]  = useState('')
  const [salutation,  setSalutation]  = useState<'Mr.'|'Mrs.'|'Ms.'>('Mr.')

  /* calculator inputs */
  const [age,    setAge]    = useState(30)
  const [sa,     setSa]     = useState(1000000)
  const [term,   setTerm]   = useState(20)
  const [mode,   setMode]   = useState<'yearly'|'halfyearly'|'quarterly'|'monthly'>('yearly')
  const [gender, setGender] = useState<'male'|'female'>('male')
  const [smoker, setSmoker] = useState(false)

  /* results */
  const [premResult,     setPremResult]     = useState<any>(null)
  const [matResult,      setMatResult]      = useState<any>(null)
  const [benefitTable,   setBenefitTable]   = useState<any[]>([])
  const [showTable,      setShowTable]      = useState(false)
  const [showAllRows,    setShowAllRows]    = useState(false)
  const [showAllModes,   setShowAllModes]   = useState(false)

  /* unlock / lead capture */
  const [isUnlocked,   setIsUnlocked]   = useState(false)
  const [unlockMobile, setUnlockMobile] = useState('')
  const [unlockEmail,  setUnlockEmail]  = useState('')
  const [unlockWantTo, setUnlockWantTo] = useState('')
  const [unlockIAm,    setUnlockIAm]    = useState('')
  const [unlockStatus, setUnlockStatus] = useState<'idle'|'sending'|'done'>('idle')

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

  const isTermPlan = selectedPlan?.category === 'term'

  const minTerm = selectedPlan?.minTerm ?? 10
  const maxTerm = selectedPlan?.maxTerm ?? 35
  const safeterm = Math.max(minTerm, Math.min(term, maxTerm))

  /* all modes premium for "Show Full Premium Chart" */
  const allModesPrem = useMemo(() => {
    if (!selectedPlan || !premResult) return null
    return (['yearly', 'halfyearly', 'quarterly', 'monthly'] as const).map(m => {
      const p = calculatePremium({ planNo: selectedPlan.planNo, sa, age, term: safeterm, ppt, mode: m, smoker, gender }) as any
      if (!p) return null
      const perDay = m === 'yearly' ? Math.round(p.yearlyYear1 / 365) : null
      return { mode: m, prem: p, perDay }
    }).filter(Boolean) as { mode: string, prem: any, perDay: number | null }[]
  }, [selectedPlan, premResult, sa, age, safeterm, ppt, smoker, gender])

  function handleSelectPlan(plan: any) {
    setSelectedPlan(plan)
    setPremResult(null)
    setMatResult(null)
    setBenefitTable([])
    setShowTable(false)
    setShowAllRows(false)
    setIsUnlocked(false)
    setUnlockStatus('idle')
    if (plan.minTerm) setTerm(Math.max(plan.minTerm, Math.min(term, plan.maxTerm ?? 35)))
  }

  function handleQuickSelect() {
    const pno = parseInt(quickPlanNo)
    const plan = (PLANS as any[]).find((p: any) => p.planNo === pno)
    if (plan) {
      handleSelectPlan(plan)
      if (quickAge) setAge(Math.max(plan.minAge ?? 18, Math.min(parseInt(quickAge), plan.maxAge ?? 65)))
    }
  }

  function calculate() {
    if (!selectedPlan) return
    const prem = calculatePremium({ planNo: selectedPlan.planNo, sa, age, term: safeterm, ppt, mode, smoker, gender })
    const mat  = calculateMaturity({ planNo: selectedPlan.planNo, sa, term: safeterm })
    const table = generateBenefitTable({ planNo: selectedPlan.planNo, sa, age, term: safeterm, ppt, premResult: prem as any })
    setPremResult(prem)
    setMatResult(mat)
    setBenefitTable(table ?? [])
    setIsUnlocked(false)
    setUnlockStatus('idle')
  }

  async function handleUnlock(e: React.FormEvent) {
    e.preventDefault()
    setUnlockStatus('sending')
    try {
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: clientName ? `${salutation} ${clientName}` : 'Calculator User',
          mobile: unlockMobile,
          email: unlockEmail,
          wantTo: unlockWantTo,
          iAm: unlockIAm,
          intent: `Premium calc unlock: LIC's ${selectedPlan?.name} (Plan ${selectedPlan?.planNo}), ${fmtSA(sa)} SA, Age ${age}`
        })
      })
    } catch {}
    setIsUnlocked(true)
    setUnlockStatus('done')
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
    const name = clientName ? `${salutation} ${clientName}` : 'Customer'
    const matLine = matResult?.maturity ? `Maturity Value: ${fmt(matResult.maturity)}` : 'Pure Term Plan'
    const msg = [
      `*LIC Premium Illustration — Poddar Wealth*`,
      ``,
      `For: ${name} | Age: ${age} yrs`,
      `Plan: LIC's ${selectedPlan.name} (Plan ${selectedPlan.planNo})`,
      `Sum Assured: ${fmtSA(sa)} | Term: ${safeterm} yrs | PPT: ${ppt} yrs`,
      ``,
      `*1st Year Premium (incl. GST):*`,
      `Yearly: ${fmt(premResult.yearlyYear1)}  (${fmt(Math.round(premResult.yearlyYear1/365))}/day)`,
      `Half-Yearly: ${fmt(premResult.instalment1 * 2)}`,
      `Quarterly: ${fmt(premResult.instalment1 * 4 / (mode === 'quarterly' ? 1 : 1))}`,
      `Monthly: ${fmt(premResult.instalment1)}`,
      ``,
      `Total Paid: ${fmt(premResult.totalPaid)}`,
      matLine,
      xirr ? `Expected XIRR: ~${xirr}% p.a.` : '',
      ``,
      `📞 Contact Ajay Kumar Poddar for official quote`,
      `https://poddarwealth.com/contact`,
    ].filter(Boolean).join('\n')
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank')
  }

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
            28 plans · real tabular rates · year-by-year benefit table · tax savings · WhatsApp share
          </p>
        </div>
      </div>

      {/* ── Main layout ──────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
        <div className="flex flex-col lg:flex-row gap-6">

          {/* ══ LEFT — Plan Browser ═══════════════ */}
          <div className="lg:w-[360px] lg:flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-sm border border-[rgba(184,134,11,0.1)] overflow-hidden lg:sticky lg:top-[86px]">

              {/* Quick Selector — like the competitor app */}
              <div className="bg-navy px-4 py-3">
                <div className="text-[10px] font-bold text-white/50 uppercase tracking-widest mb-2">Quick Selector</div>
                <div className="flex gap-2">
                  <input type="number" placeholder="Plan No" value={quickPlanNo}
                    onChange={e => setQuickPlanNo(e.target.value)}
                    className="flex-1 px-3 py-2 text-[12px] bg-white/10 border border-white/20 text-white placeholder-white/30 rounded-lg focus:outline-none focus:bg-white/15" />
                  <input type="number" placeholder="Age" value={quickAge}
                    onChange={e => setQuickAge(e.target.value)}
                    className="w-20 px-3 py-2 text-[12px] bg-white/10 border border-white/20 text-white placeholder-white/30 rounded-lg focus:outline-none focus:bg-white/15" />
                  <button onClick={handleQuickSelect}
                    className="px-3 py-2 bg-gold text-white text-[11px] font-bold rounded-lg hover:bg-gold-hover transition-colors">
                    Go
                  </button>
                </div>
              </div>

              {/* Category tabs */}
              <div className="p-3 border-b border-gray-50">
                <div className="flex flex-wrap gap-1.5">
                  {CATEGORIES.map(c => (
                    <button key={c.key} onClick={() => setActiveCat(c.key)}
                      className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all
                        ${activeCat === c.key ? 'bg-navy text-white' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}>
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

              {/* Plan list with letter-avatar circles */}
              <div className="overflow-y-auto max-h-[420px] px-2 pb-2">
                {filteredPlans.length === 0 ? (
                  <div className="py-8 text-center text-[12px] text-gray-400">No plans found</div>
                ) : filteredPlans.map((plan: any) => {
                  const isSelected = selectedPlan?.planNo === plan.planNo
                  const avatarColor = CAT_AVATAR_COLOR[plan.category] ?? 'bg-navy'
                  return (
                    <button key={plan.planNo} onClick={() => handleSelectPlan(plan)}
                      className={`w-full text-left px-3 py-2.5 rounded-xl mb-1 transition-all border flex items-center gap-3
                        ${isSelected ? 'bg-gold/8 border-gold/30 shadow-sm' : 'border-transparent hover:bg-gray-50 hover:border-gray-100'}`}>
                      {/* Avatar circle with first letter */}
                      <div className={`w-9 h-9 rounded-full ${avatarColor} ring-2 ring-gold/30 flex items-center justify-center flex-shrink-0`}>
                        <span className="text-white font-bold text-[13px]">{plan.name.charAt(0)}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className={`text-[12px] font-bold truncate ${isSelected ? 'text-gold' : 'text-gray-800'}`}>
                          {plan.name}
                        </div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-[10px] text-gray-400 font-medium">Plan {plan.planNo}</span>
                          {plan.xirr && <span className="text-[10px] text-green-600 font-semibold">· {plan.xirr}</span>}
                        </div>
                      </div>
                      <ChevronDown className={`w-3.5 h-3.5 flex-shrink-0 -rotate-90 ${isSelected ? 'text-gold' : 'text-gray-300'}`} />
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* ══ RIGHT — Calculator ════════════════ */}
          <div className="flex-1 min-w-0 space-y-4">

            {/* No plan selected */}
            {!selectedPlan && (
              <div className="bg-white rounded-2xl border border-dashed border-gray-200 h-64 flex flex-col items-center justify-center text-center p-8">
                <Calculator className="w-12 h-12 text-gray-200 mb-3" />
                <div className="font-display font-bold text-gray-400 text-[17px] mb-1">Select a plan to calculate</div>
                <div className="text-[12px] text-gray-300">Choose any LIC plan from the list · or use Quick Selector above</div>
              </div>
            )}

            {selectedPlan && (
              <>
                {/* Plan banner */}
                <div className="bg-navy rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-full ${CAT_AVATAR_COLOR[selectedPlan.category] ?? 'bg-navy-light'} ring-2 ring-gold/30 flex items-center justify-center flex-shrink-0`}>
                      <span className="text-white font-bold text-[18px]">{selectedPlan.name.charAt(0)}</span>
                    </div>
                    <div>
                      <div className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded mb-1 ${CAT_BADGE[selectedPlan.category] ?? ''}`}>
                        {selectedPlan.category?.toUpperCase()}
                      </div>
                      <div className="text-white font-display font-bold text-[18px] leading-tight">
                        LIC&apos;s {selectedPlan.name}
                        <span className="text-white/40 font-sans text-[11px] ml-2 font-normal">Plan {selectedPlan.planNo}</span>
                      </div>
                      <div className="text-white/50 text-[11px] mt-0.5">
                        Entry Age: {selectedPlan.minAge}–{selectedPlan.maxAge} yrs · Min SA: {fmtSA(selectedPlan.minSA)}
                      </div>
                    </div>
                  </div>
                  {selectedPlan.xirr && (
                    <div className="bg-gold/10 border border-gold/20 text-gold text-[11px] font-bold px-3 py-1.5 rounded-full whitespace-nowrap">
                      {selectedPlan.xirr} expected XIRR
                    </div>
                  )}
                </div>

                {/* Input form */}
                <div className="bg-white rounded-2xl shadow-sm border border-[rgba(184,134,11,0.08)] p-5 space-y-5">
                  <h2 className="font-display font-bold text-[16px] text-navy">Enter Details</h2>

                  {/* Name + Salutation */}
                  <div className="pb-4 border-b border-gray-50">
                    <label className="block text-[12px] font-semibold text-gray-600 mb-2">
                      Client Name <span className="text-gray-300 font-normal">(personalises report)</span>
                    </label>
                    <div className="flex gap-2">
                      <div className="flex gap-1">
                        {(['Mr.', 'Mrs.', 'Ms.'] as const).map(s => (
                          <button key={s} onClick={() => setSalutation(s)}
                            className={`px-3 py-2 text-[11px] font-bold rounded-lg border transition-all
                              ${salutation === s ? 'bg-navy text-white border-navy' : 'bg-gray-50 text-gray-500 border-gray-100 hover:border-navy/20'}`}>
                            {s}
                          </button>
                        ))}
                      </div>
                      <input type="text" placeholder="e.g. Rajesh Kumar" value={clientName}
                        onChange={e => setClientName(e.target.value)}
                        className="flex-1 px-3 py-2 text-[13px] border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:border-gold/40 focus:bg-white transition-all" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Age */}
                    <div>
                      <label className="block text-[12px] font-semibold text-gray-600 mb-1.5">
                        Age: <span className="text-gold">{age} years</span>
                      </label>
                      <input type="range" min={selectedPlan.minAge ?? 18} max={selectedPlan.maxAge ?? 65}
                        value={age} onChange={e => setAge(+e.target.value)}
                        className="w-full accent-[#b8860b] h-1.5 rounded-full" />
                      <div className="flex justify-between text-[10px] text-gray-300 mt-0.5">
                        <span>{selectedPlan.minAge ?? 18}</span><span>{selectedPlan.maxAge ?? 65}</span>
                      </div>
                    </div>

                    {/* Term + PPT auto-display */}
                    <div>
                      <label className="block text-[12px] font-semibold text-gray-600 mb-1.5">
                        Term: <span className="text-gold">{safeterm} years</span>
                      </label>
                      <input type="range" min={minTerm} max={maxTerm}
                        value={safeterm} onChange={e => setTerm(+e.target.value)}
                        className="w-full accent-[#b8860b] h-1.5 rounded-full" />
                      <div className="flex justify-between text-[10px] mt-0.5">
                        <span className="text-gray-300">{minTerm} yrs</span>
                        {/* PPT shown prominently like competitor */}
                        <span className="text-amber-600 font-semibold">PPT: {ppt} Years</span>
                        <span className="text-gray-300">{maxTerm} yrs</span>
                      </div>
                    </div>

                    {/* Sum Assured with word form */}
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
                      {/* Word form — like "( Ten Lakh )" in competitor */}
                      <div className="text-center text-[12px] text-gold font-semibold mt-1.5">
                        ( {toWords(sa)} )
                      </div>
                    </div>

                    {/* Mode */}
                    <div>
                      <label className="block text-[12px] font-semibold text-gray-600 mb-1.5">Premium Mode</label>
                      <div className="grid grid-cols-4 gap-1">
                        {(['yearly','halfyearly','quarterly','monthly'] as const).map(m => (
                          <button key={m} onClick={() => setMode(m)}
                            className={`text-[11px] font-bold py-2 rounded-lg border transition-all
                              ${mode === m ? 'bg-navy text-white border-navy' : 'bg-gray-50 text-gray-500 border-gray-100 hover:border-navy/20'}`}>
                            {MODE_LABEL[m]}
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
                            className={`flex-1 text-[11px] font-bold py-2 rounded-lg border transition-all
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
                    className="w-full bg-gold hover:bg-gold-hover text-white font-bold py-3.5 rounded-xl transition-all text-[14px] flex items-center justify-center gap-2 shadow-md">
                    <Calculator className="w-4 h-4" /> Calculate Premium
                  </button>
                </div>

                {/* ── RESULTS ── */}
                {premResult && (
                  <div className="space-y-4">

                    {/* Personalized profile header */}
                    <div className="bg-[#f5f0e8] border border-gold/20 rounded-2xl px-5 py-4 flex items-center gap-4">
                      <div className={`w-14 h-14 rounded-full ${CAT_AVATAR_COLOR[selectedPlan.category] ?? 'bg-navy'} ring-2 ring-gold/40 flex items-center justify-center flex-shrink-0 shadow`}>
                        <span className="text-white font-bold text-[20px]">
                          {clientName ? clientName.charAt(0).toUpperCase() : salutation.charAt(0)}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="font-bold text-[15px] text-navy">
                          {clientName ? `${salutation} ${clientName}` : `${salutation} Client`}
                        </div>
                        <div className="text-[11px] text-gray-500 mt-0.5">Age: {age} years</div>
                      </div>
                      <div className="text-right">
                        <div className="font-display font-bold text-[13px] text-navy">
                          LIC&apos;s {selectedPlan.name} ({selectedPlan.planNo}-{safeterm}-{ppt})
                        </div>
                        <div className="text-[11px] text-gray-400">Premium And Benefit Illustration</div>
                      </div>
                    </div>

                    {/* Plan Details summary table */}
                    <div className="bg-white rounded-2xl border border-[rgba(184,134,11,0.08)] shadow-sm overflow-hidden">
                      <div className="bg-navy px-5 py-2.5">
                        <span className="text-white font-bold text-[12px]">Plan Details</span>
                      </div>
                      <div className="divide-y divide-gray-50">
                        {[
                          { icon: '🛡️', label: 'Sum Assured', value: `₹ ${sa.toLocaleString('en-IN')}` },
                          { icon: '⏱️', label: 'Term',         value: `${safeterm} Years.` },
                          { icon: '💳', label: 'Premium Payment', value: `${ppt} Years.` },
                        ].map(({ icon, label, value }) => (
                          <div key={label} className="flex items-center justify-between px-5 py-3">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-navy flex items-center justify-center text-[14px]">{icon}</div>
                              <span className="text-[13px] font-medium text-gray-700">{label}</span>
                            </div>
                            <span className="text-[13px] font-bold text-navy">{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Other Benefits */}
                    {selectedPlan.riders?.length > 0 && (() => {
                      const dabRider = selectedPlan.riders.includes('dab')
                      return dabRider ? (
                        <div className="bg-white rounded-2xl border border-[rgba(184,134,11,0.08)] shadow-sm overflow-hidden">
                          <div className="bg-navy px-5 py-2.5">
                            <span className="text-white font-bold text-[12px]">Other Benefits</span>
                          </div>
                          <div className="flex items-center justify-between px-5 py-3">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-[14px]">🛡️</div>
                              <span className="text-[13px] font-medium text-gray-700">Accidental Death And Disability Cover</span>
                            </div>
                            <span className="text-[13px] font-bold text-navy">₹ {sa.toLocaleString('en-IN')}</span>
                          </div>
                        </div>
                      ) : null
                    })()}

                    {/* You Pay / You Get */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-white rounded-2xl p-5 border-2 border-gold/25 shadow-sm">
                        <div className="text-[22px] mb-1">🐷</div>
                        <div className="text-[11px] font-bold text-gold uppercase tracking-wider">You Pay</div>
                        <div className="text-[10px] text-gray-400 mb-2">total premium of</div>
                        <div className="font-display font-bold text-[22px] text-navy leading-none">₹ {Math.round(premResult.totalPaid).toLocaleString('en-IN')}</div>
                        <div className="text-[10px] text-gray-400 mt-1">over {ppt} year{ppt > 1 ? 's' : ''}</div>
                      </div>
                      <div className="bg-white rounded-2xl p-5 border-2 border-green-200 shadow-sm">
                        <div className="text-[22px] mb-1">🤲</div>
                        <div className="text-[11px] font-bold text-green-600 uppercase tracking-wider">You Get</div>
                        <div className="text-[10px] text-gray-400 mb-2">{isTermPlan ? 'life cover' : 'total benefit of'}</div>
                        <div className={`font-display font-bold text-[22px] leading-none ${isTermPlan ? 'text-red-600' : 'text-green-700'}`}>
                          {isTermPlan ? `₹ ${sa.toLocaleString('en-IN')}` : (matResult?.maturity ? `₹ ${Math.round(matResult.maturity).toLocaleString('en-IN')}` : '—')}
                        </div>
                        <div className="text-[10px] text-gray-400 mt-1">
                          {isTermPlan ? 'on death claim' : `at age ${age + safeterm}`}
                        </div>
                      </div>
                    </div>

                    {/* Yearly Premium — First Year vs Subseq Year (like Mr. Kiran screen) */}
                    <div className="bg-white rounded-2xl border border-[rgba(184,134,11,0.08)] shadow-sm p-5">
                      <div className="flex items-center gap-3 mb-4">
                        <span className="text-[24px]">💰</span>
                        <div className="font-bold text-[14px] text-navy">Yearly Premium</div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="text-center">
                          <div className="text-[11px] font-bold text-gray-500 mb-1">First Year</div>
                          <div className="font-display font-bold text-[22px] text-gold">₹ {Math.round(premResult.yearlyYear1).toLocaleString('en-IN')}</div>
                          <div className="text-[10px] text-gray-400 mt-0.5">
                            ({Math.round(premResult.netPremium).toLocaleString('en-IN')} + {Math.round(premResult.gstYear1).toLocaleString('en-IN')})
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-[11px] font-bold text-gray-500 mb-1">Subseq. Year</div>
                          <div className="font-display font-bold text-[22px] text-gold">₹ {Math.round(premResult.yearlyYear2plus).toLocaleString('en-IN')}</div>
                          <div className="text-[10px] text-gray-400 mt-0.5">
                            ({Math.round(premResult.netPremium).toLocaleString('en-IN')} + {Math.round(premResult.gstYear2).toLocaleString('en-IN')})
                          </div>
                        </div>
                      </div>
                      {/* Mode toggle on results */}
                      <div className="grid grid-cols-4 gap-1.5 pt-3 border-t border-gray-50">
                        {(['yearly','halfyearly','quarterly','monthly'] as const).map(m => (
                          <button key={m} onClick={() => setMode(m)}
                            className={`text-[11px] font-bold py-2 rounded-lg border transition-all
                              ${mode === m ? 'bg-navy text-white border-navy' : 'bg-gray-50 text-gray-500 border-gray-100 hover:border-navy/20'}`}>
                            {MODE_LABEL[m]}
                          </button>
                        ))}
                      </div>
                      {/* Per day */}
                      <div className="mt-3 text-center text-[11px] text-gray-400">
                        YLY Mode · Avg. Premium/Day ≈{' '}
                        <span className="font-bold text-navy">₹{Math.round(premResult.yearlyYear1 / 365)}</span>
                      </div>
                    </div>

                    {/* ── LOCKED SECTION ── */}
                    <div className="relative">
                      {!isUnlocked && (
                        <div className="absolute inset-0 z-20 rounded-2xl overflow-hidden">
                          <div className="absolute inset-0 backdrop-blur-sm bg-white/60" />
                          <div className="absolute inset-0 flex items-center justify-center p-4">
                            <div className="bg-white rounded-2xl shadow-2xl border border-gold/20 w-full max-w-sm p-6 text-center">
                              <div className="text-[36px] mb-2">🔓</div>
                              <div className="font-display font-bold text-[18px] text-navy mb-1">
                                {clientName ? `${salutation} ${clientName}, your full report is ready!` : 'Your full report is ready!'}
                              </div>
                              <div className="text-[12px] text-gray-500 mb-5">
                                Enter your mobile to unlock the complete breakdown, maturity illustration, tax benefits, and year-by-year table.
                              </div>
                              <form onSubmit={handleUnlock} className="space-y-3 text-left">
                                <div className="relative">
                                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-[13px]">📱</span>
                                  <input required type="tel" placeholder="10-digit mobile number"
                                    value={unlockMobile} onChange={e => setUnlockMobile(e.target.value)}
                                    className="w-full pl-9 pr-3 py-3 border border-gray-200 rounded-xl text-[13px] bg-gray-50 focus:outline-none focus:border-gold/50 focus:bg-white transition-all" />
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                  <select required value={unlockWantTo} onChange={e => setUnlockWantTo(e.target.value)}
                                    className="px-3 py-2.5 border border-gray-200 rounded-xl text-[12px] bg-gray-50 focus:outline-none focus:border-gold/50 text-gray-600 appearance-none cursor-pointer">
                                    <option value="">I want to…</option>
                                    <option>Protect my family</option>
                                    <option>Create wealth</option>
                                    <option>Children&apos;s future</option>
                                    <option>Plan retirement</option>
                                    <option>Get health cover</option>
                                  </select>
                                  <select required value={unlockIAm} onChange={e => setUnlockIAm(e.target.value)}
                                    className="px-3 py-2.5 border border-gray-200 rounded-xl text-[12px] bg-gray-50 focus:outline-none focus:border-gold/50 text-gray-600 appearance-none cursor-pointer">
                                    <option value="">I am…</option>
                                    <option>New to LIC</option>
                                    <option>Existing holder</option>
                                    <option>An NRI</option>
                                    <option>An agent</option>
                                    <option>Employee</option>
                                    <option>Retired</option>
                                  </select>
                                </div>
                                <div className="relative">
                                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-[13px]">✉️</span>
                                  <input type="email" placeholder="Email (optional)"
                                    value={unlockEmail} onChange={e => setUnlockEmail(e.target.value)}
                                    className="w-full pl-9 pr-3 py-3 border border-gray-200 rounded-xl text-[13px] bg-gray-50 focus:outline-none focus:border-gold/50 focus:bg-white transition-all" />
                                </div>
                                <button type="submit" disabled={unlockStatus === 'sending'}
                                  className="w-full bg-gold hover:bg-gold-hover text-white font-bold py-3 rounded-xl text-[13px] flex items-center justify-center gap-2 transition-all shadow-md disabled:opacity-70">
                                  {unlockStatus === 'sending'
                                    ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    : <><ArrowRight className="w-4 h-4" /> Unlock Full Report</>}
                                </button>
                                <div className="text-[10px] text-gray-400 text-center">🔒 Your data is private and never shared.</div>
                              </form>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className={`space-y-4 ${!isUnlocked ? 'pointer-events-none select-none min-h-[480px]' : ''}`}>

                        {/* Maturity Benefit table */}
                        {!isTermPlan && matResult?.maturity > 0 && (
                          <div className="bg-white rounded-2xl border border-[rgba(184,134,11,0.08)] shadow-sm overflow-hidden">
                            <div className="bg-navy px-5 py-2.5 flex justify-between items-center">
                              <span className="text-white font-bold text-[12px]">Maturity Benefit</span>
                              <span className="text-white/50 text-[10px]">(After completion of {safeterm} years)</span>
                            </div>
                            <div className="divide-y divide-gray-50 px-5">
                              <div className="flex justify-between py-2.5">
                                <span className="text-[12px] text-gray-600">Sum Assured</span>
                                <span className="text-[12px] font-semibold text-gray-800">{sa.toLocaleString('en-IN')}</span>
                              </div>
                              {matResult.totalSRB > 0 && (
                                <div className="flex justify-between py-2.5">
                                  <span className="text-[12px] text-gray-600">
                                    Bonus* ({Math.round(matResult.totalSRB / safeterm / (sa / 1000))}/1000 × {safeterm})
                                  </span>
                                  <span className="text-[12px] font-semibold text-gray-800">{Math.round(matResult.totalSRB).toLocaleString('en-IN')}</span>
                                </div>
                              )}
                              {matResult.fab > 0 && (
                                <div className="flex justify-between py-2.5">
                                  <span className="text-[12px] text-gray-600">
                                    Final Addition Bonus* ({Math.round(matResult.fab / (sa / 1000))}/1000 SA)
                                  </span>
                                  <span className="text-[12px] font-semibold text-gray-800">{Math.round(matResult.fab).toLocaleString('en-IN')}</span>
                                </div>
                              )}
                              <div className="flex justify-between py-3">
                                <span className="text-[13px] font-bold text-navy">Expected Maturity Amount<br /><span className="font-normal text-[10px] text-gray-400">after {safeterm} years.</span></span>
                                <span className="text-[16px] font-bold text-navy">{Math.round(matResult.maturity).toLocaleString('en-IN')}</span>
                              </div>
                              <div className="flex justify-between py-2.5">
                                <span className="text-[12px] text-gray-500">Total Premium Paid</span>
                                <span className="text-[12px] font-semibold text-gray-700">{Math.round(premResult.totalPaid).toLocaleString('en-IN')}</span>
                              </div>
                            </div>
                            <div className="px-5 pb-3">
                              <p className="text-[10px] text-gray-400 italic">*Bonus rates and Final Addition Bonus (FAB) rates as per the latest declared rates.</p>
                            </div>
                          </div>
                        )}

                        {/* Benefit Pattern Illustration */}
                        {!isTermPlan && matResult?.maturity > 0 && (
                          <div className="bg-white rounded-2xl border border-[rgba(184,134,11,0.08)] shadow-sm p-5">
                            <div className="bg-navy px-5 py-2.5 -mx-5 -mt-5 mb-5 rounded-t-2xl">
                              <span className="text-white font-bold text-[12px]">Benefit Pattern — Illustration</span>
                            </div>
                            {/* Visual timeline */}
                            <div className="relative py-6 px-4">
                              {/* Top arc — life cover label */}
                              <div className="flex justify-between items-start mb-1 px-2">
                                <div />
                                <div className="text-center text-[10px] text-blue-600 font-semibold">
                                  ☂️ You get Life Cover<br />
                                  <span className="text-[9px]">({fmtSA(sa)} to {fmt(matResult.maturity)})</span>
                                </div>
                                <div className="text-right text-[10px] text-green-600 font-semibold">
                                  You get<br/>Lump Sum<br/>
                                  <span className="font-bold text-[11px]">{fmt(matResult.maturity)}</span><br/>
                                  <span className="text-[16px]">💰</span>
                                </div>
                              </div>
                              {/* Timeline bar */}
                              <div className="relative h-3 bg-gray-100 rounded-full mx-2 my-3">
                                <div className="absolute h-full bg-gradient-to-r from-gold via-amber-400 to-green-500 rounded-full"
                                  style={{ width: `${Math.min((ppt / safeterm) * 100, 100)}%` }} />
                                {/* Start dot */}
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-green-500 border-2 border-white shadow" />
                                {/* PPT end dot */}
                                {ppt < safeterm && (
                                  <div className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-navy border-2 border-white shadow"
                                    style={{ left: `calc(${(ppt / safeterm) * 100}% - 6px)` }} />
                                )}
                                {/* End dot */}
                                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-green-500 border-2 border-white shadow" />
                              </div>
                              {/* Labels */}
                              <div className="flex justify-between text-center px-2">
                                <div>
                                  <div className="text-[11px] font-bold text-navy">Age {age}</div>
                                  <div className="text-[10px] text-gold font-semibold">₹{Math.round(premResult.yearlyYear1).toLocaleString('en-IN')}/yr 🐷</div>
                                </div>
                                {ppt < safeterm && (
                                  <div className="text-center">
                                    <div className="text-[11px] font-bold text-navy">Age {age + ppt}</div>
                                    <div className="text-[10px] text-gray-400">Premiums end</div>
                                  </div>
                                )}
                                <div>
                                  <div className="text-[11px] font-bold text-green-700">Age {age + safeterm}</div>
                                  <div className="text-[10px] text-green-600 font-semibold">{fmt(matResult.maturity)}</div>
                                </div>
                              </div>
                            </div>
                            {/* Bottom 3-cell summary */}
                            <div className="grid grid-cols-3 border border-navy/10 rounded-xl overflow-hidden mt-2">
                              {[
                                { label: 'Total\nPremium Paid', value: Math.round(premResult.totalPaid).toLocaleString('en-IN'), color: 'text-navy' },
                                { label: 'Total\nReturns',      value: Math.round(matResult.maturity).toLocaleString('en-IN'),   color: 'text-green-700' },
                                { label: `Tax Saved\n(30% Slab)`, value: tax80C ? Math.round(tax80C).toLocaleString('en-IN') : '—', color: 'text-blue-600' },
                              ].map(({ label, value }, i) => (
                                <div key={i} className={`bg-navy text-center py-3 px-2 ${i < 2 ? 'border-r border-white/10' : ''}`}>
                                  <div className="text-[9px] text-white/60 leading-tight whitespace-pre-line mb-1">{label}</div>
                                  <div className={`text-[13px] font-bold text-white`}>{value}</div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Show Full Premium Chart accordion */}
                        <div className="bg-white rounded-2xl border border-[rgba(184,134,11,0.08)] shadow-sm overflow-hidden">
                          <button onClick={() => setShowAllModes(v => !v)}
                            className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors">
                            <div className="flex items-center gap-2 text-navy font-bold text-[13px]">
                              <span className="text-[16px]">💳</span> Show Full Premium Chart
                            </div>
                            {showAllModes ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                          </button>
                          {showAllModes && allModesPrem && (
                            <div className="border-t border-gray-50">
                              {/* First Year */}
                              <div className="px-5 py-2.5 bg-navy/5 text-[11px] font-bold text-navy/60 uppercase tracking-wider">
                                1st Year Premium With TAX {premResult.gstPctYear1}%
                              </div>
                              <div className="divide-y divide-gray-50">
                                {allModesPrem.map(({ mode: m, prem: p }) => (
                                  <div key={m} className="flex justify-between items-center px-5 py-2.5">
                                    <div className="flex items-center gap-2">
                                      <span className="text-[12px] font-semibold text-gray-700 w-20">
                                        {m === 'yearly' ? 'Yearly' : m === 'halfyearly' ? 'Half-Yearly' : m === 'quarterly' ? 'Quarterly' : 'Monthly (ECS)'}
                                      </span>
                                    </div>
                                    <div className="text-right">
                                      <span className="text-[13px] font-bold text-navy">₹ {Math.round(
                                        m === 'yearly' ? p.yearlyYear1 :
                                        m === 'halfyearly' ? p.yearlyYear1 / 2 :
                                        m === 'quarterly' ? p.yearlyYear1 / 4 :
                                        p.yearlyYear1 / 12
                                      ).toLocaleString('en-IN')}</span>
                                    </div>
                                  </div>
                                ))}
                                <div className="flex justify-between items-center px-5 py-2.5 bg-gold/5">
                                  <span className="text-[11px] text-gray-500">YLY Mode Avg. Prem/Day</span>
                                  <span className="text-[12px] font-bold text-navy">₹ {Math.round(premResult.yearlyYear1 / 365)}</span>
                                </div>
                              </div>
                              {/* Subsequent Years */}
                              <div className="px-5 py-2.5 bg-navy/5 text-[11px] font-bold text-navy/60 uppercase tracking-wider border-t border-gray-100">
                                After 1st Year Premium With TAX {premResult.gstPctYear2}%
                              </div>
                              <div className="divide-y divide-gray-50">
                                {allModesPrem.map(({ mode: m, prem: p }) => (
                                  <div key={m} className="flex justify-between items-center px-5 py-2.5">
                                    <span className="text-[12px] font-semibold text-gray-700 w-20">
                                      {m === 'yearly' ? 'Yearly' : m === 'halfyearly' ? 'Half-Yearly' : m === 'quarterly' ? 'Quarterly' : 'Monthly (ECS)'}
                                    </span>
                                    <span className="text-[13px] font-bold text-navy">₹ {Math.round(
                                      m === 'yearly' ? p.yearlyYear2plus :
                                      m === 'halfyearly' ? p.yearlyYear2plus / 2 :
                                      m === 'quarterly' ? p.yearlyYear2plus / 4 :
                                      p.yearlyYear2plus / 12
                                    ).toLocaleString('en-IN')}</span>
                                  </div>
                                ))}
                                <div className="flex justify-between items-center px-5 py-2.5 bg-gold/5 border-t border-gray-100">
                                  <span className="text-[11px] text-gray-500">Total Approx. Paid Premium</span>
                                  <span className="text-[12px] font-bold text-navy">₹ {Math.round(premResult.totalPaid).toLocaleString('en-IN')}</span>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Tax benefits + Riders */}
                        <div className="grid sm:grid-cols-2 gap-4">
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
                                <div className="text-[13px] font-bold text-green-700">{tax80C ? `~${fmt(tax80C)}` : '—'}</div>
                              </div>
                              <div className="flex justify-between">
                                <div>
                                  <div className="text-[12px] font-semibold text-gray-700">Sec. 10(10D) Maturity</div>
                                  <div className="text-[10px] text-gray-400">Maturity proceeds tax-free*</div>
                                </div>
                                <div className="text-[13px] font-bold text-green-700">Tax Free</div>
                              </div>
                              <div className="text-[10px] text-gray-300">* Subject to conditions.</div>
                            </div>
                          </div>
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
                              <div className="text-[12px] text-gray-400">No riders for this plan.</div>
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
                            <div className="grid grid-cols-3 gap-3">
                              {[
                                { label: 'Expected XIRR',    value: xirr ? `~${xirr}% p.a.` : selectedPlan.xirr ?? '—' },
                                { label: 'Money Multiplier', value: multiplier ? `${multiplier}×` : '—' },
                                { label: 'Total Bonus',      value: matResult?.totalBonus ? fmt(matResult.totalBonus) : '—' },
                              ].map(({ label, value }) => (
                                <div key={label} className="bg-white rounded-xl p-3 border border-gold/10 text-center">
                                  <div className="text-[10px] text-gray-400 mb-0.5">{label}</div>
                                  <div className="font-display font-bold text-[16px] text-navy">{value}</div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Year-by-year benefit table */}
                        {benefitTable.length > 0 && (
                          <div className="bg-white rounded-2xl border border-[rgba(184,134,11,0.08)] shadow-sm overflow-hidden">
                            <button onClick={() => setShowTable(v => !v)}
                              className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors">
                              <div className="flex items-center gap-2 text-navy font-bold text-[13px]">
                                <TrendingUp className="w-4 h-4 text-gold" />
                                Show Full Premium Chart (Year-wise)
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
                            onClick={() => openLeadPopup(`Premium quote: LIC's ${selectedPlan.name} (Plan ${selectedPlan.planNo}), ${fmtSA(sa)} SA, Age ${age}`)}
                            className="flex-1 bg-gold hover:bg-gold-hover text-white font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-md text-[13px]">
                            Get Exact Quote from Ajay Sir <ArrowRight className="w-4 h-4" />
                          </button>
                          <button onClick={whatsappShare}
                            className="sm:w-auto bg-green-500 hover:bg-green-600 text-white font-bold py-3.5 px-6 rounded-xl transition-all flex items-center justify-center gap-2 text-[13px]">
                            <Share2 className="w-4 h-4" /> Share
                          </button>
                        </div>

                      </div>{/* end blurred content */}
                    </div>{/* end locked section */}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 pb-10">
        <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 flex items-start gap-3">
          <Info className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
          <p className="text-[11px] text-amber-700 leading-relaxed">
            <strong>Disclaimer:</strong> Calculations are illustrative based on LIC tabular rates and are not official LIC quotes.
            Bonus rates are based on 2026 declared rates and are not guaranteed for future years.
            Actual premiums depend on LIC underwriting rules and current circulars.
            {' '}<Link href="/contact" className="underline font-semibold">Contact Ajay Kumar Poddar for an official LIC quote.</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
