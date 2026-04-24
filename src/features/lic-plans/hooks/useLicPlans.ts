'use client'

import { useState, useEffect, useMemo } from 'react'
import type { LicData, Plan, Category } from '../types/lic-plans.types'
import {
  matchesAgeGroup,
  getPremiumModes,
  getSumTier,
  GOALS,
  RETURN_TYPES
} from '../domain/licPlansEngine'

export function useLicPlans() {
  const [data, setData]                       = useState<LicData | null>(null)
  const [loading, setLoading]                 = useState(true)
  const [expandedPlan, setExpandedPlan]       = useState<string | null>(null)
  const [catFilter, setCatFilter]             = useState<Set<string>>(new Set())
  const [goalFilter, setGoalFilter]           = useState<Set<string>>(new Set())
  const [ageFilter, setAgeFilter]             = useState<Set<string>>(new Set())
  const [returnsFilter, setReturnsFilter]     = useState<Set<string>>(new Set())
  const [premiumFilter, setPremiumFilter]     = useState<Set<string>>(new Set())
  const [coverFilter, setCoverFilter]         = useState<Set<string>>(new Set())
  const [searchQuery, setSearchQuery]         = useState('')
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const [showWithdrawn, setShowWithdrawn]     = useState(false)

  useEffect(() => {
    fetch('/api/lic-plans')
      .then(r => r.json())
      .then(res => { if (res.success) setData(res.data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const { activePlans, withdrawnPlans, categoryMeta } = useMemo(() => {
    if (!data) return { activePlans: [], withdrawnPlans: [], categoryMeta: {} }
    const activePlans:    (Plan & { _catKey: string })[] = []
    const withdrawnPlans: (Plan & { _catKey: string })[] = []
    const categoryMeta: Record<string, { label: Category['label']; icon: string; color: string; count: number }> = {}
    for (const [key, cat] of Object.entries(data.categories)) {
      const activeInCat = cat.plans.filter(p => p.status !== 'withdrawn')
      const wdrInCat    = cat.plans.filter(p => p.status === 'withdrawn')
      activeInCat.forEach(p => activePlans.push({ ...p, _catKey: key }))
      wdrInCat.forEach(p =>    withdrawnPlans.push({ ...p, _catKey: key }))
      if (activeInCat.length > 0)
        categoryMeta[key] = { label: cat.label, icon: cat.icon, color: cat.color, count: activeInCat.length }
    }
    return { activePlans, withdrawnPlans, categoryMeta }
  }, [data])

  const displayedPlans = useMemo(() => {
    let base = [...activePlans]

    if (catFilter.size > 0)
      base = base.filter(p => catFilter.has(p._catKey))

    if (goalFilter.size > 0) {
      const goalCats = new Set<string>()
      GOALS.filter(g => goalFilter.has(g.key)).forEach(g => g.cats.forEach(c => goalCats.add(c)))
      base = base.filter(p => goalCats.has(p._catKey))
    }

    if (ageFilter.size > 0)
      base = base.filter(p => [...ageFilter].some(ag => matchesAgeGroup(p.entryAge, ag)))

    if (returnsFilter.size > 0) {
      const rtCats = new Set<string>()
      RETURN_TYPES.filter(r => returnsFilter.has(r.key)).forEach(r => r.cats.forEach(c => rtCats.add(c)))
      base = base.filter(p => rtCats.has(p._catKey))
    }

    if (premiumFilter.size > 0)
      base = base.filter(p => getPremiumModes(p.premiumPayment).some(m => premiumFilter.has(m)))

    if (coverFilter.size > 0)
      base = base.filter(p => coverFilter.has(getSumTier(p.sumAssured)))

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      base = base.filter(p =>
        p.name.en.toLowerCase().includes(q) ||
        p.name.hi.includes(searchQuery) ||
        p.planNo.includes(q) ||
        p.keyBenefit.en.toLowerCase().includes(q)
      )
    }

    return base
  }, [catFilter, goalFilter, ageFilter, returnsFilter, premiumFilter, coverFilter, searchQuery, activePlans])

  const totalFiltersActive = catFilter.size + goalFilter.size + ageFilter.size + returnsFilter.size + premiumFilter.size + coverFilter.size + (searchQuery ? 1 : 0)
  const isShowingAll = totalFiltersActive === 0

  const clearAllFilters = () => {
    setCatFilter(new Set()); setGoalFilter(new Set()); setAgeFilter(new Set())
    setReturnsFilter(new Set()); setPremiumFilter(new Set()); setCoverFilter(new Set())
    setSearchQuery(''); setExpandedPlan(null)
  }

  const toggle = (setter: React.Dispatch<React.SetStateAction<Set<string>>>, key: string) =>
    setter(prev => { const n = new Set(prev); n.has(key) ? n.delete(key) : n.add(key); return n })

  return {
    state: {
      data, loading, expandedPlan, catFilter, goalFilter, ageFilter, returnsFilter,
      premiumFilter, coverFilter, searchQuery, mobileFiltersOpen, showWithdrawn
    },
    actions: {
      setExpandedPlan, setCatFilter, setGoalFilter, setAgeFilter, setReturnsFilter,
      setPremiumFilter, setCoverFilter, setSearchQuery, setMobileFiltersOpen, setShowWithdrawn,
      clearAllFilters, toggle
    },
    computed: {
      activePlans, withdrawnPlans, categoryMeta, displayedPlans, totalFiltersActive, isShowingAll
    }
  }
}
