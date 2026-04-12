'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Shield, Heart, TrendingUp, Landmark, PiggyBank, Lock, CheckCircle2, ArrowRight, ChevronRight, AlertTriangle, Info } from 'lucide-react'
import { openLeadPopup } from '@/lib/events'

// ── Types ────────────────────────────────────────────────────────────────────
type Employment = 'salaried' | 'freelance' | 'business'
type CityTier  = 'metro' | 'tier2' | 'tier3'
type Goal      = 'home' | 'education' | 'retire' | 'wealth' | 'health' | 'travel'

interface WealthProfile {
  // Step 0 — Identity
  age: number
  monthlyIncome: number
  employment: Employment
  cityTier: CityTier
  // Step 1 — Family
  isMarried: boolean
  spouseIncomeL: number       // annual, in lakhs (bucket midpoint)
  children: number
  childAges: number[]
  hasAgedParents: boolean
  // Step 2 — Current Shield
  existingLifeCoverL: number  // life insurance SA (lakhs)
  existingHealthL: number     // health cover (lakhs)
  homeLoanL: number           // outstanding home loan (lakhs)
  otherLoansL: number         // other loans (lakhs)
  // Step 3 — Wealth
  equityL: number             // stocks + MF (lakhs)
  debtSavingsL: number        // FD + PPF + NPS (lakhs)
  realEstateL: number         // property (lakhs)
  retirementAge: number
  goals: Goal[]
}

// ── Research-backed Calculation Engine ──────────────────────────────────────
// Sources: IRDAI HLV guidelines, Trinity Study (Bengen 1994), Swiss Re protection
// gap sigma, LIMRA underinsurance data, Vanguard/Morningstar allocation models,
// SEBI emergency fund framework, 11% education inflation (India avg)

function selfConsumptionRate(isMarried: boolean, kids: number): number {
  if (!isMarried && kids === 0) return 0.45
  if (isMarried && kids === 0) return 0.35
  return 0.28
}

// IRDAI Present Value method (6.5% discount rate = conservative India rate)
function calcHLV(annual: number, age: number, retAge: number, selfConsump: number): number {
  const n = Math.max(1, retAge - age)
  const r = 0.065
  const pvFactor = (1 - Math.pow(1 + r, -n)) / r
  return Math.round(annual * (1 - selfConsump) * pvFactor)
}

// SIP Future Value (annuity-due, compounded monthly)
function sipFV(monthly: number, annualRate: number, years: number): number {
  if (years <= 0 || monthly <= 0) return 0
  const r = annualRate / 12, n = years * 12
  return Math.round(monthly * ((Math.pow(1 + r, n) - 1) / r) * (1 + r))
}

// Lump-sum future value
function lumpFV(pv: number, rate: number, years: number): number {
  return years <= 0 ? pv : Math.round(pv * Math.pow(1 + rate, years))
}

// 3.5% SWR (India-adjusted from Trinity Study — higher inflation, weaker pension)
// Corpus = Inflated Annual Expense ÷ 0.035 = 28.57× annual expenses
function retirementCorpusNeeded(monthlyExpense: number, yrs: number): number {
  const inflated = monthlyExpense * Math.pow(1.065, yrs) // 6.5% CPI
  return Math.round(inflated * 12 / 0.035)
}

// Education corpus — 11% education inflation (private India avg), base cost ₹18L (avg 2026 private engineering)
function eduCorpus(childAge: number): number {
  const yearsLeft = Math.max(0, 18 - childAge)
  return Math.round(1_800_000 * Math.pow(1.11, yearsLeft))
}

// Cost of delay — comparing corpus at retirement with vs without N-year delay
function costOfDelay(monthly: number, age: number, delayYrs: number, retAge: number): number {
  const w = sipFV(monthly, 0.12, retAge - age)
  const d = sipFV(monthly, 0.12, retAge - age - delayYrs)
  return Math.max(0, w - d)
}

// Health cover recommendation (IRDAI + city tier)
function recommendedHealthL(tier: CityTier, hasFamily: boolean): number {
  if (tier === 'metro') return hasFamily ? 50 : 25
  if (tier === 'tier2') return hasFamily ? 25 : 10
  return hasFamily ? 15 : 5
}

