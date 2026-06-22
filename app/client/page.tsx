'use client'

import { useLang } from '@/lib/LangContext'
import { ADVISOR_PHONE } from '@/lib/constants'
import {
  ExternalLink,
  CreditCard,
  Shield,
  FileSearch,
  TrendingUp,
  Phone,
  ArrowRight,
} from 'lucide-react'
import Link from 'next/link'

export default function ClientPortalPage() {
  const { t, lang } = useLang()
  const c = t.clientPortal || {
    heroTitle: 'Your Policy Hub',
    heroSubtitle: 'Quick access to all policy servicing tools',
    needHelp: `Need help? Call Ajay sir: ${ADVISOR_PHONE}`,
    cards: {
      mylic: {
        title: 'MyLIC Portal',
        desc: 'Access your official LIC account, track premium history, and check loan status directly.',
        btn: 'Open Portal'
      },
      payPremium: {
        title: 'Pay Premium',
        desc: 'Pay your LIC premiums online securely through official gateways without convenience fees.',
        btn: 'Pay Now'
      },
      healthScore: {
        title: 'Policy Health Score',
        desc: 'Run a comprehensive audit on your current policies to check coverage adequacy and gaps.',
        btn: 'Check Score'
      },
      aiAnalyzer: {
        title: 'AI Analyzer',
        desc: 'Upload your policy document PDF to extract key terms, benefits, and hidden terms instantly.',
        btn: 'Analyze Now'
      },
      navTracker: {
        title: 'NAV Tracker',
        desc: 'Track daily Net Asset Value (NAV) of active LIC ULIP funds and set email price alerts.',
        btn: 'Track NAV'
      },
      contact: {
        title: 'Contact Ajay sir',
        desc: 'Connect directly with Ajay Kumar Poddar on WhatsApp for claims or policy servicing help.',
        btn: 'WhatsApp Ajay sir'
      }
    }
  }

  const portalCards = [
    {
      key: 'mylic',
      icon: ExternalLink,
      title: c.cards.mylic.title,
      desc: c.cards.mylic.desc,
      btnText: c.cards.mylic.btn,
      href: 'https://customer.onlineportal.licindia.in/',
      external: true,
      variant: 'outline' as const,
    },
    {
      key: 'payPremium',
      icon: CreditCard,
      title: c.cards.payPremium.title,
      desc: c.cards.payPremium.desc,
      btnText: c.cards.payPremium.btn,
      href: '/pay-premium',
      external: false,
      variant: 'amber' as const,
    },
    {
      key: 'healthScore',
      icon: Shield,
      title: c.cards.healthScore.title,
      desc: c.cards.healthScore.desc,
      btnText: c.cards.healthScore.btn,
      href: '/calculators/policy-health',
      external: false,
      variant: 'outline' as const,
    },
    {
      key: 'aiAnalyzer',
      icon: FileSearch,
      title: c.cards.aiAnalyzer.title,
      desc: c.cards.aiAnalyzer.desc,
      btnText: c.cards.aiAnalyzer.btn,
      href: '/analyzers/policy-document',
      external: false,
      variant: 'outline' as const,
    },
    {
      key: 'navTracker',
      icon: TrendingUp,
      title: c.cards.navTracker.title,
      desc: c.cards.navTracker.desc,
      btnText: c.cards.navTracker.btn,
      href: '/nav-tracker',
      external: false,
      variant: 'outline' as const,
    },
    {
      key: 'contact',
      icon: Phone,
      title: c.cards.contact.title,
      desc: c.cards.contact.desc,
      btnText: c.cards.contact.btn,
      href: `https://wa.me/91${ADVISOR_PHONE}?text=${encodeURIComponent(
        lang === 'en'
          ? 'Hello Ajay sir, I need assistance with my policy servicing.'
          : 'नमस्ते अजय सर, मुझे अपनी पॉलिसी सर्विसिंग में सहायता चाहिए।'
      )}`,
      external: true,
      variant: 'amber' as const,
    },
  ]

  return (
    <div className="bg-slate-50 min-h-screen flex flex-col font-sans">
      {/* Hero Section */}
      <section className="bg-gray-950 py-16 px-6 text-center relative overflow-hidden shrink-0">
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(circle at 20% 50%, #f5c842 0%, transparent 60%), radial-gradient(circle at 80% 50%, #f5c842 0%, transparent 60%)',
          }}
        />
        <div className="relative z-10 max-w-3xl mx-auto">
          <h1 className="font-display text-3xl sm:text-5xl font-bold text-white mb-4 leading-tight tracking-tight">
            {c.heroTitle}
          </h1>
          <p className="text-gray-400 text-sm sm:text-base font-medium max-w-xl mx-auto leading-relaxed">
            {c.heroSubtitle}
          </p>
        </div>
      </section>

      {/* Main Grid Content */}
      <main className="flex-1 max-w-7xl mx-auto px-6 md:px-8 py-12 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {portalCards.map((card) => {
            const Icon = card.icon
            return (
              <div
                key={card.key}
                className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col justify-between hover:shadow-lg hover:border-amber-500/10 transition-all duration-300 group"
              >
                <div>
                  {/* Icon */}
                  <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-100/50 flex items-center justify-center text-amber-600 mb-5 group-hover:scale-105 transition-transform duration-300">
                    <Icon size={32} />
                  </div>
                  {/* Title */}
                  <h2 className="font-display font-bold text-lg text-slate-900 mb-2 leading-tight">
                    {card.title}
                  </h2>
                  {/* Description */}
                  <p className="text-gray-600 text-sm leading-relaxed mb-6 font-medium">
                    {card.desc}
                  </p>
                </div>

                {/* Button Action */}
                <div>
                  {card.external ? (
                    <a
                      href={card.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex items-center justify-center gap-1.5 w-full h-11 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        card.variant === 'amber'
                          ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-md shadow-amber-500/10'
                          : 'bg-white hover:bg-slate-50 text-slate-800 border border-gray-200'
                      }`}
                    >
                      {card.btnText} <ExternalLink size={12} className="opacity-60" />
                    </a>
                  ) : (
                    <Link
                      href={card.href}
                      className={`inline-flex items-center justify-center gap-1.5 w-full h-11 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        card.variant === 'amber'
                          ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-md shadow-amber-500/10'
                          : 'bg-white hover:bg-slate-50 text-slate-800 border border-gray-200'
                      }`}
                    >
                      {card.btnText} <ArrowRight size={12} className="opacity-60 group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </main>

      {/* Need Help Footer Bar */}
      <footer className="shrink-0 bg-white border-t border-gray-100 py-6 text-center">
        <a
          href={`tel:+91${ADVISOR_PHONE}`}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-800 hover:text-amber-600 uppercase tracking-widest transition-colors font-sans"
        >
          <Phone size={14} className="text-amber-500 animate-pulse" />
          {c.needHelp}
        </a>
      </footer>
    </div>
  )
}
