// ── Category accent colors ──────────────────────────────────────────────────
export const CAT_ACCENT: Record<string, string> = {
  endowment:  '#2563EB',
  wholeLife:  '#059669',
  moneyBack:  '#D97706',
  term:       '#DC2626',
  child:      '#DB2777',
  pension:    '#7C3AED',
  ulip:       '#0891B2',
  micro:      '#EA580C',
}

// ── Popularity badges - based on LIC sales & internet data ─────────────────
export const PLAN_BADGES: Record<string, { label: string; color: string; bg: string; icon: string }> = {
  '915': { label: 'Best Seller', color: '#15803d', bg: '#dcfce7', icon: '🏆' },
  '945': { label: 'Best Seller', color: '#15803d', bg: '#dcfce7', icon: '🏆' },
  '836': { label: 'Best Seller', color: '#15803d', bg: '#dcfce7', icon: '🏆' },
  '933': { label: 'Best Seller', color: '#15803d', bg: '#dcfce7', icon: '🏆' },
  '954': { label: 'Most Popular', color: '#1d4ed8', bg: '#dbeafe', icon: '🔥' },
  '955': { label: 'Most Popular', color: '#1d4ed8', bg: '#dbeafe', icon: '🔥' },
  '858': { label: 'Most Popular', color: '#1d4ed8', bg: '#dbeafe', icon: '🔥' },
  '857': { label: 'Most Popular', color: '#1d4ed8', bg: '#dbeafe', icon: '🔥' },
  '852': { label: 'Top Performer', color: '#0e7490', bg: '#cffafe', icon: '📈' },
  '749': { label: 'Top Performer', color: '#0e7490', bg: '#cffafe', icon: '📈' },
  '948': { label: "Advisor's Pick", color: '#7c3aed', bg: '#ede9fe', icon: '⭐' },
  '871': { label: "Advisor's Pick", color: '#7c3aed', bg: '#ede9fe', icon: '⭐' },
  '862': { label: "Advisor's Pick", color: '#7c3aed', bg: '#ede9fe', icon: '⭐' },
  '881': { label: 'New Launch', color: '#b45309', bg: '#fef3c7', icon: '✨' },
  '912': { label: 'New Launch', color: '#b45309', bg: '#fef3c7', icon: '✨' },
  '876': { label: 'New Launch', color: '#b45309', bg: '#fef3c7', icon: '✨' },
  '887': { label: 'New Launch', color: '#b45309', bg: '#fef3c7', icon: '✨' },
  '886': { label: 'New Launch', color: '#b45309', bg: '#fef3c7', icon: '✨' },
  '880': { label: 'New Launch', color: '#b45309', bg: '#fef3c7', icon: '✨' },
  '751': { label: 'New Launch', color: '#b45309', bg: '#fef3c7', icon: '✨' },
  '879': { label: 'New Launch', color: '#b45309', bg: '#fef3c7', icon: '✨' },
}

export const GOALS = [
  { key: 'save',    label: { en: 'Save & Grow',        hi: 'बचत और वृद्धि' },     cats: ['endowment', 'wholeLife', 'moneyBack'] },
  { key: 'protect', label: { en: 'Family Protection',  hi: 'परिवार सुरक्षा' },     cats: ['term', 'child'] },
  { key: 'retire',  label: { en: 'Retirement Income',  hi: 'सेवानिवृत्ति आय' },   cats: ['pension'] },
  { key: 'invest',  label: { en: 'Market Growth',      hi: 'बाजार निवेश' },        cats: ['ulip'] },
  { key: 'child',   label: { en: "Child's Future",     hi: 'बच्चों का भविष्य' },  cats: ['child'] },
  { key: 'micro',   label: { en: 'Low Premium',        hi: 'कम प्रीमियम' },        cats: ['micro'] },
]

export const AGE_GROUPS = [
  { key: 'child',  label: { en: 'For Minors (0-17)',   hi: '0-17 वर्ष' } },
  { key: 'young',  label: { en: 'Young Adult (18-35)', hi: '18-35 वर्ष' } },
  { key: 'prime',  label: { en: 'Prime Age (36-55)',   hi: '36-55 वर्ष' } },
  { key: 'senior', label: { en: 'Senior (55+)',        hi: '55+ वर्ष' } },
]

export const RETURN_TYPES = [
  { key: 'guaranteed', label: { en: 'Guaranteed Returns', hi: 'गारंटीड रिटर्न' }, cats: ['endowment', 'wholeLife', 'moneyBack', 'child', 'micro'] },
  { key: 'market',     label: { en: 'Market-Linked',      hi: 'बाजार-लिंक्ड' },  cats: ['ulip'] },
  { key: 'income',     label: { en: 'Regular Income',     hi: 'नियमित आय' },       cats: ['pension'] },
  { key: 'pure',       label: { en: 'Pure Protection',    hi: 'केवल सुरक्षा' },   cats: ['term'] },
]

export const PREMIUM_MODES = [
  { key: 'regular', label: { en: 'Regular Pay', hi: 'नियमित' } },
  { key: 'limited', label: { en: 'Limited Pay', hi: 'सीमित' } },
  { key: 'single',  label: { en: 'Single Pay',  hi: 'एकमुश्त' } },
]

export const COVER_TIERS = [
  { key: 'starter', label: { en: 'Upto ₹5 Lakh', hi: '₹5 लाख तक' } },
  { key: 'mid',     label: { en: '₹5L - ₹25L',   hi: '₹5L-₹25L' } },
  { key: 'high',    label: { en: '₹25 Lakh+',     hi: '₹25 लाख+' } },
]

// ── Helpers ─────────────────────────────────────────────────────────────────
export function getPremiumModes(pp: string): string[] {
  const lower = pp.toLowerCase()
  const modes: string[] = []
  if (lower.includes('regular')) modes.push('regular')
  if (lower.includes('limited')) modes.push('limited')
  if (lower.includes('single')) modes.push('single')
  return modes
}

export function getSumTier(sa: string): string {
  const cleaned = sa.replace(/[₹,+\s]/g, '')
  const num = parseInt(cleaned.split(/[-(]/)[0]) || 0
  if (num >= 2500000) return 'high'
  if (num >= 500000)  return 'mid'
  return 'starter'
}

export function parseAgeRange(entryAge: string): { min: number; max: number } {
  const cleanedMin = entryAge.match(/^(\d+)(d|m)?/)
  const cleanedMax = entryAge.match(/[-]\s*(\d+)\s*(yr)?/)
  const min = cleanedMin ? (cleanedMin[2] === 'd' ? 0 : parseInt(cleanedMin[1])) : 0
  const max = cleanedMax ? parseInt(cleanedMax[1]) : 99
  return { min, max }
}

export function matchesAgeGroup(entryAge: string, ageKey: string): boolean {
  const { min, max } = parseAgeRange(entryAge)
  switch (ageKey) {
    case 'child':  return min <= 17
    case 'young':  return max >= 18 && min <= 35
    case 'prime':  return max >= 36 && min <= 55
    case 'senior': return max >= 55
    default: return true
  }
}
