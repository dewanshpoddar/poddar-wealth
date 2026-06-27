'use client'
import React from 'react'
import Link from 'next/link'
import { 
  Shield, 
  TrendingUp, 
  Umbrella, 
  Sunset, 
  Scale, 
  HandCoins, 
  HeartPulse 
} from 'lucide-react'
import { useLang } from '@/lib/LangContext'

const RELATED_CALCS = [
  {
    id: 'premium',
    name: 'Premium Calculator',
    nameHi: 'प्रीमियम कैलकुलेटर',
    desc: 'How much will I pay?',
    descHi: 'मुझे कितना भुगतान करना होगा?',
    example: '₹10L cover, age 30 → ₹14,940/year',
    exampleHi: '₹10L कवर, उम्र 30 → ₹14,940/वर्ष',
    path: '/calculators/premium',
    icon: Shield
  },
  {
    id: 'maturity',
    name: 'Maturity Calculator',
    nameHi: 'मैच्योरिटी कैलकुलेटर',
    desc: 'What will my policy be worth?',
    descHi: 'मैच्योरिटी पर मेरी पॉलिसी का क्या मूल्य होगा?',
    example: '₹5L SA, 20yr → ₹12.4L at maturity',
    exampleHi: '₹5L SA, 20yr → ₹12.4L मैच्योरिटी पर',
    path: '/calculators/maturity',
    icon: TrendingUp
  },
  {
    id: 'coverage',
    name: 'Coverage Calculator',
    nameHi: 'कवरेज कैलकुलेटर',
    desc: 'How much life cover do I need?',
    descHi: 'मुझे कितने जीवन कवर की आवश्यकता है?',
    example: '₹50K/month income → ₹90L recommended cover',
    exampleHi: '₹50K/माह आय → ₹90L अनुशंसित कवर',
    path: '/calculators/life-insurance',
    icon: Umbrella
  },
  {
    id: 'retirement',
    name: 'Retirement Planner',
    nameHi: 'रिटायरमेंट प्लानर',
    desc: 'How much do I need to save?',
    descHi: 'मुझे कितनी बचत करने की आवश्यकता है?',
    example: 'Retire at 60, ₹40K expenses → ₹18,500/month SIP',
    exampleHi: 'उम्र 60 पर सेवानिवृत्ति, ₹40K खर्च → ₹18,500/माह SIP',
    path: '/calculators/retirement',
    icon: Sunset
  },
  {
    id: 'surrender',
    name: 'Surrender Value',
    nameHi: 'सरेंडर वैल्यू',
    desc: 'How much will I get if I stop?',
    descHi: 'यदि मैं पॉलिसी बंद कर दूं तो मुझे कितना मिलेगा?',
    example: '₹5L SA, 12yr paid → ₹1,92,000 back',
    exampleHi: '₹5L SA, 12 वर्ष भुगतान → ₹1,92,000 वापस',
    path: '/calculators/surrender-value',
    icon: Scale
  },
  {
    id: 'loan',
    name: 'Loan Against Policy',
    nameHi: 'पॉलिसी पर लोन',
    desc: 'How much can I borrow?',
    descHi: 'मैं कितना उधार ले सकता हूँ?',
    example: '₹5L SA, 10yr paid → ₹1,55,000 loan',
    exampleHi: '₹5L SA, 10 वर्ष भुगतान → ₹1,55,000 लोन',
    path: '/calculators/loan',
    icon: HandCoins
  },
  {
    id: 'health',
    name: 'Policy Health Score',
    nameHi: 'पॉलिसी हेल्थ स्कोर',
    desc: 'Is my portfolio healthy?',
    descHi: 'क्या मेरा बीमा पोर्टफोलियो स्वस्थ है?',
    example: 'Average Indian scores 58/100 — check yours',
    exampleHi: 'औसत भारतीय का स्कोर 58/100 — अपना चेक करें',
    path: '/calculators/policy-health',
    icon: HeartPulse
  }
]

interface RelatedCalculatorsProps {
  currentTabId: string
  queryString?: string
}

export default function RelatedCalculators({ currentTabId, queryString = '' }: RelatedCalculatorsProps) {
  const { lang } = useLang()

  // Filter out the current active calculator and select exactly 3
  const list = RELATED_CALCS.filter(item => item.id !== currentTabId).slice(0, 3)

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-gray-900 tracking-tight">
        {lang === 'hi' ? 'लोग यह भी गणना करते हैं:' : 'People also calculate:'}
      </h3>
      
      {/* Mobile: Horizontal scroll snapping, Desktop: 3 columns */}
      <div className="flex overflow-x-auto gap-4 md:grid md:grid-cols-3 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-none pb-2 snap-x snap-mandatory">
        {list.map((item) => {
          const Icon = item.icon
          return (
            <Link
              key={item.id}
              href={`${item.path}${queryString}`}
              className="flex-shrink-0 w-[280px] md:w-auto bg-white rounded-2xl p-4 border border-gray-100 hover:shadow-md transition-all duration-200 group snap-start flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-amber-50 text-[#d97706] rounded-lg">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="text-xs font-semibold text-gray-900 flex items-center gap-1 group-hover:text-amber-700 transition-colors">
                    <span>{lang === 'hi' ? item.nameHi : item.name}</span>
                    <span className="text-amber-600 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">→</span>
                  </div>
                </div>
                <div className="text-[11px] text-gray-500 mt-2 leading-relaxed">
                  {lang === 'hi' ? item.descHi : item.desc}
                </div>
              </div>
              <div className="text-[10px] text-emerald-700 font-semibold mt-3 bg-emerald-50 rounded-lg px-2.5 py-1.5 inline-block w-fit">
                {lang === 'hi' ? item.exampleHi : item.example}
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
