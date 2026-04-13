'use client'
import { useLang } from '@/lib/LangContext'
import Link from 'next/link'

export default function Footer() {
  const { t } = useLang()

  return (
    <footer className="bg-navy pt-16 pb-8 border-t border-gold/20">
      <div className="max-w-7xl mx-auto px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Column */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 rounded-xl bg-white flex items-center justify-center p-2 shadow-gold-sm overflow-hidden flex-shrink-0">
                <img src="/assets/pwm-logo.svg" alt="Poddar Wealth Logo" className="w-full h-full object-contain scale-110" />
              </div>
              <div>
                <span className="text-white font-bold text-[15px] leading-snug block uppercase tracking-wide">Poddar Wealth Management</span>
                <span className="text-gold/60 text-[10px] uppercase tracking-widest font-semibold mt-1 block">Excellence in Protection Since 1994</span>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              Securing the future of Gorakhpur families for over 31 years with trust, transparency, and personal care.
            </p>
          </div>

          {/* Quick Links Column */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-6 px-1 border-l-2 border-gold/40 ml-[-2px]">Quick Links</h4>
            <ul className="space-y-4">
              {[
                { name: 'Home', href: '/' },
                { name: 'About Us', href: '/about' },
                { name: t.nav.products, href: '/' },
                { name: t.nav.services, href: '/services' },

                { name: 'Testimonials', href: '/#testimonials' },
              ].map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-gray-400 hover:text-gold text-sm transition-colors duration-200">
                    {link.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/ai-advisor" className="text-gold hover:text-white text-sm font-semibold transition-colors duration-200 flex items-center gap-2">
                  <span className="animate-pulse">✨</span> AI Advisor (Poddar Ji)
                </Link>
              </li>
            </ul>
          </div>


          {/* Contact Column */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-6 px-1 border-l-2 border-gold/40 ml-[-2px]">Reach Us</h4>
            <div className="space-y-4 text-sm text-gray-400">
              <div className="flex gap-3">
                <span className="text-gold mt-1">📍</span>
                <span>{t.footer.address}</span>
              </div>
              <div className="flex gap-3">
                <span className="text-gold mt-1">📞</span>
                <a href={`tel:${t.footer.phone}`} className="hover:text-gold transition-colors">{t.footer.phone}</a>
              </div>
              <div className="flex gap-3">
                <span className="text-gold mt-1">📧</span>
                <a href={`mailto:${t.footer.email}`} className="hover:text-gold transition-colors">{t.footer.email}</a>
              </div>
            </div>
          </div>

          {/* Action Column */}
          <div className="space-y-6">
            <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-6 px-1 border-l-2 border-gold/40 ml-[-2px]">Support & Tools</h4>
            <ul className="space-y-4 mb-6">
              <li>
                <Link href="/calculators/premium" className="text-gray-400 hover:text-gold text-sm transition-colors duration-200 flex items-center gap-2">
                  <span>🧮</span> Premium Calculator
                  <span className="bg-green-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full leading-none">New</span>
                </Link>
              </li>
              <li>
                <Link href="/calculators/life-insurance" className="text-gray-400 hover:text-gold text-sm transition-colors duration-200 flex items-center gap-2">
                   <span>📊</span> Life Insurance Calculator
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-gold text-sm transition-colors duration-200 flex items-center gap-2">
                  <span>📄</span> {t.nav.renewPolicy}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-gold text-sm transition-colors duration-200 flex items-center gap-2">
                  <span>🏥</span> {t.nav.claimSupport}
                </Link>
              </li>
            </ul>
            <div className="flex flex-col gap-3">
              <a
                href={`https://wa.me/${t.whatsapp.number}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg shadow-green-500/20"
              >
                <span className="text-lg">💬</span>
                WhatsApp Support
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-gray-500 text-[11px] text-center md:text-left">
            {t.footer.rights}
          </div>
          <div className="text-[10px] text-gray-600 text-center md:text-right max-w-xl leading-relaxed italic">
            {t.footer.disclaimer}
          </div>
        </div>
      </div>
    </footer>
  )
}
