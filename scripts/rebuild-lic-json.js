/**
 * Rebuilds lib/data/lic-plans.json from lib/lic-plans-data.js
 * Run: node scripts/rebuild-lic-json.js
 *
 * This ensures the Products page (LicPlans component) stays in sync
 * with the single source of truth in lic-plans-data.js.
 */

const fs   = require('fs')
const path = require('path')

const { PLANS } = require('../lib/lic-plans-data.js')

/* ── category config (matches Products page filter labels) ── */
const CAT_META = {
  endowment: { label: { en: 'Endowment Plans',   hi: 'एंडाउमेंट प्लान्स' },   icon: '🏦' },
  moneyback:  { label: { en: 'Money Back Plans',  hi: 'मनी बैक प्लान्स' },     icon: '💰' },
  wholelife:  { label: { en: 'Whole Life Plans',  hi: 'होल लाइफ प्लान्स' },   icon: '♾️' },
  term:       { label: { en: 'Term Plans',        hi: 'टर्म प्लान्स' },         icon: '🛡️' },
  child:      { label: { en: 'Child Plans',       hi: 'चाइल्ड प्लान्स' },      icon: '🎓' },
  pension:    { label: { en: 'Pension & Annuity', hi: 'पेंशन और एन्युटी' },    icon: '📈' },
  ulip:       { label: { en: 'ULIP Plans',        hi: 'यूलिप प्लान्स' },       icon: '📊' },
  micro:      { label: { en: 'Micro / Rural',     hi: 'माइक्रो / ग्रामीण' },   icon: '🌾' },
}

/* ── helpers ── */
function fmtAge(min, max) {
  if (!min && !max) return 'N/A'
  if (!max) return `${min}+yr`
  return `${min} - ${max}yr`
}

function fmtSA(n) {
  if (!n) return 'N/A'
  if (n >= 10000000) return `₹${n / 10000000}Cr+`
  if (n >= 100000)   return `₹${n / 100000}L+`
  if (n >= 1000)     return `₹${(n / 1000).toFixed(0)}K+`
  return `₹${n}+`
}

function pptLabel(p) {
  if (!p) return 'Single'
  if (p === 'same') return 'Regular'
  if (typeof p === 'number') return `${p} Years`
  return String(p)
}

function planUrl(planNo) {
  return `https://licindia.in/web/guest/plan-${planNo}`
}

/* ── build category buckets ── */
const categories = {}
for (const key of Object.keys(CAT_META)) {
  categories[key] = {
    ...CAT_META[key],
    plans: [],
  }
}

for (const p of PLANS) {
  const catKey = p.category
  if (!categories[catKey]) continue  // skip unknown categories

  const plan = {
    id:             `lic-${p.planNo}`,
    name:           { en: `LIC's ${p.name}`, hi: `एलआईसी ${p.shortName || p.name}` },
    planNo:         String(p.planNo),
    tagline:        { en: p.desc || '', hi: p.desc || '' },
    keyBenefit:     { en: p.keyBenefit || p.desc || '', hi: p.keyBenefit || p.desc || '' },
    category:       catKey,
    entryAge:       fmtAge(p.minAge, p.maxAge),
    sumAssured:     fmtSA(p.minSA),
    premiumPayment: pptLabel(p.ppt),
    highlights:     (p.keyFeatures || []).slice(0, 4).map(f => ({ en: f, hi: f })),
    officialUrl:    p.brochureUrl || planUrl(p.planNo),
    status:         p.status || 'active',
    ...(p.status === 'withdrawn' && p.withdrawnDate
      ? { withdrawnDate: p.withdrawnDate }
      : {}),
  }

  categories[catKey].plans.push(plan)
}

/* ── remove empty category buckets ── */
for (const key of Object.keys(categories)) {
  if (categories[key].plans.length === 0) delete categories[key]
}

/* ── meta ── */
const activePlans   = PLANS.filter(p => p.status === 'active' || p.status === 'new').length
const withdrawnPlans = PLANS.filter(p => p.status === 'withdrawn').length
const totalPlans    = activePlans + withdrawnPlans

const output = {
  meta: {
    source:        'lic-plans-data.js (manual curation)',
    lastUpdated:   new Date().toISOString().split('T')[0],
    version:       '4.0.0',
    totalPlans,
    activePlans,
    withdrawnPlans,
    categories:    Object.keys(categories),
  },
  categories,
}

const OUT_PATH = path.join(__dirname, '../lib/data/lic-plans.json')
fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true })
fs.writeFileSync(OUT_PATH, JSON.stringify(output, null, 2))

console.log(`✅ lic-plans.json rebuilt`)
console.log(`   Active plans  : ${activePlans}`)
console.log(`   Withdrawn     : ${withdrawnPlans}`)
console.log(`   Total         : ${totalPlans}`)
console.log(`   Categories    : ${Object.keys(categories).join(', ')}`)
