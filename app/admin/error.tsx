'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[Admin Error Boundary]', error.name, error.message, error.stack)
  }, [error])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-lg w-full bg-white border border-red-200 rounded-3xl p-8 shadow-sm">
        <div className="w-12 h-12 rounded-full bg-red-50 border border-red-100 flex items-center justify-center mx-auto mb-5">
          <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
          </svg>
        </div>

        <h1 className="text-gray-900 text-xl font-bold text-center mb-2">Admin Panel Error</h1>
        <p className="text-gray-500 text-sm text-center mb-5">
          A runtime error occurred. Details below for debugging.
        </p>

        <div className="bg-gray-50 rounded-xl p-4 mb-5 border border-gray-200">
          <p className="text-red-500 text-xs font-mono font-bold mb-1">{error.name}</p>
          <p className="text-gray-700 text-xs font-mono leading-relaxed break-all">
            {error.message || 'No message available'}
          </p>
          {error.digest && (
            <p className="text-gray-400 text-xs font-mono mt-2">digest: {error.digest}</p>
          )}
        </div>

        <div className="flex gap-3">
          <button
            onClick={reset}
            className="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm py-2.5 rounded-xl transition-all cursor-pointer"
          >
            Retry
          </button>
          <Link
            href="/"
            className="flex-1 text-center border border-gray-200 hover:border-gray-300 text-gray-600 hover:text-gray-900 font-bold text-sm py-2.5 rounded-xl transition-all"
          >
            Back to Site
          </Link>
        </div>
      </div>
    </div>
  )
}
