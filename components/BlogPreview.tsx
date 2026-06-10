'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { useLang } from '@/lib/LangContext'
import posts from '@/lib/data/blog-index.json'
import {
  CATEGORY_COLORS, CATEGORY_COLORS_DEFAULT,
  CATEGORY_STYLES, CATEGORY_STYLES_DEFAULT,
  getReadingTime,
} from '@/lib/blog-utils'

export default function BlogPreview() {
  const { t, lang } = useLang()
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const previewT = t.blogPreview || {
    eyebrow: 'LATEST INSIGHTS',
    heading: 'From Our Knowledge Desk',
    sub: 'Read practical guides on wealth protection, LIC plans, and tax saving strategies.',
    readMore: 'Read →',
    seeAll: 'See all articles →',
    mins: 'min read'
  }

  // Sort posts by date descending and grab first 6
  const latestPosts = [...posts]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 6)

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
    <section className="bg-slate-50 py-16 md:py-20 relative overflow-hidden border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        
        {/* Section Header (Centered) */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 text-[11px] tracking-[0.14em] text-gold font-medium uppercase mb-4">
            <span className="w-8 h-px bg-gold" />
            {previewT.eyebrow}
            <span className="w-8 h-px bg-gold" />
          </div>
          <h2 className="text-center font-display font-bold text-2xl md:text-3xl text-navy mb-4">
            {previewT.heading}
          </h2>
          <p className="text-center text-[14px] text-muted leading-relaxed max-w-xl mx-auto">
            {previewT.sub}
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

          {/* Post Cards Carousel Track */}
          <div 
            ref={scrollContainerRef}
            className="flex gap-6 overflow-x-auto pb-6 scrollbar-none snap-x snap-mandatory scroll-smooth -mx-6 px-6 md:-mx-8 md:px-8"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {latestPosts.map((post) => {
              const style = CATEGORY_STYLES[post.category] || CATEGORY_STYLES_DEFAULT
              const Icon = style.icon
              const readingTime = post.readTime || 2

              return (
                <div
                  key={post.slug}
                  className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:border-gold/30 transition-all duration-300 flex flex-col group w-[290px] md:w-[360px] flex-shrink-0 snap-center cursor-default justify-between"
                >
                  <div>
                    {/* Premium Corporate Solid Header */}
                    <div className={`h-[120px] w-full ${style.bg} flex flex-col items-center justify-center relative overflow-hidden`}>
                      <div className="absolute inset-0 bg-white/5 opacity-5 mix-blend-overlay" />
                      <Icon className="w-8 h-8 text-white mb-2 transition-transform duration-500 group-hover:scale-110" />
                      <span className="text-[10px] font-bold text-white/70 uppercase tracking-widest leading-none">
                        {post.category}
                      </span>
                    </div>

                    {/* Card Meta & Header */}
                    <div className="px-6 pt-5 pb-3 flex items-center justify-between">
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border uppercase tracking-wider ${CATEGORY_COLORS[post.category] ?? CATEGORY_COLORS_DEFAULT}`}>
                        {post.category}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {readingTime} {previewT.mins}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="px-6 pb-6">
                      <h3 className="font-display font-bold text-[15px] text-navy leading-snug mb-3 group-hover:text-gold transition-colors duration-200 line-clamp-2 min-h-[44px]">
                        {lang === 'en' ? post.title : post.titleHi}
                      </h3>
                      <p className="text-[13px] text-slate-500 leading-relaxed line-clamp-3 mb-4 font-medium font-display">
                        {lang === 'en' ? post.summary : post.summaryHi}
                      </p>
                    </div>
                  </div>

                  {/* Footer section of Card */}
                  <div className="px-6 pb-6 pt-4 border-t border-slate-50 mt-auto">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">
                        {post.author.split(' ')[0]}
                      </span>
                      <Link
                        href={`/blog/${post.slug}`}
                        className="text-[12px] font-bold text-gold hover:text-amber-700 transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        {previewT.readMore}
                      </Link>
                    </div>
                  </div>
                </div>
              )
            })}

            {/* View More Card */}
            <Link 
              href="/blog"
              className="bg-white border border-dashed border-gray-300 rounded-2xl w-[290px] md:w-[360px] flex-shrink-0 snap-center flex flex-col items-center justify-center text-center p-6 group hover:border-gold hover:bg-gold/5 transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md"
            >
              <div className="w-12 h-12 rounded-full bg-gold/10 group-hover:bg-gold text-gold group-hover:text-white flex items-center justify-center transition-all duration-300 mb-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
              <span className="font-display font-semibold text-navy text-[15px] group-hover:text-gold transition-colors duration-200">
                {previewT.seeAll}
              </span>
              <p className="text-[12px] text-muted mt-1 max-w-[220px]">
                {lang === 'en' ? 'Explore our full library of guides and expert comparisons' : 'गाइड और तुलनात्मक लेखों की हमारी पूरी लाइब्रेरी देखें'}
              </p>
            </Link>
          </div>
        </div>

        {/* View All Button below Carousel */}
        <div className="text-center mt-10">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-xs font-bold text-navy hover:text-gold uppercase tracking-wider transition-all duration-200 cursor-pointer border border-navy/10 rounded-full px-6 py-3 hover:border-gold hover:shadow-sm"
          >
            {previewT.seeAll}
          </Link>
        </div>

      </div>
    </section>
  )
}
