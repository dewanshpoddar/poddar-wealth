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

        <div className="max-w-4xl mx-auto px-8">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-12 sm:gap-24">
            {t.trust.partners.map((partner: any, i: number) => (
              <div key={i} className="flex flex-col items-center gap-6 group/partner text-center">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-warm flex items-center justify-center p-4 border border-gold/10 group-hover/partner:border-gold/30 shadow-sm relative overflow-hidden transition-all duration-300 transform group-hover/partner:scale-105">
                  {partner.logo ? (
                    <img 
                      src={partner.logo} 
                      alt={partner.name}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center font-bold text-24" style={{ color: partner.color }}>
                      {partner.name[0]}
                    </div>
                  )}
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-sm sm:text-base font-bold text-navy tracking-tight">{partner.name}</span>
                  <span className="text-[10px] sm:text-xs text-muted uppercase tracking-[0.1em] font-medium leading-none mt-1">Official Partner</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
