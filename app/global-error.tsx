'use client'
import { useEffect } from 'react'
import { ADVISOR_PHONE } from '@/lib/constants'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Report to admin without Sentry (removed: exceeded Vercel 250MB serverless limit)
    fetch('/api/admin/error-report', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: error.name,
        message: error.message,
        digest: error.digest ?? null,
        url: typeof window !== 'undefined' ? window.location.href : null,
      }),
    }).catch(() => {})
  }, [error])

  return (
    <html>
      <body className="min-h-screen bg-gray-50 flex items-center justify-center p-8 font-sans">
        <div className="max-w-md w-full bg-white border border-red-100 rounded-2xl p-8 text-center shadow-sm">
          <div className="w-12 h-12 rounded-full bg-red-50 border border-red-100 flex items-center justify-center mx-auto mb-5">
            <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            </svg>
          </div>
          <h2 className="text-gray-900 text-lg font-semibold mb-2">Something went wrong</h2>
          <p className="text-gray-500 text-sm mb-6">
            Please refresh the page or call Ajay sir directly at{' '}
            <a href={`tel:${ADVISOR_PHONE}`} className="text-amber-600 font-semibold">
              +91 {ADVISOR_PHONE}
            </a>
            .
          </p>
          <button
            onClick={reset}
            className="bg-amber-500 hover:bg-amber-600 text-white font-semibold text-sm px-6 py-2.5 rounded-xl transition-colors cursor-pointer"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  )
}
