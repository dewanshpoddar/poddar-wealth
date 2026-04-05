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
        <div className="pw-logo-icon bg-transparent w-auto h-10 -ml-1">
          <img src="/assets/logo.svg" alt="LIC Logo" className="h-full w-auto object-contain" />
        </div>
        <div>
          <span className="pw-logo-text">Poddar Wealth Management</span>
          <span className="pw-logo-sub">Excellence in Service Since 1994</span>
        </div>
      </Link>

      {/* Desktop Nav */}
      <div className="hidden lg:flex items-center gap-6">
        <Link href="/" className="pw-nav-link">{t.nav.products}</Link>
        <Link href="/services/life-insurance" className="pw-nav-link">Services</Link>
        <Link href="/calculators/life-insurance" className="pw-nav-link">{t.nav.calculators}</Link>
        <Link href="/about" className="pw-nav-link">About Us</Link>
        <Link href="/become-advisor" className="pw-nav-link">{t.nav.becomeAgent}</Link>

        {/* Language toggle */}
        <div className="pw-lang-toggle">
          <button
            onClick={() => setLang('en')}
            className={`pw-lang-btn ${lang === 'en' ? 'pw-lang-btn--active' : ''}`}
          >EN</button>
          <button
            onClick={() => setLang('hi')}
            className={`pw-lang-btn ${lang === 'hi' ? 'pw-lang-btn--active' : ''}`}
          >हिंदी</button>
        </div>

        <Link href="/contact" className="pw-nav-cta">{t.nav.getQuote}</Link>
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
        <div className="fixed top-[72px] left-0 right-0 bg-white shadow-md z-40 px-8 py-6 flex flex-col gap-4 border-t border-gray-100 lg:hidden">
          <Link href="/" onClick={() => setOpen(false)} className="text-14 font-semibold text-gray-800">{t.nav.products}</Link>
          <Link href="/services/life-insurance" onClick={() => setOpen(false)} className="text-14 font-semibold text-gray-800">Services</Link>
          <Link href="/calculators/life-insurance" onClick={() => setOpen(false)} className="text-14 font-semibold text-gray-800">{t.nav.calculators}</Link>
          <Link href="/about" onClick={() => setOpen(false)} className="text-14 font-semibold text-gray-800">About Us</Link>
          <Link href="/become-advisor" onClick={() => setOpen(false)} className="text-14 font-semibold text-gray-800">{t.nav.becomeAgent}</Link>
          <Link href="/contact" onClick={() => setOpen(false)} className="pw-btn pw-btn--gold pw-btn--full mt-2 shadow-sm">{t.nav.getQuote}</Link>
        </div>
      )}
    </nav>
  )
}
