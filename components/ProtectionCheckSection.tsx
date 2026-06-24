'use client'

import { useLang } from '@/lib/LangContext'
import Link from 'next/link'
import { ArrowRight, Sparkles } from 'lucide-react'

export default function ProtectionCheckSection() {
  const { t, lang } = useLang()

  const hero = t.heroV2 || {
    headline: "What Happens to Your Family If Your Income Stops Tomorrow?",
    subheadline: "Find the right life, health, and retirement cover in minutes.",
    cta_primary: "Check My Coverage",
    cta_secondary: "Ask Poddar Ji"
  }

  const badgeText = lang === 'hi' ? 'मुफ्त कवरेज चेक' : 'FREE COVERAGE CHECK'
  const cardTitle = lang === 'hi' ? 'आपका सुरक्षा स्कोर: ???' : 'Your Protection Score: ???'
  const cardSub = lang === 'hi' 
    ? 'क्या आप पर्याप्त रूप से बीमित हैं? 2 मिनट में ऑडिट करें।' 
    : 'Are you underinsured, overinsured, or just right? Check now.'
  const cardCta = lang === 'hi' ? '2-मिनट का टेस्ट लें' : 'Take the 2-minute check'

  return (
    <section className="relative bg-gray-950 text-white overflow-hidden py-16 md:py-20 border-b border-gray-900">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute right-0 top-0 w-96 h-96 bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* LEFT SIDE (60%): Headline + sub + CTAs */}
          <div className="lg:col-span-7 flex flex-col items-start text-left animate-fade-up">
            {/* Small amber badge */}
            <div className="inline-flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] font-extrabold tracking-widest uppercase px-3.5 py-1.5 rounded-full mb-6">
              <Sparkles size={11} className="animate-pulse text-amber-400" />
              {badgeText}
            </div>

            {/* Main Headline */}
            <h2 className="font-display text-3xl md:text-5xl lg:text-[44px] font-bold leading-tight tracking-tight text-white mb-6">
              {hero.headline}
            </h2>

            {/* Subtext */}
            <p className="text-gray-300 text-sm md:text-base leading-relaxed max-w-xl mb-8 font-medium">
              {hero.subheadline}
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
              <Link
                href="/calculators/policy-health"
                className="w-full sm:w-auto text-center bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs uppercase tracking-wider px-8 py-4 rounded-xl transition-all shadow-md shadow-amber-500/15 hover:shadow-amber-500/25 active:scale-[0.98]"
              >
                {hero.cta_primary}
              </Link>
              <Link
                href="/ai-advisor"
                className="w-full sm:w-auto text-center bg-transparent border border-white/20 hover:border-white/40 hover:bg-white/5 text-white font-bold text-xs uppercase tracking-wider px-8 py-4 rounded-xl transition-all active:scale-[0.98]"
              >
                {hero.cta_secondary}
              </Link>
            </div>
          </div>

          {/* RIGHT SIDE (40%): Mini Protection Score Card */}
          <div className="lg:col-span-5 w-full flex justify-center lg:justify-end animate-fade-up" style={{ animationDelay: '0.1s' }}>
            <Link
              href="/calculators/policy-health"
              className="group w-full max-w-sm bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.08] hover:border-amber-500/35 rounded-3xl p-6 md:p-8 transition-all duration-300 shadow-2xl relative overflow-hidden block cursor-pointer"
            >
              {/* Card accent glow */}
              <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-amber-500/10 rounded-full blur-2xl group-hover:bg-amber-500/15 transition-colors" />
              
              <div className="relative z-10 flex flex-col items-center text-center">
                {/* Gauge placeholder with radial look */}
                <div className="w-24 h-24 rounded-full border-4 border-dashed border-white/20 flex items-center justify-center mb-6 group-hover:border-amber-500/40 group-hover:rotate-12 transition-all duration-500">
                  <span className="text-xl font-extrabold text-white/50 group-hover:text-white transition-colors">???</span>
                </div>

                <h3 className="font-display text-lg md:text-xl font-bold text-white mb-2 group-hover:text-amber-400 transition-colors">
                  {cardTitle}
                </h3>
                <p className="text-gray-300 text-xs md:text-sm leading-relaxed mb-6 font-medium">
                  {cardSub}
                </p>
                
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 group-hover:text-amber-300 uppercase tracking-wider transition-colors">
                  {cardCta} <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                </span>
              </div>
            </Link>
          </div>

        </div>
      </div>
    </section>
  )
}
