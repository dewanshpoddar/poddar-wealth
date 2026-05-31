import { Search, ChevronDown } from 'lucide-react'
import { CATEGORIES, CAT_AVATAR_COLOR } from './calc-constants'
import { LicPlan } from '@/lib/types/lic-plan'

export interface PlanSearchProps {
  quickPlanNo: string
  setQuickPlanNo: (val: string) => void
  quickAge: string
  setQuickAge: (val: string) => void
  handleQuickSelect: () => void
  activeCat: string
  setActiveCat: (val: string) => void
  search: string
  setSearch: (val: string) => void
  filteredPlans: LicPlan[]
  selectedPlan: LicPlan | null
  handleSelectPlan: (plan: LicPlan) => void
}

export default function PlanSearch({
  quickPlanNo, setQuickPlanNo, quickAge, setQuickAge, handleQuickSelect,
  activeCat, setActiveCat, search, setSearch, filteredPlans, selectedPlan, handleSelectPlan
}: PlanSearchProps) {
  return (
            <div className="bg-white rounded-2xl shadow-sm border border-[rgba(184,134,11,0.1)] overflow-hidden lg:sticky lg:top-[86px]">

              {/* Quick Selector — like the competitor app */}
              <div className="bg-navy px-4 py-3">
                <div className="text-[10px] font-bold text-white/50 uppercase tracking-widest mb-2">Quick Selector</div>
                <div className="flex gap-2">
                  <input type="number" placeholder="Plan No" value={quickPlanNo}
                    onChange={e => setQuickPlanNo(e.target.value)}
                    className="flex-1 px-3 py-2 text-[12px] bg-white/10 border border-white/20 text-white placeholder-white/30 rounded-lg focus:outline-none focus:bg-white/15" />
                  <input type="number" placeholder="Age" value={quickAge}
                    onChange={e => setQuickAge(e.target.value)}
                    className="w-20 px-3 py-2 text-[12px] bg-white/10 border border-white/20 text-white placeholder-white/30 rounded-lg focus:outline-none focus:bg-white/15" />
                  <button onClick={handleQuickSelect}
                    className="px-3 py-2 bg-gold text-white text-[11px] font-bold rounded-lg hover:bg-gold-hover transition-colors">
                    Go
                  </button>
                </div>
              </div>

              {/* Category tabs */}
              <div className="p-3 border-b border-gray-50">
                <div className="flex flex-wrap gap-1.5">
                  {CATEGORIES.map(c => (
                    <button key={c.key} onClick={() => setActiveCat(c.key)}
                      className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all
                        ${activeCat === c.key ? 'bg-navy text-white' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}>
                      {c.icon} {c.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Search */}
              <div className="px-3 pt-3 pb-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" />
                  <input value={search} onChange={e => setSearch(e.target.value)}
                    placeholder="Search plan name or number…"
                    className="w-full pl-8 pr-3 py-2 text-[12px] border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:border-gold/40 focus:bg-white transition-all" />
                </div>
              </div>

              {/* Plan list with letter-avatar circles */}
              <div className="overflow-y-auto max-h-[420px] px-2 pb-2">
                {filteredPlans.length === 0 ? (
                  <div className="py-8 text-center text-[12px] text-gray-500">No plans found</div>
                ) : filteredPlans.map((plan: LicPlan) => {
                  const isSelected = selectedPlan?.planNo === plan.planNo
                  const avatarColor = CAT_AVATAR_COLOR[plan.category] ?? 'bg-navy'
                  return (
                    <button key={plan.planNo} onClick={() => handleSelectPlan(plan)}
                      className={`w-full text-left px-3 py-2.5 rounded-xl mb-1 transition-all border flex items-center gap-3
                        ${isSelected ? 'bg-gold/8 border-gold/30 shadow-sm' : 'border-transparent hover:bg-gray-50 hover:border-gray-100'}`}>
                      {/* Avatar circle with first letter */}
                      <div className={`w-9 h-9 rounded-full ${avatarColor} ring-2 ring-gold/30 flex items-center justify-center flex-shrink-0`}>
                        <span className="text-white font-bold text-[13px]">{plan.name.charAt(0)}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <div className={`text-[12px] font-bold truncate ${isSelected ? 'text-gold' : plan.status === 'withdrawn' ? 'text-slate-400' : 'text-gray-800'}`}>
                            {plan.name}
                          </div>
                          {plan.status === 'withdrawn' && (
                            <span className="flex-shrink-0 text-[9px] bg-slate-100 text-slate-400 font-bold px-1.5 py-0.5 rounded uppercase tracking-wide">Discontinued</span>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-[10px] text-gray-500 font-medium">Plan {plan.planNo}</span>
                          {plan.xirr && plan.status !== 'withdrawn' && <span className="text-[10px] text-green-600 font-semibold">· {plan.xirr}</span>}
                          {plan.status === 'withdrawn' && <span className="text-[10px] text-slate-400">· Calc only</span>}
                        </div>
                      </div>
                      <ChevronDown className={`w-3.5 h-3.5 flex-shrink-0 -rotate-90 ${isSelected ? 'text-gold' : 'text-gray-300'}`} />
                    </button>
                  )
                })}
              </div>
            </div>
  )
}
