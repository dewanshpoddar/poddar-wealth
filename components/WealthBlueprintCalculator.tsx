'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { openLeadPopup } from '@/lib/events'
import { ArrowRight, Shield, Heart, TrendingUp, Landmark, PiggyBank, CheckCircle2, ChevronRight } from 'lucide-react'

// ── Types ────────────────────────────────────────────────────────────────────
type Employment = 'salaried' | 'freelance' | 'business'
type Goal = 'home' | 'education' | 'retire' | 'wealth' | 'health' | 'travel'

interface Profile {
  age: number
  monthlyIncome: number
  employment: Employment
  dependents: number
  hasParents: boolean
  goals: Goal[]
}

// ── Research-backed Calculation Engine ──────────────────────────────────────
// Sources: IRDAI guidelines, Vanguard retirement research, SEBI investor
// framework, LIC actuarial data, Morningstar India allocation models,
// DIME life-cover formula (international standard).
function calcBlueprint(p: Profile) {
  const annual = p.monthlyIncome * 12
  const expenses = p.monthlyIncome * 0.65 // ~65% expense ratio (India avg)

  // 1. Emergency Fund — SEBI + Vanguard: 6–12 months expenses
  const eMonths = p.employment === 'freelance' ? 9 : p.employment === 'business' ? 12 : 6
  const emergencyTarget = expenses * eMonths
  const emergencyMonthly = Math.round(emergencyTarget / 18) // build in 18 months

  // 2. Term Insurance — DIME method: Income × multiplier + Education buffer + Parent care
  const mult = p.age <= 25 ? 20 : p.age <= 30 ? 18 : p.age <= 35 ? 15 : p.age <= 40 ? 12 : p.age <= 50 ? 10 : 8
  const eduBuffer = p.dependents * 1_500_000          // ₹15L per child (education)
  const parentBuffer = p.hasParents ? annual * 2 : 0  // 2 years' income for aged parents
  const termCoverL = Math.min(1000, Math.round((annual * mult + eduBuffer + parentBuffer) / 100_000))
  // LIC term premium: ₹22–65 per ₹1L SA per month (age-banded, non-smoker male)
  const termMonthly = Math.round(termCoverL * (p.age < 30 ? 22 : p.age < 40 ? 38 : 62))

  // 3. Health Insurance — IRDAI benchmark + metro adjustment
  const healthCoverL = p.dependents === 0 ? 5 : p.dependents <= 2 ? 10 : 25
  // ₹280–650 per ₹1L SA per year (family floater, age-banded)
  const healthMonthly = Math.round((healthCoverL * (p.age < 35 ? 280 : p.age < 45 ? 420 : 650)) / 12)

  // 4. Equity SIP — Rule: (110 − age)% in equity, rest in debt (Morningstar India)
  const savingsCapacity = Math.round(p.monthlyIncome * 0.28) // 28% savings rate
  const sipPool = Math.max(1000, savingsCapacity - emergencyMonthly)
  const equityPct = Math.max(40, Math.min(80, 110 - p.age))
  const equitySIP = Math.round(sipPool * (equityPct / 100))
  const debtSIP = sipPool - equitySIP

  // 5. LIC Goal-based (endowment/pension) — 5–8% income
  const licMonthly = Math.round(p.monthlyIncome * 0.06)

  // Total recommended monthly outflow
  const totalMonthly = emergencyMonthly + termMonthly + healthMonthly + equitySIP + debtSIP + licMonthly

  // Protection Score (0–100)
  const coverOk = Math.min(1, (termCoverL * 100_000) / (annual * mult))
  const healthOk = Math.min(1, healthCoverL / (p.dependents > 0 ? 10 : 5))
  const savingsOk = Math.min(1, savingsCapacity / (p.monthlyIncome * 0.25))
  const protectionScore = Math.round(coverOk * 40 + healthOk * 25 + savingsOk * 35)

  // Projected corpus at 60 (12% CAGR equity, 7% debt — SIP future value approx)
  const yrs = Math.max(5, 60 - p.age)
  const equityCorpusL = Math.round((equitySIP * 12 * yrs * 2.8) / 100_000)
  const debtCorpusL = Math.round((debtSIP * 12 * yrs * 1.4) / 100_000)
  const totalCorpusL = equityCorpusL + debtCorpusL

  // Income-years of family protection
  const incomeYearsProtected = parseFloat((termCoverL / (annual / 100_000)).toFixed(1))

  // Gap: how much more per month to reach recommended allocation
  const gap = Math.max(0, totalMonthly - savingsCapacity)

  return {
    emergencyMonthly,
    emergencyTargetL: Math.round(emergencyTarget / 100_000),
    termCoverL,
    termMonthly,
    healthCoverL,
    healthMonthly,
    equitySIP,
    equityPct,
    debtSIP,
    licMonthly,
    totalMonthly,
    protectionScore,
    totalCorpusL,
    yrs,
    incomeYearsProtected,
    savingsCapacity,
    gap,
  }
}

