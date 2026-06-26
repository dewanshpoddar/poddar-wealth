'use client'
import React from 'react'
import Link from 'next/link'
import {
  Calculator,
  TrendingUp,
  ShieldAlert,
  ArrowRight,
  LifeBuoy,
  Percent,
  TrendingDown,
  Activity,
  MessageCircle,
  Phone
} from 'lucide-react'

const calcs = [
  {
    name: 'Premium Calculator',
    desc: 'How much will I pay?',
    example: '₹10L cover, age 30 → ₹14,940/year',
    path: '/calculators/premium',
    icon: Calculator
  },
  {
    name: 'Maturity Calculator',
    desc: 'What will my policy be worth?',
    example: '₹5L SA, 20yr → ₹12.4L at maturity',
    path: '/calculators/maturity',
    icon: TrendingUp
  },
  {
    name: 'Coverage Calculator',
    desc: 'How much life cover do I need?',
    example: '₹50K/month income → ₹90L recommended cover',
    path: '/calculators/life-insurance',
    icon: LifeBuoy
  },
  {
    name: 'Surrender Value',
    desc: 'How much will I get if I stop?',
    example: '₹5L SA, 12yr paid → ₹1,92,000 back',
    path: '/calculators/surrender-value',
    icon: TrendingDown
  },
  {
    name: 'Retirement Planner',
    desc: 'How much do I need to save?',
    example: 'Retire at 60, ₹40K expenses → ₹18,500/month SIP',
    path: '/calculators/retirement',
    icon: Percent
  },
  {
    name: 'Loan Against Policy',
    desc: 'How much can I borrow?',
    example: '₹5L SA, 10yr paid → ₹1,55,000 loan',
    path: '/calculators/loan',
    icon: ShieldAlert
  },
  {
    name: 'Policy Health Score',
    desc: 'Is my insurance portfolio healthy?',
    example: 'Average Indian scores 58/100 — check yours',
    path: '/calculators/policy-health',
    icon: Activity
  }
]

export default function CalculatorsPage() {
  const whatsappUrl = `https://wa.me/919415313434?text=${encodeURIComponent('Namaste Ajay ji, I want to discuss choosing the best LIC plan.')}`

  return (
    <div className="bg-gray-50 min-h-screen">
      
      {/* SECTION 1: COMPACT HERO */}
      <div className="bg-[#0f1225] py-16 px-4 text-center text-white">
        <div className="max-w-3xl mx-auto space-y-3">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Free LIC Calculators</h1>
          <p className="text-gray-300 text-base md:text-lg max-w-xl mx-auto leading-relaxed">
            Premium, maturity, surrender value, retirement — answers in 30 seconds. No sign-up.
          </p>
        </div>
      </div>

      {/* SECTION 2: CALCULATOR GRID */}
      <div className="max-w-5xl mx-auto px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {calcs.map((calc, idx) => {
            const IconComponent = calc.icon
            return (
              <Link
                key={idx}
                href={calc.path}
                className="bg-white rounded-xl p-5 border border-gray-100 hover:shadow-md transition-all duration-200 flex items-start gap-4 group"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0 text-blue-500">
                  <IconComponent className="w-6 h-6" />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="text-base font-semibold text-gray-900 flex items-center gap-1">
                    <span>{calc.name}</span>
                    <ArrowRight className="w-4 h-4 text-blue-500 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200" />
                  </div>
                  <div className="text-sm text-gray-500">{calc.desc}</div>
                  <div className="text-sm text-emerald-600 font-medium pt-2 block">
                    {calc.example}
                  </div>
                  <div className="text-sm text-blue-600 font-semibold pt-1 group-hover:underline">
                    Try it →
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>

      {/* SECTION 3: WHY THESE CALCULATORS */}
      <div className="bg-white border-t border-b border-gray-100 py-16 px-4">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">Why Use Our Calculators?</h2>
          <p className="text-gray-600 text-base md:text-lg leading-relaxed">
            Most LIC agents tell you a number. We show you the math. These calculators use actual LIC premium rates and IRDAI-standard surrender value factors to give you estimates you can trust. Used by over 5,000 families across Gorakhpur and Eastern UP.
          </p>
          <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-3 text-sm text-gray-500 font-semibold">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              Actual LIC Rates
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              IRDAI-standard Formulas
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              Free, No Sign-up
            </span>
          </div>
        </div>
      </div>

      {/* SECTION 4: CTA */}
      <div className="bg-[#0f1225] py-16 px-4 text-center text-white border-t border-white/5">
        <div className="max-w-2xl mx-auto space-y-6">
          <h2 className="text-xl md:text-2xl font-semibold">Need help choosing a plan?</h2>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-colors cursor-pointer"
            >
              <MessageCircle className="w-5 h-5" />
              WhatsApp Ajay ji
            </a>
            <a
              href="tel:9415313434"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 h-12 bg-white/10 hover:bg-white/15 text-white font-semibold rounded-xl border border-white/10 transition-colors cursor-pointer"
            >
              <Phone className="w-4 h-4" />
              Call: 9415313434
            </a>
          </div>
        </div>
      </div>

    </div>
  )
}
