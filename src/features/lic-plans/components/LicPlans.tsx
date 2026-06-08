'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { useLang } from '@/lib/LangContext'
import { ArrowRight, Info, CheckCircle2, Zap, SlidersHorizontal, X, Search, Shield, ChevronDown, ChevronUp, Trophy, Flame, TrendingUp, Star, Sparkles, Landmark, Coins, Infinity as InfinityIcon, GraduationCap, LineChart, BarChart3, Sprout } from 'lucide-react'
import { openLeadPopup } from '@/lib/events'

function getBadgeIcon(emoji: string) {
  const cleanEmoji = emoji.replace(/[\ufe0f\u200d]/g, '').trim()
  switch (cleanEmoji) {
    case '🏆': return <Trophy size={11} className="inline" />
    case '🔥': return <Flame size={11} className="inline fill-current" />
    case '📈': return <TrendingUp size={11} className="inline" />
    case '⭐': return <Star size={11} className="inline fill-current" />
    case '✨': return <Sparkles size={11} className="inline" />
    default: return null
  }
}

function getCategoryIcon(emoji: string) {
  const cleanEmoji = emoji.replace(/[\ufe0f\u200d]/g, '').trim()
  switch (cleanEmoji) {
    case '🏦': return <Landmark size={14} className="inline" />
    case '💰': return <Coins size={14} className="inline" />
    case '♾️': return <InfinityIcon size={14} className="inline" />
    case '🛡️': return <Shield size={14} className="inline" />
    case '🎓': return <GraduationCap size={14} className="inline" />
    case '📈': return <LineChart size={14} className="inline" />
    case '📊': return <BarChart3 size={14} className="inline" />
    case '🌾': return <Sprout size={14} className="inline" />
    default: return null
  }
}

import { useLicPlans } from '../hooks/useLicPlans'
import {
  CAT_ACCENT,
  PLAN_BADGES,
  GOALS,
  AGE_GROUPS,
  RETURN_TYPES,
  PREMIUM_MODES,
  COVER_TIERS,
  getPremiumModes,
  getSumTier,
  matchesAgeGroup
} from '../domain/licPlansEngine'

// ── FilterSection wrapper ────────────────────────────────────────────────────
function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-t border-gray-100 pt-3 pb-1 mt-1">
      <p className="text-9 font-bold text-gray-400 uppercase tracking-widest px-2 mb-1.5">{title}</p>
      {children}
    </div>
  )
}

