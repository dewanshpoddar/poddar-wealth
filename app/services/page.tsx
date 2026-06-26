'use client'
import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useLang } from '@/lib/LangContext'
import { ADVISOR_PHONE } from '@/lib/constants'
import {
  Shield, Users, HeartPulse, Calculator, GraduationCap, Landmark, 
  Stethoscope, Building2, ShieldCheck, Ribbon, UserCheck, Heart, 
  Users2, HelpCircle, Calendar, Sparkles, ShieldAlert, Award, ArrowRight
} from 'lucide-react'

// Icon mapping helper
function getServiceIcon(emoji: string) {
  const cleanEmoji = emoji.replace(/[\ufe0f\u200d]/g, '').trim()
  switch (cleanEmoji) {
    case '🛡':
      return <Shield className="w-6 h-6 text-gold" />
    case '👨‍👩‍👧‍👦':
    case '👨👩👧👦':
      return <Users className="w-6 h-6 text-gold" />
    case '👨‍⚕️':
    case '👨⚕️':
      return <HeartPulse className="w-6 h-6 text-gold" />
    case '💼':
      return <Calculator className="w-6 h-6 text-gold" />
    case '👧':
      return <GraduationCap className="w-6 h-6 text-gold" />
    case '👴':
      return <Landmark className="w-6 h-6 text-gold" />
    case '🩺':
      return <Stethoscope className="w-6 h-6 text-gold" />
    case '🏢':
      return <Building2 className="w-6 h-6 text-gold" />
    case '🚶‍♂️':
    case '🚶':
    case '🚶♂️':
      return <ShieldCheck className="w-6 h-6 text-gold" />
    case '🎗️':
    case '🎗':
      return <Ribbon className="w-6 h-6 text-gold" />
    case '🧔':
      return <UserCheck className="w-6 h-6 text-gold" />
    case '👰':
      return <Heart className="w-6 h-6 text-gold" />
    case '👥':
      return <Users2 className="w-6 h-6 text-gold" />
    default:
      return <Shield className="w-6 h-6 text-gold" />
  }
}

// Maps individual subservice slug to its category
const categoryMap: Record<string, 'protection' | 'savings' | 'health'> = {
  'life-insurance': 'protection',
  'term-life': 'protection',
  'personal-accident': 'protection',
  'keyman-insurance': 'protection',
  'child-planning': 'savings',
  'child-wedding': 'savings',
  'retirement': 'savings',
  'tax-planning': 'savings',
  'health-insurance': 'health',
  'critical-illness': 'health',
  'cancer-cover': 'health',
  'group-health': 'health',
}

// Features list helper for wide cards
function getServiceFeatures(slug: string, isHi: boolean) {
  switch (slug) {
    case 'term-life':
      return isHi 
        ? ["₹1 करोड़ तक का उच्च कवर", "कम प्रीमियम दरें", "पॉलिसी अवधि में निश्चित सुरक्षा"] 
        : ["High cover up to ₹1 Crore", "Low premium rates", "Fixed cover terms"]
    case 'life-insurance':
      return isHi
        ? ["गारंटीड मैच्योरिटी रिटर्न", "टैक्स-फ्री बचत (80C)", "आजीवन वित्तीय सुरक्षा"]
        : ["Guaranteed maturity returns", "Tax-free savings (80C)", "Lifetime family security"]
    case 'child-planning':
      return isHi
        ? ["उच्च शिक्षा के लिए फंड", "प्रीमियम वेवर बेनिफिट", "सुरक्षित परिपक्वता लाभ"]
        : ["Education milestone funding", "Premium waiver benefit", "Guaranteed maturity return"]
    case 'retirement':
      return isHi
        ? ["गारंटीड मासिक पेंशन", "आजीवन नियमित आय", "पति-पत्नी पेंशन विकल्प"]
        : ["Guaranteed monthly pension", "Lifetime regular income", "Spouse pension option"]
    case 'health-insurance':
      return isHi
        ? ["कैशलेस अस्पताल नेटवर्क", "कोई रूम रेंट लिमिट नहीं", "मैच्योरिटी बोनस लाभ"]
        : ["Cashless network hospitals", "No room rent limits", "Maturity bonus benefits"]
    case 'group-health':
      return isHi
        ? ["कर्मचारियों की सुरक्षा", "पहले दिन से बीमारी कवर", "सस्ता कॉर्पोरेट प्रीमियम"]
        : ["Employee health coverage", "Pre-existing covers from Day 1", "Affordable corporate rates"]
    default:
      return []
  }
}

