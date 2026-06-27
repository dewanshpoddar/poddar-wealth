'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  Shield, 
  TrendingUp, 
  Umbrella, 
  Sunset, 
  Scale, 
  HandCoins, 
  HeartPulse,
  Info,
  Users,
  Compass,
  CheckCircle,
  FileText,
  Trophy,
  ShieldCheck
} from 'lucide-react'

import { useLang } from '@/lib/LangContext'
import { SOCIAL_PROOF } from '@/lib/data/calculator-insights'
import { ADVISOR_PHONE } from '@/lib/constants'
import CalculatorForm from './CalculatorForm'
import CalculatorFAQ from './CalculatorFAQ'
import RelatedCalculators from './RelatedCalculators'

// Tab/Icon mapping
const ICON_MAP = {
  premium: Shield,
  maturity: TrendingUp,
  coverage: Umbrella,
  retirement: Sunset,
  surrender: Scale,
  loan: HandCoins,
  health: HeartPulse,
}

const CATEGORIES = [
  { id: 'insurance', label: 'INSURANCE' },
  { id: 'planning', label: 'PLANNING' },
  { id: 'analysis', label: 'ANALYSIS' },
]

interface ToolItem {
  id: string
  label: string
  path: string
  isHot?: boolean
  isPlaceholder?: boolean
}

const TOOLS_BY_CATEGORY: Record<'insurance' | 'planning' | 'analysis', ToolItem[]> = {
  insurance: [
    { id: 'premium', label: 'Premium', path: '/calculators/premium', isHot: true },
    { id: 'maturity', label: 'Maturity', path: '/calculators/maturity' },
    { id: 'coverage', label: 'Coverage', path: '/calculators/life-insurance' },
    { id: 'surrender', label: 'Surrender', path: '/calculators/surrender-value' },
    { id: 'loan', label: 'Loan', path: '/calculators/loan' },
  ],
  planning: [
    { id: 'retirement', label: 'Retirement', path: '/calculators/retirement', isHot: true },
    { id: 'education', label: 'Education', path: '#coming-soon', isPlaceholder: true },
    { id: 'sip', label: 'SIP', path: '#coming-soon', isPlaceholder: true },
    { id: 'tax-saver', label: 'Tax saver', path: '#coming-soon', isPlaceholder: true },
    { id: 'inflation', label: 'Inflation', path: '#coming-soon', isPlaceholder: true },
  ],
  analysis: [
    { id: 'health', label: 'Health score', path: '/calculators/policy-health', isHot: true },
    { id: 'policy-analyzer', label: 'Policy analyzer', path: '#coming-soon', isPlaceholder: true },
    { id: 'plan-compare', label: 'Plan compare', path: '#coming-soon', isPlaceholder: true },
    { id: 'nav-tracker', label: 'NAV tracker', path: '#coming-soon', isPlaceholder: true },
  ],
}

interface FAQItem {
  question: string
  answer: string
}

interface CalculatorShellProps {
  activeTabId: string
  title: string
  infoTooltip: string
  faq: FAQItem[]
  age?: number
  sa?: number
  term?: number
  hasCalculated: boolean
  onCalculate: (e: React.FormEvent) => void
  calculateButtonText: string
  formFields: React.ReactNode
  resultPanel: React.ReactNode
  resultRef: React.RefObject<HTMLDivElement | null>
}