// ── FilterPill button ────────────────────────────────────────────────────────
function FilterPill({
  isActive, accent, onClick, label, count
}: {
  isActive: boolean; accent?: string; onClick: () => void
  label: string; count?: number
}) {
  const bg = accent ? (isActive ? `${accent}12` : undefined) : undefined
  const textColor = isActive ? (accent || '#1B4F72') : '#4B5563'
  return (
    <button onClick={onClick}
      className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-left transition-all group
        ${!accent && isActive ? 'bg-navy/8' : ''}
        ${!isActive ? 'hover:bg-gray-50' : ''}`}
      style={{ background: bg }}>
      <span className="w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all"
        style={{
          background: isActive ? (accent || '#1B4F72') : 'transparent',
          borderColor: isActive ? (accent || '#1B4F72') : '#D1D5DB',
        }}>
        {isActive && <CheckCircle2 size={9} className="text-white fill-white" />}
      </span>
      <span className="flex-1 font-medium text-12 leading-snug" style={{ color: textColor }}>{label}</span>
      {count !== undefined && (
        <span className="text-10 font-bold px-1.5 py-0.5 rounded-full flex-shrink-0 tabular-nums"
          style={{
            background: isActive ? (accent ? `${accent}20` : '#e0e7ff') : '#F3F4F6',
            color: isActive ? (accent || '#1B4F72') : '#9CA3AF',
          }}>
          {count}
        </span>
      )}
    </button>
  )
}

export default function LicPlans() {
  const { lang } = useLang()
  const { state, actions, computed } = useLicPlans()
  
  const {
    data, loading, expandedPlan, catFilter, goalFilter, ageFilter, returnsFilter,
    premiumFilter, coverFilter, searchQuery, mobileFiltersOpen, showWithdrawn
  } = state
  
  const {
    setExpandedPlan, setCatFilter, setGoalFilter, setAgeFilter, setReturnsFilter,
    setPremiumFilter, setCoverFilter, setSearchQuery, setMobileFiltersOpen, setShowWithdrawn,
    clearAllFilters, toggle
  } = actions
  
  const {
    activePlans, withdrawnPlans, categoryMeta, displayedPlans, totalFiltersActive, isShowingAll
  } = computed

  const [activeMobileTab, setActiveMobileTab] = useState<string>('all')

  const mobileTabs = [
    { key: 'all', label: { en: 'All', hi: 'सभी' } },
    { key: 'term', label: { en: 'Term', hi: 'टर्म' } },
    { key: 'endowment', label: { en: 'Endowment', hi: 'एंडोमेंट' } },
    { key: 'ulip', label: { en: 'ULIP', hi: 'यूलिप' } },
    { key: 'health', label: { en: 'Health', hi: 'हेल्थ' } },
    { key: 'pension', label: { en: 'Pension', hi: 'पेंशन' } },
    { key: 'child', label: { en: 'Child', hi: 'चाइल्ड' } },
  ]

  const handleMobileTabClick = (key: string) => {
    setActiveMobileTab(key)
    if (key === 'all') {
      handleClearAllFilters()
    } else {
      handleClearAllFilters()
      toggle(setCatFilter, key)
    }
  }

  const handleClearAllFilters = () => {
    setActiveMobileTab('all')
    clearAllFilters()
  }

  const handleGetPlan = (planName: string) => openLeadPopup(`Interest in ${planName}`)

  if (loading) return (
    <section className="bg-[#f5f6fa] rounded-b-[40px] md:rounded-b-[60px] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 md:py-6">
        {/* Header Hero Skeleton */}
        <div className="rounded-3xl bg-gray-200 animate-pulse mb-6 h-[260px]" />
        
        {/* Sidebar + Grid */}
        <div className="flex gap-6 items-start pb-12 md:pb-16">
          {/* Sidebar Skeleton */}
          <aside className="hidden md:block w-64 flex-shrink-0">
            <div className="bg-white rounded-2xl border border-gray-100 p-4 space-y-4">
              <div className="h-4 bg-gray-200 animate-pulse rounded w-1/3" />
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-8 bg-gray-200 animate-pulse rounded-lg w-full" />
              ))}
            </div>
          </aside>

          {/* Grid Skeleton */}
          <div className="flex-1">
            <div className="h-6 bg-gray-200 animate-pulse rounded w-1/4 mb-5" />
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl border border-gray-100 p-4 flex flex-col gap-4 overflow-hidden h-[340px]">
                  {/* Category header skeleton */}
                  <div className="h-16 -mx-4 -mt-4 bg-gray-200 animate-pulse" />
                  
                  {/* Badge + Title skeleton */}
                  <div className="space-y-2 mt-2">
                    <div className="h-4 bg-gray-200 animate-pulse rounded w-1/4" />
                    <div className="h-5 bg-gray-200 animate-pulse rounded w-3/4" />
                    <div className="h-3 bg-gray-200 animate-pulse rounded w-1/2" />
                  </div>
                  
                  {/* Key advantage box skeleton */}
                  <div className="h-14 bg-gray-100 rounded-xl p-3 border border-gray-200 animate-pulse space-y-1.5">
                    <div className="h-2 bg-gray-200 rounded w-1/4" />
                    <div className="h-3 bg-gray-200 rounded w-3/4" />
                  </div>
                  
                  {/* Footer button skeleton */}
                  <div className="mt-auto space-y-2">
                    <div className="h-10 bg-gray-200 animate-pulse rounded-xl w-full" />
                    <div className="h-3 bg-gray-200 animate-pulse rounded w-1/3 mx-auto" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
  
  if (!data || !data.categories) return null

  // ── Sidebar filter content ────────────────────────────────────────────────
  const SidebarFilters = (
    <div className="space-y-0">
      {/* Search */}
      <div className="relative mb-3">
        <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        <input
          type="text"
          placeholder={lang === 'en' ? 'Search by name or plan no.' : 'नाम या प्लान नं. खोजें'}
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="w-full pl-8 pr-7 py-2.5 text-12 border border-gray-200 rounded-xl focus:outline-none focus:border-navy/40 bg-gray-50 placeholder-gray-400"
        />
        {searchQuery && (
          <button onClick={() => setSearchQuery('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
            <X size={12} />
          </button>
        )}
      </div>

      {/* All Active */}
      <FilterPill
        isActive={isShowingAll}
        onClick={handleClearAllFilters}
        label={lang === 'en' ? 'All Active Plans' : 'सभी सक्रिय'}
        count={activePlans.length}
      />

      {/* By Goal */}
      <FilterSection title={lang === 'en' ? "What's your goal?" : 'आपका लक्ष्य?'}>
        {GOALS.map(g => (
          <FilterPill
            key={g.key}
            isActive={goalFilter.has(g.key)}
            onClick={() => toggle(setGoalFilter, g.key)}
            label={g.label[lang as keyof typeof g.label]}
            count={activePlans.filter(p => g.cats.includes(p._catKey)).length}
          />
        ))}
      </FilterSection>

      {/* By Age */}
      <FilterSection title={lang === 'en' ? 'Entry Age' : 'प्रवेश आयु'}>
        {AGE_GROUPS.map(ag => (
          <FilterPill
            key={ag.key}
            isActive={ageFilter.has(ag.key)}
            onClick={() => toggle(setAgeFilter, ag.key)}
            label={ag.label[lang as keyof typeof ag.label]}
            count={activePlans.filter(p => matchesAgeGroup(p.entryAge, ag.key)).length}
          />
        ))}
      </FilterSection>

      {/* By Returns */}
      <FilterSection title={lang === 'en' ? 'Return Type' : 'रिटर्न प्रकार'}>
        {RETURN_TYPES.map(rt => (
          <FilterPill
            key={rt.key}
            isActive={returnsFilter.has(rt.key)}
            onClick={() => toggle(setReturnsFilter, rt.key)}
            label={rt.label[lang as keyof typeof rt.label]}
            count={activePlans.filter(p => rt.cats.includes(p._catKey)).length}
          />
        ))}
      </FilterSection>

      {/* By Plan Type */}
      <FilterSection title={lang === 'en' ? 'Plan Type' : 'प्लान प्रकार'}>
        {Object.entries(categoryMeta).map(([key, meta]) => (
          <FilterPill
            key={key}
            isActive={catFilter.has(key)}
            accent={CAT_ACCENT[key]}
            onClick={() => toggle(setCatFilter, key)}
            label={meta.label[lang as keyof typeof meta.label]}
            count={meta.count}
          />
        ))}
      </FilterSection>

      {/* By Premium Mode */}
      <FilterSection title={lang === 'en' ? 'Premium Mode' : 'प्रीमियम मोड'}>
        {PREMIUM_MODES.map(mode => {
          const c = activePlans.filter(p => getPremiumModes(p.premiumPayment).includes(mode.key)).length
          return (
            <FilterPill
              key={mode.key}
              isActive={premiumFilter.has(mode.key)}
              onClick={() => toggle(setPremiumFilter, mode.key)}
              label={mode.label[lang as keyof typeof mode.label]}
              count={c}
            />
          )
        })}
      </FilterSection>

      {/* By Cover */}
      <FilterSection title={lang === 'en' ? 'Cover Amount' : 'बीमा राशि'}>
        {COVER_TIERS.map(tier => (
          <FilterPill
            key={tier.key}
            isActive={coverFilter.has(tier.key)}
            onClick={() => toggle(setCoverFilter, tier.key)}
            label={tier.label[lang as keyof typeof tier.label]}
            count={activePlans.filter(p => getSumTier(p.sumAssured) === tier.key).length}
          />
        ))}
      </FilterSection>

      {/* Auto-sync footer */}
      <div className="pt-3 px-3 border-t border-gray-100">
        <div className="flex items-center gap-1.5 text-green-600 text-10 font-bold mb-1">
          <Zap size={10} fill="currentColor" /> {lang === 'en' ? 'Auto-synced with LIC India' : 'LIC India से अपडेट'}
        </div>
        <p className="text-10 text-gray-400">{lang === 'en' ? 'Last updated:' : 'अंतिम अपडेट:'} {data.meta.lastUpdated}</p>
        <p className="text-10 text-gray-400 mt-0.5">IRDAI Reg. 512 · Est. 1956</p>
      </div>
    </div>
  )

  return (
    <section className="bg-[#f5f6fa] rounded-b-[40px] md:rounded-b-[60px]">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 md:py-6">

        {/* ── Hero ─────────────────────────────────────────────────────── */}
        <div className="relative rounded-3xl overflow-hidden mb-6" style={{ minHeight: 260 }}>
          <div className="absolute inset-0"
            style={{ background: 'linear-gradient(105deg, rgba(4,12,28,1) 0%, rgba(5,16,38,0.97) 40%, rgba(6,24,52,0.9) 70%, rgba(8,30,60,0.85) 100%)' }} />
          <div className="absolute inset-0 opacity-[0.06]"
            style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
          <div className="absolute bottom-0 right-0 w-72 h-72 rounded-full opacity-30 pointer-events-none"
            style={{ background: 'radial-gradient(circle at 80% 90%, #c9a84c 0%, transparent 60%)' }} />

          <div className="relative z-10 flex flex-col md:flex-row items-center md:items-end gap-8 px-8 md:px-14 py-10 md:py-14">
            <div className="flex-1">
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 bg-white/10 border border-white/15 rounded-full px-3.5 py-1 text-10 font-bold uppercase tracking-widest text-white/60 mb-4">
                <Shield size={9} className="flex-shrink-0" />
                IRDAI Reg. 512 · Since 1956 · Govt. of India
              </motion.div>
              <motion.h1 initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.07 }}
                className="text-32 md:text-52 font-display font-bold text-white leading-[1.1] tracking-tight mb-3">
                {lang === 'en' ? <>Your Money.<br />Protected. Growing.</> : <>आपका पैसा।<br />सुरक्षित। बढ़ता हुआ।</>}
              </motion.h1>
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.16 }}
                className="text-14 md:text-15 text-white/55 max-w-lg leading-relaxed">
                {lang === 'en'
                  ? "Explore India's most trusted insurance plans — for savings, protection, retirement, and growth."
                  : 'बचत, सुरक्षा, सेवानिवृत्ति और वृद्धि के लिए भारत के सबसे भरोसेमंद बीमा प्लान।'}
              </motion.p>
            </div>

            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
              className="flex flex-col gap-3 flex-shrink-0 min-w-[160px]">
              {[
                { val: data.meta.activePlans ?? activePlans.length, label: lang === 'en' ? 'Active Plans' : 'सक्रिय प्लान्स', sub: lang === 'en' ? 'Across all categories' : 'सभी श्रेणियों में' },
                { val: '68+', label: lang === 'en' ? 'Years of Trust' : 'वर्षों का विश्वास', sub: lang === 'en' ? 'Since 1956, Govt. backed' : '1956 से, सरकार समर्थित' },
              ].map(({ val, label, sub }) => (
                <div key={label}
                  className="relative overflow-hidden rounded-2xl px-5 py-4 border border-white/12"
                  style={{ background: 'rgba(255,255,255,0.07)', backdropFilter: 'blur(12px)' }}>
                  <div className="absolute left-0 top-3 bottom-3 w-[3px] rounded-full bg-[#c9a84c]" />
                  <div className="text-30 font-bold text-white leading-none tracking-tight">{val}</div>
                  <div className="text-12 font-semibold text-white/80 mt-1 leading-snug">{label}</div>
                  <div className="text-10 text-white/35 mt-0.5 leading-snug">{sub}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Mobile horizontal scrollable filter bar (sticky) */}
        <div className="md:hidden sticky top-[72px] z-30 bg-[#f5f6fa] py-3 -mx-4 px-4 overflow-x-auto scrollbar-hide flex gap-2 border-b border-gray-100 mb-4">
          {mobileTabs.map(tab => {
            const isActive = activeMobileTab === tab.key
            return (
              <button
                key={tab.key}
                onClick={() => handleMobileTabClick(tab.key)}
                className={`px-4 py-2 rounded-full text-12 font-bold whitespace-nowrap transition-all uppercase tracking-wide cursor-pointer ${
                  isActive
                    ? 'bg-navy text-white shadow-md'
                    : 'bg-white text-gray-500 border border-gray-200 hover:bg-gray-50'
                }`}
              >
                {tab.label[lang as 'en' | 'hi']}
              </button>
            )
          })}
        </div>

        {/* ── Mobile filter bar ─────────────────────────────────────────── */}
        <div className="flex md:hidden items-center gap-2 mb-4">
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
            <input type="text" placeholder={lang === 'en' ? 'Search plans...' : 'खोजें...'}
              value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-2.5 text-13 border border-gray-200 rounded-xl focus:outline-none focus:border-navy/40 bg-white" />
          </div>
        </div>

        {/* Mobile drawer */}
        <AnimatePresence>
          {mobileFiltersOpen && (
            <>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/40 z-40 md:hidden" onClick={() => setMobileFiltersOpen(false)} />
              <motion.div
                initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="fixed top-0 left-0 h-full w-80 bg-white z-50 md:hidden overflow-y-auto p-5 shadow-2xl">
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

        {/* ── Main: Sidebar + Grid ───────────────────────────────────────── */}
        <div className="flex gap-6 items-start pb-12 md:pb-16">

          {/* ── Left Sidebar ── */}
          <aside
            className="hidden md:block w-64 flex-shrink-0 sticky self-start"
            style={{ top: '86px', maxHeight: 'calc(100vh - 116px)' }}
          >
            <div
              className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col overflow-hidden"
              style={{ maxHeight: 'calc(100vh - 116px)' }}
            >
              <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-gray-100 flex-shrink-0 bg-white">
                <h3 className="text-10 font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                  <SlidersHorizontal size={10} /> {lang === 'en' ? 'Filter Plans' : 'फ़िल्टर'}
                </h3>
                {totalFiltersActive > 0 && (
                  <button onClick={handleClearAllFilters}
                    className="text-10 text-navy/50 hover:text-navy font-semibold flex items-center gap-1 transition-colors">
                    <X size={10} /> {lang === 'en' ? 'Clear all' : 'साफ़ करें'}
                  </button>
                )}
              </div>
              <div className="overflow-y-auto flex-1 px-3 pt-2 pb-8 scroll-smooth">
                {SidebarFilters}
              </div>
            </div>
          </aside>

          {/* ── Right: Results ── */}
          <div className="flex-1 min-w-0">

            <div className="flex items-center justify-between mb-5">
              <div className="flex items-baseline gap-2">
                <span className="text-22 font-display font-bold text-navy">{displayedPlans.length}</span>
                <span className="text-13 text-gray-500">
                  {lang === 'en' ? 'plans found' : 'प्लान मिले'}
                  {totalFiltersActive > 0 && <span className="text-gray-400"> · {lang === 'en' ? 'filtered' : 'फ़िल्टर'}</span>}
                </span>
              </div>
              {totalFiltersActive > 0 && (
                <button onClick={handleClearAllFilters}
                  className="hidden md:flex items-center gap-1 text-12 text-navy/50 hover:text-navy transition-colors font-medium">
                  <X size={12} /> {lang === 'en' ? 'Clear filters' : 'फ़िल्टर हटाएं'}
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              <AnimatePresence mode="popLayout">
                {displayedPlans.map((plan, idx) => {
                  const accent  = CAT_ACCENT[plan._catKey] || '#1B4F72'
                  const badge   = PLAN_BADGES[plan.planNo]
                  const modes   = getPremiumModes(plan.premiumPayment)
                  const modeLabel = modes.map(m =>
                    m === 'regular' ? (lang === 'en' ? 'Regular' : 'नियमित') :
                    m === 'limited' ? (lang === 'en' ? 'Limited' : 'सीमित') :
                    (lang === 'en' ? 'Single' : 'एकमुश्त')
                  ).join(' / ')
                  const catLabel = data.categories[plan._catKey]?.label?.en
                    ?.replace(' Plans', '').replace(' Insurance', '') ?? ''
                  const catIcon  = data.categories[plan._catKey]?.icon ?? ''

                  return (
                    <motion.div
                      key={plan.id}
                      layout
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ delay: Math.min(idx * 0.035, 0.25) }}
                      className="bg-white rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden group"
                    >
                      <div className="relative h-16 flex-shrink-0 flex items-center justify-between px-4"
                        style={{ background: `linear-gradient(120deg, ${accent}18 0%, ${accent}08 100%)`, borderBottom: `2px solid ${accent}22` }}>
                        <div className="flex items-center gap-1.5">
                          <span className="text-14 flex items-center">{getCategoryIcon(catIcon)}</span>
                          <span className="text-10 font-bold uppercase tracking-wider" style={{ color: accent }}>{catLabel}</span>
                        </div>
                        <span className="text-10 font-bold bg-white/70 border text-gray-400 px-2 py-0.5 rounded-lg"
                          style={{ borderColor: `${accent}30` }}>
                          Plan {plan.planNo}
                        </span>
                      </div>

                      <div className="p-4 flex flex-col gap-3 flex-1">
                        <div className="space-y-1.5">
                          {badge && (
                            <span className="inline-flex items-center gap-1 text-10 font-bold px-2 py-0.5 rounded-full"
                              style={{ background: badge.bg, color: badge.color }}>
                              {getBadgeIcon(badge.icon)} {badge.label}
                            </span>
                          )}
                          <h3 className="text-15 font-bold text-navy leading-snug group-hover:text-[#1a3a72] transition-colors">
                            {plan.name[lang as keyof typeof plan.name] || plan.name.en}
                          </h3>
                          <p className="text-11 text-gray-400 italic leading-snug line-clamp-1">
                            {plan.tagline[lang as keyof typeof plan.tagline] || ''}
                          </p>
                        </div>

                        <div className="rounded-xl p-3 border" style={{ background: `${accent}07`, borderColor: `${accent}1a` }}>
                          <div className="text-10 font-bold uppercase tracking-wider mb-0.5" style={{ color: accent }}>
                            {lang === 'en' ? 'Key Advantage' : 'मुख्य लाभ'}
                          </div>
                          <div className="text-12 font-semibold text-gray-800 leading-snug">
                            {plan.keyBenefit[lang as keyof typeof plan.keyBenefit] || ''}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-1.5">
                          {[
                            { label: lang === 'en' ? 'Entry Age' : 'आयु', val: plan.entryAge || '—' },
                            { label: lang === 'en' ? 'Cover'     : 'कवर', val: plan.sumAssured || '—' },
                            { label: lang === 'en' ? 'Pay Mode'  : 'मोड', val: modeLabel || '—' },
                          ].map(({ label, val }) => (
                            <div key={label} className="bg-gray-50 border border-gray-100 p-2 rounded-lg text-center">
                              <div className="text-9 text-gray-400 font-bold uppercase tracking-wide mb-0.5">{label}</div>
                              <div className="text-10 font-bold text-navy leading-tight truncate">{val}</div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="px-4 pb-4 space-y-2 text-center">
                        <button onClick={() => handleGetPlan(plan.name.en)}
                          className="w-full h-10 text-white rounded-xl font-bold text-12 shadow-sm transition-all flex items-center justify-center gap-2 group/btn hover:shadow-lg hover:brightness-110 active:scale-[0.98]"
                          style={{ background: `linear-gradient(135deg, ${accent}, ${accent}cc)` }}>
                          {lang === 'en' ? 'Get This Plan' : 'यह प्लान पाएं'}
                          <ArrowRight size={13} className="group-hover/btn:translate-x-1 transition-transform" />
                        </button>

                        <div className="pt-1 pb-1">
                          <Link href={`/compare?plan=${plan.planNo}`} className="text-amber-600 underline text-sm hover:text-amber-700 transition-colors inline-block cursor-pointer font-semibold">
                            {lang === 'en' ? 'Compare Plans' : 'प्लान्स की तुलना करें'}
                          </Link>
                        </div>

                        <button
                          onClick={() => setExpandedPlan(expandedPlan === plan.id ? null : plan.id)}
                          className="w-full text-11 font-semibold text-gray-400 hover:text-navy transition-colors flex items-center justify-center gap-1 py-0.5">
                          {expandedPlan === plan.id
                            ? <><ChevronUp size={12} /> {lang === 'en' ? 'Hide details' : 'छुपाएं'}</>
                            : <><ChevronDown size={12} /> {lang === 'en' ? 'View all benefits' : 'सभी लाभ देखें'}</>}
                        </button>
                      </div>

                      <AnimatePresence>
                        {expandedPlan === plan.id && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }} className="overflow-hidden border-t border-gray-100">
                            <div className="bg-gray-50/80 p-4 space-y-3">
                              <div className="text-10 font-bold text-gray-400 uppercase tracking-widest">Plan Highlights</div>
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
                                {lang === 'en' ? 'View Official Document →' : 'आधिकारिक दस्तावेज़ →'}
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
                  <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                    <Search size={20} className="text-gray-400" />
                  </div>
                  <div className="text-15 font-bold text-gray-600 mb-1">
                    {lang === 'en' ? 'No plans match your filters' : 'कोई प्लान नहीं मिला'}
                  </div>
                  <p className="text-12 text-gray-400 mb-5">
                    {lang === 'en' ? 'Try adjusting your filters or search term' : 'फ़िल्टर बदलें'}
                  </p>
                  <button onClick={handleClearAllFilters} className="text-navy text-13 font-bold underline underline-offset-2">
                    {lang === 'en' ? 'Clear all filters' : 'सभी फ़िल्टर हटाएं'}
                  </button>
                </div>
              )}
            </div>

            {withdrawnPlans.length > 0 && (
              <div className="mt-12 border-t border-dashed border-gray-200 pt-6">
                <button
                  onClick={() => setShowWithdrawn(!showWithdrawn)}
                  className="flex items-center gap-2 text-12 text-gray-400 hover:text-gray-600 font-medium transition-colors mx-auto">
                  {showWithdrawn ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  {lang === 'en'
                    ? `${showWithdrawn ? 'Hide' : 'View'} ${withdrawnPlans.length} discontinued plans`
                    : `${withdrawnPlans.length} बंद प्लान ${showWithdrawn ? 'छुपाएं' : 'देखें'}`}
                  <span className="text-10 text-gray-300">· {lang === 'en' ? 'calculator access only' : 'केवल कैलकुलेटर'}</span>
                </button>

                <AnimatePresence>
                  {showWithdrawn && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 mt-6">
                        {withdrawnPlans.map((plan, idx) => {
                          return (
                            <motion.div key={plan.id}
                              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: idx * 0.02 }}
                              className="bg-white/60 border border-dashed border-gray-200 rounded-xl p-3.5 flex items-start gap-3 opacity-70 hover:opacity-90 transition-opacity">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-9 font-bold bg-slate-100 text-slate-400 px-1.5 py-0.5 rounded uppercase tracking-wider">Plan {plan.planNo}</span>
                                  <span className="text-9 font-bold bg-slate-100 text-slate-400 px-1.5 py-0.5 rounded uppercase tracking-wider">Withdrawn</span>
                                </div>
                                <div className="text-12 font-semibold text-gray-500 leading-snug truncate">
                                  {plan.name[lang as keyof typeof plan.name] || plan.name.en}
                                </div>
                              </div>
                              <Info size={14} className="text-gray-300 flex-shrink-0 mt-0.5" />
                            </motion.div>
                          )
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            <div className="mt-10 text-center text-gray-400 text-11 border-t border-gray-100 pt-6">
              <p className="mb-1 italic">
                {lang === 'en'
                  ? `Auto-synced with LIC India official records · ${data.meta.lastUpdated}`
                  : `LIC India के आधिकारिक रिकॉर्ड से अपडेट · ${data.meta.lastUpdated}`}
              </p>
              <p>{lang === 'en' ? 'All plans subject to standard LIC terms & IRDAI regulations.' : 'सभी प्लान LIC की मानक शर्तों और IRDAI नियमों के अधीन।'}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
