'use client'
import { useLang } from '@/lib/LangContext'

import Image from 'next/image'

export default function FinalCTA() {
  const { t } = useLang()

  return (
    <section className="pw-section pw-section--warm pb-20">
      <div className="max-w-5xl mx-auto grid gap-8 md:gap-12 items-center" style={{ gridTemplateColumns: 'revert' }}>
        <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-center md:items-start bg-white/40 p-8 rounded-[32px] border border-gold/10 shadow-sm">
          {/* Photo container */}
          <div className="shrink-0 w-48 h-64 sm:w-56 sm:h-72 rounded-2xl bg-white flex items-center justify-center p-2 border border-gold/10 shadow-inner relative overflow-hidden group/photo">
            <Image 
              src="/assets/ajay-poddar.svg" 
              alt={t.aboutSection.name}
              fill
              className="object-contain transition-transform duration-500 group-hover/photo:scale-110"
              priority
            />
          </div>

          {/* About info */}
          <div className="flex-1 text-center md:text-left">
            <div className="pw-eyebrow text-gold font-bold tracking-[0.2em] mb-2">{t.aboutSection.eyebrow}</div>
            <h2 className="pw-title text-navy text-2xl md:text-3xl font-bold mb-4">{t.aboutSection.name}</h2>
            <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-6">
              {t.aboutSection.badges.map((badge: any, i: number) => (
                <span
                  key={i}
                  className={`pw-badge px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    badge.type === 'gold' 
                      ? 'bg-gold/10 text-gold border border-gold/20' 
                      : 'bg-navy/5 text-navy/70 border border-navy/10'
                  }`}
                >
                  {badge.text}
                </span>
              ))}
            </div>
            <p className="text-[14px] text-gray-600 leading-relaxed max-w-2xl">{t.aboutSection.bio}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