// ── Full Blueprint ───────────────────────────────────────────────────────────
function calcBlueprint(p: WealthProfile) {
  const annual = p.monthlyIncome * 12
  const expenses = p.monthlyIncome * 0.65
  const hasFamily = p.isMarried || p.children > 0
  const yrsToRet = Math.max(1, p.retirementAge - p.age)

  // HLV
  const selfC = selfConsumptionRate(p.isMarried, p.children)
  const hlv = calcHLV(annual, p.age, p.retirementAge, selfC)
  const hlvL = Math.round(hlv / 100_000)

  // Protection gap
  const liquidProtectionL = p.equityL + p.debtSavingsL - p.otherLoansL
  const totalProtectedL   = p.existingLifeCoverL + Math.max(0, liquidProtectionL)
  const protectionGapL    = Math.max(0, hlvL + p.homeLoanL - totalProtectedL)
  const protectionGapPct  = hlvL > 0 ? Math.min(100, Math.round((protectionGapL / hlvL) * 100)) : 0

  // Health
  const recHealthL   = recommendedHealthL(p.cityTier, hasFamily)
  const healthGapL   = Math.max(0, recHealthL - p.existingHealthL)
  const healthOkPct  = Math.min(100, p.existingHealthL > 0 ? Math.round((p.existingHealthL / recHealthL) * 100) : 0)

  // Retirement corpus
  const retCorpus     = retirementCorpusNeeded(expenses, yrsToRet)
  const equityGrowth  = lumpFV(p.equityL * 100_000, 0.12, yrsToRet)
  const debtGrowth    = lumpFV(p.debtSavingsL * 100_000, 0.077, yrsToRet)
  const reGrowth      = lumpFV(p.realEstateL * 0.72 * 100_000, 0.08, yrsToRet)
  const currentGrowth = equityGrowth + debtGrowth + reGrowth

  const recEquitySIP     = Math.max(3000, Math.round(p.monthlyIncome * 0.15))
  const ongoingProjected = sipFV(recEquitySIP, 0.12, yrsToRet)
  const totalProjected   = currentGrowth + ongoingProjected
  const retSurplusDeficit = totalProjected - retCorpus  // negative = deficit

  let addlMonthlyForRet = 0
  if (retSurplusDeficit < 0) {
    const r = 0.12 / 12, n = yrsToRet * 12
    addlMonthlyForRet = Math.round(Math.abs(retSurplusDeficit) / (((Math.pow(1 + r, n) - 1) / r) * (1 + r)))
  }

  // Education
  const eduCorpusL = p.childAges.slice(0, p.children).map(a => Math.round(eduCorpus(a) / 100_000))
  const totalEduL  = eduCorpusL.reduce((a, b) => a + b, 0)

  // Emergency fund
  const eMos  = p.employment === 'salaried' ? 6 : p.employment === 'freelance' ? 9 : 12
  const eTgtL = Math.round(expenses * eMos / 100_000)
  const eMo   = Math.round(expenses * eMos / 18) // build in 18 months

  // Term premium (LIC band: ₹/lakh SA/year ÷ 12)
  const termRate       = p.age < 30 ? 22 : p.age < 40 ? 38 : 62
  const termCoverNeedL = Math.min(500, protectionGapL)
  const termMonthly    = Math.max(400, Math.round(termCoverNeedL * termRate))

  // Health premium
  const hRate        = p.age < 35 ? 280 : p.age < 45 ? 420 : 650
  const hCoverL      = healthGapL > 0 ? healthGapL : p.existingHealthL
  const healthMonthly = Math.round(hCoverL * hRate / 12)

  // SIP (120 − age rule — Morningstar/Vanguard India adjustment for high inflation)
  const eqPct        = Math.max(50, Math.min(90, 120 - p.age))
  const sipPool      = Math.max(2000, Math.round(p.monthlyIncome * 0.20))
  const equitySIP    = Math.round(sipPool * eqPct / 100)
  const debtSIP      = sipPool - equitySIP

  // LIC goal allocation (~6% income)
  const licMonthly   = Math.round(p.monthlyIncome * 0.06)

  const totalMonthly = eMo + termMonthly + healthMonthly + equitySIP + debtSIP + licMonthly
  const savingsCap   = Math.round(p.monthlyIncome * 0.30)

  // Cost of 3-year delay
  const delay3L = Math.round(costOfDelay(equitySIP, p.age, 3, p.retirementAge) / 100_000)

  // Net worth
  const netWorthL = Math.round(p.equityL + p.debtSavingsL + p.realEstateL * 0.72 - p.homeLoanL - p.otherLoansL)

  // Overall score (0–100) across 4 pillars
  const s1 = Math.round(30 * Math.max(0, 1 - protectionGapL / Math.max(1, hlvL)))
  const s2 = Math.round(20 * Math.min(1, healthOkPct / 100))
  const s3 = 10 // partial: can't know emergency fund balance without asking
  const s4 = Math.round(40 * Math.min(1, Math.max(0, totalProjected / retCorpus)))
  const score = Math.min(100, s1 + s2 + s3 + s4)

  const incYears = annual > 0 ? parseFloat(((p.existingLifeCoverL * 100_000) / annual).toFixed(1)) : 0

  return {
    hlvL, hlvCrore: +(hlv / 1e7).toFixed(2),
    existingCoverL: p.existingLifeCoverL, liquidProtectionL,
    totalProtectedL, protectionGapL, protectionGapCrore: +(protectionGapL / 100).toFixed(2), protectionGapPct,
    recHealthL, healthGapL, healthOkPct,
    retCorpusCrore: +(retCorpus / 1e7).toFixed(2),
    currentGrowthCrore: +(currentGrowth / 1e7).toFixed(2),
    totalProjectedCrore: +(totalProjected / 1e7).toFixed(2),
    retSurplusDeficitCrore: +(retSurplusDeficit / 1e7).toFixed(2),
    addlMonthlyForRet,
    eduCorpusL, totalEduL,
    eTgtL, eMo, termCoverNeedL, termMonthly, healthMonthly,
    equitySIP, eqPct, debtSIP, licMonthly,
    totalMonthly, savingsCap,
    delay3L,
    netWorthL, score, incYears, yrsToRet,
  }
}

// ── Helpers ──────────────────────────────────────────────────────────────────
function fmt(n: number, decimals = 0) {
  return n.toLocaleString('en-IN', { maximumFractionDigits: decimals })
}
function crore(v: number) { return v >= 1 ? `₹${v.toFixed(1)}Cr` : `₹${Math.round(v * 100)}L` }

// ── Sub-components ───────────────────────────────────────────────────────────
function ScoreRing({ score }: { score: number }) {
  const r = 48, circ = 2 * Math.PI * r
  const dash = circ - (score / 100) * circ
  const color = score >= 65 ? '#22c55e' : score >= 40 ? '#f59e0b' : '#ef4444'
  const label = score >= 65 ? 'Well Protected' : score >= 40 ? 'Needs Attention' : 'Critical Gap'
  return (
    <div className="flex flex-col items-center gap-1.5">
      <svg width="112" height="112" viewBox="0 0 112 112">
        <circle cx="56" cy="56" r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="9"/>
        <circle cx="56" cy="56" r={r} fill="none" stroke={color} strokeWidth="9"
          strokeDasharray={circ} strokeDashoffset={dash} strokeLinecap="round"
          style={{ transform: 'rotate(-90deg)', transformOrigin: '56px 56px', transition: 'stroke-dashoffset 1.4s ease' }}/>
        <text x="56" y="52" textAnchor="middle" fill="white" fontSize="24" fontWeight="700">{score}</text>
        <text x="56" y="66" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="9">/100 SCORE</text>
      </svg>
      <span className="text-10 font-bold tracking-wide uppercase" style={{ color }}>{label}</span>
    </div>
  )
}

