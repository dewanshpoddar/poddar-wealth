import type { WealthProfile, CityTier } from '../types/blueprint.types'

export function selfConsumptionRate(married: boolean, kids: number) {
  return !married && kids === 0 ? 0.45 : married && kids === 0 ? 0.35 : 0.28
}
export function calcHLV(annual: number, age: number, retAge: number, sc: number) {
  const n = Math.max(1, retAge - age), r = 0.065
  return Math.round(annual * (1 - sc) * ((1 - Math.pow(1 + r, -n)) / r))
}
export function sipFV(mo: number, rate: number, yrs: number) {
  if (yrs <= 0 || mo <= 0) return 0
  const r = rate / 12, n = yrs * 12
  return Math.round(mo * ((Math.pow(1 + r, n) - 1) / r) * (1 + r))
}
export function lumpFV(pv: number, rate: number, yrs: number) {
  return yrs <= 0 ? pv : Math.round(pv * Math.pow(1 + rate, yrs))
}
export function retirementCorpusNeeded(moExpense: number, yrs: number) {
  return Math.round(moExpense * Math.pow(1.065, yrs) * 12 / 0.035)
}
export function eduCorpus(childAge: number) {
  return Math.round(1_800_000 * Math.pow(1.11, Math.max(0, 18 - childAge)))
}
export function costOfDelay(mo: number, age: number, delayYrs: number, retAge: number) {
  return Math.max(0, sipFV(mo, 0.12, retAge - age) - sipFV(mo, 0.12, retAge - age - delayYrs))
}
export function recHealthL(tier: CityTier, family: boolean) {
  return tier === 'metro' ? (family ? 50 : 25) : tier === 'tier2' ? (family ? 25 : 10) : (family ? 15 : 5)
}

export function calcBlueprint(p: WealthProfile) {
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

export function fmt(n: number) { return n.toLocaleString('en-IN') }

export function buildNarrative(p: WealthProfile, bp: ReturnType<typeof calcBlueprint>) {
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

  paras.push(
    `You are a ${p.age}-year-old ${empLabel} in a ${cityLabel}, earning ${annualCrStr} per year — ${familyStr}. ` +
    `You have built ₹${fmt(bp.netWorthL)} Lakhs in net worth (liquid + real estate, after liabilities). ` +
    (bp.netWorthL >= 100
      ? `That places you in the top 8% of Indian households by net worth. The challenge now is not building — it is structuring what you have, and protecting what you will earn.`
      : bp.netWorthL >= 20
      ? `That is real progress. Most Indians have near-zero financial assets at your age. The next phase is building the architecture that protects and multiplies this.`
      : `Every financial empire starts from zero. Yours begins today.`)
  )

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

export function getProtectionPlan(p: WealthProfile, bp: ReturnType<typeof calcBlueprint>) {
  type Priority = 'critical' | 'high' | 'medium'
  const recs: Array<{
    no: string; category: string; planName: string; planDetail: string
    cover: string; monthly: number; annual: number; why: string; priority: Priority
  }> = []
  const hasFamily = p.isMarried || p.children > 0

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

export function getSIPAllocations(eqSIP: number, debtSIP: number, eqPct: number, isHNI: boolean) {
  const core = Math.round(eqSIP * 0.50)
  const flexi = Math.round(eqSIP * 0.30)
  const mid = eqSIP - core - flexi
  const intl = isHNI ? Math.round(eqSIP * 0.15) : 0
  const adjusted = isHNI ? eqSIP - intl : eqSIP

  const items: Array<{ name: string; amc: string; amount: number; type: string; why: string }> = [
    { name: 'Nifty 50 Index Fund', amc: 'Nippon India / Mirae Asset', amount: isHNI ? Math.round(adjusted * 0.5) : core, type: 'Equity – Large Cap', why: "Core holding. 0.1-0.2% TER. Tracks India's 50 largest companies. Lowest-cost path to market returns." },
    { name: 'Parag Parikh Flexi Cap', amc: 'PPFAS Mutual Fund', amount: isHNI ? Math.round(adjusted * 0.3) : flexi, type: 'Equity – Multi Cap', why: 'Consistent 15%+ 5-year CAGR. Unique: up to 35% overseas equity allocation (Google, Meta, etc.) gives rupee-depreciation hedge.' },
    { name: 'HDFC Mid Cap Opportunities', amc: 'HDFC AMC', amount: isHNI ? Math.round(adjusted * 0.2) : mid, type: 'Equity – Mid Cap', why: 'Long-term growth kicker. Higher volatility but stronger 10-year compounding. Only for 7yr+ horizon.' },
  ]
  if (isHNI && intl > 0) items.push({ name: 'Motilal Oswal NASDAQ 100 / Mirae Asset S&P 500', amc: 'Overseas Index', amount: intl, type: 'Equity – International', why: 'USD-denominated growth. Hedges INR depreciation (~3-4%/year historical). LRS-compliant for up to $250,000/year.' })
  items.push({ name: 'HDFC Short Duration Fund', amc: 'HDFC AMC', amount: debtSIP, type: 'Debt – Short Duration', why: '7-8% expected return. 1-3yr duration. Stability ballast that prevents panic-selling your equity SIPs during market corrections.' })
  return items
}

export function get90DayPlan(p: WealthProfile, bp: ReturnType<typeof calcBlueprint>) {
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
