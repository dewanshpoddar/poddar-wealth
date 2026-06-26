'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Info, Calculator } from 'lucide-react'

import { useLang } from '@/lib/LangContext'

// Tab definitions
const TABS = [
  { id: 'premium', label: 'Premium', path: '/calculators/premium' },
  { id: 'maturity', label: 'Maturity', path: '/calculators/maturity' },
  { id: 'coverage', label: 'Coverage', path: '/calculators/life-insurance' },
  { id: 'retirement', label: 'Retirement', path: '/calculators/retirement' },
  { id: 'surrender', label: 'Surrender', path: '/calculators/surrender-value' },
  { id: 'loan', label: 'Loan', path: '/calculators/loan' },
  { id: 'health', label: 'Health Score', path: '/calculators/policy-health' },
]

// Related calculators database
const RELATED_CALCS = [
  {
    id: 'premium',
    name: 'Premium Calculator',
    nameHi: 'प्रीमियम कैलकुलेटर',
    desc: 'How much will I pay?',
    descHi: 'मुझे कितना भुगतान करना होगा?',
    example: '₹10L cover, age 30 → ₹14,940/year',
    exampleHi: '₹10L कवर, उम्र 30 → ₹14,940/वर्ष',
    path: '/calculators/premium'
  },
  {
    id: 'maturity',
    name: 'Maturity Calculator',
    nameHi: 'मैच्योरिटी कैलकुलेटर',
    desc: 'What will my policy be worth?',
    descHi: 'मैच्योरिटी पर मेरी पॉलिसी का क्या मूल्य होगा?',
    example: '₹5L SA, 20yr → ₹12.4L at maturity',
    exampleHi: '₹5L SA, 20yr → ₹12.4L मैच्योरिटी पर',
    path: '/calculators/maturity'
  },
  {
    id: 'coverage',
    name: 'Coverage Calculator',
    nameHi: 'कवरेज कैलकुलेटर',
    desc: 'How much life cover do I need?',
    descHi: 'मुझे कितने जीवन कवर की आवश्यकता है?',
    example: '₹50K/month income → ₹90L recommended cover',
    exampleHi: '₹50K/माह आय → ₹90L अनुशंसित कवर',
    path: '/calculators/life-insurance'
  },
  {
    id: 'retirement',
    name: 'Retirement Planner',
    nameHi: 'रिटायरमेंट प्लानर',
    desc: 'How much do I need to save?',
    descHi: 'मुझे कितनी बचत करने की आवश्यकता है?',
    example: 'Retire at 60, ₹40K expenses → ₹18,500/month SIP',
    exampleHi: 'उम्र 60 पर सेवानिवृत्ति, ₹40K खर्च → ₹18,500/माह SIP',
    path: '/calculators/retirement'
  },
  {
    id: 'surrender',
    name: 'Surrender Value',
    nameHi: 'सरेंडर वैल्यू',
    desc: 'How much will I get if I stop?',
    descHi: 'यदि मैं पॉलिसी बंद कर दूं तो मुझे कितना मिलेगा?',
    example: '₹5L SA, 12yr paid → ₹1,92,000 back',
    exampleHi: '₹5L SA, 12 वर्ष भुगतान → ₹1,92,000 वापस',
    path: '/calculators/surrender-value'
  },
  {
    id: 'loan',
    name: 'Loan Against Policy',
    nameHi: 'पॉलिसी पर लोन',
    desc: 'How much can I borrow?',
    descHi: 'मैं कितना उधार ले सकता हूँ?',
    example: '₹5L SA, 10yr paid → ₹1,55,000 loan',
    exampleHi: '₹5L SA, 10 वर्ष भुगतान → ₹1,55,000 लोन',
    path: '/calculators/loan'
  },
  {
    id: 'health',
    name: 'Policy Health Score',
    nameHi: 'पॉलिसी हेल्थ स्कोर',
    desc: 'Is my portfolio healthy?',
    descHi: 'क्या मेरा बीमा पोर्टफोलियो स्वस्थ है?',
    example: 'Average Indian scores 58/100 — check yours',
    exampleHi: 'औसत भारतीय का स्कोर 58/100 — अपना चेक करें',
    path: '/calculators/policy-health'
  }
]

interface FAQItem {
  question: string
  answer: string
}

interface CalculatorShellProps {
  activeTabId: string
  title: string
  infoTooltip: string
  faq: FAQItem[]
  age?: number
  sa?: number
  term?: number
  hasCalculated: boolean
  onCalculate: (e: React.FormEvent) => void
  calculateButtonText: string
  formFields: React.ReactNode
  resultPanel: React.ReactNode
  resultRef: React.RefObject<HTMLDivElement | null>
}