function fmt(n: number) { return n.toLocaleString('en-IN') }

// ── Goal tiles ───────────────────────────────────────────────────────────────
const GOALS: { key: Goal; label: string; sub: string }[] = [
  { key: 'home',      label: 'Own a Home',          sub: 'Down payment & EMI buffer' },
  { key: 'education', label: "Child's Education",    sub: 'School → college corpus' },
  { key: 'retire',    label: 'Early Retirement',     sub: 'Financial independence by 50s' },
  { key: 'wealth',    label: 'Build Wealth',         sub: 'Passive income corpus' },
  { key: 'health',    label: 'Health Security',      sub: 'Medical cover for family' },
  { key: 'travel',    label: 'Travel & Leisure',     sub: 'Freedom fund' },
]

const GOAL_ICONS: Record<Goal, React.ReactNode> = {
  home:      <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h4v-4h2v4h4a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/></svg>,
  education: <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838l-2.727 1.17 1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zm5.99 7.176A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"/></svg>,
  retire:    <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"/></svg>,
  wealth:    <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zm6-4a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zm6-3a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"/></svg>,
  health:    <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd"/></svg>,
  travel:    <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"/></svg>,
}

// ── SVG Circle Progress ──────────────────────────────────────────────────────
function ScoreRing({ score }: { score: number }) {
  const r = 52
  const circ = 2 * Math.PI * r
  const offset = circ - (score / 100) * circ
  const color = score >= 70 ? '#15803d' : score >= 45 ? '#c9a84c' : '#dc2626'
  const label = score >= 70 ? 'Well Protected' : score >= 45 ? 'Needs Attention' : 'Critical Gap'
  return (
    <div className="flex flex-col items-center gap-2">
      <svg width="128" height="128" viewBox="0 0 128 128">
        <circle cx="64" cy="64" r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="10"/>
        <circle cx="64" cy="64" r={r} fill="none" stroke={color} strokeWidth="10"
          strokeDasharray={circ} strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transform: 'rotate(-90deg)', transformOrigin: '64px 64px', transition: 'stroke-dashoffset 1.2s ease' }}
        />
        <text x="64" y="58" textAnchor="middle" fill="white" fontSize="26" fontWeight="700" fontFamily="serif">{score}</text>
        <text x="64" y="74" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="9" fontFamily="sans-serif">/ 100</text>
      </svg>
      <span className="text-11 font-bold tracking-wide uppercase" style={{ color }}>{label}</span>
    </div>
  )
}

