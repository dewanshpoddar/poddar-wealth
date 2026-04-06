'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useLang } from '@/lib/LangContext'

export default function AIChatButton() {
  const { t } = useLang()
  const [msgIndex, setMsgIndex] = useState(0)
  const [showBubble, setShowBubble] = useState(false)

  // Cycle through curiosity questions
  useEffect(() => {
    const questions = t.chatbot.curiosityQueries || []
    if (questions.length === 0) return

    const interval = setInterval(() => {
      setShowBubble(false)
      setTimeout(() => {
        setMsgIndex((prev) => (prev + 1) % questions.length)
        setShowBubble(true)
      }, 500)
    }, 6000)

    // Initial delay to show the first bubble
    const initialTimeout = setTimeout(() => setShowBubble(true), 2000)

    return () => {
      clearInterval(interval)
      clearTimeout(initialTimeout)
    }
  }, [t.chatbot.curiosityQueries])

  return (
    <>
      {showBubble && t.chatbot.curiosityQueries && (
        <div className="pw-ai-bubble">
          {t.chatbot.curiosityQueries[msgIndex]}
        </div>
      )}

      <Link
        href="/ai-advisor"
        className="pw-ai-float group"
        aria-label="Connect with Poddar Ji"
      >
        <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center animate-[mascot-float_3s_ease-in-out_infinite]">
          <span className="text-14 drop-shadow-sm group-hover:scale-125 transition-transform">✨</span>
        </div>
        <div className="flex flex-col items-start leading-none pw-ai-text">
          <span className="text-[9px] opacity-70 mb-0.5 uppercase tracking-tighter">AI Counselor</span>
          <span className="font-bold text-11">{t.chatbot.headerName}</span>
        </div>

        <div className="md:hidden font-bold">AI</div>
      </Link>
    </>
  )
}
