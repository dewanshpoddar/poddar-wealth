'use client'
import { useLang } from '@/lib/LangContext'

export default function IntentSection() {
  const { t } = useLang()

  return (
    <section className="bg-navy py-24 relative overflow-hidden">
      {/* Background patterns */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#C8960C 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

      <div className="max-w-[1240px] mx-auto px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left — Emotional Story & Stats */}
          <div className="relative z-10">
            <div className="font-display text-[64px] text-gold/40 leading-none mb-[-24px] select-none">&ldquo;</div>
            <h2 className="font-display text-[26px] lg:text-[32px] font-medium text-white leading-tight mb-8">
              {t.emotional.quote} <span className="text-gold italic block mt-2">{t.emotional.quoteGold}</span>
            </h2>
            <p className="text-[15px] text-white/60 leading-loose mb-12 max-w-lg">
              {t.emotional.story}
            </p>

            <div className="grid grid-cols-3 gap-6">
              {t.emotional.stats.map((stat: any, i: number) => (
                <div key={i} className="group cursor-default">
                  <div className="text-[28px] lg:text-[34px] font-display font-bold text-white mb-1 group-hover:text-gold transition-colors duration-300">
                    {stat.num}
                  </div>
                  <div className="text-[10px] text-gold font-bold tracking-[0.15em] uppercase opacity-70 group-hover:opacity-100">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Trust & Promise Cards */}
          <div className="relative z-10 flex flex-col gap-6">
            {/* The Shield Card */}
            <div className="bg-white/[0.03] backdrop-blur-sm border border-white/10 rounded-3xl p-8 hover:bg-white/5 transition-all duration-500">
              <div className="w-16 h-16 rounded-2xl bg-gold/10 flex items-center justify-center mb-6 border border-gold/20">
                <svg width="32" height="32" viewBox="0 0 32 36" fill="none">
                  <path d="M16 2L2 8v10c0 9.3 6 17.9 14 20 8-2.1 14-10.7 14-20V8L16 2z" fill="#C8960C" opacity="0.9"/>
                  <path d="M10 17l4 4 8-8" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="text-[18px] font-bold text-white mb-3 tracking-tight">
                {t.emotional.trustCard.title}
              </h3>
              <p className="text-[13px] text-white/50 leading-relaxed">
                {t.emotional.trustCard.desc}
              </p>
            </div>

            {/* The Promise Card */}
            <div className="bg-gold rounded-3xl p-8 shadow-2xl shadow-gold/10 hover:-translate-y-1 transition-all duration-500">
              <h3 className="text-[18px] font-bold text-navy mb-6 tracking-tight">
                {t.emotional.promise.title}
              </h3>
              <div className="grid gap-4">
                {t.emotional.promise.items.map((item: string, i: number) => (
                  <div key={i} className="flex items-start gap-3 group">
                    <div className="w-5 h-5 rounded-full bg-navy/10 flex items-center justify-center text-navy text-10 mt-0.5 group-hover:bg-navy group-hover:text-white transition-colors">
                      ✓
                    </div>
                    <span className="text-[13px] font-medium text-navy/80 leading-snug">
                      {item}
                    </span>
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
