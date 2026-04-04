'use client'
import { useLang } from '@/lib/LangContext'

const iconSvgs: Record<string, JSX.Element> = {
  blue: <svg width="16" height="16" fill="#185FA5" viewBox="0 0 24 24"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/></svg>,
  red: <svg width="16" height="16" fill="#A32D2D" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>,
  orange: <svg width="16" height="16" fill="#854F0B" viewBox="0 0 24 24"><path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/></svg>,
  green: <svg width="16" height="16" fill="#0F6E56" viewBox="0 0 24 24"><path d="M12 3L1 9l4 2.18V17h2v-4.82l2 1.09V17c0 1.1 2.24 2 5 2s5-.9 5-2v-3.73L23 9l-11-6z"/></svg>,
}

const iconBgs: Record<string, string> = {
  blue: '#E6F1FB',
  red: '#FCEBEB',
  orange: '#FAEEDA',
  green: '#E1F5EE',
}

export default function ServicesSection() {
  const { t } = useLang()

  return (
    <section className="pw-section">
      <div className="pw-eyebrow">{t.services.eyebrow}</div>
      <div className="pw-title">{t.services.title}</div>
      <div className="pw-subtitle">{t.services.subtitle}</div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {t.services.items.map((svc: any, i: number) => (
          <div key={i} className="pw-svc-card">
            <div
              className="pw-icon-box mb-3"
              style={{ background: iconBgs[svc.color] || '#E6F1FB', fontSize: '16px' }}
            >
              {iconSvgs[svc.color] || iconSvgs.blue}
            </div>
            <div className="pw-card-name">{svc.title}</div>
            <div className="pw-card-desc">{svc.desc}</div>
            <span className="pw-badge pw-badge--gold mt-2">{svc.tag}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
