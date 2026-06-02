'use client'
import { useState } from 'react'
import { useLang } from '@/lib/LangContext'
import { Calendar, ShieldCheck, Clock, CheckCircle2, Loader2, ArrowLeft, BellRing } from 'lucide-react'
import Link from 'next/link'
import { ADVISOR_PHONE } from '@/lib/constants'

export default function PremiumReminderPage() {
  const { t, lang } = useLang()
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    policyNumber: '',
    dueDate: '',
    amount: '',
  })
  
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [validationError, setValidationError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    if (name === 'phone') {
      const val = value.replace(/\D/g, '').slice(0, 10)
      setFormData(prev => ({ ...prev, [name]: val }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setValidationError('')
    
    if (formData.phone.length !== 10) {
      setValidationError(lang === 'hi' ? 'कृपया एक वैध 10-अंकीय मोबाइल नंबर दर्ज करें' : 'Please enter a valid 10-digit mobile number')
      return
    }

    setStatus('submitting')
    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          mobile: formData.phone,
          intent: 'premium-reminder',
          message: `LIC Policy Number: ${formData.policyNumber}\nPremium Due Date: ${formData.dueDate}\nPremium Amount: ${formData.amount || 'Not Specified'}`
        }),
      })

      if (!response.ok) throw new Error('Submission failed')
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="pt-32 pb-24 px-6 bg-slate-50 min-h-screen flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-[32px] p-8 md:p-10 border border-slate-100 shadow-2xl text-center animate-in fade-in zoom-in duration-300 relative overflow-hidden">
          {/* Confetti-like gold circles */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-gold/5 rounded-full blur-xl pointer-events-none" />
          <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-green-500/5 rounded-full blur-2xl pointer-events-none" />
          
          <div className="w-20 h-20 bg-green-50 text-green-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner">
            <CheckCircle2 size={40} />
          </div>
          
          <h2 className="font-display font-bold text-2xl text-navy mb-4">
            {lang === 'hi' ? 'रिमाइंडर सफलतापूर्वक सेट किया गया! 🎉' : 'Reminder Set Successfully! 🎉'}
          </h2>
          <p className="text-[14px] text-slate-500 leading-relaxed mb-8">
            {t.premiumReminder.thankYou}
          </p>
          
          <div className="flex flex-col gap-3">
            <Link 
              href="/"
              className="inline-flex items-center justify-center gap-2 bg-navy text-white font-bold h-12 rounded-xl hover:bg-navy/90 transition-all text-[13px] uppercase tracking-wider"
            >
              <ArrowLeft size={14} /> {lang === 'hi' ? 'मुख्य पृष्ठ पर जाएं' : 'Back to Home'}
            </Link>
            <button
              onClick={() => {
                setFormData({ name: '', phone: '', policyNumber: '', dueDate: '', amount: '' })
                setStatus('idle')
              }}
              className="text-xs text-slate-400 hover:text-navy hover:underline transition-colors py-2"
            >
              {lang === 'hi' ? 'दूसरा रिमाइंडर सेट करें' : 'Set another reminder'}
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-28 pb-20 px-6 bg-slate-50 min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-0 right-0 w-1/3 h-1/2 bg-[radial-gradient(circle_at_70%_20%,rgba(201,168,76,0.06)_0%,transparent_60%)] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-1/3 h-1/2 bg-[radial-gradient(circle_at_20%_80%,rgba(4,12,28,0.04)_0%,transparent_60%)] pointer-events-none" />

      <div className="max-w-[1000px] w-full grid lg:grid-cols-[1.1fr_1fr] gap-12 items-center relative z-10">
        {/* Left Column: Visual copy & benefits */}
        <div className="text-center lg:text-left">
          <div className="inline-flex items-center gap-2 bg-navy/5 border border-navy/10 rounded-full px-4 py-1.5 text-[11px] font-bold tracking-widest text-navy/70 uppercase mb-6">
            🔔 {lang === 'hi' ? 'निःशुल्क व्हाट्सएप सेवा' : 'Free WhatsApp Service'}
          </div>
          
          <h1 className="font-display font-bold text-36 md:text-48 text-navy leading-tight mb-5">
            {t.premiumReminder.title}
          </h1>
          <p className="text-slate-500 text-[15px] md:text-[16px] leading-relaxed mb-8 max-w-xl mx-auto lg:mx-0">
            {t.premiumReminder.subtitle}
          </p>

          <div className="space-y-4 max-w-md mx-auto lg:mx-0">
            {[
              { icon: <Clock className="text-gold" size={18} />, title: lang === 'hi' ? 'समय पर अलर्ट' : '7 Days Notice', desc: lang === 'hi' ? 'प्रीमियम देय होने से ठीक 7 दिन पहले आपको व्हाट्सएप पर रिमाइंडर मिलेगा।' : 'Get a gentle ping on WhatsApp exactly 7 days before your premium due date.' },
              { icon: <ShieldCheck className="text-green-500" size={18} />, title: lang === 'hi' ? '100% सुरक्षित और गोपनीय' : '100% Secure & Free', desc: lang === 'hi' ? 'आपकी पॉलिसी विवरण पूरी तरह गोपनीय हैं और कभी किसी के साथ साझा नहीं किए जाएंगे।' : 'Zero fees, zero spam. Your policy details are completely private and encrypted.' },
            ].map((item, idx) => (
              <div key={idx} className="flex gap-4 items-start text-left bg-white border border-slate-100/50 p-4.5 rounded-2xl shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0">
                  {item.icon}
                </div>
                <div>
                  <h4 className="font-display font-bold text-sm text-navy">{item.title}</h4>
                  <p className="text-slate-400 text-xs mt-0.5 leading-normal">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Form Container */}
        <div className="bg-white rounded-[32px] border border-slate-100 shadow-2xl p-8 md:p-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gold/5 rounded-full blur-xl pointer-events-none" />
          
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center mx-auto mb-4">
              <BellRing size={22} />
            </div>
            <h2 className="font-display font-bold text-xl text-navy mb-1.5">
              {lang === 'hi' ? 'रिमाइंडर सेट करें' : 'Set Your Free Reminder'}
            </h2>
            <p className="text-xs text-slate-400">
              {t.premiumReminder.privacy}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1 text-left">
              <label htmlFor="name" className="text-[11px] font-bold text-navy/70 uppercase tracking-wider block mb-1">
                {t.premiumReminder.name} <span className="text-red-500">*</span>
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder={lang === 'hi' ? 'आपका पूरा नाम' : 'Your full name'}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 text-13 bg-white transition-all duration-200"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1 text-left">
                <label htmlFor="phone" className="text-[11px] font-bold text-navy/70 uppercase tracking-wider block mb-1">
                  {t.premiumReminder.phone} <span className="text-red-500">*</span>
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder={lang === 'hi' ? '10-अंकीय नंबर' : '10-digit number'}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 text-13 bg-white transition-all duration-200"
                />
              </div>

              <div className="space-y-1 text-left">
                <label htmlFor="policyNumber" className="text-[11px] font-bold text-navy/70 uppercase tracking-wider block mb-1">
                  {t.premiumReminder.policyNumber} <span className="text-red-500">*</span>
                </label>
                <input
                  id="policyNumber"
                  name="policyNumber"
                  type="text"
                  required
                  value={formData.policyNumber}
                  onChange={handleChange}
                  placeholder="e.g. 123456789"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 text-13 bg-white transition-all duration-200"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1 text-left">
                <label htmlFor="dueDate" className="text-[11px] font-bold text-navy/70 uppercase tracking-wider block mb-1">
                  {t.premiumReminder.dueDate} <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    id="dueDate"
                    name="dueDate"
                    type="date"
                    required
                    value={formData.dueDate}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 text-13 bg-white transition-all duration-200"
                  />
                </div>
              </div>

              <div className="space-y-1 text-left">
                <label htmlFor="amount" className="text-[11px] font-bold text-navy/70 uppercase tracking-wider block mb-1">
                  {t.premiumReminder.amount}
                </label>
                <input
                  id="amount"
                  name="amount"
                  type="number"
                  value={formData.amount}
                  onChange={handleChange}
                  placeholder="e.g. ₹5,000"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 text-13 bg-white transition-all duration-200"
                />
              </div>
            </div>

            {validationError && (
              <p role="alert" className="text-red-500 text-xs font-semibold text-center mt-2">
                {validationError}
              </p>
            )}

            <button
              type="submit"
              disabled={status === 'submitting'}
              className="w-full bg-amber-500 hover:bg-amber-600 disabled:bg-amber-400 text-white font-bold py-3.5 px-6 rounded-xl transition-all duration-200 shadow-md shadow-amber-500/10 hover:shadow-lg hover:shadow-amber-500/25 active:scale-[0.98] text-[13px] tracking-wide uppercase mt-6 flex items-center justify-center gap-2"
            >
              {status === 'submitting' ? (
                <>
                  <Loader2 className="animate-spin" size={16} />
                  {lang === 'hi' ? 'रिमाइंडर सेट किया जा रहा है...' : 'Setting Reminder...'}
                </>
              ) : (
                <>
                  <Calendar size={16} />
                  {t.premiumReminder.submit}
                </>
              )}
            </button>

            {status === 'error' && (
              <p role="alert" className="text-red-500 text-xs text-center mt-2 font-medium">
                {lang === 'hi' ? `कुछ गलत हुआ। कृपया दोबारा प्रयास करें या कॉल करें ${ADVISOR_PHONE}।` : `Something went wrong. Please try again or call ${ADVISOR_PHONE}.`}
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}
