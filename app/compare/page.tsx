'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { useLang } from '@/lib/LangContext'
import { trackEvent } from '@/lib/analytics'
import { PLANS } from '@/lib/lic-plans-data.js'
import { openLeadPopup } from '@/lib/events'

const activePlans = (PLANS as any[]).filter((p: any) => p.status !== 'withdrawn')

const CATEGORY_LABEL: Record<string, string> = {
  endowment: 'Endowment', moneyback: 'Money Back', wholelife: 'Whole Life',
  term: 'Term', child: 'Child', pension: 'Pension', ulip: 'ULIP', micro: 'Micro',
}

const ROWS = [
  { key: 'type',        label: 'Plan Type',        hi: 'प्लान प्रकार',       fmt: (p: any) => CATEGORY_LABEL[p.category] ?? p.category },
  { key: 'entryAge',    label: 'Entry Age',         hi: 'प्रवेश आयु',         fmt: (p: any) => `${p.minAge}–${p.maxAge} yrs` },
  { key: 'term',        label: 'Policy Term',       hi: 'पॉलिसी अवधि',        fmt: (p: any) => p.minTerm && p.maxTerm ? `${p.minTerm}–${p.maxTerm} yrs` : p.ppt === 'single' ? 'Single Premium' : 'Flexible' },
  { key: 'minSA',       label: 'Min Sum Assured',   hi: 'न्यूनतम बीमा राशि',   fmt: (p: any) => p.minSA ? `₹${(p.minSA / 100000).toFixed(0)}L` : '—' },
  { key: 'death',       label: 'Death Benefit',     hi: 'मृत्यु लाभ',          fmt: (p: any) => p.deathBenefitFormula ?? 'Sum Assured + Bonus' },
  { key: 'maturity',    label: 'Maturity Benefit',  hi: 'मैच्योरिटी लाभ',      fmt: (p: any) => p.category === 'term' ? 'None (pure protection)' : (p.maturityFormula ?? 'SA + Bonuses') },
  { key: 'xirr',       label: 'Expected XIRR',     hi: 'अपेक्षित XIRR',       fmt: (p: any) => p.xirr ?? '—' },
  { key: 'tax',         label: 'Tax Benefit',       hi: 'टैक्स लाभ',           fmt: () => '80C + 10(10D)' },
  { key: 'bestFor',     label: 'Best For',          hi: 'किसके लिए',            fmt: (p: any) => p.bestFor ?? '—' },
]

