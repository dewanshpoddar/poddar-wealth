'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useLang } from '@/lib/LangContext'
import posts from '@/lib/data/blog-index.json'
import NewsletterSignup from '@/components/NewsletterSignup'
import {
  CATEGORY_COLORS, CATEGORY_COLORS_DEFAULT,
  CATEGORY_STYLES, CATEGORY_STYLES_DEFAULT,
  BLOG_CATEGORIES,
  formatBlogDateShort,
} from '@/lib/blog-utils'

export default function BlogPage() {
  const { t, lang } = useLang()
  const [activeCategory, setActiveCategory] = useState('All')

  const filtered = activeCategory === 'All'
    ? posts
    : posts.filter(p => 
        p.category === activeCategory || 
        (Array.isArray(p.tags) && p.tags.some(tag => tag.toLowerCase() === activeCategory.toLowerCase()))
      )

  return (
    <div className="min-h-screen bg-white pt-20">
      {/* Hero */}
      <section className="bg-navy py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-2 text-xs font-bold uppercase tracking-widest text-white/60 mb-5">
            {t.blog.title}
          </div>
          <h1 className="font-display font-bold text-4xl md:text-5xl text-white mb-4 leading-tight">
            {lang === 'en'
              ? <>Insights from <span className="text-gold">31 Years</span> of Protecting Families</>
              : <>31 वर्षों के अनुभव से <span className="text-gold">जानकारी</span></>}
          </h1>
          <p className="text-white/55 text-base max-w-xl mx-auto leading-relaxed">
            {lang === 'en'
              ? 'Practical guides on insurance, tax planning, and wealth protection — written by Ajay Kumar Poddar.'
              : 'बीमा, टैक्स प्लानिंग और संपत्ति सुरक्षा पर व्यावहारिक गाइड — अजय कुमार पोद्दार द्वारा।'}
          </p>
        </div>
      </section>

      {/* Category tabs */}
      <div className="sticky top-[78px] z-40 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-5xl mx-auto px-6 py-3 flex gap-2 overflow-x-auto scrollbar-none">
          {BLOG_CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`flex-shrink-0 text-xs font-bold px-4 py-2 rounded-full border transition-all duration-150
                ${activeCategory === cat
                  ? 'bg-navy text-white border-navy'
                  : 'bg-white text-gray-500 border-gray-200 hover:border-navy/30 hover:text-navy'}`}
            >
              {cat === 'All' ? t.blog.allCategories : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Post grid */}
      <section className="py-12 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(post => {
              const style = CATEGORY_STYLES[post.category] || CATEGORY_STYLES_DEFAULT
              const Icon = style.icon
              return (
                <article
                  key={post.slug}
                  className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:border-gold/30 transition-all duration-200 flex flex-col group cursor-default"
                >
                  {/* Premium Corporate Solid Header */}
                  <div className={`h-[120px] w-full ${style.bg} flex flex-col items-center justify-center relative overflow-hidden`}>
                    <div className="absolute inset-0 bg-white/5 opacity-5 mix-blend-overlay" />
                    <Icon className="w-8 h-8 text-white mb-2 transition-transform duration-500 group-hover:scale-110" />
                    <span className="text-[10px] font-bold text-white/70 uppercase tracking-widest leading-none">
                      {post.category}
                    </span>
                  </div>

                  {/* Category + Date header */}
                  <div className="px-5 pt-5 pb-3 flex items-center justify-between">
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border uppercase tracking-wider ${CATEGORY_COLORS[post.category] ?? CATEGORY_COLORS_DEFAULT}`}>
                      {post.category}
                    </span>
                    <span className="text-[11px] text-gray-500">{formatBlogDateShort(post.date)}</span>
                  </div>

                  {/* Content */}
                  <div className="px-5 pb-5 flex-1 flex flex-col">
                    <h2 className="font-display font-bold text-[16px] text-navy leading-snug mb-2 group-hover:text-gold transition-colors duration-200">
                      {lang === 'en' ? post.title : post.titleHi}
                    </h2>
                    <p className="text-[13px] text-gray-500 leading-relaxed mb-4 flex-1">
                      {lang === 'en' ? post.summary : post.summaryHi}
                    </p>
                    <div className="flex items-center justify-between mt-auto">
                      <span className="text-[11px] text-gray-500">{post.author}</span>
                      <Link
                        href={`/blog/${post.slug}`}
                        className="text-[12px] font-bold text-gold hover:text-amber-700 transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        {t.blog.readMore} →
                      </Link>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-20 text-gray-500 text-sm">
              {lang === 'en' ? 'No articles in this category yet.' : 'इस श्रेणी में अभी कोई लेख नहीं।'}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 px-6 bg-gold/5 border-t border-gold/10">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-navy font-display font-bold text-xl mb-2">
            {lang === 'en' ? 'Have a specific question?' : 'कोई विशेष सवाल है?'}
          </p>
          <p className="text-gray-500 text-sm mb-5">
            {lang === 'en'
              ? 'Ask Poddar Ji — our AI advisor answers instantly in Hindi or English.'
              : 'पोद्दार जी से पूछें — हमारे AI सलाहकार हिंदी या अंग्रेजी में तुरंत जवाब देते हैं।'}
          </p>
          <Link
            href="/ai-advisor"
            className="inline-flex items-center gap-2 bg-navy text-white font-bold text-sm px-6 py-3 rounded-full hover:bg-navy/90 transition-colors"
          >
            {t.blog.askPoddarJi}
          </Link>
        </div>
      </section>
      
      {/* Newsletter Signup */}
      <NewsletterSignup />
    </div>
  )
}
