'use client'
import { useLang } from '@/lib/LangContext'
import Link from 'next/link'
import Image from 'next/image'

const quickIcons = [
  <svg key="shield" width="16" height="16" fill="none" viewBox="0 0 24 24"><path d="M12 2C9.24 2 7 4.24 7 7s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zm0 12c-5.33 0-8 2.67-8 4v2h16v-2c0-1.33-2.67-4-8-4z" fill="#C8960C"/></svg>,
  <svg key="heart" width="16" height="16" fill="none" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="#C8960C"/></svg>,
  <svg key="check" width="16" height="16" fill="none" viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14l-5-5 1.41-1.41L12 14.17l7.59-7.59L21 8l-9 9z" fill="#C8960C"/></svg>,
  <svg key="edu" width="16" height="16" fill="none" viewBox="0 0 24 24"><path d="M12 3L1 9l4 2.18V17h2v-4.82l2 1.09V17c0 1.1 2.24 2 5 2s5-.9 5-2v-3.73L23 9l-11-6zm5 13c0 .5-2 1-5 1s-5-.5-5-1v-1.95l5 2.73 5-2.73V16z" fill="#C8960C"/></svg>,
]

export default function HeroSection() {
  const { t } = useLang()

  return (
    <section className="relative bg-navy pt-20 pb-24 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-navy-light opacity-30 transform skew-x-[-15deg] origin-bottom-right" />

      <div className="pw-container relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          
          {/* Left content */}
          <div className="max-w-xl">
            {/* Logo/Brand Header */}
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-white rounded-md flex items-center justify-center p-1 shadow-md">
                <img src="/assets/logo.svg" alt="LIC Logo" className="w-full h-full object-contain" />
              </div>
              <div className="flex flex-col text-left">
                <span className="font-display font-bold text-lg md:text-xl text-white leading-tight">Poddar Wealth Management</span>
                <span className="text-11 md:text-xs text-gold uppercase tracking-wider font-semibold">{t.hero.eyebrow}</span>
              </div>
            </div>

            <h1 className="font-display text-4xl md:text-5xl lg:text-[54px] font-bold text-white leading-[1.15] mb-6">
              {t.hero.headline}<br />
              <span className="text-gold">{t.hero.headlineGold}</span>
            </h1>
            
            <p className="text-15 md:text-base text-gray-300 leading-relaxed mb-10 max-w-lg font-light">
              {t.hero.subtitle}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/calculators/life-insurance" className="bg-gold hover:bg-yellow-500 text-navy font-bold py-3.5 px-8 rounded-lg shadow-lg shadow-gold/20 transition-all text-center">
                {t.hero.cta1}
              </Link>
              <Link href="/services/life-insurance" className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-medium py-3.5 px-8 rounded-lg transition-all text-center backdrop-blur-sm">
                {t.hero.cta2}
              </Link>
            </div>
          </div>

          {/* Right Content - Family Image + Floating widget */}
          <div className="relative w-full ml-auto xl:w-[110%]">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-[4/3] md:aspect-video lg:aspect-[4/3] w-full">
              <img 
                src="/assets/hero-family.png" 
                alt="Happy family" 
                className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-transparent to-transparent pointer-events-none" />
            </div>

            {/* Quick Intent Widget - Floating Card */}
            <div className="relative lg:absolute lg:-bottom-10 lg:-left-12 bg-white rounded-xl p-5 shadow-2xl border border-gray-100 z-20 mt-[-30px] mx-4 lg:mx-0 max-w-[340px]">
              <div className="text-xs font-bold text-navy uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">
                {t.hero.quickTitle}
              </div>
              <div className="flex flex-col gap-3">
                {t.hero.quickItems.map((item: any, i: number) => (
                  <div key={i} className="flex items-center gap-3 group cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors">
                    <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center flex-shrink-0 group-hover:bg-gold/20 transition-colors">
                      {quickIcons[i]}
                    </div>
                    <div>
                      <div className="text-13 font-semibold text-gray-900 group-hover:text-navy transition-colors">{item.title}</div>
                      <div className="text-11 text-gray-500 line-clamp-1">{item.sub}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
