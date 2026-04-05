'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useLang } from '@/lib/LangContext'

export default function Navbar() {
  const { lang, setLang, t } = useLang()
  const [open, setOpen] = useState(false)

  return (
    <nav className="pw-nav">
      {/* Logo */}
      <Link href="/" className="pw-logo-area">
        <div className="pw-logo-icon bg-transparent w-auto h-12 -ml-1">
          <img src="/assets/lic-logo.svg" alt="Poddar Wealth Logo" className="h-full w-auto object-contain" />
        </div>
        <div>
          <span className="pw-logo-text text-navy">Poddar Wealth Management</span>
          <span className="pw-logo-sub text-gold/80">Excellence in Protection Since 1994</span>
        </div>
      </Link>

      {/* Desktop Nav */}
      <div className="hidden lg:flex items-center gap-5 xl:gap-6">
        <Link href="/" className="pw-nav-link">{t.nav.products}</Link>
        <Link href="/services/life-insurance" className="pw-nav-link">{t.nav.services}</Link>
        <div className="hidden xl:block">
          <Link href="/calculators/life-insurance" className="pw-nav-link">{t.nav.calculators}</Link>
        </div>
        <Link href="/about" className="pw-nav-link">{t.nav.about}</Link>
        
        {/* Support Links */}
        <Link href="/contact" className="pw-nav-link text-gray-500">{t.nav.renewPolicy}</Link>
        <Link href="/contact" className="pw-nav-link text-gray-500">{t.nav.claimSupport}</Link>

        {/* Language toggle */}
        <div className="pw-lang-toggle ml-1">
          <button
            onClick={() => setLang('en')}
            className={`pw-lang-btn ${lang === 'en' ? 'pw-lang-btn--active' : ''}`}
          >EN</button>
          <button
            onClick={() => setLang('hi')}
            className={`pw-lang-btn ${lang === 'hi' ? 'pw-lang-btn--active' : ''}`}
          >हिंदी</button>
        </div>

        <Link href="#" className="pw-nav-link font-medium text-navy">{t.nav.login}</Link>
        <Link href="/contact" className="pw-nav-cta hidden xl:block">{t.nav.getQuote}</Link>
      </div>

      {/* Mobile toggle */}
      <button
        className="lg:hidden text-navy font-bold text-20 bg-transparent border-none cursor-pointer p-2"
        onClick={() => setOpen(!open)}
        aria-label="Toggle menu"
      >
        {open ? '✕' : '☰'}
      </button>

      {/* Mobile Menu */}
      {open && (
        <div className="fixed top-[84px] left-0 right-0 bg-white shadow-md z-40 px-8 py-6 flex flex-col gap-4 border-t border-gray-100 lg:hidden max-h-[85vh] overflow-y-auto">
          <Link href="/" onClick={() => setOpen(false)} className="text-14 font-semibold text-gray-800">{t.nav.products}</Link>
          <Link href="/services/life-insurance" onClick={() => setOpen(false)} className="text-14 font-semibold text-gray-800">{t.nav.services}</Link>
          <Link href="/calculators/life-insurance" onClick={() => setOpen(false)} className="text-14 font-semibold text-gray-800">{t.nav.calculators}</Link>
          <Link href="/about" onClick={() => setOpen(false)} className="text-14 font-semibold text-gray-800">{t.nav.about}</Link>
          <Link href="/contact" onClick={() => setOpen(false)} className="text-14 font-semibold text-gray-800">{t.nav.renewPolicy}</Link>
          <Link href="/contact" onClick={() => setOpen(false)} className="text-14 font-semibold text-gray-800">{t.nav.claimSupport}</Link>
          <div className="h-px bg-gray-100 my-1 w-full"></div>
          <Link href="#" onClick={() => setOpen(false)} className="text-14 font-semibold text-navy">{t.nav.login}</Link>
          <Link href="/contact" onClick={() => setOpen(false)} className="pw-btn pw-btn--gold pw-btn--full mt-2 shadow-sm">{t.nav.getQuote}</Link>
        </div>
      )}
    </nav>
  )
}
