'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useLang } from '@/lib/LangContext'

// Index-stable links for each plan in t.banner.plans array
const PLAN_LINKS = [
  '/products',                                             // LIC Jeevan Utsav
  '/services/health-insurance',                            // Star Arogya Sanjeevani
  '/blog/lic-dhan-vriddhi-single-premium-guaranteed-returns', // LIC Dhan Vriddhi
]

export default function ProblemSolutionSection() {
  const { t } = useLang()
  const pathname = usePathname()

  if (pathname?.startsWith('/lp/')) return null

  return (
    <div className="bg-navy py-2.5 overflow-hidden whitespace-nowrap flex relative z-50 shadow-md border-b border-gold/20">
      <div className="animate-marquee inline-flex flex-nowrap items-center hover:[animation-play-state:paused]">
        {[...Array(2)].map((_, idx) => (
          <div key={idx} className="flex items-center gap-3.5 mx-10 flex-shrink-0">
            <div className="relative flex items-center justify-center">
              <span className="w-2.5 h-2.5 rounded-full bg-gold animate-wa-pulse" />
              <span className="absolute w-1.5 h-1.5 rounded-full bg-white animate-pulse-dot" />
            </div>
            <span className="text-[12px] font-semibold text-white/90 tracking-wide">{t.banner.text}</span>
            <div className="flex gap-2.5">
              {t.banner.plans.map((plan: string, i: number) => (
                <Link key={i} href={PLAN_LINKS[i] ?? '/products'}
                  className="text-[10px] bg-white/5 text-white/80 font-medium px-3 py-0.5 rounded-full border border-white/10 hover:border-gold/40 hover:bg-gold/10 transition-all duration-300 uppercase tracking-wider">
                  {plan}
                </Link>
              ))}
            </div>
            <Link href="/products" className="flex items-center gap-1 group ml-2">
              <span className="text-[11px] text-gold font-bold group-hover:text-white transition-colors">{t.banner.cta}</span>
              <span className="text-[11px] text-gold group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}
