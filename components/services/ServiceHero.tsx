'use client'
import Image from 'next/image'
import Link from 'next/link'
import { ADVISOR_PHONE } from '@/lib/constants'
import { ShieldCheck, Award, Users } from 'lucide-react'

interface ServiceHeroProps {
  slug: string
  category: string
  h1: string
  subheadline: string
  stats: string[]
  whatsappPrefill: string
  calculatorLink: string
  calculatorLabel: string
  bgVariant?: 'light' | 'dark'
  lang: 'en' | 'hi' | 'bn'
}

export default function ServiceHero({
  slug,
  category,
  h1,
  subheadline,
  stats,
  whatsappPrefill,
  calculatorLink,
  calculatorLabel,
  bgVariant = 'light',
  lang,
}: ServiceHeroProps) {
  const isDark = bgVariant === 'dark'
  const isHi = lang === 'hi'

  const whatsappUrl = `https://wa.me/91${ADVISOR_PHONE}?text=${encodeURIComponent(whatsappPrefill)}`

  return (
    <section
      className={`relative min-h-[70vh] lg:min-h-screen flex items-center pt-24 pb-12 lg:py-0 overflow-hidden transition-colors duration-300 ${
        isDark ? 'bg-navy text-white' : 'bg-white text-navy'
      }`}
    >
      <div className="max-w-[1400px] mx-auto px-6 w-full h-full grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Left Content Column */}
        <div className="lg:col-span-7 flex flex-col justify-center z-10 animate-fade-up">
          {category && (
            <span className="text-xs md:text-sm font-bold text-gold uppercase tracking-[0.15em] mb-4">
              {category}
            </span>
          )}

          <h1
            className={`font-display font-bold text-3xl md:text-5xl lg:text-[56px] leading-[1.1] mb-5 tracking-tight ${
              isDark ? 'text-white' : 'text-navy'
            }`}
          >
            {h1}
          </h1>

          <p
            className={`text-15 md:text-18 max-w-xl leading-relaxed mb-8 ${
              isDark ? 'text-gray-300' : 'text-slate-600'
            }`}
          >
            {subheadline}
          </p>

          {/* Stats Strip */}
          {stats && stats.length > 0 && (
            <div
              className={`flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 py-4 px-6 rounded-2xl mb-8 border w-fit ${
                isDark
                  ? 'bg-navy-light/40 border-navy-border text-white'
                  : 'bg-warm/50 border-gray-150 text-navy'
              }`}
            >
              {stats.map((stat, idx) => (
                <div key={idx} className="flex items-center">
                  <span className="text-14 md:text-15 font-bold tracking-tight">{stat}</span>
                  {idx < stats.length - 1 && (
                    <span className="hidden sm:inline-block h-4 w-px bg-current/25 ml-6" />
                  )}
                </div>
              ))}
            </div>
          )}

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-gold hover:bg-gold-hover text-white font-bold px-8 py-4 rounded-xl transition-all duration-300 transform hover:-translate-y-0.5 shadow-gold-sm min-h-[48px] text-15 text-center"
            >
              {isHi ? 'अजय जी से बात करें' : 'Talk to Ajay Ji'}
            </a>
            {calculatorLink && (
              <Link
                href={calculatorLink}
                className={`inline-flex items-center justify-center gap-2 border font-bold px-8 py-4 rounded-xl transition-all duration-300 transform hover:-translate-y-0.5 min-h-[48px] text-15 text-center ${
                  isDark
                    ? 'border-white/20 text-white hover:bg-white/10'
                    : 'border-navy/20 text-navy hover:bg-navy/5'
                }`}
              >
                {calculatorLabel || (isHi ? 'प्रीमियम कैलकुलेट करें' : 'Calculate Premium')}
              </Link>
            )}
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap items-center gap-y-2 gap-x-6 pt-4 border-t border-current/10">
            <div className="flex items-center gap-2 text-12 font-bold tracking-wider uppercase text-gold">
              <Award className="w-4 h-4" />
              <span>MDRT USA Member</span>
            </div>
            <span className="hidden sm:inline w-1 h-1 bg-current/30 rounded-full" />
            <div
              className={`flex items-center gap-2 text-12 font-semibold ${
                isDark ? 'text-gray-400' : 'text-slate-500'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-gold" />
              <span>IRDAI Registered</span>
            </div>
            <span className="hidden sm:inline w-1 h-1 bg-current/30 rounded-full" />
            <div
              className={`flex items-center gap-2 text-12 font-semibold ${
                isDark ? 'text-gray-400' : 'text-slate-500'
              }`}
            >
              <Users className="w-4 h-4 text-gold" />
              <span>5,000+ Families</span>
            </div>
          </div>
        </div>

        {/* Right Image Column */}
        <div className="lg:col-span-5 relative w-full h-[40vh] lg:h-full min-h-[300px] lg:min-h-[550px] rounded-3xl overflow-hidden shadow-hero">
          <Image
            src={`/images/services/${slug}.webp`}
            alt={h1}
            fill
            sizes="(max-width: 1024px) 100vw, 45vw"
            priority={true}
            fetchPriority="high"
            className="object-cover"
          />
          {/* Subtle gradient overlay to blend left edge on desktop */}
          <div
            className={`absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r ${
              isDark
                ? 'from-navy via-navy/20 to-transparent'
                : 'from-white via-white/20 to-transparent'
            } pointer-events-none`}
          />
        </div>
      </div>
    </section>
  )
}
