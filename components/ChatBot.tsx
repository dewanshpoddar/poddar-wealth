'use client'
import { motion } from 'framer-motion'
import { Send } from 'lucide-react'
import { useLang } from '@/lib/LangContext'
import { usePoddarJiChat } from '@/lib/usePoddarJiChat'

function TypingDots() {
  return (
    <div className="flex gap-1 items-center h-3">
      {[0, 150, 300].map(delay => (
        <div key={delay} className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: `${delay}ms` }} />
      ))}
    </div>
  )
}

function ChatWindow({ compact = false }: { compact?: boolean }) {
  const { t } = useLang()
  const chat = usePoddarJiChat(t.chatbot.greeting)

  return (
    <div className={`bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col ${compact ? 'h-[460px]' : 'h-[520px]'}`}>
      {/* Header */}
      <div className="bg-navy px-5 py-4 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gold flex items-center justify-center text-navy text-[12px] font-bold flex-shrink-0">PJ</div>
          <div>
            <div className="text-white text-[14px] font-bold leading-none">Poddar Ji</div>
            <div className="flex items-center gap-1.5 mt-1">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              <span className="text-white/55 text-[11px]">{t.chatbot.statusText}</span>
            </div>
          </div>
        </div>
        <div className="hidden sm:flex gap-1.5 flex-wrap justify-end">
          {t.chatbot.badges.map((b: string, i: number) => (
            <span key={i} className="text-[9px] px-2 py-0.5 rounded-full border border-white/10 text-white/45">{b}</span>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ background: 'rgb(248 250 252 / 0.5)' }}>
        {chat.messages.map((m, i) => (
          <div key={i} className={`flex gap-2 ${m.from === 'user' ? 'flex-row-reverse' : ''}`}>
            {m.from === 'bot' && (
              <div className="w-6 h-6 rounded-full bg-navy flex items-center justify-center text-[8px] font-bold text-gold flex-shrink-0 mt-0.5">PJ</div>
            )}
            <div className={`max-w-[78%] px-3.5 py-2.5 rounded-2xl text-[13px] leading-relaxed ${
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
        {chat.typing && (
          <div className="flex gap-2">
            <div className="w-6 h-6 rounded-full bg-navy flex items-center justify-center text-[8px] font-bold text-gold flex-shrink-0">PJ</div>
            <div className="bg-white border border-slate-100 rounded-2xl rounded-bl-sm px-3.5 py-3 shadow-sm">
              <TypingDots />
            </div>
          </div>
        )}
        <div ref={chat.bottomRef} />
      </div>

      {/* Quick chips */}
      <div className="px-4 py-2.5 flex gap-2 overflow-x-auto scrollbar-hide border-t border-slate-100 flex-shrink-0">
        {t.chatbot.chips.map((chip: string, i: number) => (
          <button
            key={i}
            onClick={() => chat.sendMessage(t.chatbot.chipQueries[i])}
            className="flex-shrink-0 text-[11px] px-3 py-1 rounded-full bg-navy/5 text-navy border border-navy/10 hover:bg-navy hover:text-white transition-all whitespace-nowrap"
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="px-4 pb-4 pt-2 border-t border-slate-100 flex-shrink-0">
        <div className="flex gap-2 bg-slate-50 rounded-xl border border-slate-200 p-1">
          <input
            type="text"
            value={chat.input}
            onChange={e => chat.setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); chat.sendMessage() } }}
            placeholder={t.chatbot.placeholder}
            className="flex-1 bg-transparent text-[13px] px-2 outline-none text-slate-700 placeholder:text-slate-400"
          />
          <button
            onClick={() => chat.sendMessage()}
            disabled={!chat.input.trim() || chat.typing}
            className="w-9 h-9 bg-navy rounded-lg flex items-center justify-center disabled:opacity-30 hover:bg-navy-light transition-colors flex-shrink-0"
          >
            <Send size={14} className="text-white" />
          </button>
        </div>
        <p className="text-[10px] text-slate-400 text-center mt-2 leading-snug">{t.chatbot.disclaimer}</p>
      </div>
    </div>
  )
}

export default function ChatBot() {
  const { t } = useLang()

  const trustPoints = [
    { icon: '🇮🇳', text: 'Answers in Hindi & English' },
    { icon: '🏆', text: 'MDRT-level expertise built in' },
    { icon: '⚡', text: 'Instant replies, available 24/7' },
  ]

  return (
    <section className="py-20 lg:py-24 bg-white border-t border-slate-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-8">
        <div className="grid lg:grid-cols-2 gap-14 xl:gap-20 items-center">

          {/* ── Left: copy ── */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-2 mb-6">
              <span className="w-8 h-px bg-gold" />
              <span className="text-[11px] font-bold text-gold uppercase tracking-[0.25em]">{t.chatbot.eyebrow}</span>
            </div>

            <h2 className="font-display text-[36px] md:text-[44px] font-bold text-navy leading-tight mb-4">
              Ask <span className="text-gold">Poddar Ji</span>
            </h2>

            <p className="text-[15px] text-slate-500 leading-relaxed max-w-md mb-10">
              {t.chatbot.subtitle}
            </p>

            <div className="space-y-4 mb-10">
              {trustPoints.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-8 h-8 rounded-lg bg-navy/5 flex items-center justify-center text-[16px] flex-shrink-0">{item.icon}</div>
                  <span className="text-[14px] font-medium text-slate-700">{item.text}</span>
                </motion.div>
              ))}
            </div>

            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">{t.chatbot.topicsLabel}</p>
              <div className="flex flex-wrap gap-2">
                {t.chatbot.topics.slice(0, 4).map((topic: string, i: number) => (
                  <span
                    key={i}
                    className="text-[12px] px-3 py-1.5 rounded-full bg-navy/5 text-navy border border-navy/10 cursor-default select-none"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>

          {/* ── Right: live chat window ── */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <ChatWindow />
          </motion.div>

        </div>
      </div>
    </section>
  )
}
