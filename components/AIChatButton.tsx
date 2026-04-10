'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Send, Sparkles, ChevronDown } from 'lucide-react'
import { useLang } from '@/lib/LangContext'
import { usePoddarJiChat } from '@/lib/usePoddarJiChat'

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
    <div className="fixed bottom-6 right-5 z-[9998] flex flex-col items-end gap-3">

      {/* ── Popup chat window ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 340, damping: 30 }}
            className="w-[360px] max-w-[calc(100vw-24px)] bg-white rounded-2xl shadow-2xl border border-slate-100 flex flex-col overflow-hidden"
            style={{ height: 500 }}
          >
            {/* Header */}
            <div className="bg-navy px-4 py-3 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-gold flex items-center justify-center text-navy text-[11px] font-bold flex-shrink-0">
                  PJ
                </div>
                <div>
                  <div className="text-white text-[13px] font-bold leading-none">Poddar Ji</div>
                  <div className="flex items-center gap-1 mt-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-white/55 text-[10px]">{t.chatbot.statusText}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-7 h-7 rounded-full flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-all"
                aria-label="Close chat"
              >
                <X size={15} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ background: 'rgb(248 250 252 / 0.6)' }}>
              {chat.messages.map((m, i) => (
                <div key={i} className={`flex gap-2 ${m.from === 'user' ? 'flex-row-reverse' : ''}`}>
                  {m.from === 'bot' && (
                    <div className="w-6 h-6 rounded-full bg-navy flex items-center justify-center text-[8px] font-bold text-gold flex-shrink-0 mt-0.5">
                      PJ
                    </div>
                  )}
                  <div className={`max-w-[78%] px-3 py-2 rounded-2xl text-[12px] leading-relaxed ${
                    m.from === 'user'
                      ? 'bg-navy text-white rounded-br-sm'
                      : 'bg-white text-slate-700 border border-slate-100 rounded-bl-sm shadow-sm'
                  }`}>
                    {m.text.split('\n').map((line, j, arr) => (
                      <span key={j}>{line}{j < arr.length - 1 && <br />}</span>
                    ))}
                  </div>
                </div>
              ))}

              {/* Typing indicator */}
              {chat.typing && (
                <div className="flex gap-2">
                  <div className="w-6 h-6 rounded-full bg-navy flex items-center justify-center text-[8px] font-bold text-gold flex-shrink-0">PJ</div>
                  <div className="bg-white border border-slate-100 rounded-2xl rounded-bl-sm px-3 py-2.5 shadow-sm">
                    <div className="flex gap-1 items-center h-3">
                      {[0, 150, 300].map(delay => (
                        <div key={delay} className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: `${delay}ms` }} />
                      ))}
                    </div>
                  </div>
                </div>
              )}
              <div ref={chat.bottomRef} />
            </div>

            {/* Quick chips */}
            <div className="px-3 py-2 flex gap-1.5 overflow-x-auto scrollbar-hide border-t border-slate-100 flex-shrink-0">
              {t.chatbot.chips.map((chip: string, i: number) => (
                <button
                  key={i}
                  onClick={() => chat.sendMessage(t.chatbot.chipQueries[i])}
                  className="flex-shrink-0 text-[10px] px-2.5 py-1 rounded-full bg-navy/5 text-navy border border-navy/10 hover:bg-navy hover:text-white transition-all whitespace-nowrap"
                >
                  {chip}
                </button>
              ))}
            </div>

            {/* Input */}
            <div className="px-3 pb-3 pt-2 border-t border-slate-100 flex-shrink-0">
              <div className="flex gap-2 bg-slate-50 rounded-xl border border-slate-200 p-1">
                <input
                  type="text"
                  value={chat.input}
                  onChange={e => chat.setInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); chat.sendMessage() } }}
                  placeholder={t.chatbot.placeholder}
                  className="flex-1 bg-transparent text-[12px] px-2 outline-none text-slate-700 placeholder:text-slate-400"
                />
                <button
                  onClick={() => chat.sendMessage()}
                  disabled={!chat.input.trim() || chat.typing}
                  className="w-8 h-8 bg-navy rounded-lg flex items-center justify-center disabled:opacity-30 hover:bg-navy-light transition-colors flex-shrink-0"
                >
                  <Send size={13} className="text-white" />
                </button>
              </div>
              <p className="text-[9px] text-slate-400 text-center mt-1.5 leading-snug">{t.chatbot.disclaimer}</p>
            </div>
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
      <motion.button
        onClick={() => { setIsOpen(prev => !prev); setShowBubble(false) }}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        className="flex items-center gap-2.5 bg-navy text-white rounded-full pl-3 pr-4 py-3 shadow-2xl hover:bg-navy-light transition-colors"
        aria-label={isOpen ? 'Close Poddar Ji' : 'Ask Poddar Ji'}
      >
        <div className="w-7 h-7 bg-gold rounded-full flex items-center justify-center flex-shrink-0">
          <AnimatePresence mode="wait" initial={false}>
            {isOpen ? (
              <motion.span key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                <ChevronDown size={14} className="text-navy" />
              </motion.span>
            ) : (
              <motion.span key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
                <Sparkles size={14} className="text-navy" />
              </motion.span>
            )}
          </AnimatePresence>
        </div>
        <div className="hidden sm:flex flex-col items-start leading-none">
          <span className="text-[9px] text-white/55 uppercase tracking-wider mb-0.5">AI Advisor</span>
          <span className="text-[12px] font-bold">{isOpen ? 'Close chat' : 'Ask Poddar Ji'}</span>
        </div>
        <span className="sm:hidden text-[12px] font-bold">PJ</span>
      </motion.button>
    </div>
  )
}
