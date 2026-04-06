'use client'
import React, { useState, useRef, useEffect } from 'react'
import { useLang } from '@/lib/LangContext'

type Message = { from: 'bot' | 'user'; text: string }

const systemPrompt = `You are an AI insurance advisor for Poddar Wealth Management, a respected insurance agency in Gorakhpur, UP, India, run by Ajay Kumar Poddar since 1994. MDRT member, Chairman's Club awardee. Products: LIC (Jeevan Amar, New Jeevan Anand, Jeevan Umang, Jeevan Tarun, Jeevan Shanti, Jeevan Akshay, money-back plans) and Star Health Insurance. Answer warmly in the same language as the user (Hindi in Devanagari or English). Be specific, concise (3-4 sentences), and end with a gentle nudge to call 9415313434. Never make up exact premiums — say "roughly" or "approximately". Do not advise on stocks or mutual funds.`

const fallbackReplies: Record<string, string> = {
  term: 'A term plan (like LIC Jeevan Amar) gives the highest life cover at the lowest premium. For a 35-year-old with ₹50L cover, it costs roughly ₹4,000-5,000/quarter. For an exact quote, please call Ajay sir at 9415313434.',
  health: 'Star Health offers excellent family floater plans starting from ~₹8,000/year for a family of 4. Cashless claims at 14,000+ hospitals. Call Ajay sir at 9415313434 for the best plan for your family.',
  retirement: 'LIC Jeevan Shanti and Jeevan Akshay are excellent pension plans. Starting early (age 30-35) with ₹10,000/month can build a corpus of ₹1Cr+ by 60. Call 9415313434 for a personalized plan.',
  child: 'LIC Jeevan Tarun is designed for children\'s education and marriage. Starting when your child is young gives maximum benefit. Approx ₹5,000-8,000/quarter for ₹10L maturity. Call 9415313434.',
  claim: 'LIC claim process: Submit death certificate, policy docs, and claim form to branch. Ajay sir personally helps with every step. Most claims settle in 30-45 days. Call 9415313434.',
  mdrt: 'MDRT (Million Dollar Round Table) is the most prestigious global recognition for insurance advisors — only the top 1% qualify. Ajay sir is an MDRT member, ensuring you get world-class advice.',
  default: 'Main Poddar Wealth Management ka AI advisor hun. Aap kisi bhi insurance topic par sawaal puch sakte hain — life, health, retirement, child plans. For personalized advice, call Ajay sir at 9415313434.',
}

function getFallbackReply(msg: string): string {
  const lower = msg.toLowerCase()
  if (lower.includes('term') || lower.includes('life') || lower.includes('jeevan amar')) return fallbackReplies.term
  if (lower.includes('health') || lower.includes('medical') || lower.includes('star')) return fallbackReplies.health
  if (lower.includes('retire') || lower.includes('pension') || lower.includes('shanti')) return fallbackReplies.retirement
  if (lower.includes('child') || lower.includes('education') || lower.includes('bachch') || lower.includes('tarun')) return fallbackReplies.child
  if (lower.includes('claim') || lower.includes('dava')) return fallbackReplies.claim
  if (lower.includes('mdrt') || lower.includes('million')) return fallbackReplies.mdrt
  return fallbackReplies.default
}

export default function ChatBot({ fullPage = false }: { fullPage?: boolean }) {
  const { t } = useLang()
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    { from: 'bot', text: t.chatbot.greeting }
  ])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (messages.length > 1 || typing) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }
  }, [messages, typing])

  const sendMessage = async (preset?: string) => {
    const text = preset || input.trim()
    if (!text || typing) return
    setInput('')
    setMessages((prev: Message[]) => [...prev, { from: 'user', text }])
    setTyping(true)
    await new Promise(r => setTimeout(r, 800 + Math.random() * 700))
    setTyping(false)
    setMessages((prev: Message[]) => [...prev, { from: 'bot', text: getFallbackReply(text) }])
  }

  return (
    <>
      {/* Chatbot section on homepage */}
      <section className={`pw-section ${fullPage ? 'min-h-[80vh] flex items-center' : ''}`}>
        <div className={`grid gap-8 w-full ${fullPage ? 'max-w-6xl mx-auto' : ''}`} style={{ gridTemplateColumns: fullPage ? '1fr 1.2fr' : '1fr 420px', alignItems: 'start' }}>
          {/* Left — info */}
          <div>
            <div className="pw-eyebrow">{t.chatbot.eyebrow}</div>
            <div className="pw-title">{t.chatbot.title}</div>
            <div className="pw-subtitle">{t.chatbot.subtitle}</div>
            <div className="text-11 text-gray-500 mb-2">{t.chatbot.topicsLabel}</div>
            <div className="pw-qt-grid">
              {t.chatbot.topics.map((topic: string, i: number) => (
                <div key={i} className="pw-qt" onClick={() => sendMessage(topic)}>{topic}</div>
              ))}
            </div>
          </div>

          {/* Right — chat window */}
          <div className="pw-chat-window">
            {/* Header */}
            <div className="pw-chat-header">
              <div className="flex items-center gap-2.5">
                <div className="pw-chat-avatar">AK</div>
                <div>
                  <div className="pw-chat-name">{t.chatbot.headerName}</div>
                  <div className="pw-chat-status">
                    <span className="pw-chat-dot" />
                    {t.chatbot.statusText}
                  </div>
                </div>
              </div>
              <div className="flex gap-1.5">
                {t.chatbot.badges.map((b: string, i: number) => (
                  <span key={i} className="text-[9px] px-1.5 py-0.5 rounded-pill border-half text-muted" style={{ borderColor: '#2d4a6b' }}>{b}</span>
                ))}
              </div>
            </div>

            {/* Messages */}
            <div className="pw-chat-msgs">
              {messages.map((m, i) => (
                <div key={i} className={`pw-chat-msg ${m.from === 'user' ? 'pw-chat-msg--user' : ''}`}>
                  <div className={`${m.from === 'user' ? 'pw-msg-avatar--user' : ''} pw-msg-avatar`}>
                    {m.from === 'user' ? 'You' : 'AK'}
                  </div>
                  <div className={m.from === 'user' ? 'pw-msg-user' : 'pw-msg-bot'}>
                    {m.text.split('\n').map((line: string, j: number) => (
                      <span key={j}>{line}{j < m.text.split('\n').length - 1 && <br />}</span>
                    ))}
                  </div>
                </div>
              ))}
              {typing && (
                <div className="pw-chat-msg">
                  <div className="pw-msg-avatar">AK</div>
                  <div className="pw-msg-bot pw-msg-thinking">Soch raha hun...</div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Chips */}
            <div className="pw-chat-chips">
              {t.chatbot.chips.map((chip: string, i: number) => (
                <div key={i} className="pw-chat-chip" onClick={() => sendMessage(t.chatbot.chipQueries[i])}>
                  {chip}
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="pw-chat-input-area">
              <textarea
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() } }}
                placeholder={t.chatbot.placeholder}
                rows={1}
                className="pw-chat-input"
              />
              <button
                onClick={() => sendMessage()}
                disabled={!input.trim() || typing}
                className="pw-chat-send"
              >
                Send
              </button>
            </div>

            <div className="pw-chat-disclaimer">{t.chatbot.disclaimer}</div>
          </div>
        </div>
      </section>
    </>
  )
}
