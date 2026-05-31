'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useLang } from '@/lib/LangContext'
import { trackEvent } from '@/lib/analytics'
import {
  ChevronDown,
  ChevronUp,
  HelpCircle,
  Shield,
  Activity,
  PhoneCall,
  Sparkles,
} from 'lucide-react'

type Category = 'general' | 'lic' | 'health' | 'claims'

export default function FAQPage() {
  const { t, lang } = useLang()
  const [activeCategory, setActiveCategory] = useState<Category>('general')
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({})

  // Cast translations to any to access the dynamically added faq key safely
  const faq = (t as any).faq || {
    heroEyebrow: 'KNOWLEDGE BASE',
    heroTitle: 'Frequently Asked',
    heroTitleGold: 'Questions.',
    heroSubtitle: 'Find clear, honest answers about LIC policies, Star Health insurance, claim settlements, and our 31-year wealth advisory legacy in Gorakhpur.',
    categories: {
      general: 'General Questions',
      lic: 'LIC Plans',
      health: 'Health Insurance',
      claims: 'Claims Support'
    },
    ctaTitle: 'Still have questions?',
    ctaSubtitle: 'Ask Poddar Ji, our 24/7 AI insurance advisor, trained on 31 years of on-ground financial expertise.',
    ctaButton: 'Ask Poddar Ji',
    items: {
      general: [],
      lic: [],
      health: [],
      claims: []
    }
  }

  const toggleItem = (category: Category, idx: number) => {
    const key = `${category}-${idx}`
    const isOpening = !openItems[key]
    if (isOpening) {
      const item = (faq.items[category] ?? [])[idx]
      trackEvent('faq_opened', { question: String(item?.q ?? '').slice(0, 60) })
    }
    setOpenItems((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  // Get active category questions
  const currentItems = faq.items[activeCategory] || []

  // Build JSON-LD structured data for Google FAQPage Rich Snippets
  const allQuestions: Array<{ q: string; a: string }> = []
  const categoriesList: Category[] = ['general', 'lic', 'health', 'claims']
  categoriesList.forEach((cat) => {
    const items = faq.items[cat] || []
    items.forEach((item: any) => {
      if (item && item.q && item.a) {
        allQuestions.push({ q: item.q, a: item.a })
      }
    })
  })

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': allQuestions.map((item) => ({
      '@type': 'Question',
      'name': item.q,
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': item.a,
      },
    })),
  }

  const categoryIcons: Record<Category, React.ReactNode> = {
    general: <HelpCircle size={18} />,
    lic: <Shield size={18} />,
    health: <Activity size={18} />,
    claims: <PhoneCall size={18} />,
  }

  return (
    <div className="bg-white">
      {/* ── JSON-LD FAQ Schema for Google SEO ── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ═══ HERO SECTION ═══ */}
      <section className="relative overflow-hidden bg-warm/30 pt-16 pb-16 lg:pt-24 lg:pb-24 border-b border-gold/5">
        <div className="max-w-7xl mx-auto px-8 relative z-10 w-full text-center">
          <div className="inline-flex items-center gap-2 text-[10px] tracking-[0.18em] text-gold font-bold uppercase mb-4 mx-auto">
            <span className="w-7 h-px bg-gold inline-block" />
            {faq.heroEyebrow}
            <span className="w-7 h-px bg-gold inline-block" />
          </div>
          
          <h1 className="font-display text-[32px] md:text-[40px] lg:text-[48px] font-normal italic leading-[1.2] text-slate-900 mb-6">
            {faq.heroTitle} <br className="sm:hidden" />
            <span className="font-bold text-gold not-italic"> {faq.heroTitleGold}</span>
          </h1>
          
          <p className="text-[14px] md:text-[15px] text-slate-500 leading-relaxed max-w-2xl mx-auto font-medium">
            {faq.heroSubtitle}
          </p>
        </div>
      </section>

      {/* ═══ CATEGORY TABS ═══ */}
      <section className="py-10 bg-white border-b border-slate-100 sticky top-[72px] sm:top-[78px] z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex flex-nowrap overflow-x-auto gap-3 pb-2 scrollbar-hide -mx-8 px-8 sm:mx-0 sm:px-0 sm:justify-center">
            {categoriesList.map((cat) => {
              const isActive = activeCategory === cat
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`flex items-center gap-2 px-5 py-3 rounded-full text-[12px] md:text-[13px] font-bold tracking-wide uppercase transition-all duration-300 flex-shrink-0 cursor-pointer ${
                    isActive
                      ? 'bg-navy text-white shadow-lg shadow-navy/10 border border-navy'
                      : 'bg-slate-50 text-slate-500 hover:text-navy hover:bg-slate-100 border border-slate-100'
                  }`}
                >
                  <span className={isActive ? 'text-gold' : 'text-slate-400'}>
                    {categoryIcons[cat]}
                  </span>
                  {faq.categories[cat]}
                </button>
              )
            })}
          </div>
        </div>
      </section>

      {/* ═══ ACCORDIONS SECTION ═══ */}
      <section className="py-16 md:py-24 bg-slate-50 relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              {currentItems.map((item: any, idx: number) => {
                const key = `${activeCategory}-${idx}`
                const isOpen = !!openItems[key]
                return (
                  <div
                    key={key}
                    className="bg-white border border-slate-200 rounded-[28px] overflow-hidden shadow-xs hover:border-gold/15 transition-all"
                  >
                    <button
                      onClick={() => toggleItem(activeCategory, idx)}
                      className="w-full text-left p-6 sm:p-8 flex justify-between items-center gap-6 cursor-pointer bg-transparent border-none focus:outline-none"
                    >
                      <span className="font-display text-[15px] sm:text-[17px] font-bold text-navy leading-snug">
                        {item.q}
                      </span>
                      <span className={`w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-navy flex-shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 bg-gold/10 text-gold' : ''}`}>
                        {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </span>
                    </button>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: 'easeInOut' }}
                        >
                          <div className="px-6 pb-6 sm:px-8 sm:pb-8 border-t border-slate-50 text-[13px] sm:text-[14px] text-slate-500 leading-relaxed font-medium">
                            {item.a}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )
              })}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ═══ RELATED PAGES ═══ */}
      <section className="py-10 px-8 bg-slate-50 border-t border-slate-100">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-5">
            {lang === 'en' ? 'Explore these pages' : 'इन पृष्ठों पर जाएं'}
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { label: lang === 'en' ? 'File a Claim' : 'क्लेम करें', href: '/claims' },
              { label: lang === 'en' ? 'Premium Calculator' : 'प्रीमियम कैलकुलेटर', href: '/calculators/premium' },
              { label: lang === 'en' ? 'All Plans' : 'सभी प्लान', href: '/products' },
              { label: lang === 'en' ? 'Contact Us' : 'संपर्क करें', href: '/contact' },
              { label: lang === 'en' ? 'Pay Premium' : 'प्रीमियम भरें', href: '/pay-premium' },
            ].map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                className="text-[13px] font-semibold text-navy bg-white border border-navy/15 px-4 py-2 rounded-full hover:bg-navy hover:text-white hover:border-navy transition-all duration-200"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CALL-TO-ACTION (CTA) SECTION ═══ */}
      <section className="bg-gold py-16 px-8 relative overflow-hidden text-center">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 blur-[100px] rounded-full" />
        <div className="max-w-3xl mx-auto relative z-10 space-y-6">
          <div className="w-16 h-16 bg-navy/10 rounded-full flex items-center justify-center mx-auto text-navy">
            <Sparkles size={28} className="animate-pulse" />
          </div>
          
          <h3 className="text-[26px] md:text-[32px] font-display font-bold text-navy tracking-tight leading-tight">
            {faq.ctaTitle}
          </h3>
          
          <p className="text-navy/70 text-[14px] md:text-[15px] font-medium leading-relaxed max-w-xl mx-auto">
            {faq.ctaSubtitle}
          </p>

          <div className="pt-4">
            <Link
              href="/ai-advisor"
              className="inline-flex h-14 px-10 bg-navy text-white rounded-full items-center justify-center font-bold text-[14px] md:text-[15px] gap-2.5 hover:bg-navy-light transition-all shadow-xl hover:-translate-y-1"
            >
              <span>✨</span>
              {faq.ctaButton}
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
