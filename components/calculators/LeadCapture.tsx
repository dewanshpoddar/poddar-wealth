'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Lock, Phone, User, Mail, Calendar, ClipboardCheck, CheckCircle, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react'
import { getLeadInfo, updateSession } from '@/lib/calculator-session'
import { useLang } from '@/lib/LangContext'
import { ADVISOR_PHONE } from '@/lib/constants'

interface LeadCaptureProps {
  calculatorId: 'premium' | 'maturity' | 'life-insurance' | 'retirement' | 'loan' | 'surrender-value' | 'policy-health'
  inputs: Record<string, unknown>
  result: Record<string, unknown>
  hasCalculated: boolean
  whatsappMessage: string
  onReset: () => void
}

export default function LeadCapture({
  calculatorId,
  inputs,
  result,
  hasCalculated,
  whatsappMessage,
  onReset
}: LeadCaptureProps) {
  const { lang } = useLang()
  const [isVisible, setIsVisible] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  // Form Fields
  const [phone, setPhone] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [showAdvanced, setShowAdvanced] = useState(false)

  // DOB States
  const [dobDay, setDobDay] = useState('')
  const [dobMonth, setDobMonth] = useState('')
  const [dobYear, setDobYear] = useState('')

  // Validation
  const [phoneError, setPhoneError] = useState('')
  const [emailError, setEmailError] = useState('')

  // Check if session already has phone captured
  const [existingLead, setExistingLead] = useState<ReturnType<typeof getLeadInfo>>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setExistingLead(getLeadInfo())
    }
  }, [success])

  // Trigger reveal animation 1.5s after calculation
  useEffect(() => {
    if (hasCalculated) {
      const timer = setTimeout(() => {
        setIsVisible(true)
      }, 1500)
      return () => clearTimeout(timer)
    } else {
      setIsVisible(false)
      setSuccess(false)
    }
  }, [hasCalculated])

  // Format phone number to "XXXXX XXXXX" as user types
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value.replace(/\D/g, '').slice(0, 10)
    if (rawVal.length > 5) {
      setPhone(`${rawVal.slice(0, 5)} ${rawVal.slice(5)}`)
    } else {
      setPhone(rawVal)
    }
    if (phoneError) setPhoneError('')
  }

  const validatePhone = (rawVal: string) => {
    const digitsOnly = rawVal.replace(/\s/g, '')
    if (!/^[6-9]\d{9}$/.test(digitsOnly)) {
      setPhoneError(lang === 'hi' ? 'कृपया 10-अंकों का वैध मोबाइल नंबर दर्ज करें' : 'Please enter a valid 10-digit mobile number')
      return false
    }
    setPhoneError('')
    return true
  }

  const validateEmail = (val: string) => {
    if (val && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
      setEmailError(lang === 'hi' ? 'कृपया एक वैध ईमेल पता दर्ज करें' : 'Please enter a valid email address')
      return false
    }
    setEmailError('')
    return true
  }

  const submitLead = async (payload: {
    phone: string
    name: string
    email: string
    dob: string
  }) => {
    setIsSubmitting(true)
    try {
      const utmParams: Record<string, string> = {}
      if (typeof window !== 'undefined') {
        const urlParams = new URLSearchParams(window.location.search)
        urlParams.forEach((value, key) => {
          if (key.startsWith('utm_')) {
            utmParams[key] = value
          }
        })
      }

      const response = await fetch('/api/leads/calculator', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone: payload.phone,
          name: payload.name,
          email: payload.email,
          dob: payload.dob,
          calculator: calculatorId,
          inputs,
          result,
          source: 'website',
          timestamp: new Date().toISOString(),
          utm: utmParams
        }),
      })

      if (response.ok) {
        updateSession({
          phone: payload.phone,
          name: payload.name,
          email: payload.email,
          dob: payload.dob
        })
        setSuccess(true)
        // Trigger WhatsApp
        const waUrl = `https://wa.me/91${ADVISOR_PHONE}?text=${encodeURIComponent(whatsappMessage)}`
        window.open(waUrl, '_blank')
      }
    } catch (err) {
      console.error('Lead Capture submission error:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const rawPhone = phone.replace(/\s/g, '')
    const isPhoneValid = validatePhone(rawPhone)
    const isEmailValid = validateEmail(email)

    if (!isPhoneValid || !isEmailValid) return

    let dobString = ''
    if (dobDay && dobMonth && dobYear) {
      dobString = `${dobYear}-${dobMonth.padStart(2, '0')}-${dobDay.padStart(2, '0')}`
    }

    submitLead({
      phone: rawPhone,
      name,
      email,
      dob: dobString
    })
  }

  const handleOneTapSend = () => {
    if (!existingLead) return
    submitLead({
      phone: existingLead.phone || '',
      name: existingLead.name || '',
      email: existingLead.email || '',
      dob: existingLead.dob || ''
    })
  }

  if (!hasCalculated || !isVisible) return null

  if (success) {
    return (
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 text-center animate-fadeIn">
        <div className="flex justify-center mb-3">
          <CheckCircle className="w-10 h-10 text-emerald-600" />
        </div>
        <h3 className="text-emerald-950 font-bold text-base mb-1">
          {lang === 'hi' ? 'सहेजा गया! अजय जी आपकी गणना की समीक्षा करेंगे।' : 'Saved! Ajay ji will review your calculation.'}
        </h3>
        <p className="text-emerald-800 text-sm mb-4">
          {lang === 'hi' ? 'अपनी रिपोर्ट के लिए व्हाट्सएप चेक करें।' : 'Check WhatsApp for your report.'}
        </p>
        <div className="flex justify-center gap-3">
          <button
            onClick={() => {
              setPhone('')
              setName('')
              setEmail('')
              setDobDay('')
              setDobMonth('')
              setDobYear('')
              setSuccess(false)
              onReset()
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 border border-emerald-200 text-emerald-800 bg-white rounded-lg text-sm font-semibold hover:bg-emerald-50 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            {lang === 'hi' ? 'पुनः गणना करें ↻' : 'Calculate again ↻'}
          </button>
          <Link
            href="/calculators"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-semibold hover:bg-emerald-700 transition-colors cursor-pointer"
          >
            {lang === 'hi' ? 'दूसरा कैलकुलेटर →' : 'Try another calculator →'}
          </Link>
        </div>
      </div>
    )
  }

  // Compact layout if lead is already captured
  if (existingLead && existingLead.phone) {
    const maskedPhone = `XXXXX${existingLead.phone.slice(-5)}`
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm animate-fadeIn">
        <div className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <ClipboardCheck className="w-5 h-5 text-emerald-500 flex-shrink-0" />
          <span>
            {lang === 'hi'
              ? `इस परिणाम को अपने व्हाट्सएप पर भेजें (${maskedPhone})`
              : `Send this result to your WhatsApp (${maskedPhone})`}
          </span>
        </div>
        <button
          onClick={handleOneTapSend}
          disabled={isSubmitting}
          className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-semibold rounded-xl transition-colors cursor-pointer"
        >
          {isSubmitting ? (lang === 'hi' ? 'भेज रहा है...' : 'Sending...') : (lang === 'hi' ? 'भेजें →' : 'Send →')}
        </button>
      </div>
    )
  }

  return (
    <div className={`bg-white rounded-xl border border-gray-200 p-5 shadow-sm transition-all duration-500 ease-out transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
      <div className="flex items-center gap-2 pb-3 border-b border-gray-100 mb-4">
        <ClipboardCheck className="w-5 h-5 text-blue-600" />
        <h3 className="font-semibold text-gray-900 text-base">
          {lang === 'hi' ? 'अपनी गणना सहेजें' : 'Save this calculation'}
        </h3>
      </div>
      <p className="text-gray-600 text-sm mb-4">
        {lang === 'hi'
          ? 'अजय जी से व्हाट्सएप पर परिणाम और व्यक्तिगत योजना सिफारिशें प्राप्त करें।'
          : 'Get your result on WhatsApp + personalized plan recommendations from Ajay ji.'}
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
            {lang === 'hi' ? 'मोबाइल नंबर *' : 'Mobile *'}
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-3 text-gray-400 text-sm font-medium">+91</span>
            <input
              type="tel"
              value={phone}
              onChange={handlePhoneChange}
              onBlur={() => validatePhone(phone)}
              placeholder="9XXXX XXXXX"
              className="w-full h-11 pl-12 pr-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-base text-gray-900"
              required
            />
          </div>
          {phoneError && <p className="text-xs text-red-500 mt-1">{phoneError}</p>}
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
            {lang === 'hi' ? 'नाम (वैकल्पिक)' : 'Name (optional)'}
          </label>
          <div className="relative">
            <User className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={lang === 'hi' ? 'अपना नाम दर्ज करें' : 'Enter your name'}
              className="w-full h-11 pl-10 pr-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-base text-gray-900"
            />
          </div>
        </div>

        {/* Toggle Details Accordion */}
        <div>
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors cursor-pointer"
          >
            {showAdvanced ? (
              <>
                {lang === 'hi' ? 'कम विवरण दिखाएं' : 'Less details'}
                <ChevronUp className="w-4 h-4" />
              </>
            ) : (
              <>
                {lang === 'hi' ? 'अधिक विवरण दिखाएं (ईमेल / जन्म तिथि)' : 'More details (Email / DOB)'}
                <ChevronDown className="w-4 h-4" />
              </>
            )}
          </button>

          {showAdvanced && (
            <div className="mt-4 pt-4 border-t border-gray-100 space-y-4 animate-fadeIn">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                  {lang === 'hi' ? 'ईमेल (वैकल्पिक)' : 'Email (optional)'}
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={() => validateEmail(email)}
                    placeholder="name@example.com"
                    className="w-full h-11 pl-10 pr-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-base text-gray-900"
                  />
                </div>
                <p className="text-[11px] text-gray-400 mt-1">
                  {lang === 'hi' ? 'हम इस ईमेल पर आपकी गणना रिपोर्ट भेजेंगे' : "We'll send your calculation report to this email"}
                </p>
                {emailError && <p className="text-xs text-red-500 mt-1">{emailError}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                  {lang === 'hi' ? 'जन्म तिथि (वैकल्पिक)' : 'Date of Birth (optional)'}
                </label>
                <div className="flex gap-2">
                  <select
                    value={dobDay}
                    onChange={(e) => setDobDay(e.target.value)}
                    className="flex-1 h-11 px-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-base text-gray-900 bg-white"
                  >
                    <option value="">{lang === 'hi' ? 'दिन' : 'DD'}</option>
                    {Array.from({ length: 31 }, (_, i) => String(i + 1)).map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>

                  <select
                    value={dobMonth}
                    onChange={(e) => setDobMonth(e.target.value)}
                    className="flex-1 h-11 px-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-base text-gray-900 bg-white"
                  >
                    <option value="">{lang === 'hi' ? 'माह' : 'MM'}</option>
                    {Array.from({ length: 12 }, (_, i) => String(i + 1)).map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>

                  <select
                    value={dobYear}
                    onChange={(e) => setDobYear(e.target.value)}
                    className="flex-1 h-11 px-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-base text-gray-900 bg-white"
                  >
                    <option value="">{lang === 'hi' ? 'वर्ष' : 'YYYY'}</option>
                    {Array.from({ length: 90 }, (_, i) => String(new Date().getFullYear() - 10 - i)).map((y) => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </div>
                <p className="text-[11px] text-gray-400 mt-1">
                  {lang === 'hi' ? 'आयु के अनुसार व्यक्तिगत योजना सिफारिशों के लिए' : 'For personalized plan recommendations by age'}
                </p>
              </div>
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-semibold rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-sm active:scale-[0.99] transform"
        >
          {isSubmitting ? (lang === 'hi' ? 'सहेज रहा है...' : 'Saving...') : (lang === 'hi' ? 'सहेजें और व्हाट्सएप पर रिपोर्ट प्राप्त करें' : 'Save & Get Report on WhatsApp')}
        </button>
      </form>

      <div className="mt-4 flex items-center gap-1.5 justify-center text-xs text-gray-400">
        <Lock className="w-3.5 h-3.5" />
        <span>
          {lang === 'hi'
            ? "आपका डेटा अजय जी के कार्यालय के पास सुरक्षित रहता है। कभी साझा नहीं किया जाता।"
            : "Your data stays with Ajay ji's office. Never shared. Never spammed."}
        </span>
      </div>
    </div>
  )
}
