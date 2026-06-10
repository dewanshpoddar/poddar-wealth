'use client'
import { useLang } from '@/lib/LangContext'
import Image from 'next/image'

export default function FinalCTA() {
  const { t } = useLang()

  return (
    <section className="bg-warm/30 py-16 md:py-20 border-t border-gray-100/60 text-slate-800">
      <div className="max-w-7xl mx-auto px-6 md:px-8 grid gap-8 md:gap-12 items-center" style={{ gridTemplateColumns: 'revert' }}>
        <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-center md:items-start bg-white p-8 rounded-[32px] border border-gold/15 shadow-md text-slate-800">
          {/* Photo container */}
          <div className="shrink-0 w-48 h-64 sm:w-64 sm:h-80 rounded-2xl bg-slate-50 border border-gray-200/50 shadow-inner relative overflow-hidden group/photo">
            <Image 
              src="/assets/ajay-poddar.svg" 
              alt={t.aboutSection.name}
              fill
              className="object-cover object-top scale-[1.25] origin-top transition-transform duration-500 group-hover/photo:scale-[1.3]"
              priority
            />
          </div>

          {/* About info */}
          <div className="flex-1 text-center md:text-left">
            <div className="pw-eyebrow text-gold font-bold tracking-[0.2em] mb-2">{t.aboutSection.eyebrow}</div>
            <h2 className="font-display text-slate-900 text-2xl md:text-3xl font-bold mb-4">{t.aboutSection.name}</h2>
            <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-6">
              {(t.aboutSection?.badges ?? []).map((badge: any, i: number) => (
                <span
                  key={i}
                  className={`pw-badge px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider inline-flex items-center gap-1.5 ${
                    badge.type === 'gold'
                      ? 'bg-gold/10 text-gold border border-gold/20'
                      : 'bg-gray-100 text-gray-700 border border-gray-200'
                  }`}
                >
                  {badge.text.includes('MDRT') && (
                    <img src="/assets/mdrt-seeklogo.svg" alt="MDRT Member badge" className="w-3.5 h-3.5 object-contain flex-shrink-0" />
                  )}
                  {badge.text.includes('Chairman') || badge.text.includes('चेयरमैन') ? (
                    <Image src="/assets/chairmanclub.png" alt="Chairman's Club award" width={14} height={14} className="w-3.5 h-3.5 object-contain flex-shrink-0" />
                  ) : null}
                  {badge.text}
                </span>
              ))}
            </div>
            <p className="text-[14px] text-slate-600 leading-relaxed max-w-2xl font-medium">{t.aboutSection.bio}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
