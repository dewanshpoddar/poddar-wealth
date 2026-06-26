'use client'
import React, { useEffect, useState } from 'react'
import { MessageCircle, RefreshCw } from 'lucide-react'

interface ActionBarProps {
  whatsappUrl: string
  onReset: () => void
  resultRef: React.RefObject<HTMLElement | null>
  whatsappLabel?: string
  resetLabel?: string
}

export default function ActionBar({
  whatsappUrl,
  onReset,
  resultRef,
  whatsappLabel = 'WhatsApp Ajay ji',
  resetLabel = 'Calculate Again ↻'
}: ActionBarProps) {
  const [showSticky, setShowSticky] = useState(false)

  useEffect(() => {
    const target = resultRef.current
    if (!target) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowSticky(entry.isIntersecting)
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    )

    observer.observe(target)

    return () => {
      observer.unobserve(target)
    }
  }, [resultRef])

  return (
    <>
      {/* Desktop: Inline below insight, not sticky */}
      <div className="hidden md:flex items-center gap-4 mt-6">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center px-6 h-12 bg-amber-500 hover:bg-amber-600 text-white font-semibold text-base rounded-xl transition-all duration-200 active:scale-[0.98]"
        >
          Discuss with Ajay ji →
        </a>
        <button
          onClick={onReset}
          className="text-sm font-medium text-gray-500 hover:text-gray-700 underline flex items-center gap-1.5 cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Start Over
        </button>
      </div>

      {/* Mobile: Sticky bottom bar (appears ONLY after result is in viewport) */}
      {showSticky && (
        <div className="fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-gray-200 shadow-[0_-2px_8px_rgba(0,0,0,0.05)] z-50 flex items-center justify-between px-4 gap-3 md:hidden animate-slideUp">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 h-11 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-lg transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            {whatsappLabel}
          </a>
          <button
            onClick={onReset}
            className="flex-1 flex items-center justify-center gap-1.5 h-11 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold rounded-lg transition-colors cursor-pointer"
          >
            {resetLabel}
          </button>
        </div>
      )}
    </>
  )
}
