'use client'
import { useRef } from 'react'
import { useLang } from '@/lib/LangContext'
import Link from 'next/link'
import Image from 'next/image'

export default function TestimonialsSection() {
  const { t, lang } = useLang()
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const testimonials = t.testimonials || { eyebrow: '', title: '', subtitle: '', items: [] }
  const items = testimonials.items || []

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

  return (
    <section className="bg-white py-16 md:py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        {/* Unified Eyebrow, Title & Subtitle (Centered) */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 text-[11px] tracking-[0.14em] text-gold font-medium uppercase mb-4">
            <span className="w-8 h-px bg-gold" />
            {testimonials.eyebrow}
            <span className="w-8 h-px bg-gold" />
          </div>
          <h2 className="text-center font-display font-bold text-2xl md:text-3xl text-navy mb-4">
            {testimonials.title}
          </h2>
          <p className="text-center text-[14px] text-muted leading-relaxed max-w-xl mx-auto">
            {testimonials.subtitle}
          </p>
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
            {items.map((item: any, i: number) => (
              <div 
                key={i} 
                className="pw-ts-card w-[290px] md:w-[350px] flex-shrink-0 snap-center flex flex-col justify-between"
              >
                <div>
                  {/* Stars */}
                  <div className="flex gap-0.5 mb-3">
                    {[1,2,3,4,5].map(s => (
                      <span key={s} className="pw-ts-star" />
                    ))}
                  </div>

                  <p className="pw-ts-text text-[13px] line-clamp-4">&ldquo;{item.text}&rdquo;</p>
                </div>

                {/* Author & Badge */}
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-3 mb-2.5">
                    {item.avatar ? (
                      <div className="relative w-9 h-9 rounded-full overflow-hidden flex-shrink-0 border border-gray-100">
                        <Image
                          src={item.avatar}
                          alt={item.name}
                          fill
                          sizes="36px"
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gold/20 to-gold/40 text-gold flex items-center justify-center text-12 font-medium flex-shrink-0 uppercase">
                        {item.name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <div className="pw-ts-name text-[13px]">{item.name}</div>
                      <div className="pw-ts-meta text-[11px]">{item.location}</div>
                    </div>
                  </div>

                  <span className="pw-badge pw-badge--gold inline-block" style={{ fontSize: '9px' }}>
                    {item.badge}
                  </span>
                </div>
              </div>
            ))}

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

        {/* View More Button below Carousel */}
        <div className="text-center mt-10">
          <Link
            href="/testimonials"
            className="inline-flex items-center gap-2 text-xs font-bold text-navy hover:text-gold uppercase tracking-wider transition-all duration-200 cursor-pointer border border-navy/10 rounded-full px-6 py-3 hover:border-gold hover:shadow-sm"
          >
            {lang === 'en' ? 'See all testimonials' : 'सभी प्रशंसापत्र देखें'} →
          </Link>
        </div>
      </div>
    </section>
  )
}
