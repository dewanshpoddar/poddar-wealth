'use client'
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { trackEvent } from '@/lib/analytics'
import { useLang } from '@/lib/LangContext'
import {
  Shield, Heart, TrendingUp, Landmark, PiggyBank, Lock, CheckCircle2,
  ArrowRight, ChevronRight, AlertTriangle, TriangleAlert, Star,
} from 'lucide-react'

import { useBlueprintEngine } from '../hooks/useBlueprintEngine'
import type { Employment, CityTier, Goal } from '../types/blueprint.types'
import { fmt } from '../domain/blueprintEngine'

// ── Bucket option sets ────────────────────────────────────────────────────────
type BucketOpt = { label: string; value: number }

// ── UI Helpers ───────────────────────────────────────────────────────────────
function crore(v: number) { return Math.abs(v) >= 1 ? `₹${v.toFixed(1)}Cr` : `₹${Math.round(v * 100)}L` }
function priorityColor(p: string) { return p === 'critical' ? '#ef4444' : p === 'high' ? '#f59e0b' : '#3b82f6' }
function priorityBg(p: string) { return p === 'critical' ? '#fef2f2' : p === 'high' ? '#fffbeb' : '#eff6ff' }
function priorityLabel(p: string) { return p === 'critical' ? 'Act Now' : p === 'high' ? 'High Priority' : 'Recommended' }
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
  const { t } = useLang()
  const { state, actions, computed } = useBlueprintEngine()
  
  // Destructure for template usage
  const { 
    step, saving, saved, saveError, name, phone, age, monthlyIncome, employment, 
    cityTier, isMarried, children, childAges, hasAgedParents, existingLifeCoverL, 
    existingHealthL, homeLoanL, otherLoansL, equityL, debtSavingsL, realEstateL, 
    retirementAge, goals, incomeLabel 
  } = state
  
  const {
    setStep, setSaved, setName, setPhone, setAge, setMI, setEmploy, setCity, setMarried,
    setChildren, setChildAge, setParents, setLifeCover, setHealth, setHomeLoan,
    setOtherLoans, setEquity, setDebt, setRE, setRetAge, toggleGoal, saveBlueprint
  } = actions
  
  const { bp, narrative, protectionPlan, isHNI, sipAllocs, plan90 } = computed

  useEffect(() => {
    if (step === 4) trackEvent('blueprint_completed')
  }, [step])

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
          <h2 className="font-display text-xl md:text-3xl font-bold text-navy leading-tight mb-2">
            Your Personal Wealth Blueprint
          </h2>
          <p className="text-13 text-gray-500 max-w-xl mx-auto leading-relaxed">
            4 questions. A financial brief at the level of a private wealth advisor — covering your protection gap, retirement reality, and a specific product-level action plan.
          </p>
        </div>

        {/* Step indicator */}
        {step < 4 && (
          <div className="flex items-center justify-center gap-1 md:gap-1.5 mb-5 md:mb-7">
            {['Identity', 'Family', 'Shield', 'Wealth'].map((s, i) => (
              <div key={i} className="flex items-center gap-1 md:gap-1.5">
                <div className={`flex items-center gap-1 px-2 py-0.5 md:px-3 md:py-1 rounded-full text-[10px] md:text-10 font-bold transition-all ${
                  i === step ? 'bg-navy text-white' : i < step ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'
                }`}>
                  {i < step ? <CheckCircle2 size={9}/> : <span>{i + 1}</span>}
                  <span className="hidden sm:inline">{s}</span>
                </div>
                {i < 3 && <div className={`w-2 md:w-4 h-px ${i < step ? 'bg-green-300' : 'bg-gray-200'}`}/>}
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
                <h3 className="text-16 font-bold text-navy mb-6">{t.blueprint.step0Title}</h3>
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <div className="flex justify-between mb-2">
                      <label className="text-11 font-semibold text-navy/75">{t.blueprint.fieldAge}</label>
                      <span className="text-13 font-bold text-gold">{age} yrs</span>
                    </div>
                    <div className="px-4 w-full">
                      <input type="range" min={20} max={58} value={age} onChange={e => setAge(+e.target.value)} className="pw-gold-range w-full"/>
                    </div>
                    <div className="flex justify-between text-9 text-gray-400 mt-0.5 px-4"><span>20</span><span>58</span></div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <label className="text-11 font-semibold text-navy/75">{t.blueprint.fieldIncome}</label>
                      <span className="text-13 font-bold text-gold">{incomeLabel}</span>
                    </div>
                    <div className="px-4 w-full">
                      <input type="range" min={15000} max={700000} step={5000} value={monthlyIncome}
                        onChange={e => setMI(+e.target.value)} className="pw-gold-range w-full"/>
                    </div>
                    <div className="flex justify-between text-9 text-gray-400 mt-0.5 px-4"><span>₹15K</span><span>₹7L+</span></div>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label className="text-11 font-semibold text-navy/75 block mb-2">{t.blueprint.fieldEarning}</label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {([['salaried', t.blueprint.employOptions[0], 'Paycheck'],['freelance', t.blueprint.employOptions[1], 'Variable'],['business', t.blueprint.employOptions[2], 'Self-employed']] as [Employment, string, string][]).map(([k,l,s]) => (
                        <button key={k} onClick={() => setEmploy(k)}
                          className={`px-2 py-2.5 rounded-xl border-2 text-left transition-all ${employment === k ? 'border-navy bg-navy text-white' : 'border-gray-200 bg-white text-navy hover:border-navy/30'}`}>
                          <div className="text-11 font-bold">{l}</div>
                          <div className={`text-9 mt-0.5 ${employment === k ? 'text-white/50' : 'text-gray-400'}`}>{s}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-11 font-semibold text-navy/75 block mb-2">{t.blueprint.fieldCity}</label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {([['metro', t.blueprint.cityOptions[0], 'Delhi/Mum/Blr'],['tier2', t.blueprint.cityOptions[1], 'Pune/Hyd/Lko'],['tier3', t.blueprint.cityOptions[2], 'Smaller city']] as [CityTier, string, string][]).map(([k,l,s]) => (
                        <button key={k} onClick={() => setCity(k)}
                          className={`px-2 py-2.5 rounded-xl border-2 text-left transition-all ${cityTier === k ? 'border-navy bg-navy text-white' : 'border-gray-200 bg-white text-navy hover:border-navy/30'}`}>
                          <div className="text-11 font-bold">{l}</div>
                          <div className={`text-9 mt-0.5 ${cityTier === k ? 'text-white/50' : 'text-gray-400'}`}>{s}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="mt-5 md:mt-7 flex justify-end">
                  <button onClick={() => { trackEvent('blueprint_step_completed', { step: 1 }); setStep(1) }}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 bg-navy text-white font-bold text-12 px-7 py-3 rounded-full hover:bg-navy/90 transition-all shadow-md">
                    Next <ArrowRight size={12}/>
                  </button>
                </div>
              </motion.div>
            )}

            {/* ── STEP 1: Family ───────────────────────────────────────── */}
            {step === 1 && (
              <motion.div key="s1" {...slide} transition={{ duration: 0.22 }}
                className="bg-[#f8f7f4] rounded-3xl p-7 md:p-9 border border-[rgba(184,134,11,0.1)]">
                <h3 className="text-16 font-bold text-navy mb-6">{t.blueprint.step1Title}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
                  <div>
                    <label className="text-11 font-semibold text-navy/75 block mb-2">{t.blueprint.fieldMarital}</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {([['true', t.blueprint.marriedSingle[0]],['false', t.blueprint.marriedSingle[1]]] as [string, string][]).map(([v,l]) => (
                        <button key={v} onClick={() => setMarried(v === 'true')}
                          className={`py-3 rounded-xl border-2 text-12 font-bold transition-all ${isMarried === (v === 'true') ? 'border-navy bg-navy text-white' : 'border-gray-200 bg-white text-navy hover:border-navy/30'}`}>
                          {l}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-11 font-semibold text-navy/75 block mb-2">{t.blueprint.fieldParents}</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {([['true', t.blueprint.yesNo[0]],['false', t.blueprint.yesNo[1]]] as [string, string][]).map(([v,l]) => (
                        <button key={v} onClick={() => setParents(v === 'true')}
                          className={`py-3 rounded-xl border-2 text-12 font-bold transition-all ${hasAgedParents === (v === 'true') ? 'border-navy bg-navy text-white' : 'border-gray-200 bg-white text-navy hover:border-navy/30'}`}>
                          {l}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="mb-5">
                  <label className="text-11 font-semibold text-navy/75 block mb-2">{t.blueprint.fieldChildren}</label>
                  <div className="grid grid-cols-5 gap-2 max-w-sm">
                    {[0,1,2,3,4].map(n => (
                      <button key={n} onClick={() => setChildren(n)}
                        className={`h-11 rounded-xl border-2 text-13 font-bold transition-all ${children === n ? 'border-navy bg-navy text-white' : 'border-gray-200 bg-white text-navy hover:border-navy/30'}`}>
                        {n}
                      </button>
                    ))}
                  </div>
                </div>
                {children > 0 && (
                  <div className="bg-white rounded-2xl p-4 border border-gray-100 mb-3">
                    <p className="text-10 font-semibold text-navy/50 uppercase tracking-wider mb-3">Child ages (for education planning)</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                      {Array.from({ length: children }).map((_, i) => (
                        <div key={i}>
                          <label className="text-9 text-gray-400 mb-1 block">Child {i + 1}</label>
                          <div className="flex items-center gap-2">
                            <div className="px-4 flex-1">
                              <input type="range" min={0} max={17} value={childAges[i] ?? 5}
                                onChange={e => setChildAge(i, +e.target.value)}
                                className="pw-gold-range w-full"/>
                            </div>
                            <span className="text-12 font-bold text-navy w-7 text-right">{childAges[i] ?? 5}y</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <div className="flex items-center justify-between gap-4 mt-5">
                  <button onClick={() => setStep(0)} className="text-12 text-navy/40 hover:text-navy transition-colors px-4 py-3">← Back</button>
                  <button onClick={() => { trackEvent('blueprint_step_completed', { step: 2 }); setStep(2) }}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 bg-navy text-white font-bold text-12 px-7 py-3 rounded-full hover:bg-navy/90 transition-all shadow-md">
                    Next <ArrowRight size={12}/>
                  </button>
                </div>
              </motion.div>
            )}

            {/* ── STEP 2: Current Shield ───────────────────────────────── */}
            {step === 2 && (
              <motion.div key="s2" {...slide} transition={{ duration: 0.22 }}
                className="bg-[#f8f7f4] rounded-3xl p-7 md:p-9 border border-[rgba(184,134,11,0.1)]">
                <h3 className="text-16 font-bold text-navy mb-1">{t.blueprint.step2Title}</h3>
                <p className="text-11 text-gray-400 mb-5">Approximate ranges are fine — this powers your gap analysis.</p>
                {ConfidentialBanner}
                <div className="space-y-5">
                  <BucketSelect label="Life Insurance Cover (total sum assured)" note="all policies combined" value={existingLifeCoverL} onChange={setLifeCover} opts={LIFE_COVER_OPTS}/>
                  <BucketSelect label="Health Insurance Cover" note="individual + family floater" value={existingHealthL} onChange={setHealth} opts={HEALTH_OPTS}/>
                  <BucketSelect label="Outstanding Home Loan" value={homeLoanL} onChange={setHomeLoan} opts={LOAN_OPTS}/>
                  <BucketSelect label="Other Outstanding Loans" note="personal, car, education" value={otherLoansL} onChange={setOtherLoans} opts={LOAN_OPTS}/>
                </div>
                <div className="flex items-center justify-between gap-4 mt-7">
                  <button onClick={() => setStep(1)} className="text-12 text-navy/40 hover:text-navy transition-colors px-4 py-3">← Back</button>
                  <button onClick={() => { trackEvent('blueprint_step_completed', { step: 3 }); setStep(3) }}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 bg-navy text-white font-bold text-12 px-7 py-3 rounded-full hover:bg-navy/90 transition-all shadow-md">
                    Next <ArrowRight size={12}/>
                  </button>
                </div>
              </motion.div>
            )}

            {/* ── STEP 3: Wealth ───────────────────────────────────────── */}
            {step === 3 && (
              <motion.div key="s3" {...slide} transition={{ duration: 0.22 }}
                className="bg-[#f8f7f4] rounded-3xl p-7 md:p-9 border border-[rgba(184,134,11,0.1)]">
                <h3 className="text-16 font-bold text-navy mb-1">{t.blueprint.step3Title}</h3>
                <p className="text-11 text-gray-400 mb-5">Used to calculate your retirement trajectory and net worth today.</p>
                {ConfidentialBanner}
                <div className="space-y-5 mb-6">
                  <BucketSelect label="Stocks + Mutual Funds (current market value)" value={equityL} onChange={setEquity} opts={EQUITY_OPTS}/>
                  <BucketSelect label="FDs + PPF + NPS + Savings (combined)" value={debtSavingsL} onChange={setDebt} opts={EQUITY_OPTS}/>
                  <BucketSelect label="Investment Real Estate" note="exclude home you live in" value={realEstateL} onChange={setRE} opts={RE_OPTS}/>
                </div>
                <div className="mb-6">
                  <label className="text-11 font-semibold text-navy/75 block mb-2">Target retirement age</label>
                  <div className="grid grid-cols-5 gap-2 max-w-md">
                    {[45,50,55,60,65].map(n => (
                      <button key={n} onClick={() => setRetAge(n)}
                        className={`py-2 rounded-xl border-2 text-12 font-bold transition-all ${retirementAge === n ? 'border-gold bg-gold/10 text-navy' : 'border-gray-200 bg-white text-navy/60 hover:border-gold/40'}`}>
                        {n}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-11 font-semibold text-navy/75 block mb-2">Financial goals <span className="font-normal text-gray-400">(select all)</span></label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
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
                <div className="flex items-center justify-between gap-4 mt-7">
                  <button onClick={() => setStep(2)} className="text-12 text-navy/40 hover:text-navy transition-colors px-4 py-3">← Back</button>
                  <button onClick={() => { trackEvent('blueprint_step_completed', { step: 4 }); setStep(4) }}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gold text-white font-bold text-12 px-8 py-3 rounded-full hover:bg-gold/90 transition-all shadow-lg">
                    {t.blueprint.generateBtn} <ArrowRight size={12}/>
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

                  {/* Profile summary — rows fade in as user completes each step */}
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
                      <span className="text-12 font-bold text-white">{cityTier === 'metro' ? 'Metro' : cityTier === 'tier2' ? 'Tier-2' : 'Tier-3'}</span>
                    </div>
                    {/* Family + Retire by — only shown after step 1 (Family step) */}
                    {step >= 1 ? (
                      <>
                        <motion.div key="fam" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.25 }}
                          className="flex justify-between items-center">
                          <span className="text-10 text-white/50">Family</span>
                          <span className="text-12 font-bold text-white">{isMarried ? 'Married' : 'Single'}{children > 0 ? `, ${children} child${children > 1 ? 'ren' : ''}` : ''}</span>
                        </motion.div>
                        <motion.div key="ret" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.25, delay: 0.05 }}
                          className="flex justify-between items-center">
                          <span className="text-10 text-white/50">Retire by</span>
                          <span className="text-12 font-bold text-white">Age {retirementAge}</span>
                        </motion.div>
                      </>
                    ) : (
                      <div className="flex justify-between items-center opacity-20">
                        <span className="text-10 text-white/50">Family · Retire by</span>
                        <span className="text-10 text-white/30 italic">Step 2 →</span>
                      </div>
                    )}
                  </div>

                  {/* Metric tile — only appears once user has entered protection data (step 2+) */}
                  {step >= 2 && (
                    <motion.div
                      key="metric-tile"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="border-t border-white/10 pt-4 mb-5"
                    >
                      <div className="text-9 font-bold tracking-[0.14em] uppercase text-white/30 mb-2">Live Calculations</div>
                      <div className="bg-white/6 rounded-xl px-3 py-3 flex items-center justify-between gap-3">
                        <div>
                          <div className="text-9 text-white/40 mb-0.5">Human Life Value</div>
                          <div className="text-18 font-bold text-gold leading-none">₹{fmt(bp.hlvL)}L</div>
                          <div className="text-9 text-white/30 mt-0.5">Economic worth to family</div>
                        </div>
                        <div className="w-px h-10 bg-white/10 self-center flex-shrink-0"/>
                        <div className="text-right">
                          <div className="text-9 text-white/40 mb-0.5">Protection Gap</div>
                          <div className={`text-18 font-bold leading-none ${bp.gapL > 0 ? 'text-red-400' : 'text-green-400'}`}>
                            {bp.gapL > 0 ? `₹${fmt(bp.gapL)}L` : '✓ Nil'}
                          </div>
                          <div className="text-9 text-white/30 mt-0.5">{bp.gapL > 0 ? `${bp.gapPct}% uncovered` : 'Fully covered'}</div>
                        </div>
                      </div>
                    </motion.div>
                  )}

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
                  <SectionLabel n="01" title={t.blueprint.section01}/>
                  <div className="bg-[#f8f7f4] rounded-2xl p-6 border border-gray-100">
                    <p className="text-15 md:text-17 font-bold text-navy leading-snug mb-5 italic">
                      &ldquo;{narrative.headline}&rdquo;
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
                  <SectionLabel n="02" title={t.blueprint.section02}/>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      {
                        icon: Shield, label: t.blueprint.riskLabels[0], status: bp.gapL > 0 ? 'exposed' : 'covered',
                        line1: bp.gapL > 0 ? `₹${fmt(bp.gapL)}L gap` : 'Fully covered',
                        line2: bp.gapL > 0 ? `Family's runway: ${bp.incYears} yr${bp.incYears !== 1 ? 's' : ''}` : `HLV fully protected`,
                        color: bp.gapL > 0 ? '#ef4444' : '#22c55e',
                      },
                      {
                        icon: Heart, label: t.blueprint.riskLabels[1], status: bp.hGapL > 0 ? 'exposed' : 'covered',
                        line1: bp.hGapL > 0 ? `₹${fmt(bp.hGapL)}L underinsured` : `₹${bp.rHL}L cover adequate`,
                        line2: `Medical inflation: 14%/yr`,
                        color: bp.hGapL > 0 ? '#f59e0b' : '#22c55e',
                      },
                      {
                        icon: TrendingUp, label: t.blueprint.riskLabels[2], status: bp.retDiffCrore < 0 ? 'exposed' : 'covered',
                        line1: bp.retDiffCrore < 0 ? `${crore(Math.abs(bp.retDiffCrore))} deficit` : `${crore(bp.retDiffCrore)} surplus`,
                        line2: `Target: ${crore(bp.retCorpusCrore)} at ${retirementAge}`,
                        color: bp.retDiffCrore < 0 ? '#f59e0b' : '#22c55e',
                      },
                      {
                        icon: Landmark, label: t.blueprint.riskLabels[3], status: bp.totalEduL > 0 ? 'planning' : 'na',
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
                            {status === 'covered' ? t.blueprint.riskStatus.covered : status === 'exposed' ? t.blueprint.riskStatus.exposed : status === 'planning' ? t.blueprint.riskStatus.planning : '—'}
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
                    <SectionLabel n="03" title={t.blueprint.section03}/>
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
                  <SectionLabel n={isHNI ? '06' : '05'} title={t.blueprint.section90Day}/>
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
                  <SectionLabel n={isHNI ? '07' : '06'} title={t.blueprint.sectionTrajectory}/>
                  <div className="bg-[#f8f7f4] rounded-2xl p-5 border border-gray-100">
                    <div className="flex flex-col sm:grid sm:grid-cols-4 gap-6 sm:gap-4">
                      {[
                        { yr: `Age ${age + 1}`,  label: 'Emergency fund complete. Insurance active.' },
                        { yr: `Age ${Math.min(age + 4, retirementAge - 8)}`, label: `₹${Math.round(bp.projectedCrore * 0.15 * 10) / 10}Cr first corpus milestone.` },
                        { yr: `Age ${Math.min(age + 12, retirementAge - 2)}`, label: `₹${Math.round(bp.projectedCrore * 0.5 * 10) / 10}Cr — halfway to retirement goal.` },
                        { yr: `Age ${retirementAge}`, label: `₹${crore(bp.projectedCrore)} projected — retire on your terms.` },
                      ].map((m, i, arr) => (
                        <div key={i} className="flex sm:flex-col items-start gap-3 sm:gap-0">
                          {/* Line & Dot */}
                          <div className="flex flex-col sm:flex-row items-center self-stretch sm:self-auto">
                            <div className="w-3 h-3 rounded-full ring-2 ring-white flex-shrink-0 z-10" style={{ background: '#c9a84c' }}/>
                            {i < arr.length - 1 && (
                              <>
                                <div className="sm:hidden w-px flex-1 bg-gold/30 my-1 min-h-[30px]"/>
                                <div className="hidden sm:block flex-1 h-px bg-gold/30 w-full min-w-[50px]"/>
                              </>
                            )}
                          </div>
                          {/* Text content */}
                          <div className="sm:mt-2 sm:pr-3">
                            <div className="text-10 sm:text-9 font-bold text-gold">{m.yr}</div>
                            <div className="text-11 sm:text-9 text-navy/55 leading-snug mt-0.5">{m.label}</div>
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
                          <span className="text-9 font-bold tracking-[0.18em] text-gold/70 uppercase">{t.blueprint.saveBadge}</span>
                        </div>
                        <h4 className="text-17 font-bold text-white mb-1">{t.blueprint.saveTitle}</h4>
                        <p className="text-12 text-white/45 mb-5 leading-relaxed max-w-lg">
                          {t.blueprint.saveBody}
                        </p>
                        <div className="grid md:grid-cols-3 gap-3">
                          <input value={name} onChange={e => setName(e.target.value)} placeholder={t.blueprint.namePlaceholder}
                            className="px-4 py-3 rounded-xl bg-white/10 border border-white/15 text-12 text-white placeholder-white/25 focus:outline-none focus:border-gold/50 transition-colors"/>
                          <input value={phone} onChange={e => setPhone(e.target.value)} placeholder={t.blueprint.phonePlaceholder} type="tel" maxLength={10}
                            className="px-4 py-3 rounded-xl bg-white/10 border border-white/15 text-12 text-white placeholder-white/25 focus:outline-none focus:border-gold/50 transition-colors"/>
                          <button disabled={saving || !name || phone.length < 10} onClick={saveBlueprint}
                            className="flex items-center justify-center gap-2 bg-gold text-white font-bold text-12 px-6 py-3 rounded-xl hover:bg-gold/90 transition-all disabled:opacity-40 shadow-lg">
                            {saving ? t.blueprint.saving : <><span>{t.blueprint.saveBtn}</span><ChevronRight size={13}/></>}
                          </button>
                        </div>
                        {saveError && <p className="text-10 text-red-400 mt-2">{saveError}</p>}
                      </>
                    ) : (
                      <div className="text-center py-4">
                        <CheckCircle2 size={30} className="text-green-400 mx-auto mb-3"/>
                        <h4 className="text-17 font-bold text-white mb-1">{t.blueprint.savedTitle}</h4>
                        <p className="text-12 text-white/45">{t.blueprint.savedBody}</p>
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
                    {t.blueprint.recalculate}
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
