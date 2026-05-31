'use client'

import { useState, useEffect, useRef } from 'react'
import { useLang } from '@/lib/LangContext'
import { trackEvent } from '@/lib/analytics'

const SESSION_KEY = 'pw_exit_shown'

export default function ExitIntentPopup() {
  const { t } = useLang()
  const [visible, setVisible] = useState(false)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'done'>('idle')
  const shownRef = useRef(false)
  const c = (t as Record<string, any>).exitIntent ?? {}

  function show() {
    if (shownRef.current || sessionStorage.getItem(SESSION_KEY)) return
    shownRef.current = true
    sessionStorage.setItem(SESSION_KEY, '1')
    setVisible(true)
    trackEvent('exit_intent_shown')
  }

  useEffect(() => {
    // Desktop: mouse leaves viewport
    const onMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) show()
    }
    document.addEventListener('mouseleave', onMouseLeave)

    // Mobile: 30s inactivity timer
    const timer = setTimeout(show, 30000)

    return () => {
      document.removeEventListener('mouseleave', onMouseLeave)
      clearTimeout(timer)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const digits = phone.replace(/\D/g, '')
    if (digits.length !== 10) return
    setStatus('sending')
    try {
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, mobile: digits, intent: 'exit-intent' }),
      })
      trackEvent('exit_intent_submitted')
      setStatus('done')
    } catch {
      setStatus('idle')
    }
  }

  if (!visible) return null

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.65)' }}
      onClick={e => { if (e.target === e.currentTarget) setVisible(false) }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-7 relative">
        <button
          onClick={() => setVisible(false)}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-600 text-xl leading-none"
          aria-label="Close"
        >
          ✕
        </button>

        {status === 'done' ? (
          <div className="text-center py-4">
            <div className="text-4xl mb-3">🙏</div>
            <h3 className="font-display font-bold text-navy text-lg mb-2">
              {c.successMsg ?? 'Ajay sir will call you within 24 hours.'}
            </h3>
            <button onClick={() => setVisible(false)} className="mt-4 text-sm text-gray-500 hover:text-navy underline">
              Close
            </button>
          </div>
        ) : (
          <>
            <div className="text-3xl mb-3 text-center">💰</div>
            <h3 className="font-display font-bold text-navy text-xl mb-2 text-center leading-snug">
              {c.title ?? 'Wait! Get Your FREE Wealth Health Report'}
            </h3>
            <p className="text-gray-500 text-sm text-center mb-5 leading-relaxed">
              {c.subtitle ?? 'Let Ajay sir review your current insurance and spot the gaps — free, no obligation.'}
            </p>

            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                required
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder={c.namePlaceholder ?? 'Your name'}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-navy/40"
              />
              <input
                required
                type="tel"
                inputMode="numeric"
                maxLength={10}
                value={phone}
                onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                placeholder={c.phonePlaceholder ?? '10-digit mobile'}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-navy/40"
              />
              <button
                type="submit"
                disabled={status === 'sending'}
                className="w-full bg-gold hover:bg-amber-600 text-white font-bold py-3.5 rounded-xl text-sm transition-colors disabled:opacity-70"
              >
                {status === 'sending' ? '…' : (c.submit ?? 'Get My Free Report')}
              </button>
            </form>

            <button
              onClick={() => setVisible(false)}
              className="w-full mt-3 text-xs text-gray-500 hover:text-gray-600 transition-colors"
            >
              {c.dismiss ?? 'No thanks'}
            </button>
          </>
        )}
      </div>
    </div>
  )
}
