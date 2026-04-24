/* ─── constants ───────────────────────────── */
export const CATEGORIES = [
  { key: 'all',       label: 'All Active',   icon: '📋' },
  { key: 'endowment', label: 'Endowment',    icon: '🏦' },
  { key: 'moneyback', label: 'Money Back',   icon: '💰' },
  { key: 'wholelife', label: 'Whole Life',   icon: '♾️' },
  { key: 'term',      label: 'Term',         icon: '🛡️' },
  { key: 'child',     label: 'Child',        icon: '🎓' },
  { key: 'pension',   label: 'Pension',      icon: '📈' },
  { key: 'ulip',      label: 'ULIP',         icon: '📊' },
  { key: 'micro',     label: 'Micro/Rural',  icon: '🌾' },
  { key: 'withdrawn', label: 'Withdrawn',    icon: '📦' },
]

export const CAT_BADGE: Record<string, string> = {
  endowment: 'bg-blue-50 text-blue-700',
  moneyback: 'bg-green-50 text-green-700',
  wholelife: 'bg-purple-50 text-purple-700',
  term:      'bg-red-50 text-red-700',
  child:     'bg-amber-50 text-amber-700',
  pension:   'bg-indigo-50 text-indigo-700',
  ulip:      'bg-teal-50 text-teal-700',
  micro:     'bg-lime-50 text-lime-700',
  withdrawn: 'bg-slate-100 text-slate-500',
}

export const CAT_AVATAR_COLOR: Record<string, string> = {
  endowment: 'bg-blue-600',
  moneyback: 'bg-green-600',
  wholelife: 'bg-purple-600',
  term:      'bg-red-600',
  child:     'bg-amber-600',
  pension:   'bg-indigo-600',
  ulip:      'bg-teal-600',
  micro:     'bg-lime-600',
  withdrawn: 'bg-slate-500',
}

