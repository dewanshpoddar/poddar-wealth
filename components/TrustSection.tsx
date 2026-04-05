'use client'
import { useLang } from '@/lib/LangContext'

export default function TrustSection() {
  const { t } = useLang()

  return (
    <>
      {/* ── Partner Logo Marquee ── */}
      <div className="bg-white border-y border-[rgba(184,134,11,0.12)] py-8 overflow-hidden relative">
        <div className="max-w-[1240px] mx-auto px-8 mb-6">
          <div className="flex items-center gap-3 text-[11px] tracking-[0.14em] text-muted font-medium uppercase">
            <span className="w-8 h-px bg-gold/30" />
            {t.trust.partnersLabel}
          </div>
        </div>

        <div className="flex overflow-hidden group">
          <div className="flex animate-marquee-slow whitespace-nowrap gap-16 items-center hover:[animation-play-state:paused]">
            {[...Array(2)].map((_, listIdx) => (
              <div key={listIdx} className="flex gap-16 items-center min-w-full justify-around">
                {t.trust.partners.map((partner: any, i: number) => (
                  <div key={i} className="flex items-center gap-3.5 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-500 cursor-default group/partner">
                    <div className="w-10 h-10 rounded-xl bg-warm flex items-center justify-center p-2 border border-gold/10 group-hover/partner:border-gold/30 shadow-sm">
                      <div className="w-full h-full flex items-center justify-center font-bold text-14" style={{ color: partner.color }}>
                        {partner.name[0]}
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[13px] font-bold text-navy tracking-tight">{partner.name}</span>
                      <span className="text-[9px] text-muted uppercase tracking-[0.05em] font-medium leading-none">Official Partner</span>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Gradient overlays for smooth fade */}
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
      </div>
    </>
  )
}
