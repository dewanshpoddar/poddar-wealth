import { useState } from 'react'
import Link from 'next/link'
import {
  ArrowRight, ChevronDown, ChevronUp,
  Share2, CheckCircle2, Info, Shield, TrendingUp, Star
} from 'lucide-react'
import { fmt, fmtSA } from '@/lib/format'
import { MODE_LABEL, SA_PRESETS } from '@/lib/constants'
import { RIDERS } from '@/lib/lic-plans-data.js'
import { openLeadPopup } from '@/lib/events'
import { CAT_AVATAR_COLOR } from './calc-constants'

import { LicPlan, PremiumResult, MaturityResult, BenefitRow } from '@/lib/types/lic-plan'

export interface ResultsPanelProps {
  selectedPlan: LicPlan
  clientName: string
  salutation: 'Mr.' | 'Mrs.' | 'Ms.'
  age: number
  sa: number
  safeterm: number
  ppt: number
  isTermPlan: boolean
  isUlip: boolean
  premResult: PremiumResult | null
  matResult: MaturityResult | null
  tax80C: number | null
  xirr: string | null
  multiplier: string | null
  benefitTable: BenefitRow[]
  showTable: boolean
  setShowTable: (val: boolean) => void
  showAllRows: boolean
  setShowAllRows: (val: boolean) => void
  showAllModes: boolean
  setShowAllModes: (val: boolean | ((v: boolean) => boolean)) => void
  allModesPrem: { mode: 'yearly' | 'halfyearly' | 'quarterly' | 'monthly'; prem: PremiumResult; perDay: number | null }[] | null
  mode: 'yearly' | 'halfyearly' | 'quarterly' | 'monthly'
  setMode: (val: 'yearly' | 'halfyearly' | 'quarterly' | 'monthly') => void
  isUnlocked: boolean
  setIsUnlocked: (val: boolean) => void
  unlockMobile: string
  setUnlockMobile: (val: string) => void
  unlockWantTo: string
  setUnlockWantTo: (val: string) => void
  unlockIAm: string
  setUnlockIAm: (val: string) => void
  unlockEmail: string
  setUnlockEmail: (val: string) => void
  unlockStatus: 'idle' | 'sending' | 'done'
  handleUnlock: (e: React.FormEvent) => void
  whatsappShare: () => void
}

