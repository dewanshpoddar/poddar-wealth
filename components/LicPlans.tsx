'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLang } from '@/lib/LangContext'
import { ArrowRight, Info, CheckCircle2, Zap, SlidersHorizontal, X, Search, Shield, ChevronDown, ChevronUp } from 'lucide-react'
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

// ── Category accent colors ──────────────────────────────────────────────────
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

// ── Popularity badges — based on LIC sales & internet data ─────────────────
const PLAN_BADGES: Record<string, { label: string; color: string; bg: string; icon: string }> = {
  // Best Sellers (top LIC annual premium collection plans)
  '915': { label: 'Best Seller', color: '#15803d', bg: '#dcfce7', icon: '🏆' },
  '945': { label: 'Best Seller', color: '#15803d', bg: '#dcfce7', icon: '🏆' },
  '836': { label: 'Best Seller', color: '#15803d', bg: '#dcfce7', icon: '🏆' },
  '933': { label: 'Best Seller', color: '#15803d', bg: '#dcfce7', icon: '🏆' },
  // Most Popular (highest policy count)
  '954': { label: 'Most Popular', color: '#1d4ed8', bg: '#dbeafe', icon: '🔥' },
  '955': { label: 'Most Popular', color: '#1d4ed8', bg: '#dbeafe', icon: '🔥' },
  '858': { label: 'Most Popular', color: '#1d4ed8', bg: '#dbeafe', icon: '🔥' },
  '857': { label: 'Most Popular', color: '#1d4ed8', bg: '#dbeafe', icon: '🔥' },
  // Top Performer (ULIP / pension standouts)
  '852': { label: 'Top Performer', color: '#0e7490', bg: '#cffafe', icon: '📈' },
  '749': { label: 'Top Performer', color: '#0e7490', bg: '#cffafe', icon: '📈' },
  // Advisor Picks
  '948': { label: "Advisor's Pick", color: '#7c3aed', bg: '#ede9fe', icon: '⭐' },
  '871': { label: "Advisor's Pick", color: '#7c3aed', bg: '#ede9fe', icon: '⭐' },
  '862': { label: "Advisor's Pick", color: '#7c3aed', bg: '#ede9fe', icon: '⭐' },
  // New Launches
  '881': { label: 'New Launch', color: '#b45309', bg: '#fef3c7', icon: '✨' },
  '912': { label: 'New Launch', color: '#b45309', bg: '#fef3c7', icon: '✨' },
  '876': { label: 'New Launch', color: '#b45309', bg: '#fef3c7', icon: '✨' },
  '887': { label: 'New Launch', color: '#b45309', bg: '#fef3c7', icon: '✨' },
  '886': { label: 'New Launch', color: '#b45309', bg: '#fef3c7', icon: '✨' },
  '880': { label: 'New Launch', color: '#b45309', bg: '#fef3c7', icon: '✨' },
  '751': { label: 'New Launch', color: '#b45309', bg: '#fef3c7', icon: '✨' },
  '879': { label: 'New Launch', color: '#b45309', bg: '#fef3c7', icon: '✨' },
}

// ── Goal-based filters (customer language, not product language) ────────────
const GOALS = [
  { key: 'save',    label: { en: 'Save & Grow',        hi: 'बचत और वृद्धि' },     icon: '💰', cats: ['endowment', 'wholeLife', 'moneyBack'] },
  { key: 'protect', label: { en: 'Family Protection',  hi: 'परिवार सुरक्षा' },     icon: '🛡️', cats: ['term', 'child'] },
  { key: 'retire',  label: { en: 'Retirement Income',  hi: 'सेवानिवृत्ति आय' },   icon: '🏖️', cats: ['pension'] },
  { key: 'invest',  label: { en: 'Market Growth',      hi: 'बाजार निवेश' },        icon: '📈', cats: ['ulip'] },
  { key: 'child',   label: { en: "Child's Future",     hi: 'बच्चों का भविष्य' },  icon: '🎓', cats: ['child'] },
  { key: 'micro',   label: { en: 'Low Premium',        hi: 'कम प्रीमियम' },        icon: '🤝', cats: ['micro'] },
]

