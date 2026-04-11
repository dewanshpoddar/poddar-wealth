'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLang } from '@/lib/LangContext'
import { ArrowRight, Info, CheckCircle2, Zap, SlidersHorizontal, X } from 'lucide-react'
import { openLeadPopup } from '@/lib/events'

interface Plan {
  id: string
  name: { en: string; hi: string }
  planNo: string
  tagline: { en: string; hi: string }
  keyBenefit: { en: string; hi: string }
  category: string
  entryAge: string
  sumAssured: string
  premiumPayment: string
  highlights: { en: string; hi: string }[]
  officialUrl: string
  status: string
}

interface Category {
  label: { en: string; hi: string }
  tagline: { en: string; hi: string }
  icon: string
  color: string
  plans: Plan[]
}

interface LicData {
  meta: any
  categories: Record<string, Category>
}

const WITHDRAWN_KEY = '__withdrawn__'

export default function LicPlans() {
  const { lang } = useLang()
  const [data, setData]           = useState<LicData | null>(null)
  const [loading, setLoading]     = useState(true)
  const [expandedPlan, setExpandedPlan] = useState<string | null>(null)
  const [selected, setSelected]   = useState<Set<string>>(new Set()) // empty = all active
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  useEffect(() => {
    fetch('/api/lic-plans?view=all')
      .then(r => r.json())
      .then(res => { if (res.success) setData(res.data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  // ── derived data ────────────────────────────────────────────────
  const { activePlans, withdrawnPlans, categoryMeta } = useMemo(() => {
    if (!data) return { activePlans: [], withdrawnPlans: [], categoryMeta: {} }

    const activePlans: (Plan & { _catKey: string })[] = []
    const withdrawnPlans: (Plan & { _catKey: string })[] = []
    const categoryMeta: Record<string, { label: Category['label']; icon: string; color: string; count: number }> = {}

    for (const [key, cat] of Object.entries(data.categories)) {
      const activeInCat = cat.plans.filter(p => p.status !== 'withdrawn')
      const wdrInCat    = cat.plans.filter(p => p.status === 'withdrawn')
      activeInCat.forEach(p => activePlans.push({ ...p, _catKey: key }))
      wdrInCat.forEach(p =>    withdrawnPlans.push({ ...p, _catKey: key }))
      if (activeInCat.length > 0) {
        categoryMeta[key] = { label: cat.label, icon: cat.icon, color: cat.color, count: activeInCat.length }
      }
    }
    return { activePlans, withdrawnPlans, categoryMeta }
  }, [data])

  const displayedPlans = useMemo(() => {
    if (selected.size === 0) return activePlans
    if (selected.has(WITHDRAWN_KEY) && selected.size === 1) return withdrawnPlans
    const cats = new Set([...selected].filter(k => k !== WITHDRAWN_KEY))
    const result: (Plan & { _catKey: string })[] = []
    if (cats.size > 0) result.push(...activePlans.filter(p => cats.has(p._catKey)))
    if (selected.has(WITHDRAWN_KEY)) result.push(...withdrawnPlans)
    return result
  }, [selected, activePlans, withdrawnPlans])

  // ── filter helpers ───────────────────────────────────────────────
  const toggleCategory = (key: string) => {
    setSelected(prev => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
    setExpandedPlan(null)
  }

  const clearFilters = () => { setSelected(new Set()); setExpandedPlan(null) }

  const isShowingAll = selected.size === 0
  const showingWithdrawn = selected.has(WITHDRAWN_KEY)

  const handleGetPlan = (planName: string) => openLeadPopup(`Interest in ${planName}`)

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50/30">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-navy/10 border-t-navy rounded-full animate-spin" />
        <p className="text-14 font-bold text-navy/40 uppercase tracking-widest">Loading Plans...</p>
      </div>
    </div>
  )

  if (!data || !data.categories) return null

  // ── sidebar content (shared between desktop + mobile) ────────────
  const SidebarContent = () => (
    <div className="space-y-1">
      {/* All Plans */}
      <button
        onClick={clearFilters}
        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all group
          ${isShowingAll ? 'bg-gold/10 text-gold' : 'text-gray-600 hover:bg-gray-50'}`}
      >
        <span className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all
          ${isShowingAll ? 'bg-gold border-gold' : 'border-gray-300 group-hover:border-gold/50'}`}>
          {isShowingAll && <CheckCircle2 size={10} className="text-white fill-white" />}
        </span>
        <span className="text-18 leading-none">🏆</span>
        <span className="flex-1 font-semibold text-13">
          {lang === 'en' ? 'All Active Plans' : 'सभी सक्रिय'}
        </span>
        <span className={`text-10 font-bold px-1.5 py-0.5 rounded-full flex-shrink-0
          ${isShowingAll ? 'bg-gold/20 text-gold' : 'bg-gray-100 text-gray-500'}`}>
          {activePlans.length}
        </span>
      </button>

      <div className="h-px bg-gray-100 my-3" />
      <p className="text-10 font-bold text-gray-400 uppercase tracking-widest px-3 mb-2">
        {lang === 'en' ? 'Categories' : 'श्रेणियाँ'}
      </p>

      {/* Category checkboxes */}
      {Object.entries(categoryMeta).map(([key, meta]) => {
        const isActive = selected.has(key)
        return (
          <button
            key={key}
            onClick={() => toggleCategory(key)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all group
              ${isActive ? 'bg-navy/5 text-navy' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <span className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all
              ${isActive ? 'bg-navy border-navy' : 'border-gray-300 group-hover:border-navy/40'}`}>
              {isActive && <CheckCircle2 size={10} className="text-white fill-white" />}
            </span>
            <span className="text-16 leading-none">{meta.icon}</span>
            <span className="flex-1 font-medium text-13 truncate">
              {meta.label[lang as keyof typeof meta.label]}
            </span>
            <span className={`text-10 font-bold px-1.5 py-0.5 rounded-full flex-shrink-0
              ${isActive ? 'bg-navy/10 text-navy' : 'bg-gray-100 text-gray-500'}`}>
              {meta.count}
            </span>
          </button>
        )
      })}

      {/* Withdrawn separator */}
      {withdrawnPlans.length > 0 && (
        <>
          <div className="h-px bg-gray-100 my-3" />
          <p className="text-10 font-bold text-gray-400 uppercase tracking-widest px-3 mb-2">
            {lang === 'en' ? 'Discontinued' : 'बंद'}
          </p>
          <button
            onClick={() => toggleCategory(WITHDRAWN_KEY)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all group
              ${showingWithdrawn ? 'bg-slate-100 text-slate-600' : 'text-gray-400 hover:bg-gray-50'}`}
          >
            <span className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all
              ${showingWithdrawn ? 'bg-slate-500 border-slate-500' : 'border-gray-300 group-hover:border-slate-400'}`}>
              {showingWithdrawn && <CheckCircle2 size={10} className="text-white fill-white" />}
            </span>
            <span className="text-16 leading-none">📦</span>
            <span className="flex-1 font-medium text-13">
              {lang === 'en' ? 'Withdrawn Plans' : 'बंद योजनाएं'}
            </span>
            <span className={`text-10 font-bold px-1.5 py-0.5 rounded-full flex-shrink-0
              ${showingWithdrawn ? 'bg-slate-200 text-slate-600' : 'bg-gray-100 text-gray-400'}`}>
              {withdrawnPlans.length}
            </span>
          </button>
        </>
      )}

      {/* Sync info */}
      <div className="mt-6 px-3 pt-4 border-t border-gray-100">
        <div className="flex items-center gap-1.5 text-green-600 text-10 font-bold mb-1">
          <Zap size={10} fill="currentColor" /> Live Sync
        </div>
        <p className="text-10 text-gray-400">
          {lang === 'en' ? 'Last updated:' : 'अंतिम अपडेट:'} {data.meta.lastUpdated}
        </p>
        <p className="text-10 text-gray-400 mt-0.5">IRDAI Reg No. 512</p>
      </div>
    </div>
  )

  // ── active filter chips summary ──────────────────────────────────
  const activeFilterLabels = [...selected].map(k =>
    k === WITHDRAWN_KEY
      ? (lang === 'en' ? 'Withdrawn' : 'बंद')
      : categoryMeta[k]?.label[lang as keyof Category['label']] ?? k
  )

  return (
    <section className="py-12 bg-gray-50/30 min-h-screen">
      <div className="max-w-7xl mx-auto px-6">

        {/* Page header */}
        <div className="text-center mb-10">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="pw-eyebrow text-navy/60 mb-2">
            {lang === 'en' ? 'Institutional Grade Protection' : 'संस्थागत स्तर की सुरक्षा'}
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-32 md:text-48 font-display font-bold text-navy mb-4">
            {lang === 'en' ? 'Explore LIC Wealth Plans' : 'एलआईसी वेल्थ प्लान्स'}
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="text-15 text-gray-500 max-w-2xl mx-auto">
            {lang === 'en'
              ? 'Hand-picked solutions for wealth creation, family protection, and guaranteed retirement income.'
              : 'धन सृजन, परिवार की सुरक्षा और गारंटीड सेवानिवृत्ति आय के लिए चुने हुए समाधान।'}
          </motion.p>
        </div>

        {/* Mobile filter bar */}
        <div className="flex lg:hidden items-center gap-3 mb-4">
          <button
            onClick={() => setMobileFiltersOpen(true)}
            className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-13 font-semibold text-gray-700 shadow-sm"
          >
            <SlidersHorizontal size={14} />
            {lang === 'en' ? 'Filter' : 'फ़िल्टर'}
            {selected.size > 0 && (
              <span className="bg-navy text-white text-10 font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {selected.size}
              </span>
            )}
          </button>
          {/* Active filter chips on mobile */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {activeFilterLabels.map((label, i) => (
              <span key={i} className="flex-shrink-0 bg-navy/5 text-navy text-11 font-semibold px-2.5 py-1 rounded-full border border-navy/10">
                {label}
              </span>
            ))}
            {selected.size === 0 && (
              <span className="flex-shrink-0 bg-gold/10 text-gold text-11 font-semibold px-2.5 py-1 rounded-full border border-gold/20">
                {lang === 'en' ? 'All Plans' : 'सभी प्लान्स'}
              </span>
            )}
          </div>
        </div>

        {/* Mobile filter drawer */}
        <AnimatePresence>
          {mobileFiltersOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/40 z-40 lg:hidden"
                onClick={() => setMobileFiltersOpen(false)}
              />
              <motion.div
                initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="fixed top-0 left-0 h-full w-72 bg-white z-50 lg:hidden overflow-y-auto p-5 shadow-2xl"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-16 font-bold text-navy">
                    {lang === 'en' ? 'Filter Plans' : 'फ़िल्टर'}
                  </h3>
                  <button onClick={() => setMobileFiltersOpen(false)}
                    className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                    <X size={14} />
                  </button>
                </div>
                <SidebarContent />
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="w-full mt-6 bg-navy text-white rounded-xl py-3 font-bold text-13"
                >
                  {lang === 'en' ? `Show ${displayedPlans.length} Plans` : `${displayedPlans.length} प्लान दिखाएं`}
                </button>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Main layout: sidebar + grid */}
        <div className="flex gap-8 items-start">

          {/* ── Left sidebar (desktop only) ── */}
          <aside className="hidden lg:block w-56 flex-shrink-0 sticky top-6">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
              <h3 className="text-11 font-bold text-gray-400 uppercase tracking-widest mb-4 px-1">
                {lang === 'en' ? 'Browse by type' : 'प्रकार से खोजें'}
              </h3>
              <SidebarContent />
            </div>
          </aside>

          {/* ── Right content ── */}
          <div className="flex-1 min-w-0">

            {/* Results header */}
            <div className="flex items-center justify-between mb-5">
              <div>
                <span className="text-20 font-display font-bold text-navy">{displayedPlans.length}</span>
                <span className="text-14 text-gray-500 ml-2">
                  {lang === 'en' ? 'plans' : 'प्लान्स'}
                  {activeFilterLabels.length > 0 && (
                    <span className="text-gray-400"> · {activeFilterLabels.join(', ')}</span>
                  )}
                </span>
              </div>
              {selected.size > 0 && (
                <button
                  onClick={clearFilters}
                  className="text-12 text-navy/50 hover:text-navy underline underline-offset-2 transition-colors"
                >
                  {lang === 'en' ? 'Clear filters' : 'फ़िल्टर हटाएं'}
                </button>
              )}
            </div>

            {/* Plans grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              <AnimatePresence mode="popLayout">
                {(displayedPlans as any[]).map((plan, idx) => (
                  <motion.div
                    key={plan.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: Math.min(idx * 0.04, 0.3) }}
                    className={`bg-white rounded-2xl border transition-all duration-300 flex flex-col h-full overflow-hidden relative
                      ${plan.status === 'withdrawn' ? 'opacity-75' : ''}
                      ${expandedPlan === plan.id ? 'border-navy/20 shadow-xl' : 'border-gray-100 hover:border-navy/10 hover:shadow-card'}`}
                  >
                    {/* Status badges */}
                    {plan.status === 'new' && (
                      <div className="absolute top-4 right-4 z-20">
                        <span className="bg-green-500 text-white text-10 font-bold px-2 py-0.5 rounded shadow-sm uppercase tracking-widest animate-pulse">
                          New
                        </span>
                      </div>
                    )}
                    {plan.status === 'withdrawn' && (
                      <div className="absolute top-4 right-4 z-20">
                        <span className="bg-slate-400 text-white text-10 font-bold px-2 py-0.5 rounded uppercase tracking-widest">
                          Discontinued
                        </span>
                      </div>
                    )}

                    {/* Card top */}
                    <div className="p-5 pb-3">
                      <div className="flex justify-between items-start mb-3">
                        <span className="text-10 font-bold px-2 py-1 bg-gray-50 text-gray-500 rounded border border-gray-100 uppercase tracking-wider">
                          Plan {plan.planNo}
                        </span>
                        {/* Category badge — shown when All or multi-select */}
                        {(isShowingAll || selected.size > 1) && plan._catKey && data.categories[plan._catKey] && (
                          <span className="text-10 font-bold px-2 py-1 bg-navy/5 text-navy/60 rounded border border-navy/10 uppercase tracking-wider">
                            {data.categories[plan._catKey].icon} {data.categories[plan._catKey].label.en.replace(' Plans', '')}
                          </span>
                        )}
                      </div>

                      <h3 className="text-16 font-bold text-navy mb-1.5 line-clamp-1">
                        {plan.name[lang as keyof typeof plan.name] || plan.name.en}
                      </h3>
                      <p className="text-12 text-gray-500 italic mb-3 line-clamp-2">
                        {plan.tagline[lang as keyof typeof plan.tagline] || ''}
                      </p>

                      <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 mb-3">
                        <div className="text-10 font-bold text-gray-400 uppercase tracking-wider mb-0.5">Key Advantage</div>
                        <div className="text-12 font-semibold text-navy leading-snug">
                          {plan.keyBenefit[lang as keyof typeof plan.keyBenefit] || ''}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-white border border-gray-50 p-2 rounded-md">
                          <div className="text-10 text-gray-400">Entry Age</div>
                          <div className="text-12 font-bold text-navy">{plan.entryAge || '—'}</div>
                        </div>
                        <div className="bg-white border border-gray-50 p-2 rounded-md">
                          <div className="text-10 text-gray-400">Cover</div>
                          <div className="text-12 font-bold text-navy truncate">{plan.sumAssured || '—'}</div>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-auto p-5 pt-0 space-y-2">
                      {plan.status === 'withdrawn' ? (
                        <div className="w-full h-10 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-center gap-2 text-12 text-slate-500 font-medium">
                          <Info size={13} className="text-slate-400" />
                          {lang === 'en' ? 'Discontinued — calculator only' : 'बंद — केवल कैलकुलेटर'}
                        </div>
                      ) : (
                        <button
                          onClick={() => handleGetPlan(plan.name.en)}
                          className="w-full h-10 text-white rounded-xl font-bold text-12 shadow-sm transition-all flex items-center justify-center gap-2 group bg-gradient-to-r from-navy to-navy-light hover:shadow-navy/20"
                        >
                          {lang === 'en' ? 'Get This Plan' : 'यह प्लान पाएं'}
                          <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                      )}
                      <button
                        onClick={() => setExpandedPlan(expandedPlan === plan.id ? null : plan.id)}
                        className="w-full text-11 font-bold text-gray-400 hover:text-navy transition-colors flex items-center justify-center gap-1"
                      >
                        {expandedPlan === plan.id
                          ? (lang === 'en' ? '▲ Hide details' : '▲ छुपाएं')
                          : (lang === 'en' ? '▼ View benefits' : '▼ लाभ देखें')}
                      </button>
                    </div>

                    {/* Expanded */}
                    <AnimatePresence>
                      {expandedPlan === plan.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden bg-gray-50 border-t border-gray-100"
                        >
                          <div className="p-5 space-y-3">
                            <div className="text-11 font-bold text-gray-400 uppercase tracking-widest">Highlights</div>
                            <div className="space-y-2">
                              {plan.highlights?.length > 0 ? plan.highlights.map((h: any, i: number) => (
                                <div key={i} className="flex items-start gap-2 text-12 text-gray-600">
                                  <CheckCircle2 size={13} className="text-green-500 mt-0.5 flex-shrink-0" />
                                  {h[lang as keyof typeof h] || h.en}
                                </div>
                              )) : (
                                <div className="flex items-start gap-2 text-12 text-gray-500">
                                  <Info size={13} className="text-navy/40 mt-0.5 flex-shrink-0" />
                                  {lang === 'en' ? 'Standard LIC benefits apply' : 'मानक एलआईसी लाभ लागू'}
                                </div>
                              )}
                            </div>
                            <a href={plan.officialUrl} target="_blank" rel="noopener noreferrer"
                              className="block text-center text-11 font-bold text-navy/40 hover:text-navy transition-colors underline uppercase tracking-tighter">
                              View Official IRDAI Document →
                            </a>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </AnimatePresence>

              {displayedPlans.length === 0 && (
                <div className="col-span-full py-16 text-center text-gray-400 text-14">
                  {lang === 'en' ? 'No plans match your selection.' : 'कोई प्लान नहीं मिला।'}
                </div>
              )}
            </div>

            {/* Footer note */}
            <div className="mt-12 text-center text-gray-400 text-11 border-t border-gray-100 pt-6">
              <p className="mb-1 italic">
                {lang === 'en'
                  ? `Synced with official LIC records: ${data.meta.lastUpdated}`
                  : `आधिकारिक रिकॉर्ड से सिंक: ${data.meta.lastUpdated}`}
              </p>
              <p>{lang === 'en' ? 'All benefits subject to standard LIC terms & conditions.' : 'सभी लाभ मानक शर्तों के अधीन।'}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
