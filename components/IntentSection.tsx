'use client'
import { useLang } from '@/lib/LangContext'

export default function IntentSection() {
  const { t } = useLang()

  return (
    <section className="pw-section pw-section--dark">
      <div className="grid gap-10 items-center" style={{ gridTemplateColumns: '1fr 1fr' }}>
        {/* Left — emotional quote + stats */}
        <div>
          <div className="font-display text-48 text-gold leading-none mb-[-6px]">&ldquo;</div>
          <div className="font-display text-18 font-medium text-white leading-snug mb-4">
            {t.emotional.quote}<br />
            <span className="text-gold">{t.emotional.quoteGold}</span>
          </div>
          <div className="text-13 text-muted leading-loose mb-6">{t.emotional.story}</div>
          <div className="grid grid-cols-3 gap-3">
            {t.emotional.stats.map((stat: any, i: number) => (
              <div key={i} className="pw-he-stat">
                <div className="pw-he-stat-num">{stat.num}</div>
                <div className="pw-he-stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right — trust card + promise */}
        <div className="flex flex-col gap-3">
          <div className="rounded-lg p-5 border-half border-navy-border" style={{ background: '#0F2D4A' }}>
            <div className="rounded-md mb-3 flex items-center justify-center relative overflow-hidden" style={{ height: '110px', background: '#1a3a5c' }}>
              <svg width="40" height="44" viewBox="0 0 32 36" fill="none">
                <path d="M16 2L2 8v10c0 9.3 6 17.9 14 20 8-2.1 14-10.7 14-20V8L16 2z" fill="#C8960C" opacity="0.85"/>
                <path d="M10 17l4 4 8-8" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="text-12 text-gold font-medium mb-1">{t.emotional.trustCard.title}</div>
            <div className="text-11 text-muted leading-relaxed">{t.emotional.trustCard.desc}</div>
          </div>

          <div className="pw-promise-card">
            <div className="text-13 font-medium text-white mb-2">{t.emotional.promise.title}</div>
            <div className="flex flex-col gap-1.5">
              {t.emotional.promise.items.map((item: string, i: number) => (
                <div key={i} className="pw-promise-item">
                  <div className="pw-promise-check">✓</div>
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