export default function CalculatorShell({
  activeTabId,
  title,
  infoTooltip,
  faq,
  age,
  sa,
  term,
  hasCalculated,
  onCalculate,
  calculateButtonText,
  formFields,
  resultPanel,
  resultRef
}: CalculatorShellProps) {
  const { lang } = useLang()

  // Map of calculator background images
  const BG_IMAGE_MAP: Record<string, string> = {
    premium: '/assets/hero-family.webp',
    maturity: '/assets/hero-marriage.webp',
    coverage: '/assets/hero-family.webp',
    retirement: '/assets/hero-retirement.webp',
    surrender: '/assets/hero-family.webp',
    loan: '/assets/hero-education.webp',
    health: '/assets/hero-health.webp',
  }

  const bgImage = BG_IMAGE_MAP[activeTabId] || '/assets/hero-family.webp'

  // State
  const [activeCategory, setActiveCategory] = useState<'insurance' | 'planning' | 'analysis'>('insurance')
  const [counter, setCounter] = useState(4521)
  const [wordIdx, setWordIdx] = useState(0)
  const [fade, setFade] = useState(true)
  const [socialProofText, setSocialProofText] = useState('')

  // Coming Soon Modal State
  const [showComingSoon, setShowComingSoon] = useState(false)
  const [comingSoonToolName, setComingSoonToolName] = useState('')
  const [notifEmail, setNotifEmail] = useState('')
  const [notifSubmitted, setNotifSubmitted] = useState(false)

  // Align activeCategory on mount based on activeTabId
  useEffect(() => {
    if (['premium', 'maturity', 'coverage', 'surrender', 'loan'].includes(activeTabId)) {
      setActiveCategory('insurance')
    } else if (['retirement'].includes(activeTabId)) {
      setActiveCategory('planning')
    } else if (['health'].includes(activeTabId)) {
      setActiveCategory('analysis')
    }
  }, [activeTabId])

  // Counter ticks up by 1-3 every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCounter(prev => prev + Math.floor(Math.random() * 3) + 1)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  // Words swapper every 2.5s
  const WORDS = ['decide', 'invest', 'protect', 'retire', 'plan']
  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false)
      setTimeout(() => {
        setWordIdx(prev => (prev + 1) % WORDS.length)
        setFade(true)
      }, 300)
    }, 2500)
    return () => clearInterval(interval)
  }, [])

  // Social proof random selection
  useEffect(() => {
    const idx = Math.floor(Math.random() * SOCIAL_PROOF.length)
    setSocialProofText(SOCIAL_PROOF[idx])
  }, [])

  // Scroll to result on mobile
  useEffect(() => {
    if (hasCalculated && resultRef.current && window.innerWidth < 1024) {
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 200)
    }
  }, [hasCalculated, resultRef])

  const handlePlaceholderClick = (toolName: string) => {
    setComingSoonToolName(toolName)
    setNotifEmail('')
    setNotifSubmitted(false)
    setShowComingSoon(true)
  }

  const handleComingSoonSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Simulated subscription
    setNotifSubmitted(true)
    setTimeout(() => {
      setShowComingSoon(false)
    }, 1500)
  }

  // Get active category label translation helper
  const getCategoryLabel = (id: string) => {
    const labels = {
      insurance: { en: 'INSURANCE', hi: 'बीमा', bn: 'बीमा' },
      planning: { en: 'PLANNING', hi: 'नियोजन', bn: 'नियोजन' },
      analysis: { en: 'ANALYSIS', hi: 'विश्लेषण', bn: 'विश्लेषण' }
    }
    return labels[id as keyof typeof labels]?.[lang] || id.toUpperCase()
  }

  // State propagation query string
  const queryString = (age || sa || term)
    ? '?' + [
        age ? `age=${age}` : '',
        sa ? `sa=${sa}` : '',
        term ? `term=${term}` : ''
      ].filter(Boolean).join('&')
    : ''

  const TabIcon = ICON_MAP[activeTabId as keyof typeof ICON_MAP] || Shield

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* ── DYNAMIC HEADER CARD BANNER (FLOAT ON GRAY BODY) ── */}
      <div className="max-w-6xl mx-auto pt-6 px-4 sm:px-6 lg:px-8">
        <header 
          className="relative text-white overflow-hidden rounded-2xl pb-6 transition-all duration-500 bg-cover bg-center bg-no-repeat shadow-md border border-white/[0.08]"
          style={{
            backgroundImage: `linear-gradient(135deg, #0f1225 25%, rgba(15, 18, 37, 0.75) 70%, rgba(15, 18, 37, 0.3) 100%), url(${bgImage})`
          }}
        >
          {/* Style injection for animations and custom golden scrollbars */}
          <style dangerouslySetInnerHTML={{ __html: `
            @keyframes bgZoom {
              from {
                opacity: 0.15;
                transform: scale(1.04);
              }
              to {
                opacity: 1;
                transform: scale(1);
              }
            }
            .animate-bgZoom {
              animation: bgZoom 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
            }
            .scrollbar-gold::-webkit-scrollbar {
              height: 3px;
            }
            .scrollbar-gold::-webkit-scrollbar-track {
              background: rgba(255, 255, 255, 0.02);
              border-radius: 4px;
            }
            .scrollbar-gold::-webkit-scrollbar-thumb {
              background: rgba(217, 119, 6, 0.4);
              border-radius: 4px;
            }
            .scrollbar-gold::-webkit-scrollbar-thumb:hover {
              background: rgba(217, 119, 6, 0.7);
            }
          ` }} />

          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-5 pt-3">
            {/* Brand Bar */}
            <div className="flex justify-between items-center py-3.5 border-b border-white/5">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-[#d97706] rounded-lg flex items-center justify-center font-bold text-sm tracking-tight text-white select-none">
                  PW
                </div>
                <span className="text-[10px] tracking-[0.1em] text-white/30 font-semibold uppercase">
                  Tools & Calculators
                </span>
              </div>

              {/* Avatar stack + counter */}
              <div className="flex items-center gap-2">
                <div className="flex -space-x-1.5 select-none">
                  <span className="inline-flex h-5 w-5 rounded-full ring-2 ring-[#0f1225] bg-gradient-to-tr from-amber-500 to-amber-300" />
                  <span className="inline-flex h-5 w-5 rounded-full ring-2 ring-[#0f1225] bg-gradient-to-tr from-blue-500 to-blue-300" />
                  <span className="inline-flex h-5 w-5 rounded-full ring-2 ring-[#0f1225] bg-gradient-to-tr from-emerald-500 to-emerald-300" />
                  <span className="inline-flex h-5 w-5 rounded-full ring-2 ring-[#0f1225] bg-gradient-to-tr from-purple-500 to-purple-300" />
                </div>
                <span className="text-xs text-white/50 font-medium">
                  {counter.toLocaleString('en-IN')} used this month
                </span>
              </div>
            </div>

            {/* Hero Row: Split into Title & Glass Badges on Desktop */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 py-2">
              {/* Left side: title and word swapper */}
              <div className="flex-1">
                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 mb-2">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                  </span>
                  <span className="text-[9px] font-bold text-amber-400 tracking-wider uppercase">Live Now</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white leading-tight">
                  Know your numbers. Then{' '}
                  <span className={`inline-block transition-all duration-300 font-serif italic text-amber-400 font-bold ${fade ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
                    {WORDS[wordIdx]}
                  </span>
                  .
                </h2>
              </div>

              {/* Right side: Glassmorphic stats badges */}
              <div className="hidden lg:flex flex-row gap-3.5 shrink-0 max-w-md">
                <div className="bg-white/[0.05] backdrop-blur-md border border-white/[0.08] rounded-xl px-4 py-2.5 flex items-center gap-3 shadow-lg hover:bg-white/[0.08] transition-all duration-300 hover:scale-[1.02]">
                  <div className="p-2 rounded-lg bg-amber-500/15 text-amber-400">
                    <ShieldCheck size={18} />
                  </div>
                  <div>
                    <div className="text-[13px] font-bold text-white tracking-tight">15+ Free Tools</div>
                    <div className="text-[10px] text-white/40">Secure & Government backed</div>
                  </div>
                </div>

                <div className="bg-white/[0.05] backdrop-blur-md border border-white/[0.08] rounded-xl px-4 py-2.5 flex items-center gap-3 shadow-lg hover:bg-white/[0.08] transition-all duration-300 hover:scale-[1.02]">
                  <div className="p-2 rounded-lg bg-blue-500/15 text-blue-400">
                    <Trophy size={18} />
                  </div>
                  <div>
                    <div className="text-[13px] font-bold text-white tracking-tight">31+ Yrs Trust</div>
                    <div className="text-[10px] text-white/40">Million Dollar Round Table</div>
                  </div>
                </div>
              </div>
            </div>

          {/* Category Tabs */}
          <div className="flex border-b border-white/10 select-none overflow-x-auto scrollbar-gold pb-1.5">
            <nav className="flex space-x-6 -mb-px flex-shrink-0">
              {CATEGORIES.map((cat) => {
                const isActive = cat.id === activeCategory
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id as any)}
                    className={`pb-3 text-[10px] tracking-wider font-semibold border-b transition-colors cursor-pointer uppercase ${
                      isActive
                        ? 'text-amber-400 border-amber-400/80 font-bold'
                        : 'text-white/25 border-transparent hover:text-white/50'
                    }`}
                  >
                    {getCategoryLabel(cat.id)}
                  </button>
                )
              })}
            </nav>
          </div>

          {/* Tool Tabs */}
          <div className="flex gap-2 overflow-x-auto py-1 scrollbar-gold snap-x select-none pb-1.5">
            {TOOLS_BY_CATEGORY[activeCategory].map((tool) => {
              const isActive = tool.id === activeTabId
              const isPlaceholder = tool.isPlaceholder

              const content = (
                <span className="flex items-center gap-1.5">
                  <span>{tool.label}</span>
                  {tool.isHot && <span className="w-1 h-1 rounded-full bg-orange-500 animate-pulse" />}
                </span>
              )

              if (isPlaceholder) {
                return (
                  <button
                    key={tool.id}
                    onClick={() => handlePlaceholderClick(tool.label)}
                    className="flex-shrink-0 px-3.5 py-1.5 rounded-xl border border-white/5 text-[11px] text-white/30 hover:text-white/50 cursor-pointer snap-start transition-colors"
                  >
                    {content}
                  </button>
                )
              }

              return (
                <Link
                  key={tool.id}
                  href={`${tool.path}${queryString}`}
                  className={`flex-shrink-0 px-3.5 py-1.5 rounded-xl text-[11px] font-medium border snap-start transition-all duration-200 ${
                    isActive
                      ? 'bg-amber-500/10 border-amber-500/20 text-amber-400 font-semibold'
                      : 'border-transparent text-white/40 hover:text-white/70'
                  }`}
                >
                  {content}
                </Link>
              )
            })}
          </div>
        </div>
      </header>
      </div>

      {/* ── LIGHT BODY CONTAINER ── */}
      <main className="py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Social Proof centered line */}
          {socialProofText && (
            <div className="flex items-center justify-center gap-1.5 text-[10px] text-gray-400 select-none animate-fadeIn">
              <Users className="w-3.5 h-3.5 text-gray-400" />
              <span>{socialProofText}</span>
            </div>
          )}

          {/* Form / Result columns wrapper */}
          <div className="flex flex-col lg:flex-row gap-6 items-start justify-center">
            {/* Form Left Side */}
            <div className={`w-full transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${
              hasCalculated ? 'lg:w-[42%] flex-shrink-0' : 'max-w-md'
            }`}>
              <CalculatorForm
                title={title}
                icon={TabIcon}
                infoTooltip={infoTooltip}
                onCalculate={onCalculate}
                calculateButtonText={calculateButtonText}
              >
                {formFields}
              </CalculatorForm>

              {/* Trust footer line */}
              <div className="mt-4 flex items-center justify-center gap-4 text-[10px] text-gray-400 select-none font-medium text-center">
                <span>✓ Official LIC rates</span>
                <span>• No pre sign-up</span>
                <span>• 30s answers</span>
              </div>
            </div>

            {/* Result Right Side */}
            {hasCalculated && (
              <div className="w-full lg:w-[58%] flex-1" ref={resultRef}>
                {resultPanel}
              </div>
            )}
          </div>

          {/* FAQ Accordion Section */}
          <CalculatorFAQ faqs={faq} />

          {/* Related Tools Section */}
          <RelatedCalculators currentTabId={activeTabId} queryString={queryString} />
        </div>
      </main>

      {/* ── COMING SOON OVERLAY MODAL ── */}
      {showComingSoon && (
        <div className="fixed inset-0 bg-[#0f1225]/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full text-center relative border border-gray-100 animate-fadeIn">
            {/* Success state check or rocket logo */}
            {notifSubmitted ? (
              <div className="space-y-3 animate-fadeIn">
                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mx-auto">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-gray-900">Subscription Confirmed!</h4>
                <p className="text-[11px] text-gray-500">We&apos;ll alert you as soon as this tool goes live.</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-[#d97706] mx-auto">
                  <Compass className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900">Building New Tools</h4>
                  <p className="text-[11px] text-gray-500 mt-1 leading-relaxed">
                    We are currently building the <strong>{comingSoonToolName}</strong> analyzer. Enter your email to be notified when it releases.
                  </p>
                </div>
                <form onSubmit={handleComingSoonSubmit} className="space-y-2">
                  <input
                    type="email"
                    value={notifEmail}
                    onChange={(e) => setNotifEmail(e.target.value)}
                    placeholder="yourname@example.com"
                    className="w-full h-10 px-3 text-xs rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-gray-900"
                    required
                  />
                  <button
                    type="submit"
                    className="w-full h-10 bg-gradient-to-r from-amber-600 to-amber-700 text-white font-semibold text-xs rounded-lg shadow cursor-pointer active:scale-[0.98] transition-transform"
                  >
                    Notify me when it&apos;s ready
                  </button>
                </form>
              </div>
            )}
            <button
              onClick={() => setShowComingSoon(false)}
              className="absolute top-3.5 right-3.5 text-gray-400 hover:text-gray-600 font-semibold cursor-pointer text-sm"
              aria-label="Close modal"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
