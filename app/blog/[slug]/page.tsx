'use client'

import { use, useState, useEffect } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { useLang } from '@/lib/LangContext'
import { openLeadPopup } from '@/lib/events'
import { trackEvent } from '@/lib/analytics'
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

const CATEGORY_GRADIENTS: Record<string, string> = {
  'Life Insurance':   'from-blue-500 to-blue-600',
  'LIC Plans':        'from-amber-500 to-amber-600',
  'Health Insurance': 'from-green-500 to-green-600',
  'Tax Planning':     'from-emerald-500 to-emerald-600',
  'Claims':           'from-violet-500 to-violet-600',
  'Comparison':       'from-red-500 to-red-600',
  'Guides':           'from-purple-500 to-purple-600',
  'Child Plans':      'from-pink-500 to-pink-600',
}

const CATEGORY_EMOJIS: Record<string, string> = {
  'Life Insurance':   '🛡️',
  'LIC Plans':        '📋',
  'Health Insurance': '🏥',
  'Tax Planning':     '💰',
  'Claims':           '📁',
  'Comparison':       '⚖️',
  'Guides':           '📚',
  'Child Plans':      '👶',
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'long', year: 'numeric',
  })
}

function ShareBar({ title, slug, lang }: { title: string; slug: string; lang: string }) {
  const [copied, setCopied] = useState(false)
  const shareUrl = `https://www.poddarwealth.com/blog/${slug}`
  const waHref = `https://wa.me/?text=${encodeURIComponent(title + '\n' + shareUrl)}`

  function copyLink() {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className="mt-8 pt-6 border-t border-gray-100 flex items-center gap-3 flex-wrap">
      <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
        {lang === 'en' ? 'Share' : 'शेयर करें'}
      </span>
      <a
        href={waHref}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 bg-green-500 hover:bg-green-600 text-white text-xs font-bold px-3.5 py-2 rounded-full transition-colors"
      >
        <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current" aria-hidden><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
        WhatsApp
      </a>
      <button
        onClick={copyLink}
        className={`inline-flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 rounded-full border transition-colors ${
          copied
            ? 'bg-green-50 border-green-300 text-green-700'
            : 'bg-gray-50 border-gray-200 text-gray-600 hover:border-navy hover:text-navy'
        }`}
      >
        {copied
          ? (lang === 'en' ? '✓ Copied!' : '✓ कॉपी हो गया!')
          : (lang === 'en' ? '🔗 Copy link' : '🔗 लिंक कॉपी करें')}
      </button>
    </div>
  )
}

export default function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const { t, lang } = useLang()
  const post = posts.find(p => p.slug === slug)

  if (!post) notFound()

  // Fire once on mount
  useEffect(() => {
    trackEvent('blog_viewed', { slug: post.slug, category: post.category })
  }, [post.slug, post.category])

  const title    = lang === 'en' ? post.title    : post.titleHi
  const content  = lang === 'en' ? post.content  : post.contentHi
  const summary  = lang === 'en' ? post.summary  : post.summaryHi
  const paragraphs = content.split('\n\n').filter(Boolean)
  const readingTime = Math.ceil(post.content.split(/\s+/).length / 200)

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
            <div className="flex items-center gap-3 mb-4 flex-wrap">
              <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border uppercase tracking-wider ${CATEGORY_COLORS[post.category] ?? 'bg-gray-100 text-gray-600 border-gray-200'}`}>
                {post.category}
              </span>
              <span className="text-white/40 text-xs">{formatDate(post.date)}</span>
              <span className="text-white/35 text-xs">
                {lang === 'en' ? `${readingTime} min read` : `${readingTime} मिनट`}
              </span>
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

        {/* Category Gradient Header */}
        {(() => {
          const gradient = CATEGORY_GRADIENTS[post.category] || 'from-gray-400 to-gray-500'
          const emoji = CATEGORY_EMOJIS[post.category] || '📝'
          return (
            <div className={`h-[200px] w-full bg-gradient-to-r ${gradient} flex items-center justify-center text-6xl relative overflow-hidden`}>
              <div className="absolute inset-0 bg-white/5 opacity-10 mix-blend-overlay" />
              <div className="absolute -right-12 -bottom-12 w-40 h-40 rounded-full bg-white/10 blur-2xl" />
              <div className="absolute -left-12 -top-12 w-32 h-32 rounded-full bg-white/10 blur-2xl" />
              <span className="relative z-10 filter drop-shadow">{emoji}</span>
            </div>
          )
        })()}

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

            {/* Related Articles */}
            {post.relatedSlugs && (post.relatedSlugs as string[]).length > 0 && (() => {
              const related = (post.relatedSlugs as string[])
                .map(s => posts.find(p => p.slug === s))
                .filter(Boolean) as typeof posts
              if (!related.length) return null
              return (
                <div className="mt-10 pt-8 border-t border-gray-100">
                  <h3 className="font-display font-bold text-navy text-base mb-4">
                    {lang === 'en' ? 'Related Articles' : 'संबंधित लेख'}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {related.slice(0, 3).map(r => (
                      <a key={r.slug} href={`/blog/${r.slug}`}
                        className="flex items-start gap-3 p-3.5 rounded-xl border border-gray-100 hover:border-gold/30 hover:bg-gold/5 transition-all group">
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider flex-shrink-0 mt-0.5 ${CATEGORY_COLORS[r.category] ?? 'bg-gray-100 text-gray-600 border-gray-200'}`}>
                          {r.category}
                        </span>
                        <span className="text-[13px] font-semibold text-navy leading-snug group-hover:text-gold transition-colors">
                          {lang === 'en' ? r.title : r.titleHi}
                        </span>
                      </a>
                    ))}
                  </div>
                </div>
              )
            })()}

            {/* Share */}
            <ShareBar title={title} slug={post.slug} lang={lang} />

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
