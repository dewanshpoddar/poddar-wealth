'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Shield,
  TrendingUp,
  Umbrella,
  Sunset,
  Scale,
  HandCoins,
  HeartPulse,
  ArrowRight,
  MessageCircle,
  Phone,
  Users,
  Compass,
  CheckCircle,
  FileText
} from 'lucide-react'

import { useLang } from '@/lib/LangContext'
import { ADVISOR_PHONE } from '@/lib/constants'

const calcs = [
  {
    id: 'premium',
    name: 'Premium Calculator',
    nameHi: 'प्रीमियम कैलकुलेटर',
    desc: 'How much will I pay?',
    descHi: 'मुझे कितना भुगतान करना होगा?',
    example: '₹10L cover, age 30 → ₹14,940/year',
    exampleHi: '₹10L कवर, उम्र 30 → ₹14,940/वर्ष',
    path: '/calculators/premium',
    icon: Shield,
    isHot: true
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
    id: 'retirement',
    name: 'Retirement Planner',
    nameHi: 'रिटायरमेंट प्लानर',
    desc: 'How much do I need to save?',
    descHi: 'मुझे कितनी बचत करने की आवश्यकता है?',
    example: 'Retire at 60, ₹40K expenses → ₹18,500/month SIP',
    exampleHi: 'उम्र 60 पर सेवानिवृत्ति, ₹40K खर्च → ₹18,500/माह SIP',
    path: '/calculators/retirement',
    icon: Sunset,
    isHot: true
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
    icon: HeartPulse,
    isHot: true
  }
]

export default function CalculatorsPage() {
  const { lang } = useLang()
  const [counter, setCounter] = useState(4521)

  // Counter increments by 1-3 every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCounter(prev => prev + Math.floor(Math.random() * 3) + 1)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const msg = lang === 'hi' 
    ? 'नमस्ते अजय जी, मैं सही एलआईसी प्लान चुनने के बारे में चर्चा करना चाहता हूं।'
    : 'Namaste Ajay ji, I want to discuss choosing the best LIC plan configuration.'

  const whatsappUrl = `https://wa.me/91${ADVISOR_PHONE}?text=${encodeURIComponent(msg)}`

  return (
    <div className="bg-gray-50 min-h-screen">
      
      {/* ── SECTION 1: DARK HERO HEADER ── */}
      <header className="relative bg-gradient-to-br from-[#0f1225] via-[#141c38] to-[#0d1225] py-16 px-4 text-center text-white overflow-hidden">
        {/* Ambient drift glows */}
        <div className="absolute top-[-50px] left-[15%] w-[150px] h-[150px] rounded-full bg-amber-500/10 blur-[60px] pointer-events-none" />
        <div className="absolute bottom-[20px] right-[15%] w-[180px] h-[180px] rounded-full bg-blue-500/10 blur-[70px] pointer-events-none" />
        
        {/* Mesh grid background */}
        <div className="absolute inset-0 bg-white/[0.015] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '16px 16px' }} />

        <div className="max-w-3xl mx-auto space-y-4 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 mb-1 select-none">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
            </span>
            <span className="text-[9px] font-bold text-amber-400 tracking-widest uppercase">
              {counter.toLocaleString('en-IN')} calculations run this month
            </span>
          </div>

          <h1 className="text-3xl md:text-5xl font-semibold tracking-tight text-white leading-tight">
            Free LIC & Portfolio{' '}
            <span className="font-serif italic text-amber-400 font-bold">Calculators</span>
          </h1>
          <p className="text-white/70 text-sm md:text-base max-w-xl mx-auto leading-relaxed font-medium">
            Premium, maturity, surrender value, retirement, and portfolio health audit. Get accurate math in 30 seconds. No registration required.
          </p>
        </div>
      </header>

      {/* SVG Wave curve divider */}
      <div className="w-full overflow-hidden leading-none bg-[#0f1225] -mt-px select-none">
        <svg className="relative block w-full h-[18px]" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M0,0 C150,90 350,120 600,100 C850,80 1050,90 1200,120 L1200,120 L0,120 Z" fill="#f9fafb"></path>
        </svg>
      </div>

      {/* ── SECTION 2: CALCULATOR GRID ── */}
      <main className="max-w-5xl mx-auto px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {calcs.map((calc) => {
            const Icon = calc.icon
            return (
              <Link
                key={calc.id}
                href={calc.path}
                className="bg-white rounded-2xl p-5 border border-gray-100 hover:shadow-md hover:border-gray-200 transition-all duration-200 flex flex-col justify-between group snap-start"
              >
                <div>
                  <div className="flex justify-between items-start">
                    <div className="p-2.5 bg-amber-50 text-[#d97706] rounded-xl flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </div>
                    {calc.isHot && (
                      <span className="text-[9px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200/50 uppercase select-none">
                        Popular
                      </span>
                    )}
                  </div>

                  <div className="space-y-1 mt-4">
                    <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-1 group-hover:text-amber-700 transition-colors">
                      <span>{lang === 'hi' ? calc.nameHi : calc.name}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-amber-600 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200" />
                    </h3>
                    <p className="text-[11px] text-gray-500 leading-relaxed min-h-[32px]">
                      {lang === 'hi' ? calc.descHi : calc.desc}
                    </p>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-gray-50 flex flex-col space-y-2">
                  <div className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-1.5 rounded-lg w-fit">
                    {lang === 'hi' ? calc.exampleHi : calc.example}
                  </div>
                  <div className="text-[10px] text-gray-400 font-medium group-hover:text-[#d97706] transition-colors">
                    {lang === 'hi' ? 'खोलें कैलकुलेटर →' : 'Launch calculator →'}
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </main>

      {/* ── SECTION 3: WHY THESE CALCULATORS ── */}
      <section className="bg-white border-t border-b border-gray-100 py-16 px-4">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight">
            Why Use Our Calculators?
          </h2>
          <p className="text-gray-600 text-xs md:text-sm leading-relaxed max-w-xl mx-auto">
            Traditional LIC calculations are often opaque. We show you the math behind your premium rates, accrued reversionary bonuses, and IRDAI-standard surrender value payouts to give you estimates you can trust. Used by over 5,000 families across Gorakhpur and Eastern UP.
          </p>
          <div className="flex flex-wrap justify-center items-center gap-x-5 gap-y-2 text-[11px] text-gray-500 font-semibold select-none">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              Actual LIC Tabular Rates
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              IRDAI Surrender Metrics
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              100% Free & Secure
            </span>
          </div>
        </div>
      </section>

      {/* ── SECTION 4: CTAs ── */}
      <section className="bg-gradient-to-br from-[#0f1225] via-[#141c38] to-[#0d1225] py-16 px-4 text-center text-white border-t border-white/5 relative">
        <div className="absolute inset-0 bg-white/[0.005] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
        
        <div className="max-w-2xl mx-auto space-y-6 relative z-10">
          <h2 className="text-lg md:text-xl font-semibold tracking-tight">
            Need help choosing the right plan?
          </h2>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl transition-all duration-200 cursor-pointer active:scale-[0.98] shadow-sm"
            >
              <MessageCircle className="w-4 h-4" />
              WhatsApp Ajay ji
            </a>
            <a
              href="tel:9415313434"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 h-12 bg-white/10 hover:bg-white/15 text-white font-semibold text-xs rounded-xl border border-white/10 transition-all duration-200 cursor-pointer active:scale-[0.98]"
            >
              <Phone className="w-3.5 h-3.5 text-amber-400" />
              Call: 9415313434
            </a>
          </div>
        </div>
      </section>

    </div>
  )
}
