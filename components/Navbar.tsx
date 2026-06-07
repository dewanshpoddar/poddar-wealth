'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useLang } from '@/lib/LangContext'
import { ChevronDown, Menu, X } from 'lucide-react'
import Image from 'next/image'

export default function Navbar() {
  const { lang, setLang, t } = useLang()
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [calcOpen, setCalcOpen] = useState(false)
  const [calcMobileOpen, setCalcMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const calcRef = useRef<HTMLDivElement>(null)

  // Scroll detection for background transition
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => { setMobileOpen(false) }, [pathname])

  // Close calc dropdown on outside click
  useEffect(() => {
    if (!calcOpen) return
    function handler(e: MouseEvent) {
      if (calcRef.current && !calcRef.current.contains(e.target as Node)) setCalcOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [calcOpen])

  // Prevent body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  const isActive = (path: string) =>
    path === '/' ? pathname === '/' : pathname.startsWith(path)

  // Nav link with hover underline effect
  const linkCls = (path: string) =>
    `relative text-sm font-medium transition-colors duration-200 pb-0.5
     after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0
     hover:after:w-full after:bg-amber-500 after:transition-all after:duration-300
     ${isActive(path) ? 'text-white after:w-full' : 'text-gray-400 hover:text-white'}`

  const calcLinks = [
    { href: '/calculators/premium',        en: 'Premium Calculator',      hi: 'प्रीमियम कैलकुलेटर' },
    { href: '/calculators/life-insurance', en: 'Life Insurance Calculator',hi: 'जीवन बीमा कैलकुलेटर' },
    { href: '/calculators/retirement',     en: 'Retirement Planner',       hi: 'रिटायरमेंट प्लानर' },
    { href: '/calculators/surrender-value',en: 'Surrender Value',          hi: 'सरेंडर वैल्यू' },
    { href: '/calculators/maturity',       en: 'Maturity Calculator',      hi: 'मैच्योरिटी कैलकुलेटर' },
    { href: '/calculators/loan',           en: 'Loan Against Policy',      hi: 'पॉलिसी पर लोन' },
    { href: '/calculators/policy-health',  en: 'Policy Health Score',      hi: 'पॉलिसी हेल्थ स्कोर', isNew: true, hasDivider: true },
  ]

  return (
    <>
      {/* Scroll-triggered background transition */}
      <nav className={`sticky top-0 z-50 h-16 transition-all duration-300 ${
        scrolled
          ? 'bg-gray-950/95 backdrop-blur-sm border-b border-gray-800 shadow-lg'
          : 'bg-gray-950 md:bg-gradient-to-b md:from-black/50 md:via-black/20 md:to-transparent border-b border-gray-800 md:border-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">

          {/* LEFT — Logo with brand name */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0 min-w-0">
            <div className="w-10 h-10 rounded-xl overflow-hidden bg-white/5 flex items-center justify-center p-1 flex-shrink-0">
              <Image
                src="/assets/pwm-logo.svg"
                alt="Poddar Wealth Management"
                width={40}
                height={40}
                className="w-full h-full object-contain"
                priority
              />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[11px] sm:text-sm font-bold tracking-wide text-white uppercase leading-tight truncate" style={{ textShadow: '0 1px 4px rgba(0,0,0,0.7)' }}>
                <span className="hidden sm:inline">Poddar Wealth Management</span>
                <span className="sm:hidden">Poddar Wealth</span>
              </span>
              <span className="text-[9px] font-medium tracking-widest uppercase text-amber-500 hidden md:block" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}>
                Excellence in Protection Since 1994
              </span>
            </div>
          </Link>

          {/* CENTER — Desktop nav links */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/about"    className={linkCls('/about')}>{t.nav.about}</Link>
            <Link href="/products" className={linkCls('/products')}>{t.nav.products}</Link>
            <Link href="/services" className={linkCls('/services')}>{t.nav.services}</Link>

            {/* Calculators dropdown */}
            <div className="relative" ref={calcRef}>
              <button
                onClick={() => setCalcOpen(v => !v)}
                aria-expanded={calcOpen}
                aria-haspopup="true"
                className={`relative flex items-center gap-0.5 text-sm font-medium transition-colors duration-200 pb-0.5
                  after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0
                  hover:after:w-full after:bg-amber-500 after:transition-all after:duration-300
                  ${isActive('/calculators') ? 'text-white after:w-full' : 'text-gray-400 hover:text-white'}`}
              >
                {t.nav.calculators}
                <ChevronDown
                  size={14}
                  className={`ml-1 transition-transform duration-200 ${
                    calcOpen ? 'rotate-180 text-white' : 'text-gray-400'
                  }`}
                />
              </button>

              {calcOpen && (
                <div className="absolute top-full left-0 mt-2 bg-gray-900 border border-gray-800 rounded-xl shadow-xl p-2 min-w-[220px] z-50">
                  {calcLinks.map(({ href, en, hi, isNew, hasDivider }) => (
                    <div key={href}>
                      {hasDivider && <div className="my-1 border-t border-gray-800/50" />}
                      <Link
                        href={href}
                        onClick={() => setCalcOpen(false)}
                        className={`flex items-center px-4 py-2.5 text-sm rounded-lg transition-colors ${
                          isActive(href)
                            ? 'text-amber-400 bg-gray-800/50'
                            : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                        }`}
                      >
                        <span>{lang === 'en' ? en : hi}</span>
                        {isNew && (
                          <span className="bg-amber-500 text-white text-[10px] px-1.5 py-0.5 rounded-full ml-2 font-bold">
                            {lang === 'en' ? 'New' : 'नया'}
                          </span>
                        )}
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Link href="/compare" className={linkCls('/compare')}>
              {lang === 'en' ? 'Compare' : 'तुलना'}
            </Link>
            <Link href="/blog" className={linkCls('/blog')}>
              {lang === 'en' ? 'Blog' : 'ब्लॉग'}
            </Link>
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-4">
            {/* Language toggle — desktop */}
            <div className="hidden md:flex items-center gap-1">
              <button
                onClick={() => setLang('en')}
                className={`text-xs font-semibold transition-colors duration-200 ${
                  lang === 'en' ? 'text-amber-500' : 'text-gray-400 hover:text-gray-300'
                }`}
              >
                EN
              </button>
              <span className="text-gray-600 text-xs mx-0.5">/</span>
              <button
                onClick={() => setLang('hi')}
                className={`text-xs font-semibold transition-colors duration-200 ${
                  lang === 'hi' ? 'text-amber-500' : 'text-gray-400 hover:text-gray-300'
                }`}
              >
                हिंदी
              </button>
            </div>

            {/* Get a free quote — desktop */}
            <Link
              href="/contact"
              className="hidden md:inline-flex items-center bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-all shadow-sm hover:shadow-md"
            >
              {t.nav.getQuote}
            </Link>

            {/* Mobile: lang toggle + hamburger */}
            <div className="md:hidden flex items-center gap-2">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setLang('en')}
                  className={`text-[10px] font-semibold transition-colors duration-200 ${
                    lang === 'en' ? 'text-amber-500' : 'text-gray-400'
                  }`}
                >
                  EN
                </button>
                <span className="text-gray-600 text-[10px] mx-0.5">/</span>
                <button
                  onClick={() => setLang('hi')}
                  className={`text-[10px] font-semibold transition-colors duration-200 ${
                    lang === 'hi' ? 'text-amber-500' : 'text-gray-400'
                  }`}
                >
                  हिंदी
                </button>
              </div>
              <button
                onClick={() => setMobileOpen(v => !v)}
                aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={mobileOpen}
                className="text-gray-300 hover:text-white p-1"
              >
                {mobileOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile full-screen drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[100] bg-gray-950 flex flex-col md:hidden overflow-y-auto">
          {/* Drawer header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800/50">
            <Link href="/" onClick={() => setMobileOpen(false)} className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl overflow-hidden bg-white/5 p-1 flex-shrink-0">
                <Image src="/assets/pwm-logo.svg" alt="PWM" width={36} height={36} className="w-full h-full object-contain" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold tracking-wide text-white uppercase leading-tight">
                  Poddar Wealth Management
                </span>
                <span className="text-[9px] font-medium tracking-widest uppercase text-amber-500 hidden sm:block">
                  Excellence in Protection Since 1994
                </span>
              </div>
            </Link>
            <button onClick={() => setMobileOpen(false)} className="text-gray-400 hover:text-white p-1">
              <X size={22} />
            </button>
          </div>

          {/* Drawer nav links */}
          <div className="flex-1 px-0">
            {[
              { href: '/about',    label: t.nav.about },
              { href: '/products', label: t.nav.products },
              { href: '/services', label: t.nav.services },
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                className={`block py-4 px-6 text-base font-medium border-b border-gray-800/50 ${
                  isActive(href) ? 'text-amber-400' : 'text-gray-300'
                }`}
              >
                {label}
              </Link>
            ))}

            {/* Calculators accordion */}
            <div className="border-b border-gray-800/50">
              <button
                onClick={() => setCalcMobileOpen(v => !v)}
                className={`w-full flex items-center justify-between py-4 px-6 text-base font-medium ${
                  isActive('/calculators') ? 'text-amber-400' : 'text-gray-300'
                }`}
              >
                <span>{t.nav.calculators}</span>
                <ChevronDown
                  size={16}
                  className={`transition-transform duration-200 ${calcMobileOpen ? 'rotate-180' : ''}`}
                />
              </button>
              {calcMobileOpen && (
                <div className="pb-2 px-6 flex flex-col gap-0.5">
                  {calcLinks.map(({ href, en, hi, isNew, hasDivider }) => (
                    <div key={href} className="w-full">
                      {hasDivider && <div className="my-1 border-t border-gray-800/30" />}
                      <Link
                        href={href}
                        onClick={() => setMobileOpen(false)}
                        className={`flex items-center py-3 text-sm border-b border-gray-800/30 w-full ${
                          isActive(href) ? 'text-amber-400 font-semibold' : 'text-gray-400'
                        }`}
                      >
                        <span>{lang === 'en' ? en : hi}</span>
                        {isNew && (
                          <span className="bg-amber-500 text-white text-[10px] px-1.5 py-0.5 rounded-full ml-2 font-bold">
                            {lang === 'en' ? 'New' : 'नया'}
                          </span>
                        )}
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {[
              { href: '/compare', en: 'Compare Plans', hi: 'प्लान तुलना' },
              { href: '/blog',    en: 'Blog',          hi: 'ब्लॉग' },
            ].map(({ href, en, hi }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                className={`block py-4 px-6 text-base font-medium border-b border-gray-800/50 ${
                  isActive(href) ? 'text-amber-400' : 'text-gray-300'
                }`}
              >
                {lang === 'en' ? en : hi}
              </Link>
            ))}
          </div>

          {/* Drawer bottom: lang + CTA */}
          <div className="px-6 pb-8 pt-4 space-y-3">
            <div className="flex items-center gap-3 text-sm text-gray-400 mb-4">
              <button
                onClick={() => setLang('en')}
                className={`px-3 py-2.5 rounded-lg border transition-colors ${lang === 'en' ? 'border-amber-500 text-amber-400' : 'border-gray-700 hover:border-gray-500'}`}
              >
                English
              </button>
              <button
                onClick={() => setLang('hi')}
                className={`px-3 py-2.5 rounded-lg border transition-colors ${lang === 'hi' ? 'border-amber-500 text-amber-400' : 'border-gray-700 hover:border-gray-500'}`}
              >
                हिंदी
              </button>
            </div>
            <Link
              href="/contact"
              onClick={() => setMobileOpen(false)}
              className="block w-full text-center bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm py-4 rounded-xl transition-colors"
            >
              {t.nav.getQuote}
            </Link>
          </div>
        </div>
      )}
    </>
  )
}