export default function ResultsPanel({
  selectedPlan, clientName, salutation, age, sa, safeterm, ppt, isTermPlan, isUlip,
  premResult, matResult, tax80C, xirr, multiplier, benefitTable,
  showTable, setShowTable, showAllRows, setShowAllRows, showAllModes, setShowAllModes,
  allModesPrem, mode, setMode, isUnlocked, setIsUnlocked,
  unlockMobile, setUnlockMobile, unlockWantTo, setUnlockWantTo, unlockIAm, setUnlockIAm,
  unlockEmail, setUnlockEmail, unlockStatus, handleUnlock, whatsappShare
}: ResultsPanelProps) {
  const visibleRows = showAllRows ? benefitTable : benefitTable.slice(0, 10);
  return (
    <>
                      {premResult && (
                  <div className="space-y-4">

                    {/* Personalized profile header */}
                    <div className="bg-[#f5f0e8] border border-gold/20 rounded-2xl px-5 py-4 flex items-center gap-4">
                      <div className={`w-14 h-14 rounded-full ${CAT_AVATAR_COLOR[selectedPlan.category] ?? 'bg-navy'} ring-2 ring-gold/40 flex items-center justify-center flex-shrink-0 shadow`}>
                        <span className="text-white font-bold text-[20px]">
                          {clientName ? clientName.charAt(0).toUpperCase() : salutation.charAt(0)}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="font-bold text-[15px] text-navy">
                          {clientName ? `${salutation} ${clientName}` : `${salutation} Client`}
                        </div>
                        <div className="text-[11px] text-gray-500 mt-0.5">Age: {age} years</div>
                      </div>
                      <div className="text-right">
                        <div className="font-display font-bold text-[13px] text-navy">
                          LIC&apos;s {selectedPlan.name} ({selectedPlan.planNo}-{safeterm}-{ppt})
                        </div>
                        <div className="text-[11px] text-gray-500">Premium And Benefit Illustration</div>
                      </div>
                    </div>

                    {/* Plan Details summary table */}
                    <div className="bg-white rounded-2xl border border-[rgba(184,134,11,0.08)] shadow-sm overflow-hidden">
                      <div className="bg-navy px-5 py-2.5">
                        <span className="text-white font-bold text-[12px]">Plan Details</span>
                      </div>
                      <div className="divide-y divide-gray-50">
                        {[
                          { icon: '🛡️', label: 'Sum Assured', value: `₹ ${sa.toLocaleString('en-IN')}` },
                          { icon: '⏱️', label: 'Term',         value: `${safeterm} Years.` },
                          { icon: '💳', label: 'Premium Payment', value: `${ppt} Years.` },
                        ].map(({ icon, label, value }) => (
                          <div key={label} className="flex items-center justify-between px-5 py-3">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-navy flex items-center justify-center text-[14px]">{icon}</div>
                              <span className="text-[13px] font-medium text-gray-700">{label}</span>
                            </div>
                            <span className="text-[13px] font-bold text-navy">{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Other Benefits */}
                    {selectedPlan.riders?.length > 0 && (() => {
                      const dabRider = selectedPlan.riders.includes('dab')
                      return dabRider ? (
                        <div className="bg-white rounded-2xl border border-[rgba(184,134,11,0.08)] shadow-sm overflow-hidden">
                          <div className="bg-navy px-5 py-2.5">
                            <span className="text-white font-bold text-[12px]">Other Benefits</span>
                          </div>
                          <div className="flex items-center justify-between px-5 py-3">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-[14px]">🛡️</div>
                              <span className="text-[13px] font-medium text-gray-700">Accidental Death And Disability Cover</span>
                            </div>
                            <span className="text-[13px] font-bold text-navy">₹ {sa.toLocaleString('en-IN')}</span>
                          </div>
                        </div>
                      ) : null
                    })()}

                    {/* You Pay / You Get — pension-specific vs standard */}
                    {premResult.isPensionAnnuity ? (
                      /* ── PENSION ANNUITY: one-time purchase price → annual pension ── */
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                          <div className="bg-white rounded-2xl p-5 border-2 border-gold/25 shadow-sm">
                            <div className="text-[22px] mb-1">🐷</div>
                            <div className="text-[11px] font-bold text-gold uppercase tracking-wider">You Pay</div>
                            <div className="text-[10px] text-gray-500 mb-2">one-time purchase price</div>
                            <div className="font-display font-bold text-[22px] text-navy leading-none">₹ {(premResult.purchasePrice ?? 0).toLocaleString('en-IN')}</div>
                            <div className="text-[10px] text-gray-500 mt-1">+ GST ₹{(premResult.gst ?? 0).toLocaleString('en-IN')} = ₹{(premResult.totalPayable ?? 0).toLocaleString('en-IN')}</div>
                          </div>
                          <div className="bg-white rounded-2xl p-5 border-2 border-green-200 shadow-sm">
                            <div className="text-[22px] mb-1">🤲</div>
                            <div className="text-[11px] font-bold text-green-600 uppercase tracking-wider">You Get</div>
                            <div className="text-[10px] text-gray-500 mb-2">annual pension</div>
                            <div className="font-display font-bold text-[22px] text-green-700 leading-none">₹ {(premResult.annualPension ?? 0).toLocaleString('en-IN')}</div>
                            <div className="text-[10px] text-gray-500 mt-1">every year for life</div>
                          </div>
                        </div>
                        <div className="bg-white rounded-2xl border border-[rgba(184,134,11,0.08)] shadow-sm p-5">
                          <div className="flex items-center gap-3 mb-3">
                            <span className="text-[24px]">📅</span>
                            <div className="font-bold text-[14px] text-navy">Pension Payout Breakdown</div>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            {[
                              { label: 'Monthly', value: premResult.monthlyPension ?? 0 },
                              { label: 'Quarterly', value: premResult.quarterlyPension ?? 0 },
                              { label: 'Half-Yearly', value: premResult.halfYearlyPension ?? 0 },
                              { label: 'Annual', value: premResult.annualPension ?? 0 },
                            ].map(({ label, value }) => (
                              <div key={label} className="text-center bg-gold/5 rounded-xl p-3">
                                <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">{label}</div>
                                <div className="font-display font-bold text-[18px] text-navy">₹ {value.toLocaleString('en-IN')}</div>
                              </div>
                            ))}
                          </div>
                          <div className="mt-3 text-[10px] text-gray-500 text-center">
                            Annuity rate: ₹{premResult.annuityRate ?? 0}/₹1000 purchase price · Life annuity with return of purchase price option
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* ── STANDARD: You Pay / You Get ── */
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-white rounded-2xl p-5 border-2 border-gold/25 shadow-sm">
                          <div className="text-[22px] mb-1">🐷</div>
                          <div className="text-[11px] font-bold text-gold uppercase tracking-wider">You Pay</div>
                          <div className="text-[10px] text-gray-500 mb-2">total premium of</div>
                          <div className="font-display font-bold text-[22px] text-navy leading-none">₹ {Math.round(premResult.totalPaid).toLocaleString('en-IN')}</div>
                          <div className="text-[10px] text-gray-500 mt-1">over {ppt} year{ppt > 1 ? 's' : ''}</div>
                        </div>
                        <div className="bg-white rounded-2xl p-5 border-2 border-green-200 shadow-sm">
                          <div className="text-[22px] mb-1">🤲</div>
                          <div className="text-[11px] font-bold text-green-600 uppercase tracking-wider">You Get</div>
                          <div className="text-[10px] text-gray-500 mb-2">{isTermPlan ? 'life cover' : isUlip ? 'fund value (market-linked)' : 'total benefit of'}</div>
                          <div className={`font-display font-bold text-[22px] leading-none ${isTermPlan ? 'text-red-600' : 'text-green-700'}`}>
                            {isTermPlan
                              ? `₹ ${sa.toLocaleString('en-IN')}`
                              : isUlip
                              ? 'Market-linked'
                              : (matResult?.maturity ? `₹ ${Math.round(matResult.maturity).toLocaleString('en-IN')}` : '—')}
                          </div>
                          <div className="text-[10px] text-gray-500 mt-1">
                            {isTermPlan ? 'on death claim' : isUlip ? 'depends on NAV at maturity' : `at age ${age + safeterm}`}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Premium per instalment — mode-reactive (hidden for pension annuity & single premium) */}
                    {!premResult.isPensionAnnuity && selectedPlan?.ppt !== 'single' && (() => {
                      const currentModePrem = allModesPrem?.find(r => r.mode === mode)?.prem ?? premResult
                      const isSinglePremPlan = ppt === 1 && selectedPlan?.ppt === 'single'
                      if (isSinglePremPlan) return null
                      return (
                        <div className="bg-white rounded-2xl border border-[rgba(184,134,11,0.08)] shadow-sm p-5">
                          <div className="flex items-center gap-3 mb-4">
                            <span className="text-[24px]">💰</span>
                            <div className="font-bold text-[14px] text-navy">
                              {mode === 'yearly' ? 'Yearly Premium' : `${MODE_LABEL[mode]} Premium`}
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4 mb-4">
                            <div className="text-center">
                              <div className="text-[11px] font-bold text-gray-500 mb-1">First Year</div>
                              <div className="font-display font-bold text-[22px] text-gold">₹ {Math.round(currentModePrem.instalment1).toLocaleString('en-IN')}</div>
                              <div className="text-[10px] text-gray-500 mt-0.5">
                                per {mode === 'yearly' ? 'year' : mode === 'halfyearly' ? 'half-year' : mode === 'quarterly' ? 'quarter' : 'month'}
                              </div>
                            </div>
                            <div className="text-center">
                              <div className="text-[11px] font-bold text-gray-500 mb-1">Subseq. Year</div>
                              <div className="font-display font-bold text-[22px] text-gold">₹ {Math.round(currentModePrem.instalment2).toLocaleString('en-IN')}</div>
                              <div className="text-[10px] text-gray-500 mt-0.5">
                                per {mode === 'yearly' ? 'year' : mode === 'halfyearly' ? 'half-year' : mode === 'quarterly' ? 'quarter' : 'month'}
                              </div>
                            </div>
                          </div>
                          {/* Mode toggle on results */}
                          <div className="grid grid-cols-4 gap-1.5 pt-3 border-t border-gray-50">
                            {(['yearly','halfyearly','quarterly','monthly'] as const).map(m => (
                              <button key={m} onClick={() => setMode(m)}
                                className={`text-[11px] font-bold py-2 rounded-lg border transition-all
                                  ${mode === m ? 'bg-navy text-white border-navy' : 'bg-gray-50 text-gray-500 border-gray-100 hover:border-navy/20'}`}>
                                {MODE_LABEL[m]}
                              </button>
                            ))}
                          </div>
                          {/* Per day — based on yearly equivalent */}
                          {allModesPrem && (
                            <div className="mt-3 text-center text-[11px] text-gray-500">
                              {MODE_LABEL[mode]} Mode · Avg. Premium/Day ≈{' '}
                              <span className="font-bold text-navy">
                                ₹{Math.round((allModesPrem.find(r => r.mode === 'yearly')?.prem?.yearlyYear1 ?? premResult.yearlyYear1) / 365)}
                              </span>
                            </div>
                          )}
                        </div>
                      )
                    })()}

                    {/* ── LOCKED SECTION ── */}
                    <div className="relative">
                      {!isUnlocked && (
                        <div className="absolute inset-0 z-20 rounded-2xl overflow-hidden">
                          <div className="absolute inset-0 backdrop-blur-sm bg-white/60" />
                          <div className="absolute inset-0 flex items-center justify-center p-4">
                            <div className="bg-white rounded-2xl shadow-2xl border border-gold/20 w-full max-w-sm p-6 text-center">
                              <div className="text-[36px] mb-2">🔓</div>
                              <div className="font-display font-bold text-[18px] text-navy mb-1">
                                {clientName ? `${salutation} ${clientName}, your full report is ready!` : 'Your full report is ready!'}
                              </div>
                              <div className="text-[12px] text-gray-500 mb-5">
                                Enter your mobile to unlock the complete breakdown, maturity illustration, tax benefits, and year-by-year table.
                              </div>
                              <form onSubmit={handleUnlock} className="space-y-3 text-left">
                                <div className="relative">
                                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-[13px]">📱</span>
                                  <input required type="tel" placeholder="10-digit mobile number"
                                    value={unlockMobile} onChange={e => setUnlockMobile(e.target.value)}
                                    className="w-full pl-9 pr-3 py-3 border border-gray-200 rounded-xl text-[13px] bg-gray-50 focus:outline-none focus:border-gold/50 focus:bg-white transition-all" />
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                  <select required value={unlockWantTo} onChange={e => setUnlockWantTo(e.target.value)}
                                    className="px-3 py-2.5 border border-gray-200 rounded-xl text-[12px] bg-gray-50 focus:outline-none focus:border-gold/50 text-gray-600 appearance-none cursor-pointer">
                                    <option value="">I want to…</option>
                                    <option>Protect my family</option>
                                    <option>Create wealth</option>
                                    <option>Children&apos;s future</option>
                                    <option>Plan retirement</option>
                                    <option>Get health cover</option>
                                  </select>
                                  <select required value={unlockIAm} onChange={e => setUnlockIAm(e.target.value)}
                                    className="px-3 py-2.5 border border-gray-200 rounded-xl text-[12px] bg-gray-50 focus:outline-none focus:border-gold/50 text-gray-600 appearance-none cursor-pointer">
                                    <option value="">I am…</option>
                                    <option>New to LIC</option>
                                    <option>Existing holder</option>
                                    <option>An NRI</option>
                                    <option>An agent</option>
                                    <option>Employee</option>
                                    <option>Retired</option>
                                  </select>
                                </div>
                                <div className="relative">
                                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-[13px]">✉️</span>
                                  <input type="email" placeholder="Email (optional)"
                                    value={unlockEmail} onChange={e => setUnlockEmail(e.target.value)}
                                    className="w-full pl-9 pr-3 py-3 border border-gray-200 rounded-xl text-[13px] bg-gray-50 focus:outline-none focus:border-gold/50 focus:bg-white transition-all" />
                                </div>
                                <button type="submit" disabled={unlockStatus === 'sending'}
                                  className="w-full bg-gold hover:bg-gold-hover text-white font-bold py-3 rounded-xl text-[13px] flex items-center justify-center gap-2 transition-all shadow-md disabled:opacity-70">
                                  {unlockStatus === 'sending'
                                    ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    : <><ArrowRight className="w-4 h-4" /> Unlock Full Report</>}
                                </button>
                                <div className="text-[10px] text-gray-500 text-center">🔒 Your data is private and never shared.</div>
                              </form>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className={`space-y-4 ${!isUnlocked ? 'pointer-events-none select-none min-h-[480px]' : ''}`}>

                        {/* Maturity Benefit table */}
                        {!isTermPlan && matResult && matResult.maturity > 0 && (
                          <div className="bg-white rounded-2xl border border-[rgba(184,134,11,0.08)] shadow-sm overflow-hidden">
                            <div className="bg-navy px-5 py-2.5 flex justify-between items-center">
                              <span className="text-white font-bold text-[12px]">Maturity Benefit</span>
                              <span className="text-white/50 text-[10px]">(After completion of {safeterm} years)</span>
                            </div>
                            <div className="divide-y divide-gray-50 px-5">
                              <div className="flex justify-between py-2.5">
                                <span className="text-[12px] text-gray-600">Sum Assured</span>
                                <span className="text-[12px] font-semibold text-gray-800">{sa.toLocaleString('en-IN')}</span>
                              </div>
                              {/* Fixed: was totalSRB which doesn't exist in calculateMaturity return */}
                              {matResult.totalBonus && matResult.totalBonus > 0 && (
                                <div className="flex justify-between py-2.5">
                                  <span className="text-[12px] text-gray-600">
                                    Bonus* ({Math.round(matResult.totalBonus / safeterm / (sa / 1000))}/1000 × {safeterm})
                                  </span>
                                  <span className="text-[12px] font-semibold text-gray-800">{Math.round(matResult.totalBonus).toLocaleString('en-IN')}</span>
                                </div>
                              )}
                              {matResult.fab > 0 && (
                                <div className="flex justify-between py-2.5">
                                  <span className="text-[12px] text-gray-600">
                                    Final Addition Bonus* ({Math.round(matResult.fab / (sa / 1000))}/1000 SA)
                                  </span>
                                  <span className="text-[12px] font-semibold text-gray-800">{Math.round(matResult.fab).toLocaleString('en-IN')}</span>
                                </div>
                              )}
                              <div className="flex justify-between py-3">
                                <span className="text-[13px] font-bold text-navy">Expected Maturity Amount<br /><span className="font-normal text-[10px] text-gray-500">after {safeterm} years.</span></span>
                                <span className="text-[16px] font-bold text-navy">{Math.round(matResult.maturity).toLocaleString('en-IN')}</span>
                              </div>
                              <div className="flex justify-between py-2.5">
                                <span className="text-[12px] text-gray-500">Total Premium Paid</span>
                                <span className="text-[12px] font-semibold text-gray-700">{Math.round(premResult.totalPaid).toLocaleString('en-IN')}</span>
                              </div>
                            </div>
                            <div className="px-5 pb-3">
                              <p className="text-[10px] text-gray-500 italic">*Bonus rates and Final Addition Bonus (FAB) rates as per the latest declared rates.</p>
                            </div>
                          </div>
                        )}

                        {/* Benefit Pattern Illustration */}
                        {!isTermPlan && matResult && matResult.maturity > 0 && (
                          <div className="bg-white rounded-2xl border border-[rgba(184,134,11,0.08)] shadow-sm p-5">
                            <div className="bg-navy px-5 py-2.5 -mx-5 -mt-5 mb-5 rounded-t-2xl">
                              <span className="text-white font-bold text-[12px]">Benefit Pattern — Illustration</span>
                            </div>
                            {/* Visual timeline */}
                            <div className="relative py-6 px-4">
                              {/* Top arc — life cover label */}
                              <div className="flex justify-between items-start mb-1 px-2">
                                <div />
                                <div className="text-center text-[10px] text-blue-600 font-semibold">
                                  ☂️ You get Life Cover<br />
                                  <span className="text-[9px]">({fmtSA(sa)} to {fmt(matResult.maturity)})</span>
                                </div>
                                <div className="text-right text-[10px] text-green-600 font-semibold">
                                  You get<br/>Lump Sum<br/>
                                  <span className="font-bold text-[11px]">{fmt(matResult.maturity)}</span><br/>
                                  <span className="text-[16px]">💰</span>
                                </div>
                              </div>
                              {/* Timeline bar */}
                              <div className="relative h-3 bg-gray-100 rounded-full mx-2 my-3">
                                <div className="absolute h-full bg-gradient-to-r from-gold via-amber-400 to-green-500 rounded-full"
                                  style={{ width: `${Math.min((ppt / safeterm) * 100, 100)}%` }} />
                                {/* Start dot */}
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-green-500 border-2 border-white shadow" />
                                {/* PPT end dot */}
                                {ppt < safeterm && (
                                  <div className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-navy border-2 border-white shadow"
                                    style={{ left: `calc(${(ppt / safeterm) * 100}% - 6px)` }} />
                                )}
                                {/* End dot */}
                                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-green-500 border-2 border-white shadow" />
                              </div>
                              {/* Labels */}
                              <div className="flex justify-between text-center px-2">
                                <div>
                                  <div className="text-[11px] font-bold text-navy">Age {age}</div>
                                  <div className="text-[10px] text-gold font-semibold">₹{Math.round(premResult.yearlyYear1).toLocaleString('en-IN')}/yr 🐷</div>
                                </div>
                                {ppt < safeterm && (
                                  <div className="text-center">
                                    <div className="text-[11px] font-bold text-navy">Age {age + ppt}</div>
                                    <div className="text-[10px] text-gray-500">Premiums end</div>
                                  </div>
                                )}
                                <div>
                                  <div className="text-[11px] font-bold text-green-700">Age {age + safeterm}</div>
                                  <div className="text-[10px] text-green-600 font-semibold">{fmt(matResult.maturity)}</div>
                                </div>
                              </div>
                            </div>
                            {/* Bottom 3-cell summary */}
                            <div className="grid grid-cols-3 border border-navy/10 rounded-xl overflow-hidden mt-2">
                              {[
                                { label: 'Total\nPremium Paid', value: Math.round(premResult.totalPaid).toLocaleString('en-IN'), color: 'text-navy' },
                                { label: 'Total\nReturns',      value: Math.round(matResult.maturity).toLocaleString('en-IN'),   color: 'text-green-700' },
                                { label: `Tax Saved\n(30% Slab)`, value: tax80C ? Math.round(tax80C).toLocaleString('en-IN') : '—', color: 'text-blue-600' },
                              ].map(({ label, value }, i) => (
                                <div key={i} className={`bg-navy text-center py-3 px-2 ${i < 2 ? 'border-r border-white/10' : ''}`}>
                                  <div className="text-[9px] text-white/60 leading-tight whitespace-pre-line mb-1">{label}</div>
                                  <div className={`text-[13px] font-bold text-white`}>{value}</div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Show Full Premium Chart accordion */}
                        <div className="bg-white rounded-2xl border border-[rgba(184,134,11,0.08)] shadow-sm overflow-hidden">
                          <button onClick={() => setShowAllModes(!showAllModes)}
                            className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors">
                            <div className="flex items-center gap-2 text-navy font-bold text-[13px]">
                              <span className="text-[16px]">💳</span> Show Full Premium Chart
                            </div>
                            {showAllModes ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
                          </button>
                          {showAllModes && allModesPrem && (
                            <div className="border-t border-gray-50">
                              {/* First Year */}
                              <div className="px-5 py-2.5 bg-navy/5 text-[11px] font-bold text-navy/60 uppercase tracking-wider">
                                1st Year Premium With TAX {premResult.gstPctYear1}%
                              </div>
                              <div className="divide-y divide-gray-50">
                                {allModesPrem.map(({ mode: m, prem: p }) => (
                                  <div key={m} className="flex justify-between items-center px-5 py-2.5">
                                    <div className="flex items-center gap-2">
                                      <span className="text-[12px] font-semibold text-gray-700 w-20">
                                        {m === 'yearly' ? 'Yearly' : m === 'halfyearly' ? 'Half-Yearly' : m === 'quarterly' ? 'Quarterly' : 'Monthly (ECS)'}
                                      </span>
                                    </div>
                                    <div className="text-right">
                                      <span className="text-[13px] font-bold text-navy">₹ {Math.round(
                                        m === 'yearly' ? p.yearlyYear1 :
                                        m === 'halfyearly' ? p.yearlyYear1 / 2 :
                                        m === 'quarterly' ? p.yearlyYear1 / 4 :
                                        p.yearlyYear1 / 12
                                      ).toLocaleString('en-IN')}</span>
                                    </div>
                                  </div>
                                ))}
                                <div className="flex justify-between items-center px-5 py-2.5 bg-gold/5">
                                  <span className="text-[11px] text-gray-500">YLY Mode Avg. Prem/Day</span>
                                  <span className="text-[12px] font-bold text-navy">₹ {Math.round(premResult.yearlyYear1 / 365)}</span>
                                </div>
                              </div>
                              {/* Subsequent Years */}
                              <div className="px-5 py-2.5 bg-navy/5 text-[11px] font-bold text-navy/60 uppercase tracking-wider border-t border-gray-100">
                                After 1st Year Premium With TAX {premResult.gstPctYear2}%
                              </div>
                              <div className="divide-y divide-gray-50">
                                {allModesPrem.map(({ mode: m, prem: p }) => (
                                  <div key={m} className="flex justify-between items-center px-5 py-2.5">
                                    <span className="text-[12px] font-semibold text-gray-700 w-20">
                                      {m === 'yearly' ? 'Yearly' : m === 'halfyearly' ? 'Half-Yearly' : m === 'quarterly' ? 'Quarterly' : 'Monthly (ECS)'}
                                    </span>
                                    <span className="text-[13px] font-bold text-navy">₹ {Math.round(
                                      m === 'yearly' ? p.yearlyYear2plus :
                                      m === 'halfyearly' ? p.yearlyYear2plus / 2 :
                                      m === 'quarterly' ? p.yearlyYear2plus / 4 :
                                      p.yearlyYear2plus / 12
                                    ).toLocaleString('en-IN')}</span>
                                  </div>
                                ))}
                                <div className="flex justify-between items-center px-5 py-2.5 bg-gold/5 border-t border-gray-100">
                                  <span className="text-[11px] text-gray-500">Total Approx. Paid Premium</span>
                                  <span className="text-[12px] font-bold text-navy">₹ {Math.round(premResult.totalPaid).toLocaleString('en-IN')}</span>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Tax benefits + Riders */}
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div className="bg-white rounded-2xl p-5 border border-[rgba(184,134,11,0.08)] shadow-sm">
                            <div className="flex items-center gap-2 mb-3">
                              <div className="w-7 h-7 rounded-lg bg-green-50 flex items-center justify-center">
                                <CheckCircle2 className="w-4 h-4 text-green-600" />
                              </div>
                              <div className="font-bold text-[13px] text-navy">Tax Benefits</div>
                            </div>
                            <div className="space-y-2.5">
                              <div className="flex justify-between">
                                <div>
                                  <div className="text-[12px] font-semibold text-gray-700">Section 80C Deduction</div>
                                  <div className="text-[10px] text-gray-500">Up to ₹1.5L from taxable income</div>
                                </div>
                                <div className="text-[13px] font-bold text-green-700">{tax80C ? `~${fmt(tax80C)}` : '—'}</div>
                              </div>
                              <div className="flex justify-between">
                                <div>
                                  <div className="text-[12px] font-semibold text-gray-700">Sec. 10(10D) Maturity</div>
                                  <div className="text-[10px] text-gray-500">Maturity proceeds tax-free*</div>
                                </div>
                                <div className="text-[13px] font-bold text-green-700">Tax Free</div>
                              </div>
                              <div className="text-[10px] text-gray-300">* Subject to conditions.</div>
                            </div>
                          </div>
                          <div className="bg-white rounded-2xl p-5 border border-[rgba(184,134,11,0.08)] shadow-sm">
                            <div className="flex items-center gap-2 mb-3">
                              <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center">
                                <Shield className="w-4 h-4 text-blue-600" />
                              </div>
                              <div className="font-bold text-[13px] text-navy">Available Riders</div>
                            </div>
                            {selectedPlan.riders?.length ? (
                              <div className="space-y-1.5">
                                {selectedPlan.riders.map((rId: string) => {
                                  const r = (RIDERS as Record<string, { name: string; desc: string }>)[rId]
                                  if (!r) return null
                                  return (
                                    <div key={rId} className="flex items-start gap-2">
                                      <span className="text-gold text-[12px] mt-0.5">+</span>
                                      <div>
                                        <div className="text-[11px] font-semibold text-gray-700">{r.name}</div>
                                        <div className="text-[10px] text-gray-500 leading-relaxed">{r.desc}</div>
                                      </div>
                                    </div>
                                  )
                                })}
                              </div>
                            ) : (
                              <div className="text-[12px] text-gray-500">No riders for this plan.</div>
                            )}
                          </div>
                        </div>

                        {/* Key insights */}
                        {!isTermPlan && (
                          <div className="bg-gold/5 border border-gold/15 rounded-2xl p-5">
                            <div className="flex items-center gap-2 mb-3">
                              <Star className="w-4 h-4 text-gold" />
                              <div className="font-bold text-[13px] text-gold">Key Insights</div>
                            </div>
                            <div className="grid grid-cols-3 gap-3">
                              {[
                                { label: 'Expected XIRR',    value: xirr ? `~${xirr}% p.a.` : selectedPlan.xirr ?? '—' },
                                { label: 'Money Multiplier', value: multiplier ? `${multiplier}×` : '—' },
                                { label: 'Total Bonus',      value: matResult?.totalBonus ? fmt(matResult.totalBonus) : '—' },
                              ].map(({ label, value }) => (
                                <div key={label} className="bg-white rounded-xl p-3 border border-gold/10 text-center">
                                  <div className="text-[10px] text-gray-500 mb-0.5">{label}</div>
                                  <div className="font-display font-bold text-[16px] text-navy">{value}</div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Year-by-year benefit table */}
                        {benefitTable.length > 0 && (
                          <div className="bg-white rounded-2xl border border-[rgba(184,134,11,0.08)] shadow-sm overflow-hidden">
                            <button onClick={() => setShowTable(!showTable)}
                              className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors">
                              <div className="flex items-center gap-2 text-navy font-bold text-[13px]">
                                <TrendingUp className="w-4 h-4 text-gold" />
                                Show Full Premium Chart (Year-wise)
                                <span className="text-[10px] text-gray-500 font-normal">({benefitTable.length} years)</span>
                              </div>
                              {showTable ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
                            </button>
                            {showTable && (
                              <>
                                <div className="overflow-x-auto">
                                  <table className="w-full">
                                    <thead>
                                      <tr className="bg-navy text-white text-[10px]">
                                        {['Year','Age','Premium','Cum. Paid','SA','Annual Bonus','Cum. Bonus','Death Benefit','Surrender Val.','Survival / Maturity'].map(h => (
                                          <th key={h} className="px-3 py-2.5 text-left font-bold whitespace-nowrap">{h}</th>
                                        ))}
                                      </tr>
                                    </thead>
                                    <tbody className="text-[11px]">
                                      {visibleRows.map((row: BenefitRow, i: number) => (
                                        <tr key={row.year}
                                          className={`${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/60'}
                                            ${row.maturityPayout ? 'bg-green-50' : ''}
                                            ${row.survivalPayout ? 'bg-amber-50/60' : ''}`}>
                                          <td className="px-3 py-2 font-bold text-gold">{row.year}</td>
                                          <td className="px-3 py-2 text-gray-500">{row.age}</td>
                                          <td className="px-3 py-2">{row.premiumPaid ? fmt(row.premiumPaid) : '—'}</td>
                                          <td className="px-3 py-2 font-semibold">{fmt(row.cumPremiumPaid)}</td>
                                          <td className="px-3 py-2">{fmtSA(sa)}</td>
                                          <td className="px-3 py-2 text-blue-600">{row.annualBonus ? fmt(row.annualBonus) : '—'}</td>
                                          <td className="px-3 py-2 text-blue-700 font-semibold">{row.cumBonus ? fmt(row.cumBonus) : '—'}</td>
                                          <td className="px-3 py-2 font-bold text-red-600">{fmt(row.deathBenefit)}</td>
                                          <td className="px-3 py-2 text-amber-600">{row.gsv ? fmt(row.gsv) : '—'}</td>
                                          <td className="px-3 py-2 font-bold text-green-700">
                                            {row.maturityPayout ? `🎉 ${fmt(row.maturityPayout)}` : row.survivalPayout ? `💰 ${fmt(row.survivalPayout)}` : '—'}
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                                {benefitTable.length > 10 && (
                                  <button onClick={() => setShowAllRows(!showAllRows)}
                                    className="w-full py-2.5 text-[11px] font-bold text-gold hover:text-gold-hover border-t border-gray-50 hover:bg-gray-50 transition-colors">
                                    {showAllRows ? `Show less ↑` : `Show all ${benefitTable.length} years ↓`}
                                  </button>
                                )}
                              </>
                            )}
                          </div>
                        )}

                        {/* CTAs */}
                        <div className="flex flex-col sm:flex-row gap-3">
                          {selectedPlan.status === 'withdrawn' ? (
                            <div className="flex-1 bg-slate-100 border border-slate-200 text-slate-500 font-semibold py-3.5 rounded-xl flex items-center justify-center gap-2 text-[13px]">
                              <Info className="w-4 h-4" /> Plan discontinued — for legacy policy calc only
                            </div>
                          ) : (
                            <button
                              onClick={() => openLeadPopup(`Premium quote: LIC's ${selectedPlan.name} (Plan ${selectedPlan.planNo}), ${fmtSA(sa)} SA, Age ${age}`)}
                              className="flex-1 bg-gold hover:bg-gold-hover text-white font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-md text-[13px]">
                              Get Exact Quote from Ajay Sir <ArrowRight className="w-4 h-4" />
                            </button>
                          )}
                          <button onClick={whatsappShare}
                            className="sm:w-auto bg-green-500 hover:bg-green-600 text-white font-bold py-3.5 px-6 rounded-xl transition-all flex items-center justify-center gap-2 text-[13px]">
                            <Share2 className="w-4 h-4" /> Share
                          </button>
                        </div>

                      </div>{/* end blurred content */}
                    </div>{/* end locked section */}
                  </div>
                )}
    </>
  )
}
