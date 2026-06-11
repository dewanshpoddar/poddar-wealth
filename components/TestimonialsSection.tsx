'use client'
import { useRef, useState, useEffect } from 'react'
import { useLang } from '@/lib/LangContext'
import Link from 'next/link'
import Image from 'next/image'

export default function TestimonialsSection() {
  const { t, lang } = useLang()
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [googleReviews, setGoogleReviews] = useState<any[]>([])

  const testimonials = t.testimonials || { eyebrow: '', title: '', subtitle: '', items: [] }
  const localItems = testimonials.items || []

  useEffect(() => {
    async function fetchReviews() {
      try {
        const res = await fetch('/api/reviews')
        if (res.ok) {
          const data = await res.json()
          if (Array.isArray(data) && data.length > 0) {
            setGoogleReviews(data)
            return
          }
        }
      } catch (err) {
        console.error('Failed to fetch reviews', err)
      }
      // If endpoint fails, fallback to local static data
      const fallback = [
        {
          text: lang === 'en' 
            ? "Ajay sir helped my family choose the right plan. Very knowledgeable." 
            : "अजय सर ने हमारे परिवार को सही प्लान चुनने में मदद की। बहुत ज्ञानी हैं।",
          author: "R.K.",
          rating: 5,
          date: lang === 'en' ? "2 months ago" : "2 महीने पहले",
          source: "google"
        },
        {
          text: lang === 'en'
            ? "31 years of trust. Best LIC advisor in Gorakhpur."
            : "31 वर्षों का अटूट विश्वास। गोरखपुर में सर्वश्रेष्ठ एलआईसी सलाहकार।",
          author: "S.P.",
          rating: 5,
          date: lang === 'en' ? "5 months ago" : "5 महीने पहले",
          source: "google"
        },
        {
          text: lang === 'en'
            ? "Fast claim settlement. Recommended to everyone."
            : "त्वरित क्लेम सेटलमेंट। सभी को अजय सर की अत्यधिक अनुशंसा है।",
          author: "V.M.",
          rating: 5,
          date: lang === 'en' ? "1 year ago" : "1 वर्ष पहले",
          source: "google"
        }
      ]
      setGoogleReviews(fallback)
    }
    fetchReviews()
  }, [lang])

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -380, behavior: 'smooth' })
    }
  }

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 380, behavior: 'smooth' })
    }
  }

  // Interleave local testimonials and Google reviews
  const mergedItems: any[] = []
  const maxLength = Math.max(localItems.length, googleReviews.length)
  for (let i = 0; i < maxLength; i++) {
    if (i < localItems.length) {
      mergedItems.push({ ...localItems[i], isGoogle: false })
    }
    if (i < googleReviews.length) {
      mergedItems.push({ ...googleReviews[i], isGoogle: true })
    }
  }

  const headingText = lang === 'en' ? "Trusted by 5,000+ Families" : "5,000+ परिवारों का अटूट विश्वास"
  const subtitleText = lang === 'en' 
    ? "31 years of keeping promises, one family at a time." 
    : "31 वर्षों से हर वादे को निभाने का सफर, हर परिवार के साथ।"

  const tags = lang === 'en' 
    ? ['Life Insurance', 'Health Insurance', 'Retirement', 'Keyman']
    : ['लाइफ इंश्योरेंस', 'हेल्थ इंश्योरेंस', 'रिटायरमेंट', 'कीमैन']

  return (
    <section className="bg-white py-16 md:py-20 overflow-hidden border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        
        {/* Unified Eyebrow, Title & Subtitle (Centered) */}
        <div className="text-center mb-12 flex flex-col items-center">
          {/* Eyebrow */}
          <div className="flex items-center justify-center gap-3 text-[11px] tracking-[0.14em] text-gold font-medium uppercase mb-4">
            <span className="w-8 h-px bg-gold" />
            {testimonials.eyebrow || (lang === 'en' ? "Real families, real stories" : "असली परिवार, असली कहानियां")}
            <span className="w-8 h-px bg-gold" />
          </div>

          {/* Main Title */}
          <h2 className="text-center font-display font-bold text-2xl md:text-3xl text-navy mb-4">
            {headingText}
          </h2>

          {/* Google rating badge */}
          <a
            href="https://g.page/poddar-wealth-management/review"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-slate-50 hover:bg-slate-100 border border-slate-200/80 rounded-full px-4 py-2 text-xs font-semibold text-slate-700 transition-all mb-4 hover:border-gold/50 shadow-sm"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
            </svg>
            <span className="text-amber-500 font-bold">4.9 ★</span>
            <span className="text-slate-300">|</span>
            <span>{lang === 'en' ? '154+ Verified Reviews' : '154+ सत्यापित समीक्षाएं'}</span>
            <span className="text-slate-300">|</span>
            <span className="text-gold hover:underline flex items-center gap-0.5">
              {lang === 'en' ? 'See on Google' : 'गूगल पर देखें'} →
            </span>
          </a>

          {/* Subtitle */}
          <p className="text-center text-[14px] text-muted leading-relaxed max-w-xl mx-auto mb-6">
            {subtitleText}
          </p>

          {/* Category Badges */}
          <div className="flex flex-wrap justify-center gap-2 max-w-lg mx-auto mb-2">
            {tags.map((tag, idx) => (
              <span key={idx} className="bg-slate-50 text-slate-600 border border-slate-200/80 rounded-full px-3 py-1 text-[11px] font-medium tracking-wide">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Carousel Container (Relative for absolute arrows) */}
        <div className="relative">
          {/* Scroll Buttons (Desktop Only - Left & Right of Carousel) */}
          <button 
            onClick={scrollLeft}
            className="absolute left-2 xl:-left-6 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center bg-white shadow-md text-navy hover:bg-gold hover:text-white hover:border-gold transition-all duration-200 cursor-pointer hidden md:flex"
            aria-label="Scroll left"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
          </button>
          <button 
            onClick={scrollRight}
            className="absolute right-2 xl:-right-6 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center bg-white shadow-md text-navy hover:bg-gold hover:text-white hover:border-gold transition-all duration-200 cursor-pointer hidden md:flex"
            aria-label="Scroll right"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
          </button>

          {/* Carousel Track */}
          <div 
            ref={scrollContainerRef}
            className="flex gap-6 overflow-x-auto pb-6 scrollbar-none snap-x snap-mandatory scroll-smooth -mx-6 px-6 md:-mx-8 md:px-8"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {mergedItems.map((item: any, i: number) => {
              const isGoogle = item.isGoogle
              const rating = item.rating || 5
              const text = item.text
              const name = isGoogle ? item.author : item.name
              
              const meta = isGoogle
                ? (item.date ? `${item.date} · Google Review` : 'Google Review')
                : item.location
                
              const badgeText = isGoogle ? (lang === 'en' ? 'Google Review' : 'गूगल समीक्षा') : item.badge
              const badgeColor = isGoogle ? '#E6F1FB' : (item.color || '#FEF9EC')
              const badgeTextColor = isGoogle ? '#185FA5' : (item.textColor || '#C8960C')
              
              const hasAvatar = !isGoogle && item.avatar
              const avatarSrc = !isGoogle ? item.avatar : null

              return (
                <div 
                  key={i} 
                  className="pw-ts-card w-[290px] md:w-[350px] flex-shrink-0 snap-center flex flex-col justify-between"
                >
                  <div>
                    {/* Stars + Google G Indicator */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex gap-0.5">
                        {[...Array(rating)].map((_, s) => (
                          <span key={s} className="pw-ts-star" />
                        ))}
                      </div>
                      {isGoogle && (
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                        </svg>
                      )}
                    </div>

                    <p className="pw-ts-text text-[13px] line-clamp-4 leading-relaxed font-medium text-slate-600">&ldquo;{text}&rdquo;</p>
                  </div>

                  {/* Author & Badge */}
                  <div className="mt-4 pt-4 border-t border-slate-100">
                    <div className="flex items-center gap-3 mb-2.5">
                      {hasAvatar ? (
                        <div className="relative w-9 h-9 rounded-full overflow-hidden flex-shrink-0 border border-gray-100">
                          <Image
                            src={avatarSrc}
                            alt={name}
                            fill
                            sizes="36px"
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-500/10 to-amber-500/20 text-gold flex items-center justify-center text-[12px] font-semibold flex-shrink-0 uppercase">
                          {name ? name.charAt(0) : '?'}
                        </div>
                      )}
                      <div>
                        <div className="pw-ts-name text-[13px] font-bold text-navy">{name}</div>
                        <div className="pw-ts-meta text-[11px] text-slate-400 font-medium">{meta}</div>
                      </div>
                    </div>

                    <span 
                      className="inline-block px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wide"
                      style={{ backgroundColor: badgeColor, color: badgeTextColor }}
                    >
                      {badgeText}
                    </span>
                  </div>
                </div>
              )
            })}

            {/* View More Card */}
            <Link 
              href="/testimonials"
              className="pw-ts-card w-[290px] md:w-[350px] flex-shrink-0 snap-center flex flex-col items-center justify-center text-center group border border-dashed border-gray-300 hover:border-gold hover:bg-gold/5 transition-all duration-300 cursor-pointer"
            >
              <div className="w-12 h-12 rounded-full bg-gold/10 group-hover:bg-gold text-gold group-hover:text-white flex items-center justify-center transition-all duration-300 mb-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
              <span className="font-display font-semibold text-navy text-[15px] group-hover:text-gold transition-colors duration-200">
                {lang === 'en' ? 'View More Stories' : 'अधिक कहानियां देखें'}
              </span>
              <p className="text-[12px] text-muted mt-1 max-w-[200px]">
                {lang === 'en' ? 'Read experiences from families all across India' : 'पूरे भारत के परिवारों के अनुभव पढ़ें'}
              </p>
            </Link>
          </div>
        </div>

        {/* View More Buttons below Carousel */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
          <Link
            href="/testimonials"
            className="w-full sm:w-auto text-center inline-flex items-center justify-center gap-2 text-xs font-bold text-navy hover:text-gold uppercase tracking-wider transition-all duration-200 cursor-pointer border border-navy/10 hover:border-gold rounded-full px-6 py-3 hover:shadow-sm"
          >
            {lang === 'en' ? 'See all testimonials' : 'सभी प्रशंसापत्र देखें'} →
          </Link>
          <a
            href="https://g.page/poddar-wealth-management/review"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto text-center inline-flex items-center justify-center gap-2 text-xs font-bold text-navy hover:text-gold uppercase tracking-wider transition-all duration-200 cursor-pointer border border-navy/10 hover:border-gold rounded-full px-6 py-3 hover:shadow-sm"
          >
            {lang === 'en' ? 'See all reviews on Google' : 'गूगल पर सभी समीक्षाएं देखें'} →
          </a>
        </div>
      </div>
    </section>
  )
}
