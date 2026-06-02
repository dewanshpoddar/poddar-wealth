'use client'

import React from 'react'
import Link from 'next/link'
import { useLang } from '@/lib/LangContext'
import posts from '@/lib/data/blog-posts.json'

const CATEGORY_COLORS: Record<string, string> = {
  'Life Insurance':   'bg-blue-50 text-blue-700 border-blue-200',
  'LIC Plans':        'bg-gold/10 text-amber-700 border-gold/30',
  'Health Insurance': 'bg-red-50 text-red-700 border-red-200',
  'Tax Planning':     'bg-green-50 text-green-700 border-green-200',
  'Claims':           'bg-purple-50 text-purple-700 border-purple-200',
  'Comparison':       'bg-amber-50 text-amber-700 border-amber-200',
  'Guides':           'bg-teal-50 text-teal-700 border-teal-200',
  'Child Plans':      'bg-pink-50 text-pink-700 border-pink-200',
}

import { Shield, Heart, FileText, Calculator, ArrowLeftRight, BookOpen } from 'lucide-react'

const CATEGORY_STYLES: Record<string, { bg: string; icon: React.ComponentType<any> }> = {
  'Life Insurance':   { bg: 'bg-blue-900', icon: Shield },
  'Health Insurance': { bg: 'bg-emerald-800', icon: Heart },
  'LIC Plans':        { bg: 'bg-amber-800', icon: FileText },
  'Tax Planning':     { bg: 'bg-indigo-900', icon: Calculator },
  'Comparison':       { bg: 'bg-slate-800', icon: ArrowLeftRight },
  'Claims':           { bg: 'bg-purple-950', icon: FileText },
  'Guides':           { bg: 'bg-gray-900', icon: BookOpen },
  'Child Plans':      { bg: 'bg-rose-900', icon: Heart },
}

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
            const style = CATEGORY_STYLES[post.category] || { bg: 'bg-gray-900', icon: BookOpen }
            const Icon = style.icon
            const readingTime = lang === 'hi'
              ? Math.ceil(post.contentHi.length / 5 / 200)
              : Math.ceil(post.content.split(/\s+/).length / 200)

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
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border uppercase tracking-wider ${CATEGORY_COLORS[post.category] ?? 'bg-gray-100 text-gray-600 border-gray-200'}`}>
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
