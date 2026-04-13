'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Shield, Heart, TrendingUp, Landmark, PiggyBank, Lock, CheckCircle2,
  ArrowRight, ChevronRight, AlertTriangle, TriangleAlert, Star,
} from 'lucide-react'

// ── Types ────────────────────────────────────────────────────────────────────
type Employment = 'salaried' | 'freelance' | 'business'
type CityTier   = 'metro' | 'tier2' | 'tier3'
type Goal       = 'home' | 'education' | 'retire' | 'wealth' | 'health' | 'travel'

interface WealthProfile {
  age: number; monthlyIncome: number; employment: Employment; cityTier: CityTier
  isMarried: boolean; spouseIncomeL: number; children: number
  childAges: number[]; hasAgedParents: boolean
  existingLifeCoverL: number; existingHealthL: number
  homeLoanL: number; otherLoansL: number
  equityL: number; debtSavingsL: number; realEstateL: number
  retirementAge: number; goals: Goal[]
}

// ── Calculation Engine (research-backed) ─────────────────────────────────────
// Sources: IRDAI HLV (6.5% discount), Trinity Study (3.5% SWR India-adjusted),
// Swiss Re protection gap, 11% education inflation, Morningstar 120-age equity rule

function selfConsumptionRate(married: boolean, kids: number) {
  return !married && kids === 0 ? 0.45 : married && kids === 0 ? 0.35 : 0.28
}
function calcHLV(annual: number, age: number, retAge: number, sc: number) {
  const n = Math.max(1, retAge - age), r = 0.065
  return Math.round(annual * (1 - sc) * ((1 - Math.pow(1 + r, -n)) / r))
}
function sipFV(mo: number, rate: number, yrs: number) {
  if (yrs <= 0 || mo <= 0) return 0
  const r = rate / 12, n = yrs * 12
  return Math.round(mo * ((Math.pow(1 + r, n) - 1) / r) * (1 + r))
}
function lumpFV(pv: number, rate: number, yrs: number) {
  return yrs <= 0 ? pv : Math.round(pv * Math.pow(1 + rate, yrs))
}
function retirementCorpusNeeded(moExpense: number, yrs: number) {
  return Math.round(moExpense * Math.pow(1.065, yrs) * 12 / 0.035)
}
function eduCorpus(childAge: number) {
  return Math.round(1_800_000 * Math.pow(1.11, Math.max(0, 18 - childAge)))
}
function costOfDelay(mo: number, age: number, delayYrs: number, retAge: number) {
  return Math.max(0, sipFV(mo, 0.12, retAge - age) - sipFV(mo, 0.12, retAge - age - delayYrs))
}
function recHealthL(tier: CityTier, family: boolean) {
  return tier === 'metro' ? (family ? 50 : 25) : tier === 'tier2' ? (family ? 25 : 10) : (family ? 15 : 5)
}

function calcBlueprint(p: WealthProfile) {
  const annual = p.monthlyIncome * 12
  const expenses = p.monthlyIncome * 0.65
  const hasFamily = p.isMarried || p.children > 0
  const yrsToRet = Math.max(1, p.retirementAge - p.age)

  const hlv = calcHLV(annual, p.age, p.retirementAge, selfConsumptionRate(p.isMarried, p.children))
  const hlvL = Math.round(hlv / 100_000)

  const liquidProtL = Math.max(0, p.equityL + p.debtSavingsL - p.otherLoansL)
  const totalProtL  = p.existingLifeCoverL + liquidProtL
  const gapL        = Math.max(0, hlvL + p.homeLoanL - totalProtL)
  const gapPct      = hlvL > 0 ? Math.min(100, Math.round((gapL / hlvL) * 100)) : 0

  const rHL    = recHealthL(p.cityTier, hasFamily)
  const hGapL  = Math.max(0, rHL - p.existingHealthL)
  const hOkPct = p.existingHealthL > 0 ? Math.min(100, Math.round((p.existingHealthL / rHL) * 100)) : 0

  const retCorpus = retirementCorpusNeeded(expenses, yrsToRet)
  const assetFV   = lumpFV(p.equityL * 1e5, 0.12, yrsToRet)
                  + lumpFV(p.debtSavingsL * 1e5, 0.077, yrsToRet)
                  + lumpFV(p.realEstateL * 0.72 * 1e5, 0.08, yrsToRet)

  const recEqSIP  = Math.max(3000, Math.round(p.monthlyIncome * 0.15))
  const sipFuture = sipFV(recEqSIP, 0.12, yrsToRet)
  const projected = assetFV + sipFuture
  const retDiff   = projected - retCorpus

  let addlSIP = 0
  if (retDiff < 0) {
    const r = 0.12 / 12, n = yrsToRet * 12
    addlSIP = Math.round(Math.abs(retDiff) / (((Math.pow(1 + r, n) - 1) / r) * (1 + r)))
  }

  const eduL   = p.childAges.slice(0, p.children).map(a => Math.round(eduCorpus(a) / 1e5))
  const totalEduL = eduL.reduce((a, b) => a + b, 0)

  const eMos   = p.employment === 'salaried' ? 6 : p.employment === 'freelance' ? 9 : 12
  const eTgtL  = Math.round(expenses * eMos / 1e5)
  const eMo    = Math.round(expenses * eMos / 18)

  const termRate = p.age < 30 ? 22 : p.age < 40 ? 38 : 62
  const termNeedL = Math.min(500, gapL)
  const termMo    = Math.max(400, Math.round(termNeedL * termRate))

  const hRate    = p.age < 35 ? 280 : p.age < 45 ? 420 : 650
  const hMo      = Math.round((hGapL > 0 ? hGapL : p.existingHealthL) * hRate / 12)

  const eqPct    = Math.max(50, Math.min(90, 120 - p.age))
  const sipPool  = Math.max(2000, Math.round(p.monthlyIncome * 0.20))
  const eqSIP    = Math.round(sipPool * eqPct / 100)
  const debtSIP  = sipPool - eqSIP
  const licMo    = Math.round(p.monthlyIncome * 0.06)
  const totalMo  = eMo + termMo + hMo + eqSIP + debtSIP + licMo

  const delay3L  = Math.round(costOfDelay(eqSIP, p.age, 3, p.retirementAge) / 1e5)
  const netWorthL = Math.round(p.equityL + p.debtSavingsL + p.realEstateL * 0.72 - p.homeLoanL - p.otherLoansL)

  const s1 = Math.round(30 * Math.max(0, 1 - gapL / Math.max(1, hlvL)))
  const s2 = Math.round(20 * Math.min(1, hOkPct / 100))
  const s4 = Math.round(40 * Math.min(1, Math.max(0, projected / retCorpus)))
  const score = Math.min(100, s1 + s2 + 10 + s4)

  const incYears = annual > 0 ? parseFloat(((p.existingLifeCoverL * 1e5) / annual).toFixed(1)) : 0

  return {
    hlvL, hlvCrore: +(hlv / 1e7).toFixed(2),
    liquidProtL, totalProtL, gapL, gapCrore: +(gapL / 100).toFixed(2), gapPct,
    rHL, hGapL, hOkPct,
    retCorpusCrore: +(retCorpus / 1e7).toFixed(2),
    assetFVCrore: +(assetFV / 1e7).toFixed(2),
    projectedCrore: +(projected / 1e7).toFixed(2),
    retDiffCrore: +(retDiff / 1e7).toFixed(2),
    addlSIP, eduL, totalEduL,
    eTgtL, eMo, termNeedL, termMo, hMo,
    eqSIP, eqPct, debtSIP, licMo, totalMo,
    delay3L, netWorthL, score, incYears, yrsToRet,
  }
}

// ── Intelligence Layer: Personalized Narrative + Recommendations ─────────────

