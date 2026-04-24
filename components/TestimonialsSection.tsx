'use client'
import { useLang } from '@/lib/LangContext'

export default function TestimonialsSection() {
  const { t } = useLang()

  return (
    <section className="pw-section pw-section--warm">
      <div className="pw-eyebrow">{t.testimonials.eyebrow}</div>
      <div className="pw-title">{t.testimonials.title}</div>
      <div className="pw-subtitle">{t.testimonials.subtitle}</div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        {t.testimonials.items.map((item: any, i: number) => (
          <div key={i} className="pw-ts-card">
            {/* Stars */}
            <div className="flex gap-0.5 mb-2">
              {[1,2,3,4,5].map(s => (
                <span key={s} className="pw-ts-star" />
              ))}
            </div>

            <p className="pw-ts-text">&ldquo;{item.text}&rdquo;</p>

            {/* Author */}
            <div className="flex items-center gap-2">
              <div
                className="pw-ts-avatar"
                style={{ background: item.color, color: item.textColor }}
              >
                {item.name.charAt(0)}
              </div>
              <div>
                <div className="pw-ts-name">{item.name}</div>
                <div className="pw-ts-meta">{item.location}</div>
              </div>
            </div>

            <span className="pw-badge pw-badge--gold mt-2" style={{ fontSize: '9px' }}>{item.badge}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
