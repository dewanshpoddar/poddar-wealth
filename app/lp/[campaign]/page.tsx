'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ADVISOR_PHONE } from '@/lib/constants'
import { Shield, Trophy, Star, Phone, MessageCircle, AlertCircle, CheckCircle } from 'lucide-react'
import dynamic from 'next/dynamic'

// Dynamically import calculator pages to keep micro-site templates fast-loading
const PremiumCalculatorPage = dynamic(() => import('@/app/calculators/premium/page'), { ssr: false })
const PolicyHealthCalculatorPage = dynamic(() => import('@/app/calculators/policy-health/page'), { ssr: false })

function LandingCampaignPageContent() {
  const params = useParams()
  const searchParams = useSearchParams()
  const campaign = params?.campaign as string

  // Read UTM parameters
  const utm_source = searchParams?.get('utm_source') || ''
  const utm_medium = searchParams?.get('utm_medium') || ''
  const utm_campaign = searchParams?.get('utm_campaign') || ''

  // Log LP view event on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'lp_view', {
        campaign,
        utm_source,
        utm_medium,
        utm_campaign,
      })
    }
  }, [campaign, utm_source, utm_medium, utm_campaign])

  // Lead Form State (for life-insurance campaign)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  // Handle Lead Form Submit
  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !phone) return

    setLoading(true)
    setErrorMsg('')
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          mobile: phone,
          intent: `Landing Page Campaign: ${campaign}`,
          utm_source,
          utm_medium,
          utm_campaign,
        })
      })
      if (res.ok) {
        setSuccess(true)
        setName('')
        setPhone('')
      } else {
        setErrorMsg('Failed to submit. Please try again or WhatsApp directly.')
      }
    } catch {
      setErrorMsg('Failed to submit. Please try again or WhatsApp directly.')
    } finally {
      setLoading(false)
    }
  }

  // 1. CAMPAIGN A: Life Insurance Landing Page
  if (campaign === 'life-insurance') {
    return (
      <div className="bg-gray-950 text-white min-h-screen flex flex-col font-sans">
        {/* Minimal Header */}
        <header className="bg-gray-900/50 border-b border-gray-800 h-12 flex items-center justify-between px-6 shrink-0 z-50">
          <div className="flex items-center gap-2">
            <Image
              src="/assets/pwm-logo.svg"
              alt="Poddar Wealth Logo"
              width={24}
              height={24}
              className="bg-white/5 p-0.5 rounded"
            />
            <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-white">
              Poddar Wealth
            </span>
          </div>
          <a
            href={`tel:+91${ADVISOR_PHONE}`}
            className="flex items-center gap-1.5 text-[10px] sm:text-xs font-black text-amber-500 hover:text-amber-400 uppercase tracking-widest font-sans"
          >
            <Phone size={11} />
            +91 {ADVISOR_PHONE}
          </a>
        </header>

        {/* Hero Section */}
        <main className="flex-1 flex flex-col justify-center items-center px-6 py-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/5 rounded-full blur-[80px] pointer-events-none" />
          
          <div className="w-full max-w-lg space-y-8 text-center">
            
            {/* Header Content */}
            <div className="space-y-4">
              <span className="inline-flex items-center gap-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-black px-3.5 py-1.5 rounded-full uppercase tracking-widest">
                <Shield size={11} className="animate-pulse" />
                MDRT Certified Advisor
              </span>
              <h1 className="text-3xl sm:text-5xl font-display font-black leading-tight text-white tracking-tight">
                Secure Your Family&apos;s <span className="text-amber-500">Financial Future</span>
              </h1>
              <p className="text-gray-400 text-xs sm:text-sm leading-relaxed max-w-sm mx-auto font-medium">
                Protect your dependents, grow your wealth, and save taxes with customized LIC life insurance plans tailored personally by Ajay Kumar Poddar.
              </p>
            </div>

            {/* Inline Trust Stats */}
            <div className="grid grid-cols-3 gap-2 py-4 border-y border-gray-800/80 max-w-md mx-auto">
              <div className="text-center">
                <div className="text-sm sm:text-base font-black text-white font-sans">31+</div>
                <div className="text-[8px] sm:text-[9px] font-bold text-gray-500 uppercase tracking-widest mt-0.5">Years Service</div>
              </div>
              <div className="text-center border-x border-gray-800/80">
                <div className="text-sm sm:text-base font-black text-white font-sans">5000+</div>
                <div className="text-[8px] sm:text-[9px] font-bold text-gray-500 uppercase tracking-widest mt-0.5">Families</div>
              </div>
              <div className="text-center">
                <div className="text-sm sm:text-base font-black text-amber-500 font-sans flex items-center justify-center gap-0.5">
                  4.9<Star size={10} className="fill-current text-amber-500" />
                </div>
                <div className="text-[8px] sm:text-[9px] font-bold text-gray-500 uppercase tracking-widest mt-0.5">Google Rating</div>
              </div>
            </div>

            {/* Lead Form Card */}
            <div className="bg-gray-900/60 border border-gray-800 rounded-3xl p-6 shadow-2xl relative text-left">
              {!success ? (
                <form onSubmit={handleLeadSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 gap-3.5">
                    <div>
                      <label htmlFor="name" className="block text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1 px-1">
                        Full Name
                      </label>
                      <input
                        id="name"
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Ramesh Sharma"
                        className="w-full bg-gray-950 border border-gray-800 hover:border-gray-700 focus:border-amber-500 rounded-xl px-4 py-3 text-xs outline-none text-white font-semibold placeholder-gray-700"
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1 px-1">
                        WhatsApp Mobile Number
                      </label>
                      <input
                        id="phone"
                        type="tel"
                        required
                        pattern="[0-9]{10}"
                        maxLength={10}
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                        placeholder="10-digit number"
                        className="w-full bg-gray-950 border border-gray-800 hover:border-gray-700 focus:border-amber-500 rounded-xl px-4 py-3 text-xs outline-none text-white font-semibold placeholder-gray-700 font-sans"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-amber-500 hover:bg-amber-600 disabled:bg-gray-800 text-white font-black text-xs py-3.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-lg shadow-amber-500/10"
                  >
                    {loading ? (
                      <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      'Get Free Consultation'
                    )}
                  </button>

                  {errorMsg && (
                    <div className="bg-rose-950/20 border border-rose-900/40 text-rose-400 text-[10px] font-bold py-2 rounded-xl text-center flex items-center justify-center gap-1">
                      <AlertCircle size={10} />
                      {errorMsg}
                    </div>
                  )}
                </form>
              ) : (
                <div className="text-center py-6 space-y-4 animate-fade-in">
                  <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle size={20} />
                  </div>
                  <div>
                    <h3 className="text-white text-base font-extrabold mb-1">Consultation Request Sent!</h3>
                    <p className="text-gray-400 text-xs font-semibold leading-relaxed">
                      Ajay sir (MDRT Member) will call you shortly on your WhatsApp number.
                    </p>
                  </div>
                  <a
                    href={`https://wa.me/91${ADVISOR_PHONE}?text=${encodeURIComponent(
                      `Hello Ajay sir, I requested a free consultation from your life insurance landing page (${campaign}).` +
                      (utm_source ? ` Source: ${utm_source}.` : '') +
                      (utm_campaign ? ` Campaign: ${utm_campaign}.` : '')
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex w-full bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs py-3.5 rounded-xl items-center justify-center gap-1.5 shadow-md shadow-emerald-500/10 font-sans"
                  >
                    <MessageCircle size={14} className="fill-current" />
                    Chat on WhatsApp Now
                  </a>
                </div>
              )}
            </div>

            {/* Badges footer */}
            <div className="flex items-center justify-center gap-6 text-[10px] font-bold text-gray-500 uppercase tracking-widest pt-2">
              <span className="flex items-center gap-1">
                <Shield size={12} className="text-amber-500" />
                MDRT Member
              </span>
              <span className="flex items-center gap-1">
                <Trophy size={12} className="text-amber-500" />
                Chairman&apos;s Club
              </span>
            </div>

          </div>
        </main>

        {/* Persistent WhatsApp Floating Button */}
        <a
          href={`https://wa.me/91${ADVISOR_PHONE}?text=${encodeURIComponent(
            `Hello Ajay sir, I need advice regarding life insurance plans.` +
            (utm_source ? ` (Source: ${utm_source}, Campaign: ${utm_campaign})` : '')
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-6 right-6 z-50 bg-emerald-500 hover:bg-emerald-600 text-white p-3.5 rounded-full shadow-2xl transition-all hover:scale-105 active:scale-95 animate-wa-pulse"
          title="Consult on WhatsApp"
        >
          <MessageCircle size={24} className="fill-current" />
        </a>
      </div>
    )
  }

  // 2. CAMPAIGN B & C: Calculator / Health Check Landing Pages
  return (
    <div className="bg-slate-50 min-h-screen flex flex-col font-sans text-slate-800">
      {/* Minimal Header */}
      <header className="bg-white border-b border-slate-100 h-12 flex items-center justify-between px-6 shrink-0 z-50">
        <div className="flex items-center gap-2">
          <Image
            src="/assets/pwm-logo.svg"
            alt="Poddar Wealth Logo"
            width={24}
            height={24}
          />
          <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-navy">
            Poddar Wealth
          </span>
        </div>
        <a
          href={`tel:+91${ADVISOR_PHONE}`}
          className="flex items-center gap-1.5 text-[10px] sm:text-xs font-black text-amber-600 hover:text-amber-700 uppercase tracking-widest font-sans"
        >
          <Phone size={11} />
          +91 {ADVISOR_PHONE}
        </a>
      </header>

      {/* Embedded Component Main Panel */}
      <main className="flex-grow">
        {campaign === 'calculator' ? (
          <div className="pb-12">
            <PremiumCalculatorPage />
            <div className="max-w-4xl mx-auto px-6 mt-8">
              <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-xl text-center space-y-4">
                <h3 className="text-lg font-extrabold text-[#12152a]">
                  Need a Customized, Official LIC Quote?
                </h3>
                <p className="text-gray-500 text-xs max-w-lg mx-auto leading-relaxed font-medium">
                  Tabular rates are illustrative. Get a personalized, official quotation directly from Ajay Kumar Poddar (MDRT Member) based on your health history.
                </p>
                <div className="pt-2">
                  <a
                    href={`https://wa.me/91${ADVISOR_PHONE}?text=${encodeURIComponent(
                      `Hello Ajay sir, I calculated my LIC premium on your landing page and would like to get a customized expert quote.` +
                      (utm_source ? ` (Source: ${utm_source}, Campaign: ${utm_campaign})` : '')
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs px-8 py-4 rounded-xl shadow-lg shadow-emerald-500/20 transition-all hover:scale-105 active:scale-95 cursor-pointer font-sans"
                  >
                    <MessageCircle size={16} className="fill-current text-white" />
                    Get expert quote on WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </div>
        ) : campaign === 'health-check' ? (
          <div className="pb-12">
            <PolicyHealthCalculatorPage />
            <div className="max-w-4xl mx-auto px-6 mt-8">
              <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-xl text-center space-y-4">
                <h3 className="text-lg font-extrabold text-[#12152a]">
                  Want Ajay sir to Review Your Gaps?
                </h3>
                <p className="text-gray-500 text-xs max-w-lg mx-auto leading-relaxed font-medium">
                  Get a free, detailed, professional policy health review to identify coverage gaps and optimize your insurance premiums.
                </p>
                <div className="pt-2">
                  <a
                    href={`https://wa.me/91${ADVISOR_PHONE}?text=${encodeURIComponent(
                      `Hello Ajay sir, I checked my Policy Health Score on your landing page and would like a professional review of my gaps.` +
                      (utm_source ? ` (Source: ${utm_source}, Campaign: ${utm_campaign})` : '')
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs px-8 py-4 rounded-xl shadow-lg shadow-emerald-500/20 transition-all hover:scale-105 active:scale-95 cursor-pointer font-sans"
                  >
                    <MessageCircle size={16} className="fill-current text-white" />
                    Consult on WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="py-24 text-center px-6">
            <h1 className="text-xl font-bold text-navy">Campaign Page Not Found</h1>
            <p className="text-gray-500 text-xs mt-2">Please verify the URL or return to home.</p>
            <Link
              href="/"
              className="inline-block bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs px-5 py-2.5 rounded-xl mt-6 transition-all"
            >
              Return Home
            </Link>
          </div>
        )}
      </main>

      {/* Persistent WhatsApp Floating Button */}
      <a
        href={`https://wa.me/91${ADVISOR_PHONE}?text=${encodeURIComponent(
          `Hello Ajay sir, I checked your ${campaign === 'calculator' ? 'Premium Calculator' : 'Policy Health Score'} on your landing page.` +
          ` I would like to consult with you.` +
          (utm_source ? ` (Source: ${utm_source}, Campaign: ${utm_campaign})` : '')
        )}`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-emerald-500 hover:bg-emerald-600 text-white p-3.5 rounded-full shadow-2xl transition-all hover:scale-105 active:scale-95 animate-wa-pulse"
        title="Consult on WhatsApp"
      >
        <MessageCircle size={24} className="fill-current" />
      </a>
    </div>
  )
}

export default function LandingCampaignPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <LandingCampaignPageContent />
    </Suspense>
  )
}
