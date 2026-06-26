'use client'
import React, { useState, useEffect } from 'react'
import { getSession } from '@/lib/calculator-session'
import { useLang } from '@/lib/LangContext'
import { ADVISOR_PHONE } from '@/lib/constants'
import { 
  Shield, 
  TrendingUp, 
  Umbrella, 
  Sunset, 
  Scale, 
  HandCoins, 
  HeartPulse, 
  ChevronDown, 
  ChevronUp,
  LayoutDashboard
} from 'lucide-react'

// Map calculator IDs to Lucide Icons
const ICON_MAP = {
  premium: Shield,
  maturity: TrendingUp,
  coverage: Umbrella,
  retirement: Sunset,
  surrender: Scale,
  loan: HandCoins,
  healthScore: HeartPulse,
}

export default function SessionSummary() {
  const { lang } = useLang()
  const [isOpen, setIsOpen] = useState(false)
  const [sessionData, setSessionData] = useState<ReturnType<typeof getSession> | null>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const s = getSession()
      setSessionData(s)
      // Check if we already showed it once this pageload/session
      const hasSeen = sessionStorage.getItem('pw-session-summary-seen')
      if (!hasSeen && s.calculatorsUsed.length >= 2) {
        setIsOpen(true)
        sessionStorage.setItem('pw-session-summary-seen', '1')
      }
    }
  }, [])

  if (!sessionData || sessionData.calculatorsUsed.length < 2) return null

  const { results } = sessionData

  // Prepare list of rows dynamically
  const rows = []

  if (results.premium) {
    rows.push({
      id: 'premium',
      label: lang === 'hi' ? 'प्रीमियम' : 'Premium',
      icon: Shield,
      value: `₹${Math.round(results.premium.amount).toLocaleString('en-IN')}/${results.premium.frequency === 'yearly' ? (lang === 'hi' ? 'वर्ष' : 'yr') : (lang === 'hi' ? 'माह' : 'mo')}`,
      detail: results.premium.plan
    })
  }
  if (results.maturity) {
    rows.push({
      id: 'maturity',
      label: lang === 'hi' ? 'मैच्योरिटी' : 'Maturity',
      icon: TrendingUp,
      value: `₹${Math.round(results.maturity.value).toLocaleString('en-IN')}`,
      detail: `${lang === 'hi' ? 'कुल भुगतान' : 'Total paid'}: ₹${Math.round(results.maturity.totalPaid).toLocaleString('en-IN')}`
    })
  }
  if (results.coverage) {
    rows.push({
      id: 'coverage',
      label: lang === 'hi' ? 'कवरेज' : 'Coverage',
      icon: Umbrella,
      value: `₹${Math.round(results.coverage.need).toLocaleString('en-IN')}`,
      detail: `${lang === 'hi' ? 'कमी' : 'Gap'}: ₹${Math.round(results.coverage.gap).toLocaleString('en-IN')}`
    })
  }
  if (results.retirement) {
    rows.push({
      id: 'retirement',
      label: lang === 'hi' ? 'सेवानिवृत्ति' : 'Retirement',
      icon: Sunset,
      value: `SIP: ₹${Math.round(results.retirement.monthlySip).toLocaleString('en-IN')}/${lang === 'hi' ? 'माह' : 'mo'}`,
      detail: `${lang === 'hi' ? 'कोष' : 'Corpus'}: ₹${Math.round(results.retirement.corpus).toLocaleString('en-IN')}`
    })
  }
  if (results.surrender) {
    rows.push({
      id: 'surrender',
      label: lang === 'hi' ? 'सरेंडर' : 'Surrender',
      icon: Scale,
      value: `SV: ₹${Math.round(results.surrender.value).toLocaleString('en-IN')}`,
      detail: `${lang === 'hi' ? 'नुकसान' : 'Loss'}: ₹${Math.round(results.surrender.loss).toLocaleString('en-IN')}`
    })
  }
  if (results.loan) {
    rows.push({
      id: 'loan',
      label: lang === 'hi' ? 'पॉलिसी लोन' : 'Policy Loan',
      icon: HandCoins,
      value: `Loan: ₹${Math.round(results.loan.maxLoan).toLocaleString('en-IN')}`,
      detail: `SV: ₹${Math.round(results.loan.surrenderValue).toLocaleString('en-IN')}`
    })
  }
  if (results.healthScore) {
    rows.push({
      id: 'healthScore',
      label: lang === 'hi' ? 'हेल्थ स्कोर' : 'Health Score',
      icon: HeartPulse,
      value: `Score: ${results.healthScore.score}/100`,
      detail: `Grade: ${results.healthScore.grade}`
    })
  }

  const handleReviewClick = () => {
    let msg = `Namaste Ajay ji, I used your calculators:
`
    if (results.premium) {
      msg += `- Premium: ₹${Math.round(results.premium.amount).toLocaleString('en-IN')}/${results.premium.frequency === 'yearly' ? 'yr' : 'mo'} for ${results.premium.plan}
`
    }
    if (results.coverage) {
      msg += `- Coverage: I need ₹${Math.round(results.coverage.need).toLocaleString('en-IN')}, current gap: ₹${Math.round(results.coverage.gap).toLocaleString('en-IN')}
`
    }
    if (results.healthScore) {
      msg += `- Health Score: ${results.healthScore.score}/100 (${results.healthScore.grade})
`
    }
    if (results.retirement) {
      msg += `- Retirement SIP: ₹${Math.round(results.retirement.monthlySip).toLocaleString('en-IN')}/mo (Corpus: ₹${Math.round(results.retirement.corpus).toLocaleString('en-IN')})
`
    }
    if (results.maturity) {
      msg += `- Maturity: ₹${Math.round(results.maturity.value).toLocaleString('en-IN')} value on ₹${Math.round(results.maturity.totalPaid).toLocaleString('en-IN')} paid
`
    }
    if (results.surrender) {
      msg += `- Surrender: Value ₹${Math.round(results.surrender.value).toLocaleString('en-IN')} (Loss: ₹${Math.round(results.surrender.loss).toLocaleString('en-IN')})
`
    }
    if (results.loan) {
      msg += `- Policy Loan: limit ₹${Math.round(results.loan.maxLoan).toLocaleString('en-IN')}
`
    }
    msg += `Please help me with a complete plan.`

    const waUrl = `https://wa.me/91${ADVISOR_PHONE}?text=${encodeURIComponent(msg)}`
    window.open(waUrl, '_blank')
  }

  return (
    <div className="bg-gray-50 rounded-xl border border-gray-200/60 overflow-hidden shadow-sm animate-fadeIn">
      {/* Header bar */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center px-4 py-3 bg-gray-100/50 hover:bg-gray-100 transition-colors text-left cursor-pointer"
      >
        <div className="flex items-center gap-2 text-sm font-semibold text-gray-800">
          <LayoutDashboard className="w-4 h-4 text-blue-600" />
          <span>
            {lang === 'hi' ? 'आपकी गणनाओं का सारांश' : 'Your calculations so far:'}
          </span>
          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full font-medium">
            {rows.length}
          </span>
        </div>
        <div className="text-gray-500">
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {/* Rows Container */}
      {isOpen && (
        <div className="p-4 space-y-3.5 border-t border-gray-200/50 animate-fadeIn bg-white">
          <div className="divide-y divide-gray-100 max-h-[300px] overflow-y-auto scrollbar-none pr-1">
            {rows.map((row, idx) => {
              const Icon = row.icon
              return (
                <div key={row.id} className={`flex items-center justify-between py-2.5 ${idx > 0 ? 'border-t border-gray-100' : ''}`}>
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">{row.label}</div>
                      <div className="text-[11px] text-gray-500">{row.detail}</div>
                    </div>
                  </div>
                  <div className="text-sm font-semibold text-gray-900">
                    {row.value}
                  </div>
                </div>
              )
            })}
          </div>

          <button
            onClick={handleReviewClick}
            className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl transition-colors mt-2 shadow-sm flex items-center justify-center cursor-pointer active:scale-[0.99] transform"
          >
            {lang === 'hi' ? 'अजय जी से पूर्ण समीक्षा प्राप्त करें →' : 'Get complete review from Ajay ji →'}
          </button>
        </div>
      )}
    </div>
  )
}
