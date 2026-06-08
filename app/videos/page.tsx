'use client'

import { useState } from 'react'
import { useLang } from '@/lib/LangContext'
import { Play, Sparkles, Mail, Clock, Shield, ArrowRight, Video, CheckCircle2, MessageCircle } from 'lucide-react'
import Link from 'next/link'
import { ADVISOR_PHONE } from '@/lib/constants'

interface VideoItem {
  id: string
  title: string
  titleHi: string
  titleBn: string
  duration: string
  category: string
  categoryHi: string
  categoryBn: string
  youtubeId: string
  thumbnail: string
}

// Future videos data schema
const MOCK_VIDEOS: VideoItem[] = []

export default function VideoGalleryPage() {
  const { lang, t } = useLang()
  const isHi = lang === 'hi'
  const isBn = lang === 'bn'

  const v = t.videos || {
    heroTitle: 'Insurance Insights by Ajay Kumar Poddar',
    heroSubtitle: 'Video guides on life insurance, health insurance, and wealth planning',
    comingSoonTitle: 'Videos Coming Soon',
    comingSoonDesc: 'Ajay sir is recording expert insurance videos. Subscribe to get notified when they launch.',
    subscribeBtn: 'Subscribe',
    placeholderName: 'Your Name',
    placeholderEmail: 'Your Email',
    successMessage: 'Subscribed successfully!',
    askPoddarJi: 'Ask Poddar Ji'
  }

  // Subscribe Form State
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  // Handle Video Subscribe
  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setLoading(true)
    try {
      // Post to our leads capture/newsletter webhook
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name || 'Video Subscriber',
          email,
          intent: 'Video Gallery Subscription'
        })
      })
      setSuccess(true)
      setName('')
      setEmail('')
    } catch (err) {
      console.warn('Subscription tracking failed', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-slate-50 min-h-screen">
      
      {/* HERO BANNER (bg-gray-950) */}
      <section className="bg-gray-950 text-white py-16 md:py-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="max-w-5xl mx-auto px-6 text-center relative z-10 space-y-4">
          <span className="inline-flex items-center gap-1.5 bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] sm:text-xs font-black px-3.5 py-1.5 rounded-full uppercase tracking-widest">
            <Video size={12} className="animate-pulse" />
            {isHi ? 'वीडियो लाइब्रेरी' : isBn ? 'ভিডিও লাইব্রেরি' : 'Video Resource'}
          </span>
          <h1 className="text-3xl sm:text-5xl font-display font-black leading-tight tracking-tight text-white max-w-3xl mx-auto">
            {v.heroTitle}
          </h1>
          <p className="text-gray-400 text-xs sm:text-sm font-medium max-w-xl mx-auto leading-relaxed">
            {v.heroSubtitle}
          </p>
        </div>
      </section>

      {/* GALLERY OR COMING SOON GRID */}
      <section className="bg-white py-16 md:py-24 border-y border-slate-100">
        <div className="max-w-4xl mx-auto px-6">
          
          {MOCK_VIDEOS.length > 0 ? (
            /* Future Grid View */
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {MOCK_VIDEOS.map((item) => {
                const titleText = isHi ? item.titleHi : isBn ? item.titleBn : item.title
                const catText = isHi ? item.categoryHi : isBn ? item.categoryBn : item.category
                return (
                  <div key={item.id} className="bg-slate-50 border border-slate-100 rounded-2xl overflow-hidden hover:shadow-md transition-all group">
                    <div className="relative aspect-video bg-gray-900 flex items-center justify-center cursor-pointer">
                      <Play className="w-8 h-8 text-white/80 group-hover:scale-110 transition-transform" />
                    </div>
                    <div className="p-4 space-y-2">
                      <span className="text-[9px] font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-2 py-0.5 rounded">
                        {catText}
                      </span>
                      <h3 className="text-xs font-extrabold text-navy leading-snug truncate">
                        {titleText}
                      </h3>
                      <div className="flex items-center gap-1 text-[9px] font-bold text-gray-400">
                        <Clock size={10} />
                        {item.duration}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            /* coming soon state */
            <div className="text-center max-w-lg mx-auto space-y-8 py-10">
              <div className="w-16 h-16 bg-amber-500/10 border border-amber-500/20 text-amber-500 rounded-full flex items-center justify-center mx-auto animate-bounce">
                <Play className="fill-current" size={24} />
              </div>

              <div className="space-y-3">
                <h2 className="text-xl sm:text-2xl font-black text-navy leading-tight">
                  {v.comingSoonTitle}
                </h2>
                <p className="text-slate-500 text-xs sm:text-sm leading-relaxed font-medium">
                  {v.comingSoonDesc}
                </p>
              </div>

              {/* Newsletter Subscription Inline Form */}
              <div className="bg-slate-50 border border-slate-200/50 rounded-3xl p-6 shadow-sm">
                {!success ? (
                  <form onSubmit={handleSubscribe} className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder={v.placeholderName}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="bg-white border border-slate-200/80 focus:border-amber-500 rounded-xl px-4 h-11 text-xs outline-none font-semibold text-slate-800"
                      />
                      <input
                        type="email"
                        required
                        placeholder={v.placeholderEmail}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="bg-white border border-slate-200/80 focus:border-amber-500 rounded-xl px-4 h-11 text-xs outline-none font-semibold text-slate-800"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-navy hover:bg-navy/90 text-white font-bold text-xs h-11 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      {loading ? (
                        <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <Mail size={12} />
                          {v.subscribeBtn}
                        </>
                      )}
                    </button>
                  </form>
                ) : (
                  <div className="text-center py-2 space-y-3 animate-fade-in">
                    <div className="w-8 h-8 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto">
                      <CheckCircle2 size={16} />
                    </div>
                    <p className="text-xs font-bold text-emerald-800">
                      {v.successMessage}
                    </p>
                  </div>
                )}
              </div>

            </div>
          )}

        </div>
      </section>

      {/* DYNAMIC CALL TO ACTION */}
      <section className="bg-slate-50 py-16 text-center">
        <div className="max-w-2xl mx-auto px-6 space-y-6">
          <h2 className="text-lg sm:text-xl font-black text-navy leading-tight">
            {isHi ? 'क्या आपके पास कोई प्रश्न है?' : isBn ? 'আপনার কি কোনো প্রশ্ন আছে?' : 'Have a Question?'}
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm max-w-sm mx-auto font-medium leading-relaxed">
            {isHi 
              ? 'अजय जी से सीधा परामर्श लें या पोद्दार जी (हमारे AI सलाहकार) से पूछें।' 
              : isBn 
                ? 'সরাসরি অজয় স্যারের সাথে কথা বলুন বা আমাদের এআই উপদেষ্টা পোদ্দার জিকে জিজ্ঞাসা করুন।'
                : 'Consult directly with Ajay Kumar Poddar or chat with our AI Advisor.'}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <Link
              href="/ai-advisor"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs px-6 py-3 rounded-xl transition-all shadow-sm"
            >
              <Sparkles size={14} className="animate-pulse" />
              {v.askPoddarJi}
            </Link>
            <a
              href={`https://wa.me/91${ADVISOR_PHONE}?text=${encodeURIComponent(
                isHi 
                  ? 'नमस्ते अजय जी, मुझे बीमा योजनाओं के बारे में सलाह चाहिए।' 
                  : isBn 
                    ? 'নমস্কার অজয় স্যার, আমার বীমা পরিকল্পনা সম্পর্কে কিছু পরামর্শ প্রয়োজন।'
                    : 'Hello Ajay sir, I have a question regarding life/health insurance plans.'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-100 text-slate-800 font-bold text-xs px-6 py-3 rounded-xl border border-slate-200 transition-all font-sans"
            >
              <MessageCircle size={14} className="fill-current text-slate-500" />
              {isHi ? 'व्हाट्सएप करें' : isBn ? 'হোয়াটসঅ্যাপ করুন' : 'WhatsApp Ajay Sir'}
            </a>
          </div>
        </div>
      </section>

    </div>
  )
}
