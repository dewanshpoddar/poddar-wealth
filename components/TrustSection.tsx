'use client'
import { useLang } from '@/lib/LangContext'
import { Star } from 'lucide-react'

export default function TrustSection() {
  const { lang } = useLang()

  const stats = [
    {
      num: '31+',
      label: {
        en: 'Years of Service',
        hi: 'वर्षों का सेवा अनुभव'
      }
    },
    {
      num: '5000+',
      label: {
        en: 'Protected Families',
        hi: 'सुरक्षित परिवार'
      }
    },
    {
      num: "MDRT USA Member",
      label: {
        en: 'Global Top 1%',
        hi: 'ग्लोबल टॉप 1%'
      }
    },
    {
      num: 'Chairman\'s',
      label: {
        en: 'Club Awardee',
        hi: 'चेयरमैन क्लब सदस्य'
      }
    },
    {
      num: '4.9★ Google',
      label: {
        en: 'Verified Reviews',
        hi: 'सत्यापित रिव्यूज'
      },
      link: 'https://www.google.com/maps/place/Poddar+Wealth+Management/'
    }
  ]

  return (
    <section className="bg-white py-12 md:py-14 border-y border-gray-100 relative overflow-hidden">
      {/* Top subtle gold line decorative bar */}
      <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-amber-200/10 via-gold/30 to-amber-200/10" />

      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <div className="flex md:grid md:grid-cols-5 items-stretch gap-4 md:gap-6 overflow-x-auto md:overflow-x-visible snap-x snap-mandatory scrollbar-none py-2 px-2 -mx-4 md:mx-0 md:px-0 scroll-smooth">
          {stats.map((stat, idx) => {
            const isLink = !!stat.link
            const labelText = stat.label[lang as 'en' | 'hi'] || stat.label.en
            
            const cardContent = (
              <div className="flex flex-col items-center justify-center text-center h-full">
                {/* Number with tabular-nums */}
                <div className="text-3xl md:text-4xl font-display font-extrabold text-navy tracking-tight tabular-nums flex items-center justify-center gap-1 group-hover:scale-105 transition-transform duration-300">
                  {stat.num.includes('★') ? (
                    <span className="flex items-center text-amber-700 gap-0.5">
                      4.9<Star size={22} className="fill-amber-500 text-amber-500 inline-block align-middle mb-1" /> Google
                    </span>
                  ) : (
                    <span className="text-navy bg-clip-text bg-gradient-to-b from-navy to-navy/80">{stat.num}</span>
                  )}
                </div>

                {/* Subtle gold accent divider line */}
                <div className="w-8 h-[2px] bg-gradient-to-r from-gold/50 to-gold/10 rounded-full my-2.5" />

                {/* Label */}
                <p className="text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-widest leading-relaxed max-w-[150px] md:max-w-none">
                  {labelText}
                </p>
              </div>
            )

            if (isLink) {
              return (
                <a
                  key={idx}
                  href={stat.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-w-[180px] md:min-w-0 flex-1 flex-shrink-0 snap-center py-6 px-4 relative group cursor-pointer block hover:scale-[1.02] transition-transform duration-300"
                >
                  {cardContent}
                  {idx < stats.length - 1 && (
                    <div className="hidden md:block absolute right-0 top-4 bottom-4 w-[1px] bg-gradient-to-b from-transparent via-gold/25 to-transparent" />
                  )}
                </a>
              )
            }

            return (
              <div
                key={idx}
                className="min-w-[180px] md:min-w-0 flex-1 flex-shrink-0 snap-center py-6 px-4 relative group"
              >
                {cardContent}
                {idx < stats.length - 1 && (
                  <div className="hidden md:block absolute right-0 top-4 bottom-4 w-[1px] bg-gradient-to-b from-transparent via-gold/25 to-transparent" />
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
