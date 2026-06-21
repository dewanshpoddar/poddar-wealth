'use client'
import { useEffect } from 'react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[GlobalError]', error)
  }, [error])

  return (
    <html>
      <body>
        <div style={{ padding: '2rem', textAlign: 'center', fontFamily: 'sans-serif' }}>
          <h2 style={{ color: '#1e293b', marginBottom: '1rem' }}>Something went wrong</h2>
          <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>
            Please refresh the page or contact us at +91 9415313434.
          </p>
          <button
            onClick={reset}
            style={{ background: '#f59e0b', color: '#fff', border: 'none', borderRadius: '8px', padding: '10px 24px', fontWeight: 600, cursor: 'pointer' }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  )
}