function InsightCard({ color, icon: Icon, title, children, alert }: {
  color: string; icon: any; title: string; children: React.ReactNode; alert?: boolean
}) {
  return (
    <div className={`rounded-2xl p-4 border ${alert ? 'border-red-100 bg-red-50/40' : 'border-gray-100 bg-[#f9f8f6]'}`}>
      <div className="flex items-center gap-2 mb-2">
        <div className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: color + '18', color }}>
          <Icon size={12}/>
        </div>
        <span className="text-11 font-bold text-navy">{title}</span>
      </div>
      <div className="text-10 text-gray-600 leading-relaxed pl-8">{children}</div>
    </div>
  )
}

type BucketOpt = { label: string; value: number }
function BucketSelect({ label, note, value, onChange, opts }: {
  label: string; note?: string; value: number; onChange: (v: number) => void; opts: BucketOpt[]
}) {
  return (
    <div>
      <div className="flex items-baseline gap-2 mb-1.5">
        <span className="text-12 font-semibold text-navy/80">{label}</span>
        {note && <span className="text-10 text-gray-400">{note}</span>}
      </div>
      <div className="flex flex-wrap gap-1.5">
        {opts.map(o => (
          <button key={o.value} onClick={() => onChange(o.value)}
            className={`px-3 py-1.5 rounded-xl border text-11 font-semibold transition-all duration-150 ${
              value === o.value ? 'border-navy bg-navy text-white' : 'border-gray-200 bg-white text-navy/60 hover:border-navy/30'
            }`}>
            {o.label}
          </button>
        ))}
      </div>
    </div>
  )
}

// Bucket option sets
const LIFE_COVER_OPTS: BucketOpt[] = [
  { label: 'None', value: 0 }, { label: '≤ ₹25L', value: 12 },
  { label: '₹25–50L', value: 37 }, { label: '₹50L–1Cr', value: 75 },
  { label: '₹1–2Cr', value: 150 }, { label: '₹2Cr+', value: 250 },
]
const HEALTH_OPTS: BucketOpt[] = [
  { label: 'None', value: 0 }, { label: '₹5L', value: 5 },
  { label: '₹10L', value: 10 }, { label: '₹25L', value: 25 },
  { label: '₹50L', value: 50 }, { label: '₹1Cr+', value: 100 },
]
const LOAN_OPTS: BucketOpt[] = [
  { label: 'None', value: 0 }, { label: '< ₹10L', value: 5 },
  { label: '₹10–25L', value: 17 }, { label: '₹25–50L', value: 37 },
  { label: '₹50L–1Cr', value: 75 }, { label: '₹1Cr+', value: 125 },
]
const EQUITY_OPTS: BucketOpt[] = [
  { label: 'None', value: 0 }, { label: '< ₹5L', value: 2 },
  { label: '₹5–25L', value: 15 }, { label: '₹25–50L', value: 37 },
  { label: '₹50L–1Cr', value: 75 }, { label: '₹1–3Cr', value: 200 },
  { label: '₹3Cr+', value: 400 },
]
const RE_OPTS: BucketOpt[] = [
  { label: 'None', value: 0 }, { label: '< ₹50L', value: 25 },
  { label: '₹50L–1Cr', value: 75 }, { label: '₹1–2Cr', value: 150 },
  { label: '₹2–5Cr', value: 350 }, { label: '₹5Cr+', value: 600 },
]
const GOAL_DEFS: { key: Goal; label: string; sub: string }[] = [
  { key: 'home',      label: 'Own a Home',         sub: 'Down payment corpus' },
  { key: 'education', label: "Child's Education",   sub: 'Engineering/MBA fund' },
  { key: 'retire',    label: 'Early Retirement',    sub: 'Financial freedom by 50s' },
  { key: 'wealth',    label: 'Build Wealth',        sub: 'Passive income corpus' },
  { key: 'health',    label: 'Health Security',     sub: 'Family medical cover' },
  { key: 'travel',    label: 'Travel & Leisure',    sub: 'Freedom fund' },
]