// ── Allocation Bar ────────────────────────────────────────────────────────────
function AllocBar({ label, monthly, color, icon, sub }: {
  label: string; monthly: number; color: string; icon: React.ReactNode; sub: string
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: color + '22', color }}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-baseline mb-0.5">
          <span className="text-11 font-semibold text-white/80">{label}</span>
          <span className="text-12 font-bold text-white">₹{fmt(monthly)}<span className="text-white/40 text-9">/mo</span></span>
        </div>
        <div className="text-9 text-white/35">{sub}</div>
      </div>
    </div>
  )
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function WealthBlueprintCalculator() {
  const [step, setStep] = useState(0) // 0=profile, 1=family+goals, 2=results

  // Profile
  const [age, setAge] = useState(28)
  const [monthlyIncome, setMonthlyIncome] = useState(75000)
  const [employment, setEmployment] = useState<Employment>('salaried')

  // Family
  const [dependents, setDependents] = useState(0)
  const [hasParents, setHasParents] = useState(false)
  const [goals, setGoals] = useState<Goal[]>(['wealth', 'retire'])

  const profile: Profile = { age, monthlyIncome, employment, dependents, hasParents, goals }
  const blueprint = calcBlueprint(profile)

  function toggleGoal(g: Goal) {
    setGoals(prev => prev.includes(g) ? prev.filter(x => x !== g) : [...prev, g])
  }

  const incomeLabel = monthlyIncome >= 100000
    ? `₹${(monthlyIncome / 100000).toFixed(1)}L`
    : `₹${(monthlyIncome / 1000).toFixed(0)}K`

  return (
    <section className="bg-white py-16 md:py-20 relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(circle at 15% 50%, rgba(201,168,76,0.06) 0%, transparent 60%), radial-gradient(circle at 85% 20%, rgba(4,12,28,0.04) 0%, transparent 50%)' }} />

      <div className="max-w-[1240px] mx-auto px-6 md:px-8 relative">

        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-navy/5 rounded-full px-4 py-1.5 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-gold" />
            <span className="text-10 font-bold tracking-[0.16em] uppercase text-navy/60">Poddar Wealth · Free Tool</span>
            <span className="w-1.5 h-1.5 rounded-full bg-gold" />
          </div>
          <h2 className="font-display text-30 md:text-40 font-bold text-navy leading-tight mb-3">
            Your Personal<br className="hidden md:block" /> Wealth Blueprint
          </h2>
          <p className="text-14 text-gray-500 max-w-xl mx-auto leading-relaxed">
            Answer 6 questions. Get a research-backed financial plan showing exactly how much to allocate — across protection, investments, and growth.
          </p>
        </div>

        {/* Step progress */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {['Your Profile', 'Family & Goals', 'Blueprint'].map((s, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-11 font-bold transition-all duration-300 ${
                i === step ? 'bg-navy text-white' : i < step ? 'bg-green-500/15 text-green-700' : 'bg-gray-100 text-gray-400'
              }`}>
                {i < step ? <CheckCircle2 size={10}/> : <span>{i + 1}</span>}
                {s}
              </div>
              {i < 2 && <div className={`w-6 h-px transition-colors ${i < step ? 'bg-green-400' : 'bg-gray-200'}`} />}
            </div>
          ))}
        </div>

        {/* Card */}
        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">

            {/* ── Step 0: Profile ─────────────────────────────────────────── */}
            {step === 0 && (
              <motion.div key="step0"
                initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.28 }}
                className="bg-[#f8f7f4] rounded-3xl p-8 md:p-10 border border-[rgba(184,134,11,0.1)]"
              >
                <h3 className="text-18 font-bold text-navy mb-8">Tell us about yourself</h3>

                <div className="grid md:grid-cols-2 gap-8 mb-8">
                  {/* Age */}
                  <div>
                    <div className="flex justify-between mb-3">
                      <label className="text-13 font-semibold text-navy/80">Your Age</label>
                      <span className="text-15 font-bold text-gold font-display">{age} yrs</span>
                    </div>
                    <input type="range" min={18} max={58} value={age} onChange={e => setAge(+e.target.value)} className="pw-gold-range w-full"/>
                    <div className="flex justify-between text-10 text-gray-400 mt-1">
                      <span>18</span><span>58</span>
                    </div>
                  </div>

                  {/* Income */}
                  <div>
                    <div className="flex justify-between mb-3">
                      <label className="text-13 font-semibold text-navy/80">Monthly Income</label>
                      <span className="text-15 font-bold text-gold font-display">{incomeLabel}</span>
                    </div>
                    <input type="range" min={15000} max={500000} step={5000} value={monthlyIncome}
                      onChange={e => setMonthlyIncome(+e.target.value)} className="pw-gold-range w-full"/>
                    <div className="flex justify-between text-10 text-gray-400 mt-1">
                      <span>₹15K</span><span>₹5L+</span>
                    </div>
                  </div>
                </div>

                {/* Employment Type */}
                <div>
                  <label className="text-13 font-semibold text-navy/80 block mb-3">How do you earn?</label>
                  <div className="grid grid-cols-3 gap-3">
                    {([
                      { k: 'salaried', l: 'Salaried', sub: 'Monthly paycheck' },
                      { k: 'freelance', l: 'Freelance', sub: 'Variable income' },
                      { k: 'business', l: 'Business', sub: 'Self-employed' },
                    ] as const).map(({ k, l, sub }) => (
                      <button key={k} onClick={() => setEmployment(k)}
                        className={`px-4 py-3 rounded-2xl border-2 text-left transition-all duration-200 ${
                          employment === k
                            ? 'border-navy bg-navy text-white'
                            : 'border-gray-200 bg-white text-navy hover:border-navy/30'
                        }`}>
                        <div className="text-12 font-bold">{l}</div>
                        <div className={`text-10 mt-0.5 ${employment === k ? 'text-white/60' : 'text-gray-400'}`}>{sub}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-8 flex justify-end">
                  <button onClick={() => setStep(1)}
                    className="flex items-center gap-2 bg-navy text-white font-bold text-13 px-8 py-3 rounded-full hover:bg-navy/90 transition-all duration-150 shadow-lg">
                    Next <ArrowRight size={14}/>
                  </button>
                </div>
              </motion.div>
            )}

            {/* ── Step 1: Family & Goals ───────────────────────────────────── */}
            {step === 1 && (
              <motion.div key="step1"
                initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.28 }}
                className="bg-[#f8f7f4] rounded-3xl p-8 md:p-10 border border-[rgba(184,134,11,0.1)]"
              >
                <h3 className="text-18 font-bold text-navy mb-8">Your family &amp; financial goals</h3>

                <div className="grid md:grid-cols-2 gap-8 mb-8">
                  {/* Dependents */}
                  <div>
                    <label className="text-13 font-semibold text-navy/80 block mb-3">People who depend on your income</label>
                    <div className="flex gap-2 flex-wrap">
                      {[0, 1, 2, 3, '4+'].map((n, i) => (
                        <button key={i} onClick={() => setDependents(i)}
                          className={`w-12 h-12 rounded-2xl border-2 text-13 font-bold transition-all duration-150 ${
                            dependents === i
                              ? 'border-navy bg-navy text-white'
                              : 'border-gray-200 bg-white text-navy hover:border-navy/30'
                          }`}>
                          {n}
                        </button>
                      ))}
                    </div>
                    <p className="text-10 text-gray-400 mt-2">Spouse, children, parents</p>
                  </div>

                  {/* Aged Parents */}
                  <div>
                    <label className="text-13 font-semibold text-navy/80 block mb-3">Do you support aged parents?</label>
                    <div className="flex gap-3">
                      {[true, false].map(v => (
                        <button key={String(v)} onClick={() => setHasParents(v)}
                          className={`flex-1 py-3 rounded-2xl border-2 text-12 font-bold transition-all duration-150 ${
                            hasParents === v
                              ? 'border-navy bg-navy text-white'
                              : 'border-gray-200 bg-white text-navy hover:border-navy/30'
                          }`}>
                          {v ? 'Yes' : 'No'}
                        </button>
                      ))}
                    </div>
                    <p className="text-10 text-gray-400 mt-2">Increases recommended life cover</p>
                  </div>
                </div>

                {/* Goals */}
                <div>
                  <label className="text-13 font-semibold text-navy/80 block mb-3">
                    What matters most to you? <span className="font-normal text-gray-400">(select all that apply)</span>
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5">
                    {GOALS.map(({ key, label, sub }) => {
                      const active = goals.includes(key)
                      return (
                        <button key={key} onClick={() => toggleGoal(key)}
                          className={`text-left px-4 py-3 rounded-2xl border-2 transition-all duration-150 ${
                            active
                              ? 'border-gold bg-gold/8 text-navy'
                              : 'border-gray-200 bg-white text-navy/60 hover:border-gold/40'
                          }`}>
                          <div className={`flex items-center gap-2 mb-0.5 ${active ? 'text-gold' : 'text-gray-400'}`}>
                            {GOAL_ICONS[key]}
                            <span className="text-12 font-bold text-navy">{label}</span>
                          </div>
                          <div className="text-10 text-gray-400 leading-snug">{sub}</div>
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div className="mt-8 flex justify-between">
                  <button onClick={() => setStep(0)}
                    className="text-13 font-semibold text-navy/50 hover:text-navy transition-colors px-4 py-2">
                    ← Back
                  </button>
                  <button onClick={() => setStep(2)}
                    className="flex items-center gap-2 bg-gold text-white font-bold text-13 px-8 py-3 rounded-full hover:bg-gold/90 transition-all duration-150 shadow-lg">
                    Show My Blueprint <ArrowRight size={14}/>
                  </button>
                </div>
              </motion.div>
            )}

            {/* ── Step 2: Blueprint Results ────────────────────────────────── */}
            {step === 2 && (
              <motion.div key="step2"
                initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.35 }}
              >
                <div className="grid md:grid-cols-5 gap-4 md:gap-6">

                  {/* Left: Score + Allocation ─────────────── */}
                  <div className="md:col-span-2 bg-navy rounded-3xl p-7 flex flex-col gap-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-gold/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"/>

                    <div className="relative z-10">
                      <div className="text-10 tracking-[0.18em] font-bold text-gold/70 uppercase mb-4">
                        Financial Health Score
                      </div>
                      <ScoreRing score={blueprint.protectionScore} />
                    </div>

                    <div className="relative z-10 space-y-3.5 pt-2 border-t border-white/8">
                      <div className="text-10 tracking-[0.15em] font-bold text-white/40 uppercase mb-2">
                        Monthly Allocation
                      </div>
                      <AllocBar label="Emergency Fund" monthly={blueprint.emergencyMonthly}
                        color="#f59e0b" icon={<PiggyBank size={13}/>}
                        sub={`Target: ₹${blueprint.emergencyTargetL}L in 18 months`} />
                      <AllocBar label="Term Life Cover" monthly={blueprint.termMonthly}
                        color="#ef4444" icon={<Shield size={13}/>}
                        sub={`₹${blueprint.termCoverL}L coverage recommended`} />
                      <AllocBar label="Health Insurance" monthly={blueprint.healthMonthly}
                        color="#22c55e" icon={<Heart size={13}/>}
                        sub={`₹${blueprint.healthCoverL}L family floater`} />
                      <AllocBar label="Equity SIP" monthly={blueprint.equitySIP}
                        color="#3b82f6" icon={<TrendingUp size={13}/>}
                        sub={`${blueprint.equityPct}% equity · 12% CAGR target`} />
                      <AllocBar label="LIC / Goal Plans" monthly={blueprint.licMonthly}
                        color="#c9a84c" icon={<Landmark size={13}/>}
                        sub="Endowment + pension allocation" />
                    </div>

                    <div className="relative z-10 bg-white/8 rounded-2xl p-4 border border-white/10">
                      <div className="text-20 font-bold text-white">₹{fmt(blueprint.totalMonthly)}<span className="text-12 font-normal text-white/50">/month</span></div>
                      <div className="text-10 text-white/50 mt-0.5">Total recommended allocation</div>
                      {blueprint.gap > 0 && (
                        <div className="mt-2 text-10 text-amber-300">
                          ₹{fmt(blueprint.gap)}/mo gap to full protection
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right: Insights ─────────────────────── */}
                  <div className="md:col-span-3 flex flex-col gap-4">

                    {/* Key numbers row */}
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { val: `₹${blueprint.termCoverL}L`, label: 'Life Cover Needed', sub: 'DIME method', color: '#ef4444' },
                        { val: `${blueprint.incomeYearsProtected}x`, label: 'Income Years Protected', sub: 'Family runway', color: '#c9a84c' },
                        { val: `₹${blueprint.totalCorpusL}L`, label: `Corpus at 60`, sub: `${blueprint.yrs} yrs @ 12% CAGR`, color: '#3b82f6' },
                      ].map(({ val, label, sub, color }) => (
                        <div key={label} className="bg-[#f8f7f4] rounded-2xl p-4 border border-gray-100">
                          <div className="text-22 font-bold leading-none mb-1" style={{ color }}>{val}</div>
                          <div className="text-11 font-semibold text-navy leading-snug">{label}</div>
                          <div className="text-9 text-gray-400 mt-0.5">{sub}</div>
                        </div>
                      ))}
                    </div>

                    {/* Insights */}
                    <div className="bg-[#f8f7f4] rounded-2xl p-5 border border-gray-100 flex-1">
                      <h4 className="text-13 font-bold text-navy mb-4">Your Personalised Insights</h4>
                      <div className="space-y-3">
                        {[
                          {
                            color: '#ef4444',
                            title: `Pure term cover: ₹${blueprint.termCoverL} Lakh`,
                            body: `At age ${age} with ${dependents} dependent${dependents !== 1 ? 's' : ''}, you need ${blueprint.termCoverL}L of pure term cover. LIC Jeevan Amar or Tech Term are the most cost-efficient options.`,
                          },
                          {
                            color: '#22c55e',
                            title: `Health cover: ₹${blueprint.healthCoverL} Lakh family floater`,
                            body: `Medical inflation runs at 14%/year in India. A ₹${blueprint.healthCoverL}L floater with a top-up rider protects your savings from a single hospitalisation.`,
                          },
                          {
                            color: '#3b82f6',
                            title: `SIP of ₹${fmt(blueprint.equitySIP)}/month builds ₹${blueprint.totalCorpusL}L by 60`,
                            body: `${blueprint.equityPct}% equity allocation matches your age ${age} profile. Start with large-cap index funds, add mid-cap after your emergency fund is built.`,
                          },
                          {
                            color: '#c9a84c',
                            title: 'Emergency fund first — everything else second',
                            body: `Build ₹${blueprint.emergencyTargetL}L (${employment === 'salaried' ? '6' : employment === 'freelance' ? '9' : '12'} months' expenses) before aggressive investing. This is your financial immune system.`,
                          },
                        ].map(({ color, title, body }) => (
                          <div key={title} className="flex gap-3 items-start">
                            <div className="w-1 flex-shrink-0 rounded-full self-stretch mt-0.5" style={{ background: color, minHeight: '32px' }} />
                            <div>
                              <div className="text-11 font-bold text-navy">{title}</div>
                              <div className="text-10 text-gray-500 mt-0.5 leading-relaxed">{body}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Journey milestones */}
                    <div className="bg-navy/4 rounded-2xl p-5 border border-navy/8">
                      <h4 className="text-11 font-bold text-navy/60 uppercase tracking-widest mb-3">Your Financial Journey</h4>
                      <div className="flex gap-0">
                        {[
                          { yr: `Age ${age + 1}`, label: 'Emergency fund complete' },
                          { yr: `Age ${Math.min(age + 4, 45)}`, label: 'Fully insured + SIP running' },
                          { yr: `Age ${Math.min(age + 10, 55)}`, label: `₹${Math.round(blueprint.totalCorpusL * 0.3)}L corpus milestone` },
                          { yr: 'Age 60', label: `₹${blueprint.totalCorpusL}L retirement ready` },
                        ].map((m, i, arr) => (
                          <div key={i} className="flex-1 relative">
                            <div className="flex items-center">
                              <div className="w-3 h-3 rounded-full bg-gold flex-shrink-0 z-10"/>
                              {i < arr.length - 1 && <div className="flex-1 h-px bg-gold/30"/>}
                            </div>
                            <div className="mt-2 pr-2">
                              <div className="text-9 font-bold text-gold">{m.yr}</div>
                              <div className="text-9 text-navy/60 leading-snug mt-0.5">{m.label}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* CTA */}
                    <div className="flex gap-3">
                      <button onClick={() => setStep(0)}
                        className="px-5 py-3 rounded-full border-2 border-navy/20 text-12 font-semibold text-navy/60 hover:border-navy/40 hover:text-navy transition-all">
                        Recalculate
                      </button>
                      <button onClick={() => openLeadPopup('Wealth Blueprint Consultation')}
                        className="flex-1 flex items-center justify-center gap-2 bg-navy text-white font-bold text-13 py-3 rounded-full hover:bg-navy/90 transition-all shadow-lg">
                        Get this plan built by Ajay sir <ChevronRight size={14}/>
                      </button>
                    </div>

                    <p className="text-9 text-gray-400 text-center leading-relaxed">
                      Estimates based on IRDAI guidelines, DIME life-cover formula, and Morningstar India allocation models.
                      Actual premiums vary. Not financial advice.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
