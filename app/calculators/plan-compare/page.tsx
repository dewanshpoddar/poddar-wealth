'use client'

import { useState, useMemo, useEffect, useRef, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { useLang } from '@/lib/LangContext'
import { trackEvent } from '@/lib/analytics'
import licData from '@/lib/lic-plans-data.js'
const { PLANS } = licData as any
import { openLeadPopup } from '@/lib/events'
import { Scale, Phone, Calculator, X, Check, ChevronRight } from 'lucide-react'
import CalculatorShell from '@/components/calculators/CalculatorShell'

const activePlans = (PLANS as any[]).filter((p: any) => p.status !== 'withdrawn')

const CATEGORY_LABEL: Record<string, string> = {
  endowment: 'Endowment', moneyback: 'Money Back', wholelife: 'Whole Life',
  term: 'Term', child: 'Child', pension: 'Pension', ulip: 'ULIP', micro: 'Micro',
}

const ROWS = [
  { key: 'type',     label: 'Plan Type',       hi: 'प्लान प्रकार',      fmt: (p: any) => CATEGORY_LABEL[p.category] ?? p.category },
  { key: 'entryAge', label: 'Entry Age',        hi: 'प्रवेश आयु',        fmt: (p: any) => `${p.minAge}-${p.maxAge} yrs` },
  { key: 'term',     label: 'Policy Term',      hi: 'पॉलिसी अवधि',       fmt: (p: any) => p.minTerm && p.maxTerm ? `${p.minTerm}-${p.maxTerm} yrs` : p.ppt === 'single' ? 'Single Premium' : 'Flexible' },
  { key: 'minSA',    label: 'Min Sum Assured',  hi: 'न्यूनतम बीमा राशि',  fmt: (p: any) => p.minSA ? `₹${(p.minSA / 100000).toFixed(0)}L` : '-' },
  { key: 'death',    label: 'Death Benefit',    hi: 'मृत्यु लाभ',         fmt: (p: any) => p.deathBenefitFormula ?? 'Sum Assured + Bonus' },
  { key: 'maturity', label: 'Maturity Benefit', hi: 'मैच्योरिटी लाभ',     fmt: (p: any) => p.category === 'term' ? 'None (pure protection)' : (p.maturityFormula ?? 'SA + Bonuses') },
  { key: 'xirr',    label: 'Expected XIRR',    hi: 'अपेक्षित XIRR',      fmt: (p: any) => p.xirr ?? '-' },
  { key: 'tax',      label: 'Tax Benefit',      hi: 'टैक्स लाभ',          fmt: () => '80C + 10(10D)' },
  { key: 'bestFor',  label: 'Best For',         hi: 'किसके लिए',           fmt: (p: any) => p.bestFor ?? '-' },
]

const COMPARE_FAQ = [
  {
    question: 'How many plans can I compare at once?',
    answer: 'You can compare up to 3 LIC plans at the same time. Simply select them from the list and hit the Compare button to see a side-by-side breakdown of all features.'
  },
  {
    question: 'Which plan is best for me?',
    answer: 'The best plan depends on your age, income, goals (protection vs savings vs pension), and risk appetite. Use this comparison as a starting point, then consult Ajay sir for personalized advice.'
  },
  {
    question: 'What does XIRR mean in the table?',
    answer: 'XIRR (Extended Internal Rate of Return) is a way of measuring the effective annual return on your investment in a policy, accounting for all premium payments and benefits received. A higher XIRR generally indicates better returns.'
  }
]

function PlanCompareContent() {
  const { t, lang } = useLang()
  const c = (t as Record<string, any>).compare ?? {}
  const searchParams = useSearchParams()
  const planParam = searchParams.get('plan')
  const resultRef = useRef<HTMLDivElement | null>(null)

  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<any[]>([])
  const [hasCompared, setHasCompared] = useState(false)

  useEffect(() => {
    if (planParam) {
      const match = activePlans.find((p: any) => String(p.planNo) === planParam)
      if (match && !selected.some(s => s.planNo === match.planNo)) {
        setSelected([match])
      }
    }
  }, [planParam])

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
    setHasCompared(false)
  }

  function handleCompare(e?: React.FormEvent) {
    if (e) e.preventDefault()
    if (selected.length < 2) return
    setHasCompared(true)
    trackEvent('compare_viewed', { plans: selected.map((p: any) => p.planNo).join(',') })
    setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 100)
  }

  const isHi = lang === 'hi'

  return (
    <CalculatorShell
      activeTabId="plan-compare"
      title={isHi ? 'प्लान तुलना' : 'Plan Compare'}
      infoTooltip="Select 2 or 3 LIC plans from the list below, hit Compare, and see a detailed side-by-side breakdown of all their benefits, terms, and returns."
      faq={COMPARE_FAQ}
      hasCalculated={hasCompared}
      onCalculate={handleCompare}
      calculateButtonText={
        selected.length < 2
          ? (isHi ? 'कम से कम 2 प्लान चुनें' : 'Select at least 2 plans')
          : (isHi ? `${selected.length} प्लान की तुलना करें` : `Compare ${selected.length} Plans`)
      }
      resultRef={resultRef}
      formFields={
        <div className="space-y-4">
          {/* Selected chips */}
          {selected.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {selected.map((p: any) => (
                <span key={p.planNo} className="inline-flex items-center gap-1.5 bg-[#0f1225] text-white text-[10px] font-bold px-3 py-1.5 rounded-full border border-amber-500/30">
                  {p.name}
                  <button
                    type="button"
                    onClick={() => togglePlan(p)}
                    className="hover:text-amber-400 transition-colors text-white/60 ml-0.5"
                  >
                    <X size={11} />
                  </button>
                </span>
              ))}
              <button
                type="button"
                onClick={() => { setSelected([]); setHasCompared(false) }}
                className="text-[10px] text-gray-500 hover:text-red-500 transition-colors underline self-center"
              >
                {c.clearAll ?? 'Clear all'}
              </button>
            </div>
          )}

          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
            {c.selectPlans ?? 'Select plans to compare'} ({selected.length}/3)
          </p>

          {/* Search */}
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={isHi ? 'नाम या प्लान नं. से खोजें…' : 'Search by plan name or number…'}
            aria-label={isHi ? 'प्लान खोजें' : 'Search plans'}
            className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-amber-500/40 bg-white"
          />

          {/* Plan list */}
          <div className="grid grid-cols-1 gap-1.5 max-h-52 overflow-y-auto pr-1">
            {filtered.map((plan: any) => {
              const isSelected = selected.find(p => p.planNo === plan.planNo)
              const isDisabled = !isSelected && selected.length >= 3
              return (
                <button
                  key={plan.planNo}
                  type="button"
                  onClick={() => !isDisabled && togglePlan(plan)}
                  className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border text-left text-xs transition-all ${
                    isSelected
                      ? 'bg-[#0f1225] border-amber-500/40 text-white'
                      : isDisabled
                      ? 'bg-gray-50 border-gray-100 text-gray-300 cursor-not-allowed'
                      : 'bg-white border-gray-200 text-gray-700 hover:border-amber-500/30 hover:bg-amber-50/20'
                  }`}
                >
                  <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${isSelected ? 'bg-amber-500 border-amber-500' : 'border-current'}`}>
                    {isSelected && <Check size={9} className="text-white" />}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold truncate text-[11px]">{plan.name}</div>
                    <div className="text-[9px] opacity-60 mt-0.5">{CATEGORY_LABEL[plan.category] ?? plan.category} · #{plan.planNo}</div>
                  </div>
                  {isSelected && <ChevronRight size={12} className="text-amber-400 shrink-0" />}
                </button>
              )
            })}
          </div>
        </div>
      }
      resultPanel={
        <div className="space-y-6" ref={resultRef}>
          {hasCompared && selected.length >= 2 && (
            <>
              {/* Desktop table */}
              <div className="hidden md:block overflow-x-auto rounded-2xl border border-gray-200 shadow-sm">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-[#0f1225]">
                      <th className="px-5 py-4 text-left text-white/50 text-[10px] font-bold uppercase tracking-wider w-32">Feature</th>
                      {selected.map((p: any) => (
                        <th key={p.planNo} className="px-5 py-4 text-left text-white font-bold text-[12px]">
                          {p.name}
                          <div className="text-white/40 text-[9px] font-normal mt-0.5">#{p.planNo}</div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {ROWS.map((row, ri) => (
                      <tr key={row.key} className={ri % 2 === 0 ? 'bg-white' : 'bg-slate-50/60'}>
                        <td className="px-5 py-3 text-[9px] font-bold text-gray-500 uppercase tracking-wide">
                          {isHi ? row.hi : row.label}
                        </td>
                        {selected.map((p: any) => (
                          <td key={p.planNo} className="px-5 py-3 text-gray-700 text-xs leading-snug">
                            {row.fmt(p)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile stacked cards */}
              <div className="md:hidden space-y-4">
                {selected.map((p: any) => (
                  <div key={p.planNo} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="bg-[#0f1225] px-5 py-3">
                      <div className="font-bold text-white text-[13px]">{p.name}</div>
                      <div className="text-white/40 text-[9px] mt-0.5">#{p.planNo} · {CATEGORY_LABEL[p.category] ?? p.category}</div>
                    </div>
                    <div className="divide-y divide-gray-50">
                      {ROWS.map(row => (
                        <div key={row.key} className="flex justify-between items-start px-5 py-3 gap-4">
                          <span className="text-[9px] font-bold text-gray-500 uppercase tracking-wide flex-shrink-0 w-24">
                            {isHi ? row.hi : row.label}
                          </span>
                          <span className="text-xs text-gray-700 text-right">{row.fmt(p)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* CTA block */}
              <div className="bg-amber-50 border border-amber-200/60 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <p className="font-bold text-gray-900 text-sm">
                    {c.cta ?? 'Need help choosing? Ask Ajay sir →'}
                  </p>
                  <p className="text-gray-500 text-[10px] mt-0.5">
                    {isHi ? 'व्यक्तिगत सलाह के लिए कॉल या WhatsApp करें।' : 'Personal advice - call or WhatsApp for a free consultation.'}
                  </p>
                </div>
                <div className="flex gap-2.5">
                  <button
                    type="button"
                    onClick={() => openLeadPopup('Plan comparison consultation')}
                    className="bg-[#0f1225] text-white font-bold text-[10px] px-4 py-2.5 rounded-xl hover:bg-[#0f1225]/90 transition-colors inline-flex items-center gap-1.5"
                  >
                    <Phone size={12} />
                    {isHi ? 'कॉल करें' : 'Call Ajay Sir'}
                  </button>
                  <a
                    href="/calculators/premium"
                    className="bg-amber-500 hover:bg-amber-600 text-white font-bold text-[10px] px-4 py-2.5 rounded-xl transition-colors inline-flex items-center gap-1.5"
                  >
                    <Calculator size={12} />
                    {isHi ? 'प्रीमियम कैलकुलेटर' : 'Calculate Premium'}
                  </a>
                </div>
              </div>
            </>
          )}
        </div>
      }
    />
  )
}

export default function PlanComparePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 pt-32 text-center text-gray-500 text-sm">Loading plan comparison...</div>}>
      <PlanCompareContent />
    </Suspense>
  )
}
