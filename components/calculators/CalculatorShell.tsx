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
    { id: 'policy-analyzer', label: 'Policy analyzer', path: '/analyzers/policy-document' },
    { id: 'plan-compare', label: 'Plan compare', path: '/compare' },
    { id: 'nav-tracker', label: 'NAV tracker', path: '/nav-tracker' },
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
    coverage: '/assets/hero-coverage.png',
    retirement: '/assets/hero-retirement.webp',
    surrender: '/assets/hero-surrender.png',
    loan: '/assets/hero-education.webp',
    health: '/assets/hero-health.webp',
    'policy-analyzer': '/assets/hero-analyzer.png',
    'plan-compare': '/assets/hero-compare.png',
    'nav-tracker': '/assets/hero-nav.png',
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

  const GLOW_COLORS = {
    insurance: 'bg-emerald-500/20',
    planning: 'bg-amber-500/20',
    analysis: 'bg-blue-500/20'
  }
  const activeGlow = GLOW_COLORS[activeCategory as keyof typeof GLOW_COLORS] || 'bg-amber-500/10'

  // Dynamic taglines mapping based on the active tab calculator
  const getDynamicTagline = () => {
    if (['premium', 'life-insurance', 'coverage'].includes(activeTabId)) {
      return 'Protect what matters most. With 31 years of insurance advisory trust.'
    }
    if (activeTabId === 'retirement') {
      return 'Plan your golden years. With India\'s trusted retirement planners.'
    }
    return 'Maximize your policy value. With expert, unbiased mathematical analysis.'
  }
  const dynamicTagline = getDynamicTagline()

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* ── DYNAMIC FULL-WIDTH DARK HEADER SECTION ── */}
      <header 
        className="relative text-white overflow-hidden pb-14 md:pb-18 transition-all duration-500 bg-cover bg-no-repeat rounded-b-[36px] md:rounded-b-[48px] shadow-lg border-b border-white/[0.08]"
        style={{
          backgroundImage: `linear-gradient(to right, #0f1225 15%, rgba(15, 18, 37, 0.45) 55%, rgba(15, 18, 37, 0.05) 85%, transparent 100%), url(${bgImage})`,
          backgroundPosition: '85% 35%' // Fixed high-vibrancy focus alignment
        }}
      >
        {/* Ambient color backdrop blur glow that shifts with activeCategory */}
        <div className={`absolute top-1/2 left-1/3 w-[300px] h-[300px] rounded-full blur-[110px] -translate-x-1/2 -translate-y-1/2 transition-all duration-700 ease-in-out pointer-events-none ${activeGlow}`} />

        {/* Style injection for animations, scrollbars, and dynamic page-specific navbar overrides */}
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
            background: rgba(217, 119, 6, 0.45);
            border-radius: 4px;
          }
          .scrollbar-gold::-webkit-scrollbar-thumb:hover {
            background: rgba(217, 119, 6, 0.7);
          }
          .tab-glow {
            box-shadow: 0 0 15px rgba(217, 119, 6, 0.15);
          }
        ` }} />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-5 pt-3">
          {/* Top Bar: Title Sub & Trust Counter */}
          <div className="flex justify-between items-center py-3 border-b border-white/5">
            <span className="text-[10px] tracking-[0.15em] text-white/30 font-bold uppercase">
              Tools & Calculators
            </span>

            <div className="flex items-center gap-2">
              <div className="flex -space-x-1.5 select-none">
                <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=60&h=60" className="inline-block h-5 w-5 rounded-full ring-2 ring-[#0f1225] object-cover" alt="" />
                <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=60&h=60" className="inline-block h-5 w-5 rounded-full ring-2 ring-[#0f1225] object-cover" alt="" />
                <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=60&h=60" className="inline-block h-5 w-5 rounded-full ring-2 ring-[#0f1225] object-cover" alt="" />
              </div>
              <span className="text-xs text-white/50 font-medium">
                {counter.toLocaleString('en-IN')} used this month
              </span>
            </div>
          </div>

          {/* Hero Row: Split into Title & Action pills */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 py-2">
            {/* Left side: title, word swapper, and dynamic subtitle */}
            <div className="flex-1">
              <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white leading-tight">
                Know your numbers. Then{' '}
                <span className={`inline-block transition-all duration-300 font-serif italic text-amber-400 font-bold ${fade ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
                  {WORDS[wordIdx]}
                </span>
                .
              </h2>
              {/* Dynamic, clean, high-contrast tagline quote */}
              <p className="text-xs sm:text-sm text-white/75 font-medium max-w-sm mt-1.5 select-none leading-relaxed drop-shadow-[0_1.5px_3px_rgba(0,0,0,0.45)]">
                {dynamicTagline}
              </p>
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
                    className={`pb-2.5 pt-1 px-4 text-[10px] tracking-wider font-semibold border-b-2 transition-all duration-300 cursor-pointer uppercase ${
                      isActive
                        ? 'text-amber-400 border-amber-400 font-bold tab-glow'
                        : 'text-white/60 border-transparent hover:text-white hover:border-white/20'
                    }`}
                  >
                    {getCategoryLabel(cat.id)}
                  </button>
                )
              })}
            </nav>
          </div>

          {/* Tool Tabs pills (highly readable glass buttons) */}
          <div className="flex gap-2.5 overflow-x-auto py-2.5 scrollbar-gold snap-x select-none pb-1.5">
            {TOOLS_BY_CATEGORY[activeCategory].map((tool) => {
              const isActive = tool.id === activeTabId
              const isPlaceholder = tool.isPlaceholder

              const content = (
                <span className="flex items-center gap-1.5">
                  <span>{tool.label}</span>
                  {tool.isHot && (
                    <span className="bg-amber-500 text-[#0f1225] text-[8px] px-1 py-0.2 rounded-full font-bold ml-1 animate-pulse shrink-0">
                      HOT
                    </span>
                  )}
                </span>
              )

              if (isPlaceholder) {
                return (
                  <button
                    key={tool.id}
                    onClick={() => handlePlaceholderClick(tool.label)}
                    className="flex-shrink-0 px-4 py-2 rounded-xl border border-white/5 text-[11px] text-white/30 hover:text-white/50 cursor-pointer snap-start transition-colors bg-white/[0.02]"
                  >
                    {content}
                  </button>
                )
              }

              return (
                <Link
                  key={tool.id}
                  href={`${tool.path}${queryString}`}
                  className={`flex-shrink-0 px-4 py-2 rounded-xl text-[11px] font-medium border snap-start transition-all duration-200 hover:scale-[1.03] active:scale-[0.97] ${
                    isActive
                      ? 'bg-amber-500 text-[#0f1225] border-amber-500 font-bold shadow-md shadow-amber-500/10'
                      : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:text-white hover:border-white/20'
                  }`}
                >
                  {content}
                </Link>
              )
            })}
          </div>
        </div>

        {/* Golden Crescent Edge highlight at the bottom curve */}
        <div className="absolute bottom-0 left-0 right-0 h-[4.5px] bg-gradient-to-r from-transparent via-amber-400 to-transparent opacity-85 shadow-[0_-2px_15px_#fbbf24] pointer-events-none" />
      </header>

      {/* ── LIGHT BODY CONTAINER (bg-gray-50) ── */}
      <main className="bg-gray-50 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-7">
          {/* Real Trust Metrics Bar (Grid cards below header crop) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 -mt-4 mb-3">
            <div className="bg-white border border-gray-100/80 rounded-2xl p-4 flex items-center gap-4 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.01]">
              <div className="p-3 rounded-xl bg-amber-500/10 text-amber-600 shrink-0">
                <ShieldCheck size={22} />
              </div>
              <div>
                <div className="text-[13px] font-bold text-gray-900 tracking-tight">15+ Free Financial Tools</div>
                <div className="text-[10px] text-gray-500 mt-0.5 leading-relaxed">Secure, independent & government-backed rate calculators</div>
              </div>
            </div>

            <div className="bg-white border border-gray-100/80 rounded-2xl p-4 flex items-center gap-4 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.01]">
              <div className="p-3 rounded-xl bg-blue-500/10 text-blue-600 shrink-0">
                <Trophy size={22} />
              </div>
              <div>
                <div className="text-[13px] font-bold text-gray-900 tracking-tight">31+ Years Legacy & Trust</div>
                <div className="text-[10px] text-gray-500 mt-0.5 leading-relaxed">MDRT USA Member advising over 5,000+ happy families</div>
              </div>
            </div>

            <div className="bg-white border border-gray-100/80 rounded-2xl p-4 flex items-center gap-4 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.01] md:col-span-2 lg:col-span-1">
              <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-600 shrink-0">
                <Users size={22} />
              </div>
              <div>
                <div className="text-[13px] font-bold text-gray-900 tracking-tight">1-on-1 Personal Consulting</div>
                <div className="text-[10px] text-gray-500 mt-0.5 leading-relaxed">Get direct, personalized policy reviews from Ajay Ji</div>
              </div>
            </div>
          </div>

          {/* Sub-header Brand Quote (Utilizing white space with high contrast & humanized trust) */}
          <div className="max-w-xl mx-auto text-center px-4 pt-1 pb-3 select-none pointer-events-none">
            <p className="text-[15px] text-gray-600 italic font-semibold leading-relaxed">
              &ldquo;31 years of showing up, not just selling.&rdquo;
            </p>
            <p className="text-[9px] text-[#d97706] font-bold uppercase tracking-[0.15em] mt-1">
              &mdash; Mr. Ajay Kumar Poddar (MDRT USA Member)
            </p>
          </div>



          {/* Form / Result columns wrapper */}
          <div className="flex flex-col lg:flex-row gap-6 items-start justify-center">
            {/* Form Left Side */}
            <div className={`w-full transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${
              hasCalculated ? 'lg:w-[42%] flex-shrink-0' : 'max-w-md'
            }`}>
              {/* Connected Social Proof Badge Badge directly above form card */}
              {socialProofText && (
                <div className="flex items-center gap-2 text-[10px] text-gray-500 select-none animate-fadeIn bg-white border border-gray-100 rounded-full px-3.5 py-1.5 w-fit mx-auto mb-3 shadow-sm">
                  <Users className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                  <span className="font-semibold">{socialProofText}</span>
                </div>
              )}
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