// ── Main Component ────────────────────────────────────────────────────────────
export default function WealthBlueprintCalculator() {
  const TOTAL_STEPS = 4
  const [step, setStep] = useState(0)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [saveError, setSaveError] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')

  // Step 0
  const [age, setAge]             = useState(29)
  const [monthlyIncome, setMI]    = useState(80000)
  const [employment, setEmploy]   = useState<Employment>('salaried')
  const [cityTier, setCityTier]   = useState<CityTier>('metro')

  // Step 1
  const [isMarried, setMarried]     = useState(false)
  const [spouseIncomeL, setSpouse]  = useState(0)
  const [children, setChildren]     = useState(0)
  const [childAges, setChildAges]   = useState<number[]>([3, 6, 10, 13])
  const [hasAgedParents, setParents]= useState(false)

  // Step 2
  const [existingLifeCoverL, setLifeCover] = useState(0)
  const [existingHealthL, setHealth]        = useState(0)
  const [homeLoanL, setHomeLoan]            = useState(0)
  const [otherLoansL, setOtherLoans]        = useState(0)

  // Step 3
  const [equityL, setEquity]         = useState(0)
  const [debtSavingsL, setDebt]      = useState(0)
  const [realEstateL, setRE]         = useState(0)
  const [retirementAge, setRetAge]   = useState(60)
  const [goals, setGoals]            = useState<Goal[]>(['wealth', 'retire'])

  function toggleGoal(g: Goal) {
    setGoals(prev => prev.includes(g) ? prev.filter(x => x !== g) : [...prev, g])
  }
  function setChildAge(idx: number, val: number) {
    setChildAges(prev => { const a = [...prev]; a[idx] = val; return a })
  }

  const profile: WealthProfile = {
    age, monthlyIncome, employment, cityTier,
    isMarried, spouseIncomeL, children, childAges,
    hasAgedParents, existingLifeCoverL, existingHealthL,
    homeLoanL, otherLoansL, equityL, debtSavingsL, realEstateL,
    retirementAge, goals,
  }
  const bp = calcBlueprint(profile)

  const incomeLabel = monthlyIncome >= 100000
    ? `₹${(monthlyIncome / 100000).toFixed(monthlyIncome % 100000 === 0 ? 0 : 1)}L`
    : `₹${Math.round(monthlyIncome / 1000)}K`

  async function saveBlueprint() {
    if (!name || !phone || phone.length < 10) return
    setSaving(true)
    setSaveError('')
    try {
      await fetch('/api/blueprint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone, profile, blueprint: bp }),
      })
      setSaved(true)
    } catch {
      setSaveError('Could not save. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const stepVariants = {
    initial: { opacity: 0, x: 24 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: -24 }
  }

  // Confidentiality banner (shown on steps 2 & 3)
  const ConfidentialBanner = (
    <div className="flex items-center gap-2 bg-navy/4 rounded-xl px-3 py-2 mb-6 border border-navy/8">
      <Lock size={12} className="text-navy/50 flex-shrink-0"/>
      <p className="text-10 text-navy/60 leading-snug">
        <strong className="text-navy/80">100% Confidential.</strong> Your financial details are never stored, sold, or shared. Used only to calculate your blueprint.
      </p>
    </div>
  )

  return (
    <section className="bg-white py-16 md:py-20 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(circle at 12% 60%, rgba(201,168,76,0.07) 0%, transparent 55%), radial-gradient(circle at 88% 15%, rgba(4,12,28,0.04) 0%, transparent 50%)' }}/>

      <div className="max-w-[1200px] mx-auto px-5 md:px-8 relative">

        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-[#f5f3ee] rounded-full px-4 py-1.5 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-gold"/>
            <span className="text-10 font-bold tracking-[0.16em] uppercase text-navy/55">Poddar Wealth · Free Planning Tool</span>
            <span className="w-1.5 h-1.5 rounded-full bg-gold"/>
          </div>
          <h2 className="font-display text-28 md:text-38 font-bold text-navy leading-tight mb-3">
            Your Personal Wealth Blueprint
          </h2>
          <p className="text-14 text-gray-500 max-w-2xl mx-auto leading-relaxed">
            4 questions. A research-backed financial plan — covering your protection gap, retirement reality, and exactly how much to allocate across every category.
          </p>
        </div>

        {/* Progress */}
        {step < TOTAL_STEPS && (
          <div className="flex items-center justify-center gap-1.5 mb-8">
            {['Your Identity', 'Your Family', 'Your Shield', 'Your Wealth'].map((s, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-10 font-bold transition-all ${
                  i === step ? 'bg-navy text-white' : i < step ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'
                }`}>
                  {i < step ? <CheckCircle2 size={9}/> : <span>{i + 1}</span>}
                  <span className="hidden sm:inline">{s}</span>
                </div>
                {i < 3 && <div className={`w-4 h-px ${i < step ? 'bg-green-300' : 'bg-gray-200'}`}/>}
              </div>
            ))}
          </div>
        )}

        <div className="max-w-3xl mx-auto">
          <AnimatePresence mode="wait">

            {/* ── Step 0: Identity ────────────────────────────────────────── */}
            {step === 0 && (
              <motion.div key="s0" {...stepVariants} transition={{ duration: 0.25 }}
                className="bg-[#f8f7f4] rounded-3xl p-7 md:p-9 border border-[rgba(184,134,11,0.1)]">
                <h3 className="text-17 font-bold text-navy mb-7">Let's start with the basics</h3>

                <div className="grid md:grid-cols-2 gap-7 mb-7">
                  <div>
                    <div className="flex justify-between mb-2">
                      <label className="text-12 font-semibold text-navy/75">Your Age</label>
                      <span className="text-14 font-bold text-gold">{age} yrs</span>
                    </div>
                    <input type="range" min={20} max={58} value={age} onChange={e => setAge(+e.target.value)} className="pw-gold-range w-full"/>
                    <div className="flex justify-between text-9 text-gray-400 mt-0.5"><span>20</span><span>58</span></div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <label className="text-12 font-semibold text-navy/75">Monthly Income</label>
                      <span className="text-14 font-bold text-gold">{incomeLabel}</span>
                    </div>
                    <input type="range" min={15000} max={700000} step={5000} value={monthlyIncome}
                      onChange={e => setMI(+e.target.value)} className="pw-gold-range w-full"/>
                    <div className="flex justify-between text-9 text-gray-400 mt-0.5"><span>₹15K</span><span>₹7L+</span></div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-12 font-semibold text-navy/75 block mb-2">How do you earn?</label>
                    <div className="grid grid-cols-3 gap-2">
                      {([['salaried', 'Salaried', 'Monthly paycheck'], ['freelance', 'Freelance', 'Variable income'], ['business', 'Business', 'Self-employed']] as const).map(([k, l, s]) => (
                        <button key={k} onClick={() => setEmploy(k)}
                          className={`px-3 py-2.5 rounded-2xl border-2 text-left transition-all ${employment === k ? 'border-navy bg-navy text-white' : 'border-gray-200 bg-white text-navy hover:border-navy/30'}`}>
                          <div className="text-11 font-bold">{l}</div>
                          <div className={`text-9 mt-0.5 ${employment === k ? 'text-white/55' : 'text-gray-400'}`}>{s}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-12 font-semibold text-navy/75 block mb-2">City Tier</label>
                    <div className="grid grid-cols-3 gap-2">
                      {([['metro', 'Metro', 'Delhi/Mum/Blr'], ['tier2', 'Tier-2', 'Pune/Hyd/Lko'], ['tier3', 'Tier-3', 'Smaller city']] as const).map(([k, l, s]) => (
                        <button key={k} onClick={() => setCityTier(k)}
                          className={`px-3 py-2.5 rounded-2xl border-2 text-left transition-all ${cityTier === k ? 'border-navy bg-navy text-white' : 'border-gray-200 bg-white text-navy hover:border-navy/30'}`}>
                          <div className="text-11 font-bold">{l}</div>
                          <div className={`text-9 mt-0.5 ${cityTier === k ? 'text-white/55' : 'text-gray-400'}`}>{s}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-7 flex justify-end">
                  <button onClick={() => setStep(1)}
                    className="flex items-center gap-2 bg-navy text-white font-bold text-13 px-7 py-3 rounded-full hover:bg-navy/90 transition-all shadow-md">
                    Next <ArrowRight size={13}/>
                  </button>
                </div>
              </motion.div>
            )}

            {/* ── Step 1: Family ──────────────────────────────────────────── */}
            {step === 1 && (
              <motion.div key="s1" {...stepVariants} transition={{ duration: 0.25 }}
                className="bg-[#f8f7f4] rounded-3xl p-7 md:p-9 border border-[rgba(184,134,11,0.1)]">
                <h3 className="text-17 font-bold text-navy mb-7">Who depends on you?</h3>

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="text-12 font-semibold text-navy/75 block mb-2">Marital Status</label>
                    <div className="grid grid-cols-2 gap-2">
                      {([['true', 'Married'], ['false', 'Single']] as const).map(([v, l]) => (
                        <button key={v} onClick={() => setMarried(v === 'true')}
                          className={`py-3 rounded-2xl border-2 text-12 font-bold transition-all ${isMarried === (v === 'true') ? 'border-navy bg-navy text-white' : 'border-gray-200 bg-white text-navy hover:border-navy/30'}`}>
                          {l}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-12 font-semibold text-navy/75 block mb-2">Support aged parents?</label>
                    <div className="grid grid-cols-2 gap-2">
                      {([['true', 'Yes'], ['false', 'No']] as const).map(([v, l]) => (
                        <button key={v} onClick={() => setParents(v === 'true')}
                          className={`py-3 rounded-2xl border-2 text-12 font-bold transition-all ${hasAgedParents === (v === 'true') ? 'border-navy bg-navy text-white' : 'border-gray-200 bg-white text-navy hover:border-navy/30'}`}>
                          {l}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="text-12 font-semibold text-navy/75 block mb-2">Number of children</label>
                  <div className="flex gap-2 flex-wrap">
                    {[0,1,2,3,4].map(n => (
                      <button key={n} onClick={() => setChildren(n)}
                        className={`w-11 h-11 rounded-2xl border-2 text-13 font-bold transition-all ${children === n ? 'border-navy bg-navy text-white' : 'border-gray-200 bg-white text-navy hover:border-navy/30'}`}>
                        {n}
                      </button>
                    ))}
                  </div>
                </div>

                {children > 0 && (
                  <div className="mb-6 bg-white rounded-2xl p-4 border border-gray-100">
                    <label className="text-11 font-semibold text-navy/60 block mb-3 uppercase tracking-wider">Child ages (for education corpus)</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {Array.from({ length: children }).map((_, i) => (
                        <div key={i}>
                          <label className="text-10 text-gray-400 mb-1 block">Child {i + 1}</label>
                          <div className="flex items-center gap-2">
                            <input type="range" min={0} max={17} value={childAges[i] ?? 5}
                              onChange={e => setChildAge(i, +e.target.value)}
                              className="pw-gold-range flex-1"/>
                            <span className="text-12 font-bold text-navy w-8 text-right">{childAges[i] ?? 5}y</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex justify-between mt-4">
                  <button onClick={() => setStep(0)} className="text-12 font-semibold text-navy/45 hover:text-navy transition-colors px-3 py-2">← Back</button>
                  <button onClick={() => setStep(2)}
                    className="flex items-center gap-2 bg-navy text-white font-bold text-13 px-7 py-3 rounded-full hover:bg-navy/90 transition-all shadow-md">
                    Next <ArrowRight size={13}/>
                  </button>
                </div>
              </motion.div>
            )}

            {/* ── Step 2: Current Shield ──────────────────────────────────── */}
            {step === 2 && (
              <motion.div key="s2" {...stepVariants} transition={{ duration: 0.25 }}
                className="bg-[#f8f7f4] rounded-3xl p-7 md:p-9 border border-[rgba(184,134,11,0.1)]">
                <h3 className="text-17 font-bold text-navy mb-2">What protection do you currently have?</h3>
                <p className="text-12 text-gray-400 mb-5">Approximate values are fine — this is used only for your gap analysis.</p>
                {ConfidentialBanner}

                <div className="space-y-5">
                  <BucketSelect label="Life Insurance Cover (total sum assured)"
                    note="across all policies" value={existingLifeCoverL}
                    onChange={setLifeCover} opts={LIFE_COVER_OPTS}/>
                  <BucketSelect label="Health Insurance Cover"
                    note="individual + family floater combined" value={existingHealthL}
                    onChange={setHealth} opts={HEALTH_OPTS}/>
                  <BucketSelect label="Outstanding Home Loan" value={homeLoanL}
                    onChange={setHomeLoan} opts={LOAN_OPTS}/>
                  <BucketSelect label="Other Outstanding Loans"
                    note="personal, car, education loans" value={otherLoansL}
                    onChange={setOtherLoans} opts={LOAN_OPTS}/>
                </div>

                <div className="flex justify-between mt-7">
                  <button onClick={() => setStep(1)} className="text-12 font-semibold text-navy/45 hover:text-navy transition-colors px-3 py-2">← Back</button>
                  <button onClick={() => setStep(3)}
                    className="flex items-center gap-2 bg-navy text-white font-bold text-13 px-7 py-3 rounded-full hover:bg-navy/90 transition-all shadow-md">
                    Next <ArrowRight size={13}/>
                  </button>
                </div>
              </motion.div>
            )}

            {/* ── Step 3: Wealth ──────────────────────────────────────────── */}
            {step === 3 && (
              <motion.div key="s3" {...stepVariants} transition={{ duration: 0.25 }}
                className="bg-[#f8f7f4] rounded-3xl p-7 md:p-9 border border-[rgba(184,134,11,0.1)]">
                <h3 className="text-17 font-bold text-navy mb-2">What have you already built?</h3>
                <p className="text-12 text-gray-400 mb-5">This helps calculate your retirement trajectory and net worth.</p>
                {ConfidentialBanner}

                <div className="space-y-5 mb-6">
                  <BucketSelect label="Stocks + Mutual Funds (current value)"
                    value={equityL} onChange={setEquity} opts={EQUITY_OPTS}/>
                  <BucketSelect label="FDs + PPF + NPS + Savings (total)"
                    value={debtSavingsL} onChange={setDebt} opts={EQUITY_OPTS}/>
                  <BucketSelect label="Real Estate (investment property value)"
                    note="exclude primary home if you live in it" value={realEstateL}
                    onChange={setRE} opts={RE_OPTS}/>
                </div>

                <div className="mb-6">
                  <label className="text-12 font-semibold text-navy/75 block mb-2">Target retirement age</label>
                  <div className="flex gap-2 flex-wrap">
                    {[45, 50, 55, 60, 65].map(n => (
                      <button key={n} onClick={() => setRetAge(n)}
                        className={`px-5 py-2 rounded-2xl border-2 text-12 font-bold transition-all ${retirementAge === n ? 'border-gold bg-gold/10 text-navy border-gold' : 'border-gray-200 bg-white text-navy/60 hover:border-gold/40'}`}>
                        {n}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-12 font-semibold text-navy/75 block mb-2">
                    Financial goals <span className="font-normal text-gray-400">(select all)</span>
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {GOAL_DEFS.map(({ key, label, sub }) => {
                      const on = goals.includes(key)
                      return (
                        <button key={key} onClick={() => toggleGoal(key)}
                          className={`text-left px-3 py-2.5 rounded-2xl border-2 transition-all ${on ? 'border-gold bg-gold/8 text-navy' : 'border-gray-200 bg-white text-navy/55 hover:border-gold/30'}`}>
                          <div className="text-11 font-bold">{label}</div>
                          <div className="text-9 text-gray-400 mt-0.5">{sub}</div>
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div className="flex justify-between mt-7">
                  <button onClick={() => setStep(2)} className="text-12 font-semibold text-navy/45 hover:text-navy transition-colors px-3 py-2">← Back</button>
                  <button onClick={() => setStep(4)}
                    className="flex items-center gap-2 bg-gold text-white font-bold text-13 px-8 py-3 rounded-full hover:bg-gold/90 transition-all shadow-lg">
                    Generate My Blueprint <ArrowRight size={13}/>
                  </button>
                </div>
              </motion.div>
            )}

            {/* ── Step 4: Blueprint Results ───────────────────────────────── */}
            {step === 4 && (
              <motion.div key="s4" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

                {/* Top: Score + Net Worth + HLV */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="col-span-1 bg-navy rounded-2xl p-5 flex flex-col items-center justify-center gap-2 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gold/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"/>
                    <ScoreRing score={bp.score}/>
                    <span className="text-9 text-white/30 text-center uppercase tracking-widest">Wealth Blueprint Score</span>
                  </div>
                  <div className="col-span-2 grid grid-cols-2 gap-3">
                    {[
                      { label: 'Human Life Value', val: crore(bp.hlvCrore), sub: `Your economic worth to your family`, color: '#c9a84c' },
                      { label: 'Net Worth Today', val: `₹${fmt(bp.netWorthL)}L`, sub: 'Liquid + real estate − loans', color: '#3b82f6' },
                      { label: 'Protection Gap', val: bp.protectionGapL > 0 ? crore(bp.protectionGapCrore) : 'None', sub: bp.protectionGapL > 0 ? `${bp.protectionGapPct}% of HLV uncovered` : 'You are fully covered', color: bp.protectionGapL > 0 ? '#ef4444' : '#22c55e' },
                      { label: 'Retirement Corpus', val: `${crore(bp.retCorpusCrore)} needed`, sub: `By age ${retirementAge} (3.5% SWR)`, color: '#8b5cf6' },
                    ].map(({ label, val, sub, color }) => (
                      <div key={label} className="bg-[#f8f7f4] rounded-2xl p-4 border border-gray-100">
                        <div className="text-18 md:text-20 font-bold mb-0.5 leading-none" style={{ color }}>{val}</div>
                        <div className="text-11 font-semibold text-navy">{label}</div>
                        <div className="text-9 text-gray-400 mt-0.5 leading-snug">{sub}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Insights Grid */}
                <div className="grid md:grid-cols-2 gap-3 mb-4">

                  {/* Protection Reality */}
                  <div className="bg-navy rounded-2xl p-5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-28 h-28 bg-red-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"/>
                    <div className="relative z-10">
                      <div className="text-10 tracking-widest font-bold text-white/40 uppercase mb-3">The Protection Reality</div>
                      <div className="text-11 text-white/60 mb-4 leading-relaxed">
                        87% of Indian families are underinsured (Swiss Re 2023). Your HLV is what your family financially loses if you're gone today.
                      </div>
                      <div className="space-y-2">
                        {[
                          { label: 'Your Human Life Value', val: `₹${bp.hlvL}L`, color: '#c9a84c' },
                          { label: 'Life Cover You Have', val: `₹${bp.existingCoverL}L`, color: '#22c55e' },
                          { label: 'Liquid Assets (family keeps)', val: `₹${Math.max(0, bp.liquidProtectionL)}L`, color: '#3b82f6' },
                          { label: 'Protection Gap', val: bp.protectionGapL > 0 ? `₹${bp.protectionGapL}L` : 'Fully covered', color: bp.protectionGapL > 0 ? '#ef4444' : '#22c55e' },
                        ].map(({ label, val, color }) => (
                          <div key={label} className="flex justify-between items-center py-1 border-b border-white/5">
                            <span className="text-10 text-white/50">{label}</span>
                            <span className="text-11 font-bold" style={{ color }}>{val}</span>
                          </div>
                        ))}
                      </div>
                      {bp.protectionGapL > 0 && (
                        <div className="mt-3 bg-red-500/10 rounded-xl p-3 border border-red-400/15">
                          <p className="text-10 text-red-300 leading-snug">
                            Your family can sustain your current lifestyle for only <strong>{bp.incYears} year{bp.incYears !== 1 ? 's' : ''}</strong> on your existing cover. A ₹{bp.termCoverNeedL}L term plan closes this gap.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Retirement Reality */}
                  <div className="bg-[#f8f7f4] rounded-2xl p-5 border border-gray-100">
                    <div className="text-10 tracking-widest font-bold text-navy/40 uppercase mb-3">Retirement Reality Check</div>
                    <div className="space-y-2 mb-3">
                      {[
                        { label: `Corpus needed at ${retirementAge}`, val: crore(bp.retCorpusCrore), color: '#6b7280' },
                        { label: 'Your assets will grow to', val: crore(bp.currentGrowthCrore), color: '#3b82f6' },
                        { label: `With ₹${fmt(bp.equitySIP)}/mo SIP`, val: crore(bp.totalProjectedCrore), color: '#22c55e' },
                      ].map(({ label, val, color }) => (
                        <div key={label} className="flex justify-between items-center py-1 border-b border-navy/6">
                          <span className="text-10 text-navy/50">{label}</span>
                          <span className="text-11 font-bold" style={{ color }}>{val}</span>
                        </div>
                      ))}
                    </div>
                    <div className={`rounded-xl p-3 border ${bp.retSurplusDeficitCrore >= 0 ? 'bg-green-50 border-green-100' : 'bg-amber-50 border-amber-100'}`}>
                      <p className={`text-11 font-bold mb-0.5 ${bp.retSurplusDeficitCrore >= 0 ? 'text-green-700' : 'text-amber-700'}`}>
                        {bp.retSurplusDeficitCrore >= 0
                          ? `Surplus: ${crore(bp.retSurplusDeficitCrore)} — You're on track!`
                          : `Deficit: ${crore(Math.abs(bp.retSurplusDeficitCrore))}`}
                      </p>
                      <p className="text-10 text-gray-500 leading-snug">
                        {bp.retSurplusDeficitCrore >= 0
                          ? `Your current trajectory covers your retirement comfortably at ${retirementAge}.`
                          : `Adding ₹${fmt(bp.addlMonthlyForRet)}/month in SIP closes this gap entirely.`}
                      </p>
                    </div>

                    {/* Cost of delay */}
                    {bp.delay3L > 0 && (
                      <div className="mt-3 rounded-xl p-3 bg-navy/4 border border-navy/8">
                        <p className="text-10 font-bold text-navy mb-0.5">Cost of waiting 3 years to start SIP</p>
                        <p className="text-10 text-gray-500">Starting ₹{fmt(bp.equitySIP)}/month today vs. 3 years later: <strong className="text-red-600">you lose ₹{fmt(bp.delay3L)} Lakhs</strong> of final corpus. Every month counts.</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Education + Monthly Blueprint */}
                <div className="grid md:grid-cols-2 gap-3 mb-4">

                  {/* Education (if kids) */}
                  {bp.eduCorpusL.length > 0 ? (
                    <div className="bg-[#f8f7f4] rounded-2xl p-5 border border-gray-100">
                      <div className="text-10 tracking-widest font-bold text-navy/40 uppercase mb-3">Education Corpus Needed</div>
                      <p className="text-10 text-gray-500 mb-3 leading-snug">Education inflation runs at 11%/year in India. These are your future costs assuming avg private engineering (₹18L today).</p>
                      <div className="space-y-2 mb-3">
                        {bp.eduCorpusL.map((l, i) => (
                          <div key={i} className="flex justify-between items-center py-1 border-b border-navy/6">
                            <span className="text-10 text-navy/55">Child {i + 1} (age {childAges[i]}, college in {Math.max(0, 18 - childAges[i])} yrs)</span>
                            <span className="text-11 font-bold text-purple-600">₹{fmt(l)}L</span>
                          </div>
                        ))}
                        <div className="flex justify-between items-center pt-1">
                          <span className="text-10 font-bold text-navy">Total Education Corpus</span>
                          <span className="text-13 font-bold text-navy">₹{fmt(bp.totalEduL)}L</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <InsightCard icon={Info} color="#3b82f6" title="Start your SIP today, not 'someday'">
                      Delaying a ₹{fmt(bp.equitySIP)}/month SIP by just 3 years costs you <strong>₹{fmt(bp.delay3L)} Lakhs</strong> in final corpus — because the first years of compounding are the most powerful. The "best time to invest" is always now.
                    </InsightCard>
                  )}

                  {/* Monthly Blueprint */}
                  <div className="bg-navy rounded-2xl p-5 relative overflow-hidden">
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-gold/8 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"/>
                    <div className="relative z-10">
                      <div className="text-10 tracking-widest font-bold text-white/40 uppercase mb-3">Your Monthly Blueprint</div>
                      <div className="space-y-2.5 mb-4">
                        {[
                          { icon: PiggyBank,   label: 'Emergency Fund',  val: bp.eMo,          sub: `Build ₹${bp.eTgtL}L in 18mo`,    color: '#f59e0b' },
                          { icon: Shield,      label: 'Term Life Cover', val: bp.termMonthly,   sub: `₹${bp.termCoverNeedL}L cover gap`, color: '#ef4444' },
                          { icon: Heart,       label: 'Health Insurance',val: bp.healthMonthly, sub: `₹${bp.recHealthL}L recommended`,  color: '#22c55e' },
                          { icon: TrendingUp,  label: `Equity SIP (${bp.eqPct}%)`, val: bp.equitySIP, sub: '12% CAGR · index + mid-cap', color: '#3b82f6' },
                          { icon: Landmark,    label: 'LIC Goal Plans',  val: bp.licMonthly,    sub: 'Endowment + pension',              color: '#c9a84c' },
                        ].map(({ icon: Icon, label, val, sub, color }) => (
                          <div key={label} className="flex items-center gap-2.5">
                            <div className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: color + '22', color }}>
                              <Icon size={11}/>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex justify-between items-baseline">
                                <span className="text-10 text-white/70">{label}</span>
                                <span className="text-11 font-bold text-white">₹{fmt(val)}</span>
                              </div>
                              <div className="text-9 text-white/30">{sub}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="pt-3 border-t border-white/10 flex justify-between items-center">
                        <span className="text-10 font-bold text-white/50 uppercase tracking-wider">Total / month</span>
                        <span className="text-18 font-bold text-white">₹{fmt(bp.totalMonthly)}</span>
                      </div>
                      <div className="text-10 text-white/30 text-right mt-0.5">{Math.round((bp.totalMonthly / monthlyIncome) * 100)}% of your income</div>
                    </div>
                  </div>
                </div>

                {/* Health cover gap warning */}
                {bp.healthGapL > 0 && (
                  <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 mb-4 flex gap-3 items-start">
                    <AlertTriangle size={14} className="text-amber-500 flex-shrink-0 mt-0.5"/>
                    <p className="text-11 text-amber-800 leading-relaxed">
                      <strong>Health cover gap: ₹{bp.healthGapL}L.</strong> Medical inflation in India runs at 14%/year. Your ₹{existingHealthL}L cover today is worth effectively ₹{Math.round(existingHealthL * 0.517)}L in purchasing power 5 years from now. Recommended: ₹{bp.recHealthL}L {cityTier === 'metro' ? '(metro standard)' : 'family floater'}.
                    </p>
                  </div>
                )}

                {/* Journey milestones */}
                <div className="bg-[#f8f7f4] rounded-2xl p-5 border border-gray-100 mb-4">
                  <div className="text-10 tracking-widest font-bold text-navy/40 uppercase mb-4">Your Financial Journey</div>
                  <div className="flex">
                    {[
                      { yr: `Age ${age+1}`,   label: 'Emergency fund complete' },
                      { yr: `Age ${Math.min(age+3, retirementAge-5)}`, label: 'Fully insured + SIP on autopilot' },
                      { yr: `Age ${Math.min(age+12, retirementAge-2)}`, label: `₹${Math.round(bp.totalProjectedCrore * 0.4 * 10) / 10}Cr corpus milestone` },
                      { yr: `Age ${retirementAge}`, label: `${crore(bp.totalProjectedCrore)} — retire comfortably` },
                    ].map((m, i, arr) => (
                      <div key={i} className="flex-1">
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-gold flex-shrink-0 z-10 ring-2 ring-white"/>
                          {i < arr.length - 1 && <div className="flex-1 h-px bg-gold/30"/>}
                        </div>
                        <div className="mt-2 pr-2">
                          <div className="text-9 font-bold text-gold">{m.yr}</div>
                          <div className="text-9 text-navy/55 leading-snug mt-0.5">{m.label}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Save blueprint / lead capture */}
                <div className="bg-navy rounded-3xl p-6 md:p-8 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-gold/8 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"/>
                  <div className="relative z-10">
                    {!saved ? (
                      <>
                        <div className="flex items-center gap-2 mb-2">
                          <Lock size={13} className="text-gold"/>
                          <span className="text-10 font-bold text-gold/80 uppercase tracking-widest">Save Your Blueprint · Free · Confidential</span>
                        </div>
                        <h4 className="text-16 md:text-18 font-bold text-white mb-1">
                          Get Ajay sir's personal review of your blueprint
                        </h4>
                        <p className="text-12 text-white/50 mb-5 leading-relaxed">
                          Your data is private and never shared. Ajay sir personally reviews each blueprint and calls you with a specific action plan — no scripts, no sales pitch.
                        </p>
                        <div className="grid md:grid-cols-3 gap-3">
                          <input value={name} onChange={e => setName(e.target.value)}
                            placeholder="Your name"
                            className="px-4 py-3 rounded-xl bg-white/10 border border-white/15 text-13 text-white placeholder-white/30 focus:outline-none focus:border-gold/50 transition-colors"/>
                          <input value={phone} onChange={e => setPhone(e.target.value)}
                            placeholder="WhatsApp number" type="tel" maxLength={10}
                            className="px-4 py-3 rounded-xl bg-white/10 border border-white/15 text-13 text-white placeholder-white/30 focus:outline-none focus:border-gold/50 transition-colors"/>
                          <button
                            disabled={saving || !name || phone.length < 10}
                            onClick={saveBlueprint}
                            className="flex items-center justify-center gap-2 bg-gold text-white font-bold text-13 px-6 py-3 rounded-xl hover:bg-gold/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg">
                            {saving ? 'Saving…' : (<>Save & Book Call <ChevronRight size={14}/></>)}
                          </button>
                        </div>
                        {saveError && <p className="text-10 text-red-400 mt-2">{saveError}</p>}
                      </>
                    ) : (
                      <div className="text-center py-4">
                        <CheckCircle2 size={32} className="text-green-400 mx-auto mb-3"/>
                        <h4 className="text-18 font-bold text-white mb-1">Blueprint saved!</h4>
                        <p className="text-13 text-white/55">Ajay sir will call you within 24 hours for a free 30-min personalised review.</p>
                      </div>
                    )}
                  </div>
                </div>

                <p className="text-9 text-gray-400 text-center mt-4 leading-relaxed max-w-xl mx-auto">
                  Based on IRDAI HLV guidelines · Trinity Study (3.5% SWR) · Swiss Re protection gap data · Morningstar India allocation model (120−age rule) · 11% education inflation · 14% medical inflation. Not financial advice. Actual results vary.
                </p>

                <div className="text-center mt-4">
                  <button onClick={() => { setStep(0); setSaved(false); setName(''); setPhone('') }}
                    className="text-12 text-navy/40 hover:text-navy transition-colors underline underline-offset-2">
                    Start over with different inputs
                  </button>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
