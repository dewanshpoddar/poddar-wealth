'use client'
import { motion } from 'framer-motion'
import { useLang } from '@/lib/LangContext'
import { usePoddarJiChat } from '@/lib/usePoddarJiChat'
import PoddarJiChatUI from '@/components/base/PoddarJiChatUI'

function ChatWindow() {
  const { t } = useLang()
  const chat = usePoddarJiChat(t.chatbot.greeting)

  return (
    <PoddarJiChatUI
      chat={chat}
      chips={t.chatbot.chips}
      chipQueries={t.chatbot.chipQueries}
      placeholder={t.chatbot.placeholder}
      disclaimer={t.chatbot.disclaimer}
      badges={t.chatbot.badges}
      statusText={t.chatbot.statusText}
      onClearChat={chat.clearChat}
    />
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
