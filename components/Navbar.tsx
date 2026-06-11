'use client'
import { useState, useEffect, useRef } from 'react'
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
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  // Scroll detection for transition
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => { setMobileOpen(false) }, [pathname])

  // Prevent body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  if (pathname?.startsWith('/lp/')) return null

  const isActive = (path: string) =>
    path === '/' ? pathname === '/' : pathname.startsWith(path)

  // Dynamic style tokens based on scroll state (Classy, muted colors matching reference)
  const brandNameCls = scrolled ? 'text-amber-400' : 'text-[#7a5400]'
  const brandSubCls = scrolled ? 'text-orange-400 font-bold' : 'text-orange-600 font-bold'
  const logoBgCls = 'bg-white border border-gray-100 shadow-sm'
  const chevronCls = scrolled ? 'text-gray-400' : 'text-gray-500'
  const controlCls = scrolled ? 'text-gray-300 hover:text-white hover:bg-white/5' : 'text-gray-600 hover:text-[#12152a] hover:bg-gray-100'

  // Nav link style (Reverted to original premium font styling)
  const linkCls = (path: string) => {
    const activeColor = scrolled ? 'text-amber-400 font-semibold' : 'text-amber-600 font-semibold'
    const inactiveColor = scrolled ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-[#12152a]'
    return `relative text-sm font-medium transition-colors duration-200 pb-0.5
      after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:h-[2px] after:w-0
      hover:after:w-full after:bg-gold after:transition-all after:duration-300
      ${isActive(path) ? `${activeColor} after:w-full` : `${inactiveColor}`}`
  }

  const calcLinks = [
    { href: '/calculators/premium',        en: 'Premium Calculator',      hi: 'प्रीमियम कैलकुलेटर', bn: 'প্রিমিয়াম ক্যালকুলেটর' },
    { href: '/calculators/life-insurance', en: 'Life Insurance Calculator',hi: 'जीवन बीमा कैलकुलेटर', bn: 'জীবন বীমা ক্যালকুলেটর' },
    { href: '/calculators/retirement',     en: 'Retirement Planner',       hi: 'रिटायरमेंट प्लानर',   bn: 'অবসর পরিকল্পনা' },
    { href: '/calculators/surrender-value',en: 'Surrender Value',          hi: 'सरेंडर वैल्यू',       bn: 'সারেন্ডার ভ্যালু' },
    { href: '/calculators/maturity',       en: 'Maturity Calculator',      hi: 'मैच्योरिटी कैलकुलेटर', bn: 'ম্যাচিউরিটি ক্যালকুলেটর' },
    { href: '/calculators/loan',           en: 'Loan Against Policy',      hi: 'पॉलिसी पर लोन',       bn: 'পলিসি উপর ঋণ' },
    { href: '/calculators/policy-health',  en: 'Policy Health Score',      hi: 'पॉलिसी हेल्थ स्कोर', isNew: true, hasDivider: true, bn: 'পলিসি হেলথ স্কোর' },
    { href: '/analyzers/policy-document',  en: 'AI Policy Analyzer',       hi: 'AI पॉलिसी विश्लेषक', isNew: true, hasDivider: true, bn: 'AI পলিসি বিশ্লেষক' },
    { href: '/nav-tracker',                en: 'LIC ULIP NAV Tracker',     hi: 'LIC ULIP NAV ट्रैकर', isNew: true, hasDivider: true, bn: 'LIC ULIP NAV ট্র্যাকার' },
  ]

  const servicesLinks = [
    { href: '/services/life-insurance',  en: 'Life Protection',  hi: 'जीवन सुरक्षा',   bn: 'जीवन সুরক্ষা' },
    { href: '/services/health-insurance', en: 'Health Insurance', hi: 'स्वास्थ्य बीमा',  bn: 'स्वास्थ्य बीमा' },
    { href: '/services/retirement',      en: 'Retirement Income', hi: 'सेवानिवृत्ति आय', bn: 'অবসর আয়' },
    { href: '/services/child-planning',  en: 'Child Plans',       hi: 'बाल नियोजन',    bn: 'শিশু পরিকল্পনা' },
    { href: '/services/tax-planning',    en: 'Tax Planning',      hi: 'कर नियोजन',     bn: 'কর পরিকল্পনা' },
    { href: '/services/keyman-insurance', en: 'Keyman Insurance', hi: 'कीमैन बीमा',     bn: 'কীম্যান ইন্সুরেন্স' },
  ]

  return (
    <>
      <nav className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-gray-950/95 backdrop-blur-sm border-b border-gray-800 shadow-md'
          : 'bg-white border-b border-gray-100'
      }`}>
        
        {/* Main Navigation Bar */}
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* LEFT — Brand Block (Classy mixed-case serif) */}
          <Link href="/" className="flex items-center gap-3.5 shrink-0 min-w-0 group">
            <div className={`w-11 h-11 rounded-xl overflow-hidden flex items-center justify-center p-1.5 flex-shrink-0 transition-all duration-300 group-hover:scale-105 ${logoBgCls}`}>
              <Image
                src="/assets/pwm-logo.svg"
                alt="Poddar Wealth Management"
                width={44}
                height={44}
                className="w-full h-full object-contain animate-fade-in"
                priority
              />
            </div>
            <div className="flex flex-col min-w-0 justify-center">
              <span className={`text-[17px] md:text-lg lg:text-[20px] font-bold tracking-tight font-display transition-colors leading-tight ${brandNameCls}`}>
                Poddar Wealth Management
              </span>
              <span className={`text-[8px] md:text-[9px] font-bold tracking-[0.18em] uppercase mt-0.5 transition-colors ${brandSubCls}`}>
                Excellence in Service Since 1994
              </span>
            </div>
          </Link>

          {/* CENTER — Desktop Primary Navigation */}
          <div className="hidden md:flex items-center gap-5 lg:gap-8">
            <Link href="/about" className={linkCls('/about')}>
              {t.nav.about}
            </Link>

            <Link href="/products" className={linkCls('/products')}>
              {t.nav.products}
            </Link>

            <Link href="/compare" className={linkCls('/compare')}>
              {t.nav.compare}
            </Link>

            <Link href="/blog" className={linkCls('/blog')}>
              {t.nav.blog}
            </Link>

            {/* Calculators Dropdown on Hover */}
            <div className="relative group/calc">
              <button className={`flex items-center gap-1 text-[13px] lg:text-sm font-medium transition-colors duration-200 pb-0.5 cursor-pointer ${
                scrolled ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-[#12152a]'
              }`}>
                {t.nav.calculators}
                <ChevronDown size={14} className={`${chevronCls} group-hover/calc:rotate-180 transition-transform duration-200`} />
              </button>
              {/* Outer wrapper to bridge hover gap */}
              <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 opacity-0 invisible group-hover/calc:opacity-100 group-hover/calc:visible transition-all duration-200 z-50">
                <div className={`border rounded-xl shadow-xl p-2 min-w-[240px] ${
                  scrolled ? 'bg-[#0f1225] border-white/[0.08]' : 'bg-white border-gray-200'
                }`}>
                  {calcLinks.map(({ href, en: cEn, hi: cHi, bn: cBn, isNew, hasDivider }) => (
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
                        <span>{lang === 'en' ? cEn : lang === 'hi' ? cHi : cBn}</span>
                        {isNew && (
                          <span className="bg-amber-500 text-white text-[9px] px-1.5 py-0.5 rounded-full ml-2 font-bold animate-pulse">
                            {lang === 'en' ? 'New' : lang === 'hi' ? 'नया' : 'নতুন'}
                          </span>
                        )}
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Services Dropdown on Hover */}
            <div className="relative group/services">
              <button className={`flex items-center gap-1 text-[13px] lg:text-sm font-medium transition-colors duration-200 pb-0.5 cursor-pointer ${
                scrolled ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-[#12152a]'
              }`}>
                {t.nav.services}
                <ChevronDown size={14} className={`${chevronCls} group-hover/services:rotate-180 transition-transform duration-200`} />
              </button>
              {/* Outer wrapper to bridge hover gap */}
              <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 opacity-0 invisible group-hover/services:opacity-100 group-hover/services:visible transition-all duration-200 z-50">
                <div className={`border rounded-xl shadow-xl p-2 min-w-[220px] ${
                  scrolled ? 'bg-[#0f1225] border-white/[0.08]' : 'bg-white border-gray-200'
                }`}>
                  {servicesLinks.map(({ href, en, hi, bn }) => (
                    <Link
                      key={href}
                      href={href}
                      className={`block px-4 py-2 text-xs rounded-lg transition-colors ${
                        isActive(href)
                          ? scrolled ? 'text-amber-400 bg-white/5 font-semibold' : 'text-amber-600 bg-gray-50 font-semibold'
                          : scrolled ? 'text-gray-400 hover:text-white hover:bg-white/5' : 'text-gray-600 hover:text-[#12152a] hover:bg-gray-50'
                      }`}
                    >
                      {lang === 'en' ? en : lang === 'hi' ? hi : bn}
                    </Link>
                  ))}
                  <div className={`my-1 border-t ${scrolled ? 'border-white/[0.06]' : 'border-gray-100'}`} />
                  <Link
                    href="/services"
                    className={`block px-4 py-2 text-xs font-semibold text-center rounded-lg transition-colors ${
                      scrolled ? 'text-amber-400 hover:text-amber-300' : 'text-amber-600 hover:text-amber-700'
                    }`}
                  >
                    {lang === 'en' ? 'All Services →' : lang === 'hi' ? 'सभी सेवाएं →' : 'সব সেবা →'}
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT — Actions: Search, Language Box, Client Login Link, Primary CTA */}
          <div className="hidden md:flex items-center gap-3.5 lg:gap-4.5">
            {/* Search Trigger */}
            <button
              onClick={() => setIsSearchOpen(true)}
              aria-label="Open Search"
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                scrolled ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-[#12152a]'
              }`}
            >
              <Search size={16} />
            </button>

            {/* Prominent Language Switcher Box (EN & Hindi) */}
            <div className={`flex items-center rounded-lg border p-1 text-[10px] font-bold gap-1 transition-all duration-200 ${
              scrolled
                ? 'border-white/10 bg-white/5 text-gray-300'
                : 'border-gray-200 bg-gray-50/50 text-gray-600'
            }`}>
              <button
                onClick={() => setLang('en')}
                className={`px-1.5 py-0.5 rounded cursor-pointer transition-colors ${
                  lang === 'en'
                    ? scrolled ? 'bg-amber-500 text-white font-extrabold' : 'bg-amber-600 text-white font-extrabold'
                    : scrolled ? 'hover:text-white' : 'hover:text-[#12152a]'
                }`}
              >
                EN
              </button>
              <span className={`text-[9px] ${scrolled ? 'text-white/20' : 'text-gray-300'}`}>|</span>
              <button
                onClick={() => setLang('hi')}
                className={`px-1.5 py-0.5 rounded cursor-pointer transition-colors ${
                  lang === 'hi'
                    ? scrolled ? 'bg-amber-500 text-white font-extrabold' : 'bg-amber-600 text-white font-extrabold'
                    : scrolled ? 'hover:text-white' : 'hover:text-[#12152a]'
                }`}
              >
                हिंदी
              </button>
            </div>

            {/* Login Link: Prominent text link */}
            <Link
              href="/client"
              className={`text-[13px] font-bold tracking-tight transition-colors duration-200 ${
                scrolled
                  ? 'text-white hover:text-amber-400'
                  : 'text-slate-900 hover:text-amber-600'
              }`}
            >
              {lang === 'en' ? 'Client Login' : lang === 'hi' ? 'क्लाइंट लॉगिन' : 'ক্লায়েন্ট লগইন'}
            </Link>

            {/* Primary CTA Consultation Button (Sleek mixed-case button matching reference) */}
            <Link
              href="/contact"
              className="inline-flex items-center justify-center bg-gold hover:bg-gold-hover text-white text-xs font-semibold px-3.5 py-1.5 h-8 rounded-lg border border-gold-darker/10 transition-all duration-200 hover:-translate-y-0.5 shadow-sm"
            >
              {lang === 'en' ? 'Get free report' : lang === 'hi' ? 'फ्री रिपोर्ट' : 'ফ্রি রিপোর্ট'}
            </Link>
          </div>

          {/* Mobile Navigation Controls (Tablet/Mobile: < md screen) */}
          <div className="md:hidden flex items-center gap-2">
            {/* Mobile Language selector */}
            <div className="flex bg-gray-800/50 rounded-full p-0.5">
              <button
                className={`px-2 py-0.5 text-[10px] font-semibold rounded-full cursor-pointer transition-colors ${
                  lang === 'en' ? 'bg-amber-500 text-white' : 'text-gray-400'
                }`}
                onClick={() => setLang('en')}
              >
                EN
              </button>
              <button
                className={`px-2 py-0.5 text-[10px] font-semibold rounded-full cursor-pointer transition-colors ${
                  lang === 'hi' ? 'bg-amber-500 text-white' : 'text-gray-400'
                }`}
                onClick={() => setLang('hi')}
              >
                हिंदी
              </button>
            </div>

            <button
              onClick={() => setMobileOpen(v => !v)}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
              className={`cursor-pointer min-w-[44px] min-h-[44px] flex items-center justify-center transition-colors rounded-lg ${
                scrolled ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-[#12152a]'
              }`}
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>

        </div>
      </nav>

      {/* Mobile full-screen drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[100] bg-[#070913] flex flex-col md:hidden overflow-y-auto">
          {/* Drawer header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-white/[0.06] bg-[#0B0E1A]">
            <Link href="/" onClick={() => setMobileOpen(false)} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl overflow-hidden bg-white p-1 flex-shrink-0 border border-white/10">
                <Image src="/assets/pwm-logo.svg" alt="Poddar Wealth Management logo" width={36} height={36} className="w-full h-full object-contain" />
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
            {[
              { href: '/about',    label: t.nav.about },
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                className={`block py-4 px-6 text-base font-semibold border-b border-white/[0.04] ${
                  isActive(href) ? 'text-amber-400' : 'text-gray-300'
                }`}
              >
                {label}
              </Link>
            ))}

            {/* Services accordion */}
            <div className="border-b border-white/[0.04]">
              <button
                onClick={() => setCalcMobileOpen(v => !v)}
                className={`w-full flex items-center justify-between py-4 px-6 text-base font-semibold text-left cursor-pointer ${
                  isActive('/services') ? 'text-amber-400' : 'text-gray-300'
                }`}
              >
                <span>{t.nav.services}</span>
                <ChevronDown
                  size={16}
                  className={`transition-transform duration-200 ${calcMobileOpen ? 'rotate-180' : ''}`}
                />
              </button>
              {calcMobileOpen && (
                <div className="pb-3 px-6 bg-white/[0.01] flex flex-col gap-0.5">
                  {servicesLinks.map(({ href, en, hi, bn }) => (
                    <Link
                      key={href}
                      href={href}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center py-2.5 text-sm w-full ${
                        isActive(href) ? 'text-amber-400 font-semibold' : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      {lang === 'en' ? en : lang === 'hi' ? hi : bn}
                    </Link>
                  ))}
                  <div className="my-1 border-t border-white/[0.04]" />
                  <Link
                    href="/services"
                    onClick={() => setMobileOpen(false)}
                    className="block py-2 text-xs font-semibold text-amber-400"
                  >
                    {lang === 'en' ? 'All Services →' : lang === 'hi' ? 'सभी सेवाएं →' : 'সব সেবা →'}
                  </Link>
                </div>
              )}
            </div>

            <Link
              href="/products"
              onClick={() => setMobileOpen(false)}
              className={`block py-4 px-6 text-base font-semibold border-b border-white/[0.04] ${
                isActive('/products') ? 'text-amber-400' : 'text-gray-300'
              }`}
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
                <ChevronDown
                  size={16}
                  className={`transition-transform duration-200 ${calcMobileOpen ? 'rotate-180' : ''}`}
                />
              </button>
              {calcMobileOpen && (
                <div className="pb-3 px-6 bg-white/[0.01] flex flex-col gap-0.5">
                  {calcLinks.map(({ href, en, hi, bn, isNew, hasDivider }) => (
                    <div key={href} className="w-full">
                      {hasDivider && <div className="my-1 border-t border-white/[0.04]" />}
                      <Link
                        href={href}
                        onClick={() => setMobileOpen(false)}
                        className={`flex items-center py-2.5 text-sm w-full ${
                          isActive(href) ? 'text-amber-400 font-semibold' : 'text-gray-400 hover:text-white'
                        }`}
                      >
                        <span>{lang === 'en' ? en : lang === 'hi' ? hi : bn}</span>
                        {isNew && (
                          <span className="bg-amber-500 text-white text-[9px] px-1.5 py-0.5 rounded-full ml-2 font-bold">
                            {lang === 'en' ? 'New' : lang === 'hi' ? 'नया' : 'নতুন'}
                          </span>
                        )}
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {[
              { href: '/compare', en: 'Compare Plans', hi: 'प्लान तुलना', bn: 'প্ল্যান তুলনা' },
              { href: '/blog',    en: 'Blog',          hi: 'ब्लॉग',         bn: 'ব্লগ' },
              { href: '/client',  en: 'Client Login',  hi: 'क्लाइंट लॉगिन', bn: 'ক্লায়েন্ট লগইন' },
            ].map(({ href, en, hi, bn }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                className={`block py-4 px-6 text-base font-semibold border-b border-white/[0.04] ${
                  isActive(href) ? 'text-amber-400' : 'text-gray-300'
                }`}
              >
                {lang === 'en' ? en : lang === 'hi' ? hi : bn}
              </Link>
            ))}
          </div>

          {/* Drawer trust badges */}
          <div className="px-6 py-5 border-t border-white/[0.06] bg-white/[0.02] space-y-3">
            <div className="text-[10px] font-bold tracking-widest uppercase text-gray-500 mb-1">
              {lang === 'en' ? 'Established Trust' : lang === 'hi' ? 'स्थापित भरोसा' : 'প্রতিষ্ঠিত ট্রাস্ট'}
            </div>
            <div className="grid grid-cols-1 gap-2.5">
              <div className="flex items-center gap-3 bg-white/[0.03] px-3.5 py-3 rounded-xl border border-white/5">
                <Trophy size={16} className="text-amber-500 flex-shrink-0" />
                <span className="text-xs font-semibold text-gray-300">
                  {lang === 'en' ? 'MDRT® Member (USA)' : lang === 'hi' ? 'MDRT® सदस्य (USA)' : 'MDRT® সদস্য (USA)'}
                </span>
              </div>
              <div className="flex items-center gap-3 bg-white/[0.03] px-3.5 py-3 rounded-xl border border-white/5">
                <Sparkles size={16} className="text-amber-500 flex-shrink-0" />
                <span className="text-xs font-semibold text-gray-300">
                  {lang === 'en' ? '31+ Years Legacy' : lang === 'hi' ? '31+ साल का अटूट भरोसा' : '31+ বছরের ঐতিহ্য'}
                </span>
              </div>
              <div className="flex items-center gap-3 bg-white/[0.03] px-3.5 py-3 rounded-xl border border-white/5">
                <ShieldCheck size={16} className="text-amber-500 flex-shrink-0" />
                <span className="text-xs font-semibold text-gray-300">
                  {lang === 'en' ? '5000+ Families Protected' : lang === 'hi' ? '5000+ सुरक्षित परिवार' : '5000+ সুরক্ষিত পরিবার'}
                </span>
              </div>
            </div>
          </div>

          {/* Drawer bottom: lang + CTA */}
          <div className="px-6 pb-10 pt-6 space-y-4 border-t border-white/[0.06] bg-[#0B0E1A]">
            <div className="flex items-center gap-2.5 text-[11px] text-gray-400">
              <button
                onClick={() => setLang('en')}
                className={`flex-1 py-2.5 rounded-xl border text-center transition-colors font-semibold cursor-pointer ${lang === 'en' ? 'border-amber-500 text-amber-400 bg-amber-500/5' : 'border-white/[0.08] hover:border-white/[0.15]'}`}
              >
                English
              </button>
              <button
                onClick={() => setLang('hi')}
                className={`flex-1 py-2.5 rounded-xl border text-center transition-colors font-semibold cursor-pointer ${lang === 'hi' ? 'border-amber-500 text-amber-400 bg-amber-500/5' : 'border-white/[0.08] hover:border-white/[0.15]'}`}
              >
                हिंदी
              </button>
              <button
                onClick={() => setLang('bn')}
                className={`flex-1 py-2.5 rounded-xl border text-center transition-colors font-semibold cursor-pointer ${lang === 'bn' ? 'border-amber-500 text-amber-400 bg-amber-500/5' : 'border-white/[0.08] hover:border-white/[0.15]'}`}
              >
                বাংলা
              </button>
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
