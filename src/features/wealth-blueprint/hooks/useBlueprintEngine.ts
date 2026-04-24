'use client'
import { useState, useRef, useEffect } from 'react'
import { trackEvent } from '@/lib/analytics'
import type { WealthProfile, Employment, CityTier, Goal } from '../types/blueprint.types'
import {
  calcBlueprint,
  buildNarrative,
  getProtectionPlan,
  getSIPAllocations,
  get90DayPlan
} from '../domain/blueprintEngine'

export function useBlueprintEngine() {
  const [step, setStep] = useState(0)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [saveError, setSaveError] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const trackedResult = useRef(false)

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
      trackEvent('blueprint_lead_submitted', {
        score: bp.score,
        gap_lakhs: Math.round(bp.gapL),
        hlv_lakhs: Math.round(bp.hlvL),
      })
    } catch {
      setSaveError('Could not save. Please try again.')
      trackEvent('blueprint_lead_failed', { error_type: 'network' })
    }
    finally { setSaving(false) }
  }

  useEffect(() => {
    if (step === 4 && !trackedResult.current) {
      trackedResult.current = true
      trackEvent('blueprint_completed', {
        score: bp.score,
        gap_lakhs: Math.round(bp.gapL),
        hlv_lakhs: Math.round(bp.hlvL),
        is_hni: isHNI,
      })
    }
  }, [step, bp.score, bp.gapL, bp.hlvL, isHNI])

  return {
    state: {
      step, saving, saved, saveError, name, phone,
      age, monthlyIncome, employment, cityTier, isMarried, spouseIncomeL,
      children, childAges, hasAgedParents, existingLifeCoverL, existingHealthL,
      homeLoanL, otherLoansL, equityL, debtSavingsL, realEstateL, retirementAge, goals,
      incomeLabel
    },
    actions: {
      setStep, setSaved, setName, setPhone, setAge, setMI, setEmploy, setCity, setMarried,
      setChildren, setChildAge, setParents, setLifeCover, setHealth, setHomeLoan,
      setOtherLoans, setEquity, setDebt, setRE, setRetAge, toggleGoal, saveBlueprint
    },
    computed: {
      profile, bp, narrative, protectionPlan, isHNI, sipAllocs, plan90
    }
  }
}
