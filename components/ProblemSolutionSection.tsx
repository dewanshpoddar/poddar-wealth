'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useLang } from '@/lib/LangContext'
import { useEffect, useState } from 'react'

// Index-stable links for each plan in t.banner.plans array
const PLAN_LINKS = [
  '/products',                                             // LIC Jeevan Utsav
  '/services/health-insurance',                            // Star Arogya Sanjeevani
  '/blog/lic-dhan-vriddhi-single-premium-guaranteed-returns', // LIC Dhan Vriddhi
]

const FALLBACK_NAVS: Record<string, Record<string, { nav: number; date: string }>> = {
  "749": {
    bond:     { nav: 28.45, date: '2026-04-11' },
    secured:  { nav: 32.18, date: '2026-04-11' },
    balanced: { nav: 45.62, date: '2026-04-11' },
    growth:   { nav: 68.94, date: '2026-04-11' },
  },
  "752": {
    bond:     { nav: 24.82, date: '2026-04-11' },
    secured:  { nav: 28.56, date: '2026-04-11' },
    balanced: { nav: 38.74, date: '2026-04-11' },
    growth:   { nav: 54.21, date: '2026-04-11' },
  },
  "886": {
    bond:               { nav: 15.24, date: '2026-04-11' },
    secured:            { nav: 17.86, date: '2026-04-11' },
    balanced:           { nav: 24.58, date: '2026-04-11' },
    growth:             { nav: 38.42, date: '2026-04-11' },
  }
}

export default function ProblemSolutionSection() {
  const { t, lang } = useLang()
  const pathname = usePathname()
  const [navs, setNavs] = useState<Record<string, Record<string, { nav: number; date: string }>>>(FALLBACK_NAVS)

  useEffect(() => {
    fetch('/api/nav')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.nav) {
          setNavs(data.nav)
        }
      })
      .catch(() => {})
  }, [])

  if (pathname?.startsWith('/lp/')) return null

  const rawDate = navs?.['749']?.growth?.date ?? '2026-04-11'
  const tickerDate = new Date(rawDate).toLocaleDateString(lang === 'en' ? 'en-US' : lang === 'hi' ? 'hi-IN' : 'bn-BD', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })

  return (
    <div className="bg-navy h-9 max-h-9 py-1 flex items-center relative z-50 shadow-md border-b border-gold/20 select-none overflow-hidden">
      {/* Container that hides overflow */}
      <div className="w-full overflow-hidden whitespace-nowrap">
        {/* Animated Marquee content */}
        <div className="animate-marquee inline-flex flex-nowrap items-center hover:[animation-play-state:paused]">
          {[...Array(2)].map((_, idx) => (
            <div key={idx} className="flex items-center gap-6 mx-8 flex-shrink-0">
              
              {/* Green indicator dot */}
              <div className="relative flex items-center justify-center">
                <span className="w-2.5 h-2.5 rounded-full bg-gold animate-wa-pulse" />
                <span className="absolute w-1.5 h-1.5 rounded-full bg-white animate-pulse-dot" />
              </div>
              
              {/* Ticker Item 1: Announcement Text */}
              <span className="text-[12px] font-semibold text-white/95 tracking-wide">{t.banner.text}</span>
              
              {/* Plan Links */}
              <div className="flex gap-2">
                {t.banner.plans.map((plan: string, i: number) => (
                  <Link key={i} href={PLAN_LINKS[i] ?? '/products'}
                    className="text-[11px] bg-white/5 text-white/80 font-medium px-2.5 py-0.5 rounded-full border border-white/10 hover:border-gold/40 hover:bg-gold/10 transition-all duration-300 uppercase tracking-wider animate-fade-in h-6 min-h-0 flex items-center">
                    {plan}
                  </Link>
                ))}
              </div>
              
              {/* Know More CTA */}
              <Link href="/products" className="flex items-center gap-1 group border-r border-white/10 pr-6 mr-2 h-6 min-h-0">
                <span className="text-[11px] text-gold font-bold group-hover:text-white transition-colors">{t.banner.cta}</span>
                <span className="text-[11px] text-gold group-hover:translate-x-1 transition-transform">→</span>
              </Link>

              {/* Ticker Item 2: LIC ULIP NAV Updates */}
              <span className="text-[11px] text-amber-500 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                LIC ULIP NAVs ({tickerDate}):
              </span>
              
              <div className="flex items-center gap-4 text-[10px] font-medium tracking-wide">
                <span className="text-white/80">Nivesh Plus (749) - Growth: <strong className="text-white">₹{navs['749']?.growth?.nav ?? '68.94'}</strong> <span className="text-green-400">▲</span></span>
                <span className="text-white/20">|</span>
                <span className="text-white/80">Balanced: <strong className="text-white">₹{navs['749']?.balanced?.nav ?? '45.62'}</strong> <span className="text-green-400">▲</span></span>
                <span className="text-white/20">|</span>
                <span className="text-white/80">SIIP (752) - Growth: <strong className="text-white">₹{navs['752']?.growth?.nav ?? '54.21'}</strong> <span className="text-green-400">▲</span></span>
                <span className="text-white/20">|</span>
                <span className="text-white/80">Balanced: <strong className="text-white">₹{navs['752']?.balanced?.nav ?? '38.74'}</strong> <span className="text-green-400">▲</span></span>
                <span className="text-white/20">|</span>
                <span className="text-white/80">Index Fund (886) - Growth: <strong className="text-white">₹{navs['886']?.growth?.nav ?? '38.42'}</strong> <span className="text-green-400">▲</span></span>
              </div>
              
              <span className="text-white/30 mr-4">•••</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
