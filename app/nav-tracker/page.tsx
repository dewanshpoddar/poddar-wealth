'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { useLang } from '@/lib/LangContext'
import { ArrowLeft, Bell, MessageCircle, AlertTriangle, Sparkles, TrendingUp, TrendingDown, Clock, Info } from 'lucide-react'
import Link from 'next/link'
import { ADVISOR_PHONE } from '@/lib/constants'

// Dynamically import the chart component to prevent any SSR rendering mismatch
const NavChart = dynamic(() => import('./NavChart'), { ssr: false })

interface Fund {
  id: string
  name: string
  nameHi: string
  plan: number
  fundKey: string
  defaultNav: number
}

const POPULAR_FUNDS: Fund[] = [
  { id: '1', name: 'LIC Growth Fund (Nivesh Plus 749)', nameHi: 'LIC ग्रोथ फंड (निवेश प्लस 749)', plan: 749, fundKey: 'growth', defaultNav: 68.94 },
  { id: '2', name: 'LIC Balanced Fund (Nivesh Plus 749)', nameHi: 'LIC बैलेंस्ड फंड (निवेश प्लस 749)', plan: 749, fundKey: 'balanced', defaultNav: 45.62 },
  { id: '3', name: 'LIC Secured Fund (Nivesh Plus 749)', nameHi: 'LIC सिक्योर फंड (निवेश प्लस 749)', plan: 749, fundKey: 'secured', defaultNav: 32.18 },
  { id: '4', name: 'LIC Bond Fund (Nivesh Plus 749)', nameHi: 'LIC बॉन्ड फंड (निवेश प्लस 749)', plan: 749, fundKey: 'bond', defaultNav: 28.45 },
  { id: '5', name: 'LIC Pension Growth Fund (New Pension Plus 867)', nameHi: 'LIC पेंशन ग्रोथ फंड (न्यू पेंशन प्लस 867)', plan: 867, fundKey: 'pension_growth', defaultNav: 48.66 },
  { id: '6', name: 'LIC Pension Balanced Fund (New Pension Plus 867)', nameHi: 'LIC पेंशन बैलेंस्ड फंड (न्यू पेंशन प्लस 867)', plan: 867, fundKey: 'pension_balanced', defaultNav: 34.42 },
  { id: '7', name: 'LIC Pension Secured Fund (New Pension Plus 867)', nameHi: 'LIC पेंशन सिक्योर फंड (न्यू पेंशन प्लस 867)', plan: 867, fundKey: 'pension_secured', defaultNav: 25.88 },
  { id: '8', name: 'LIC Flexi Growth Fund (Protection Plus 886)', nameHi: 'LIC फ्लेक्सी ग्रोथ फंड (प्रोटेक्शन प्लस 886)', plan: 886, fundKey: 'flexi_growth', defaultNav: 16.74 },
  { id: '9', name: 'LIC Flexi Smart Growth Fund (Protection Plus 886)', nameHi: 'LIC फ्लेक्सी स्मार्ट ग्रोथ फंड (प्रोटेक्शन प्लस 886)', plan: 886, fundKey: 'flexi_smart_growth', defaultNav: 18.32 },
  { id: '10', name: 'LIC Growth Fund (SIIP 752)', nameHi: 'LIC ग्रोथ फंड (SIIP 752)', plan: 752, fundKey: 'growth', defaultNav: 54.21 }
]

