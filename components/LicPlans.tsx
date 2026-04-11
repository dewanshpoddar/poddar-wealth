'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLang } from '@/lib/LangContext'
import { ArrowRight, Info, CheckCircle2, Zap, SlidersHorizontal, X, Search, Shield } from 'lucide-react'
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

// Category accent colors (static for Tailwind + inline style usage)
const CAT_ACCENT: Record<string, string> = {
  endowment:  '#2563EB',
  wholeLife:  '#059669',
  moneyBack:  '#D97706',
  term:       '#DC2626',
  child:      '#DB2777',
  pension:    '#7C3AED',
  ulip:       '#0891B2',
  micro:      '#EA580C',
}

const PREMIUM_MODES = [
  { key: 'regular', label: { en: 'Regular Pay',  hi: 'नियमित' },   icon: '📅', hint: { en: 'Pay throughout term',  hi: 'पूरी अवधि भुगतान' } },
  { key: 'limited', label: { en: 'Limited Pay',  hi: 'सीमित' },    icon: '⏱️', hint: { en: 'Pay for fewer years',   hi: 'कम वर्षों में' } },
  { key: 'single',  label: { en: 'Single Pay',   hi: 'एकमुश्त' },  icon: '💵', hint: { en: 'One-time payment',      hi: 'एक बार भुगतान' } },
]

const COVER_TIERS = [
  { key: 'starter', label: { en: 'Up to ₹5 Lakh',  hi: '₹5 लाख तक' }, icon: '🌱' },
  { key: 'mid',     label: { en: '₹5L – ₹25L',      hi: '₹5L–₹25L' },  icon: '📈' },
  { key: 'high',    label: { en: '₹25 Lakh+',        hi: '₹25 लाख+' },  icon: '🏆' },
]

function getPremiumModes(pp: string): string[] {
  const lower = pp.toLowerCase()
  const modes: string[] = []
  if (lower.includes('regular')) modes.push('regular')
  if (lower.includes('limited')) modes.push('limited')
  if (lower.includes('single')) modes.push('single')
  return modes
}

