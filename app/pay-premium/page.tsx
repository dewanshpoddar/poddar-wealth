'use client'

import { useState } from 'react'
import { useLang } from '@/lib/LangContext'
import { submitLead } from '@/lib/api'
import { trackEvent } from '@/lib/analytics'
import { ADVISOR_PHONE } from '@/lib/constants'
import { Lock, CheckCircle, Shield, ClipboardList } from 'lucide-react'

function StepIcon({ icon }: { icon: string }) {
  if (icon === 'clipboard') return <ClipboardList size={20} className="text-amber-500" />
  if (icon === 'shield')    return <Shield size={20} className="text-amber-500" />
  if (icon === 'check')     return <CheckCircle size={20} className="text-green-500" />
  return null
}

export default function PayPremiumPage() {
  const { lang } = useLang()

  const [form, setForm] = useState({
    name: '',
    mobile: '',
    policyNo: '',
    amount: '',
  })
  const [status, setStatus] = useState<'idle' | 'submitting' | 'done' | 'error'>('idle')
  const [mobileError, setMobileError] = useState('')

  const isHi = lang === 'hi'

  function handleChange(field: keyof typeof form, val: string) {
    if (field === 'mobile') {
      const digits = val.replace(/\D/g, '').slice(0, 10)
      setForm(p => ({ ...p, mobile: digits }))
      setMobileError(digits && digits.length !== 10 ? (isHi ? '10 अंकों का मोबाइल नंबर दर्ज करें' : 'Enter a valid 10-digit mobile number') : '')
    } else {
      setForm(p => ({ ...p, [field]: val }))
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (form.mobile.length !== 10) {
      setMobileError(isHi ? '10 अंकों का मोबाइल नंबर दर्ज करें' : 'Enter a valid 10-digit mobile number')
      return
    }
    setStatus('submitting')
    try {
      await submitLead({
        name: form.name,
        mobile: form.mobile,
        intent: 'pay-premium',
        message: `Policy No: ${form.policyNo} | Amount: ₹${form.amount}`,
      })
      trackEvent('pay_premium_clicked')
      setStatus('done')
      setTimeout(() => {
        window.open('https://customer.licindia.in/', '_blank', 'noopener,noreferrer')
      }, 1200)
    } catch {
      setStatus('error')
    }
  }

  return (
    <div className="min-h-screen bg-white pt-20">
      {/* Hero */}
      <section className="bg-navy py-14 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-2 text-xs font-bold uppercase tracking-widest text-white/60 mb-5">
            <Lock size={16} className="inline mr-1" />{isHi ? 'सुरक्षित भुगतान' : 'Secure Payment'}
          </div>
          <h1 className="font-display font-bold text-3xl md:text-4xl text-white mb-3 leading-tight">
            {isHi ? 'LIC प्रीमियम ऑनलाइन भरें' : 'Pay Your LIC Premium Online'}
            <span className="block text-gold text-2xl md:text-3xl mt-1">
              {isHi ? 'त्वरित और सुरक्षित' : 'Quick & Secure'}
            </span>
          </h1>
          <p className="text-white/55 text-sm leading-relaxed max-w-lg mx-auto">
            {isHi
              ? 'अपनी जानकारी दर्ज करें। हम आपकी पॉलिसी ट्रैक करेंगे, फिर आपको LIC पोर्टल पर रीडायरेक्ट करेंगे।'
              : 'Enter your details below. We\'ll log your payment intent, then redirect you to the official LIC payment portal.'}
          </p>
        </div>
      </section>

      {/* How to Pay Guide */}
      <section className="py-10 px-6 bg-slate-50 border-b border-slate-100">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-display font-bold text-2xl text-navy mb-2 text-center">
            {isHi ? 'LIC प्रीमियम ऑनलाइन कैसे भरें — स्टेप बाय स्टेप' : 'How to Pay LIC Premium Online — Step by Step'}
          </h2>
          <p className="text-gray-500 text-sm text-center mb-8">
            {isHi ? 'इन 5 आसान स्टेप्स का पालन करें और भुगतान पूरा करें' : 'Follow these 5 simple steps to complete your payment'}
          </p>

          <div className="space-y-4">
            {[
              {
                step: '1',
                textEn: 'Go to licindia.in → Click "Online Premium Payment"',
                textHi: 'licindia.in पर जाएं → "Online Premium Payment" पर क्लिक करें',
              },
              {
                step: '2',
                textEn: 'Enter your Policy Number',
                textHi: 'अपनी पॉलिसी संख्या (Policy Number) दर्ज करें',
              },
              {
                step: '3',
                textEn: 'Enter Date of Birth',
                textHi: 'अपनी जन्म तिथि (Date of Birth) दर्ज करें',
              },
              {
                step: '4',
                textEn: 'Select premium amount and payment method',
                textHi: 'प्रीमियम राशि और भुगतान का तरीका चुनें',
              },
              {
                step: '5',
                textEn: 'Pay via UPI, Net Banking, or Card',
                textHi: 'UPI, नेट बैंकिंग, या कार्ड के माध्यम से भुगतान करें',
              },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4 bg-white border border-gray-100 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-8 h-8 rounded-full bg-gold/10 text-gold flex items-center justify-center text-sm font-extrabold flex-shrink-0">
                  {item.step}
                </div>
                <p className="font-semibold text-sm text-slate-700 leading-relaxed">
                  {isHi ? item.textHi : item.textEn}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center bg-navy/5 border border-navy/10 rounded-2xl p-6">
            <p className="text-sm text-slate-600 mb-4">
              {isHi ? 'आधिकारिक भुगतान गेटवे पर सीधे जाएं:' : 'Go directly to the official LIC payment gateway:'}
            </p>
            <a
              href="https://customer.onlineportal.licindia.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-navy hover:bg-slate-800 text-white font-semibold px-6 py-3 rounded-xl transition-colors text-sm"
            >
              {isHi ? 'LIC ग्राहक पोर्टल खोलें' : 'Open LIC Customer Portal'} →
            </a>
          </div>

          {/* Having trouble support banner */}
          <div className="mt-6 bg-amber-50 border border-amber-100 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <div>
              <p className="font-bold text-amber-900 text-sm">
                {isHi ? 'भुगतान करने में समस्या आ रही है?' : 'Having trouble paying?'}
              </p>
              <p className="text-amber-800 text-xs mt-1">
                {isHi ? 'अजय सर से सीधे संपर्क करें और तुरंत सहायता प्राप्त करें।' : 'Ajay sir can help you complete the payment immediately.'}
              </p>
            </div>
            <a
              href={`tel:${ADVISOR_PHONE}`}
              className="bg-amber-500 hover:bg-amber-600 text-white font-bold px-4 py-2 rounded-lg text-xs transition-colors whitespace-nowrap"
            >
              {isHi ? 'कॉल करें: ' : 'Call Ajay sir: '} +91 {ADVISOR_PHONE}
            </a>
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="py-12 px-6">

        <div className="max-w-md mx-auto">
          {status === 'done' ? (
            <div className="text-center py-10">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"><CheckCircle size={32} className="text-green-500" /></div>
              <h2 className="font-display font-bold text-xl text-navy mb-2">
                {isHi ? 'रीडायरेक्ट हो रहे हैं...' : 'Redirecting to LIC portal...'}
              </h2>
              <p className="text-gray-500 text-sm">
                {isHi ? 'LIC के आधिकारिक पोर्टल पर जा रहे हैं।' : 'Taking you to the official LIC customer portal.'}
              </p>
            </div>
          ) : (
            <>
              {/* Trust strip */}
              <div className="bg-gold/5 border border-gold/20 rounded-2xl p-4 mb-6 flex items-start gap-3">
                <Shield size={20} className="text-amber-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-bold text-navy text-sm">
                    {isHi ? 'आपकी जानकारी क्यों?' : 'Why do we ask for your details?'}
                  </p>
                  <p className="text-gray-500 text-xs leading-relaxed mt-1">
                    {isHi
                      ? 'हम आपकी प्रीमियम देय तारीखों को ट्रैक करते हैं और आपको समय से पहले याद दिलाते हैं। कभी पॉलिसी लैप्स न हो।'
                      : 'We track your premium due dates and send reminders so your policy never lapses. Your details are kept private.'}
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                <div>
                  <label htmlFor="pp-name" className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                    {isHi ? 'पूरा नाम *' : 'Full Name *'}
                  </label>
                  <input
                    id="pp-name"
                    required
                    type="text"
                    value={form.name}
                    onChange={e => handleChange('name', e.target.value)}
                    placeholder={isHi ? 'आपका नाम' : 'Your full name'}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-navy/50 transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="pp-mobile" className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                    {isHi ? 'मोबाइल नंबर *' : 'Mobile Number *'}
                  </label>
                  <input
                    id="pp-mobile"
                    required
                    type="tel"
                    inputMode="numeric"
                    maxLength={10}
                    value={form.mobile}
                    onChange={e => handleChange('mobile', e.target.value)}
                    placeholder="10-digit mobile"
                    className={`w-full px-4 py-3 border rounded-xl text-sm focus:outline-none transition-colors ${mobileError ? 'border-red-400 focus:border-red-400' : 'border-gray-200 focus:border-navy/50'}`}
                  />
                  {mobileError && <p className="text-red-500 text-xs mt-1">{mobileError}</p>}
                </div>

                <div>
                  <label htmlFor="pp-policy" className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                    {isHi ? 'पॉलिसी नंबर' : 'Policy Number'}
                  </label>
                  <input
                    id="pp-policy"
                    type="text"
                    value={form.policyNo}
                    onChange={e => handleChange('policyNo', e.target.value)}
                    placeholder={isHi ? 'जैसे 123456789' : 'e.g. 123456789'}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-navy/50 transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="pp-amount" className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                    {isHi ? 'प्रीमियम राशि (₹)' : 'Premium Amount (₹)'}
                  </label>
                  <input
                    id="pp-amount"
                    type="number"
                    min="0"
                    value={form.amount}
                    onChange={e => handleChange('amount', e.target.value)}
                    placeholder={isHi ? 'जैसे 15000' : 'e.g. 15000'}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-navy/50 transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="w-full bg-gold hover:bg-amber-600 text-white font-bold py-4 rounded-xl text-sm transition-colors disabled:opacity-70 flex items-center justify-center gap-2 mt-2"
                >
                  {status === 'submitting' ? (
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      {isHi ? 'LIC पोर्टल पर जाएं' : 'Continue to LIC Portal'} →
                    </>
                  )}
                </button>

                {status === 'error' && (
                  <p className="text-red-500 text-xs text-center">
                    {isHi ? 'कुछ गलत हुआ। कृपया पुनः प्रयास करें।' : `Something went wrong. Please try again or call ${ADVISOR_PHONE}.`}
                  </p>
                )}

                <p className="text-[10px] text-gray-500 text-center">
                  {isHi
                    ? 'आपकी जानकारी निजी है और कभी साझा नहीं की जाएगी।'
                    : 'Your details are private and never shared.'}
                </p>
              </form>

              {/* Direct link fallback */}
              <p className="text-center text-xs text-gray-500 mt-4">
                {isHi ? 'सीधे LIC पोर्टल पर जाना चाहते हैं? ' : 'Skip and go directly? '}
                <a
                  href="https://customer.licindia.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-navy font-semibold hover:text-gold transition-colors"
                >
                  {isHi ? 'customer.licindia.in →' : 'customer.licindia.in →'}
                </a>
              </p>
            </>
          )}
        </div>
      </section>
    </div>
  )
}