// ── Age suitability ─────────────────────────────────────────────────────────
const AGE_GROUPS = [
  { key: 'child',  label: { en: 'For Minors (0–17)',    hi: '0–17 वर्ष' },    icon: '👶' },
  { key: 'young',  label: { en: 'Young Adult (18–35)',   hi: '18–35 वर्ष' },   icon: '🧑' },
  { key: 'prime',  label: { en: 'Prime Age (36–55)',     hi: '36–55 वर्ष' },   icon: '👔' },
  { key: 'senior', label: { en: 'Senior (55+)',          hi: '55+ वर्ष' },     icon: '🧓' },
]

// ── Returns type ────────────────────────────────────────────────────────────
const RETURN_TYPES = [
  { key: 'guaranteed', label: { en: 'Guaranteed Returns', hi: 'गारंटीड रिटर्न' }, icon: '🔒', cats: ['endowment', 'wholeLife', 'moneyBack', 'child', 'micro'] },
  { key: 'market',     label: { en: 'Market-Linked',      hi: 'बाजार-लिंक्ड' },  icon: '📊', cats: ['ulip'] },
  { key: 'income',     label: { en: 'Regular Income',     hi: 'नियमित आय' },       icon: '💸', cats: ['pension'] },
  { key: 'pure',       label: { en: 'Pure Protection',    hi: 'केवल सुरक्षा' },   icon: '🛡️', cats: ['term'] },
]

const PREMIUM_MODES = [
  { key: 'regular', label: { en: 'Regular Pay',  hi: 'नियमित' },   icon: '📅' },
  { key: 'limited', label: { en: 'Limited Pay',  hi: 'सीमित' },    icon: '⏱️' },
  { key: 'single',  label: { en: 'Single Pay',   hi: 'एकमुश्त' },  icon: '💵' },
]

const COVER_TIERS = [
  { key: 'starter', label: { en: 'Upto ₹5 Lakh',   hi: '₹5 लाख तक' }, icon: '🌱' },
  { key: 'mid',     label: { en: '₹5L – ₹25L',      hi: '₹5L–₹25L' },  icon: '📈' },
  { key: 'high',    label: { en: '₹25 Lakh+',        hi: '₹25 लाख+' },  icon: '🏆' },
]

// ── Helpers ─────────────────────────────────────────────────────────────────
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

function parseAgeRange(entryAge: string): { min: number; max: number } {
  const cleanedMin = entryAge.match(/^(\d+)(d|m)?/)
  const cleanedMax = entryAge.match(/[-–]\s*(\d+)\s*(yr)?/)
  const min = cleanedMin ? (cleanedMin[2] === 'd' ? 0 : parseInt(cleanedMin[1])) : 0
  const max = cleanedMax ? parseInt(cleanedMax[1]) : 99
  return { min, max }
}

function matchesAgeGroup(entryAge: string, ageKey: string): boolean {
  const { min, max } = parseAgeRange(entryAge)
  switch (ageKey) {
    case 'child':  return min <= 17
    case 'young':  return max >= 18 && min <= 35
    case 'prime':  return max >= 36 && min <= 55
    case 'senior': return max >= 55
    default: return true
  }
}

// ── FilterSection wrapper ────────────────────────────────────────────────────
function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-t border-gray-100 pt-4 pb-2">
      <p className="text-10 font-bold text-gray-400 uppercase tracking-widest px-3 mb-2.5">{title}</p>
      {children}
    </div>
  )
}

