'use client'
import { useLang } from '@/lib/LangContext'

export default function ProblemSolutionSection() {
  const { t } = useLang()

  return (
    <div className="bg-navy py-2.5 overflow-hidden whitespace-nowrap flex relative z-50 shadow-md">
      <div className="animate-marquee inline-flex flex-nowrap items-center hover:[animation-play-state:paused]">
        {/* Duplicate the items array multiple times to create a seamless loop. We will render 10 items. */}
        {[...Array(10)].map((_, idx) => (
          <div key={idx} className="flex items-center gap-2.5 mx-8 flex-shrink-0">
            <div className="w-2 h-2 rounded-full bg-gold animate-pulse-dot" />
            <span className="text-12 font-medium text-white">{t.banner.text}</span>
            <div className="flex gap-2">
              {t.banner.plans.map((plan: string, i: number) => (
                <span key={i} className="text-11 bg-white/10 text-white px-2.5 py-0.5 rounded-full border-[0.5px] border-gold/40">{plan}</span>
              ))}
            </div>
            <span className="text-11 text-gold hover:text-gold-light font-medium cursor-pointer underline ml-2">{t.banner.cta}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
