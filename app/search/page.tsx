'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useLang } from '@/lib/LangContext'
import { Search, FileText, Calculator, Shield, HelpCircle, ArrowLeft, Sparkles } from 'lucide-react'
import blogIndex from '@/lib/data/blog-index.json'
import Link from 'next/link'

const SERVICES = [
  { slug: 'life-insurance', title: 'Life Insurance Solutions', titleHi: 'जीवन बीमा समाधान', category: 'Services' },
  { slug: 'health-insurance', title: 'Health Insurance Solutions', titleHi: 'स्वास्थ्य बीमा समाधान', category: 'Services' },
  { slug: 'retirement', title: 'Retirement Wealth Planning', titleHi: 'रिटायरमेंट प्लानिंग', category: 'Services' },
  { slug: 'child-planning', title: 'Child Future Planning', titleHi: 'बच्चों का भविष्य नियोजन', category: 'Services' },
  { slug: 'tax-planning', title: 'Tax Planning & Wealth', titleHi: 'टैक्स प्लानिंग और वेल्थ', category: 'Services' },
  { slug: 'critical-illness', title: 'Critical Illness Protection', titleHi: 'गंभीर बीमारी सुरक्षा', category: 'Services' },
  { slug: 'keyman-insurance', title: 'Keyman Insurance Solutions', titleHi: 'कीमैन इंश्योरेंस', category: 'Services' },
  { slug: 'personal-accident', title: 'Personal Accident Cover', titleHi: 'व्यक्तिगत दुर्घटना कवर', category: 'Services' },
  { slug: 'cancer-cover', title: 'Cancer Cover Protection', titleHi: 'कैंसर कवर सुरक्षा', category: 'Services' },
  { slug: 'term-life', title: 'Pure Term Life Insurance', titleHi: 'टर्म लाइफ इंश्योरेंस', category: 'Services' },
  { slug: 'group-health', title: 'Group Health Insurance', titleHi: 'ग्रुप हेल्थ इंश्योरेंस', category: 'Services' }
]

const CALCULATORS = [
  { slug: 'premium', title: 'Premium Calculator', titleHi: 'प्रीमियम कैलकुलेटर', category: 'Calculators', path: '/calculators/premium' },
  { slug: 'life-insurance', title: 'Life Insurance HLV Calculator', titleHi: 'जीवन बीमा HLV कैलकुलेटर', category: 'Calculators', path: '/calculators/life-insurance' },
  { slug: 'retirement', title: 'Retirement Wealth Planner', titleHi: 'रिटायरमेंट वेल्थ प्लानर', category: 'Calculators', path: '/calculators/retirement' },
  { slug: 'surrender-value', title: 'Policy Surrender Value Calculator', titleHi: 'पॉलिसी सरेंडर वैल्यू', category: 'Calculators', path: '/calculators/surrender-value' },
  { slug: 'maturity', title: 'Endowment Maturity Calculator', titleHi: 'मैच्योरिटी कैलकुलेटर', category: 'Calculators', path: '/calculators/maturity' },
  { slug: 'loan', title: 'Loan Against Policy Calculator', titleHi: 'पॉलिसी पर लोन कैलकुलेटर', category: 'Calculators', path: '/calculators/loan' },
  { slug: 'policy-health', title: 'Policy Health Score Audit', titleHi: 'पॉलिसी हेल्थ स्कोर ऑडिट', category: 'Calculators', path: '/calculators/policy-health' },
  { slug: 'policy-document', title: 'AI Policy Document Analyzer', titleHi: 'AI पॉलिसी दस्तावेज विश्लेषक', category: 'Calculators', path: '/analyzers/policy-document' }
]

interface SearchResult {
  type: 'blog' | 'calculator' | 'service' | 'faq'
  title: string
  url: string
  excerpt: string
  date?: string
  category?: string
}