// ── FilterPill button ────────────────────────────────────────────────────────
function FilterPill({
  isActive, accent, onClick, icon, label, count
}: {
  isActive: boolean; accent?: string; onClick: () => void
  icon: string; label: string; count?: number
}) {
  const bg = accent ? (isActive ? `${accent}12` : undefined) : undefined
  const border = accent ? (isActive ? `${accent}30` : undefined) : undefined
  const textColor = isActive ? (accent || '#1B4F72') : '#4B5563'
  return (
    <button onClick={onClick}
      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left transition-all group
        ${!accent && isActive ? 'bg-navy/8 text-navy' : ''}
        ${!isActive ? 'hover:bg-gray-50' : ''}`}
      style={{ background: bg, borderColor: border }}>
      <span className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all`}
        style={{
          background: isActive ? (accent || '#1B4F72') : 'transparent',
          borderColor: isActive ? (accent || '#1B4F72') : '#D1D5DB',
        }}>
        {isActive && <CheckCircle2 size={9} className="text-white fill-white" />}
      </span>
      <span className="text-15 leading-none flex-shrink-0">{icon}</span>
      <span className="flex-1 font-medium text-12 leading-snug" style={{ color: textColor }}>{label}</span>
      {count !== undefined && (
        <span className="text-10 font-bold px-1.5 py-0.5 rounded-full flex-shrink-0"
          style={{
            background: isActive ? (accent ? `${accent}20` : '#e0e7ff') : '#F3F4F6',
            color: isActive ? (accent || '#1B4F72') : '#6B7280',
          }}>
          {count}
        </span>
      )}
    </button>
  )
}

