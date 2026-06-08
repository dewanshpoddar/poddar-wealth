'use client'

import { useEffect, useState } from 'react'
import { useLang } from '@/lib/LangContext'
import { Star } from 'lucide-react'

interface Review {
  text: string
  author: string
  rating: number
  date?: string
}

export default function GoogleReviewsSection() {
  const { t, lang } = useLang()
  const [reviews, setReviews] = useState<Review[]>([])

  const fallbackReviews: Review[] = [
    {
      text: lang === 'en' 
        ? "Ajay sir helped my family choose the right plan. Very knowledgeable." 
        : "अजय सर ने हमारे परिवार को सही प्लान चुनने में मदद की। बहुत ज्ञानी हैं।",
      author: "R.K.",
      rating: 5,
      date: lang === 'en' ? "2 months ago" : "2 महीने पहले"
    },
    {
      text: lang === 'en'
        ? "31 years of trust. Best LIC advisor in Gorakhpur."
        : "31 वर्षों का अटूट विश्वास। गोरखपुर में सर्वश्रेष्ठ एलआईसी सलाहकार।",
      author: "S.P.",
      rating: 5,
      date: lang === 'en' ? "5 months ago" : "5 महीने पहले"
    },
    {
      text: lang === 'en'
        ? "Fast claim settlement. Recommended to everyone."
        : "त्वरित क्लेम सेटलमेंट। सभी को अजय सर की अत्यधिक अनुशंसा है।",
      author: "V.M.",
      rating: 5,
      date: lang === 'en' ? "1 year ago" : "1 वर्ष पहले"
    }
  ]

  useEffect(() => {
    async function fetchReviews() {
      try {
        const res = await fetch('/api/reviews')
        if (res.ok) {
          const data = await res.json()
          if (Array.isArray(data) && data.length > 0) {
            setReviews(data)
            return
          }
        }
      } catch {
        // Fallback handled below
      }
      setReviews(fallbackReviews)
    }
    fetchReviews()
  }, [lang])

  const sectionT = t.reviewsWidget || {
    heading: lang === 'en' ? "What families say about us" : "हमारे बारे में लोग क्या कहते हैं",
    subheading: lang === 'en' ? "4.9/5.0 from 154+ Google Reviews" : "154+ गूगल समीक्षाओं से 4.9/5.0 रेटिंग",
    seeAll: lang === 'en' ? "See all reviews on Google" : "गूगल पर सभी समीक्षाएं देखें"
  }

  return (
    <section className="bg-white py-16 border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="font-display font-bold text-2xl md:text-3xl text-navy mb-2">
            {sectionT.heading}
          </h2>
          <p className="text-sm font-bold text-gold uppercase tracking-wider">
            {sectionT.subheading}
          </p>
        </div>

        {/* Reviews Container */}
        <div className="flex gap-6 overflow-x-auto pb-4 md:grid md:grid-cols-3 scrollbar-hide">
          {reviews.map((rev, idx) => (
            <div
              key={idx}
              className="bg-gray-50 border border-gray-100 rounded-2xl p-6 min-w-[280px] flex-shrink-0 flex flex-col justify-between hover:border-gold/20 transition-all duration-300 shadow-sm"
            >
              <div>
                <div className="flex gap-0.5 text-gold mb-3">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} size={15} className="fill-gold text-gold" />
                  ))}
                </div>
                <p className="text-sm text-gray-600 leading-relaxed italic line-clamp-3 mb-4 font-medium">
                  &ldquo;{rev.text}&rdquo;
                </p>
              </div>
              
              <div className="flex items-center justify-between border-t border-gray-100/60 pt-3">
                <span className="text-xs font-semibold text-navy">
                  {rev.author}
                </span>
                {rev.date && (
                  <span className="text-[11px] text-gray-400 font-medium">
                    {rev.date}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Link at Bottom */}
        <div className="text-center mt-10">
          <a
            href="https://g.page/poddar-wealth-management/review"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-navy hover:text-gold transition-colors underline decoration-gold underline-offset-4"
          >
            {sectionT.seeAll}
          </a>
        </div>

      </div>
    </section>
  )
}
