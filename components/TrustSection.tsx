'use client'
import { useLang } from '@/lib/LangContext'

export default function TrustSection() {
  const { t } = useLang()

  return (
    <section className="bg-white border-y border-[rgba(184,134,11,0.12)] py-16 overflow-hidden relative">
      {/* Background Accents - Material consistency with ProductTeaser */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-navy/[0.015] -z-10 skew-x-12 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-1/4 h-1/2 bg-gold/[0.01] -z-10 -skew-x-12 -translate-x-1/3" />

      <div className="max-w-[1240px] mx-auto px-8 mb-12">
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
                
                {/* Subtle shine effect */}
                <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/0 opacity-0 group-hover/partner:opacity-100 transition-opacity" />
              </div>
              <div className="flex flex-col items-center">
                <span className="text-sm sm:text-base font-bold text-navy tracking-tight group-hover/partner:text-gold transition-colors">{partner.name}</span>
                <span className="text-[10px] sm:text-xs text-muted uppercase tracking-[0.1em] font-medium leading-none mt-1">Official Partner</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