export default function LicPlans() {
  const { lang } = useLang()
  const [data, setData]                       = useState<LicData | null>(null)
  const [loading, setLoading]                 = useState(true)
  const [expandedPlan, setExpandedPlan]       = useState<string | null>(null)
  const [catFilter, setCatFilter]             = useState<Set<string>>(new Set())
  const [goalFilter, setGoalFilter]           = useState<Set<string>>(new Set())
  const [ageFilter, setAgeFilter]             = useState<Set<string>>(new Set())
  const [returnsFilter, setReturnsFilter]     = useState<Set<string>>(new Set())
  const [premiumFilter, setPremiumFilter]     = useState<Set<string>>(new Set())
  const [coverFilter, setCoverFilter]         = useState<Set<string>>(new Set())
  const [searchQuery, setSearchQuery]         = useState('')
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const [showWithdrawn, setShowWithdrawn]     = useState(false)

  useEffect(() => {
    fetch('/api/lic-plans?view=all')
      .then(r => r.json())
      .then(res => { if (res.success) setData(res.data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  // ── Derived data ─────────────────────────────────────────────────────────
  const { activePlans, withdrawnPlans, categoryMeta } = useMemo(() => {
    if (!data) return { activePlans: [], withdrawnPlans: [], categoryMeta: {} }
    const activePlans:    (Plan & { _catKey: string })[] = []
    const withdrawnPlans: (Plan & { _catKey: string })[] = []
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

  // ── Filtered display list ────────────────────────────────────────────────
  const displayedPlans = useMemo(() => {
    let base = [...activePlans]

    // Category filter
    if (catFilter.size > 0)
      base = base.filter(p => catFilter.has(p._catKey))

    // Goal filter — resolve to categories
    if (goalFilter.size > 0) {
      const goalCats = new Set<string>()
      GOALS.filter(g => goalFilter.has(g.key)).forEach(g => g.cats.forEach(c => goalCats.add(c)))
      base = base.filter(p => goalCats.has(p._catKey))
    }

    // Age filter
    if (ageFilter.size > 0)
      base = base.filter(p => [...ageFilter].some(ag => matchesAgeGroup(p.entryAge, ag)))

    // Returns type filter
    if (returnsFilter.size > 0) {
      const rtCats = new Set<string>()
      RETURN_TYPES.filter(r => returnsFilter.has(r.key)).forEach(r => r.cats.forEach(c => rtCats.add(c)))
      base = base.filter(p => rtCats.has(p._catKey))
    }

    // Premium mode filter
    if (premiumFilter.size > 0)
      base = base.filter(p => getPremiumModes(p.premiumPayment).some(m => premiumFilter.has(m)))

    // Cover tier filter
    if (coverFilter.size > 0)
      base = base.filter(p => coverFilter.has(getSumTier(p.sumAssured)))

    // Search
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
  }, [catFilter, goalFilter, ageFilter, returnsFilter, premiumFilter, coverFilter, searchQuery, activePlans])

  const totalFiltersActive = catFilter.size + goalFilter.size + ageFilter.size + returnsFilter.size + premiumFilter.size + coverFilter.size + (searchQuery ? 1 : 0)
  const isShowingAll = totalFiltersActive === 0

  const clearAllFilters = () => {
    setCatFilter(new Set()); setGoalFilter(new Set()); setAgeFilter(new Set())
    setReturnsFilter(new Set()); setPremiumFilter(new Set()); setCoverFilter(new Set())
    setSearchQuery(''); setExpandedPlan(null)
  }

  const toggle = (setter: React.Dispatch<React.SetStateAction<Set<string>>>, key: string) =>
    setter(prev => { const n = new Set(prev); n.has(key) ? n.delete(key) : n.add(key); return n })

  const handleGetPlan = (planName: string) => openLeadPopup(`Interest in ${planName}`)

  // ── Loading ───────────────────────────────────────────────────────────────
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50/30">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-navy/10 border-t-navy rounded-full animate-spin" />
        <p className="text-14 font-bold text-navy/40 uppercase tracking-widest">Loading Plans...</p>
      </div>
    </div>
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
        onClick={clearAllFilters}
        icon="✅"
        label={lang === 'en' ? 'All Active Plans' : 'सभी सक्रिय'}
        count={activePlans.length}
      />

      {/* By Goal */}
      <FilterSection title={lang === 'en' ? 'What\'s your goal?' : 'आपका लक्ष्य?'}>
        {GOALS.map(g => (
          <FilterPill
            key={g.key}
            isActive={goalFilter.has(g.key)}
            onClick={() => toggle(setGoalFilter, g.key)}
            icon={g.icon}
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
            icon={ag.icon}
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
            icon={rt.icon}
            label={rt.label[lang as keyof typeof rt.label]}
            count={activePlans.filter(p => rt.cats.includes(p._catKey)).length}
          />
        ))}
      </FilterSection>

      {/* By Plan Type (power users) */}
      <FilterSection title={lang === 'en' ? 'Plan Type' : 'प्लान प्रकार'}>
        {Object.entries(categoryMeta).map(([key, meta]) => (
          <FilterPill
            key={key}
            isActive={catFilter.has(key)}
            accent={CAT_ACCENT[key]}
            onClick={() => toggle(setCatFilter, key)}
            icon={meta.icon}
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
              icon={mode.icon}
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
            icon={tier.icon}
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
    <section className="bg-[#f5f6fa] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-10">

        {/* ── Hero ─────────────────────────────────────────────────────── */}
        <div className="relative rounded-3xl overflow-hidden mb-8" style={{ minHeight: 260 }}>
          {/* Layered background: deep navy + radial glow + subtle grain */}
          <div className="absolute inset-0"
            style={{ background: 'linear-gradient(135deg, #071425 0%, #0c2340 40%, #0f3460 70%, #1a4a7a 100%)' }} />
          {/* Gold arc bottom-right */}
          <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full opacity-20 pointer-events-none"
            style={{ background: 'radial-gradient(circle, #c9a84c 0%, transparent 65%)' }} />
          {/* Soft teal glow top-left */}
          <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full opacity-15 pointer-events-none"
            style={{ background: 'radial-gradient(circle, #38bdf8 0%, transparent 65%)' }} />
          {/* Floating shield / coins decorative shapes */}
          <div className="absolute right-8 top-1/2 -translate-y-1/2 text-[120px] opacity-[0.07] pointer-events-none select-none hidden md:block">🏦</div>
          {/* Subtle diagonal texture */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{ backgroundImage: 'repeating-linear-gradient(60deg,#fff 0,#fff 1px,transparent 0,transparent 40px)', backgroundSize: '60px 60px' }} />

          {/* Content */}
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
                  ? 'Explore India\'s most trusted insurance plans — for savings, protection, retirement, and growth.'
                  : 'बचत, सुरक्षा, सेवानिवृत्ति और वृद्धि के लिए भारत के सबसे भरोसेमंद बीमा प्लान।'}
              </motion.p>
            </div>

            {/* Right: 2-stat pill cards */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
              className="flex gap-3 flex-shrink-0">
              {[
                { val: data.meta.activePlans ?? activePlans.length, label: lang === 'en' ? 'Active Plans' : 'सक्रिय', icon: '✅' },
                { val: '68+', label: lang === 'en' ? 'Yrs of Trust' : 'वर्षों का विश्वास', icon: '🏛️' },
              ].map(({ val, label, icon }) => (
                <div key={label} className="bg-white/10 border border-white/15 backdrop-blur-sm rounded-2xl px-5 py-4 text-center min-w-[90px]">
                  <div className="text-20 mb-1">{icon}</div>
                  <div className="text-26 font-bold text-white leading-none">{val}</div>
                  <div className="text-9 text-white/45 uppercase tracking-wider font-semibold mt-1">{label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* ── Mobile filter bar ─────────────────────────────────────────── */}
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
                className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={() => setMobileFiltersOpen(false)} />
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

        {/* ── Main: Sidebar + Grid ───────────────────────────────────────── */}
        <div className="flex gap-6 items-start">

          {/* ── Left Sidebar ── */}
          <aside className="hidden lg:block w-64 flex-shrink-0 sticky top-4 self-start" style={{ maxHeight: 'calc(100vh - 2rem)' }}>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col" style={{ maxHeight: 'calc(100vh - 2rem)' }}>
              {/* Sidebar header — always visible */}
              <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-gray-100 flex-shrink-0">
                <h3 className="text-11 font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
                  <SlidersHorizontal size={11} /> {lang === 'en' ? 'Filter Plans' : 'फ़िल्टर'}
                </h3>
                {totalFiltersActive > 0 && (
                  <button onClick={clearAllFilters}
                    className="text-10 text-navy/50 hover:text-navy font-semibold underline underline-offset-2 transition-colors flex items-center gap-1">
                    <X size={10} /> {lang === 'en' ? 'Clear all' : 'साफ़ करें'}
                  </button>
                )}
              </div>
              {/* Scrollable filter body */}
              <div className="overflow-y-auto flex-1 p-4 pt-2">
                {SidebarFilters}
              </div>
            </div>
          </aside>

          {/* ── Right: Results ── */}
          <div className="flex-1 min-w-0">

            {/* Results bar */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-baseline gap-2">
                <span className="text-22 font-display font-bold text-navy">{displayedPlans.length}</span>
                <span className="text-13 text-gray-500">
                  {lang === 'en' ? 'plans found' : 'प्लान मिले'}
                  {totalFiltersActive > 0 && <span className="text-gray-400"> · {lang === 'en' ? 'filtered' : 'फ़िल्टर'}</span>}
                </span>
              </div>
              {totalFiltersActive > 0 && (
                <button onClick={clearAllFilters}
                  className="hidden md:flex items-center gap-1 text-12 text-navy/50 hover:text-navy transition-colors font-medium">
                  <X size={12} /> {lang === 'en' ? 'Clear filters' : 'फ़िल्टर हटाएं'}
                </button>
              )}
            </div>

            {/* ── Plan Cards Grid ── */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              <AnimatePresence mode="popLayout">
                {(displayedPlans as any[]).map((plan, idx) => {
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
                      {/* ── Card header band ── */}
                      <div className="relative h-16 flex-shrink-0 flex items-center justify-between px-4"
                        style={{ background: `linear-gradient(120deg, ${accent}18 0%, ${accent}08 100%)`, borderBottom: `2px solid ${accent}22` }}>
                        {/* Category pill */}
                        <div className="flex items-center gap-1.5">
                          <span className="text-16">{catIcon}</span>
                          <span className="text-10 font-bold uppercase tracking-wider" style={{ color: accent }}>{catLabel}</span>
                        </div>
                        {/* Plan no */}
                        <span className="text-10 font-bold bg-white/70 border text-gray-400 px-2 py-0.5 rounded-lg"
                          style={{ borderColor: `${accent}30` }}>
                          Plan {plan.planNo}
                        </span>
                      </div>

                      <div className="p-4 flex flex-col gap-3 flex-1">
                        {/* Badge + Plan name */}
                        <div className="space-y-1.5">
                          {badge && (
                            <span className="inline-flex items-center gap-1 text-10 font-bold px-2 py-0.5 rounded-full"
                              style={{ background: badge.bg, color: badge.color }}>
                              {badge.icon} {badge.label}
                            </span>
                          )}
                          <h3 className="text-15 font-bold text-navy leading-snug group-hover:text-[#1a3a72] transition-colors">
                            {plan.name[lang as keyof typeof plan.name] || plan.name.en}
                          </h3>
                          <p className="text-11 text-gray-400 italic leading-snug line-clamp-1">
                            {plan.tagline[lang as keyof typeof plan.tagline] || ''}
                          </p>
                        </div>

                        {/* Key advantage */}
                        <div className="rounded-xl p-3 border" style={{ background: `${accent}07`, borderColor: `${accent}1a` }}>
                          <div className="text-10 font-bold uppercase tracking-wider mb-0.5" style={{ color: accent }}>
                            {lang === 'en' ? '✦ Key Advantage' : '✦ मुख्य लाभ'}
                          </div>
                          <div className="text-12 font-semibold text-gray-800 leading-snug">
                            {plan.keyBenefit[lang as keyof typeof plan.keyBenefit] || ''}
                          </div>
                        </div>

                        {/* 3-col meta */}
                        <div className="grid grid-cols-3 gap-1.5">
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

                      {/* ── Actions ── */}
                      <div className="px-4 pb-4 space-y-2">
                        <button onClick={() => handleGetPlan(plan.name.en)}
                          className="w-full h-10 text-white rounded-xl font-bold text-12 shadow-sm transition-all flex items-center justify-center gap-2 group/btn hover:shadow-lg hover:brightness-110 active:scale-[0.98]"
                          style={{ background: `linear-gradient(135deg, ${accent}, ${accent}cc)` }}>
                          {lang === 'en' ? 'Get This Plan' : 'यह प्लान पाएं'}
                          <ArrowRight size={13} className="group-hover/btn:translate-x-1 transition-transform" />
                        </button>
                        <button
                          onClick={() => setExpandedPlan(expandedPlan === plan.id ? null : plan.id)}
                          className="w-full text-11 font-semibold text-gray-400 hover:text-navy transition-colors flex items-center justify-center gap-1 py-0.5">
                          {expandedPlan === plan.id
                            ? <><ChevronUp size={12} /> {lang === 'en' ? 'Hide details' : 'छुपाएं'}</>
                            : <><ChevronDown size={12} /> {lang === 'en' ? 'View all benefits' : 'सभी लाभ देखें'}</>}
                        </button>
                      </div>

                      {/* Expanded highlights */}
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
                  <div className="text-44 mb-3">🔍</div>
                  <div className="text-15 font-bold text-gray-600 mb-1">
                    {lang === 'en' ? 'No plans match your filters' : 'कोई प्लान नहीं मिला'}
                  </div>
                  <p className="text-12 text-gray-400 mb-5">
                    {lang === 'en' ? 'Try adjusting your filters or search term' : 'फ़िल्टर बदलें'}
                  </p>
                  <button onClick={clearAllFilters} className="text-navy text-13 font-bold underline underline-offset-2">
                    {lang === 'en' ? 'Clear all filters' : 'सभी फ़िल्टर हटाएं'}
                  </button>
                </div>
              )}
            </div>

            {/* ── Withdrawn plans — collapsed at bottom ── */}
            {withdrawnPlans.length > 0 && (
              <div className="mt-12 border-t border-dashed border-gray-200 pt-6">
                <button
                  onClick={() => setShowWithdrawn(v => !v)}
                  className="flex items-center gap-2 text-12 text-gray-400 hover:text-gray-600 font-medium transition-colors mx-auto">
                  {showWithdrawn ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  📦 {lang === 'en'
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
                          const accent = CAT_ACCENT[plan._catKey] || '#9CA3AF'
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

            {/* Footer */}
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
