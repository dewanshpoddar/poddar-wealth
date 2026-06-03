'use client'

import { use, useState, useEffect } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { useLang } from '@/lib/LangContext'
import { openLeadPopup } from '@/lib/events'
import { trackEvent } from '@/lib/analytics'
import posts from '@/lib/data/blog-posts.json'
import WhatsAppShare from '@/components/WhatsAppShare'
import { Phone } from 'lucide-react'
import {
  CATEGORY_COLORS, CATEGORY_COLORS_DEFAULT,
  CATEGORY_STYLES, CATEGORY_STYLES_DEFAULT,
  formatBlogDate, getReadingTime,
} from '@/lib/blog-utils'

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
      <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
        {lang === 'en' ? 'Share' : 'शेयर करें'}
      </span>
      <WhatsAppShare
        text={`${title} — Read here:`}
        url={shareUrl}
        className="inline-flex items-center gap-1.5 bg-[#25D366] hover:bg-[#20ba5a] text-white text-xs font-bold px-3.5 py-2 rounded-full transition-colors"
      />
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
          : (lang === 'en' ? 'Copy link' : 'लिंक कॉपी करें')}
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
  const readingTime = getReadingTime(post.content, post.contentHi, lang)

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
              <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border uppercase tracking-wider ${CATEGORY_COLORS[post.category] ?? CATEGORY_COLORS_DEFAULT}`}>
                {post.category}
              </span>
              <span className="text-white/40 text-xs">{formatBlogDate(post.date, lang)}</span>
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

        {/* Premium Corporate Solid Header */}
        {(() => {
          const style = CATEGORY_STYLES[post.category] || CATEGORY_STYLES_DEFAULT
          const Icon = style.icon
          return (
            <div className={`h-[160px] w-full ${style.bg} flex flex-col items-center justify-center relative overflow-hidden`}>
              <div className="absolute inset-0 bg-white/5 opacity-5 mix-blend-overlay" />
              <Icon className="w-12 h-12 text-white mb-2 transition-transform duration-500 hover:scale-110" />
              <span className="text-xs font-bold text-white/70 uppercase tracking-widest leading-none">
                {post.category}
              </span>
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
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider flex-shrink-0 mt-0.5 ${CATEGORY_COLORS[r.category] ?? CATEGORY_COLORS_DEFAULT}`}>
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
                  {lang === 'en' ? 'Ask Poddar Ji' : 'पोद्दार जी से पूछें'}
                </Link>
                <button
                  onClick={() => openLeadPopup(`Blog inquiry: ${post.title}`)}
                  className="inline-flex items-center justify-center gap-2 bg-white/10 border border-white/20 text-white font-bold text-sm px-6 py-3 rounded-full hover:bg-white/20 transition-colors"
                >
                  <Phone size={14} className="inline mr-1" />{lang === 'en' ? 'Call Ajay Sir' : 'अजय सर को कॉल करें'}
                </button>
              </div>
            </div>

            {/* Back link */}
            <div className="mt-8 text-center">
              <Link
                href="/blog"
                className="text-sm text-gray-500 hover:text-navy transition-colors"
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
