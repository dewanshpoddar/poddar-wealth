'use client'
import React from 'react'
import Link from 'next/link'
import { useLang } from '@/lib/LangContext'

export default function AIChatButton() {
  const { t } = useLang()

  return (
    <Link
      href="/ai-advisor"
      className="pw-ai-float"
      aria-label="Connect with Poddar Ji"
    >
      <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center animate-pulse">
        <span className="text-[10px]">✨</span>
      </div>
      <span>{t.chatbot.headerName}</span>
      <div className="md:hidden">AI</div>
    </Link>
  )
}