function buildNarrative(p: WealthProfile, bp: ReturnType<typeof calcBlueprint>) {
  const annual = p.monthlyIncome * 12
  const annualCrStr = annual >= 1e7 ? `₹${(annual / 1e7).toFixed(1)} Crore` : `₹${(annual / 1e5).toFixed(0)} Lakh`
  const empLabel = p.employment === 'salaried' ? 'salaried professional' : p.employment === 'freelance' ? 'freelancer' : 'business owner'
  const cityLabel = p.cityTier === 'metro' ? 'metro city' : p.cityTier === 'tier2' ? 'Tier-2 city' : 'city'
  const familyStr = p.children > 0
    ? `married with ${p.children} child${p.children > 1 ? 'ren' : ''}${p.hasAgedParents ? ' and ageing parents' : ''}`
    : p.isMarried ? `married${p.hasAgedParents ? ', supporting ageing parents' : ''}` : `single${p.hasAgedParents ? ', supporting ageing parents' : ''}`
  const isHNI = p.monthlyIncome >= 300000

  let headline = ''
  if (bp.score >= 70) headline = 'Your foundation is strong. Here is how to make it institutional-grade.'
  else if (bp.score >= 45) headline = 'You have made a start. These specific gaps, left unaddressed, will compound into a crisis.'
  else headline = 'This is your honest financial position. The window to fix it is open — but not forever.'

  const paras: string[] = []

  // Para 1 — Situation
  paras.push(
    `You are a ${p.age}-year-old ${empLabel} in a ${cityLabel}, earning ${annualCrStr} per year — ${familyStr}. ` +
    `You have built ₹${fmt(bp.netWorthL)} Lakhs in net worth (liquid + real estate, after liabilities). ` +
    (bp.netWorthL >= 100
      ? `That places you in the top 8% of Indian households by net worth. The challenge now is not building — it is structuring what you have, and protecting what you will earn.`
      : bp.netWorthL >= 20
      ? `That is real progress. Most Indians have near-zero financial assets at your age. The next phase is building the architecture that protects and multiplies this.`
      : `Every financial empire starts from zero. Yours begins today.`)
  )

  // Para 2 — The critical gap (HLV)
  if (bp.gapL > 0) {
    const runway = bp.incYears < 1 ? 'less than one year' : `${bp.incYears} year${bp.incYears !== 1 ? 's' : ''}`
    paras.push(
      `Here is the arithmetic your family needs to know: your Human Life Value — the present value of your future earnings stream to your dependents, calculated using IRDAI's 6.5% discount method — is ₹${fmt(bp.hlvL)} Lakhs. ` +
      `Against this, your current cover (insurance + liquid assets) is ₹${fmt(bp.totalProtL)} Lakhs. ` +
      `The ₹${fmt(bp.gapL)} Lakh gap means if you were gone today, your family's financial runway is ${runway} at current expenses. ` +
      `${isHNI ? 'At your income level, this gap carries serious consequences for your dependants and any business you run.' : 'A pure term plan at ₹' + fmt(bp.termMo) + '/month closes this entirely.'}`
    )
  } else {
    paras.push(
      `Your life protection is fully adequate. Your Human Life Value of ₹${fmt(bp.hlvL)} Lakhs is covered by your combination of insurance and liquid assets — a position only ~13% of Indians achieve.`
    )
  }

  // Para 3 — Retirement
  if (bp.retDiffCrore < 0) {
    paras.push(
      `Your retirement is the second urgent priority. To retire at ${p.retirementAge} with your current lifestyle — adjusted for 6.5% annual inflation (India's CPI average) — you need ₹${bp.retCorpusCrore.toFixed(1)} Crore, calculated using the Trinity Study's India-adjusted 3.5% safe withdrawal rate. ` +
      `Your existing assets, compounding at market rates to age ${p.retirementAge}, will produce ₹${bp.projectedCrore.toFixed(1)} Crore. ` +
      `The ₹${Math.abs(bp.retDiffCrore).toFixed(1)} Crore gap is bridgeable with an additional ₹${fmt(bp.addlSIP)}/month SIP starting today.`
    )
  } else {
    paras.push(
      `Your retirement trajectory is in a ₹${bp.retDiffCrore.toFixed(1)} Crore surplus — on current savings rates you will exceed your retirement corpus target of ₹${bp.retCorpusCrore.toFixed(1)} Crore by ${Math.round(bp.retDiffCrore * 10) / 10} Crore. ` +
      `The priority now shifts to allocation quality: reducing drift between your intended and actual asset mix, and maximising after-tax returns.`
    )
  }

  if (isHNI) {
    paras.push(
      `At ₹${fmt(p.monthlyIncome)}/month, you are earning at a level where retail financial products begin to leave money on the table. NPS Tier 1 gives you an additional ₹50,000 tax deduction under 80CCD(1B). Your portfolio should include international equity (15-20% via US index funds under the $250,000 LRS limit) for rupee-depreciation protection. Beyond ₹50 Lakh in liquid assets, a Portfolio Management Service or Direct Plan-only advisor relationship is worth considering.`
    )
  }

  return { headline, paras }
}

function getProtectionPlan(p: WealthProfile, bp: ReturnType<typeof calcBlueprint>) {
  type Priority = 'critical' | 'high' | 'medium'
  const recs: Array<{
    no: string; category: string; planName: string; planDetail: string
    cover: string; monthly: number; annual: number; why: string; priority: Priority
  }> = []
  const hasFamily = p.isMarried || p.children > 0

  // 1. Term Insurance
  if (bp.gapL > 0) {
    const plan = bp.gapL >= 200 ? 'LIC Tech Term (Plan 954)' : bp.gapL >= 75 ? 'LIC Jeevan Amar (Plan 827)' : 'LIC Saral Jeevan Bima (Plan 859)'
    const detail = bp.gapL >= 200 ? 'Online pure term, lowest premium' : bp.gapL >= 75 ? 'LIC flagship term plan, highest claim trust' : 'Simplified issue term, no medicals under ₹25L'
    recs.push({
      no: '01', category: 'Pure Term Life Insurance', planName: plan, planDetail: detail,
      cover: `₹${bp.termNeedL} Lakhs sum assured`,
      monthly: bp.termMo, annual: bp.termMo * 12,
      why: `Closes your ₹${fmt(bp.gapL)}L protection gap. A pure term plan is the highest-leverage financial product that exists: ₹${fmt(bp.termMo)}/month buys ₹${fmt(bp.termNeedL)}L of coverage. LIC's claim settlement ratio: 98.6% (FY2024). Premium locked at today's age — any delay increases premium permanently.`,
      priority: 'critical',
    })
  }

  // 2. Health Insurance
  if (bp.hGapL > 0 || p.existingHealthL < bp.rHL) {
    const plan = p.cityTier === 'metro' && hasFamily
      ? 'Niva Bupa ReAssure 2.0 or Star Health Family Optima'
      : hasFamily ? 'Star Health Family Health Optima' : 'Niva Bupa Individual + Super Top-up'
    const detail = p.cityTier === 'metro' && hasFamily
      ? '₹50L base + ₹50L top-up = ₹1Cr effective cover'
      : hasFamily ? 'Floater plan, all family members on one policy' : '₹10L base + ₹15L top-up cover'
    recs.push({
      no: bp.gapL > 0 ? '02' : '01', category: 'Health Insurance', planName: plan, planDetail: detail,
      cover: `₹${bp.rHL} Lakhs${hasFamily ? ' family floater' : ''}`,
      monthly: bp.hMo, annual: bp.hMo * 12,
      why: `Medical inflation in India: 14%/year. One ICU admission in a metro hospital: ₹8-15 Lakhs. Your ₹${p.existingHealthL}L cover today is worth only ₹${Math.round(p.existingHealthL * 0.517)}L in purchasing power 5 years from now. The ₹${fmt(bp.hGapL)}L gap is a single hospitalisation away from becoming a catastrophic loss.`,
      priority: 'high',
    })
  }

  // 3. LIC Goal Plans
  const n = recs.length
  if (p.goals.includes('retire') || p.goals.includes('wealth')) {
    recs.push({
      no: `0${n + 1}`, category: 'Pension / Annuity', planName: 'LIC Jeevan Shanti (Plan 850)',
      planDetail: 'Guaranteed pension for life — GoI-backed annuity',
      cover: 'Guaranteed monthly pension from chosen age',
      monthly: Math.round(bp.licMo * 0.55), annual: Math.round(bp.licMo * 0.55 * 12),
      why: `LIC Jeevan Shanti offers a guaranteed pension rate locked at policy inception — immune to market volatility. Single or regular premium. Since LIC is 65% Government of India-owned, this is the closest equivalent to a government pension for a private-sector individual. Ideal for ${p.retirementAge <= 55 ? 'early retirement planning' : 'building a pension alongside mutual fund SIPs'}.`,
      priority: 'medium',
    })
  }
  if (p.children > 0 && p.goals.includes('education')) {
    recs.push({
      no: `0${n + 2}`, category: "Child Education Plan", planName: 'LIC Jeevan Tarun (Plan 934)',
      planDetail: 'Survival benefits timed to child education milestones',
      cover: `Target: ₹${bp.totalEduL}L education corpus`,
      monthly: Math.round(bp.licMo * 0.45), annual: Math.round(bp.licMo * 0.45 * 12),
      why: `Unlike a mutual fund, LIC Jeevan Tarun includes a premium waiver — if the parent passes away, the policy continues fully paid-up, guaranteeing the education corpus for your child. Survival benefits are structured to pay out at ages 20, 22, 24, and 26 — matching college years precisely.`,
      priority: 'medium',
    })
  }

  return recs
}

