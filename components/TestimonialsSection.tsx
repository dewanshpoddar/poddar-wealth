'use client'
import { useLang } from '@/lib/LangContext'

const FEMALE_NAMES = new Set(['sunita', 'priya', 'meena', 'sita', 'geeta', 'anita', 'kavita', 'neha', 'pooja', 'rekha', 'usha', 'lata', 'manju', 'nisha', 'asha', 'radha', 'seema', 'shilpa', 'shreya', 'divya'])

function avatarGradient(name: string) {
  const first = name.split(' ')[0].toLowerCase()
  return FEMALE_NAMES.has(first)
    ? 'bg-gradient-to-br from-pink-400 to-pink-600'
    : 'bg-gradient-to-br from-blue-400 to-blue-600'
}

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
              <div className={`pw-ts-avatar text-white ${avatarGradient(item.name)}`}>
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
