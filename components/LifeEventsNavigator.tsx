'use client'

import Link from 'next/link'
import { useLang } from '@/lib/LangContext'
import { LIFE_EVENTS } from '@/lib/data/life-events'
import { Briefcase, Heart, Baby, Home, Sunset, HeartPulse } from 'lucide-react'

const iconMap: Record<string, any> = {
  Briefcase: Briefcase,
  Heart: Heart,
  Baby: Baby,
  Home: Home,
  Sunset: Sunset,
  HeartPulse: HeartPulse,
}

const colorMap: Record<string, { bg: string; text: string; ring: string }> = {
  blue: { bg: 'bg-blue-50', text: 'text-blue-600', ring: 'ring-blue-100/60' },
  rose: { bg: 'bg-rose-50', text: 'text-rose-600', ring: 'ring-rose-100/60' },
  amber: { bg: 'bg-amber-50', text: 'text-amber-600', ring: 'ring-amber-100/60' },
  emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600', ring: 'ring-emerald-100/60' },
  violet: { bg: 'bg-violet-50', text: 'text-violet-600', ring: 'ring-violet-100/60' },
  red: { bg: 'bg-red-50', text: 'text-red-600', ring: 'ring-red-100/60' },
}

export default function LifeEventsNavigator() {
  const { lang } = useLang()

  const title = lang === 'hi' ? 'आपके जीवन में क्या चल रहा है?' : "What's happening in your life?"
  const subtitle = lang === 'hi' 
    ? 'अपने जीवन का वर्तमान चरण चुनें। हम सही सुरक्षा के लिए आपका मार्गदर्शन करेंगे।'
    : "Choose your life stage. We'll guide you to the right protection."

  return (
    <section className="bg-white py-16 border-b border-gray-100 relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-gold/5 rounded-full blur-[100px] pointer-events-none -z-10 -translate-y-1/2" />

      <div className="max-w-7xl mx-auto px-6 md:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <p className="text-amber-500 text-sm font-semibold uppercase tracking-wider mb-2 text-center">
            {lang === 'hi' ? 'लाइफ स्टेज नेविगेटर' : 'LIFE STAGES'}
          </p>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white text-center">
            {title}
          </h2>
          <p className="text-gray-500 mt-2 text-center">
            {subtitle}
          </p>
        </div>

        {/* 6 Cards: 2 rows of 3 on desktop, stack on mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {LIFE_EVENTS.map((event) => {
            const Icon = iconMap[event.icon] || Briefcase
            const c = colorMap[event.color] || colorMap.blue
            const eventTitle = lang === 'hi' ? event.titleHi : event.title
            const eventDesc = lang === 'hi' ? event.descriptionHi : event.description

            return (
              <Link 
                key={event.slug}
                href={`/life-events/${event.slug}`}
                className="group flex items-center gap-3.5 p-3.5 sm:p-6 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md hover:border-gold/30 hover:-translate-y-0.5 transition-all duration-300 h-[60px] sm:h-auto cursor-pointer"
              >
                {/* Left side: Icon Container */}
                <div className={`w-9 h-9 sm:w-12 sm:h-12 rounded-full flex items-center justify-center shrink-0 ring-4 ${c.ring} ${c.bg} ${c.text} transition-transform duration-300 group-hover:scale-105`}>
                  <Icon className="w-4.5 h-4.5 sm:w-5.5 sm:h-5.5" />
                </div>

                {/* Right side: Title & Subtitle */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-[13px] sm:text-[15px] font-bold text-navy leading-snug group-hover:text-gold transition-colors truncate">
                    {eventTitle}
                  </h3>
                  <p className="text-[10px] sm:text-[12.5px] text-slate-500 leading-normal truncate mt-0.5 font-medium">
                    {eventDesc}
                  </p>
                </div>

                {/* Arrow indicator */}
                <span className="text-gray-300 group-hover:text-gold group-hover:translate-x-0.5 transition-all text-14 font-semibold shrink-0 max-sm:hidden">
                  →
                </span>
              </Link>
            )
          })}
        </div>

      </div>
    </section>
  )
}
