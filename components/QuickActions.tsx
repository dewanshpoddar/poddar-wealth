'use client'

import Link from 'next/link'
import { useLang } from '@/lib/LangContext'
import { ArrowRight } from 'lucide-react'

export default function QuickActions() {
  const { lang } = useLang()

  const actions = [
    {
      icon: '🧮',
      title: {
        en: 'Calculate Premium',
        hi: 'प्रीमियम कैलकुलेटर'
      },
      sub: {
        en: 'Know your exact LIC premium',
        hi: 'अपने वास्तविक LIC प्रीमियम को जानें'
      },
      href: '/calculators/premium'
    },
    {
      icon: '📋',
      title: {
        en: 'Insurance Quiz',
        hi: 'बीमा क्विज़'
      },
      sub: {
        en: '2 min — find the right plan',
        hi: '2 मिनट — सही प्लान का पता लगाएं'
      },
      href: '/insurance-quiz'
    },
    {
      icon: '💳',
      title: {
        en: 'Pay Premium',
        hi: 'प्रीमियम भुगतान'
      },
      sub: {
        en: 'Step-by-step guide',
        hi: 'प्रीमियम भरने की सरल गाइड'
      },
      href: '/pay-premium'
    },
    {
      icon: '📞',
      title: {
        en: 'Talk to Ajay Sir',
        hi: 'अजय सर से बात करें'
      },
      sub: {
        en: 'WhatsApp or Call',
        hi: 'व्हाट्सएप या डायरेक्ट कॉल'
      },
      href: 'https://wa.me/919415313434?text=Hi%20Ajay%20ji,%20I%20need%20insurance%20advice.',
      isExternal: true
    }
  ]

  return (
    <section className="bg-slate-50 py-8 px-4 border-b border-gray-100">
      <div className="max-w-[1240px] mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {actions.map((act, i) => {
            const title = act.title[lang as 'en' | 'hi'] || act.title.en
            const sub = act.sub[lang as 'en' | 'hi'] || act.sub.en
            
            const cardContent = (
              <div className="flex items-center gap-3 h-full w-full">
                {/* Left side: Icon */}
                <div className="w-10 h-10 rounded-xl bg-gold-pale flex items-center justify-center text-xl flex-shrink-0 group-hover:scale-105 transition-transform shadow-sm">
                  {act.icon}
                </div>
                {/* Right side: Text */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-[12.5px] font-extrabold text-navy truncate group-hover:text-gold transition-colors leading-snug">
                    {title}
                  </h3>
                  <p className="text-[10px] text-gray-500 truncate mt-0.5 font-medium leading-tight">
                    {sub}
                  </p>
                </div>
                <ArrowRight size={11} className="text-gray-300 group-hover:text-gold group-hover:translate-x-0.5 transition-all flex-shrink-0" />
              </div>
            )

            return act.isExternal ? (
              <a
                key={i}
                href={act.href}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white border border-gray-100 rounded-2xl p-3 md:p-4 hover:shadow-md hover:border-gold/15 transition-all duration-300 group min-h-[64px] flex items-center cursor-pointer"
              >
                {cardContent}
              </a>
            ) : (
              <Link
                key={i}
                href={act.href}
                className="bg-white border border-gray-100 rounded-2xl p-3 md:p-4 hover:shadow-md hover:border-gold/15 transition-all duration-300 group min-h-[64px] flex items-center cursor-pointer"
              >
                {cardContent}
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
