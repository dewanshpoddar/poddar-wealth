'use client'

import Link from 'next/link'
import { useLang } from '@/lib/LangContext'
import posts from '@/lib/data/blog-posts.json'
import {
  CATEGORY_COLORS, CATEGORY_COLORS_DEFAULT,
  CATEGORY_STYLES, CATEGORY_STYLES_DEFAULT,
  getReadingTime,
} from '@/lib/blog-utils'

export default function BlogPreview() {
  const { t, lang } = useLang()

  const previewT = t.blogPreview || {
    eyebrow: 'LATEST INSIGHTS',
    heading: 'From Our Knowledge Desk',
    sub: 'Read practical guides on wealth protection, LIC plans, and tax saving strategies.',
    readMore: 'Read →',
    seeAll: 'See all articles →',
    mins: 'min read'
  }

  // Sort posts by date descending and grab first 3
  const latestPosts = [...posts]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3)

  return (
    <section className="bg-slate-50 py-24 relative overflow-hidden border-t border-slate-100">
      <div className="max-w-[1240px] mx-auto px-8">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 text-[11px] tracking-[0.14em] text-gold font-medium uppercase mb-4">
            <span className="w-8 h-px bg-gold" />
            {previewT.eyebrow}
            <span className="w-8 h-px bg-gold" />
          </div>
          <h2 className="font-display text-[32px] lg:text-[40px] font-normal italic text-navy leading-[1.1] mb-4">
            {previewT.heading}
          </h2>
          <p className="text-[14px] text-muted leading-relaxed max-w-md mx-auto">
            {previewT.sub}
          </p>
        </div>

        {/* Post Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {latestPosts.map((post) => {
            const style = CATEGORY_STYLES[post.category] || CATEGORY_STYLES_DEFAULT
            const Icon = style.icon
            const readingTime = getReadingTime(post.content, post.contentHi, lang)

            return (
              <div
                key={post.slug}
                className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-md hover:border-gold/30 transition-all duration-300 flex flex-col group cursor-default"
              >
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
                <div className="px-6 pb-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-display font-bold text-[16px] text-navy leading-snug mb-3 group-hover:text-gold transition-colors duration-200">
                      {lang === 'en' ? post.title : post.titleHi}
                    </h3>
                    <p className="text-[13px] text-slate-500 leading-relaxed line-clamp-3 mb-6 font-medium">
                      {lang === 'en' ? post.summary : post.summaryHi}
                    </p>
                  </div>
                  <div className="flex items-center justify-between border-t border-slate-50 pt-4 mt-auto">
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
        </div>

        {/* View All Links */}
        <div className="text-center mt-12">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-xs font-bold text-navy hover:text-gold uppercase tracking-wider transition-colors duration-200 cursor-pointer"
          >
            {previewT.seeAll}
          </Link>
        </div>

      </div>
    </section>
  )
}
