'use client'
import React, { useState, useEffect } from 'react'
import { Lock, LockOpen, ArrowRight, ShieldCheck } from 'lucide-react'
import { getLeadInfo, updateSession } from '@/lib/calculator-session'
import { ADVISOR_PHONE } from '@/lib/constants'

interface LeadGateProps {
  onUnlock: (phone: string) => void
  calculatorName: string
  inputs: Record<string, any>
  resultSummary: Record<string, any>
  whatsappMessage: string
}

export default function LeadGate({
  onUnlock,
  calculatorName,
  inputs,
  resultSummary,
  whatsappMessage
}: LeadGateProps) {
  const [phone, setPhone] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [existingPhone, setExistingPhone] = useState<string | null>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const info = getLeadInfo()
      if (info && info.phone) {
        setExistingPhone(info.phone)
      }
    }
  }, [])

  const formatPhone = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 10)
    if (digits.length > 5) {
      return `${digits.slice(0, 5)} ${digits.slice(5)}`
    }
    return digits
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value)
    setPhone(formatted)
    if (error) setError('')
  }

  const validatePhone = (rawPhone: string) => {
    if (!/^[6-9]\d{9}$/.test(rawPhone)) {
      setError('Please enter a valid 10-digit mobile number')
      return false
    }
    setError('')
    return true
  }

  const submitLead = async (rawPhone: string) => {
    setIsSubmitting(true)
    try {
      const utmParams: Record<string, string> = {}
      if (typeof window !== 'undefined') {
        const urlParams = new URLSearchParams(window.location.search)
        urlParams.forEach((val, key) => {
          if (key.startsWith('utm_')) {
            utmParams[key] = val
          }
        })
      }

      const response = await fetch('/api/leads/calculator', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone: rawPhone,
          calculator: calculatorName,
          inputs,
          result: resultSummary,
          source: 'website',
          timestamp: new Date().toISOString(),
          utm: utmParams
        }),
      })

      if (response.ok) {
        // Save to session
        updateSession({ phone: rawPhone })
        // Call unlock callback
        onUnlock(rawPhone)
        // Redirect to WhatsApp
        const waUrl = `https://wa.me/91${ADVISOR_PHONE}?text=${encodeURIComponent(whatsappMessage)}`
        window.open(waUrl, '_blank')
      } else {
        const errData = await response.json()
        setError(errData.error || 'Failed to submit. Please try again.')
      }
    } catch (err) {
      console.error('LeadGate error:', err)
      setError('Connection error. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const raw = phone.replace(/\s/g, '')
    if (!validatePhone(raw)) return
    submitLead(raw)
  }

  const handleOneTap = () => {
    if (existingPhone) {
      submitLead(existingPhone)
    }
  }

  const maskedPhone = existingPhone 
    ? `XXXXX ${existingPhone.slice(-5)}` 
    : ''

  return (
    <div className="absolute inset-0 bg-white/95 backdrop-blur-[2px] flex flex-col items-center justify-center p-4 z-20 text-center animate-fadeIn rounded-2xl">
      {/* Amber Lock Icon Square */}
      <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-[#d97706] mb-2.5 shadow-sm">
        <Lock className="w-5 h-5" />
      </div>

      <h4 className="text-sm font-semibold text-gray-900 mb-1">
        Unlock Full Analysis
      </h4>
      <p className="text-[10px] text-gray-500 max-w-[260px] mb-4 leading-relaxed">
        Get maturity estimates, net gains, FD comparisons, and Ajay ji&apos;s recommendations direct to WhatsApp.
      </p>

      {existingPhone ? (
        /* One-tap Send */
        <div className="w-full flex flex-col items-center space-y-2.5">
          <div className="text-[11px] font-medium text-gray-700 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Send to WhatsApp ({maskedPhone})</span>
          </div>
          <button
            onClick={handleOneTap}
            disabled={isSubmitting}
            className="w-[200px] h-10 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-semibold text-xs rounded-lg shadow-sm transition-all duration-200 cursor-pointer active:scale-[0.98] flex items-center justify-center gap-1.5"
          >
            {isSubmitting ? 'Sending...' : 'Send to WhatsApp →'}
          </button>
        </div>
      ) : (
        /* Input phone */
        <form onSubmit={handleSubmit} className="w-full flex flex-col items-center space-y-2">
          <div className="relative w-[200px]">
            <span className="absolute left-3.5 top-2.5 text-gray-400 text-sm font-medium">+91</span>
            <input
              type="tel"
              value={phone}
              onChange={handlePhoneChange}
              placeholder="9XXXX XXXXX"
              className="w-full h-10 pl-11 pr-2 text-center rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm font-medium text-gray-900 tracking-wider"
              required
            />
          </div>
          {error && <p className="text-[10px] text-red-500 max-w-[200px]">{error}</p>}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-[200px] h-10 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-semibold text-xs rounded-lg shadow-sm transition-all duration-200 cursor-pointer active:scale-[0.98]"
          >
            {isSubmitting ? 'Unlocking...' : 'Unlock on WhatsApp'}
          </button>
        </form>
      )}

      {/* Signature Trust note */}
      <p className="mt-2.5 text-[9px] text-gray-500 italic max-w-[240px] leading-relaxed border-t border-gray-100 pt-2.5 select-none">
        &ldquo;We analyze policies with the same precision we&apos;ve used for 5,000+ families over 31 years.&rdquo;
        <span className="block text-[8px] not-italic font-bold text-amber-600 uppercase tracking-wider mt-0.5">&mdash; Ajay Kumar Poddar (MDRT USA)</span>
      </p>
 
      {/* Privacy Line */}
      <div className="mt-3.5 text-[9px] text-gray-400 flex items-center gap-1 font-medium">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
        <span>Direct to Ajay ji. No spam.</span>
      </div>
    </div>
  )
}