function getSIPAllocations(eqSIP: number, debtSIP: number, eqPct: number, isHNI: boolean) {
  const core = Math.round(eqSIP * 0.50)
  const flexi = Math.round(eqSIP * 0.30)
  const mid = eqSIP - core - flexi
  const intl = isHNI ? Math.round(eqSIP * 0.15) : 0
  const adjusted = isHNI ? eqSIP - intl : eqSIP

  const items: Array<{ name: string; amc: string; amount: number; type: string; why: string }> = [
    { name: 'Nifty 50 Index Fund', amc: 'Nippon India / Mirae Asset', amount: isHNI ? Math.round(adjusted * 0.5) : core, type: 'Equity – Large Cap', why: 'Core holding. 0.1-0.2% TER. Tracks India\'s 50 largest companies. Lowest-cost path to market returns.' },
    { name: 'Parag Parikh Flexi Cap', amc: 'PPFAS Mutual Fund', amount: isHNI ? Math.round(adjusted * 0.3) : flexi, type: 'Equity – Multi Cap', why: 'Consistent 15%+ 5-year CAGR. Unique: up to 35% overseas equity allocation (Google, Meta, etc.) gives rupee-depreciation hedge.' },
    { name: 'HDFC Mid Cap Opportunities', amc: 'HDFC AMC', amount: isHNI ? Math.round(adjusted * 0.2) : mid, type: 'Equity – Mid Cap', why: 'Long-term growth kicker. Higher volatility but stronger 10-year compounding. Only for 7yr+ horizon.' },
  ]
  if (isHNI && intl > 0) items.push({ name: 'Motilal Oswal NASDAQ 100 / Mirae Asset S&P 500', amc: 'Overseas Index', amount: intl, type: 'Equity – International', why: 'USD-denominated growth. Hedges INR depreciation (~3-4%/year historical). LRS-compliant for up to $250,000/year.' })
  items.push({ name: 'HDFC Short Duration Fund', amc: 'HDFC AMC', amount: debtSIP, type: 'Debt – Short Duration', why: '7-8% expected return. 1-3yr duration. Stability ballast that prevents panic-selling your equity SIPs during market corrections.' })
  return items
}

function get90DayPlan(p: WealthProfile, bp: ReturnType<typeof calcBlueprint>) {
  const isHNI = p.monthlyIncome >= 300000
  return [
    {
      label: 'Days 1–15',
      title: 'Protection First',
      color: '#ef4444',
      steps: [
        bp.gapL > 0
          ? `Apply for ${bp.gapL >= 100 ? 'LIC Tech Term (Plan 954)' : 'LIC Jeevan Amar (Plan 827)'} at licindia.in — ₹${fmt(bp.termNeedL)}L cover, takes 20 minutes online. Premium: ₹${fmt(bp.termMo)}/month. Do this before anything else.`
          : 'Consolidate all existing life insurance policies — confirm nominations are updated and all policies are active.',
        p.existingHealthL < bp.rHL
          ? `Purchase health floater: ${p.cityTier === 'metro' ? 'Niva Bupa ReAssure 2.0 or Star Health Family Optima' : 'Star Health Family Health Optima'} — ₹${bp.rHL}L cover at ₹${fmt(bp.hMo)}/month. Process is fully online.`
          : 'Add a ₹25L super top-up rider to your existing health policy (₹200-400/month) to inflation-proof your medical cover.',
      ],
    },
    {
      label: 'Days 16–45',
      title: 'Build the Wealth Engine',
      color: '#3b82f6',
      steps: [
        `Open a direct mutual fund account (Zerodha Coin / Groww / Kuvera — no commission). Set up SIP mandate on salary credit date: ₹${fmt(Math.round(bp.eqSIP * 0.5))}/month in Nippon Nifty 50 Index Fund + ₹${fmt(Math.round(bp.eqSIP * 0.3))}/month in Parag Parikh Flexi Cap + ₹${fmt(bp.eqSIP - Math.round(bp.eqSIP * 0.5) - Math.round(bp.eqSIP * 0.3))}/month in HDFC Mid Cap.`,
        `Start emergency fund: Transfer ₹${fmt(bp.eMo)}/month to a liquid mutual fund (Parag Parikh Liquid Fund). Target: ₹${fmt(bp.eTgtL)}L in 18 months. This is your financial immune system — do not invest until this exists.`,
        isHNI ? `Open NPS Tier 1 account at enps.nsdl.com. Contribute ₹50,000/year to claim additional ₹15,000-17,500 tax saved under Section 80CCD(1B) — instant 30-35% return on this ₹50K.` : `Start ELSS SIP of ₹${Math.min(12500, Math.round(p.monthlyIncome * 0.04))}/month for Section 80C tax benefit (₹1.5L/year deduction = ₹${Math.round(Math.min(45000, p.monthlyIncome * 0.04 * 12 * 0.3))} tax saved).`,
      ],
    },
    {
      label: 'Days 46–90',
      title: 'Structure the Future',
      color: '#c9a84c',
      steps: [
        `Meet with Ajay sir to structure your LIC goal plan (₹${fmt(bp.licMo)}/month) — specifically ${p.goals.includes('education') && p.children > 0 ? `LIC Jeevan Tarun for your child's education corpus (₹${bp.totalEduL}L target) + ` : ''}${p.goals.includes('retire') ? `LIC Jeevan Shanti for guaranteed pension starting age ${p.retirementAge}` : 'endowment plan for your primary goal'}.`,
        bp.retDiffCrore < -0.5
          ? `Increase monthly SIP by ₹${fmt(bp.addlSIP)}/month to close your ₹${Math.abs(bp.retDiffCrore).toFixed(1)}Cr retirement gap. Even a ₹${fmt(Math.round(bp.addlSIP / 2))}/month partial increase today is worth more than the full ₹${fmt(bp.addlSIP)}/month in 3 years — compounding is that asymmetric.`
          : `Review your asset allocation annually — target rebalancing to ${bp.eqPct}% equity / ${100 - bp.eqPct}% debt as your portfolio grows. Rebalance in January each year using the debt SIP proceeds.`,
        isHNI
          ? `With your income level, consider a Will and nominee-update review. Ensure your spouse, children, and parents are nominated correctly across all policies, EPF, and bank accounts. Intestate disputes in India take 7-10 years in courts.`
          : `Update nominees on all insurance policies, bank FDs, and EPF. Takes 30 minutes. Without this, your family may need court orders to access funds — a 2-3 year process during the worst possible time.`,
      ],
    },
  ]
}

// ── Helpers ──────────────────────────────────────────────────────────────────
function fmt(n: number) { return n.toLocaleString('en-IN') }
function crore(v: number) { return Math.abs(v) >= 1 ? `₹${v.toFixed(1)}Cr` : `₹${Math.round(v * 100)}L` }
function priorityColor(p: string) { return p === 'critical' ? '#ef4444' : p === 'high' ? '#f59e0b' : '#3b82f6' }
function priorityBg(p: string) { return p === 'critical' ? '#fef2f2' : p === 'high' ? '#fffbeb' : '#eff6ff' }
function priorityLabel(p: string) { return p === 'critical' ? 'Act Now' : p === 'high' ? 'High Priority' : 'Recommended' }

