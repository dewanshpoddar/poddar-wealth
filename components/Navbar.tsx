'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useLang } from '@/lib/LangContext'
import { motion, AnimatePresence } from 'framer-motion'
import LangToggle from './LangToggle'

export default function Navbar() {
  const { lang, setLang, t } = useLang()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  // Universal Scroll Detection
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const isActive = (path: string) => pathname === path

  return (
    <nav className={`pw-nav transition-all duration-500 ${
      isScrolled 
        ? 'bg-navy shadow-2xl border-none h-[72px]' 
        : 'bg-white h-[78px]'
    }`}>

      {/* Logo Area */}
      <Link href="/" className="pw-logo-area flex-shrink-0">
        <div className={`w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center p-1.5 shadow-sm overflow-hidden transition-all duration-500 flex-shrink-0 ${
          isScrolled ? 'bg-white shadow-none' : 'bg-white shadow-gold-sm border-gold/10 border'
        }`}>
          <img src="/assets/pwm-logo.svg" alt="Poddar Wealth Logo" className="w-full h-full object-contain scale-110" />
        </div>
        {/* Logo text — hidden below 400px to give room for lang toggle + hamburger */}
        <div className="flex-col min-w-0 hidden [@media(min-width:400px)]:flex">
          <span className={`pw-logo-text uppercase transition-colors duration-500 truncate ${
            isScrolled ? 'text-white' : 'text-navy'
          } text-[11px] sm:text-[13px] md:text-[16px]`}>
            Poddar Wealth Management
          </span>
          <span className={`pw-logo-sub italic transition-colors duration-500 hidden sm:block ${
            isScrolled ? 'text-gold/90 font-medium' : 'text-gold/80'
          }`}>
            Excellence in Protection Since 1994
          </span>
        </div>
      </Link>

      {/* Desktop Nav */}
      <div className="hidden lg:flex items-center gap-5 xl:gap-8">
        <Link 
          href="/about" 
          className={`pw-nav-link text-[14px] font-bold tracking-wide transition-all duration-500 ${
            isActive('/about') 
              ? (isScrolled ? 'text-gold' : 'text-navy scale-105') 
              : (isScrolled ? 'text-white/80 hover:text-white' : 'text-gray-500 hover:text-navy')
          }`}
        >
          {t.nav.about}
        </Link>
        <Link 
          href="/products" 
          className={`pw-nav-link text-[14px] font-bold tracking-wide transition-all duration-500 ${
            isActive('/products') 
              ? (isScrolled ? 'text-gold' : 'text-navy scale-105') 
              : (isScrolled ? 'text-white/80 hover:text-white' : 'text-gray-500 hover:text-navy')
          }`}
        >
          {t.nav.products}
        </Link>
        <Link 
          href="/services" 
          className={`pw-nav-link text-[14px] font-bold tracking-wide transition-all duration-500 ${
            isActive('/services') 
              ? (isScrolled ? 'text-gold' : 'text-navy scale-105') 
              : (isScrolled ? 'text-white/80 hover:text-white' : 'text-gray-500 hover:text-navy')
          }`}
        >
          {t.nav.services}
        </Link>

        <Link
          href="/calculators/premium"
          className={`pw-nav-link text-[14px] font-bold tracking-wide transition-all duration-500 ${
            pathname.startsWith('/calculators')
              ? (isScrolled ? 'text-gold' : 'text-navy scale-105')
              : (isScrolled ? 'text-white/80 hover:text-white' : 'text-gray-500 hover:text-navy')
          }`}
        >
          {t.nav.calculators}
        </Link>

        {/* Language toggle */}
        <LangToggle scrolled={isScrolled} />

        <Link href="/contact" className={`text-[14px] font-bold transition-colors duration-500 ${
          isScrolled ? 'text-white/90 hover:text-gold' : 'text-navy hover:text-gold'
        }`}>{t.nav.renewPolicy}</Link>
        
        <Link href="/contact" className={`pw-nav-cta hidden xl:block shadow-xl ${
          isScrolled ? 'bg-gold hover:bg-gold-hover' : 'bg-navy hover:bg-navy-mid'
        }`}>
          {t.nav.getQuote}
        </Link>
      </div>

      {/* Mobile: language toggle + hamburger */}
      <div className="lg:hidden flex items-center gap-2">
        {/* Language toggle — always visible on mobile for Hindi users */}
        <LangToggle scrolled={isScrolled} />

        <button
          className={`font-bold text-20 bg-transparent border-none cursor-pointer p-2 transition-colors duration-500 ${
            isScrolled ? 'text-white' : 'text-navy'
          }`}
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile Menu (Sticky at top of content) */}
      <AnimatePresence>
        {open && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`fixed ${isScrolled ? 'top-[72px]' : 'top-[78px]'} left-0 right-0 shadow-2xl z-40 px-8 py-8 flex flex-col gap-6 lg:hidden max-h-[85vh] overflow-y-auto transition-all duration-500 ${
              isScrolled ? 'bg-navy-deep border-t border-gold/10' : 'bg-white border-t border-gray-100'
            }`}
          >
            <Link 
              href="/about" 
              onClick={() => setOpen(false)} 
              className={`text-18 font-bold ${isActive('/about') ? 'text-gold' : (isScrolled ? 'text-white' : 'text-navy')}`}
            >
              {t.nav.about}
            </Link>
            <Link 
              href="/products" 
              onClick={() => setOpen(false)} 
              className={`text-18 font-bold ${isActive('/products') ? 'text-gold' : (isScrolled ? 'text-white' : 'text-navy')}`}
            >
              {t.nav.products}
            </Link>
            <Link
              href="/services"
              onClick={() => setOpen(false)}
              className={`text-18 font-bold ${isActive('/services') ? 'text-gold' : (isScrolled ? 'text-white' : 'text-navy')}`}
            >
              {t.nav.services}
            </Link>
            <Link
              href="/calculators/premium"
              onClick={() => setOpen(false)}
              className={`text-18 font-bold flex items-center gap-2 ${pathname.startsWith('/calculators') ? 'text-gold' : (isScrolled ? 'text-white' : 'text-navy')}`}
            >
              {t.nav.calculators}
              <span className="bg-green-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full leading-none">New</span>
            </Link>

            <div className={`h-px my-1 w-full ${isScrolled ? 'bg-white/10' : 'bg-gray-100'}`}></div>

            <Link href="/contact" onClick={() => setOpen(false)} className={`text-16 font-semibold ${isScrolled ? 'text-white/80' : 'text-navy/80'}`}>{t.nav.renewPolicy}</Link>
            <Link href="/become-advisor" onClick={() => setOpen(false)} className={`text-[14px] font-medium ${isScrolled ? 'text-white/40 hover:text-white/70' : 'text-slate-400 hover:text-slate-600'}`}>
              {t.homePage.joinAdvisor}
            </Link>
            
            <Link href="/contact" onClick={() => setOpen(false)} className="pw-btn pw-btn--gold pw-btn--full mt-2 shadow-xl py-4 text-16">
              {t.nav.getQuote}
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