export default function ServicesPage() {
  const { t, lang } = useLang()
  const [activeTab, setActiveTab] = useState<'all' | 'protection' | 'savings' | 'health'>('all')
  const [journeyImgSrc, setJourneyImgSrc] = useState('/images/services/services_hub_journey.webp')

  const isHi = lang === 'hi'

  // Dynamic filter items
  const servicesItems = t.services.items || []
  
  const protectionItems = servicesItems.filter((item: any) => {
    const slug = item.href.replace('/services/', '')
    return categoryMap[slug] === 'protection'
  })

  const savingsItems = servicesItems.filter((item: any) => {
    const slug = item.href.replace('/services/', '')
    return categoryMap[slug] === 'savings'
  })

  const healthItems = servicesItems.filter((item: any) => {
    const slug = item.href.replace('/services/', '')
    return categoryMap[slug] === 'health'
  })

  const milestoneTriggers = [
    {
      title: isHi ? "बेटी की शादी की योजना" : "Plan for Daughter's Wedding",
      desc: isHi ? "कन्यादान व अन्य कर-मुक्त बचत प्लान" : "LIC Kanyadan & tax-free savings plans",
      icon: <Heart className="w-5 h-5 text-amber-500" />,
      tab: 'savings' as const,
    },
    {
      title: isHi ? "बच्चों की उच्च शिक्षा" : "Fund Children's Education",
      desc: isHi ? "भविष्य के गारंटीड माइलस्टोन रिटर्न" : "Guaranteed milestone funds for college",
      icon: <GraduationCap className="w-5 h-5 text-amber-500" />,
      tab: 'savings' as const,
    },
    {
      title: isHi ? "परिवार की नियमित आय" : "Secure Family Income",
      desc: isHi ? "टर्म प्लान और जीवन सुरक्षा बीमा" : "High term covers & pure risk protections",
      icon: <ShieldAlert className="w-5 h-5 text-amber-500" />,
      tab: 'protection' as const,
    },
    {
      title: isHi ? "बुजुर्ग माता-पिता का इलाज" : "Medical Protection for Parents",
      desc: isHi ? "वरिष्ठ नागरिक हेल्थ पॉलिसी सुरक्षा" : "Senior citizen health insurance plans",
      icon: <HeartPulse className="w-5 h-5 text-amber-500" />,
      tab: 'health' as const,
    }
  ]

  const handleMilestoneClick = (tab: 'protection' | 'savings' | 'health') => {
    setActiveTab(tab)
    const element = document.getElementById('catalog-section')
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <div className="min-h-screen bg-[#fafbfc] text-navy">
      
      {/* 1. HERO SECTION WITH IMAGE COLLAGE & GLOW */}
      <section className="pt-24 pb-20 md:py-32 bg-[#090a12] bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#12162a] via-[#090a12] to-[#040509] relative overflow-hidden text-white border-b border-white/[0.05]">
        {/* Modern decorative grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black_70%)] pointer-events-none" />

        {/* Dynamic Glow Orbs */}
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[60%] rounded-full bg-gold/10 blur-[130px] pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[50%] rounded-full bg-amber-500/5 blur-[110px] pointer-events-none" />

        <div className="max-w-[1400px] mx-auto px-6 grid lg:grid-cols-12 gap-12 lg:gap-8 items-center relative z-10">
          {/* Left Text column */}
          <div className="lg:col-span-7 flex flex-col justify-center text-left">
            {/* Premium tag capsule */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.08] backdrop-blur-md mb-6 self-start">
              <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
              <span className="text-[10px] md:text-11 font-bold text-gold uppercase tracking-[0.2em] leading-none">
                {t.services.eyebrow}
              </span>
            </div>

            <h1 className="text-4xl md:text-6.5xl font-display font-light leading-[1.15] mb-6 tracking-tight text-white">
              One Lifetime. <br className="hidden sm:inline" />
              <span className="font-semibold text-gold italic">Complete Protection.</span>
            </h1>
            
            <p className="text-slate-300 text-[15px] md:text-17 max-w-lg leading-relaxed mb-10 font-normal">
              {t.services.subtitle}
            </p>

            {/* Premium CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 mb-10">
              <Link 
                href="/contact" 
                className="pw-btn pw-btn--gold shadow-lg shadow-gold-sm min-h-[48px] px-8 flex items-center justify-center font-bold text-13 uppercase tracking-wider transition-all duration-300 hover:-translate-y-0.5 hover:shadow-gold-md"
              >
                {isHi ? "मुफ्त समीक्षा बुक करें" : "Book Free Review"}
              </Link>
              <a 
                href="#catalog-section" 
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/10 bg-white/[0.02] hover:bg-white/[0.06] hover:border-white/20 text-white font-bold text-12 uppercase tracking-wider transition-all duration-300"
              >
                <span>{isHi ? "सभी प्लान देखें" : "Explore Solutions"}</span>
                <ArrowRight className="w-4 h-4 text-gold" />
              </a>
            </div>

            {/* Premium Credentials block */}
            <div className="flex flex-wrap items-center gap-x-8 gap-y-4 pt-8 border-t border-white/[0.08] w-full">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gold/10 flex items-center justify-center">
                  <Award className="w-4.5 h-4.5 text-gold" />
                </div>
                <div>
                  <p className="text-white text-13 font-bold leading-none">31+ Years Legacy</p>
                  <p className="text-[10px] text-slate-400 mt-1.5 uppercase tracking-wider font-semibold">Gorakhpur & Beyond</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gold/10 flex items-center justify-center">
                  <Users className="w-4.5 h-4.5 text-gold" />
                </div>
                <div>
                  <p className="text-white text-13 font-bold leading-none">5,000+ Happy Families</p>
                  <p className="text-[10px] text-slate-400 mt-1.5 uppercase tracking-wider font-semibold">Guaranteed Security</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Image Frame (Family Journey representation) */}
          <div className="lg:col-span-5 relative group">
            {/* Premium outer ambient glow */}
            <div className="absolute -inset-4 bg-gradient-to-tr from-gold/15 to-amber-500/5 rounded-[36px] blur-2xl opacity-70 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="relative w-full h-[340px] md:h-[480px] rounded-3xl overflow-hidden shadow-[0_24px_60px_-15px_rgba(0,0,0,0.8)] border border-white/10 bg-[#0b0d19]">
              {/* Master Generational Image */}
              <Image
                src={journeyImgSrc}
                alt="Three-Generation Indian Family Journey"
                fill
                priority
                unoptimized
                className="object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                onError={() => {
                  setJourneyImgSrc('/images/services/savings.webp')
                }}
              />
              {/* Premium gradients to blend */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#090a12] via-transparent to-transparent pointer-events-none opacity-90" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#090a12]/30 via-transparent to-[#090a12]/30 pointer-events-none" />
              
              {/* Visual floating badge */}
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-[#0b0d19]/80 backdrop-blur-xl border border-white/[0.08] flex items-center justify-between shadow-2xl transition-all duration-300 hover:border-gold/30">
                <div>
                  <p className="text-[10px] font-bold text-gold uppercase tracking-[0.15em] leading-none">Inter-generational Journey</p>
                  <p className="text-14 font-bold text-white mt-1.5 tracking-tight">Absolute Peace of Mind</p>
                </div>
                <div className="w-9 h-9 rounded-xl bg-gold/10 flex items-center justify-center border border-gold/20">
                  <Sparkles className="w-4 h-4 text-gold animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. INTERACTIVE MILESTONE MATRIX (Bento Guide) */}
      <section className="px-6 max-w-[1400px] mx-auto -mt-20 md:-mt-28 mb-16 relative z-20">
        <div className="bg-white rounded-3xl p-8 md:p-10 shadow-[0_30px_70px_-10px_rgba(0,0,0,0.15)] border border-gray-100">
          <div className="flex items-center gap-2 text-gold text-12 font-bold tracking-wider uppercase mb-4">
            <HelpCircle className="w-4 h-4" />
            <span>{isHi ? "त्वरित चयन गाइड" : "Milestone-Based Guide"}</span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-navy mb-6 tracking-tight">
            {isHi ? "आप किस जीवन लक्ष्य के लिए बचत करना चाहते हैं?" : "What life milestone are you planning for today?"}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {milestoneTriggers.map((trig, idx) => (
              <button
                key={idx}
                onClick={() => handleMilestoneClick(trig.tab)}
                className="flex items-start gap-4 p-5 rounded-2xl border border-gray-100 bg-slate-50/50 hover:bg-white hover:border-gold/25 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 text-left cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                  {trig.icon}
                </div>
                <div>
                  <h3 className="text-14 font-bold text-navy group-hover:text-gold transition-colors">{trig.title}</h3>
                  <p className="text-11 text-slate-500 font-medium mt-1 leading-normal">{trig.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 3. FILTER NAVIGATION TAB BAR */}
      <section id="catalog-section" className="pt-4 pb-12 text-center px-6">
        <div className="inline-flex p-1.5 rounded-full bg-navy/5 border border-navy/5 backdrop-blur-sm max-w-full overflow-x-auto">
          {[
            { id: 'all', label: isHi ? 'सभी समाधान' : 'All Solutions' },
            { id: 'protection', label: isHi ? 'पारिवारिक सुरक्षा' : 'Family Protection' },
            { id: 'savings', label: isHi ? 'बचत व धन वृद्धि' : 'Savings & Wealth' },
            { id: 'health', label: isHi ? 'स्वास्थ्य देखभाल' : 'Health Care' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-6 py-2.5 rounded-full text-12 font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-gold text-white shadow-md'
                  : 'text-navy/70 hover:text-navy hover:bg-navy/5'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </section>

      {/* 4. GROUPED CATEGORIES LIST */}
      <section className="pb-24 px-6 max-w-[1400px] mx-auto flex flex-col gap-24">
        
        {/* CATEGORY 1: PROTECTION */}
        {(activeTab === 'all' || activeTab === 'protection') && protectionItems.length > 0 && (
          <div className="bg-gradient-to-br from-[#0b0c16] via-[#10142b] to-[#080910] rounded-3xl p-8 md:p-10 border border-white/[0.08] shadow-[0_20px_50px_rgba(0,0,0,0.3)] relative overflow-hidden text-white">
            {/* Subtle grid texture overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10 relative z-10">
              <div>
                <span className="text-[10px] font-bold text-gold tracking-widest uppercase bg-gold/15 px-3 py-1.5 rounded-full border border-gold/20">
                  🛡️ Category Hub
                </span>
                <h3 className="text-2.5xl font-display font-bold text-white mt-4 tracking-tight">
                  {isHi ? 'सुरक्षा समाधान' : 'Protection Solutions'}
                </h3>
              </div>
              <Link
                href="/services/protection"
                className="inline-flex items-center gap-1.5 text-12 font-bold text-gold hover:text-white transition-colors uppercase tracking-wider bg-white/[0.03] border border-white/[0.08] px-5 py-2.5 rounded-full hover:bg-white/[0.08]"
              >
                {isHi ? 'सुरक्षा हब देखें' : 'Explore Protection Hub'} <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10">
              {protectionItems.map((svc: any, idx: number) => {
                const slug = svc.href.replace('/services/', '')
                // Wide cards: term-life (idx 3) & life-insurance (idx 0)
                // Narrow cards: keyman-insurance (idx 1) & personal-accident (idx 2)
                const isWide = slug === 'term-life' || slug === 'life-insurance'
                const features = getServiceFeatures(slug, isHi)
                return (
                  <div
                    key={idx}
                    className={`${
                      isWide ? 'lg:col-span-7 bg-white/[0.02]' : 'lg:col-span-5 bg-white/[0.01]'
                    } border border-white/[0.08] rounded-2xl p-6 md:p-8 hover:shadow-[0_12px_40px_rgba(0,0,0,0.4)] hover:border-gold/40 hover:bg-white/[0.04] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-6">
                        <div className="w-12 h-12 rounded-xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-center group-hover:bg-gold/10 group-hover:border-gold/20 transition-colors">
                          {getServiceIcon(svc.icon)}
                        </div>
                        {svc.badge && (
                          <span className="px-2.5 py-1 rounded-full bg-gold/15 border border-gold/30 text-[9px] font-bold text-gold uppercase tracking-wider">
                            {svc.badge}
                          </span>
                        )}
                      </div>

                      <h4 className="text-17 font-bold text-white group-hover:text-gold transition-colors duration-250 mb-3">
                        {svc.title}
                      </h4>
                      <p className="text-12.5 text-slate-400 font-medium leading-relaxed mb-6">
                        {svc.desc}
                      </p>

                      {/* Custom Features List */}
                      {isWide && features.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-white/[0.06] flex flex-col gap-2">
                          {features.map((feat: string, fidx: number) => (
                            <div key={fidx} className="flex items-center gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-gold shrink-0" />
                              <span className="text-11.5 text-slate-300 font-normal">{feat}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-6 mt-6 border-t border-white/[0.06]">
                      <span className="px-2.5 py-1 rounded bg-white/[0.04] border border-white/[0.06] text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                        {svc.tag}
                      </span>
                      <Link
                        href={svc.href}
                        className="text-12 font-bold text-gold hover:text-white flex items-center gap-1 transition-colors"
                      >
                        {isHi ? 'विवरण' : 'Details'} →
                      </Link>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* CATEGORY 2: SAVINGS & WEALTH */}
        {(activeTab === 'all' || activeTab === 'savings') && savingsItems.length > 0 && (
          <div className="bg-gradient-to-br from-white via-[#fffdf9] to-[#fffcf5] rounded-3xl p-8 md:p-10 border border-amber-100/70 shadow-sm relative overflow-hidden">
            {/* Subtle grid background */}
            <div className="absolute inset-0 bg-[radial-gradient(#c9a84c05_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10 relative z-10">
              <div>
                <span className="text-[10px] font-bold text-gold tracking-widest uppercase bg-gold/10 px-3 py-1.5 rounded-full border border-gold/25">
                  💰 Category Hub
                </span>
                <h3 className="text-2.5xl font-display font-bold text-navy mt-4 tracking-tight">
                  {isHi ? 'बचत और धन वृद्धि' : 'Savings & Wealth Creation'}
                </h3>
              </div>
              <Link
                href="/services/savings"
                className="inline-flex items-center gap-1.5 text-12 font-bold text-navy hover:text-gold transition-colors uppercase tracking-wider bg-white/80 border border-gray-150 px-5 py-2.5 rounded-full hover:bg-white"
              >
                {isHi ? 'बचत हब देखें' : 'Explore Savings Hub'} <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10">
              {savingsItems.map((svc: any, idx: number) => {
                const slug = svc.href.replace('/services/', '')
                // Wide cards: child-planning (idx 1) & retirement (idx 2)
                // Narrow cards: tax-planning (idx 0) & child-wedding (idx 3)
                const isWide = slug === 'child-planning' || slug === 'retirement'
                const features = getServiceFeatures(slug, isHi)
                return (
                  <div
                    key={idx}
                    className={`${
                      isWide ? 'lg:col-span-7 bg-gradient-to-br from-amber-500/[0.01] to-amber-500/[0.04]' : 'lg:col-span-5 bg-white'
                    } border border-gray-150/70 rounded-2xl p-6 md:p-8 hover:shadow-[0_15px_45px_-5px_rgba(201,168,76,0.12)] hover:border-gold/45 hover:bg-white hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-6">
                        <div className="w-12 h-12 rounded-xl bg-warm flex items-center justify-center group-hover:bg-gold/10 group-hover:border-gold/20 transition-colors">
                          {getServiceIcon(svc.icon)}
                        </div>
                        {svc.badge && (
                          <span className="px-2.5 py-1 rounded-full bg-gold/10 border border-gold/25 text-[9px] font-bold text-gold uppercase tracking-wider">
                            {svc.badge}
                          </span>
                        )}
                      </div>

                      <h4 className="text-17 font-bold text-navy group-hover:text-gold transition-colors duration-250 mb-3">
                        {svc.title}
                      </h4>
                      <p className="text-12.5 text-slate-500 font-medium leading-relaxed mb-6">
                        {svc.desc}
                      </p>

                      {/* Custom Features List */}
                      {isWide && features.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-gray-100 flex flex-col gap-2">
                          {features.map((feat: string, fidx: number) => (
                            <div key={fidx} className="flex items-center gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-gold shrink-0" />
                              <span className="text-11.5 text-slate-600 font-normal">{feat}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-6 mt-6 border-t border-gray-100">
                      <span className="px-2.5 py-1 rounded bg-slate-50 border border-gray-100 text-[9px] font-bold text-slate-500 uppercase tracking-wider">
                        {svc.tag}
                      </span>
                      <Link
                        href={svc.href}
                        className="text-12 font-bold text-navy hover:text-gold flex items-center gap-1 transition-colors"
                      >
                        {isHi ? 'विवरण' : 'Details'} →
                      </Link>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* CATEGORY 3: HEALTH SOLUTIONS */}
        {(activeTab === 'all' || activeTab === 'health') && healthItems.length > 0 && (
          <div className="bg-gradient-to-br from-white via-[#fafdfc] to-[#f4fbf8] rounded-3xl p-8 md:p-10 border border-emerald-100/60 shadow-sm relative overflow-hidden">
            {/* Subtle grid background */}
            <div className="absolute inset-0 bg-[radial-gradient(#10b98104_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10 relative z-10">
              <div>
                <span className="text-[10px] font-bold text-emerald-600 tracking-widest uppercase bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200/50">
                  🩺 Category Hub
                </span>
                <h3 className="text-2.5xl font-display font-bold text-navy mt-4 tracking-tight">
                  {isHi ? 'स्वास्थ्य देखभाल' : 'Health Solutions'}
                </h3>
              </div>
              <Link
                href="/services/health"
                className="inline-flex items-center gap-1.5 text-12 font-bold text-navy hover:text-emerald-600 transition-colors uppercase tracking-wider bg-white/80 border border-gray-150 px-5 py-2.5 rounded-full hover:bg-white"
              >
                {isHi ? 'स्वास्थ्य हब देखें' : 'Explore Health Hub'} <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10">
              {healthItems.map((svc: any, idx: number) => {
                const slug = svc.href.replace('/services/', '')
                // Wide cards: health-insurance (idx 0) & group-health (idx 3)
                // Narrow cards: critical-illness (idx 1) & cancer-cover (idx 2)
                const isWide = slug === 'health-insurance' || slug === 'group-health'
                const features = getServiceFeatures(slug, isHi)
                return (
                  <div
                    key={idx}
                    className={`${
                      isWide ? 'lg:col-span-7 bg-gradient-to-br from-emerald-500/[0.01] to-emerald-500/[0.04]' : 'lg:col-span-5 bg-white'
                    } border border-gray-150/70 rounded-2xl p-6 md:p-8 hover:shadow-[0_15px_45px_-5px_rgba(16,185,129,0.1)] hover:border-emerald-500/50 hover:bg-white hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-6">
                        <div className="w-12 h-12 rounded-xl bg-warm flex items-center justify-center group-hover:bg-emerald-500/10 group-hover:border-emerald-500/20 transition-colors">
                          {getServiceIcon(svc.icon)}
                        </div>
                        {svc.badge && (
                          <span className="px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200/55 text-[9px] font-bold text-emerald-700 uppercase tracking-wider">
                            {svc.badge}
                          </span>
                        )}
                      </div>

                      <h4 className="text-17 font-bold text-navy group-hover:text-emerald-600 transition-colors duration-250 mb-3">
                        {svc.title}
                      </h4>
                      <p className="text-12.5 text-slate-500 font-medium leading-relaxed mb-6">
                        {svc.desc}
                      </p>

                      {/* Custom Features List */}
                      {isWide && features.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-gray-100 flex flex-col gap-2">
                          {features.map((feat: string, fidx: number) => (
                            <div key={fidx} className="flex items-center gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                              <span className="text-11.5 text-slate-600 font-normal">{feat}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-6 mt-6 border-t border-gray-100">
                      <span className="px-2.5 py-1 rounded bg-slate-50 border border-gray-100 text-[9px] font-bold text-slate-500 uppercase tracking-wider">
                        {svc.tag}
                      </span>
                      <Link
                        href={svc.href}
                        className="text-12 font-bold text-navy hover:text-emerald-600 flex items-center gap-1 transition-colors"
                      >
                        {isHi ? 'विवरण' : 'Details'} →
                      </Link>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

      </section>

      {/* 5. STATE-OF-THE-ART VALUE PROPOSITION (Legacy Block) */}
      <section className="py-20 bg-warm/30 text-center px-6 border-t border-gray-100">
        <div className="max-w-2xl mx-auto">
          <HelpCircle className="w-10 h-10 text-gold mx-auto mb-6" />
          <h2 className="text-2xl md:text-3xl font-display font-bold text-navy mb-4">
            {isHi ? "क्या आप सही सुरक्षा विकल्प को लेकर असमंजस में हैं?" : "Not sure which safety option is right for you?"}
          </h2>
          <p className="text-slate-600 mb-8 italic text-14 leading-relaxed max-w-xl mx-auto">
            {isHi
              ? "अजय कुमार पोद्दार जी पिछले 31 वर्षों से अधिक समय से परिवारों की आवश्यकताओं के अनुरूप व्यक्तिगत योजनाओं को तैयार कर रहे हैं, ताकि भविष्य सुरक्षित रहे।"
              : "Ajay Kumar Poddar has spent over 31 years custom-designing insurance portfolios specifically tailored to each family's unique lifecycle goals."}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" className="pw-btn pw-btn--gold shadow-lg shadow-gold-sm min-h-[48px] px-8 flex items-center justify-center">
              {isHi ? "मुफ्त समीक्षा बुक करें" : "Book Free Profile Review"}
            </Link>
            <a href={`tel:${ADVISOR_PHONE}`} className="pw-btn pw-btn--navy min-h-[48px] px-8 flex items-center justify-center">
              {isHi ? "अजय जी को कॉल करें" : `Call ${ADVISOR_PHONE}`}
            </a>
          </div>
        </div>
      </section>

    </div>
  )
}
