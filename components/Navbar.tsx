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
  const [calcOpen, setCalcOpen] = useState(false)
  const [calcMobileOpen, setCalcMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
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

  if (pathname?.startsWith('/lp/')) return null

  const isActive = (path: string) =>
    path === '/' ? pathname === '/' : pathname.startsWith(path)

  // Nav link with center-expanding hover underline effect (Premium private banking style)
  const linkCls = (path: string) =>
    `relative text-[13px] font-semibold uppercase tracking-wider transition-colors duration-200 pb-1.5
     after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:h-[2px] after:w-0
     hover:after:w-full after:bg-gold after:transition-all after:duration-300
     ${isActive(path) ? 'text-white after:w-full font-bold' : 'text-gray-300 hover:text-white'}`

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

  return (
    <>
      {/* Scroll-triggered background transition */}
      <nav className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-gray-950/95 backdrop-blur-sm border-b border-gray-800 shadow-lg'
          : 'bg-gradient-to-b from-[#12152a]/80 via-[#12152a]/30 to-transparent border-b border-transparent'
      }`}>
        
        {/* Desktop Utility Bar (Trust signals + Secondary Links) */}
        <div className={`hidden md:block border-b border-white/5 bg-gray-950/20 transition-all duration-300 ease-in-out ${
          scrolled ? 'h-0 opacity-0 overflow-hidden py-0' : 'h-9 py-1.5'
        }`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between text-[11px] font-semibold text-gray-300">
            {/* Left: Trust Micro-Badges */}
            <div className="flex items-center gap-5">
              <div className="flex items-center gap-1.5">
                <Trophy size={13} className="text-amber-500" />
                <span>{lang === 'en' ? 'MDRT® Member (USA)' : lang === 'hi' ? 'MDRT® सदस्य (USA)' : 'MDRT® সদস্য (USA)'}</span>
              </div>
              <div className="w-px h-3 bg-white/10" />
              <div className="flex items-center gap-1.5">
                <Sparkles size={13} className="text-amber-500" />
                <span>{lang === 'en' ? '31+ Years Legacy' : lang === 'hi' ? '31+ साल का अटूट भरोसा' : '31+ বছরের ঐতিহ্য'}</span>
              </div>
              <div className="w-px h-3 bg-white/10" />
              <div className="flex items-center gap-1.5">
                <ShieldCheck size={13} className="text-amber-500" />
                <span>{lang === 'en' ? '5000+ Families Protected' : lang === 'hi' ? '5000+ सुरक्षित परिवार' : '5000+ সুরক্ষিত পরিবার'}</span>
              </div>
            </div>

            {/* Right: Secondary Links & Lang & Search */}
            <div className="flex items-center gap-5">
              {/* Calculators dropdown */}
              <div className="relative" ref={calcRef}>
                <button
                  onClick={() => setCalcOpen(v => !v)}
                  aria-expanded={calcOpen}
                  aria-haspopup="true"
                  className="flex items-center gap-0.5 hover:text-white transition-colors duration-200 cursor-pointer"
                >
                  {t.nav.calculators}
                  <ChevronDown
                    size={12}
                    className={`ml-0.5 transition-transform duration-200 ${
                      calcOpen ? 'rotate-180 text-white' : 'text-gray-400'
                    }`}
                  />
                </button>

                {calcOpen && (
                  <div className="absolute top-full right-0 mt-2 bg-gray-900 border border-gray-800 rounded-xl shadow-xl p-2 min-w-[220px] z-50">
                    {calcLinks.map(({ href, en: cEn, hi: cHi, bn: cBn, isNew, hasDivider }) => (
                      <div key={href}>
                        {hasDivider && <div className="my-1 border-t border-gray-800/50" />}
                        <Link
                          href={href}
                          onClick={() => setCalcOpen(false)}
                          className={`flex items-center px-4 py-2 text-xs rounded-lg transition-colors ${
                            isActive(href)
                              ? 'text-amber-400 bg-gray-800/50 font-semibold'
                              : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                          }`}
                        >
                          <span>{lang === 'en' ? cEn : lang === 'hi' ? cHi : cBn}</span>
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

              <Link href="/compare" className="hover:text-white transition-colors duration-200">
                {lang === 'en' ? 'Compare' : lang === 'hi' ? 'तुलना' : 'তুলনা'}
              </Link>
              <Link href="/blog" className="hover:text-white transition-colors duration-200">
                {lang === 'en' ? 'Blog' : lang === 'hi' ? 'ब्लॉग' : 'ब्लॉग'}
              </Link>
              <Link href="/videos" className="hover:text-white transition-colors duration-200">
                {lang === 'en' ? 'Videos' : lang === 'hi' ? 'वीडियो' : 'ভিডিও'}
              </Link>

              <div className="w-px h-3 bg-white/10" />

              {/* Language Toggle */}
              <div className="relative group">
                <button
                  aria-haspopup="true"
                  className="flex items-center gap-0.5 text-gray-300 hover:text-white transition-colors duration-200 cursor-pointer"
                >
                  <span>{lang === 'en' ? 'English' : lang === 'hi' ? 'हिंदी' : 'বাংলা'}</span>
                  <ChevronDown size={10} className="text-gray-400 group-hover:text-white transition-colors" />
                </button>
                <div className="absolute right-0 top-full mt-1 w-28 bg-gray-900 border border-gray-800 rounded-xl shadow-xl p-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  {(['en', 'hi', 'bn'] as const).map((l) => (
                    <button
                      key={l}
                      onClick={() => setLang(l)}
                      className={`w-full text-left px-3 py-1.5 text-[11px] rounded-lg transition-colors font-medium cursor-pointer ${
                        lang === l ? 'text-amber-500 bg-gray-800/30' : 'text-gray-400 hover:text-white hover:bg-gray-800/30'
                      }`}
                    >
                      {l === 'en' ? 'English' : l === 'hi' ? 'हिंदी' : 'বাংলা'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="w-px h-3 bg-white/10" />

              {/* Search Trigger */}
              <button
                onClick={() => setIsSearchOpen(true)}
                aria-label="Open Search"
                className="text-gray-300 hover:text-white transition-colors duration-200 cursor-pointer"
              >
                <Search size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* Main Navigation Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* LEFT — Reconstructed Brand Block */}
          <Link href="/" className="flex items-center gap-4 shrink-0 min-w-0 group">
            <div className="w-12 h-12 rounded-xl overflow-hidden bg-white/10 flex items-center justify-center p-1.5 flex-shrink-0 border border-white/15 shadow-md transition-all duration-300 group-hover:scale-105">
              <Image
                src="/assets/pwm-logo.svg"
                alt="Poddar Wealth Management"
                width={48}
                height={48}
                className="w-full h-full object-contain"
                priority
              />
            </div>
            <div className="flex flex-col min-w-0 justify-center">
              <span className="text-base md:text-[18px] font-bold tracking-wider text-white font-display uppercase leading-tight" style={{ textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}>
                Poddar Wealth Management
              </span>
              <span className="text-[9px] font-bold tracking-[0.15em] uppercase text-amber-500 mt-0.5" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}>
                Excellence in Protection Since 1994
              </span>
            </div>
          </Link>

          {/* CENTER — Desktop nav links (Simplified) */}
          <div className="hidden md:flex items-center gap-10">
            <Link href="/about" className={linkCls('/about')}>
              {t.nav.about}
            </Link>
            <Link href="/products" className={linkCls('/products')}>
              {t.nav.products}
            </Link>
            <Link href="/services" className={linkCls('/services')}>
              {t.nav.services}
            </Link>
          </div>

          {/* RIGHT — CTA / Mobile Toggle */}
          <div className="flex items-center gap-4">
            {/* Get a free quote — desktop */}
            <Link
              href="/contact"
              className="hidden md:inline-flex items-center justify-center bg-gold hover:bg-gold-hover text-white text-xs font-bold uppercase tracking-widest px-6 py-3 rounded-lg shadow-gold-sm hover:shadow-gold hover:-translate-y-0.5 transition-all duration-200 border border-gold-darker/20"
            >
              {t.nav.getQuote}
            </Link>

            {/* Mobile Controls */}
            <div className="md:hidden flex items-center gap-3">
              <button
                onClick={() => setIsSearchOpen(true)}
                aria-label="Open Search"
                className="text-gray-300 hover:text-white p-1.5 rounded-lg hover:bg-white/5 transition-all cursor-pointer"
              >
                <Search size={19} />
              </button>
              <div className="flex items-center gap-1.5 font-sans">
                <button
                  onClick={() => setLang('en')}
                  className={`text-[10px] font-bold transition-colors ${
                    lang === 'en' ? 'text-amber-500' : 'text-gray-500'
                  }`}
                >
                  EN
                </button>
                <span className="text-gray-800 text-[10px]">|</span>
                <button
                  onClick={() => setLang('hi')}
                  className={`text-[10px] font-bold transition-colors ${
                    lang === 'hi' ? 'text-amber-500' : 'text-gray-500'
                  }`}
                >
                  हि
                </button>
                <span className="text-gray-800 text-[10px]">|</span>
                <button
                  onClick={() => setLang('bn')}
                  className={`text-[10px] font-bold transition-colors ${
                    lang === 'bn' ? 'text-amber-500' : 'text-gray-500'
                  }`}
                >
                  বা
                </button>
              </div>
              <button
                onClick={() => setMobileOpen(v => !v)}
                aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={mobileOpen}
                className="text-gray-300 hover:text-white p-1 cursor-pointer"
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
            <Link href="/" onClick={() => setMobileOpen(false)} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl overflow-hidden bg-white/10 p-1 flex-shrink-0 border border-white/10">
                <Image src="/assets/pwm-logo.svg" alt="Poddar Wealth Management logo" width={36} height={36} className="w-full h-full object-contain" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold tracking-wide text-white font-display uppercase leading-tight">
                  Poddar Wealth
                </span>
                <span className="text-[9px] font-bold tracking-wider uppercase text-amber-500">
                  Excellence Since 1994
                </span>
              </div>
            </Link>
            <button onClick={() => setMobileOpen(false)} className="text-gray-400 hover:text-white p-1 cursor-pointer">
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
                className={`block py-4 px-6 text-base font-semibold border-b border-gray-800/50 ${
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
                <div className="pb-2 px-6 flex flex-col gap-0.5">
                  {calcLinks.map(({ href, en, hi, bn, isNew, hasDivider }) => (
                    <div key={href} className="w-full">
                      {hasDivider && <div className="my-1 border-t border-gray-800/30" />}
                      <Link
                        href={href}
                        onClick={() => setMobileOpen(false)}
                        className={`flex items-center py-3 text-sm border-b border-gray-800/30 w-full ${
                          isActive(href) ? 'text-amber-400 font-semibold' : 'text-gray-400 hover:text-white'
                        }`}
                      >
                        <span>{lang === 'en' ? en : lang === 'hi' ? hi : bn}</span>
                        {isNew && (
                          <span className="bg-amber-500 text-white text-[10px] px-1.5 py-0.5 rounded-full ml-2 font-bold">
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
              { href: '/videos',  en: 'Videos',        hi: 'वीडियो',        bn: 'ভিডিও' },
            ].map(({ href, en, hi, bn }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                className={`block py-4 px-6 text-base font-semibold border-b border-gray-800/50 ${
                  isActive(href) ? 'text-amber-400' : 'text-gray-300'
                }`}
              >
                {lang === 'en' ? en : lang === 'hi' ? hi : bn}
              </Link>
            ))}
          </div>

          {/* Drawer trust badges */}
          <div className="px-6 py-5 border-t border-gray-800/50 bg-gray-900/20 space-y-3">
            <div className="text-[10px] font-bold tracking-widest uppercase text-gray-500 mb-1">
              {lang === 'en' ? 'Established Trust' : lang === 'hi' ? 'स्थापित भरोसा' : 'প্রতিষ্ঠিত ট্রাস্ট'}
            </div>
            <div className="grid grid-cols-1 gap-2.5">
              <div className="flex items-center gap-3 bg-gray-900/60 px-3.5 py-3 rounded-xl border border-white/5">
                <Trophy size={16} className="text-amber-500 flex-shrink-0" />
                <span className="text-xs font-semibold text-gray-300">
                  {lang === 'en' ? 'MDRT® Member (USA)' : lang === 'hi' ? 'MDRT® सदस्य (USA)' : 'MDRT® সদস্য (USA)'}
                </span>
              </div>
              <div className="flex items-center gap-3 bg-gray-900/60 px-3.5 py-3 rounded-xl border border-white/5">
                <Sparkles size={16} className="text-amber-500 flex-shrink-0" />
                <span className="text-xs font-semibold text-gray-300">
                  {lang === 'en' ? '31+ Years Legacy' : lang === 'hi' ? '31+ साल का अटूट भरोसा' : '31+ বছরের ঐতিহ্য'}
                </span>
              </div>
              <div className="flex items-center gap-3 bg-gray-900/60 px-3.5 py-3 rounded-xl border border-white/5">
                <ShieldCheck size={16} className="text-amber-500 flex-shrink-0" />
                <span className="text-xs font-semibold text-gray-300">
                  {lang === 'en' ? '5000+ Families Protected' : lang === 'hi' ? '5000+ सुरक्षित परिवार' : '5000+ সুরক্ষিত পরিবার'}
                </span>
              </div>
            </div>
          </div>

          {/* Drawer bottom: lang + CTA */}
          <div className="px-6 pb-8 pt-4 space-y-4 border-t border-gray-800/50">
            <div className="flex items-center gap-2.5 text-[11px] text-gray-400">
              <button
                onClick={() => setLang('en')}
                className={`flex-1 py-2.5 rounded-xl border text-center transition-colors font-semibold cursor-pointer ${lang === 'en' ? 'border-amber-500 text-amber-400 bg-amber-500/5' : 'border-gray-800 hover:border-gray-700'}`}
              >
                English
              </button>
              <button
                onClick={() => setLang('hi')}
                className={`flex-1 py-2.5 rounded-xl border text-center transition-colors font-semibold cursor-pointer ${lang === 'hi' ? 'border-amber-500 text-amber-400 bg-amber-500/5' : 'border-gray-800 hover:border-gray-700'}`}
              >
                हिंदी
              </button>
              <button
                onClick={() => setLang('bn')}
                className={`flex-1 py-2.5 rounded-xl border text-center transition-colors font-semibold cursor-pointer ${lang === 'bn' ? 'border-amber-500 text-amber-400 bg-amber-500/5' : 'border-gray-800 hover:border-gray-700'}`}
              >
                বাংলা
              </button>
            </div>
            <Link
              href="/contact"
              onClick={() => setMobileOpen(false)}
              className="block w-full text-center bg-gold hover:bg-gold-hover text-white font-bold text-xs uppercase tracking-widest py-4 rounded-xl transition-colors shadow-gold-sm border border-gold-darker/20"
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
