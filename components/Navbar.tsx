'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useLang } from '@/lib/LangContext'
import { ChevronDown, Menu, X, Search, Trophy, ShieldCheck, Sparkles } from 'lucide-react'
import Image from 'next/image'
import dynamic from 'next/dynamic'

const SearchModal = dynamic(() => import('@/components/SearchModal'), { ssr: false })

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

  const brandNameCls = scrolled ? 'text-white' : 'text-[#0f1225]'
  const brandSubCls = scrolled ? 'text-amber-500/70 font-normal tracking-[0.22em]' : 'text-amber-700/60 font-normal tracking-[0.22em]'
  const chevronCls = scrolled ? 'text-gray-500' : 'text-gray-400'

  const linkCls = (path: string) => {
    const activeColor = scrolled ? 'text-amber-400 font-semibold' : 'text-amber-600 font-semibold'
    const inactiveColor = scrolled ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-[#12152a]'
    return `relative text-sm font-medium transition-colors duration-200 py-3 min-h-[44px] flex items-center
      after:absolute after:bottom-1.5 after:left-1/2 after:-translate-x-1/2 after:h-[2px] after:w-0
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

  const supportLinks = [
    { href: '/pay-premium', en: 'Pay Premium',  hi: 'प्रीमियम भुगतान' },
    { href: '/claims',      en: 'File a Claim', hi: 'दावा सहायता' },
    { href: '/faq',         en: 'FAQs',         hi: 'FAQs' },
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
              <Image src="/assets/pwm-logo.svg" alt="" width={44} height={44} className="w-full h-full object-contain" priority />
            </div>
            <div className="flex flex-col min-w-0 justify-center">
              <span className={`text-[16px] lg:text-[18px] font-bold tracking-tight font-display transition-colors duration-300 leading-tight ${brandNameCls}`}>
                Poddar Wealth Management
              </span>
              <span className={`text-[8px] uppercase mt-0.5 transition-colors duration-300 ${brandSubCls}`}>
                Excellence in Service Since 1994
              </span>
            </div>
          </Link>

          {/* Primary nav links */}
          <div className="flex items-center gap-5 lg:gap-7">
            <Link href="/about" className={linkCls('/about')}>{t.nav.about}</Link>

            {/* Services dropdown */}
            <div className="relative group/services">
              <button className={`flex items-center gap-1 text-sm font-medium transition-colors duration-200 cursor-pointer py-3.5 min-h-[44px] ${
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
                  
                  <div className={`my-1 border-t ${scrolled ? 'border-white/[0.06]' : 'border-gray-100'}`} />
                  <Link
                    href="/become-advisor"
                    className={`block px-4 py-2 text-xs rounded-lg transition-colors font-semibold text-amber-500 hover:text-amber-600 ${
                      scrolled ? 'hover:bg-white/5' : 'hover:bg-gray-50'
                    }`}
                  >
                    {label('Join as Advisor →', 'सलाहकार बनें →')}
                  </Link>
                </div>
              </div>
            </div>

            {/* Calculators dropdown */}
            <div className="relative group/calc">
              <button className={`flex items-center gap-1 text-sm font-medium transition-colors duration-200 cursor-pointer py-3.5 min-h-[44px] ${
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

            <Link href="/blog" className={linkCls('/blog')}>{t.nav.blog}</Link>

            {/* Support dropdown */}
            <div className="relative group/support">
              <button className={`flex items-center gap-1 text-sm font-medium transition-colors duration-200 cursor-pointer py-3.5 min-h-[44px] ${
                scrolled ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-[#12152a]'
              }`}>
                {label('Support', 'सहायता')}
                <ChevronDown size={14} className={`${chevronCls} group-hover/support:rotate-180 transition-transform duration-200`} />
              </button>
              <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 opacity-0 invisible group-hover/support:opacity-100 group-hover/support:visible transition-all duration-200 z-50">
                <div className={`border rounded-xl shadow-xl p-2 min-w-[160px] ${
                  scrolled ? 'bg-[#0f1225] border-white/[0.08]' : 'bg-white border-gray-200'
                }`}>
                  {supportLinks.map(({ href, en, hi }) => (
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
          <div className="flex items-center gap-5 shrink-0">
            {/* Search — icon only, no box */}
            <button
              onClick={() => setIsSearchOpen(true)}
              aria-label="Open Search"
              className={`flex items-center justify-center w-8 h-8 transition-colors duration-200 cursor-pointer ${
                scrolled ? 'text-gray-400 hover:text-white' : 'text-gray-400 hover:text-[#0f1225]'
              }`}
            >
              <Search size={15} />
            </button>

            {/* EN · हिं — slim pill, no min-h forcing */}
            <div className={`flex rounded-full p-[3px] border ${
              scrolled ? 'bg-white/5 border-white/10' : 'bg-gray-100 border-gray-200'
            }`}>
              <button
                onClick={() => setLang('en')}
                className={`px-2.5 py-1 text-[10px] font-semibold rounded-full transition-all duration-200 cursor-pointer ${
                  lang === 'en'
                    ? 'bg-amber-500 text-white'
                    : scrolled ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLang('hi')}
                className={`px-2.5 py-1 text-[10px] font-semibold rounded-full transition-all duration-200 cursor-pointer ${
                  lang === 'hi'
                    ? 'bg-amber-500 text-white'
                    : scrolled ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                हिं
              </button>
            </div>

            {/* Login — single entry point, role-based routing after auth */}
            <Link
              href="/login"
              className={`text-[13px] font-medium transition-colors duration-200 ${
                scrolled ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-[#0f1225]'
              }`}
            >
              {label('Login', 'लॉगिन')}
            </Link>

            {/* Primary CTA — sleek rounded pill */}
            <Link
              href="/contact"
              className={`text-[13px] font-semibold px-4 py-2 rounded-full transition-all duration-200 ${
                scrolled
                  ? 'bg-amber-500 text-white hover:bg-amber-400'
                  : 'bg-[#0f1225] text-amber-400 hover:bg-[#1a1f3c]'
              }`}
            >
              {label('Get a Quote', 'फ्री कोट')}
            </Link>
          </div>
        </div>

        {/* Mobile header */}
        <div className="md:hidden flex items-center gap-2 px-4 h-16 w-full">
          <Link href="/" className="flex items-center gap-2 flex-1 min-w-0" onClick={() => setMobileOpen(false)}>
            <Image src="/assets/pwm-logo.svg" alt="" width={36} height={36} className="flex-shrink-0" />
            <span className={`flex-1 min-w-0 truncate text-sm font-bold uppercase tracking-wide transition-colors ${
              scrolled ? 'text-amber-400' : 'text-amber-600'
            }`}>
              Poddar Wealth
            </span>
          </Link>

          {/* Mobile lang toggle — pill */}
          <div className={`flex rounded-full p-0.5 flex-shrink-0 border h-11 items-stretch ${
            scrolled ? 'bg-gray-800/50 border-white/5' : 'bg-gray-100 border-gray-200'
          }`}>
            <button
              onClick={() => setLang('en')}
              className={`px-3 text-[10px] font-bold rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer min-w-[44px] ${
                lang === 'en'
                  ? 'bg-amber-500 text-white shadow-sm'
                  : scrolled ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLang('hi')}
              className={`px-3 text-[10px] font-bold rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer min-w-[44px] ${
                lang === 'hi'
                  ? 'bg-amber-500 text-white shadow-sm'
                  : scrolled ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              हि
            </button>
          </div>

          <Link
            href="/pay-premium"
            className="flex-shrink-0 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs px-3 py-2.5 min-h-[44px] rounded-lg transition-colors shadow-sm flex items-center justify-center"
          >
            {label('Pay Premium', 'भुगतान')}
          </Link>

          <button
            onClick={() => setMobileOpen(true)}
            className={`flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-lg hover:bg-gray-800/50 transition-colors cursor-pointer ${
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
                <Image src="/assets/pwm-logo.svg" alt="" width={36} height={36} className="w-full h-full object-contain" />
              </div>
              <div className="flex flex-col">
                <span className="text-[15px] font-bold tracking-tight text-white font-display leading-tight">
                  Poddar Wealth Management
                </span>
                <span className="text-[8px] font-bold tracking-[0.15em] uppercase text-gray-300 mt-0.5">
                  Excellence Since 1994
                </span>
              </div>
            </Link>
            <button onClick={() => setMobileOpen(false)} className="text-gray-300 hover:text-white p-2.5 cursor-pointer min-w-[44px] min-h-[44px] flex items-center justify-center">
              <X size={22} />
            </button>
          </div>

          {/* Drawer nav links */}
          <div className="flex-1 px-0 py-2">
            <div className="px-6 py-4 border-b border-white/[0.04] bg-amber-500/10">
              <Link
                href="/pay-premium"
                onClick={() => setMobileOpen(false)}
                className="block w-full text-center bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm py-3 rounded-xl transition-colors shadow-sm"
              >
                {label('Pay Premium', 'प्रीमियम भुगतान')}
              </Link>
            </div>

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
                  
                  {/* Support Subsection in Mobile */}
                  <div className="my-1.5 border-t border-white/[0.04]" />
                  <div className="px-1 py-1 text-[10px] font-bold uppercase tracking-wider text-gray-500">
                    {label('Support', 'सहायता')}
                  </div>
                  {supportLinks.map(({ href, en, hi }) => (
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
              { href: '/login',   en: 'Login',         hi: 'लॉगिन' },
              { href: '/blog',    en: 'Blog',          hi: 'ब्लॉग' },
              { href: '/client',  en: 'Client Portal',  hi: 'क्लाइंट पोर्टल' },
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
                { icon: <Trophy size={16} className="text-amber-500 flex-shrink-0" />, en: 'MDRT® Member', hi: 'MDRT® सदस्य' },
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
            <div className="flex items-center gap-2.5 text-[11px] text-gray-300">
              {(['en', 'hi', 'bn'] as const).map((l, i) => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className={`flex-1 py-3 rounded-xl border text-center transition-colors font-semibold cursor-pointer min-h-[44px] flex items-center justify-center ${
                    lang === l ? 'border-amber-500 text-amber-400 bg-amber-500/5' : 'border-white/[0.08] hover:border-white/[0.15] text-gray-300'
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
