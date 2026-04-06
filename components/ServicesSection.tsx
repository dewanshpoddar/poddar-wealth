'use client'
import { useLang } from '@/lib/LangContext'
import Link from 'next/link'

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
    <section className="bg-warm/40 py-24 relative overflow-hidden">
      {/* Decorative gradient background element */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gold/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />

      <div className="max-w-[1240px] mx-auto px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="max-w-xl">
            <div className="flex items-center gap-3 text-[11px] tracking-[0.14em] text-gold font-medium uppercase mb-4">
              <span className="w-8 h-px bg-gold" />
              {t.services.eyebrow}
            </div>
            <h2 className="font-display text-[32px] lg:text-[40px] font-normal italic text-navy leading-[1.1] mb-4">
              {t.services.title}
            </h2>
            <p className="text-[14px] text-muted leading-relaxed max-w-sm">
              {t.services.subtitle}
            </p>
          </div>
          <Link href="/services/life-insurance" className="hidden md:flex items-center gap-2 group text-13 font-bold text-navy hover:text-gold transition-colors">
            Explore All Solutions
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {t.services.items.map((svc: any, i: number) => (
            <div key={i}
              className="bg-white/80 backdrop-blur-md border border-[rgba(184,134,11,0.1)] rounded-2xl p-8
                         hover:shadow-2xl hover:shadow-[rgba(184,134,11,0.15)] hover:border-gold/30 hover:-translate-y-2
                         transition-all duration-500 group cursor-default">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mb-8 relative
                           bg-warm group-hover:bg-gold/10 transition-colors duration-500"
              >
                <div className="absolute inset-0 bg-gold/10 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative z-10 transition-transform duration-500 group-hover:scale-110">
                  {iconSvgs[svc.color] || iconSvgs.blue}
                </div>
              </div>

              <div className="text-[17px] font-bold text-navy mb-3 tracking-tight group-hover:text-gold transition-colors duration-300">
                {svc.title}
              </div>
              <div className="text-[13px] text-muted leading-relaxed mb-6">
                {svc.desc}
              </div>

              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-navy/5 text-[9px] text-navy font-bold uppercase tracking-[0.1em] border border-navy/5 group-hover:bg-gold group-hover:text-white group-hover:border-gold transition-all duration-300">
                  {svc.tag}
                </span>
                <span className="text-navy/0 group-hover:text-gold group-hover:translate-x-1 transition-all duration-500 font-bold text-16">→</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