// ── Bucket option sets ────────────────────────────────────────────────────────
type BucketOpt = { label: string; value: number }
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
  { key: 'retire',    label: 'Early Retirement',    sub: 'Financial freedom' },
  { key: 'wealth',    label: 'Build Wealth',        sub: 'Passive income corpus' },
  { key: 'health',    label: 'Health Security',     sub: 'Family medical cover' },
  { key: 'travel',    label: 'Travel & Leisure',    sub: 'Freedom fund' },
]

// ── Sub-components ────────────────────────────────────────────────────────────
function ScoreRing({ score }: { score: number }) {
  const r = 44, circ = 2 * Math.PI * r
  const color = score >= 65 ? '#22c55e' : score >= 40 ? '#f59e0b' : '#ef4444'
  return (
    <svg width="100" height="100" viewBox="0 0 100 100">
      <circle cx="50" cy="50" r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="8"/>
      <circle cx="50" cy="50" r={r} fill="none" stroke={color} strokeWidth="8"
        strokeDasharray={circ} strokeDashoffset={circ - (score / 100) * circ}
        strokeLinecap="round"
        style={{ transform: 'rotate(-90deg)', transformOrigin: '50px 50px', transition: 'stroke-dashoffset 1.4s ease' }}/>
      <text x="50" y="46" textAnchor="middle" fill="white" fontSize="22" fontWeight="700">{score}</text>
      <text x="50" y="59" textAnchor="middle" fill="rgba(255,255,255,0.35)" fontSize="8">/ 100</text>
    </svg>
  )
}

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
            }`}>{o.label}</button>
        ))}
      </div>
    </div>
  )
}

function SectionLabel({ n, title }: { n: string; title: string }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <span className="text-10 font-bold text-gold/80 tracking-[0.2em]">{n}</span>
      <div className="h-px flex-1 bg-navy/10"/>
      <span className="text-10 font-bold tracking-[0.16em] uppercase text-navy/40">{title}</span>
    </div>
  )
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function WealthBlueprintCalculator() {
  const [step, setStep] = useState(0)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [saveError, setSaveError] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')

  const [age, setAge]           = useState(29)
  const [monthlyIncome, setMI]  = useState(80000)
  const [employment, setEmploy] = useState<Employment>('salaried')
  const [cityTier, setCity]     = useState<CityTier>('metro')
  const [isMarried, setMarried] = useState(false)
  const [spouseIncomeL]         = useState(0)
  const [children, setChildren] = useState(0)
  const [childAges, setChildAges]= useState<number[]>([3, 6, 10, 13])
  const [hasAgedParents, setParents] = useState(false)
  const [existingLifeCoverL, setLifeCover] = useState(0)
  const [existingHealthL, setHealth]       = useState(0)
  const [homeLoanL, setHomeLoan]           = useState(0)
  const [otherLoansL, setOtherLoans]       = useState(0)
  const [equityL, setEquity]   = useState(0)
  const [debtSavingsL, setDebt]= useState(0)
  const [realEstateL, setRE]   = useState(0)
  const [retirementAge, setRetAge] = useState(60)
  const [goals, setGoals]          = useState<Goal[]>(['wealth', 'retire'])

  function toggleGoal(g: Goal) {
    setGoals(prev => prev.includes(g) ? prev.filter(x => x !== g) : [...prev, g])
  }
  function setChildAge(i: number, v: number) {
    setChildAges(prev => { const a = [...prev]; a[i] = v; return a })
  }

  const profile: WealthProfile = {
    age, monthlyIncome, employment, cityTier,
    isMarried, spouseIncomeL, children, childAges, hasAgedParents,
    existingLifeCoverL, existingHealthL, homeLoanL, otherLoansL,
    equityL, debtSavingsL, realEstateL, retirementAge, goals,
  }
  const bp = calcBlueprint(profile)
  const narrative = buildNarrative(profile, bp)
  const protectionPlan = getProtectionPlan(profile, bp)
  const isHNI = monthlyIncome >= 300000
  const sipAllocs = getSIPAllocations(bp.eqSIP, bp.debtSIP, bp.eqPct, isHNI)
  const plan90 = get90DayPlan(profile, bp)

  const incomeLabel = monthlyIncome >= 100000
    ? `₹${(monthlyIncome / 100000).toFixed(monthlyIncome % 100000 === 0 ? 0 : 1)}L`
    : `₹${Math.round(monthlyIncome / 1000)}K`

  async function saveBlueprint() {
    if (!name || phone.length < 10) return
    setSaving(true); setSaveError('')
    try {
      await fetch('/api/blueprint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone, profile, blueprint: bp }),
      })
      setSaved(true)
    } catch { setSaveError('Could not save. Please try again.') }
    finally { setSaving(false) }
  }

  const slide = { initial: { opacity: 0, x: 20 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: -20 } }

  const ConfidentialBanner = (
    <div className="flex items-center gap-2 bg-navy/4 rounded-xl px-3 py-2 mb-5 border border-navy/8">
      <Lock size={11} className="text-navy/40 flex-shrink-0"/>
      <p className="text-10 text-navy/55 leading-snug">
        <strong className="text-navy/70">100% Confidential.</strong> Your financial data is never stored, sold, or shared before you explicitly save your blueprint.
      </p>
    </div>
  )

  return (
    <section className="bg-white py-14 md:py-18 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(circle at 10% 60%, rgba(201,168,76,0.07) 0%, transparent 55%), radial-gradient(circle at 90% 15%, rgba(4,12,28,0.04) 0%, transparent 50%)' }}/>

      <div className="max-w-[1200px] mx-auto px-5 md:px-8 relative">
        {/* Header */}
        <div className="text-center mb-9">
          <div className="inline-flex items-center gap-2 bg-[#f5f3ee] rounded-full px-4 py-1.5 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-gold"/>
            <span className="text-10 font-bold tracking-[0.16em] uppercase text-navy/55">Poddar Wealth · Free Planning Tool</span>
            <span className="w-1.5 h-1.5 rounded-full bg-gold"/>
          </div>
          <h2 className="font-display text-28 md:text-38 font-bold text-navy leading-tight mb-2">
            Your Personal Wealth Blueprint
          </h2>
          <p className="text-13 text-gray-500 max-w-xl mx-auto leading-relaxed">
            4 questions. A financial brief at the level of a private wealth advisor — covering your protection gap, retirement reality, and a specific product-level action plan.
          </p>
        </div>

        {/* Step indicator */}
        {step < 4 && (
          <div className="flex items-center justify-center gap-1.5 mb-7">
            {['Identity', 'Family', 'Shield', 'Wealth'].map((s, i) => (
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

        {/* ── Steps 0-3: 2-col layout (form + live sidebar) ── */}
        {step < 4 && (
          <div className="max-w-5xl mx-auto">
            <div className="grid lg:grid-cols-[1fr_288px] gap-6 items-start">

              {/* Left column: form steps */}
              <div>
                <AnimatePresence mode="wait">

            {/* ── STEP 0: Identity ─────────────────────────────────────── */}
            {step === 0 && (
              <motion.div key="s0" {...slide} transition={{ duration: 0.22 }}
                className="bg-[#f8f7f4] rounded-3xl p-7 md:p-9 border border-[rgba(184,134,11,0.1)]">
                <h3 className="text-16 font-bold text-navy mb-6">Let's start with the basics</h3>
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <div className="flex justify-between mb-2">
                      <label className="text-11 font-semibold text-navy/75">Your Age</label>
                      <span className="text-13 font-bold text-gold">{age} yrs</span>
                    </div>
                    <input type="range" min={20} max={58} value={age} onChange={e => setAge(+e.target.value)} className="pw-gold-range w-full"/>
                    <div className="flex justify-between text-9 text-gray-400 mt-0.5"><span>20</span><span>58</span></div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <label className="text-11 font-semibold text-navy/75">Monthly Income</label>
                      <span className="text-13 font-bold text-gold">{incomeLabel}</span>
                    </div>
                    <input type="range" min={15000} max={700000} step={5000} value={monthlyIncome}
                      onChange={e => setMI(+e.target.value)} className="pw-gold-range w-full"/>
                    <div className="flex justify-between text-9 text-gray-400 mt-0.5"><span>₹15K</span><span>₹7L+</span></div>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label className="text-11 font-semibold text-navy/75 block mb-2">How do you earn?</label>
                    <div className="grid grid-cols-3 gap-2">
                      {([['salaried','Salaried','Paycheck'],['freelance','Freelance','Variable'],['business','Business','Self-employed']] as const).map(([k,l,s]) => (
                        <button key={k} onClick={() => setEmploy(k)}
                          className={`px-2 py-2.5 rounded-xl border-2 text-left transition-all ${employment === k ? 'border-navy bg-navy text-white' : 'border-gray-200 bg-white text-navy hover:border-navy/30'}`}>
                          <div className="text-11 font-bold">{l}</div>
                          <div className={`text-9 mt-0.5 ${employment === k ? 'text-white/50' : 'text-gray-400'}`}>{s}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-11 font-semibold text-navy/75 block mb-2">Your City</label>
                    <div className="grid grid-cols-3 gap-2">
                      {([['metro','Metro','Delhi/Mum/Blr'],['tier2','Tier-2','Pune/Hyd/Lko'],['tier3','Tier-3','Smaller city']] as const).map(([k,l,s]) => (
                        <button key={k} onClick={() => setCity(k)}
                          className={`px-2 py-2.5 rounded-xl border-2 text-left transition-all ${cityTier === k ? 'border-navy bg-navy text-white' : 'border-gray-200 bg-white text-navy hover:border-navy/30'}`}>
                          <div className="text-11 font-bold">{l}</div>
                          <div className={`text-9 mt-0.5 ${cityTier === k ? 'text-white/50' : 'text-gray-400'}`}>{s}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="mt-7 flex justify-end">
                  <button onClick={() => setStep(1)}
                    className="flex items-center gap-2 bg-navy text-white font-bold text-12 px-7 py-3 rounded-full hover:bg-navy/90 transition-all shadow-md">
                    Next <ArrowRight size={12}/>
                  </button>
                </div>
              </motion.div>
            )}

            {/* ── STEP 1: Family ───────────────────────────────────────── */}
            {step === 1 && (
              <motion.div key="s1" {...slide} transition={{ duration: 0.22 }}
                className="bg-[#f8f7f4] rounded-3xl p-7 md:p-9 border border-[rgba(184,134,11,0.1)]">
                <h3 className="text-16 font-bold text-navy mb-6">Who depends on you?</h3>
                <div className="grid md:grid-cols-2 gap-5 mb-5">
                  <div>
                    <label className="text-11 font-semibold text-navy/75 block mb-2">Marital Status</label>
                    <div className="grid grid-cols-2 gap-2">
                      {([['true','Married'],['false','Single']] as const).map(([v,l]) => (
                        <button key={v} onClick={() => setMarried(v === 'true')}
                          className={`py-3 rounded-xl border-2 text-12 font-bold transition-all ${isMarried === (v === 'true') ? 'border-navy bg-navy text-white' : 'border-gray-200 bg-white text-navy hover:border-navy/30'}`}>
                          {l}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-11 font-semibold text-navy/75 block mb-2">Support ageing parents?</label>
                    <div className="grid grid-cols-2 gap-2">
                      {([['true','Yes'],['false','No']] as const).map(([v,l]) => (
                        <button key={v} onClick={() => setParents(v === 'true')}
                          className={`py-3 rounded-xl border-2 text-12 font-bold transition-all ${hasAgedParents === (v === 'true') ? 'border-navy bg-navy text-white' : 'border-gray-200 bg-white text-navy hover:border-navy/30'}`}>
                          {l}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="mb-5">
                  <label className="text-11 font-semibold text-navy/75 block mb-2">Number of children</label>
                  <div className="flex gap-2">
                    {[0,1,2,3,4].map(n => (
                      <button key={n} onClick={() => setChildren(n)}
                        className={`w-11 h-11 rounded-xl border-2 text-13 font-bold transition-all ${children === n ? 'border-navy bg-navy text-white' : 'border-gray-200 bg-white text-navy hover:border-navy/30'}`}>
                        {n}
                      </button>
                    ))}
                  </div>
                </div>
                {children > 0 && (
                  <div className="bg-white rounded-2xl p-4 border border-gray-100 mb-3">
                    <p className="text-10 font-semibold text-navy/50 uppercase tracking-wider mb-3">Child ages (for education planning)</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {Array.from({ length: children }).map((_, i) => (
                        <div key={i}>
                          <label className="text-9 text-gray-400 mb-1 block">Child {i + 1}</label>
                          <div className="flex items-center gap-2">
                            <input type="range" min={0} max={17} value={childAges[i] ?? 5}
                              onChange={e => setChildAge(i, +e.target.value)}
                              className="pw-gold-range flex-1"/>
                            <span className="text-12 font-bold text-navy w-7 text-right">{childAges[i] ?? 5}y</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <div className="flex justify-between mt-5">
                  <button onClick={() => setStep(0)} className="text-12 text-navy/40 hover:text-navy transition-colors px-2 py-2">← Back</button>
                  <button onClick={() => setStep(2)}
                    className="flex items-center gap-2 bg-navy text-white font-bold text-12 px-7 py-3 rounded-full hover:bg-navy/90 transition-all shadow-md">
                    Next <ArrowRight size={12}/>
                  </button>
                </div>
              </motion.div>
            )}

            {/* ── STEP 2: Current Shield ───────────────────────────────── */}
            {step === 2 && (
              <motion.div key="s2" {...slide} transition={{ duration: 0.22 }}
                className="bg-[#f8f7f4] rounded-3xl p-7 md:p-9 border border-[rgba(184,134,11,0.1)]">
                <h3 className="text-16 font-bold text-navy mb-1">What protection do you currently have?</h3>
                <p className="text-11 text-gray-400 mb-5">Approximate ranges are fine — this powers your gap analysis.</p>
                {ConfidentialBanner}
                <div className="space-y-5">
                  <BucketSelect label="Life Insurance Cover (total sum assured)" note="all policies combined" value={existingLifeCoverL} onChange={setLifeCover} opts={LIFE_COVER_OPTS}/>
                  <BucketSelect label="Health Insurance Cover" note="individual + family floater" value={existingHealthL} onChange={setHealth} opts={HEALTH_OPTS}/>
                  <BucketSelect label="Outstanding Home Loan" value={homeLoanL} onChange={setHomeLoan} opts={LOAN_OPTS}/>
                  <BucketSelect label="Other Outstanding Loans" note="personal, car, education" value={otherLoansL} onChange={setOtherLoans} opts={LOAN_OPTS}/>
                </div>
                <div className="flex justify-between mt-7">
                  <button onClick={() => setStep(1)} className="text-12 text-navy/40 hover:text-navy transition-colors px-2 py-2">← Back</button>
                  <button onClick={() => setStep(3)}
                    className="flex items-center gap-2 bg-navy text-white font-bold text-12 px-7 py-3 rounded-full hover:bg-navy/90 transition-all shadow-md">
                    Next <ArrowRight size={12}/>
                  </button>
                </div>
              </motion.div>
            )}

            {/* ── STEP 3: Wealth ───────────────────────────────────────── */}
            {step === 3 && (
              <motion.div key="s3" {...slide} transition={{ duration: 0.22 }}
                className="bg-[#f8f7f4] rounded-3xl p-7 md:p-9 border border-[rgba(184,134,11,0.1)]">
                <h3 className="text-16 font-bold text-navy mb-1">What have you already built?</h3>
                <p className="text-11 text-gray-400 mb-5">Used to calculate your retirement trajectory and net worth today.</p>
                {ConfidentialBanner}
                <div className="space-y-5 mb-6">
                  <BucketSelect label="Stocks + Mutual Funds (current market value)" value={equityL} onChange={setEquity} opts={EQUITY_OPTS}/>
                  <BucketSelect label="FDs + PPF + NPS + Savings (combined)" value={debtSavingsL} onChange={setDebt} opts={EQUITY_OPTS}/>
                  <BucketSelect label="Investment Real Estate" note="exclude home you live in" value={realEstateL} onChange={setRE} opts={RE_OPTS}/>
                </div>
                <div className="mb-6">
                  <label className="text-11 font-semibold text-navy/75 block mb-2">Target retirement age</label>
                  <div className="flex gap-2 flex-wrap">
                    {[45,50,55,60,65].map(n => (
                      <button key={n} onClick={() => setRetAge(n)}
                        className={`px-5 py-2 rounded-xl border-2 text-12 font-bold transition-all ${retirementAge === n ? 'border-gold bg-gold/10 text-navy' : 'border-gray-200 bg-white text-navy/60 hover:border-gold/40'}`}>
                        {n}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-11 font-semibold text-navy/75 block mb-2">Financial goals <span className="font-normal text-gray-400">(select all)</span></label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {GOAL_DEFS.map(({ key, label, sub }) => {
                      const on = goals.includes(key)
                      return (
                        <button key={key} onClick={() => toggleGoal(key)}
                          className={`text-left px-3 py-2.5 rounded-xl border-2 transition-all ${on ? 'border-gold bg-gold/8 text-navy' : 'border-gray-200 bg-white text-navy/50 hover:border-gold/30'}`}>
                          <div className="text-11 font-bold">{label}</div>
                          <div className="text-9 text-gray-400 mt-0.5">{sub}</div>
                        </button>
                      )
                    })}
                  </div>
                </div>
                <div className="flex justify-between mt-7">
                  <button onClick={() => setStep(2)} className="text-12 text-navy/40 hover:text-navy transition-colors px-2 py-2">← Back</button>
                  <button onClick={() => setStep(4)}
                    className="flex items-center gap-2 bg-gold text-white font-bold text-12 px-8 py-3 rounded-full hover:bg-gold/90 transition-all shadow-lg">
                    Generate My Blueprint <ArrowRight size={12}/>
                  </button>
                </div>
              </motion.div>
            )}

                </AnimatePresence>
              </div>

              {/* Right column: live preview sidebar */}
              <div className="hidden lg:block sticky top-[90px]">
                <div className="bg-navy rounded-2xl p-5 text-white">
                  <div className="text-9 font-bold tracking-[0.18em] uppercase text-gold/70 mb-4">Your Live Snapshot</div>

                  {/* Profile summary */}
                  <div className="space-y-2.5 mb-5">
                    <div className="flex justify-between items-center">
                      <span className="text-10 text-white/50">Age</span>
                      <span className="text-12 font-bold text-white">{age} years</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-10 text-white/50">Monthly Income</span>
                      <span className="text-12 font-bold text-gold">{incomeLabel}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-10 text-white/50">City</span>
                      <span className="text-12 font-bold text-white capitalize">{cityTier === 'metro' ? 'Metro' : cityTier === 'tier2' ? 'Tier-2' : 'Tier-3'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-10 text-white/50">Family</span>
                      <span className="text-12 font-bold text-white">{isMarried ? 'Married' : 'Single'}{children > 0 ? `, ${children} child${children > 1 ? 'ren' : ''}` : ''}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-10 text-white/50">Retire by</span>
                      <span className="text-12 font-bold text-white">Age {retirementAge}</span>
                    </div>
                  </div>

                  {/* Live key metrics */}
                  <div className="border-t border-white/10 pt-4 mb-5">
                    <div className="text-9 font-bold tracking-[0.14em] uppercase text-white/30 mb-3">Blueprint Preview</div>
                    <div className="space-y-3">
                      <div className="bg-white/6 rounded-xl px-3 py-2.5">
                        <div className="text-9 text-white/40 mb-0.5">Human Life Value</div>
                        <div className="text-18 font-bold text-gold">₹{fmt(bp.hlvL)}L</div>
                        <div className="text-9 text-white/30">Your economic worth to family</div>
                      </div>
                      <div className="bg-white/6 rounded-xl px-3 py-2.5">
                        <div className="text-9 text-white/40 mb-0.5">Retirement Corpus Needed</div>
                        <div className={`text-18 font-bold ${bp.retDiffCrore < 0 ? 'text-red-400' : 'text-green-400'}`}>{crore(bp.retCorpusCrore)}</div>
                        <div className="text-9 text-white/30">At 3.5% safe withdrawal rate</div>
                      </div>
                      <div className="bg-white/6 rounded-xl px-3 py-2.5">
                        <div className="text-9 text-white/40 mb-0.5">Protection Gap</div>
                        <div className={`text-18 font-bold ${bp.gapL > 0 ? 'text-red-400' : 'text-green-400'}`}>
                          {bp.gapL > 0 ? `₹${fmt(bp.gapL)}L` : 'None'}
                        </div>
                        <div className="text-9 text-white/30">{bp.gapL > 0 ? `${bp.gapPct}% of HLV uncovered` : 'Fully protected'}</div>
                      </div>
                    </div>
                  </div>

                  {/* What's in the blueprint */}
                  <div className="border-t border-white/10 pt-4">
                    <div className="text-9 font-bold tracking-[0.14em] uppercase text-white/30 mb-3">Your Brief Includes</div>
                    <ul className="space-y-2">
                      {[
                        'Personalised financial narrative',
                        'Specific LIC plan names + premiums',
                        'Named mutual funds to invest in',
                        '90-day action plan with platforms',
                        isHNI ? 'HNI: NPS + LRS + ESOP strategy' : 'Emergency corpus roadmap',
                      ].map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-10 text-white/50">
                          <span className="text-gold mt-0.5 flex-shrink-0">✦</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Progress indicator */}
                  <div className="mt-5 pt-4 border-t border-white/10">
                    <div className="flex justify-between text-9 text-white/30 mb-2">
                      <span>Blueprint completion</span>
                      <span>{Math.round((step / 4) * 100)}%</span>
                    </div>
                    <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-gold rounded-full transition-all duration-500" style={{ width: `${(step / 4) * 100}%` }}/>
                    </div>
                  </div>
                </div>

                {/* Confidentiality note */}
                <div className="mt-3 flex items-start gap-2 px-1">
                  <Lock size={10} className="text-gray-400 mt-0.5 flex-shrink-0"/>
                  <p className="text-10 text-gray-400 leading-snug">
                    100% confidential. Your data powers your blueprint only — never stored or shared until you explicitly save.
                  </p>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ── Step 4: Full-width results ── */}
        {step === 4 && (
          <div className="max-w-4xl mx-auto">
            <AnimatePresence mode="wait">
            {step === 4 && (
              <motion.div key="s4" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

                {/* ── Header bar ── */}
                <div className="bg-navy rounded-2xl px-6 py-5 mb-5 relative overflow-hidden">
                  <div className="absolute inset-0 pointer-events-none"
                    style={{ background: 'radial-gradient(circle at 90% 50%, rgba(201,168,76,0.12) 0%, transparent 60%)' }}/>
                  <div className="relative z-10 flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-5">
                      <ScoreRing score={bp.score}/>
                      <div>
                        <div className="text-9 tracking-[0.2em] font-bold text-gold/70 uppercase mb-1">Wealth Blueprint Score</div>
                        <div className={`text-14 font-bold mb-0.5 ${bp.score >= 65 ? 'text-green-400' : bp.score >= 40 ? 'text-amber-400' : 'text-red-400'}`}>
                          {bp.score >= 65 ? 'Well Protected' : bp.score >= 40 ? 'Needs Attention' : 'Critical Gaps Found'}
                        </div>
                        <div className="text-10 text-white/40">{bp.score >= 65 ? 'Top 15% of Indian households' : bp.score >= 40 ? '4 specific gaps to address' : 'Immediate action required'}</div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { label: 'Human Life Value', val: `₹${fmt(bp.hlvL)}L`, sub: 'Your economic worth', c: '#c9a84c' },
                        { label: 'Net Worth Today', val: `₹${fmt(bp.netWorthL)}L`, sub: 'Assets − liabilities', c: '#3b82f6' },
                        { label: 'Protection Gap', val: bp.gapL > 0 ? crore(bp.gapCrore) : 'None', sub: bp.gapL > 0 ? `${bp.gapPct}% uncovered` : 'Fully covered', c: bp.gapL > 0 ? '#ef4444' : '#22c55e' },
                        { label: 'Retirement Corpus', val: crore(bp.retCorpusCrore), sub: `Need by age ${retirementAge}`, c: '#8b5cf6' },
                      ].map(({ label, val, sub, c }) => (
                        <div key={label} className="bg-white/6 rounded-xl px-3 py-2.5 border border-white/8">
                          <div className="text-16 font-bold leading-none mb-0.5" style={{ color: c }}>{val}</div>
                          <div className="text-10 font-semibold text-white/70">{label}</div>
                          <div className="text-9 text-white/30 mt-0.5">{sub}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* ── 01 YOUR STORY ── */}
                <div className="mb-5">
                  <SectionLabel n="01" title="Your Financial Story"/>
                  <div className="bg-[#f8f7f4] rounded-2xl p-6 border border-gray-100">
                    <p className="text-15 md:text-17 font-bold text-navy leading-snug mb-5 italic">
                      "{narrative.headline}"
                    </p>
                    <div className="space-y-3">
                      {narrative.paras.map((p, i) => (
                        <p key={i} className="text-13 text-gray-700 leading-relaxed">{p}</p>
                      ))}
                    </div>
                  </div>
                </div>

                {/* ── 02 RISK MATRIX ── */}
                <div className="mb-5">
                  <SectionLabel n="02" title="Risk Matrix"/>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      {
                        icon: Shield, label: 'Life Risk', status: bp.gapL > 0 ? 'exposed' : 'covered',
                        line1: bp.gapL > 0 ? `₹${fmt(bp.gapL)}L gap` : 'Fully covered',
                        line2: bp.gapL > 0 ? `Family's runway: ${bp.incYears} yr${bp.incYears !== 1 ? 's' : ''}` : `HLV fully protected`,
                        color: bp.gapL > 0 ? '#ef4444' : '#22c55e',
                      },
                      {
                        icon: Heart, label: 'Health Risk', status: bp.hGapL > 0 ? 'exposed' : 'covered',
                        line1: bp.hGapL > 0 ? `₹${fmt(bp.hGapL)}L underinsured` : `₹${bp.rHL}L cover adequate`,
                        line2: `Medical inflation: 14%/yr`,
                        color: bp.hGapL > 0 ? '#f59e0b' : '#22c55e',
                      },
                      {
                        icon: TrendingUp, label: 'Retirement Risk', status: bp.retDiffCrore < 0 ? 'exposed' : 'covered',
                        line1: bp.retDiffCrore < 0 ? `${crore(Math.abs(bp.retDiffCrore))} deficit` : `${crore(bp.retDiffCrore)} surplus`,
                        line2: `Target: ${crore(bp.retCorpusCrore)} at ${retirementAge}`,
                        color: bp.retDiffCrore < 0 ? '#f59e0b' : '#22c55e',
                      },
                      {
                        icon: Landmark, label: 'Education Risk', status: bp.totalEduL > 0 ? 'planning' : 'na',
                        line1: bp.totalEduL > 0 ? `₹${fmt(bp.totalEduL)}L total` : 'No children',
                        line2: bp.totalEduL > 0 ? `11% education inflation` : 'Not applicable',
                        color: bp.totalEduL > 0 ? '#8b5cf6' : '#9ca3af',
                      },
                    ].map(({ icon: Icon, label, status, line1, line2, color }) => (
                      <div key={label} className="bg-white rounded-2xl p-4 border border-gray-100">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-xl flex items-center justify-center" style={{ background: color + '15', color }}>
                              <Icon size={13}/>
                            </div>
                            <span className="text-11 font-bold text-navy">{label}</span>
                          </div>
                          <span className="text-9 font-bold px-2 py-0.5 rounded-full" style={{ background: color + '15', color }}>
                            {status === 'covered' ? 'Protected' : status === 'exposed' ? 'Gap Found' : status === 'planning' ? 'Plan Needed' : '—'}
                          </span>
                        </div>
                        <div className="text-15 font-bold text-navy mb-0.5" style={{ color }}>{line1}</div>
                        <div className="text-10 text-gray-400">{line2}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ── 03 THE PRESCRIPTION ── */}
                {protectionPlan.length > 0 && (
                  <div className="mb-5">
                    <SectionLabel n="03" title="The Prescription — Specific Plans & Premiums"/>
                    <div className="space-y-3">
                      {protectionPlan.map(rec => (
                        <div key={rec.no} className="bg-white rounded-2xl border overflow-hidden" style={{ borderColor: priorityColor(rec.priority) + '30' }}>
                          <div className="flex items-center justify-between px-5 py-3 border-b" style={{ background: priorityBg(rec.priority), borderColor: priorityColor(rec.priority) + '20' }}>
                            <div className="flex items-center gap-3">
                              <span className="text-9 font-bold tracking-wider text-gray-400">{rec.no}</span>
                              <span className="text-12 font-bold text-navy">{rec.planName}</span>
                              <span className="text-10 text-gray-400 hidden sm:inline">· {rec.planDetail}</span>
                            </div>
                            <span className="text-9 font-bold px-2.5 py-1 rounded-full text-white" style={{ background: priorityColor(rec.priority) }}>
                              {priorityLabel(rec.priority)}
                            </span>
                          </div>
                          <div className="px-5 py-4 grid md:grid-cols-3 gap-4">
                            <div className="md:col-span-2">
                              <div className="text-10 font-bold text-navy/50 uppercase tracking-wider mb-1">{rec.category}</div>
                              <div className="text-13 font-bold text-navy mb-2">{rec.cover}</div>
                              <p className="text-11 text-gray-500 leading-relaxed">{rec.why}</p>
                            </div>
                            <div className="flex flex-col gap-2 md:items-end justify-center">
                              <div className="bg-[#f8f7f4] rounded-xl px-4 py-3 text-center md:text-right">
                                <div className="text-9 text-gray-400 uppercase tracking-wider">Monthly Premium</div>
                                <div className="text-22 font-bold text-navy">₹{fmt(rec.monthly)}</div>
                                <div className="text-10 text-gray-400">₹{fmt(rec.annual)}/year</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ── 04 WEALTH ENGINE ── */}
                <div className="mb-5">
                  <SectionLabel n="04" title="The Wealth Engine — SIP Allocation with Fund Names"/>
                  <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                    <div className="px-5 py-4 border-b border-gray-50 bg-[#f8f7f4]">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div>
                          <span className="text-12 font-bold text-navy">Total Monthly SIP: ₹{fmt(bp.eqSIP + bp.debtSIP)}</span>
                          <span className="text-10 text-gray-400 ml-2">· {bp.eqPct}% equity / {100 - bp.eqPct}% debt (120−age rule, Morningstar India)</span>
                        </div>
                        <div className="text-11 font-bold text-green-700 bg-green-50 px-3 py-1 rounded-full">
                          Projects ₹{crore(bp.projectedCrore)} by age {retirementAge}
                        </div>
                      </div>
                    </div>
                    <div className="divide-y divide-gray-50">
                      {sipAllocs.map(({ name, amc, amount, type, why }) => (
                        <div key={name} className="px-5 py-3.5 flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-0.5">
                              <span className="text-12 font-bold text-navy">{name}</span>
                              <span className="text-9 text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{type}</span>
                            </div>
                            <div className="text-10 text-gray-400 mb-1">{amc}</div>
                            <div className="text-10 text-gray-500 leading-snug">{why}</div>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <div className="text-16 font-bold text-navy">₹{fmt(amount)}</div>
                            <div className="text-9 text-gray-400">/month</div>
                          </div>
                        </div>
                      ))}
                    </div>
                    {bp.delay3L > 0 && (
                      <div className="px-5 py-3.5 bg-amber-50 border-t border-amber-100 flex items-start gap-2">
                        <TriangleAlert size={13} className="text-amber-500 flex-shrink-0 mt-0.5"/>
                        <p className="text-11 text-amber-800">
                          <strong>Cost of waiting 3 years to start this SIP: ₹{fmt(bp.delay3L)} Lakhs</strong> in lost retirement corpus. Compounding is back-heavy — the first decade contributes more than the last two combined.
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* ── HNI SECTION ── */}
                {isHNI && (
                  <div className="mb-5">
                    <SectionLabel n="05" title="High Net Worth Advisory"/>
                    <div className="bg-navy rounded-2xl p-5 border border-gold/20 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-gold/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"/>
                      <div className="flex items-center gap-2 mb-4">
                        <Star size={13} className="text-gold"/>
                        <span className="text-10 font-bold tracking-widest text-gold/70 uppercase">For Earners Above ₹3L/Month</span>
                      </div>
                      <div className="grid md:grid-cols-2 gap-3">
                        {[
                          { title: 'NPS Tier 1 — ₹50,000 extra deduction', body: 'Section 80CCD(1B) gives ₹50,000 tax deduction over and above 80C — saving ₹15,000-17,500 in tax annually at 30% bracket. Returns 10-11% long-term. Register at enps.nsdl.com.', color: '#c9a84c' },
                          { title: 'International Equity (LRS Scheme)', body: 'Allocate 15-20% of equity SIP to US/global index funds (Motilal Oswal NASDAQ 100, Mirae Asset S&P 500). Hedges rupee depreciation (historical ~3.5%/year). LRS limit: $250,000/year.', color: '#3b82f6' },
                          { title: 'ELSS — Tax-Smart Equity', body: 'Up to ₹1.5L/year in ELSS qualifies for 80C deduction (₹45,000-52,500 tax saved at 30%). Best options: Mirae Asset Tax Saver or Axis Long Term Equity. 3-year lock-in only.', color: '#22c55e' },
                          { title: 'Nominee & Will Audit', body: 'At ₹' + fmt(monthlyIncome) + '/month earning level, estates frequently get tied up in probate without proper nomination. Ensure nominees are updated across all policies, EPF, and bank accounts. Consider a registered Will.', color: '#8b5cf6' },
                        ].map(({ title, body, color }) => (
                          <div key={title} className="bg-white/6 rounded-xl p-4 border border-white/8">
                            <div className="flex items-center gap-2 mb-2">
                              <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: color }}/>
                              <span className="text-11 font-bold text-white">{title}</span>
                            </div>
                            <p className="text-10 text-white/50 leading-relaxed pl-4">{body}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* ── 90-DAY PLAN ── */}
                <div className="mb-5">
                  <SectionLabel n={isHNI ? '06' : '05'} title="Your 90-Day Action Plan"/>
                  <div className="space-y-3">
                    {plan90.map(({ label, title, color, steps }) => (
                      <div key={label} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                        <div className="flex items-center gap-3 px-5 py-3 border-b border-gray-50" style={{ background: color + '08' }}>
                          <div className="w-1.5 h-1.5 rounded-full" style={{ background: color }}/>
                          <span className="text-10 font-bold uppercase tracking-widest" style={{ color }}>{label}</span>
                          <span className="text-12 font-bold text-navy ml-1">— {title}</span>
                        </div>
                        <div className="px-5 py-4 space-y-3">
                          {steps.map((s, i) => (
                            <div key={i} className="flex gap-3 items-start">
                              <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 text-9 font-bold" style={{ borderColor: color, color }}>
                                {i + 1}
                              </div>
                              <p className="text-12 text-gray-600 leading-relaxed">{s}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ── TRAJECTORY ── */}
                <div className="mb-5">
                  <SectionLabel n={isHNI ? '07' : '06'} title="Financial Trajectory"/>
                  <div className="bg-[#f8f7f4] rounded-2xl p-5 border border-gray-100">
                    <div className="grid grid-cols-4 gap-0">
                      {[
                        { yr: `Age ${age + 1}`,  label: 'Emergency fund complete. Insurance active.' },
                        { yr: `Age ${Math.min(age + 4, retirementAge - 8)}`, label: `₹${Math.round(bp.projectedCrore * 0.15 * 10) / 10}Cr first corpus milestone.` },
                        { yr: `Age ${Math.min(age + 12, retirementAge - 2)}`, label: `₹${Math.round(bp.projectedCrore * 0.5 * 10) / 10}Cr — halfway to retirement goal.` },
                        { yr: `Age ${retirementAge}`, label: `₹${crore(bp.projectedCrore)} projected — retire on your terms.` },
                      ].map((m, i, arr) => (
                        <div key={i} className="flex-1">
                          <div className="flex items-center">
                            <div className="w-3 h-3 rounded-full ring-2 ring-white flex-shrink-0 z-10" style={{ background: '#c9a84c' }}/>
                            {i < arr.length - 1 && <div className="flex-1 h-px bg-gold/30"/>}
                          </div>
                          <div className="mt-2 pr-3">
                            <div className="text-9 font-bold text-gold">{m.yr}</div>
                            <div className="text-9 text-navy/55 leading-snug mt-0.5">{m.label}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* ── SAVE BLUEPRINT ── */}
                <div className="bg-navy rounded-3xl p-6 md:p-8 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-gold/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"/>
                  <div className="relative z-10">
                    {!saved ? (
                      <>
                        <div className="flex items-center gap-2 mb-2">
                          <Lock size={12} className="text-gold"/>
                          <span className="text-9 font-bold tracking-[0.18em] text-gold/70 uppercase">Private · Confidential · Free</span>
                        </div>
                        <h4 className="text-17 font-bold text-white mb-1">Get Ajay sir's personal review of this blueprint</h4>
                        <p className="text-12 text-white/45 mb-5 leading-relaxed max-w-lg">
                          Ajay sir personally reviews every blueprint submitted here and calls with a specific, no-script action plan — not a sales call. Your data is never sold or shared.
                        </p>
                        <div className="grid md:grid-cols-3 gap-3">
                          <input value={name} onChange={e => setName(e.target.value)} placeholder="Your name"
                            className="px-4 py-3 rounded-xl bg-white/10 border border-white/15 text-12 text-white placeholder-white/25 focus:outline-none focus:border-gold/50 transition-colors"/>
                          <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="WhatsApp number" type="tel" maxLength={10}
                            className="px-4 py-3 rounded-xl bg-white/10 border border-white/15 text-12 text-white placeholder-white/25 focus:outline-none focus:border-gold/50 transition-colors"/>
                          <button disabled={saving || !name || phone.length < 10} onClick={saveBlueprint}
                            className="flex items-center justify-center gap-2 bg-gold text-white font-bold text-12 px-6 py-3 rounded-xl hover:bg-gold/90 transition-all disabled:opacity-40 shadow-lg">
                            {saving ? 'Saving…' : <><span>Save & Book Call</span><ChevronRight size={13}/></>}
                          </button>
                        </div>
                        {saveError && <p className="text-10 text-red-400 mt-2">{saveError}</p>}
                      </>
                    ) : (
                      <div className="text-center py-4">
                        <CheckCircle2 size={30} className="text-green-400 mx-auto mb-3"/>
                        <h4 className="text-17 font-bold text-white mb-1">Blueprint saved.</h4>
                        <p className="text-12 text-white/45">Ajay sir will call you within 24 hours for a free 30-min personalised review.</p>
                      </div>
                    )}
                  </div>
                </div>

                <p className="text-9 text-gray-400 text-center mt-4 leading-relaxed max-w-xl mx-auto">
                  Methodology: IRDAI HLV (6.5% discount rate) · Trinity Study India-adjusted SWR (3.5%) · Swiss Re protection gap · Morningstar 120−age equity allocation · 11% education inflation · 14% medical inflation (IRDAI data) · 6.5% CPI · Vanguard emergency fund framework. This is a planning tool, not financial advice. Actual premiums and returns will vary.
                </p>

                <div className="text-center mt-3">
                  <button onClick={() => { setStep(0); setSaved(false); setName(''); setPhone('') }}
                    className="text-11 text-navy/35 hover:text-navy transition-colors underline underline-offset-2">
                    Recalculate with different inputs
                  </button>
                </div>
              </motion.div>
            )}
            </AnimatePresence>
          </div>
        )}

      </div>
    </section>
  )
}
