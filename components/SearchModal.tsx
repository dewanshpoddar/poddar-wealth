'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useLang } from '@/lib/LangContext'
import { X, Search, FileText, Calculator, Shield, CornerDownLeft, Sparkles } from 'lucide-react'
import blogIndex from '@/lib/data/blog-index.json'

// Local directories for fallback search
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
  type: 'blog' | 'calculator' | 'service'
  title: string
  url: string
  excerpt: string
}

export default function SearchModal({ onClose }: { onClose: () => void }) {
  const { lang, t } = useLang()
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const modalRef = useRef<HTMLDivElement>(null)

  const s = t.search || {}
  const isHi = lang === 'hi'

  useEffect(() => {
    // Focus search input on mount
    inputRef.current?.focus()
    // Prevent body scroll
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  // Close on Escape or click outside
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [onClose])

  // Debounced search logic
  useEffect(() => {
    const cleanQuery = query.trim().toLowerCase()
    if (cleanQuery.length < 2) {
      setResults([])
      return
    }

    setLoading(true)
    const timer = setTimeout(async () => {
      try {
        // Try calling the backend search API
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
        if (res.ok) {
          const data = await res.json()
          if (data.success && data.results) {
            setResults(data.results)
            setLoading(false)
            return
          }
        }
      } catch (err) {
        // Fallback to client-side search if API fails or 404s
        console.warn('Backend search API failed, using client-side fallback')
      }

      // Execute client-side fallback search
      const matchedResults: SearchResult[] = []

      // 1. Match Calculators
      CALCULATORS.forEach(c => {
        const text = isHi ? c.titleHi : c.title
        if (text.toLowerCase().includes(cleanQuery) || c.slug.includes(cleanQuery)) {
          matchedResults.push({
            type: 'calculator',
            title: text,
            url: c.path,
            excerpt: isHi 
              ? `अपनी LIC पॉलिसी प्रीमियम, मैच्योरिटी और लोन की गणना सेकंडों में करें।`
              : `Calculate exact benefits, HLV limits, surrender value, and policy health audits.`
          })
        }
      })

      // 2. Match Services
      SERVICES.forEach(sv => {
        const text = isHi ? sv.titleHi : sv.title
        if (text.toLowerCase().includes(cleanQuery) || sv.slug.includes(cleanQuery)) {
          matchedResults.push({
            type: 'service',
            title: text,
            url: `/services/${sv.slug}`,
            excerpt: isHi
              ? `अजय पोद्दार (MDRT) द्वारा प्रदान की जाने वाली विश्वसनीय बीमा और वित्तीय नियोजन सेवाएं।`
              : `Trusted life, health, and wealth planning services provided personally by Ajay Kumar Poddar.`
          })
        }
      })

      // 3. Match Blogs (limit to top 15 matches)
      const matches: SearchResult[] = []
      blogIndex.forEach(blog => {
        const title = isHi ? blog.titleHi : blog.title
        const summary = isHi ? blog.summaryHi : blog.summary
        const excerptText = isHi ? blog.excerptHi : blog.excerpt

        const matchesQuery = 
          title.toLowerCase().includes(cleanQuery) ||
          summary.toLowerCase().includes(cleanQuery) ||
          excerptText.toLowerCase().includes(cleanQuery) ||
          blog.category.toLowerCase().includes(cleanQuery) ||
          (blog.tags && blog.tags.some(tag => tag.toLowerCase().includes(cleanQuery)))

        if (matchesQuery) {
          matches.push({
            type: 'blog',
            title: title,
            url: `/blog/${blog.slug}`,
            excerpt: summary
          })
        }
      })

      matchedResults.push(...matches.slice(0, 10))
      setResults(matchedResults.slice(0, 15))
      setLoading(false)
    }, 300)

    return () => clearTimeout(timer)
  }, [query, isHi])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`)
      onClose()
    }
  }

  const handleResultClick = (url: string) => {
    router.push(url)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-[10000] bg-gray-950/70 backdrop-blur-md flex items-start justify-center pt-[10vh] px-4">
      <div 
        ref={modalRef}
        className="bg-gray-900 border border-gray-800 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[75vh]"
      >
        {/* Search header */}
        <form onSubmit={handleSearchSubmit} className="flex items-center gap-3 px-6 py-4 border-b border-gray-800">
          <Search size={20} className="text-gray-400 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder={s.modalPlaceholder || 'Search blog posts, calculators, services...'}
            className="flex-1 bg-transparent text-white text-base outline-none placeholder-gray-500 py-1"
          />
          {query && (
            <button 
              type="button" 
              onClick={() => setQuery('')}
              className="text-gray-500 hover:text-white p-1 rounded-full hover:bg-gray-800 transition-colors"
            >
              <X size={16} />
            </button>
          )}
          <button 
            type="button" 
            onClick={onClose}
            className="text-xs font-bold text-gray-400 hover:text-white border border-gray-800 hover:border-gray-700 px-3 py-1.5 rounded-xl transition-all"
          >
            ESC
          </button>
        </form>

        {/* Results area */}
        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center gap-3">
              <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider">
                {isHi ? 'खोज की जा रही है...' : 'Searching...'}
              </p>
            </div>
          ) : results.length > 0 ? (
            <div className="space-y-1">
              {results.map((res, i) => {
                const Icon = res.type === 'blog' ? FileText : res.type === 'calculator' ? Calculator : Shield
                const badgeColor = 
                  res.type === 'blog' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 
                  res.type === 'calculator' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 
                  'bg-green-500/10 text-green-400 border-green-500/20'

                return (
                  <div
                    key={i}
                    onClick={() => handleResultClick(res.url)}
                    className="w-full flex items-start gap-4 p-3.5 rounded-2xl hover:bg-gray-800/60 cursor-pointer transition-all border border-transparent hover:border-gray-800 group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-gray-800 border border-gray-700 flex items-center justify-center text-amber-500 flex-shrink-0 group-hover:bg-amber-500/10 group-hover:border-amber-500/20 transition-all">
                      <Icon size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border ${badgeColor}`}>
                          {res.type === 'blog' ? (s.typeBlog || 'Blog') : res.type === 'calculator' ? (s.typeCalculator || 'Calculator') : (s.typeService || 'Service')}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-white leading-snug group-hover:text-amber-400 transition-colors truncate">
                        {res.title}
                      </h4>
                      <p className="text-xs text-gray-400 line-clamp-1 mt-1 leading-normal font-medium">
                        {res.excerpt}
                      </p>
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 text-[10px] font-bold text-amber-500 uppercase tracking-widest self-center flex-shrink-0">
                      <span>GO</span>
                      <CornerDownLeft size={10} />
                    </div>
                  </div>
                )
              })}
            </div>
          ) : query.trim().length >= 2 ? (
            <div className="py-16 text-center">
              <p className="text-gray-400 text-sm mb-3">
                {s.noResults || 'No results found. Try a different term or ask Poddar Ji'}
              </p>
              <button
                onClick={() => handleResultClick('/ai-advisor')}
                className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-sm shadow-amber-500/10 hover:shadow-amber-500/20"
              >
                <Sparkles size={14} />
                {s.askPoddarJi || 'Ask Poddar Ji'}
              </button>
            </div>
          ) : (
            <div className="py-12 text-center text-gray-500 text-xs font-medium uppercase tracking-wider">
              {isHi ? 'खोजना शुरू करने के लिए कम से कम 2 अक्षर टाइप करें...' : 'Type at least 2 characters to start searching...'}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