function getSumTier(sa: string): string {
  const cleaned = sa.replace(/[₹,+\s]/g, '')
  const num = parseInt(cleaned.split(/[-–(]/)[0]) || 0
  if (num >= 2500000) return 'high'
  if (num >= 500000)  return 'mid'
  return 'starter'
}

export default function LicPlans() {
  const { lang } = useLang()
  const [data, setData]                     = useState<LicData | null>(null)
  const [loading, setLoading]               = useState(true)
  const [expandedPlan, setExpandedPlan]     = useState<string | null>(null)
  const [selected, setSelected]             = useState<Set<string>>(new Set())
  const [premiumFilter, setPremiumFilter]   = useState<Set<string>>(new Set())
  const [coverFilter, setCoverFilter]       = useState<Set<string>>(new Set())
  const [searchQuery, setSearchQuery]       = useState('')
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  useEffect(() => {
    fetch('/api/lic-plans?view=all')
      .then(r => r.json())
      .then(res => { if (res.success) setData(res.data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  // ── derived data ──────────────────────────────────────────────────
  const { activePlans, withdrawnPlans, categoryMeta } = useMemo(() => {
    if (!data) return { activePlans: [], withdrawnPlans: [], categoryMeta: {} }
    const activePlans:   (Plan & { _catKey: string })[] = []
    const withdrawnPlans:(Plan & { _catKey: string })[] = []
    const categoryMeta: Record<string, { label: Category['label']; icon: string; color: string; count: number }> = {}
    for (const [key, cat] of Object.entries(data.categories)) {
      const activeInCat = cat.plans.filter(p => p.status !== 'withdrawn')
      const wdrInCat    = cat.plans.filter(p => p.status === 'withdrawn')
      activeInCat.forEach(p => activePlans.push({ ...p, _catKey: key }))
      wdrInCat.forEach(p =>    withdrawnPlans.push({ ...p, _catKey: key }))
      if (activeInCat.length > 0)
        categoryMeta[key] = { label: cat.label, icon: cat.icon, color: cat.color, count: activeInCat.length }
    }
    return { activePlans, withdrawnPlans, categoryMeta }
  }, [data])

  // ── filtered plan list ────────────────────────────────────────────
  const displayedPlans = useMemo(() => {
    const catKeys = new Set([...selected].filter(k => k !== WITHDRAWN_KEY))
    const includeWithdrawn = selected.has(WITHDRAWN_KEY)

    let base: (Plan & { _catKey: string })[]
    if (selected.size === 0) {
      base = [...activePlans]
    } else {
      base = []
      if (catKeys.size > 0) base.push(...activePlans.filter(p => catKeys.has(p._catKey)))
      if (includeWithdrawn) base.push(...withdrawnPlans)
    }

    if (premiumFilter.size > 0)
      base = base.filter(p => getPremiumModes(p.premiumPayment).some(m => premiumFilter.has(m)))

    if (coverFilter.size > 0)
      base = base.filter(p => coverFilter.has(getSumTier(p.sumAssured)))

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      base = base.filter(p =>
        p.name.en.toLowerCase().includes(q) ||
        p.name.hi.includes(searchQuery) ||
        p.planNo.includes(q) ||
        p.keyBenefit.en.toLowerCase().includes(q)
      )
    }
    return base
  }, [selected, premiumFilter, coverFilter, searchQuery, activePlans, withdrawnPlans])

  // ── filter helpers ────────────────────────────────────────────────
  const toggleCategory = (key: string) => {
    setSelected(prev => { const n = new Set(prev); n.has(key) ? n.delete(key) : n.add(key); return n })
    setExpandedPlan(null)
  }
  const togglePremium = (key: string) =>
    setPremiumFilter(prev => { const n = new Set(prev); n.has(key) ? n.delete(key) : n.add(key); return n })
  const toggleCover = (key: string) =>
    setCoverFilter(prev => { const n = new Set(prev); n.has(key) ? n.delete(key) : n.add(key); return n })
  const clearAllFilters = () => {
    setSelected(new Set()); setPremiumFilter(new Set())
    setCoverFilter(new Set()); setSearchQuery(''); setExpandedPlan(null)
  }

  const isShowingAll      = selected.size === 0 && premiumFilter.size === 0 && coverFilter.size === 0 && !searchQuery
  const showingWithdrawn  = selected.has(WITHDRAWN_KEY)
  const totalFiltersActive= selected.size + premiumFilter.size + coverFilter.size + (searchQuery ? 1 : 0)

  const handleGetPlan = (planName: string) => openLeadPopup(`Interest in ${planName}`)

  // ── loading ───────────────────────────────────────────────────────
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50/30">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-navy/10 border-t-navy rounded-full animate-spin" />
        <p className="text-14 font-bold text-navy/40 uppercase tracking-widest">Loading Plans...</p>
      </div>
    </div>
  )

  if (!data || !data.categories) return null

  // ── sidebar filter panel (shared desktop + mobile drawer) ────────
  const SidebarFilters = (
    <div className="space-y-0.5">
      {/* Search */}
      <div className="relative mb-3">
        <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        <input
          type="text"
          placeholder={lang === 'en' ? 'Search plans...' : 'प्लान खोजें...'}
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="w-full pl-8 pr-7 py-2 text-12 border border-gray-200 rounded-xl focus:outline-none focus:border-navy/40 bg-gray-50 placeholder-gray-400"
        />
        {searchQuery && (
          <button onClick={() => setSearchQuery('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
            <X size={12} />
          </button>
        )}
      </div>

      {/* All Plans */}
      <button onClick={clearAllFilters}
        className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left transition-all group
          ${isShowingAll ? 'bg-gold/10 text-gold' : 'text-gray-600 hover:bg-gray-50'}`}>
        <span className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all
          ${isShowingAll ? 'bg-gold border-gold' : 'border-gray-300 group-hover:border-gold/50'}`}>
          {isShowingAll && <CheckCircle2 size={9} className="text-white fill-white" />}
        </span>
        <span className="text-16 leading-none">🏆</span>
        <span className="flex-1 font-semibold text-13">{lang === 'en' ? 'All Active Plans' : 'सभी सक्रिय'}</span>
        <span className={`text-10 font-bold px-1.5 py-0.5 rounded-full flex-shrink-0
          ${isShowingAll ? 'bg-gold/20 text-gold' : 'bg-gray-100 text-gray-500'}`}>
          {activePlans.length}
        </span>
      </button>

      {/* ── By Plan Type ── */}
      <div className="pt-3 pb-1">
        <p className="text-10 font-bold text-gray-400 uppercase tracking-widest px-3 mb-2">
          {lang === 'en' ? 'By Plan Type' : 'प्लान प्रकार'}
        </p>
        {Object.entries(categoryMeta).map(([key, meta]) => {
          const isActive = selected.has(key)
          const accent = CAT_ACCENT[key] || '#1B4F72'
          return (
            <button key={key} onClick={() => toggleCategory(key)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left transition-all group
                ${isActive ? 'text-gray-800' : 'text-gray-600 hover:bg-gray-50'}`}
              style={{ background: isActive ? `${accent}0f` : undefined }}>
              <span className="w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all"
                style={{ background: isActive ? accent : 'transparent', borderColor: isActive ? accent : '#D1D5DB' }}>
                {isActive && <CheckCircle2 size={9} className="text-white fill-white" />}
              </span>
              <span className="text-15 leading-none flex-shrink-0">{meta.icon}</span>
              <span className="flex-1 font-medium text-12 leading-snug">{meta.label[lang as keyof typeof meta.label]}</span>
              <span className="text-10 font-bold px-1.5 py-0.5 rounded-full flex-shrink-0"
                style={{ background: isActive ? `${accent}18` : '#F3F4F6', color: isActive ? accent : '#6B7280' }}>
                {meta.count}
              </span>
            </button>
          )
        })}
      </div>

      {/* ── By Premium Mode ── */}
      <div className="pt-2 pb-1 border-t border-gray-100">
        <p className="text-10 font-bold text-gray-400 uppercase tracking-widest px-3 mt-3 mb-2">
          {lang === 'en' ? 'By Premium Mode' : 'प्रीमियम मोड'}
        </p>
        {PREMIUM_MODES.map(mode => {
          const isActive = premiumFilter.has(mode.key)
          return (
            <button key={mode.key} onClick={() => togglePremium(mode.key)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left transition-all group
                ${isActive ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50'}`}>
              <span className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all
                ${isActive ? 'bg-indigo-600 border-indigo-600' : 'border-gray-300 group-hover:border-indigo-300'}`}>
                {isActive && <CheckCircle2 size={9} className="text-white fill-white" />}
              </span>
              <span className="text-14 leading-none flex-shrink-0">{mode.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-12">{mode.label[lang as keyof typeof mode.label]}</div>
                <div className="text-10 text-gray-400 leading-none mt-0.5">{mode.hint[lang as keyof typeof mode.hint]}</div>
              </div>
            </button>
          )
        })}
      </div>

      {/* ── By Cover Amount ── */}
      <div className="pt-2 pb-1 border-t border-gray-100">
        <p className="text-10 font-bold text-gray-400 uppercase tracking-widest px-3 mt-3 mb-2">
          {lang === 'en' ? 'By Cover Amount' : 'कवर राशि'}
        </p>
        {COVER_TIERS.map(tier => {
          const isActive = coverFilter.has(tier.key)
          const tierCount = activePlans.filter(p => getSumTier(p.sumAssured) === tier.key).length
          return (
            <button key={tier.key} onClick={() => toggleCover(tier.key)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left transition-all group
                ${isActive ? 'bg-emerald-50 text-emerald-700' : 'text-gray-600 hover:bg-gray-50'}`}>
              <span className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all
                ${isActive ? 'bg-emerald-600 border-emerald-600' : 'border-gray-300 group-hover:border-emerald-300'}`}>
                {isActive && <CheckCircle2 size={9} className="text-white fill-white" />}
              </span>
              <span className="text-14 leading-none flex-shrink-0">{tier.icon}</span>
              <span className="flex-1 font-medium text-12">{tier.label[lang as keyof typeof tier.label]}</span>
              <span className={`text-10 font-bold px-1.5 py-0.5 rounded-full flex-shrink-0
                ${isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                {tierCount}
              </span>
            </button>
          )
        })}
      </div>

      {/* ── Discontinued ── */}
      {withdrawnPlans.length > 0 && (
        <div className="pt-2 border-t border-gray-100">
          <p className="text-10 font-bold text-gray-400 uppercase tracking-widest px-3 mt-3 mb-1">
            {lang === 'en' ? 'Discontinued' : 'बंद योजनाएं'}
          </p>
          <button onClick={() => toggleCategory(WITHDRAWN_KEY)}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left transition-all group
              ${showingWithdrawn ? 'bg-slate-100 text-slate-600' : 'text-gray-400 hover:bg-gray-50'}`}>
            <span className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all
              ${showingWithdrawn ? 'bg-slate-500 border-slate-500' : 'border-gray-300 group-hover:border-slate-400'}`}>
              {showingWithdrawn && <CheckCircle2 size={9} className="text-white fill-white" />}
            </span>
            <span className="text-14 leading-none flex-shrink-0">📦</span>
            <span className="flex-1 font-medium text-12">{lang === 'en' ? 'Withdrawn Plans' : 'बंद योजनाएं'}</span>
            <span className={`text-10 font-bold px-1.5 py-0.5 rounded-full flex-shrink-0
              ${showingWithdrawn ? 'bg-slate-200 text-slate-600' : 'bg-gray-100 text-gray-400'}`}>
              {withdrawnPlans.length}
            </span>
          </button>
          <p className="text-10 text-gray-400 px-3 mt-1 leading-snug">
            {lang === 'en' ? 'Calculator access — no new policies' : 'केवल कैलकुलेटर'}
          </p>
        </div>
      )}

      {/* Sync badge */}
      <div className="mt-4 px-3 pt-4 border-t border-gray-100">
        <div className="flex items-center gap-1.5 text-green-600 text-10 font-bold mb-1">
          <Zap size={10} fill="currentColor" /> Auto-synced daily
        </div>
        <p className="text-10 text-gray-400">{lang === 'en' ? 'Last updated:' : 'अंतिम अपडेट:'} {data.meta.lastUpdated}</p>
        <p className="text-10 text-gray-400 mt-0.5">IRDAI Reg No. 512</p>
      </div>
    </div>
  )

  return (
    <section className="bg-gray-50/40 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-10">

        {/* ══════════════════════════════════════════
            Hero Header
        ══════════════════════════════════════════ */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#07111f] via-[#0D1F3C] to-[#1a3a72] text-white px-6 md:px-14 py-12 md:py-16 mb-10">
          {/* Decorative blur blobs */}
          <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-blue-500/15 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-yellow-400/8 blur-3xl pointer-events-none" />
          {/* Subtle diagonal lines texture */}
          <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
            style={{ backgroundImage: 'repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 0, transparent 50%)' ,backgroundSize: '20px 20px' }} />

          <div className="relative z-10 text-center">
            {/* Trust badge */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 bg-white/10 border border-white/15 rounded-full px-4 py-1.5 text-11 font-bold uppercase tracking-widest text-white/75 mb-5">
              <Shield size={10} className="flex-shrink-0" />
              {lang === 'en' ? 'IRDAI Reg. 512 · Est. 1956 · Govt. of India Backed' : 'IRDAI रेग. 512 · 1956 से · सरकार समर्थित'}
            </motion.div>

            <motion.h1 initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}
              className="text-34 md:text-54 font-display font-bold mb-3 leading-tight tracking-tight">
              {lang === 'en' ? 'Explore LIC Wealth Plans' : 'एलआईसी वेल्थ प्लान्स'}
            </motion.h1>

            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.16 }}
              className="text-14 md:text-16 text-white/60 max-w-xl mx-auto mb-10 leading-relaxed">
              {lang === 'en'
                ? 'Hand-picked solutions for wealth creation, family protection, and guaranteed retirement income.'
                : 'धन सृजन, परिवार की सुरक्षा और गारंटीड सेवानिवृत्ति आय के लिए चुने हुए समाधान।'}
            </motion.p>

            {/* Stats strip */}
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.22 }}
              className="inline-grid grid-cols-3 divide-x divide-white/10 bg-white/10 border border-white/10 rounded-2xl overflow-hidden">
              {[
                { val: activePlans.length, label: lang === 'en' ? 'Active Plans' : 'सक्रिय प्लान्स' },
                { val: Object.keys(categoryMeta).length, label: lang === 'en' ? 'Categories' : 'श्रेणियाँ' },
                { val: '68+', label: lang === 'en' ? 'Years of Trust' : 'वर्षों का विश्वास' },
              ].map(({ val, label }) => (
                <div key={label} className="px-7 md:px-10 py-4">
                  <div className="text-28 md:text-36 font-bold text-white leading-none mb-1">{val}</div>
                  <div className="text-10 text-white/50 uppercase tracking-widest font-semibold">{label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* ══════════════════════════════════════════
            Mobile: filter bar + search
        ══════════════════════════════════════════ */}
        <div className="flex lg:hidden items-center gap-2 mb-4">
          <button onClick={() => setMobileFiltersOpen(true)}
            className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-13 font-semibold text-gray-700 shadow-sm flex-shrink-0">
            <SlidersHorizontal size={14} />
            {lang === 'en' ? 'Filters' : 'फ़िल्टर'}
            {totalFiltersActive > 0 && (
              <span className="bg-navy text-white text-10 font-bold min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center">
                {totalFiltersActive}
              </span>
            )}
          </button>
          <div className="flex-1 relative">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input
              type="text"
              placeholder={lang === 'en' ? 'Search plans...' : 'खोजें...'}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-2.5 text-13 border border-gray-200 rounded-xl focus:outline-none focus:border-navy/40 bg-white"
            />
          </div>
        </div>

        {/* Mobile filter drawer */}
        <AnimatePresence>
          {mobileFiltersOpen && (
            <>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/40 z-40 lg:hidden"
                onClick={() => setMobileFiltersOpen(false)} />
              <motion.div
                initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="fixed top-0 left-0 h-full w-80 bg-white z-50 lg:hidden overflow-y-auto p-5 shadow-2xl">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-16 font-bold text-navy">{lang === 'en' ? 'Filter Plans' : 'फ़िल्टर'}</h3>
                  <button onClick={() => setMobileFiltersOpen(false)}
                    className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
                    <X size={14} />
                  </button>
                </div>
                {SidebarFilters}
                <button onClick={() => setMobileFiltersOpen(false)}
                  className="w-full mt-6 bg-navy text-white rounded-xl py-3 font-bold text-13">
                  {lang === 'en' ? `Show ${displayedPlans.length} Plans` : `${displayedPlans.length} प्लान दिखाएं`}
                </button>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* ══════════════════════════════════════════
            Main layout: Sidebar + Grid
        ══════════════════════════════════════════ */}
        <div className="flex gap-6 items-start">

          {/* ── Left sidebar (desktop) ── */}
          <aside className="hidden lg:block w-64 flex-shrink-0 sticky top-6">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
              <div className="flex items-center justify-between mb-4 px-1">
                <h3 className="text-11 font-bold text-gray-400 uppercase tracking-widest">
                  {lang === 'en' ? 'Filter Plans' : 'फ़िल्टर'}
                </h3>
                {totalFiltersActive > 0 && (
                  <button onClick={clearAllFilters}
                    className="text-10 text-navy/50 hover:text-navy font-semibold underline underline-offset-2 transition-colors">
                    {lang === 'en' ? 'Clear all' : 'साफ़ करें'}
                  </button>
                )}
              </div>
              {SidebarFilters}
            </div>
          </aside>

          {/* ── Right: results ── */}
          <div className="flex-1 min-w-0">

            {/* Results bar */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-baseline gap-2">
                <span className="text-22 font-display font-bold text-navy">{displayedPlans.length}</span>
                <span className="text-13 text-gray-500">
                  {lang === 'en' ? 'plans' : 'प्लान्स'}
                  {totalFiltersActive > 0 && (
                    <span className="text-gray-400">
                      {' '}·{' '}{lang === 'en' ? 'filtered' : 'फ़िल्टर किए'}
                    </span>
                  )}
                </span>
              </div>
              {totalFiltersActive > 0 && (
                <button onClick={clearAllFilters}
                  className="hidden md:block text-12 text-navy/50 hover:text-navy underline underline-offset-2 transition-colors">
                  {lang === 'en' ? 'Clear filters' : 'फ़िल्टर हटाएं'}
                </button>
              )}
            </div>

            {/* ── Plan cards grid ── */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              <AnimatePresence mode="popLayout">
                {(displayedPlans as any[]).map((plan, idx) => {
                  const accent = CAT_ACCENT[plan._catKey] || '#1B4F72'
                  const modes  = getPremiumModes(plan.premiumPayment)
                  const modeLabel = modes.map(m =>
                    m === 'regular' ? (lang === 'en' ? 'Reg' : 'नियमित') :
                    m === 'limited' ? (lang === 'en' ? 'Ltd' : 'सीमित') :
                    (lang === 'en' ? '1×Pay' : 'एकमुश्त')
                  ).join(' / ')

                  return (
                    <motion.div
                      key={plan.id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ delay: Math.min(idx * 0.04, 0.3) }}
                      className={`bg-white rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all duration-300 flex flex-col overflow-hidden border-l-[3px]
                        ${plan.status === 'withdrawn' ? 'opacity-80' : ''}
                        ${expandedPlan === plan.id ? 'shadow-xl border-gray-200' : ''}`}
                      style={{ borderLeftColor: accent }}
                    >
                      {/* Status badges */}
                      {plan.status === 'new' && (
                        <div className="absolute top-3 right-3 z-20">
                          <span className="bg-green-500 text-white text-10 font-bold px-2 py-0.5 rounded-full shadow-sm uppercase tracking-wide animate-pulse">New</span>
                        </div>
                      )}
                      {plan.status === 'withdrawn' && (
                        <div className="absolute top-3 right-3 z-10">
                          <span className="bg-slate-400 text-white text-10 font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">Discontinued</span>
                        </div>
                      )}

                      <div className="p-5 flex flex-col gap-3">
                        {/* Plan no + category badge */}
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-10 font-bold px-2 py-1 bg-gray-50 text-gray-400 rounded-lg border border-gray-100 uppercase tracking-wider flex-shrink-0">
                            Plan {plan.planNo}
                          </span>
                          {(isShowingAll || selected.size > 1) && plan._catKey && data.categories[plan._catKey] && (
                            <span className="text-10 font-semibold px-2 py-1 rounded-lg border flex-shrink-0"
                              style={{ background: `${accent}12`, borderColor: `${accent}25`, color: accent }}>
                              {data.categories[plan._catKey].icon} {data.categories[plan._catKey].label.en.replace(' Plans', '').replace(' Insurance', '')}
                            </span>
                          )}
                        </div>

                        {/* Name + tagline */}
                        <div>
                          <h3 className="text-15 font-bold text-navy mb-1 leading-snug">
                            {plan.name[lang as keyof typeof plan.name] || plan.name.en}
                          </h3>
                          <p className="text-11 text-gray-400 italic leading-snug line-clamp-1">
                            {plan.tagline[lang as keyof typeof plan.tagline] || ''}
                          </p>
                        </div>

                        {/* Key advantage */}
                        <div className="rounded-xl p-3 border" style={{ background: `${accent}08`, borderColor: `${accent}1a` }}>
                          <div className="text-10 font-bold uppercase tracking-wider mb-0.5" style={{ color: accent }}>
                            {lang === 'en' ? 'Key Advantage' : 'मुख्य लाभ'}
                          </div>
                          <div className="text-12 font-semibold text-gray-800 leading-snug">
                            {plan.keyBenefit[lang as keyof typeof plan.keyBenefit] || ''}
                          </div>
                        </div>

                        {/* 3-col meta grid */}
                        <div className="grid grid-cols-3 gap-1.5">
                          <div className="bg-gray-50 border border-gray-100 p-2 rounded-lg">
                            <div className="text-10 text-gray-400 font-semibold uppercase tracking-wide mb-0.5">Entry Age</div>
                            <div className="text-11 font-bold text-navy leading-tight">{plan.entryAge || '—'}</div>
                          </div>
                          <div className="bg-gray-50 border border-gray-100 p-2 rounded-lg">
                            <div className="text-10 text-gray-400 font-semibold uppercase tracking-wide mb-0.5">Cover</div>
                            <div className="text-11 font-bold text-navy leading-tight truncate">{plan.sumAssured || '—'}</div>
                          </div>
                          <div className="bg-gray-50 border border-gray-100 p-2 rounded-lg">
                            <div className="text-10 text-gray-400 font-semibold uppercase tracking-wide mb-0.5">Pay Mode</div>
                            <div className="text-11 font-bold text-navy leading-tight">{modeLabel || '—'}</div>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="px-5 pb-4 space-y-2">
                        {plan.status === 'withdrawn' ? (
                          <div className="w-full h-10 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-center gap-2 text-11 text-slate-500 font-medium">
                            <Info size={12} className="text-slate-400 flex-shrink-0" />
                            {lang === 'en' ? 'Discontinued — calculator access only' : 'बंद — केवल कैलकुलेटर'}
                          </div>
                        ) : (
                          <button onClick={() => handleGetPlan(plan.name.en)}
                            className="w-full h-10 text-white rounded-xl font-bold text-12 shadow-sm transition-all flex items-center justify-center gap-2 group hover:shadow-lg hover:brightness-110"
                            style={{ background: `linear-gradient(135deg, ${accent}, ${accent}dd)` }}>
                            {lang === 'en' ? 'Get This Plan' : 'यह प्लान पाएं'}
                            <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                          </button>
                        )}
                        <button
                          onClick={() => setExpandedPlan(expandedPlan === plan.id ? null : plan.id)}
                          className="w-full text-11 font-bold text-gray-400 hover:text-navy transition-colors flex items-center justify-center gap-1 py-0.5">
                          {expandedPlan === plan.id
                            ? (lang === 'en' ? '▲ Hide details' : '▲ छुपाएं')
                            : (lang === 'en' ? '▼ View all benefits' : '▼ सभी लाभ देखें')}
                        </button>
                      </div>

                      {/* Expanded highlights panel */}
                      <AnimatePresence>
                        {expandedPlan === plan.id && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden border-t border-gray-100">
                            <div className="bg-gray-50/80 p-4 space-y-3">
                              <div className="text-11 font-bold text-gray-400 uppercase tracking-widest">Plan Highlights</div>
                              <div className="space-y-2">
                                {plan.highlights?.length > 0 ? plan.highlights.map((h: any, i: number) => (
                                  <div key={i} className="flex items-start gap-2 text-12 text-gray-700">
                                    <CheckCircle2 size={13} className="mt-0.5 flex-shrink-0" style={{ color: accent }} />
                                    {h[lang as keyof typeof h] || h.en}
                                  </div>
                                )) : (
                                  <div className="flex items-start gap-2 text-12 text-gray-500">
                                    <Info size={12} className="text-navy/30 mt-0.5 flex-shrink-0" />
                                    {lang === 'en' ? 'Standard LIC benefits apply' : 'मानक LIC लाभ लागू'}
                                  </div>
                                )}
                              </div>
                              <a href={plan.officialUrl} target="_blank" rel="noopener noreferrer"
                                className="block text-center text-11 font-bold text-navy/40 hover:text-navy transition-colors underline uppercase tracking-tighter">
                                {lang === 'en' ? 'View Official IRDAI Document →' : 'आधिकारिक IRDAI दस्तावेज़ →'}
                              </a>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  )
                })}
              </AnimatePresence>

              {displayedPlans.length === 0 && (
                <div className="col-span-full py-20 text-center">
                  <div className="text-44 mb-3">🔍</div>
                  <div className="text-15 font-bold text-gray-600 mb-1">
                    {lang === 'en' ? 'No plans match your filters' : 'कोई प्लान नहीं मिला'}
                  </div>
                  <p className="text-12 text-gray-400 mb-5">
                    {lang === 'en' ? 'Try adjusting your filter or search term' : 'फ़िल्टर बदलें या दूसरे शब्द खोजें'}
                  </p>
                  <button onClick={clearAllFilters}
                    className="text-navy text-13 font-bold underline underline-offset-2">
                    {lang === 'en' ? 'Clear all filters' : 'सभी फ़िल्टर हटाएं'}
                  </button>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="mt-12 text-center text-gray-400 text-11 border-t border-gray-100 pt-6">
              <p className="mb-1 italic">
                {lang === 'en'
                  ? `Auto-synced with LIC India official records — ${data.meta.lastUpdated}`
                  : `एलआईसी इंडिया के आधिकारिक रिकॉर्ड से स्वत: सिंक — ${data.meta.lastUpdated}`}
              </p>
              <p>{lang === 'en' ? 'All plans subject to standard LIC terms & IRDAI regulations.' : 'सभी प्लान LIC की मानक शर्तों और IRDAI नियमों के अधीन।'}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
