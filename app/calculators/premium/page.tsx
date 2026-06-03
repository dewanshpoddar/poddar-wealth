'use client'
import { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import { useLang } from '@/lib/LangContext'
import {
  Calculator, ArrowRight, ChevronDown, ChevronUp,
  Share2, CheckCircle2, Info, Search, Shield, TrendingUp, Star, RefreshCw,
  AlertTriangle, MessageCircle
} from 'lucide-react'
import { PLANS, calculatePremium, calculateMaturity, generateBenefitTable, getPPT, RIDERS } from '@/lib/lic-plans-data.js'
import { fmt, fmtSA, toWords } from '@/lib/format'
import { SA_PRESETS, MODE_LABEL, ADVISOR_PHONE } from '@/lib/constants'
import { openLeadPopup } from '@/lib/events'
import { trackEvent } from '@/lib/analytics'
import { CAT_BADGE, CAT_AVATAR_COLOR, CATEGORIES } from '@/components/calculators/calc-constants'
import PlanSearch from '@/components/calculators/PlanSearch'
import InputsPanel from '@/components/calculators/InputsPanel'
import ResultsPanel from '@/components/calculators/ResultsPanel'

import { LicPlan, PremiumResult, MaturityResult, BenefitRow, FundOption } from '@/lib/types/lic-plan'

export default function PremiumCalculatorPage() {
  const { t } = useLang()

  function shareResultWithAjay() {
    if (!selectedPlan || !premResult) return
    const msg = [
      `Hi Ajay sir, I calculated my insurance on poddarwealth.com:`,
      `Plan: LIC's ${selectedPlan.name} (Plan ${selectedPlan.planNo})`,
      `Sum Assured: ₹${sa.toLocaleString('en-IN')}`,
      `Premium: ₹${(premResult.instalment1 || premResult.yearlyYear1 || 0).toLocaleString('en-IN')}/${MODE_LABEL[mode] || mode}`,
      `Age: ${age}, Term: ${safeterm} years`,
      `Please suggest the best option for me.`
    ].join('\n')
    window.open(`https://wa.me/91${ADVISOR_PHONE}?text=${encodeURIComponent(msg)}`, '_blank')
  }
  /* plan browser */
  const [activeCat,     setActiveCat]     = useState('all')
  const [search,        setSearch]        = useState('')
  const [quickPlanNo,   setQuickPlanNo]   = useState('')
  const [quickAge,      setQuickAge]      = useState('')
  const [selectedPlan,  setSelectedPlan]  = useState<LicPlan | null>(null)

  /* client identity */
  const [clientName,  setClientName]  = useState('')
  const [salutation,  setSalutation]  = useState<'Mr.'|'Mrs.'|'Ms.'>('Mr.')

  /* calculator inputs */
  const [age,    setAge]    = useState(30)
  const [sa,     setSa]     = useState(1000000)
  const [term,   setTerm]   = useState(20)
  const [mode,   setMode]   = useState<'yearly'|'halfyearly'|'quarterly'|'monthly'>('yearly')
  const [gender, setGender] = useState<'male'|'female'>('male')
  const [smoker, setSmoker] = useState(false)

  /* results */
  const [premResult,     setPremResult]     = useState<PremiumResult | null>(null)
  const [matResult,      setMatResult]      = useState<MaturityResult | null>(null)
  const [benefitTable,   setBenefitTable]   = useState<BenefitRow[]>([])
  const [showTable,      setShowTable]      = useState(false)
  const [showAllRows,    setShowAllRows]    = useState(false)
  const [showAllModes,   setShowAllModes]   = useState(false)
  const [calcError,      setCalcError]      = useState<string | null>(null)

  /* ULIP: fund selection + live NAV */
  const [ulipFund,    setUlipFund]    = useState<string>('')
  const [navData,       setNavData]       = useState<Record<string, Record<string, { nav: number; date: string }>>>({})
  const [navLoading,    setNavLoading]    = useState(false)
  const [navRefreshing, setNavRefreshing] = useState(false)
  const [navLastUpdated, setNavLastUpdated] = useState<string | null>(null)
  const isUlip = selectedPlan?.category === 'ulip'

  /* plan-specific inputs */
  const [annuityOption,       setAnnuityOption]       = useState<string>('')
  const [purchasePrice,       setPurchasePrice]       = useState(500000)
  const [maturityAge,         setMaturityAge]         = useState(100)
  const [survivalBenefitPct,  setSurvivalBenefitPct]  = useState<5|10|15|20>(5)
  const [bimaLakshmiOption,   setBimaLakshmiOption]   = useState<'A'|'B'>('A')

  /* results slide panel */
  const [showResults, setShowResults] = useState(false)

  /* plan-type helpers */
  const isPensionAnnuity = ['758','857','862','879'].includes(String(selectedPlan?.planNo))
  const isWholeLifeUtsav = ['771','883'].includes(String(selectedPlan?.planNo))
  const isJeevanTarun    = selectedPlan?.planNo === 734
  const isBimaLakshmi    = selectedPlan?.planNo === 881

  useEffect(() => {
    if (!isUlip) return
    setNavLoading(true)
    fetch('/api/nav')
      .then(r => r.json())
      .then(d => { if (d.success) { setNavData(d.nav); setNavLastUpdated(d.scrapedAt) } })
      .catch(() => {})
      .finally(() => setNavLoading(false))
  }, [isUlip])

  async function handleRefreshNav() {
    setNavRefreshing(true)
    try {
      await fetch('/api/cron/refresh-nav')
      const d = await fetch('/api/nav').then(r => r.json())
      if (d.success) { setNavData(d.nav); setNavLastUpdated(d.scrapedAt) }
    } catch (_) {}
    setNavRefreshing(false)
  }

  useEffect(() => {
    if (isUlip && selectedPlan?.fundOptions?.length) {
      setUlipFund(selectedPlan.fundOptions[0].id)
    }
  }, [selectedPlan, isUlip])

  /* unlock / lead capture */
  const [isUnlocked,   setIsUnlocked]   = useState(false)
  const [unlockMobile, setUnlockMobile] = useState('')
  const [unlockEmail,  setUnlockEmail]  = useState('')
  const [unlockWantTo, setUnlockWantTo] = useState('')
  const [unlockIAm,    setUnlockIAm]    = useState('')
  const [unlockStatus, setUnlockStatus] = useState<'idle'|'sending'|'done'>('idle')

  /* derived */
  const filteredPlans = useMemo(() => {
    let base: LicPlan[]
    if (activeCat === 'all') {
      base = (PLANS as LicPlan[]).filter((p: LicPlan) => p.status !== 'withdrawn')
    } else if (activeCat === 'withdrawn') {
      base = (PLANS as LicPlan[]).filter((p: LicPlan) => p.status === 'withdrawn')
    } else {
      base = (PLANS as LicPlan[]).filter((p: LicPlan) => p.category === activeCat && p.status !== 'withdrawn')
    }
    if (!search.trim()) return base
    const q = search.toLowerCase()
    return base.filter((p: LicPlan) => p.name.toLowerCase().includes(q) || String(p.planNo).includes(q))
  }, [activeCat, search])

  const ppt = useMemo(() => {
    if (!selectedPlan) return term
    return getPPT(selectedPlan, term, age)
  }, [selectedPlan, term, age])

  const isTermPlan = selectedPlan?.category === 'term'

  const minTerm = selectedPlan?.minTerm ?? 10
  const maxTerm = selectedPlan?.maxTerm ?? 35
  const safeterm = Math.max(minTerm, Math.min(term, maxTerm))

  /* all modes premium for "Show Full Premium Chart" */
  const allModesPrem = useMemo(() => {
    if (!selectedPlan || !premResult) return null
    return (['yearly', 'halfyearly', 'quarterly', 'monthly'] as const).map(m => {
      const p = calculatePremium({ planNo: selectedPlan.planNo, sa, age, term: safeterm, ppt, mode: m, smoker, gender }) as PremiumResult | null
      if (!p) return null
      const perDay = m === 'yearly' ? Math.round(p.yearlyYear1 / 365) : null
      return { mode: m, prem: p, perDay }
    }).filter(Boolean) as { mode: 'yearly' | 'halfyearly' | 'quarterly' | 'monthly', prem: PremiumResult, perDay: number | null }[]
  }, [selectedPlan, premResult, sa, age, safeterm, ppt, smoker, gender])

  function handleSelectPlan(plan: LicPlan) {
    setSelectedPlan(plan)
    setShowResults(false)
    setShowTable(false)
    setShowAllRows(false)
    setIsUnlocked(false)
    setUnlockStatus('idle')
    setUlipFund('')

    // Set plan-specific defaults
    if (plan.defaultGender) setGender(plan.defaultGender)
    if (plan.bimaLakshmiOption) setBimaLakshmiOption('A')
    if (plan.annuityOptions?.length) setAnnuityOption(plan.annuityOptions[0])
    if (plan.defaultMaturityAge) setMaturityAge(plan.defaultMaturityAge)
    if (plan.minTerm && plan.minTerm < 50) setTerm(Math.max(plan.minTerm, Math.min(term, plan.maxTerm ?? 35)))

    // Restore from sessionStorage cache
    try {
      const cached = sessionStorage.getItem(`calc_${plan.planNo}`)
      if (cached) {
        const c = JSON.parse(cached)
        if (c.age)               setAge(c.age)
        if (c.sa)                setSa(c.sa)
        if (c.term)              setTerm(c.term)
        if (c.mode)              setMode(c.mode)
        if (c.gender)            setGender(c.gender)
        if (c.smoker !== undefined) setSmoker(c.smoker)
        if (c.ulipFund)          setUlipFund(c.ulipFund)
        if (c.annuityOption)     setAnnuityOption(c.annuityOption)
        if (c.purchasePrice)     setPurchasePrice(c.purchasePrice)
        if (c.maturityAge)       setMaturityAge(c.maturityAge)
        if (c.survivalBenefitPct) setSurvivalBenefitPct(c.survivalBenefitPct)
        if (c.bimaLakshmiOption) setBimaLakshmiOption(c.bimaLakshmiOption)
        if (c.clientName)        setClientName(c.clientName)
        if (c.salutation)        setSalutation(c.salutation)
        if (c.premResult) {
          setPremResult(c.premResult)
          setMatResult(c.matResult)
          setBenefitTable(c.benefitTable ?? [])
          setShowResults(true)
        } else {
          setPremResult(null)
          setMatResult(null)
          setBenefitTable([])
        }
      } else {
        setPremResult(null)
        setMatResult(null)
        setBenefitTable([])
      }
    } catch {
      setPremResult(null)
      setMatResult(null)
      setBenefitTable([])
    }
  }

  function handleQuickSelect() {
    const pno = parseInt(quickPlanNo)
    const plan = (PLANS as LicPlan[]).find((p: LicPlan) => p.planNo === pno)
    if (plan) {
      handleSelectPlan(plan)
      if (quickAge) setAge(Math.max(plan.minAge ?? 18, Math.min(parseInt(quickAge), plan.maxAge ?? 65)))
    }
  }

  function calculate() {
    if (!selectedPlan) return
    setCalcError(null)

    const effectiveSa = isPensionAnnuity ? purchasePrice : sa

    // Input validation
    if (!isPensionAnnuity && !isUlip && sa < (selectedPlan.minSA ?? 100000)) {
      setCalcError(`Minimum sum assured for this plan is ₹${(selectedPlan.minSA ?? 100000).toLocaleString('en-IN')}. Please increase the SA.`)
      return
    }
    if (age < (selectedPlan.minAge ?? 0) || age > (selectedPlan.maxAge ?? 65)) {
      setCalcError(`Entry age for this plan must be between ${selectedPlan.minAge} and ${selectedPlan.maxAge} years.`)
      return
    }

    let prem: PremiumResult | null, mat: MaturityResult | null, table: BenefitRow[]
    try {
      prem = calculatePremium({ planNo: selectedPlan.planNo, sa: effectiveSa, age, term: safeterm, ppt, mode, smoker, gender }) as PremiumResult | null
      if (!prem) {
        setCalcError('Could not calculate premium for this plan with the given inputs. Please try different age, term, or sum assured.')
        return
      }
      mat   = calculateMaturity({ planNo: selectedPlan.planNo, sa: effectiveSa, term: safeterm }) as MaturityResult | null
      table = (generateBenefitTable({ planNo: selectedPlan.planNo, sa: effectiveSa, age, term: safeterm, ppt, premResult: prem }) as BenefitRow[]) ?? []
    } catch (err) {
      setCalcError('An unexpected error occurred during calculation. Please try again or contact support.')
      console.error('Calculation error:', err)
      return
    }

    setPremResult(prem)
    setMatResult(mat)
    setBenefitTable(table)
    if (selectedPlan && prem) {
      trackEvent('plan_quote_clicked', { plan: String(selectedPlan.planNo), premium: Math.round(prem.yearlyYear1) })
    }
    setIsUnlocked(false)
    setUnlockStatus('idle')
    setShowResults(true)

    // Persist to sessionStorage
    try {
      sessionStorage.setItem(`calc_${selectedPlan.planNo}`, JSON.stringify({
        age, sa: effectiveSa, term, mode, gender, smoker, ulipFund,
        annuityOption, purchasePrice, maturityAge, survivalBenefitPct, bimaLakshmiOption,
        clientName, salutation,
        premResult: prem, matResult: mat, benefitTable: table,
      }))
    } catch { /* quota exceeded — ignore */ }

    // Track calculation to Google Sheets
    fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event: 'calc_run',
        sheetName: 'Premium Calculator',
        data: {
          planNo:       selectedPlan.planNo,
          planName:     selectedPlan.name,
          category:     selectedPlan.category,
          age,
          sa:           effectiveSa,
          term:         safeterm,
          ppt,
          mode,
          gender,
          annualPremium: prem?.yearlyYear1 ?? '',
          totalPaid:    prem?.totalPaid ?? '',
          maturityValue: mat?.maturity ?? '',
          clientName:   clientName || '',
          session:      typeof window !== 'undefined' ? (sessionStorage.getItem('sid') ?? '') : '',
        }
      })
    }).catch(() => {})
  }

  async function handleUnlock(e: React.FormEvent) {
    e.preventDefault()
    setUnlockStatus('sending')
    try {
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: clientName ? `${salutation} ${clientName}` : 'Calculator User',
          mobile: unlockMobile,
          email: unlockEmail,
          wantTo: unlockWantTo,
          iAm: unlockIAm,
          intent: `Premium calc unlock: LIC's ${selectedPlan?.name} (Plan ${selectedPlan?.planNo}), ${fmtSA(sa)} SA, Age ${age}`
        })
      })
    } catch {}
    setIsUnlocked(true)
    setUnlockStatus('done')
  }

  const xirr = useMemo(() => {
    if (!premResult || !matResult?.maturity || !safeterm) return null
    const val = ((Math.pow(matResult.maturity / premResult.totalPaid, 1 / safeterm) - 1) * 100)
    return val > 0 ? val.toFixed(1) : null
  }, [premResult, matResult, safeterm])

  const multiplier = useMemo(() => {
    if (!premResult || !matResult?.maturity) return null
    return (matResult.maturity / premResult.totalPaid).toFixed(2)
  }, [premResult, matResult])

  const tax80C = useMemo(() => {
    if (!premResult) return null
    return Math.min(premResult.netPremium, 150000) * 0.3
  }, [premResult])

  function whatsappShare() {
    if (!selectedPlan || !premResult) return
    const name = clientName ? `${salutation} ${clientName}` : 'Customer'
    const matLine = matResult?.maturity ? `Maturity Value: ${fmt(matResult.maturity)}` : 'Pure Term Plan'
    const msg = [
      `*LIC Premium Illustration — Poddar Wealth*`,
      ``,
      `For: ${name} | Age: ${age} yrs`,
      `Plan: LIC's ${selectedPlan.name} (Plan ${selectedPlan.planNo})`,
      `Sum Assured: ${fmtSA(sa)} | Term: ${safeterm} yrs | PPT: ${ppt} yrs`,
      ``,
      `*1st Year Premium (incl. GST):*`,
      `Yearly: ${fmt(premResult.yearlyYear1)}  (${fmt(Math.round(premResult.yearlyYear1/365))}/day)`,
      `Half-Yearly: ${fmt(premResult.instalment1 * 2)}`,
      `Quarterly: ${fmt(premResult.instalment1 * 4 / (mode === 'quarterly' ? 1 : 1))}`,
      `Monthly: ${fmt(premResult.instalment1)}`,
      ``,
      `Total Paid: ${fmt(premResult.totalPaid)}`,
      matLine,
      xirr ? `Expected XIRR: ~${xirr}% p.a.` : '',
      ``,
      `Contact Ajay Kumar Poddar for official quote`,
      `https://poddarwealth.com/contact`,
    ].filter(Boolean).join('\n')
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank')

    // Track share event
    fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event: 'calc_share',
        sheetName: 'Premium Calculator',
        data: {
          planNo:    selectedPlan.planNo,
          planName:  selectedPlan.name,
          category:  selectedPlan.category,
          age, sa, term: safeterm, mode, gender,
          annualPremium: premResult.yearlyYear1 ?? '',
          totalPaid:     premResult.totalPaid ?? '',
          maturityValue: matResult?.maturity ?? '',
          clientName:    clientName || '',
          session:       sessionStorage.getItem('sid') ?? '',
        }
      })
    }).catch(() => {})
  }

  const visibleRows = showAllRows ? benefitTable : benefitTable.slice(0, 10)

  return (
    <div className="min-h-screen bg-warm pt-[78px]">

      {/* ── Hero ─────────────────────────────── */}
      <div className="bg-navy py-10 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, #f5c842 0%, transparent 60%), radial-gradient(circle at 80% 50%, #f5c842 0%, transparent 60%)' }} />
        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-gold/10 border border-gold/20 text-gold px-4 py-1.5 rounded-full text-[11px] font-bold tracking-widest uppercase mb-4">
            <Calculator className="w-3.5 h-3.5" /> LIC Premium Calculator
          </div>
          <h1 className="font-display text-[28px] md:text-[40px] font-bold text-white leading-tight mb-3">
            Calculate Your <span className="text-gold">Exact LIC Premium</span>
          </h1>
          <p className="text-white/60 text-[14px] max-w-xl mx-auto">
            34 active plans · real tabular rates · ULIP live NAV · year-by-year benefit table · WhatsApp share
          </p>
        </div>
      </div>

      {/* ── Main layout ──────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
        <div className="flex flex-col lg:flex-row gap-6">


          {/* ══ LEFT — Plan Browser ═══════════════ */}
          <div className="lg:w-[360px] lg:flex-shrink-0">
            <PlanSearch 
              quickPlanNo={quickPlanNo} setQuickPlanNo={setQuickPlanNo}
              quickAge={quickAge} setQuickAge={setQuickAge} handleQuickSelect={handleQuickSelect}
              activeCat={activeCat} setActiveCat={setActiveCat} search={search} setSearch={setSearch}
              filteredPlans={filteredPlans} selectedPlan={selectedPlan} handleSelectPlan={handleSelectPlan}
            />
          </div>

          {/* ══ RIGHT — Calculator ════════════════ */}
          <div className="flex-1 min-w-0 space-y-4">
            {/* No plan selected */}
            {!selectedPlan && (
              <div className="bg-white rounded-2xl border border-dashed border-gray-200 h-64 flex flex-col items-center justify-center text-center p-8">
                <Calculator className="w-12 h-12 text-gray-200 mb-3" />
                <div className="font-display font-bold text-gray-500 text-[17px] mb-1">Select a plan to calculate</div>
                <div className="text-[12px] text-gray-300">Choose any LIC plan from the list · or use Quick Selector above</div>
              </div>
            )}

            {selectedPlan && (
              <>
                {/* Plan banner */}
                <div className="bg-navy rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-full ${CAT_AVATAR_COLOR[selectedPlan.category] ?? 'bg-navy-light'} ring-2 ring-gold/30 flex items-center justify-center flex-shrink-0`}>
                      <span className="text-white font-bold text-[18px]">{selectedPlan.name.charAt(0)}</span>
                    </div>
                    <div>
                      <div className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded mb-1 ${CAT_BADGE[selectedPlan.category] ?? ''}`}>
                        {selectedPlan.category?.toUpperCase()}
                      </div>
                      <div className="text-white font-display font-bold text-[18px] leading-tight">
                        LIC&apos;s {selectedPlan.name}
                        <span className="text-white/40 font-sans text-[11px] ml-2 font-normal">Plan {selectedPlan.planNo}</span>
                      </div>
                      <div className="text-white/50 text-[11px] mt-0.5">
                        Entry Age: {selectedPlan.minAge}–{selectedPlan.maxAge} yrs · Min SA: {fmtSA(selectedPlan.minSA ?? 0)}
                      </div>
                    </div>
                  </div>
                  {selectedPlan.status === 'withdrawn' ? (
                    <div className="bg-slate-500/20 border border-slate-400/30 text-slate-200 text-[11px] font-bold px-3 py-1.5 rounded-full whitespace-nowrap">
                      Discontinued — Calc only
                    </div>
                  ) : selectedPlan.xirr && (
                    <div className="bg-gold/10 border border-gold/20 text-gold text-[11px] font-bold px-3 py-1.5 rounded-full whitespace-nowrap">
                      {selectedPlan.xirr} expected XIRR
                    </div>
                  )}
                </div>

                {/* ULIP Fund Selector */}
                {isUlip && selectedPlan?.fundOptions && selectedPlan.fundOptions.length > 0 && (
                  <div className="bg-white rounded-2xl shadow-sm border border-[rgba(184,134,11,0.08)] p-5">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="font-display font-bold text-[16px] text-navy">Choose Fund</h2>
                      <div className="flex items-center gap-2">
                        {navLoading && <span className="text-[11px] text-gray-500 animate-pulse">Fetching…</span>}
                        {!navLoading && navLastUpdated && (
                          <span className="text-[10px] text-gray-500">
                            Updated {new Date(navLastUpdated).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        )}
                        <button onClick={handleRefreshNav} disabled={navRefreshing}
                          title="Refresh NAV from LIC"
                          className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg border text-[11px] font-semibold transition-all
                            ${navRefreshing
                              ? 'border-gray-100 text-gray-300 cursor-not-allowed'
                              : 'border-gold/30 text-gold hover:bg-gold/5 hover:border-gold/60'}`}>
                          <RefreshCw className={`w-3 h-3 ${navRefreshing ? 'animate-spin' : ''}`} />
                          {navRefreshing ? 'Refreshing…' : 'Refresh NAV'}
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {selectedPlan.fundOptions.map((fund: FundOption) => {
                        const planNav = navData[String(selectedPlan.planNo)]
                        const fundNav = planNav?.[fund.id]
                        const isSelected = ulipFund === fund.id
                        const riskColor: Record<string,string> = {
                          'Low': 'text-blue-600 bg-blue-50',
                          'Low-Med': 'text-teal-600 bg-teal-50',
                          'Medium': 'text-amber-600 bg-amber-50',
                          'High': 'text-red-600 bg-red-50',
                        }
                        return (
                          <button key={fund.id} onClick={() => setUlipFund(fund.id)}
                            className={`text-left p-3.5 rounded-xl border-2 transition-all ${
                              isSelected ? 'border-gold bg-gold/5' : 'border-gray-100 hover:border-gold/30 bg-gray-50'
                            }`}>
                            <div className="flex items-start justify-between gap-2 mb-1.5">
                              <div className={`text-[12px] font-bold ${isSelected ? 'text-navy' : 'text-gray-700'}`}>{fund.name}</div>
                              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0 ${riskColor[fund.risk] || 'text-gray-500 bg-gray-100'}`}>
                                {fund.risk}
                              </span>
                            </div>
                            <div className="text-[10px] text-gray-500 leading-relaxed mb-2">{fund.desc}</div>
                            {fundNav ? (
                              <div className="flex items-center gap-1.5">
                                <span className="text-[13px] font-bold text-navy">₹{fundNav.nav.toFixed(2)}</span>
                                <span className="text-[10px] text-gray-500">NAV · {fundNav.date}</span>
                              </div>
                            ) : (
                              <div className="text-[11px] text-gray-300">NAV loading…</div>
                            )}
                          </button>
                        )
                      })}
                    </div>
                    <p className="text-[10px] text-gray-500 mt-3">
                      NAV updates daily after market close (~6–7 PM IST). Returns are market-linked and not guaranteed.
                      ULIP charges (allocation, mortality, fund management) apply.
                    </p>
                  </div>
                )}

                {/* ── Nav bar: always visible above form or results ── */}
                <div className="sticky top-[72px] md:top-[86px] z-30 bg-white rounded-2xl border border-gold/10 shadow-md mb-3 px-4 py-2.5 flex items-center gap-2">
                  {showResults ? (
                    <>
                      <button onClick={() => setShowResults(false)}
                        className="flex items-center gap-1.5 text-[12px] font-bold text-navy bg-gray-100 hover:bg-gold/10 border border-gray-200 hover:border-gold/30 px-3 py-1.5 rounded-lg transition-all whitespace-nowrap">
                        ← Edit Inputs
                      </button>
                      <div className="flex-1 text-center text-[11px] text-gray-500 truncate hidden sm:block">
                        LIC&apos;s {selectedPlan.name} · Age {age} · {isPensionAnnuity ? fmtSA(purchasePrice) : fmtSA(sa)}
                      </div>
                      <button onClick={calculate}
                        className="flex items-center gap-1.5 text-[12px] font-bold text-white bg-gold hover:bg-gold-hover px-3 py-1.5 rounded-lg transition-all whitespace-nowrap">
                        <RefreshCw className="w-3 h-3" /> Recalculate
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="flex-1 text-[12px] font-semibold text-navy truncate">
                        LIC&apos;s {selectedPlan.name}
                        <span className="text-gray-500 font-normal ml-1 text-[11px]">· Plan {selectedPlan.planNo}</span>
                      </div>
                      {premResult && (
                        <button onClick={() => setShowResults(true)}
                          className="flex items-center gap-1.5 text-[12px] font-bold text-white bg-navy hover:bg-navy/90 px-3 py-1.5 rounded-lg transition-all whitespace-nowrap">
                          View Results →
                        </button>
                      )}
                    </>
                  )}
                </div>

                {/* ── Error banner ── */}
                {calcError && !showResults && (
                  <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex items-start gap-3 mb-3">
                    <AlertTriangle size={16} className="text-red-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-[12px] font-bold text-red-700 mb-0.5">Calculation Error</div>
                      <div className="text-[11px] text-red-600">{calcError}</div>
                    </div>
                  </div>
                )}

                {/* ── Slide container wraps inputs + results ── */}
                <div className="relative rounded-2xl">
                  {/* Inputs panel */}

                  <div className={`${showResults ? 'hidden' : 'block'}`}>
                    <InputsPanel 
                      selectedPlan={selectedPlan} clientName={clientName} setClientName={setClientName}
                      salutation={salutation} setSalutation={setSalutation} age={age} setAge={setAge}
                      term={term} setTerm={setTerm} safeterm={safeterm} minTerm={minTerm} maxTerm={maxTerm}
                      ppt={ppt} sa={sa} setSa={setSa} isPensionAnnuity={isPensionAnnuity}
                      isWholeLifeUtsav={isWholeLifeUtsav} isJeevanTarun={isJeevanTarun} isBimaLakshmi={isBimaLakshmi}
                      isTermPlan={isTermPlan} isUlip={isUlip} purchasePrice={purchasePrice} setPurchasePrice={setPurchasePrice}
                      annuityOption={annuityOption} setAnnuityOption={setAnnuityOption} maturityAge={maturityAge}
                      setMaturityAge={setMaturityAge} survivalBenefitPct={survivalBenefitPct} setSurvivalBenefitPct={setSurvivalBenefitPct}
                      bimaLakshmiOption={bimaLakshmiOption} setBimaLakshmiOption={setBimaLakshmiOption}
                      mode={mode} setMode={setMode} gender={gender} setGender={setGender} smoker={smoker} setSmoker={setSmoker}
                      calculate={calculate}
                    />
                  </div>{/* end inputs panel */}

                  {/* Results panel — slides in from right */}
                  <div className={`transition-all duration-300 ease-in-out ${showResults ? 'block' : 'hidden'} space-y-4`}>
                    <ResultsPanel
                      selectedPlan={selectedPlan} clientName={clientName} salutation={salutation}
                      age={age} sa={sa} safeterm={safeterm} ppt={ppt} isTermPlan={isTermPlan} isUlip={isUlip}
                      premResult={premResult} matResult={matResult} tax80C={tax80C} xirr={xirr} multiplier={multiplier}
                      benefitTable={benefitTable} showTable={showTable} setShowTable={setShowTable}
                      showAllRows={showAllRows} setShowAllRows={setShowAllRows} showAllModes={showAllModes}
                      setShowAllModes={setShowAllModes} allModesPrem={allModesPrem} mode={mode} setMode={setMode}
                      isUnlocked={isUnlocked} setIsUnlocked={setIsUnlocked} unlockMobile={unlockMobile}
                      setUnlockMobile={setUnlockMobile} unlockWantTo={unlockWantTo} setUnlockWantTo={setUnlockWantTo}
                      unlockIAm={unlockIAm} setUnlockIAm={setUnlockIAm} unlockEmail={unlockEmail} setUnlockEmail={setUnlockEmail}
                      unlockStatus={unlockStatus} handleUnlock={handleUnlock} whatsappShare={whatsappShare}
                    />

                    {/* WhatsApp share with Ajay sir CTA */}
                    <div className="bg-white rounded-2xl shadow-sm border border-[rgba(184,134,11,0.08)] p-6 text-center">
                      <button
                        onClick={shareResultWithAjay}
                        className="w-full inline-flex h-14 bg-green-500 hover:bg-green-600 text-white font-bold text-[14px] md:text-[15px] rounded-xl items-center justify-center gap-2.5 transition-all shadow-lg shadow-green-500/25 hover:-translate-y-0.5 cursor-pointer"
                      >
                        <MessageCircle size={18} className="text-white" />
                        {t.calculator.shareWhatsApp}
                      </button>
                    </div>
                  </div>{/* end results panel */}
                </div>{/* end slide container */}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 pb-10">
        <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 flex items-start gap-3">
          <Info className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
          <p className="text-[11px] text-amber-700 leading-relaxed">
            <strong>Disclaimer:</strong> Calculations are illustrative based on LIC tabular rates and are not official LIC quotes.
            Bonus rates are based on 2026 declared rates and are not guaranteed for future years.
            Actual premiums depend on LIC underwriting rules and current circulars.
            {' '}<Link href="/contact" className="underline font-semibold">Contact Ajay Kumar Poddar for an official LIC quote.</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
