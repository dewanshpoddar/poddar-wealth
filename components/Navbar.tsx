'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useLang } from '@/lib/LangContext'
import { ChevronDown, Menu, X, Search, Trophy, ShieldCheck, Sparkles } from 'lucide-react'
import Image from 'next/image'
import SearchModal from '@/components/SearchModal'

export default function Navbar() {
  const { lang, setLang, t } = useLang()
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [calcMobileOpen, setCalcMobileOpen] = useState(false)
  const [servicesMobileOpen, setServicesMobileOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => { setMobileOpen(false) }, [pathname])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  if (pathname?.startsWith('/lp/')) return null

  const isActive = (path: string) =>
    path === '/' ? pathname === '/' : pathname.startsWith(path)

  const brandNameCls = scrolled ? 'text-amber-400' : 'text-[#7a5400]'
  const brandSubCls = scrolled ? 'text-orange-400 font-bold' : 'text-orange-600 font-bold'
  const chevronCls = scrolled ? 'text-gray-400' : 'text-gray-500'

  const linkCls = (path: string) => {
    const activeColor = scrolled ? 'text-amber-400 font-semibold' : 'text-amber-600 font-semibold'
    const inactiveColor = scrolled ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-[#12152a]'
    return `relative text-sm font-medium transition-colors duration-200 pb-0.5
      after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:h-[2px] after:w-0
      hover:after:w-full after:bg-gold after:transition-all after:duration-300
      ${isActive(path) ? `${activeColor} after:w-full` : inactiveColor}`
  }

  const calcLinks = [
    { href: '/calculators/premium',         en: 'Premium Calculator',       hi: 'प्रीमियम कैलकुलेटर' },
    { href: '/calculators/life-insurance',  en: 'Life Insurance Calculator', hi: 'जीवन बीमा कैलकुलेटर' },
    { href: '/calculators/retirement',      en: 'Retirement Planner',        hi: 'रिटायरमेंट प्लानर' },
    { href: '/calculators/surrender-value', en: 'Surrender Value',           hi: 'सरेंडर वैल्यू' },
    { href: '/calculators/maturity',        en: 'Maturity Calculator',       hi: 'मैच्योरिटी कैलकुलेटर' },
    { href: '/calculators/loan',            en: 'Loan Against Policy',       hi: 'पॉलिसी पर लोन' },
    { href: '/calculators/policy-health',   en: 'Policy Health Score',       hi: 'पॉलिसी हेल्थ स्कोर', isNew: true, hasDivider: true },
    { href: '/analyzers/policy-document',   en: 'AI Policy Analyzer',        hi: 'AI पॉलिसी विश्लेषक', isNew: true },
    { href: '/nav-tracker',                 en: 'LIC ULIP NAV Tracker',      hi: 'LIC ULIP NAV ट्रैकर', isNew: true },
  ]

  const servicesLinks = [
    { href: '/services/life-insurance',   en: 'Life Protection',   hi: 'जीवन सुरक्षा' },
    { href: '/services/health-insurance', en: 'Health Insurance',  hi: 'स्वास्थ्य बीमा' },
    { href: '/services/retirement',       en: 'Retirement Income', hi: 'सेवानिवृत्ति आय' },
    { href: '/services/child-planning',   en: 'Child Plans',       hi: 'बाल नियोजन' },
    { href: '/services/tax-planning',     en: 'Tax Planning',      hi: 'कर नियोजन' },
    { href: '/services/keyman-insurance', en: 'Keyman Insurance',  hi: 'कीमैन बीमा' },
  ]

  const label = (en: string, hi: string) => lang === 'hi' ? hi : en

  return (
    <>
      <nav className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-gray-950/95 backdrop-blur-sm border-b border-gray-800 shadow-md'
          : 'bg-white border-b border-gray-100'
      }`}>

        {/* Desktop bar */}
        <div className="hidden md:flex max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 h-20 items-center justify-between gap-4">

          {/* Logo + Brand */}
          <Link href="/" className="flex items-center gap-3.5 shrink-0 group">
            <div className="w-11 h-11 rounded-xl overflow-hidden flex items-center justify-center p-1.5 flex-shrink-0 bg-white border border-gray-100 shadow-sm transition-transform duration-300 group-hover:scale-105">
              <Image src="/assets/pwm-logo.svg" alt="Poddar Wealth Management" width={44} height={44} className="w-full h-full object-contain" priority />
            </div>
            <div className="flex flex-col min-w-0 justify-center">
              <span className={`text-[17px] lg:text-[20px] font-bold tracking-tight font-display transition-colors leading-tight ${brandNameCls}`}>
                Poddar Wealth Management
              </span>
              <span className={`text-[8px] lg:text-[9px] font-bold tracking-[0.18em] uppercase mt-0.5 transition-colors ${brandSubCls}`}>
                Excellence in Service Since 1994
              </span>
            </div>
          </Link>

          {/* Primary nav links */}
          <div className="flex items-center gap-5 lg:gap-7">
            <Link href="/about" className={linkCls('/about')}>{t.nav.about}</Link>
            <Link href="/products" className={linkCls('/products')}>{t.nav.products}</Link>
            <Link href="/compare" className={linkCls('/compare')}>{t.nav.compare}</Link>
            <Link href="/blog" className={linkCls('/blog')}>{t.nav.blog}</Link>

            {/* Calculators dropdown */}
            <div className="relative group/calc">
              <button className={`flex items-center gap-1 text-sm font-medium transition-colors duration-200 cursor-pointer ${
                scrolled ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-[#12152a]'
              }`}>
                {t.nav.calculators}
                <ChevronDown size={14} className={`${chevronCls} group-hover/calc:rotate-180 transition-transform duration-200`} />
              </button>
              <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 opacity-0 invisible group-hover/calc:opacity-100 group-hover/calc:visible transition-all duration-200 z-50">
                <div className={`border rounded-xl shadow-xl p-2 min-w-[240px] ${
                  scrolled ? 'bg-[#0f1225] border-white/[0.08]' : 'bg-white border-gray-200'
                }`}>
                  {calcLinks.map(({ href, en, hi, isNew, hasDivider }) => (
                    <div key={href}>
                      {hasDivider && <div className={`my-1 border-t ${scrolled ? 'border-white/[0.06]' : 'border-gray-100'}`} />}
                      <Link
                        href={href}
                        className={`flex items-center px-4 py-2.5 text-xs rounded-lg transition-colors ${
                          isActive(href)
                            ? scrolled ? 'text-amber-400 bg-white/5 font-semibold' : 'text-amber-600 bg-gray-50 font-semibold'
                            : scrolled ? 'text-gray-400 hover:text-white hover:bg-white/5' : 'text-gray-600 hover:text-[#12152a] hover:bg-gray-50'
                        }`}
                      >
                        <span>{label(en, hi)}</span>
                        {isNew && (
                          <span className="bg-amber-500 text-white text-[9px] px-1.5 py-0.5 rounded-full ml-2 font-bold animate-pulse">
                            {label('New', 'नया')}
                          </span>
                        )}
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Services dropdown */}
            <div className="relative group/services">
              <button className={`flex items-center gap-1 text-sm font-medium transition-colors duration-200 cursor-pointer ${
                scrolled ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-[#12152a]'
              }`}>
                {t.nav.services}
                <ChevronDown size={14} className={`${chevronCls} group-hover/services:rotate-180 transition-transform duration-200`} />
              </button>
              <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 opacity-0 invisible group-hover/services:opacity-100 group-hover/services:visible transition-all duration-200 z-50">
                <div className={`border rounded-xl shadow-xl p-2 min-w-[220px] ${
                  scrolled ? 'bg-[#0f1225] border-white/[0.08]' : 'bg-white border-gray-200'
                }`}>
                  {servicesLinks.map(({ href, en, hi }) => (
                    <Link
                      key={href}
                      href={href}
                      className={`block px-4 py-2 text-xs rounded-lg transition-colors ${
                        isActive(href)
                          ? scrolled ? 'text-amber-400 bg-white/5 font-semibold' : 'text-amber-600 bg-gray-50 font-semibold'
                          : scrolled ? 'text-gray-400 hover:text-white hover:bg-white/5' : 'text-gray-600 hover:text-[#12152a] hover:bg-gray-50'
                      }`}
                    >
                      {label(en, hi)}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setIsSearchOpen(true)}
              aria-label="Open Search"
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                scrolled ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-[#12152a]'
              }`}
            >
              <Search size={16} />
            </button>

            {/* EN / हिंदी toggle — desktop shows only 2 languages */}
            <div className="flex bg-gray-800/50 rounded-full p-0.5 border border-white/5">
              <button
                onClick={() => setLang('en')}
                className={`w-7 h-7 text-[9px] font-bold rounded-full flex items-center justify-center transition-colors cursor-pointer ${
                  lang === 'en' ? 'bg-amber-500 text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLang('hi')}
                className={`w-7 h-7 text-[9px] font-bold rounded-full flex items-center justify-center transition-colors cursor-pointer ${
                  lang === 'hi' ? 'bg-amber-500 text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                हि
              </button>
            </div>

            <Link
              href="/client"
              className={`text-sm transition-colors duration-200 cursor-pointer ${
                scrolled ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-slate-900 font-medium'
              }`}
            >
              {label('Client Login', 'क्लाइंट लॉगिन')}
            </Link>

            <Link
              href="/contact"
              className="bg-amber-500 hover:bg-amber-600 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm shadow-sm hover:shadow-md"
            >
              {label('Get a free quote', 'फ्री कोट')}
            </Link>
          </div>
        </div>

        {/* Mobile header */}
        <div className="md:hidden flex items-center gap-2 px-4 h-16 w-full">
          <Link href="/" className="flex items-center gap-2 flex-1 min-w-0" onClick={() => setMobileOpen(false)}>
            <Image src="/assets/pwm-logo.svg" alt="Poddar Wealth" width={36} height={36} className="flex-shrink-0" />
            <span className={`min-w-0 truncate text-sm font-bold uppercase tracking-wide transition-colors ${
              scrolled ? 'text-amber-400' : 'text-amber-600'
            }`}>
              Poddar Wealth
            </span>
          </Link>

          {/* Mobile: EN / हिंदी only */}
          <div className="flex bg-gray-800/50 rounded-full p-0.5 flex-shrink-0 border border-white/5">
            <button
              onClick={() => setLang('en')}
              className={`w-7 h-7 text-[9px] font-bold rounded-full flex items-center justify-center transition-colors cursor-pointer ${
                lang === 'en' ? 'bg-amber-500 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLang('hi')}
              className={`w-7 h-7 text-[9px] font-bold rounded-full flex items-center justify-center transition-colors cursor-pointer ${
                lang === 'hi' ? 'bg-amber-500 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              हि
            </button>
          </div>

          <button
            onClick={() => setMobileOpen(true)}
            className={`flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-800/50 transition-colors cursor-pointer ${
              scrolled ? 'text-white' : 'text-gray-800'
            }`}
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>
        </div>
      </nav>

      {/* Mobile full-screen drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[100] bg-[#070913] flex flex-col md:hidden overflow-y-auto">
          {/* Drawer header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-white/[0.06] bg-[#0B0E1A]">
            <Link href="/" onClick={() => setMobileOpen(false)} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl overflow-hidden bg-white p-1 flex-shrink-0 border border-white/10">
                <Image src="/assets/pwm-logo.svg" alt="Poddar Wealth Management" width={36} height={36} className="w-full h-full object-contain" />
              </div>
              <div className="flex flex-col">
                <span className="text-[15px] font-bold tracking-tight text-white font-display leading-tight">
                  Poddar Wealth Management
                </span>
                <span className="text-[8px] font-bold tracking-[0.15em] uppercase text-gray-400 mt-0.5">
                  Excellence Since 1994
                </span>
              </div>
            </Link>
            <button onClick={() => setMobileOpen(false)} className="text-gray-400 hover:text-white p-1 cursor-pointer">
              <X size={22} />
            </button>
          </div>

          {/* Drawer nav links */}
          <div className="flex-1 px-0 py-2">
            <Link
              href="/about"
              onClick={() => setMobileOpen(false)}
              className={`block py-4 px-6 text-base font-semibold border-b border-white/[0.04] ${isActive('/about') ? 'text-amber-400' : 'text-gray-300'}`}
            >
              {t.nav.about}
            </Link>

            {/* Services accordion */}
            <div className="border-b border-white/[0.04]">
              <button
                onClick={() => setServicesMobileOpen(v => !v)}
                className={`w-full flex items-center justify-between py-4 px-6 text-base font-semibold text-left cursor-pointer ${
                  isActive('/services') ? 'text-amber-400' : 'text-gray-300'
                }`}
              >
                <span>{t.nav.services}</span>
                <ChevronDown size={16} className={`transition-transform duration-200 ${servicesMobileOpen ? 'rotate-180' : ''}`} />
              </button>
              {servicesMobileOpen && (
                <div className="pb-3 px-6 bg-white/[0.01] flex flex-col gap-0.5">
                  {servicesLinks.map(({ href, en, hi }) => (
                    <Link
                      key={href}
                      href={href}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center py-2.5 text-sm w-full ${
                        isActive(href) ? 'text-amber-400 font-semibold' : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      {label(en, hi)}
                    </Link>
                  ))}
                  <div className="my-1 border-t border-white/[0.04]" />
                  <Link
                    href="/services"
                    onClick={() => setMobileOpen(false)}
                    className="block py-2 text-xs font-semibold text-amber-400"
                  >
                    {label('All Services →', 'सभी सेवाएं →')}
                  </Link>
                </div>
              )}
            </div>

            <Link
              href="/products"
              onClick={() => setMobileOpen(false)}
              className={`block py-4 px-6 text-base font-semibold border-b border-white/[0.04] ${isActive('/products') ? 'text-amber-400' : 'text-gray-300'}`}
            >
              {t.nav.products}
            </Link>

            {/* Calculators accordion */}
            <div className="border-b border-white/[0.04]">
              <button
                onClick={() => setCalcMobileOpen(v => !v)}
                className={`w-full flex items-center justify-between py-4 px-6 text-base font-semibold text-left cursor-pointer ${
                  isActive('/calculators') ? 'text-amber-400' : 'text-gray-300'
                }`}
              >
                <span>{t.nav.calculators}</span>
                <ChevronDown size={16} className={`transition-transform duration-200 ${calcMobileOpen ? 'rotate-180' : ''}`} />
              </button>
              {calcMobileOpen && (
                <div className="pb-3 px-6 bg-white/[0.01] flex flex-col gap-0.5">
                  {calcLinks.map(({ href, en, hi, isNew, hasDivider }) => (
                    <div key={href} className="w-full">
                      {hasDivider && <div className="my-1 border-t border-white/[0.04]" />}
                      <Link
                        href={href}
                        onClick={() => setMobileOpen(false)}
                        className={`flex items-center py-2.5 text-sm w-full ${
                          isActive(href) ? 'text-amber-400 font-semibold' : 'text-gray-400 hover:text-white'
                        }`}
                      >
                        <span>{label(en, hi)}</span>
                        {isNew && (
                          <span className="bg-amber-500 text-white text-[9px] px-1.5 py-0.5 rounded-full ml-2 font-bold">
                            {label('New', 'नया')}
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
              { href: '/client',  en: 'Client Login',  hi: 'क्लाइंट लॉगिन' },
            ].map(({ href, en, hi }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                className={`block py-4 px-6 text-base font-semibold border-b border-white/[0.04] ${
                  isActive(href) ? 'text-amber-400' : 'text-gray-300'
                }`}
              >
                {label(en, hi)}
              </Link>
            ))}

            <button
              onClick={() => { setMobileOpen(false); setIsSearchOpen(true) }}
              className="w-full text-left py-4 px-6 text-base font-semibold border-b border-white/[0.04] text-gray-300 hover:text-amber-400 transition-colors cursor-pointer"
            >
              {label('Search', 'खोजें')}
            </button>

            <Link
              href="/become-advisor"
              onClick={() => setMobileOpen(false)}
              className="block py-4 px-6 text-base font-semibold border-b border-white/[0.04] text-amber-400 hover:text-amber-300"
            >
              {label('Join as Advisor →', 'सलाहकार बनें →')}
            </Link>
          </div>

          {/* Trust badges */}
          <div className="px-6 py-5 border-t border-white/[0.06] bg-white/[0.02] space-y-3">
            <div className="text-[10px] font-bold tracking-widest uppercase text-gray-500 mb-1">
              {label('Established Trust', 'स्थापित भरोसा')}
            </div>
            <div className="grid grid-cols-1 gap-2.5">
              {[
                { icon: <Trophy size={16} className="text-amber-500 flex-shrink-0" />, en: 'MDRT® Member (USA)', hi: 'MDRT® सदस्य (USA)' },
                { icon: <Sparkles size={16} className="text-amber-500 flex-shrink-0" />, en: '31+ Years Legacy', hi: '31+ साल का अटूट भरोसा' },
                { icon: <ShieldCheck size={16} className="text-amber-500 flex-shrink-0" />, en: '5000+ Families Protected', hi: '5000+ सुरक्षित परिवार' },
              ].map(({ icon, en, hi }) => (
                <div key={en} className="flex items-center gap-3 bg-white/[0.03] px-3.5 py-3 rounded-xl border border-white/5">
                  {icon}
                  <span className="text-xs font-semibold text-gray-300">{label(en, hi)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Drawer bottom: lang + CTA */}
          <div className="px-6 pb-10 pt-6 space-y-4 border-t border-white/[0.06] bg-[#0B0E1A]">
            {/* Mobile drawer shows EN + हिंदी + বাংলা for those who prefer Bengali */}
            <div className="flex items-center gap-2.5 text-[11px] text-gray-400">
              {(['en', 'hi', 'bn'] as const).map((l, i) => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className={`flex-1 py-2.5 rounded-xl border text-center transition-colors font-semibold cursor-pointer ${
                    lang === l ? 'border-amber-500 text-amber-400 bg-amber-500/5' : 'border-white/[0.08] hover:border-white/[0.15] text-gray-400'
                  }`}
                >
                  {['English', 'हिंदी', 'বাংলা'][i]}
                </button>
              ))}
            </div>
            <Link
              href="/contact"
              onClick={() => setMobileOpen(false)}
              className="block w-full text-center bg-gold hover:bg-gold-hover text-white font-bold text-xs uppercase tracking-widest py-4 rounded-xl transition-colors border border-gold-darker/10"
            >
              {t.nav.getQuote}
            </Link>
          </div>
        </div>
      )}

      {isSearchOpen && <SearchModal onClose={() => setIsSearchOpen(false)} />}
    </>
  )
}
