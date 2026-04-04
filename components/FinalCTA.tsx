'use client'
import { useLang } from '@/lib/LangContext'

export default function FinalCTA() {
  const { t } = useLang()

  return (
    <section className="pw-section pw-section--warm">
      <div className="grid gap-8 items-center" style={{ gridTemplateColumns: '200px 1fr' }}>
        {/* Photo placeholder */}
        <div className="bg-gray-200 rounded-lg flex items-center justify-center" style={{ height: '220px' }}>
          <div className="bg-gray-400 rounded-md flex items-end justify-center pb-2" style={{ width: '120px', height: '160px' }}>
            <span className="text-10 text-white font-medium text-center">Photo of<br />Ajay Kumar Poddar</span>
          </div>
        </div>

        {/* About info */}
        <div>
          <div className="pw-eyebrow">{t.aboutSection.eyebrow}</div>
          <div className="pw-title">{t.aboutSection.name}</div>
          <div className="flex flex-wrap gap-1.5 mb-3">
            {t.aboutSection.badges.map((badge: any, i: number) => (
              <span
                key={i}
                className={`pw-badge ${badge.type === 'gold' ? 'pw-badge--gold' : 'pw-badge--blue'}`}
              >
                {badge.text}
              </span>
            ))}
          </div>
          <div className="text-13 text-gray-500 leading-loose">{t.aboutSection.bio}</div>
        </div>
      </div>
    </section>
  )
}
