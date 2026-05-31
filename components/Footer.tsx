'use client'
import { useLang } from '@/lib/LangContext'
import Link from 'next/link'
import Image from 'next/image'

export default function Footer() {
  const { t } = useLang()

  return (
    <footer className="bg-gray-900 pt-16 pb-8 border-t border-gold/20 text-gray-300">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        {/* Main Grid: 4-col desktop, 2-col tablet, 1-col mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Column 1: Brand */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 rounded-xl bg-white flex items-center justify-center p-2 shadow-gold-sm overflow-hidden flex-shrink-0">
                <Image src="/assets/pwm-logo.svg" alt="Poddar Wealth Logo" width={64} height={64} className="w-full h-full object-contain scale-110" />
              </div>
              <div>
                <span className="text-white font-bold text-[15px] leading-snug block uppercase tracking-wide">Poddar Wealth Management</span>
                <span className="text-gold/80 text-[10px] uppercase tracking-widest font-semibold mt-1 block">Since 1994</span>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              Securing the future of Gorakhpur families for over 31 years with trust, transparency, and personal care.
            </p>
            <div className="pt-1">
              <a
                href="https://www.google.com/maps/place/Poddar+Wealth+Management/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-gold transition-colors duration-200"
              >
                <span className="text-gold font-bold">★</span>
                <span>{t.googleReviews?.rating || '4.9 on Google (154 reviews)'}</span>
              </a>
            </div>
            <div className="text-xs text-gold/60 font-semibold tracking-wider uppercase">
              Excellence in Protection
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-6 px-2 border-l-2 border-gold/60 ml-[-2px]">
              Quick Links
            </h4>
            <ul className="space-y-3.5">
              {[
                { name: 'Home', href: '/' },
                { name: 'About Us', href: '/about' },
                { name: t.nav.products || 'Products', href: '/products' },
                { name: t.nav.services || 'Services', href: '/services' },
                { name: 'Testimonials', href: '/testimonials' },
                { name: 'Blog', href: '/blog' },
                { name: 'FAQ', href: '/faq' },
              ].map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-gray-400 hover:text-gold text-sm transition-colors duration-200 block">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Support */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-6 px-2 border-l-2 border-gold/60 ml-[-2px]">
              Support & Tools
            </h4>
            <ul className="space-y-3.5">
              {[
                { name: t.nav.claimSupport || 'Claim Support', href: '/claims' },
                { name: 'Pay Premium', href: '/pay-premium' },
                { name: t.nav.renewPolicy || 'Renew Policy', href: '/contact' },
                { name: 'Contact Us', href: '/contact' },
                { name: 'Join as Advisor', href: '/become-advisor' },
              ].map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-gray-400 hover:text-gold text-sm transition-colors duration-200 block">
                    {link.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/ai-advisor" className="text-gold hover:text-gold-light text-sm font-semibold transition-colors duration-200 flex items-center gap-2">
                  <span className="animate-pulse">✨</span> AI Advisor (Poddar Ji)
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Socials */}
          <div className="space-y-6">
            <div>
              <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-6 px-2 border-l-2 border-gold/60 ml-[-2px]">
                Reach Us
              </h4>
              <div className="space-y-3.5 text-sm text-gray-400">
                <div className="flex gap-3">
                  <span className="text-gold mt-0.5">📍</span>
                  <span className="leading-relaxed">{t.footer.address}</span>
                </div>
                <div className="flex gap-3">
                  <span className="text-gold">📞</span>
                  <a href={`tel:${t.footer.phone}`} className="hover:text-gold transition-colors">{t.footer.phone}</a>
                </div>
                <div className="flex gap-3">
                  <span className="text-gold">📧</span>
                  <a href={`mailto:${t.footer.email}`} className="hover:text-gold transition-colors">{t.footer.email}</a>
                </div>
              </div>
            </div>

            {/* Social Icons Placeholders */}
            <div>
              <span className="text-white/60 text-xs font-bold uppercase tracking-wider block mb-3">Connect With Us</span>
              <div className="flex items-center gap-3">
                {[
                  {
                    name: 'Facebook',
                    href: '#',
                    svg: (
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                        <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.8c4.56-.93 8-4.96 8-9.8z"/>
                      </svg>
                    )
                  },
                  {
                    name: 'Twitter',
                    href: '#',
                    svg: (
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                      </svg>
                    )
                  },
                  {
                    name: 'LinkedIn',
                    href: '#',
                    svg: (
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                    )
                  },
                  {
                    name: 'Instagram',
                    href: '#',
                    svg: (
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                      </svg>
                    )
                  }
                ].map((s) => (
                  <a
                    key={s.name}
                    href={s.href}
                    aria-label={s.name}
                    className="w-9 h-9 rounded-full border border-gray-700 flex items-center justify-center text-gray-400 hover:text-gold hover:border-gold transition-all duration-200 bg-gray-800/50"
                  >
                    {s.svg}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-gray-500 text-[11px] text-center md:text-left order-2 md:order-1">
            {t.footer.rights}
          </div>
          <div className="flex items-center gap-6 order-1 md:order-2">
            <Link href="/privacy-policy" className="text-[11px] text-gray-500 hover:text-gold transition-colors">Privacy Policy</Link>
            <span className="text-gray-700 hidden md:inline">·</span>
            <Link href="/terms" className="text-[11px] text-gray-500 hover:text-gold transition-colors">Terms of Service</Link>
          </div>
          <div className="text-[10px] text-gray-500 text-center md:text-right max-w-xl leading-relaxed italic order-3">
            {t.footer.disclaimer}
          </div>
        </div>
      </div>
    </footer>
  )
}
