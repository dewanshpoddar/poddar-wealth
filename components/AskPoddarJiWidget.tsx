'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useLang } from '@/lib/LangContext'
import { Send } from 'lucide-react'

export default function AskPoddarJiWidget() {
  const { t, lang } = useLang()
  const router = useRouter()
  const [question, setQuestion] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!question.trim()) return
    router.push(`/ai-advisor?q=${encodeURIComponent(question.trim())}`)
  }

  const widgetTitle = lang === 'hi' ? 'पोद्दार जी से पूछें' : 'Ask Poddar Ji'
  const widgetSub = lang === 'hi' 
    ? '31 वर्षों का अनुभव। 24×7 उपलब्ध।' 
    : '31 years of experience. Available 24×7.'
  const placeholder = t.chatbotWidget?.placeholder || (lang === 'hi' ? 'बीमा से जुड़ा अपना सवाल टाइप करें...' : 'Type your insurance question...')

  return (
    <section className="bg-gray-950 py-8 border-y border-gray-900">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 bg-white/[0.02] border border-white/[0.06] rounded-3xl p-5 md:p-6 backdrop-blur-md">
          
          {/* Left + Center: Avatar & Text */}
          <div className="flex items-center gap-4 w-full lg:w-auto">
            {/* Avatar Circle */}
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white font-extrabold text-[15px] shadow-lg shadow-amber-500/10 shrink-0">
              PJ
            </div>
            
            {/* Text details */}
            <div className="min-w-0">
              <h2 className="text-[15px] font-bold text-white leading-tight flex items-center gap-2">
                {widgetTitle}
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </h2>
              <p className="text-[12px] text-gray-400 mt-1 font-medium">
                {widgetSub}
              </p>
            </div>
          </div>

          {/* Right: Input Bar */}
          <form onSubmit={handleSubmit} className="w-full lg:w-[480px] flex gap-2.5 bg-white/[0.04] border border-white/[0.1] rounded-2xl p-1.5 focus-within:border-amber-500/50 focus-within:ring-1 focus-within:ring-amber-500/20 transition-all">
            <input
              type="text"
              required
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder={placeholder}
              className="flex-1 bg-transparent text-13 outline-none text-white placeholder-gray-500 px-3.5 py-2 font-medium"
            />
            <button
              type="submit"
              aria-label="Send question"
              className="bg-amber-500 hover:bg-amber-600 text-white rounded-xl w-10 h-10 flex items-center justify-center shrink-0 transition-colors shadow-md shadow-amber-500/10 hover:shadow-lg cursor-pointer"
            >
              <Send size={15} className="fill-current text-white translate-x-[-0.5px]" />
            </button>
          </form>

        </div>
      </div>
    </section>
  )
}