function Highlight({ text, query }: { text: string; query: string }) {
  if (!query.trim()) return <>{text}</>
  const regex = new RegExp(`(${query.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')})`, 'gi')
  const parts = text.split(regex)
  return (
    <>
      {parts.map((part, i) => 
        regex.test(part) ? (
          <mark key={i} className="bg-amber-100 text-gray-900 font-semibold px-0.5 rounded">
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </>
  )
}

function SearchResultsContent() {
  const { lang, t } = useLang()
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get('q') || ''
  
  const [query, setQuery] = useState(initialQuery)
  const [activeQuery, setActiveQuery] = useState(initialQuery)
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)

  const s = t.search || {}
  const isHi = lang === 'hi'

  useEffect(() => {
    setQuery(initialQuery)
    setActiveQuery(initialQuery)
  }, [initialQuery])

  useEffect(() => {
    const cleanQuery = activeQuery.trim().toLowerCase()
    if (cleanQuery.length < 2) {
      setResults([])
      return
    }

    setLoading(true)
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(activeQuery)}`)
        if (res.ok) {
          const data = await res.json()
          if (data.success && data.results) {
            setResults(data.results)
            setLoading(false)
            return
          }
        }
      } catch (err) {
        console.warn('Backend search API failed, falling back to local client search')
      }

      // Local search fallback
      const matchedResults: SearchResult[] = []

      // 1. Calculators
      CALCULATORS.forEach(c => {
        const titleText = isHi ? c.titleHi : c.title
        if (titleText.toLowerCase().includes(cleanQuery) || c.slug.includes(cleanQuery)) {
          matchedResults.push({
            type: 'calculator',
            title: titleText,
            url: c.path,
            excerpt: isHi 
              ? `अपनी LIC पॉलिसी प्रीमियम, मैच्योरिटी और लोन की गणना सेकंडों में करें।`
              : `Calculate exact benefits, HLV limits, surrender value, and policy health audits.`
          })
        }
      })

      // 2. Services
      SERVICES.forEach(sv => {
        const titleText = isHi ? sv.titleHi : sv.title
        if (titleText.toLowerCase().includes(cleanQuery) || sv.slug.includes(cleanQuery)) {
          matchedResults.push({
            type: 'service',
            title: titleText,
            url: `/services/${sv.slug}`,
            excerpt: isHi
              ? `अजय पोद्दार (MDRT) द्वारा प्रदान की जाने वाली विश्वसनीय बीमा और वित्तीय नियोजन सेवाएं।`
              : `Trusted life, health, and wealth planning services provided personally by Ajay Kumar Poddar.`
          })
        }
      })

      // FAQ matching
      const faqData = (t as any).faq || {}
      const faqItems = faqData.items || {}
      const matchedFaqs: SearchResult[] = []
      Object.keys(faqItems).forEach(cat => {
        const items = faqItems[cat] || []
        items.forEach((item: any) => {
          if (item && item.q && item.a) {
            const matchesQuery = 
              item.q.toLowerCase().includes(cleanQuery) || 
              item.a.toLowerCase().includes(cleanQuery)
            if (matchesQuery) {
              matchedFaqs.push({
                type: 'faq',
                title: item.q,
                url: `/faq?cat=${cat}`,
                excerpt: item.a
              })
            }
          }
        })
      })
      matchedResults.push(...matchedFaqs)

      // 3. Blogs
      blogIndex.forEach(blog => {
        const titleText = isHi ? blog.titleHi : blog.title
        const summaryText = isHi ? blog.summaryHi : blog.summary
        const excerptText = isHi ? blog.excerptHi : blog.excerpt

        const matchesQuery = 
          titleText.toLowerCase().includes(cleanQuery) ||
          summaryText.toLowerCase().includes(cleanQuery) ||
          (excerptText ?? '').toLowerCase().includes(cleanQuery) ||
          blog.category.toLowerCase().includes(cleanQuery) ||
          (blog.tags && blog.tags.some(tag => tag.toLowerCase().includes(cleanQuery)))

        if (matchesQuery) {
          matchedResults.push({
            type: 'blog',
            title: titleText,
            url: `/blog/${blog.slug}`,
            excerpt: summaryText,
            date: blog.date,
            category: blog.category
          })
        }
      })

      setResults(matchedResults)
      setLoading(false)
    }, 200)

    return () => clearTimeout(timer)
  }, [activeQuery, isHi])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`)
      setActiveQuery(query.trim())
    }
  }

  return (
    <div className="bg-slate-50 min-h-screen pt-28 pb-20">
      <div className="max-w-4xl mx-auto px-6">
        
        {/* Breadcrumb / Back button */}
        <Link 
          href="/"
          className="inline-flex items-center gap-1 text-xs font-bold text-gray-500 hover:text-navy uppercase tracking-wider mb-6 group transition-colors"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
          {isHi ? 'मुख्य पृष्ठ' : 'Back to Home'}
        </Link>

        {/* Headline */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-display font-black text-navy leading-tight mb-2">
            {s.resultsTitle || 'Search Results for'}: <span className="text-gold italic font-extrabold">&ldquo;{activeQuery}&rdquo;</span>
          </h1>
          <p className="text-sm font-semibold text-gray-500">
            {loading ? '...' : `${results.length} ${s.resultsFound || 'results found'}`}
          </p>
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSearch} className="flex gap-2.5 bg-white border border-slate-200/80 rounded-2xl p-2 shadow-sm mb-12 focus-within:border-gold/30 focus-within:ring-1 focus-within:ring-gold/20 transition-all">
          <div className="flex-1 flex items-center gap-2.5 px-3">
            <Search size={18} className="text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder={s.modalPlaceholder || 'Search blog posts, calculators, services...'}
              className="w-full bg-transparent text-sm outline-none text-navy placeholder-gray-400 py-1.5 font-medium"
            />
          </div>
          <button
            type="submit"
            className="bg-navy hover:bg-navy/90 text-white font-bold text-xs px-6 py-2.5 rounded-xl transition-all cursor-pointer"
          >
            {s.searchBtn || 'Search'}
          </button>
        </form>

        {/* Loading / Results Layout */}
        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 border-4 border-gold border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">{isHi ? 'खोज की जा रही है...' : 'Searching...'}</p>
          </div>
        ) : results.length > 0 ? (
          <div className="space-y-6">
            {results.map((res, idx) => {
               const Icon = res.type === 'blog' ? FileText : res.type === 'calculator' ? Calculator : res.type === 'service' ? Shield : HelpCircle
               const badgeLabel = 
                 res.type === 'blog' ? (s.typeBlog || 'Blog') :
                 res.type === 'calculator' ? (s.typeCalculator || 'Calculator') :
                 res.type === 'service' ? (s.typeService || 'Service') : (s.typeFaq || 'FAQ')
               
               const badgeColor = 
                 res.type === 'blog' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                 res.type === 'calculator' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                 res.type === 'service' ? 'bg-green-50 text-green-700 border-green-100' :
                 'bg-purple-50 text-purple-700 border-purple-100'

              return (
                <div 
                  key={idx}
                  className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm hover:shadow-md hover:border-gold/15 transition-all duration-300 flex flex-col md:flex-row gap-5 items-start"
                >
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 border ${badgeColor}`}>
                    <Icon size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2.5 mb-2.5">
                      <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider border ${badgeColor}`}>
                        {badgeLabel}
                      </span>
                      {res.date && (
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                          {res.date}
                        </span>
                      )}
                      {res.category && (
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider bg-slate-100 px-2 py-0.5 rounded-full">
                          {res.category}
                        </span>
                      )}
                    </div>
                    <h2 className="text-lg font-extrabold text-navy mb-2 leading-snug hover:text-gold transition-colors">
                      <Link href={res.url}>
                        <Highlight text={res.title} query={activeQuery} />
                      </Link>
                    </h2>
                    <p className="text-slate-500 text-sm leading-relaxed font-medium">
                      <Highlight text={res.excerpt} query={activeQuery} />
                    </p>
                    <div className="mt-4">
                      <Link 
                        href={res.url}
                        className="inline-flex items-center text-xs font-bold text-gold hover:text-amber-600 transition-colors uppercase tracking-wider"
                      >
                        {isHi ? 'विवरण देखें →' : 'View Details →'}
                      </Link>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="bg-white border border-slate-100 rounded-3xl p-10 text-center shadow-sm max-w-lg mx-auto">
            <h3 className="text-base font-extrabold text-navy mb-2">
              {isHi ? 'कोई परिणाम नहीं मिला' : 'No matches found'}
            </h3>
            <p className="text-gray-500 text-xs leading-relaxed mb-6 font-medium">
              {isHi 
                ? 'हम आपके खोज के शब्द से मेल खाती कोई जानकारी नहीं पा सके। कृपया दूसरे शब्दों का प्रयोग करें या पोद्दार जी से सवाल पूछें।'
                : 'We couldn\'t find any records matching your search terms. Try searching for "jeevan", "health", or ask Poddar Ji.'}
            </p>
            <Link
              href="/ai-advisor"
              className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold px-5 py-3 rounded-xl transition-all shadow-sm shadow-amber-500/10"
            >
              <Sparkles size={14} className="animate-pulse" />
              {s.askPoddarJi || 'Ask Poddar Ji'}
            </Link>
          </div>
        )}

      </div>
    </div>
  )
}

export default function SearchResultsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-gold border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <SearchResultsContent />
    </Suspense>
  )
}