export default function CalculatorShell({
  activeTabId,
  title,
  infoTooltip,
  faq,
  age,
  sa,
  term,
  hasCalculated,
  onCalculate,
  calculateButtonText,
  formFields,
  resultPanel,
  resultRef
}: CalculatorShellProps) {
  const { lang } = useLang()
  const [showInfo, setShowInfo] = useState(false)

  // Tab translations
  const getTabLabel = (id: string, l: string) => {
    const labels: Record<string, Record<string, string>> = {
      premium: { en: 'Premium', hi: 'प्रीमियम' },
      maturity: { en: 'Maturity', hi: 'मैच्योरिटी' },
      coverage: { en: 'Coverage', hi: 'कवरेज' },
      retirement: { en: 'Retirement', hi: 'रिटायरमेंट' },
      surrender: { en: 'Surrender', hi: 'सरेंडर' },
      loan: { en: 'Loan', hi: 'लोन' },
      health: { en: 'Health Score', hi: 'हेल्थ स्कोर' },
    }
    return labels[id]?.[l] || labels[id]?.en || id
  }

  // Header Title translations
  const translatedTitle = lang === 'hi' ? (
    title === 'Premium Calculator' ? 'प्रीमियम कैलकुलेटर' :
    title === 'Maturity Calculator' ? 'मैच्योरिटी कैलकुलेटर' :
    title === 'Coverage Calculator' ? 'कवरेज कैलकुलेटर' :
    title === 'Retirement Planner' ? 'रिटायरमेंट प्लानर' :
    title === 'Surrender Value Calculator' ? 'सरेंडर वैल्यू कैलकुलेटर' :
    title === 'Loan Against Policy' ? 'पॉलिसी पर लोन' :
    title === 'Policy Health Score' ? 'पॉलिसी हेल्थ स्कोर' : title
  ) : title

  // Button translations
  const translatedCalcBtn = lang === 'hi' ? (
    calculateButtonText === 'Calculate Premium' ? 'प्रीमियम की गणना करें' :
    calculateButtonText === 'Calculate Maturity Amount' ? 'मैच्योरिटी राशि की गणना करें' :
    calculateButtonText === 'Calculate Coverage Needs' ? 'कवरेज आवश्यकताओं की गणना करें' :
    calculateButtonText === 'Calculate SIP Needed' ? 'आवश्यक SIP की गणना करें' :
    calculateButtonText === 'Calculate Surrender Value' ? 'सरेंडर वैल्यू की गणना करें' :
    calculateButtonText === 'Calculate Loan Limit' ? 'लोन सीमा की गणना करें' :
    calculateButtonText === 'Check Portfolio Health' ? 'पोर्टफोलियो स्वास्थ्य की जांच करें' : calculateButtonText
  ) : calculateButtonText

  // Build the state propagation query string
  const queryString = (age || sa || term)
    ? '?' + [
        age ? `age=${age}` : '',
        sa ? `sa=${sa}` : '',
        term ? `term=${term}` : ''
      ].filter(Boolean).join('&')
    : ''

  // Scroll to results on mobile after calculation
  useEffect(() => {
    if (hasCalculated && resultRef.current) {
      if (window.innerWidth < 1024) {
        resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }
  }, [hasCalculated, resultRef])

  // JSON-LD FAQ Schema
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  }

  const relatedCalcs = RELATED_CALCS.filter(item => item.id !== activeTabId).slice(0, 3)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-6">
          
          {/* ── CALCULATOR TABS ── */}
          <div>
            {/* Desktop Tabs */}
            <div className="hidden md:flex border-b border-gray-200">
              <nav className="flex space-x-2 -mb-px">
                {TABS.map((tab) => {
                  const isActive = tab.id === activeTabId
                  return (
                    <Link
                      key={tab.id}
                      href={`${tab.path}${queryString}`}
                      className={`px-4 py-3 text-sm font-medium border-b-2 transition-all duration-200 ${
                        isActive
                          ? 'text-blue-600 border-blue-600'
                          : 'text-gray-500 hover:text-gray-700 border-transparent hover:border-gray-300'
                      }`}
                    >
                      {getTabLabel(tab.id, lang)}
                    </Link>
                  )
                })}
              </nav>
            </div>

            {/* Mobile Scrollable Tabs */}
            <div className="md:hidden flex gap-2 overflow-x-auto py-2 -mx-4 px-4 scrollbar-none">
              {TABS.map((tab) => {
                const isActive = tab.id === activeTabId
                return (
                  <Link
                    key={tab.id}
                    href={`${tab.path}${queryString}`}
                    className={`flex-shrink-0 px-3.5 py-2 text-sm rounded-full transition-all duration-200 ${
                      isActive
                        ? 'bg-[#0f1225] text-white font-medium'
                        : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-400'
                    }`}
                  >
                    {getTabLabel(tab.id, lang)}
                  </Link>
                )
              })}
            </div>
          </div>

          {/* ── CALCULATOR CARD ── */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 md:p-8">
            
            {/* Compact Header */}
            <div className="flex justify-between items-center pb-4 border-b border-gray-100 mb-6 h-12">
              <h1 className="text-lg font-semibold text-gray-900">{translatedTitle}</h1>
              <button
                type="button"
                onClick={() => setShowInfo(!showInfo)}
                className="text-gray-400 hover:text-blue-600 transition-colors p-1.5 rounded-lg hover:bg-gray-50 cursor-pointer"
                aria-label="Toggle information details"
              >
                <Info className="w-5 h-5" />
              </button>
            </div>

            {/* Expandable Info Panel */}
            {showInfo && (
              <div className="mb-6 p-4 bg-blue-50 border border-blue-100 rounded-xl text-sm text-blue-800 animate-fadeIn">
                {infoTooltip}
              </div>
            )}

            {/* Two Column Form/Result Layout */}
            <div className="flex flex-col lg:flex-row gap-8 items-stretch">
              
              {/* Left Column: Form */}
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  onCalculate(e)
                }}
                className="w-full lg:w-[55%] flex flex-col justify-between space-y-6"
              >
                <div className="space-y-6">
                  {formFields}
                </div>
                
                <button
                  type="submit"
                  className="w-full h-12 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold text-base active:scale-[0.98] transition-transform shadow-sm cursor-pointer mt-6"
                >
                  {translatedCalcBtn}
                </button>
              </form>

              {/* Right Column: Result Panel */}
              <div className="w-full lg:w-[45%] flex flex-col" ref={resultRef}>
                {hasCalculated ? (
                  <div className="animate-fadeIn h-full flex flex-col justify-between">
                    {resultPanel}
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center border border-dashed border-gray-200 rounded-2xl min-h-[300px] p-8 text-center bg-gray-50/50">
                    <Calculator className="w-12 h-12 text-gray-200 mb-3" />
                    <span className="text-gray-400 font-medium text-sm">
                      {lang === 'hi' ? 'आपका परिणाम यहां दिखाई देगा' : 'Your result will appear here'}
                    </span>
                  </div>
                )}
              </div>

            </div>
          </div>

          {/* ── FAQ SECTION ── */}
          {faq && faq.length > 0 && (
            <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6">
              <h2 className="text-base font-semibold text-gray-900 mb-4">
                {lang === 'hi' ? 'अक्सर पूछे जाने वाले प्रश्न' : 'Frequently Asked Questions'}
              </h2>
              <div className="space-y-3">
                {faq.map((item, idx) => (
                  <details
                    key={idx}
                    className="group border border-gray-200 bg-white rounded-xl overflow-hidden [&_summary::-webkit-details-marker]:hidden"
                  >
                    <summary className="flex justify-between items-center px-4 py-3.5 text-sm font-medium text-gray-900 cursor-pointer select-none">
                      <span>{item.question}</span>
                      <span className="text-gray-400 group-open:rotate-180 transition-transform duration-200">
                        ▾
                      </span>
                    </summary>
                    <div className="px-4 pb-4 pt-1 text-sm text-gray-600 border-t border-gray-100 bg-gray-50/30">
                      {item.answer}
                    </div>
                  </details>
                ))}
              </div>
            </div>
          )}

          {/* ── RELATED CALCULATORS ── */}
          <div className="space-y-4">
            <h3 className="text-base font-semibold text-gray-900">
              {lang === 'hi' ? 'लोग यह भी गणना करते हैं:' : 'People also calculate:'}
            </h3>
            
            {/* Horizontal Scroll on Mobile, 3 columns on desktop */}
            <div className="flex overflow-x-auto gap-4 md:grid md:grid-cols-3 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-none pb-2">
              {relatedCalcs.map((item) => (
                <Link
                  key={item.id}
                  href={`${item.path}${queryString}`}
                  className="flex-shrink-0 w-[280px] md:w-auto bg-white rounded-xl p-5 border border-gray-100 hover:shadow-md transition-all duration-200 group"
                >
                  <div className="text-sm font-semibold text-gray-900 flex items-center gap-1.5">
                    <span>{lang === 'hi' ? item.nameHi : item.name}</span>
                    <span className="text-blue-500 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">→</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">{lang === 'hi' ? item.descHi : item.desc}</div>
                  <div className="text-xs text-emerald-600 font-medium mt-3 bg-emerald-50 rounded-lg px-2.5 py-1.5 inline-block">
                    {lang === 'hi' ? item.exampleHi : item.example}
                  </div>
                </Link>
              ))}
            </div>
          </div>

        </div>
      </div>
    </>
  )
}
