'use client'

import { useEffect, useRef, useState } from 'react'
import { useLang } from '@/lib/LangContext'
import { Star } from 'lucide-react'

// TODO (Dewansh): Add real Google Reviews here. You can update this static array with actual reviews from Google Maps.
const REVIEWS = [
  {
    id: 1,
    textKey: 'review1Text',
    authorKey: 'review1Author',
    rating: 5
  },
  {
    id: 2,
    textKey: 'review2Text',
    authorKey: 'review2Author',
    rating: 5
  },
  {
    id: 3,
    textKey: 'review3Text',
    authorKey: 'review3Author',
    rating: 5
  }
]

export default function GoogleReviewsBadge() {
  const { t, lang } = useLang()
  const [count, setCount] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const animatedRef = useRef(false)

  const reviewT = t.googleReviews || {
    eyebrow: 'VERIFIED TRUST',
    heading: '4.9 Rating | 154 Google Reviews',
    sub: '100% verified external reviews on Google Maps',
    review1Text: 'Best insurance advisor in Gorakhpur. Very trustworthy.',
    review1Author: 'R.K.',
    review2Text: 'Ajay sir helped us with claim settlement in just 30 days.',
    review2Author: 'S.P.',
    review3Text: 'Managing our family insurance for 15 years now.',
    review3Author: 'V.M.',
    viewOnGoogle: 'View all reviews on Google Maps →'
  }

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries
        if (entry.isIntersecting && !animatedRef.current) {
          animatedRef.current = true
          let startTimestamp: number | null = null
          const endValue = 154
          const duration = 1200 // 1.2 seconds

          const step = (timestamp: number) => {
            if (!startTimestamp) startTimestamp = timestamp
            const progress = Math.min((timestamp - startTimestamp) / duration, 1)
            setCount(Math.floor(progress * endValue))
            if (progress < 1) {
              window.requestAnimationFrame(step)
            }
          };

          window.requestAnimationFrame(step)
        }
      },
      { threshold: 0.1 }
    )

    if (containerRef.current) {
      observer.observe(containerRef.current)
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current)
      }
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="max-w-5xl mx-auto px-6 mb-16 animate-fade-up"
    >
      <div
        className="bg-white border border-gray-100 shadow-sm rounded-3xl p-8 hover:shadow-md transition-all duration-300 group overflow-hidden relative"
      >
        {/* Glow decoration */}
        <div className="absolute right-0 top-0 w-80 h-80 bg-gold/5 rounded-full blur-[80px] pointer-events-none -z-10" />

        <div className="flex flex-col lg:flex-row gap-8 items-center justify-between">
          
          {/* Left Column: Aggregated Rating */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left shrink-0">
            <span className="text-[10px] font-bold text-gold tracking-[0.2em] uppercase mb-2">
              {reviewT.eyebrow}
            </span>

            {/* Google Logo and Rating */}
            <a
              href="https://g.page/poddar-wealth-management/review"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3.5 mb-3 hover:opacity-90 transition-opacity cursor-pointer group/link"
            >
              <div className="w-10 h-10 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center p-2 shadow-sm group-hover:scale-105 transition-transform duration-300">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v3.92h6.69a5.74 5.74 0 0 1-2.48 3.77v3.13h4.01c2.34-2.16 3.68-5.32 3.68-8.75z"/>
                  <path fill="#34A853" d="M12 24c3.24 0 5.97-1.08 7.96-2.91l-4.01-3.13c-1.12.75-2.55 1.19-3.95 1.19-3.04 0-5.61-2.05-6.53-4.82H1.31v3.23A12 12 0 0 0 12 24z"/>
                  <path fill="#FBBC05" d="M5.47 14.33a7.16 7.16 0 0 1 0-4.66V6.44H1.31a12 12 0 0 0 0 11.12z"/>
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.44-3.44A12 12 0 0 0 1.31 6.44l4.16 3.23c.92-2.77 3.49-4.82 6.53-4.82z"/>
                </svg>
              </div>
              <div className="flex flex-col text-left">
                <div className="flex items-center gap-1.5">
                  <span className="font-display font-bold text-2xl text-navy">4.9</span>
                  <div className="flex gap-0.5 text-gold">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={15} className="fill-gold text-gold" />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-slate-400 font-bold tracking-wide uppercase mt-0.5">
                  {count} Google Reviews
                </p>
              </div>
            </a>

            <p className="text-[13px] text-slate-500 font-medium mb-4">
              {reviewT.sub}
            </p>

            <a
              href="https://g.page/poddar-wealth-management/review"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[11px] font-bold text-gold hover:text-amber-700 transition-colors uppercase tracking-wider mb-5 cursor-pointer"
            >
              {reviewT.viewOnGoogle}
            </a>

            {/* Trust Credentials */}
            <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
              <span className="bg-gold/10 text-gold border border-gold/20 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                MDRT Member
              </span>
              <span className="bg-navy/5 text-navy/70 border border-navy/10 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                {lang === 'hi' ? 'चेयरमैन क्लब' : "Chairman's Club"}
              </span>
            </div>
          </div>

          {/* Right Column: Review Snippets Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
            {REVIEWS.map((rev) => {
              const text = reviewT[rev.textKey as keyof typeof reviewT] || '';
              const author = reviewT[rev.authorKey as keyof typeof reviewT] || '';
              return (
                <div
                  key={rev.id}
                  className="bg-slate-50 border border-slate-100 rounded-2xl p-5 hover:border-gold/15 transition-all duration-300 flex flex-col justify-between"
                >
                  <p className="text-[12.5px] text-navy leading-relaxed italic mb-4 font-medium">
                    &ldquo;{text}&rdquo;
                  </p>
                  <div className="flex items-center justify-between border-t border-slate-100/50 pt-3">
                    <div className="flex gap-0.5 text-gold">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} size={10} className="fill-gold text-gold" />
                      ))}
                    </div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                      - {author}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>

        </div>
      </div>
    </div>
  )
}
