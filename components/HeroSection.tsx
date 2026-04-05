'use client'
import { useState, useEffect } from 'react'
import { useLang } from '@/lib/LangContext'
import Link from 'next/link'

const quickIcons = ['🛡', '🎓', '📈', '❤️', '💍']

const heroImages = [
  '/assets/hero-family.png',
  '/assets/hero-education.png',
  '/assets/hero-retirement.png',
  '/assets/hero-health.png',
  '/assets/hero-marriage.png'
]



export default function HeroSection() {
  const { t } = useLang()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length)
    }, 4500)
    return () => clearInterval(interval)
  }, [])

  return (
    <>
      {/* ═══ HERO GRID ═══ */}
      <div className="grid lg:grid-cols-2 min-h-[640px]">

        {/* ── LEFT ── */}
        <div className="flex flex-col justify-center px-8 lg:px-[52px] py-14 lg:py-16">

          {/* Eyebrow */}
          <div className="flex items-center gap-2 text-[10px] tracking-[0.18em] text-gold font-medium uppercase mb-6 animate-fade-up">
            <span className="w-7 h-px bg-gold inline-block" />
            {t.hero.eyebrow}
          </div>

          {/* Headlines */}
          <h1 className="font-display text-[32px] md:text-[38px] lg:text-[42px] font-normal italic leading-[1.2] text-gray-900 mb-1 animate-fade-up"
              style={{ animationDelay: '0.05s' }}>
            {t.hero.headline}
          </h1>
          <div className="font-display text-[30px] md:text-[36px] lg:text-[40px] font-bold leading-[1.18] text-gold animate-fade-up"
               style={{ animationDelay: '0.1s' }}>
            {t.hero.headlineGold}
          </div>

          {/* Description */}
          <p className="text-14 text-muted leading-[1.75] mt-5 mb-8 max-w-[400px] animate-fade-up"
             style={{ animationDelay: '0.2s' }}>
            {t.hero.subtitle}
          </p>

          {/* Buttons */}
          <div className="flex flex-wrap gap-3 mb-10 animate-fade-up" style={{ animationDelay: '0.25s' }}>
            <Link href="/calculators/life-insurance"
              className="bg-gold text-white border-none py-3.5 px-7 rounded-full text-13 font-medium
                         hover:bg-gold-hover transition-all duration-200 hover:-translate-y-px">
              {t.hero.cta1}
            </Link>
            <Link href="/services/life-insurance"
              className="bg-transparent text-gray-900 border border-gray-300 py-3.5 px-7 rounded-full text-13
                         hover:border-gold hover:text-gold transition-all duration-200 hover:-translate-y-px">
              {t.hero.cta2}
            </Link>
          </div>

          {/* Trust stats Grid (2x2) */}
          <div className="grid grid-cols-2 gap-y-10 gap-x-12 pt-8 mt-6 border-t border-[rgba(184,134,11,0.18)] animate-fade-up max-w-[400px]" style={{ animationDelay: '0.35s' }}>
            {t.trust.stats.map((stat: any, i: number) => (
              <div key={i} className="flex flex-col items-start relative">
                {/* Decorative dots above */}
                <div className="flex gap-[3px] mb-3">
                  <span className="w-1 h-1 rounded-full bg-gold/40 inline-block" />
                  <span className="w-1 h-1 rounded-full bg-gold/20 inline-block" />
                </div>
                
                <div className="font-display text-[26px] lg:text-[32px] font-bold text-gray-900 leading-none mb-2 tracking-tight">
                  {stat.num}
                </div>
                <div className="text-[10px] lg:text-[11px] text-muted tracking-[0.06em] uppercase font-medium leading-tight max-w-[140px]">
                  {stat.label}
                </div>

                {/* Decorative dots below */}
                <div className="flex gap-[3px] mt-3">
                  <span className="w-1 h-1 rounded-full bg-gold/20 inline-block" />
                  <span className="w-1 h-1 rounded-full bg-gold/40 inline-block" />
                </div>

                {/* Separators */}
                {i % 2 === 0 && (
                  <div className="absolute -right-6 top-2 bottom-2 w-px bg-gradient-to-b from-transparent via-[rgba(184,134,11,0.15)] to-transparent" />
                )}
                {i < 2 && (
                  <div className="absolute -bottom-5 left-0 right-0 h-px bg-gradient-to-r from-[rgba(184,134,11,0.15)] via-[rgba(184,134,11,0.15)] to-transparent" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ── RIGHT ── */}
        <div className="relative bg-navy min-h-[380px] lg:min-h-[640px]">

          {/* Geometric circles */}
          <div className="absolute w-[320px] h-[320px] rounded-full border border-[rgba(245,200,66,0.12)]
                          top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
          <div className="absolute w-[480px] h-[480px] rounded-full border border-[rgba(245,200,66,0.06)]
                          top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

          {/* Photos (Slideshow) */}
          <div className="absolute inset-0 overflow-hidden bg-navy">
            {heroImages.map((src, idx) => (
              <img
                key={idx}
                src={src}
                alt="Happy Indian family planning their future"
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-[1500ms] ease-in-out ${idx === currentImageIndex ? 'opacity-100' : 'opacity-0'}`}
              />
            ))}
            <div className="absolute inset-0 bg-gradient-to-t from-navy/60 via-navy/5 to-transparent pointer-events-none" />
          </div>

          {/* Dot Navigation */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
            {heroImages.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentImageIndex(idx)}
                className={`transition-all duration-300 rounded-full h-1.5 ${idx === currentImageIndex ? 'w-6 bg-gold' : 'w-1.5 bg-white/40 hover:bg-white/80'}`}
                aria-label={`Slide ${idx + 1}`}
              />
            ))}
          </div>





          {/* Plan card — bottom left, overlapping into left column */}
          <div className="hidden lg:block absolute bottom-6 -left-16 w-[220px] bg-white rounded-2xl p-4
                          border border-[rgba(184,134,11,0.12)] z-20 shadow-xl animate-slide-in">
            <p className="text-[9px] tracking-[0.14em] text-muted font-medium mb-3.5 uppercase">
              {t.hero.quickTitle}
            </p>
            {t.hero.quickItems.map((item: any, i: number) => (
              <button key={i} onClick={() => setCurrentImageIndex(i)}
                className={`w-full flex items-center gap-2.5 py-[9px] px-1.5 border-b border-[rgba(184,134,11,0.1)]
                           last:border-b-0 rounded-md transition-colors duration-300 group no-underline text-left
                           ${i === currentImageIndex ? 'bg-gold/10' : 'hover:bg-gold-pale'}`}>
                <div className={`w-[30px] h-[30px] rounded-lg flex items-center justify-center text-13 flex-shrink-0 transition-colors duration-300
                                ${i === currentImageIndex ? 'bg-gold/20' : 'bg-gold-pale'}`}>
                  {quickIcons[i]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-12 font-medium text-gray-900 leading-tight">{item.title}</div>
                  <div className="text-10 text-muted mt-0.5 truncate">{item.sub}</div>
                </div>
                <span className={`text-14 text-gold transition-opacity ml-auto ${i === currentImageIndex ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>›</span>
              </button>
            ))}
            <div className="pt-3 mt-1 5 border-t border-[rgba(184,134,11,0.1)]">
              <Link href="/calculators/life-insurance" className="block w-full text-center bg-gold text-white text-12 font-medium py-3 rounded-lg hover:bg-gold-hover transition-colors shadow-sm">
                Get a free quote
              </Link>
            </div>
          </div>

          {/* "Why families trust us" chip — bottom right */}
          <div className="absolute bottom-9 right-6 bg-white/[0.07] border border-white/[0.12]
                          rounded-xl px-4 py-3 max-w-[170px] z-10 animate-fade-up"
               style={{ animationDelay: '0.55s' }}>
            <div className="text-[9px] text-[rgba(245,200,66,0.7)] tracking-[0.1em] mb-1.5 font-medium">
              WHY FAMILIES TRUST US
            </div>
            <div className="text-11 text-white/75 leading-relaxed italic font-display">
              &ldquo;31 years of showing up — not just selling.&rdquo;
            </div>
          </div>
        </div>
      </div>

      {/* Mobile-only plan card (shown below the image on small screens) */}
      <div className="lg:hidden bg-white mx-4 -mt-6 relative z-20 rounded-2xl p-5 border border-[rgba(184,134,11,0.12)] shadow-xl mb-4">
        <p className="text-[9px] tracking-[0.14em] text-muted font-medium mb-3.5 uppercase">
          {t.hero.quickTitle}
        </p>
        {t.hero.quickItems.map((item: any, i: number) => (
          <button key={i} onClick={() => setCurrentImageIndex(i)}
            className="w-full flex items-center text-left gap-2.5 py-[9px] px-1.5 border-b border-[rgba(184,134,11,0.1)]
                       last:border-b-0 rounded-md hover:bg-gold-pale transition-colors group no-underline">
            <div className={`w-[30px] h-[30px] rounded-lg flex items-center justify-center text-13 flex-shrink-0 transition-colors
                            ${i === currentImageIndex ? 'bg-gold/20' : 'bg-gold-pale'}`}>
              {quickIcons[i]}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-12 font-medium text-gray-900 leading-tight">{item.title}</div>
              <div className="text-10 text-muted mt-0.5 truncate">{item.sub}</div>
            </div>
            <span className="text-14 text-gold opacity-0 group-hover:opacity-100 transition-opacity ml-auto">›</span>
          </button>
        ))}
        <div className="pt-3 mt-1.5 border-t border-[rgba(184,134,11,0.1)]">
          <Link href="/calculators/life-insurance" className="block w-full text-center bg-gold text-white text-12 font-medium py-3 rounded-lg hover:bg-gold-hover transition-colors shadow-sm">
            Get a free quote
          </Link>
        </div>
      </div>

      {/* ═══ WHY US STRIP ═══ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 border-t border-[rgba(184,134,11,0.18)] bg-warm pb-6 lg:pb-0">
        {t.whyUs && t.whyUs.map((item: any, i: number) => (
          <div key={i}
            className={`flex items-start gap-3.5 px-5 lg:px-8 py-5 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_10px_20px_-10px_rgba(184,134,11,0.15)] hover:bg-white/60 cursor-default rounded-lg m-1
                        ${i < t.whyUs.length - 1 ? 'lg:border-r border-[rgba(184,134,11,0.18)]' : ''}
                        ${i < 2 ? 'border-b lg:border-b-0 border-[rgba(184,134,11,0.18)]' : ''}`}>
            <div className="w-9 h-9 rounded-[10px] bg-gold-pale flex items-center justify-center text-base flex-shrink-0 mt-0.5">
              {item.icon}
            </div>
            <div>
              <div className="text-13 font-medium text-gray-900 mb-1">{item.title}</div>
              <div className="text-11 text-muted leading-relaxed">{item.sub}</div>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