export default function ComparePage() {
  const { t, lang } = useLang()
  const c = (t as Record<string, any>).compare ?? {}

  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<any[]>([])
  const [hasCompared, setHasCompared] = useState(false)

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    if (!q) return activePlans.slice(0, 40)
    return activePlans.filter((p: any) =>
      p.name.toLowerCase().includes(q) ||
      String(p.planNo).includes(q) ||
      (p.category ?? '').toLowerCase().includes(q)
    ).slice(0, 20)
  }, [search])

  function togglePlan(plan: any) {
    setSelected(prev => {
      const exists = prev.find(p => p.planNo === plan.planNo)
      if (exists) return prev.filter(p => p.planNo !== plan.planNo)
      if (prev.length >= 3) return prev
      return [...prev, plan]
    })
  }

  function handleCompare() {
    if (selected.length < 2) return
    setHasCompared(true)
    trackEvent('compare_viewed', { plans: selected.map((p: any) => p.planNo).join(',') })
  }

  const isHi = lang === 'hi'

  return (
    <div className="min-h-screen bg-white pt-20">
      {/* Hero */}
      <section className="bg-navy py-14 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-2 text-xs font-bold uppercase tracking-widest text-white/60 mb-5">
            ⚖️ {c.title ?? (isHi ? 'प्लान तुलना' : 'Compare Plans')}
          </div>
          <h1 className="font-display font-bold text-3xl md:text-4xl text-white mb-3 leading-tight">
            {c.hero ?? (isHi ? 'बीमा प्लान की साथ-साथ तुलना करें' : 'Compare Insurance Plans Side by Side')}
          </h1>
          <p className="text-white/55 text-sm leading-relaxed max-w-lg mx-auto">
            {c.heroSub ?? (isHi
              ? '2 या 3 LIC प्लान चुनें और एक साथ देखें।'
              : 'Pick 2 or 3 LIC plans and see premiums, benefits, and features at a glance.')}
          </p>
        </div>
      </section>

      {/* Plan selector */}
      <section className="py-10 px-6 bg-slate-50 border-b border-gray-200">
        <div className="max-w-3xl mx-auto">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">
            {c.selectPlans ?? 'Select plans to compare'} ({selected.length}/3)
          </p>

          {/* Selected chips */}
          {selected.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {selected.map((p: any) => (
                <span key={p.planNo} className="inline-flex items-center gap-2 bg-navy text-white text-xs font-bold px-3 py-1.5 rounded-full">
                  {p.name}
                  <button onClick={() => togglePlan(p)} className="hover:text-gold transition-colors text-white/70">✕</button>
                </span>
              ))}
              <button onClick={() => { setSelected([]); setHasCompared(false) }}
                className="text-xs text-gray-500 hover:text-red-500 transition-colors underline">
                {c.clearAll ?? 'Clear all'}
              </button>
            </div>
          )}

          {/* Search */}
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={isHi ? 'नाम या प्लान नं. से खोजें…' : 'Search by plan name or number…'}
            aria-label={isHi ? 'प्लान खोजें' : 'Search plans'}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-navy/40 bg-white mb-3"
          />

          {/* Plan list */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-64 overflow-y-auto">
            {filtered.map((plan: any) => {
              const isSelected = selected.find(p => p.planNo === plan.planNo)
              const isDisabled = !isSelected && selected.length >= 3
              return (
                <button key={plan.planNo} onClick={() => !isDisabled && togglePlan(plan)}
                  className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl border text-left text-sm transition-all ${
                    isSelected
                      ? 'bg-navy border-navy text-white'
                      : isDisabled
                      ? 'bg-gray-50 border-gray-100 text-gray-300 cursor-not-allowed'
                      : 'bg-white border-gray-200 text-gray-700 hover:border-navy/30'
                  }`}>
                  <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${isSelected ? 'bg-gold border-gold' : 'border-current'}`}>
                    {isSelected && <span className="text-navy text-[10px] font-bold">✓</span>}
                  </span>
                  <div className="min-w-0">
                    <div className="font-semibold truncate">{plan.name}</div>
                    <div className="text-[10px] opacity-60">{CATEGORY_LABEL[plan.category] ?? plan.category} · #{plan.planNo}</div>
                  </div>
                </button>
              )
            })}
          </div>

          <button
            onClick={handleCompare}
            disabled={selected.length < 2}
            className="mt-5 w-full bg-gold hover:bg-amber-600 text-white font-bold py-3.5 rounded-xl text-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {c.comparePlans ?? 'Compare Plans'} {selected.length >= 2 ? `(${selected.length})` : ''}
          </button>

          {!hasCompared && selected.length < 2 && (
            <p className="text-center text-xs text-gray-500 mt-3">
              {c.noPlanSelected ?? 'Select at least 2 plans to compare'}
            </p>
          )}
        </div>
      </section>

      {/* Comparison table */}
      {hasCompared && selected.length >= 2 && (
        <section className="py-10 px-4 md:px-6">
          <div className="max-w-5xl mx-auto">

            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto rounded-2xl border border-gray-200 shadow-sm">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-navy">
                    <th className="px-5 py-4 text-left text-white/60 text-xs font-bold uppercase tracking-wider w-36">Feature</th>
                    {selected.map((p: any) => (
                      <th key={p.planNo} className="px-5 py-4 text-left text-white font-bold text-[13px]">
                        {p.name}
                        <div className="text-white/50 text-[10px] font-normal mt-0.5">#{p.planNo}</div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {ROWS.map((row, ri) => (
                    <tr key={row.key} className={ri % 2 === 0 ? 'bg-white' : 'bg-slate-50/60'}>
                      <td className="px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wide">
                        {isHi ? row.hi : row.label}
                      </td>
                      {selected.map((p: any) => (
                        <td key={p.planNo} className="px-5 py-3.5 text-gray-700 text-[13px] leading-snug">
                          {row.fmt(p)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile stacked cards */}
            <div className="md:hidden space-y-6">
              {selected.map((p: any) => (
                <div key={p.planNo} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                  <div className="bg-navy px-5 py-3">
                    <div className="font-bold text-white text-[15px]">{p.name}</div>
                    <div className="text-white/50 text-[10px] mt-0.5">#{p.planNo} · {CATEGORY_LABEL[p.category] ?? p.category}</div>
                  </div>
                  <div className="divide-y divide-gray-50">
                    {ROWS.map(row => (
                      <div key={row.key} className="flex justify-between items-start px-5 py-3 gap-4">
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wide flex-shrink-0 w-28">
                          {isHi ? row.hi : row.label}
                        </span>
                        <span className="text-[13px] text-gray-700 text-right">{row.fmt(p)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="mt-10 bg-gold/5 border border-gold/20 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <p className="font-display font-bold text-navy text-base">
                  {c.cta ?? 'Need help choosing? Ask Ajay sir →'}
                </p>
                <p className="text-gray-500 text-xs mt-1">
                  {isHi ? 'व्यक्तिगत सलाह के लिए कॉल या WhatsApp करें।' : 'Personal advice — call or WhatsApp for a free consultation.'}
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => openLeadPopup('Plan comparison consultation')}
                  className="bg-navy text-white font-bold text-sm px-5 py-2.5 rounded-xl hover:bg-navy/90 transition-colors"
                >
                  📞 {isHi ? 'कॉल करें' : 'Call Ajay Sir'}
                </button>
                <Link href="/calculators/premium"
                  className="bg-gold text-white font-bold text-sm px-5 py-2.5 rounded-xl hover:bg-amber-600 transition-colors">
                  🧮 {isHi ? 'प्रीमियम कैलकुलेटर' : 'Calculate Premium'}
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