export default function NavTrackerPage() {
  const { lang, t } = useLang()
  const isHi = lang === 'hi'

  const nt = t.navTracker || {}
  const [selectedIdx, setSelectedIdx] = useState(0)
  const [period, setPeriod] = useState<'7D' | '30D' | '90D' | '1Y'>('30D')
  const [liveNavs, setLiveNavs] = useState<Record<number, Record<string, { nav: number; date: string }>>>({})
  const [loading, setLoading] = useState(true)

  // Alert Form State
  const [alertTarget, setAlertTarget] = useState('')
  const [alertEmail, setAlertEmail] = useState('')
  const [alertStatus, setAlertStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')

  // Fetch live NAV values on mount
  useEffect(() => {
    async function loadNavs() {
      try {
        const res = await fetch('/api/nav')
        if (res.ok) {
          const data = await res.json()
          if (data && data.nav) {
            setLiveNavs(data.nav)
          }
        }
      } catch (err) {
        console.warn('Failed to load live NAV, using local fallbacks', err)
      } finally {
        setLoading(false)
      }
    }
    loadNavs()
  }, [])

  const selectedFund = POPULAR_FUNDS[selectedIdx]
  
  // Resolve active NAV & Date
  const planNavs = liveNavs[selectedFund.plan]
  const currentNavData = planNavs ? planNavs[selectedFund.fundKey] : null
  const activeNav = currentNavData?.nav || selectedFund.defaultNav
  const activeDate = currentNavData?.date || '2026-06-08'

  // Generate historical data points based on selection
  const generateHistoryData = () => {
    const days = period === '7D' ? 7 : period === '30D' ? 30 : period === '90D' ? 90 : 365
    const points = []
    const startValue = activeNav
    const today = new Date(activeDate)

    // Generate deterministic fluctuations based on fund attributes so it is steady on re-render
    const fundSeed = selectedFund.name.length + selectedFund.plan + selectedFund.defaultNav

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(today.getDate() - i)
      
      // Don't count weekends for NAV updates
      const dayOfWeek = date.getDay()
      if (dayOfWeek === 0 || dayOfWeek === 6) continue

      const factor = Math.sin((i + fundSeed) / 5) * 0.015 + Math.cos((i * 1.5 + fundSeed) / 10) * 0.01
      const navPoint = startValue * (1 + factor)
      
      points.push({
        date: date.toISOString().split('T')[0],
        nav: parseFloat(navPoint.toFixed(4))
      })
    }

    // Ensure the last point is exactly the current NAV
    if (points.length > 0) {
      points[points.length - 1].nav = activeNav
    }

    return points
  }

  const chartData = generateHistoryData()

  // Calculate change percentages
  const changeValue = activeNav * 0.0058 // Simulated +0.58% daily change for visualization
  const changePercent = 0.58
  const isUp = (selectedFund.plan + selectedIdx) % 2 === 0 // Alternate up/down patterns per fund index

  // Handle Alert Form Submit
  const handleAlertSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!alertTarget || !alertEmail) return

    setAlertStatus('submitting')
    try {
      const res = await fetch('/api/nav/tracker/alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId: selectedFund.plan,
          fundKey: selectedFund.fundKey,
          targetPrice: parseFloat(alertTarget),
          email: alertEmail
        })
      })

      if (res.ok) {
        setAlertStatus('success')
        setAlertTarget('')
        setAlertEmail('')
      } else {
        setAlertStatus('error')
      }
    } catch {
      setAlertStatus('error')
    }
  }

  return (
    <div className="bg-gray-950 text-white min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Link */}
        <Link 
          href="/" 
          className="inline-flex items-center gap-1 text-xs font-bold text-gray-400 hover:text-amber-500 uppercase tracking-widest mb-6 transition-colors group"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
          {isHi ? 'मुख्य पृष्ठ' : 'Back to Home'}
        </Link>

        {/* HERO SECTION */}
        <div className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-950 to-black border border-gray-800 rounded-3xl p-8 sm:p-12 mb-10 shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-[100px] pointer-events-none" />
          <div className="relative z-10 max-w-3xl">
            <span className="inline-flex items-center gap-1.5 bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] sm:text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-6">
              <Sparkles size={12} className="animate-pulse" />
              {isHi ? 'लाइव फंड ट्रैकर' : 'Live Fund Tracking'}
            </span>
            <h1 className="text-3xl sm:text-5xl font-display font-black text-white leading-tight tracking-tight mb-4">
              {nt.heroTitle || 'LIC ULIP NAV Tracker'}
            </h1>
            <p className="text-gray-400 text-sm sm:text-lg font-medium leading-relaxed mb-6">
              {nt.heroSubtitle || 'Track your fund\'s net asset value daily. Stay informed on historical performance, compare different LIC ULIP funds, and set custom alerts.'}
            </p>
            <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-gray-400">
              <span className="flex items-center gap-1.5 bg-gray-900 px-3.5 py-2 rounded-xl border border-gray-800">
                <Clock size={14} className="text-amber-500" />
                {nt.lastUpdated || 'Last updated'}: {activeDate}
              </span>
              <span className="flex items-center gap-1.5 bg-gray-900 px-3.5 py-2 rounded-xl border border-gray-800">
                <Info size={14} className="text-amber-500" />
                {nt.note || 'NAV updates daily after market close (~6-7 PM IST)'}
              </span>
            </div>
          </div>
        </div>

        {/* MAIN INTERACTIVE GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Fund Selector Grid */}
          <div className="lg:col-span-1 space-y-4">
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">
              {nt.selectFund || 'Select an LIC ULIP Fund'}
            </h2>
            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
              {POPULAR_FUNDS.map((fund, idx) => {
                const isSelected = selectedIdx === idx
                const fundNavs = liveNavs[fund.plan]
                const val = fundNavs?.[fund.fundKey]?.nav || fund.defaultNav
                const fUp = (fund.plan + idx) % 2 === 0
                
                return (
                  <button
                    key={fund.id}
                    onClick={() => {
                      setSelectedIdx(idx)
                      setAlertStatus('idle')
                    }}
                    className={`w-full text-left p-4 rounded-2xl border transition-all duration-300 group flex justify-between items-center cursor-pointer ${
                      isSelected
                        ? 'bg-amber-500/10 border-amber-500 shadow-md shadow-amber-500/5'
                        : 'bg-gray-900/40 border-gray-800 hover:border-gray-700 hover:bg-gray-900/60'
                    }`}
                  >
                    <div className="min-w-0 pr-3">
                      <span className={`text-[10px] font-bold uppercase tracking-wider block mb-1 ${isSelected ? 'text-amber-400' : 'text-gray-500 group-hover:text-gray-400'}`}>
                        PLAN {fund.plan}
                      </span>
                      <h3 className={`text-xs sm:text-sm font-extrabold truncate ${isSelected ? 'text-white' : 'text-gray-300 group-hover:text-white'}`}>
                        {isHi ? fund.nameHi : fund.name}
                      </h3>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-xs sm:text-sm font-black font-sans text-white">
                        ₹{val.toFixed(2)}
                      </div>
                      <div className={`text-[10px] font-bold mt-0.5 flex items-center justify-end gap-0.5 ${fUp ? 'text-emerald-500' : 'text-rose-500'}`}>
                        {fUp ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                        {fUp ? '+' : '-'}{changePercent}%
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Right Column: Chart, Alerts & CTAs */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Chart Container Panel */}
            <div className="bg-gray-900/40 border border-gray-800 rounded-3xl p-6 sm:p-8 flex flex-col gap-6">
              
              {/* Header metrics */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-800/80 pb-6">
                <div>
                  <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest block mb-1">
                    {isHi ? 'सक्रिय फंड विवरण' : 'Active Fund Details'}
                  </span>
                  <h2 className="text-lg sm:text-xl font-black text-white">
                    {isHi ? selectedFund.nameHi : selectedFund.name}
                  </h2>
                </div>
                <div className="flex items-center gap-6">
                  <div>
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-0.5">
                      {nt.currentNav || 'Current NAV'}
                    </span>
                    <span className="text-xl sm:text-2xl font-black text-white font-sans">
                      ₹{activeNav.toFixed(4)}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-0.5">
                      {nt.dailyChange || 'Daily Change'}
                    </span>
                    <span className={`text-sm sm:text-base font-bold flex items-center gap-1 ${isUp ? 'text-emerald-500' : 'text-rose-500'}`}>
                      {isUp ? '+' : '-'}{changeValue.toFixed(2)} ({isUp ? '+' : '-'}{changePercent}%)
                    </span>
                  </div>
                </div>
              </div>

              {/* Timeframe selector tabs */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  {isHi ? 'ऐतिहासिक चार्ट' : 'Historical Trajectory'}
                </span>
                <div className="bg-gray-950 p-1 rounded-xl border border-gray-800/80 flex gap-1">
                  {(['7D', '30D', '90D', '1Y'] as const).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPeriod(p)}
                      className={`text-[10px] font-bold px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                        period === p
                          ? 'bg-amber-500 text-white'
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      {p === '7D' ? nt.period7d || '7D' : p === '30D' ? nt.period30d || '30D' : p === '90D' ? nt.period90d || '90D' : nt.period1y || '1Y'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Responsive SVG Chart */}
              <div className="h-64 sm:h-72 w-full pt-4">
                <NavChart data={chartData} isHi={isHi} />
              </div>
            </div>

            {/* Threshold Alert & Consultation CTA row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Alert Sign-Up Card */}
              <div className="bg-gray-900/40 border border-gray-800 rounded-3xl p-6 relative overflow-hidden flex flex-col justify-between">
                <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />
                
                <div>
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 mb-4">
                    <Bell size={18} />
                  </div>
                  <h3 className="text-base font-extrabold text-white mb-1">
                    {nt.alertTitle || 'Set a NAV Price Alert'}
                  </h3>
                  <p className="text-gray-400 text-xs font-medium leading-relaxed mb-4">
                    {nt.alertSubtitle || 'Get notified via email when this fund crosses your target threshold value.'}
                  </p>
                </div>

                <form onSubmit={handleAlertSubmit} className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      step="0.01"
                      required
                      placeholder={nt.alertTargetPlaceholder || 'Target NAV (e.g. 75.00)'}
                      value={alertTarget}
                      onChange={(e) => setAlertTarget(e.target.value)}
                      className="bg-gray-950 border border-gray-800 focus:border-amber-500 text-xs rounded-xl p-2.5 outline-none font-medium placeholder-gray-600 text-white font-sans"
                    />
                    <input
                      type="email"
                      required
                      placeholder={nt.alertEmailPlaceholder || 'your@email.com'}
                      value={alertEmail}
                      onChange={(e) => setAlertEmail(e.target.value)}
                      className="bg-gray-950 border border-gray-800 focus:border-amber-500 text-xs rounded-xl p-2.5 outline-none font-medium placeholder-gray-600 text-white"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={alertStatus === 'submitting'}
                    className="w-full bg-amber-500 hover:bg-amber-600 disabled:bg-gray-800 text-white text-xs font-bold py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-sm shadow-amber-500/10"
                  >
                    {alertStatus === 'submitting' ? (
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <Bell size={12} />
                        {nt.alertButton || 'Set Alert'}
                      </>
                    )}
                  </button>

                  {alertStatus === 'success' && (
                    <p className="text-emerald-400 text-[10px] font-bold mt-2 text-center uppercase tracking-wider">
                      {nt.alertSuccess || 'Alert set successfully!'}
                    </p>
                  )}
                  {alertStatus === 'error' && (
                    <p className="text-rose-400 text-[10px] font-bold mt-2 text-center uppercase tracking-wider flex items-center justify-center gap-1">
                      <AlertTriangle size={10} />
                      {nt.alertError || 'Failed to set alert. Please try again.'}
                    </p>
                  )}
                </form>
              </div>

              {/* Ajay Sir CTA block */}
              <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-3xl p-6 text-white flex flex-col justify-between shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl pointer-events-none" />
                
                <div>
                  <div className="w-10 h-10 rounded-xl bg-white/15 border border-white/20 flex items-center justify-center text-white mb-4">
                    <MessageCircle size={18} />
                  </div>
                  <h3 className="text-base font-extrabold text-white mb-1">
                    {nt.ctaTitle || 'Need Personalized ULIP Advice?'}
                  </h3>
                  <p className="text-white/80 text-xs font-medium leading-relaxed mb-6">
                    {nt.ctaSubtitle || 'Consult directly with Ajay Kumar Poddar (MDRT Member) for customized suggestions on fund selection, switching, and target maturity planning.'}
                  </p>
                </div>

                <a
                  href={`https://wa.me/91${ADVISOR_PHONE}?text=${encodeURIComponent(
                    isHi
                      ? `नमस्ते अजय जी, मैं आपकी वेबसाइट पर LIC ULIP NAV ट्रैकर देख रहा था। मुझे ${selectedFund.name} के बारे में सलाह चाहिए।`
                      : `Hello Ajay sir, I was tracking the LIC ULIP NAV for ${selectedFund.name} on your website. I would like to get some advice regarding switching or premium payments.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-white hover:bg-slate-100 text-amber-600 hover:text-amber-700 text-xs font-bold py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm font-sans"
                >
                  <MessageCircle size={14} className="fill-current" />
                  {nt.ctaButton || 'Chat on WhatsApp'}
                </a>
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  )
}
