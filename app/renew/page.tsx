'use client'

import { useState } from 'react'
import { CheckCircle2 } from 'lucide-react'
import { useLang } from '@/lib/LangContext'
import { trackEvent } from '@/lib/analytics'

export default function RenewPage() {
  const { t, lang } = useLang()
  const r = (t as Record<string, any>).renew ?? {}

  const [form, setForm] = useState({
    name: '',
    phone: '',
    policyNo: '',
    renewDate: '',
  })
  const [mobileError, setMobileError] = useState('')
  const [status, setStatus] = useState<'idle' | 'submitting' | 'done' | 'error'>('idle')

  function handlePhone(val: string) {
    const digits = val.replace(/\D/g, '').slice(0, 10)
    setForm(p => ({ ...p, phone: digits }))
    setMobileError(digits && digits.length !== 10
      ? (lang === 'hi' ? '10 अंकों का मोबाइल नंबर दर्ज करें' : 'Enter a valid 10-digit mobile number')
      : '')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (form.phone.length !== 10) {
      setMobileError(lang === 'hi' ? '10 अंकों का मोबाइल नंबर दर्ज करें' : 'Enter a valid 10-digit mobile number')
      return
    }
    setStatus('submitting')
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          mobile: form.phone,
          intent: 'renewal',
          message: `Policy No: ${form.policyNo} | Renewal Date: ${form.renewDate}`,
        }),
      })
      if (!res.ok) throw new Error('Failed')
      trackEvent('renewal_requested')
      setStatus('done')
    } catch {
      setStatus('error')
    }
  }

  const isHi = lang === 'hi'

  return (
    <div className="min-h-screen bg-white pt-20">
      {/* Hero */}
      <section className="bg-navy py-14 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-2 text-xs font-bold uppercase tracking-widest text-white/60 mb-5">
            🔄 {isHi ? 'पॉलिसी रिन्यूअल' : 'Policy Renewal'}
          </div>
          <h1 className="font-display font-bold text-3xl md:text-4xl text-white mb-3 leading-tight">
            {r.hero ?? (isHi ? 'अपनी बीमा पॉलिसी रिन्यू करें' : 'Renew Your Insurance Policy')}
            <span className="block text-gold text-2xl mt-1">
              {isHi ? 'सुरक्षित रहें' : 'Stay Protected'}
            </span>
          </h1>
          <p className="text-white/55 text-sm leading-relaxed max-w-lg mx-auto">
            {r.heroSub ?? (isHi
              ? 'हम आपकी रिन्यूअल तारीखें ट्रैक करेंगे और समय पर याद दिलाएंगे।'
              : 'We track your renewal dates and remind you before they lapse — no policy lapses on our watch.')}
          </p>
        </div>
      </section>

      {/* Form */}
      <section className="py-12 px-6">
        <div className="max-w-md mx-auto">
          {status === 'done' ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="font-display font-bold text-xl text-navy mb-2">
                {r.successTitle ?? (isHi ? 'रिन्यूअल अनुरोध प्राप्त!' : 'Renewal Request Received!')}
              </h2>
              <p className="text-gray-500 text-sm leading-relaxed max-w-xs mx-auto">
                {r.successMsg ?? (isHi
                  ? 'अजय सर आपसे रिन्यूअल देय तारीख से पहले संपर्क करेंगे।'
                  : 'Ajay sir will personally contact you before your renewal due date. Your policy will not lapse.')}
              </p>
              <p className="text-xs text-gold font-semibold mt-4">
                📞 {isHi ? 'जरूरत हो तो कॉल करें:' : 'Need to call now?'} 9415313434
              </p>
            </div>
          ) : (
            <>
              {/* Trust note */}
              <div className="bg-gold/5 border border-gold/20 rounded-2xl p-4 mb-6 flex items-start gap-3">
                <span className="text-xl mt-0.5">🛡️</span>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {r.trustNote ?? (isHi
                    ? 'हम आपकी रिन्यूअल तारीखें ट्रैक करते हैं — हमारे साथ कोई पॉलिसी लैप्स नहीं होती।'
                    : 'We track your renewal dates — no policy lapses on our watch.')}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                {/* Name */}
                <div>
                  <label htmlFor="rn-name" className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                    {r.name ?? (isHi ? 'पूरा नाम' : 'Full Name')} *
                  </label>
                  <input
                    id="rn-name"
                    required
                    type="text"
                    value={form.name}
                    onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                    placeholder={r.namePlaceholder ?? (isHi ? 'राम शर्मा' : 'Ramesh Sharma')}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-navy/50 transition-colors"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label htmlFor="rn-phone" className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                    {r.phone ?? (isHi ? 'मोबाइल नंबर' : 'Mobile Number')} *
                  </label>
                  <input
                    id="rn-phone"
                    required
                    type="tel"
                    inputMode="numeric"
                    maxLength={10}
                    value={form.phone}
                    onChange={e => handlePhone(e.target.value)}
                    placeholder={isHi ? '10 अंकों का नंबर' : '10-digit mobile'}
                    className={`w-full px-4 py-3 border rounded-xl text-sm focus:outline-none transition-colors ${mobileError ? 'border-red-400' : 'border-gray-200 focus:border-navy/50'}`}
                  />
                  {mobileError && <p className="text-red-500 text-xs mt-1">{mobileError}</p>}
                </div>

                {/* Policy Number */}
                <div>
                  <label htmlFor="rn-policy" className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                    {r.policyNo ?? (isHi ? 'पॉलिसी नंबर' : 'Policy Number')}
                  </label>
                  <input
                    id="rn-policy"
                    type="text"
                    value={form.policyNo}
                    onChange={e => setForm(p => ({ ...p, policyNo: e.target.value }))}
                    placeholder={r.policyPlaceholder ?? (isHi ? 'जैसे 123456789' : 'e.g. 123456789')}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-navy/50 transition-colors"
                  />
                </div>

                {/* Renewal Date */}
                <div>
                  <label htmlFor="rn-date" className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                    {r.renewDate ?? (isHi ? 'रिन्यूअल देय तारीख' : 'Renewal Due Date')}
                  </label>
                  <input
                    id="rn-date"
                    type="date"
                    value={form.renewDate}
                    onChange={e => setForm(p => ({ ...p, renewDate: e.target.value }))}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-navy/50 transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="w-full bg-navy hover:bg-navy/90 text-white font-bold py-4 rounded-xl text-sm transition-colors disabled:opacity-70 flex items-center justify-center gap-2 mt-2"
                >
                  {status === 'submitting' ? (
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    r.submit ?? (isHi ? 'रिन्यूअल रिमाइंडर अनुरोध करें' : 'Request Renewal Reminder')
                  )}
                </button>

                {status === 'error' && (
                  <p className="text-red-500 text-xs text-center">
                    {isHi ? 'कुछ गलत हुआ। 9415313434 पर कॉल करें।' : 'Something went wrong. Please call 9415313434.'}
                  </p>
                )}

                <p className="text-[10px] text-gray-500 text-center">
                  {isHi ? 'आपकी जानकारी निजी है।' : 'Your details are private and never shared. 🔒'}
                </p>
              </form>
            </>
          )}
        </div>
      </section>
    </div>
  )
}
