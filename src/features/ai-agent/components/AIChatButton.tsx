'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Sparkles, ChevronDown } from 'lucide-react'
import { useLang } from '@/lib/LangContext'
import { usePoddarJiChat } from '../hooks/usePoddarJiChat'
import PoddarJiChatUI from '@/components/base/PoddarJiChatUI'

export default function AIChatButton() {
  const { t } = useLang()
  const [isOpen, setIsOpen] = useState(false)
  const [bubbleIndex, setBubbleIndex] = useState(0)
  const [showBubble, setShowBubble] = useState(false)
  const chat = usePoddarJiChat(t.chatbot.greeting)

  // Cycle curiosity questions when closed
  useEffect(() => {
    if (isOpen) { setShowBubble(false); return }
    const questions = t.chatbot.curiosityQueries || []
    if (!questions.length) return

    const initial = setTimeout(() => setShowBubble(true), 2000)
    const cycle = setInterval(() => {
      setShowBubble(false)
      setTimeout(() => {
        setBubbleIndex(prev => (prev + 1) % questions.length)
        setShowBubble(true)
      }, 400)
    }, 6000)

    return () => { clearTimeout(initial); clearInterval(cycle) }
  }, [isOpen, t.chatbot.curiosityQueries])

  return (
    <div className="fixed bottom-20 sm:bottom-6 right-5 z-[9980] flex flex-col items-end gap-3">

      {/* ── Popup chat window ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 340, damping: 30 }}
            className="w-[360px] max-w-[calc(100vw-24px)]"
          >
            {/* Close button row */}
            <div className="flex justify-end mb-1">
              <button
                onClick={() => setIsOpen(false)}
                className="w-11 h-11 rounded-full flex items-center justify-center bg-white/80 text-slate-700 hover:text-slate-900 hover:bg-white shadow transition-all"
                aria-label="Close chat"
              >
                <X size={16} />
              </button>
            </div>

            <PoddarJiChatUI
              chat={chat}
              chips={t.chatbot.chips}
              chipQueries={t.chatbot.chipQueries}
              placeholder={t.chatbot.placeholder}
              disclaimer={t.chatbot.disclaimer}
              disclaimerNotice={t.chatbot.disclaimerNotice}
              badges={t.chatbot.badges}
              statusText={t.chatbot.statusText}
              compact
              onClearChat={chat.clearChat}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Curiosity bubble ── */}
      <AnimatePresence>
        {showBubble && !isOpen && (
          <motion.button
            initial={{ opacity: 0, y: 8, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.92 }}
            onClick={() => { setIsOpen(true); setShowBubble(false) }}
            className="bg-white rounded-2xl rounded-br-sm shadow-xl border border-slate-100 px-3.5 py-2.5 max-w-[220px] text-left hover:shadow-2xl transition-shadow"
          >
            <p className="text-[12px] text-slate-700 leading-snug">
              {t.chatbot.curiosityQueries[bubbleIndex]}
            </p>
          </motion.button>
        )}
      </AnimatePresence>

      {/* ── Floating trigger button ── */}
      <div className="flex flex-col items-center gap-1.5 group/trigger">
        <motion.button
          onClick={() => { setIsOpen(prev => !prev); setShowBubble(false) }}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.94 }}
          className="relative w-14 h-14 bg-navy text-white rounded-full flex items-center justify-center shadow-2xl hover:bg-navy-light transition-colors"
          aria-label={isOpen ? 'Close Poddar Ji' : 'Ask Poddar Ji'}
        >
          <div className="w-10 h-10 bg-gold rounded-full flex items-center justify-center">
            <AnimatePresence mode="wait" initial={false}>
              {isOpen ? (
                <motion.span key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                  <ChevronDown size={18} className="text-navy" />
                </motion.span>
              ) : (
                <motion.span key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
                  <Sparkles size={18} className="text-navy" />
                </motion.span>
              )}
            </AnimatePresence>
          </div>
          
          {/* Desktop tooltip (show on hover) */}
          <div className="hidden sm:block absolute right-16 top-1/2 -translate-y-1/2 bg-navy text-white text-xs font-bold px-3 py-2 rounded-xl whitespace-nowrap opacity-0 pointer-events-none group-hover/trigger:opacity-100 transition-opacity shadow-lg border border-white/10">
            {isOpen 
              ? (useLang().lang === 'hi' ? 'बंद करें' : 'Close') 
              : (useLang().lang === 'hi' ? 'पोद्दार जी से पूछें' : 'Ask Poddar Ji')}
          </div>
        </motion.button>
        
        {/* Mobile label: always show as small label below the circle */}
        <span className="sm:hidden bg-navy/90 backdrop-blur-sm text-[9px] font-bold text-white px-2 py-0.5 rounded-full shadow border border-white/5 whitespace-nowrap">
          {isOpen 
            ? (useLang().lang === 'hi' ? 'बंद करें' : 'Close') 
            : (useLang().lang === 'hi' ? 'पोद्दार जी से पूछें' : 'Ask Poddar Ji')}
        </span>
      </div>
    </div>
  )
}
