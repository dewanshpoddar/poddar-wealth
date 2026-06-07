'use client'

import { useState, FormEvent } from 'react'
import { useLang } from '@/lib/LangContext'

export default function NewsletterSignup() {
  const { t } = useLang()
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const newsletterT = t.newsletter || {
    title: 'Get Insurance Insights Weekly',
    subtitle: 'Premium reminders, market updates, and tips from 31 years of experience. No spam, ever.',
    placeholder: 'your@email.com',
    button: 'Subscribe',
    success: "You're in! Check your inbox for a welcome message.",
    error: 'Something went wrong. Try again or WhatsApp us.'
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!email) return
    setStatus('loading')

    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      if (!res.ok) {
        throw new Error('API failed')
      }

      setStatus('success')
      setEmail('')
    } catch (err) {
      setStatus('error')
    }
  }

  return (
    <section className="bg-gray-950 py-12 px-6 border-t border-gray-900">
      <div className="max-w-[1240px] mx-auto flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        
        {/* Left Column: Text */}
        <div className="max-w-xl">
          <h2 className="text-xl md:text-2xl font-bold text-white mb-2 tracking-tight">
            {newsletterT.title}
          </h2>
          <p className="text-gray-400 text-xs md:text-sm leading-relaxed font-semibold">
            {newsletterT.subtitle}
          </p>
        </div>

        {/* Right Column: Inline Form */}
        <div className="shrink-0 w-full lg:w-auto">
          {status === 'success' ? (
            <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold text-xs px-5 py-4 rounded-xl max-w-md">
              {newsletterT.success}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 sm:gap-0 max-w-md w-full">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={newsletterT.placeholder}
                disabled={status === 'loading'}
                className="bg-gray-800 border border-gray-700 focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30 text-white rounded-xl sm:rounded-r-none sm:rounded-l-xl px-4 py-3 text-sm flex-1 outline-none transition-all placeholder-gray-500"
              />
              <button
                type="submit"
                disabled={status === 'loading'}
                className="bg-amber-500 hover:bg-amber-600 disabled:bg-amber-500/50 text-white font-bold text-sm px-6 py-3 rounded-xl sm:rounded-l-none sm:rounded-r-xl transition-colors shrink-0 active:scale-[0.98] duration-150"
              >
                {status === 'loading' ? (
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  newsletterT.button
                )}
              </button>
            </form>
          )}

          {status === 'error' && (
            <div className="text-red-400 text-xs font-semibold mt-2.5 max-w-md leading-relaxed">
              {newsletterT.error}
            </div>
          )}
        </div>

      </div>
    </section>
  )
}
