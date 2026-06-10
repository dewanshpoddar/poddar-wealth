'use client'

import Link from 'next/link'
import { useLang } from '@/lib/LangContext'
import { ArrowRight, Calculator, ClipboardList, CreditCard, Phone } from 'lucide-react'
import { ADVISOR_PHONE } from '@/lib/constants'

export default function QuickActions() {
  const { lang } = useLang()

  const actions = [
    {
      icon: <Calculator className="w-5 h-5 text-amber-500" />,
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
      icon: <ClipboardList className="w-5 h-5 text-amber-500" />,
      title: {
        en: 'Insurance Quiz',
        hi: 'बीमा क्विज़'
      },
      sub: {
        en: '2 min: find the right plan',
        hi: '2 मिनट: सही प्लान का पता लगाएं'
      },
      href: '/insurance-quiz'
    },
    {
      icon: <CreditCard className="w-5 h-5 text-amber-500" />,
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
      icon: <Phone className="w-5 h-5 text-amber-500" />,
      title: {
        en: 'Talk to Ajay Sir',
        hi: 'अजय सर से बात करें'
      },
      sub: {
        en: 'WhatsApp or Call',
        hi: 'व्हाट्सएप या डायरेक्ट कॉल'
      },
      href: `https://wa.me/91${ADVISOR_PHONE}?text=Hi%20Ajay%20ji,%20I%20need%20insurance%20advice.`,
      isExternal: true
    }
  ]

  return (
    <section className="bg-white py-16 md:py-20 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {actions.map((act, i) => {
            const title = act.title[lang as 'en' | 'hi'] || act.title.en
            const sub = act.sub[lang as 'en' | 'hi'] || act.sub.en
            
            const cardContent = (
              <div className="flex items-center gap-3 h-full w-full">
                {/* Left side: Icon */}
                <div className="w-10 h-10 rounded-xl bg-gold-pale flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform shadow-sm">
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

            const isTalkCard = act.href.includes('wa.me')
            const cardClass = isTalkCard
              ? "bg-amber-50/50 border border-amber-200/40 rounded-2xl p-3 md:p-4 shadow-sm hover:shadow-gold hover:border-gold/40 hover:bg-amber-50 hover:-translate-y-0.5 transition-all duration-300 group min-h-[64px] flex items-center cursor-pointer w-full"
              : "bg-white border border-gray-100 rounded-2xl p-3 md:p-4 shadow-sm hover:shadow-gold-sm hover:border-gold/30 hover:-translate-y-0.5 transition-all duration-300 group min-h-[64px] flex items-center cursor-pointer w-full"

            return act.isExternal ? (
              <a
                key={i}
                href={act.href}
                target="_blank"
                rel="noopener noreferrer"
                className={cardClass}
              >
                {cardContent}
              </a>
            ) : (
              <Link
                key={i}
                href={act.href}
                className={cardClass}
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
