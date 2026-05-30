'use client'

import { use } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { useLang } from '@/lib/LangContext'
import { openLeadPopup } from '@/lib/events'
import posts from '@/lib/data/blog-posts.json'

const CATEGORY_COLORS: Record<string, string> = {
  'Life Insurance':   'bg-blue-50 text-blue-700 border-blue-200',
  'LIC Plans':        'bg-gold/10 text-amber-700 border-gold/30',
  'Health Insurance': 'bg-red-50 text-red-700 border-red-200',
  'Tax Planning':     'bg-green-50 text-green-700 border-green-200',
  'Claims':           'bg-purple-50 text-purple-700 border-purple-200',
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'long', year: 'numeric',
  })
}

export default function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const { t, lang } = useLang()
  const post = posts.find(p => p.slug === slug)

  if (!post) notFound()

  const title    = lang === 'en' ? post.title    : post.titleHi
  const content  = lang === 'en' ? post.content  : post.contentHi
  const summary  = lang === 'en' ? post.summary  : post.summaryHi
  const paragraphs = content.split('\n\n').filter(Boolean)

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.summary,
    author: {
      '@type': 'Person',
      name: post.author,
      jobTitle: 'IRDAI Authorised Insurance Agent, MDRT Member',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Poddar Wealth Management',
      url: 'https://www.poddarwealth.com',
    },
    datePublished: post.date,
    dateModified:  post.date,
    keywords: post.tags.join(', '),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <div className="min-h-screen bg-white pt-20">
        {/* Hero */}
        <section className="bg-navy py-14 px-6">
          <div className="max-w-3xl mx-auto">
            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 text-white/50 hover:text-gold text-xs font-semibold mb-6 transition-colors"
            >
              ← {t.blog.backToAll}
            </Link>
            <div className="flex items-center gap-3 mb-4">
              <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border uppercase tracking-wider ${CATEGORY_COLORS[post.category] ?? 'bg-gray-100 text-gray-600 border-gray-200'}`}>
                {post.category}
              </span>
              <span className="text-white/40 text-xs">{formatDate(post.date)}</span>
            </div>
            <h1 className="font-display font-bold text-3xl md:text-4xl text-white leading-tight mb-4">
              {title}
            </h1>
            <p className="text-white/55 text-base leading-relaxed">{summary}</p>
            <div className="mt-5 flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gold flex items-center justify-center text-navy font-bold text-sm flex-shrink-0">
                A
              </div>
              <span className="text-white/60 text-xs">{post.author} · MDRT Member · 31+ Years</span>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="py-12 px-6">
          <div className="max-w-3xl mx-auto">
            <div className="prose prose-slate max-w-none">
              {paragraphs.map((para, i) => (
                <p key={i} className="text-[15px] text-slate-700 leading-relaxed mb-5">
                  {para}
                </p>
              ))}
            </div>

            {/* Tags */}
            {post.tags.length > 0 && (
              <div className="mt-8 pt-6 border-t border-gray-100 flex flex-wrap gap-2">
                {post.tags.map(tag => (
                  <span key={tag} className="text-[11px] bg-gray-100 text-gray-500 px-3 py-1 rounded-full">
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Ask Poddar Ji CTA */}
            <div className="mt-10 bg-navy rounded-2xl p-6 text-center">
              <p className="text-gold font-display font-bold text-lg mb-1">{t.blog.askPoddarJi}</p>
              <p className="text-white/55 text-sm mb-5">
                {lang === 'en'
                  ? 'Get a personalised answer about this topic from our AI advisor — available 24/7 in Hindi or English.'
                  : '24/7 हिंदी या अंग्रेजी में हमारे AI सलाहकार से व्यक्तिगत जवाब पाएं।'}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href="/ai-advisor"
                  className="inline-flex items-center justify-center gap-2 bg-gold text-white font-bold text-sm px-6 py-3 rounded-full hover:bg-amber-600 transition-colors"
                >
                  ✨ {lang === 'en' ? 'Ask Poddar Ji' : 'पोद्दार जी से पूछें'}
                </Link>
                <button
                  onClick={() => openLeadPopup(`Blog inquiry: ${post.title}`)}
                  className="inline-flex items-center justify-center gap-2 bg-white/10 border border-white/20 text-white font-bold text-sm px-6 py-3 rounded-full hover:bg-white/20 transition-colors"
                >
                  📞 {lang === 'en' ? 'Call Ajay Sir' : 'अजय सर को कॉल करें'}
                </button>
              </div>
            </div>

            {/* Back link */}
            <div className="mt-8 text-center">
              <Link
                href="/blog"
                className="text-sm text-gray-400 hover:text-navy transition-colors"
              >
                ← {t.blog.backToAll}
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
