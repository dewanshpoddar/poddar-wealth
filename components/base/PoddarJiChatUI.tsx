'use client'
import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { Send, CheckCircle2, Phone, User, MessageCircle } from 'lucide-react'
import { usePoddarJiChat } from '@/lib/usePoddarJiChat'
import { submitLead } from '@/lib/api'

const WHATSAPP_URL = `https://wa.me/919415313434?text=${encodeURIComponent('Namaste Ajay sir, main Poddar Ji se baat kar raha tha aur aapse directly baat karna chahta hun.')}`

// ── Typing dots ──────────────────────────────────────────────────────────────
function TypingDots() {
  return (
    <div className="flex gap-1 items-center h-3">
      {[0, 150, 300].map(d => (
        <div key={d} className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: `${d}ms` }} />
      ))}
    </div>
  )
}

// ── Inline lead-capture card ─────────────────────────────────────────────────
function LeadCard({ onCaptured, onSkip }: { onCaptured: () => void; onSkip: () => void }) {
  const [name, setName]         = useState('')
  const [phone, setPhone]       = useState('')
  const [status, setStatus]     = useState<'idle' | 'loading' | 'done' | 'error'>('idle')
  const [phoneErr, setPhoneErr] = useState('')

  const submit = async () => {
    const digits = phone.replace(/\D/g, '')
    if (digits.length !== 10) { setPhoneErr('10 अंक का नंबर डालें'); return }
    if (!name.trim()) return
    setPhoneErr('')
    setStatus('loading')
    try {
      await submitLead({ name, mobile: digits, intent: 'Chat Lead Capture' })
      setStatus('done')
      setTimeout(onCaptured, 1800)
    } catch {
      setStatus('error')
    }
  }

  if (status === 'done') {
    return (
      <div className="flex items-center gap-2 text-green-700 text-[12px] font-medium py-1">
        <CheckCircle2 size={16} className="flex-shrink-0" />
        हो गया! अजय सर जल्द call करेंगे।
      </div>
    )
  }

  return (
    <div className="mt-3 space-y-2">
      <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2">
        <User size={12} className="text-slate-400 flex-shrink-0" />
        <input
          type="text"
          placeholder="आपका नाम"
          value={name}
          onChange={e => setName(e.target.value)}
          className="flex-1 bg-transparent text-[12px] outline-none text-slate-700 placeholder:text-slate-400"
        />
      </div>

      <div>
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2">
          <Phone size={12} className="text-slate-400 flex-shrink-0" />
          <input
            type="tel"
            placeholder="मोबाइल नंबर"
            value={phone}
            onChange={e => { setPhoneErr(''); setPhone(e.target.value.replace(/\D/g, '').slice(0, 10)) }}
            inputMode="numeric"
            maxLength={10}
            className="flex-1 bg-transparent text-[12px] outline-none text-slate-700 placeholder:text-slate-400"
          />
        </div>
        {phoneErr && <p className="text-red-500 text-[10px] mt-1 px-1">{phoneErr}</p>}
      </div>

      {status === 'error' && (
        <p className="text-red-500 text-[10px] px-1">कुछ गड़बड़ हुई। सीधे call करें: 9415313434</p>
      )}

      <button
        onClick={submit}
        disabled={status === 'loading' || !name.trim() || !phone}
        className="w-full bg-gold text-navy text-[12px] font-bold py-2 rounded-xl hover:bg-gold/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-1.5"
      >
        <Phone size={12} />
        {status === 'loading' ? 'भेज रहे हैं…' : 'Callback Request करें →'}
      </button>

      <button
        onClick={onSkip}
        className="w-full text-[10px] text-slate-400 hover:text-slate-600 transition-colors text-center pt-0.5"
      >
        अभी नहीं
      </button>
    </div>
  )
}

// ── Streaming cursor ─────────────────────────────────────────────────────────
function StreamingCursor() {
  return <span className="inline-block w-0.5 h-3 bg-slate-400 ml-0.5 animate-pulse align-middle" />
}

// ── Bot message with markdown ────────────────────────────────────────────────
function BotText({ text, isStreaming }: { text: string; isStreaming: boolean }) {
  return (
    <div className="text-[12px] leading-relaxed prose prose-sm max-w-none
      prose-p:my-0.5 prose-ul:my-1 prose-li:my-0 prose-strong:text-navy
      prose-p:text-slate-700 prose-li:text-slate-700">
      <ReactMarkdown>{text}</ReactMarkdown>
      {isStreaming && <StreamingCursor />}
    </div>
  )
}

// ── Main shared chat UI ──────────────────────────────────────────────────────
interface PoddarJiChatUIProps {
  chat: ReturnType<typeof usePoddarJiChat>
  chips: string[]
  chipQueries: string[]
  placeholder: string
  disclaimer: string
  badges: string[]
  statusText: string
  compact?: boolean
}

export default function PoddarJiChatUI({
  chat, chips, chipQueries, placeholder, disclaimer, badges, statusText, compact = false,
}: PoddarJiChatUIProps) {
  const lastMsg    = chat.messages[chat.messages.length - 1]
  const isLastBot  = lastMsg?.from === 'bot'

  // Show dynamic follow-up chips if available, else static
  const activeChips   = chat.followUps?.length ? chat.followUps : chips
  const activeQueries = chat.followUps?.length ? chat.followUps : chipQueries

  // WhatsApp CTA: show after 5 messages OR after lead card is skipped
  const userCount      = chat.messages.filter(m => m.from === 'user').length
  const leadSkipped    = chat.messages.some(m => m.card === 'lead_skip')
  const showWhatsAppCTA = !chat.typing && (userCount >= 5 || leadSkipped) && !chat.leadDone

  return (
    <div
      className={`bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col ${compact ? '' : 'h-[520px]'}`}
      style={compact ? { height: 500 } : undefined}
    >
      {/* Header */}
      <div className="bg-navy px-5 py-3.5 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gold flex items-center justify-center text-navy text-[11px] font-bold flex-shrink-0">PJ</div>
          <div>
            <div className="text-white text-[13px] font-bold leading-none">Poddar Ji</div>
            <div className="flex items-center gap-1.5 mt-1">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              <span className="text-white/55 text-[10px]">{statusText}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 bg-green-500 hover:bg-green-600 text-white text-[10px] font-bold px-2.5 py-1.5 rounded-full transition-colors flex-shrink-0"
            title="Chat with Ajay sir on WhatsApp"
          >
            <MessageCircle size={11} />
            <span className="hidden sm:inline">WhatsApp</span>
          </a>
          <div className="hidden sm:flex gap-1.5 flex-wrap justify-end">
            {badges.map((b, i) => (
              <span key={i} className="text-[9px] px-2 py-0.5 rounded-full border border-white/10 text-white/40">{b}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ background: 'rgb(248 250 252 / 0.5)' }}>
        {chat.messages.map((m, i) => {
          const isUser       = m.from === 'user'
          const isThisLastBot = !isUser && i === chat.messages.length - 1

          if (m.card === 'lead_done') return (
            <div key={i} className="flex gap-2">
              <div className="w-6 h-6 rounded-full bg-navy flex items-center justify-center text-[8px] font-bold text-gold flex-shrink-0 mt-0.5">PJ</div>
              <div className="bg-white border border-green-200 rounded-2xl rounded-bl-sm px-3.5 py-2.5 shadow-sm text-[12px] text-green-700 flex items-center gap-2">
                <CheckCircle2 size={14} /> अजय सर जल्द call करेंगे। धन्यवाद!
              </div>
            </div>
          )

          return (
            <div key={i} className={`flex gap-2 ${isUser ? 'flex-row-reverse' : ''}`}>
              {!isUser && (
                <div className="w-6 h-6 rounded-full bg-navy flex items-center justify-center text-[8px] font-bold text-gold flex-shrink-0 mt-0.5">PJ</div>
              )}
              <div className={`max-w-[80%] ${isUser ? '' : 'flex-1'}`}>
                <div className={`px-3.5 py-2.5 rounded-2xl ${
                  isUser
                    ? 'bg-navy text-white rounded-br-sm text-[12px] leading-relaxed'
                    : 'bg-white text-slate-700 border border-slate-100 rounded-bl-sm shadow-sm'
                }`}>
                  {isUser ? (
                    m.text
                  ) : (
                    <BotText
                      text={m.text}
                      isStreaming={isThisLastBot && chat.streaming && isLastBot}
                    />
                  )}

                  {/* Lead capture card */}
                  {m.card === 'lead' && !chat.leadDone && (
                    <LeadCard onCaptured={chat.markLeadCaptured} onSkip={chat.dismissLeadCard} />
                  )}
                  {m.card === 'lead_skip' && (
                    <p className="text-[10px] text-slate-400 mt-2">कोई बात नहीं! जब चाहें call करें: 9415313434</p>
                  )}
                </div>
              </div>
            </div>
          )
        })}

        {/* Typing indicator */}
        {chat.typing && (
          <div className="flex gap-2">
            <div className="w-6 h-6 rounded-full bg-navy flex items-center justify-center text-[8px] font-bold text-gold flex-shrink-0">PJ</div>
            <div className="bg-white border border-slate-100 rounded-2xl rounded-bl-sm px-3.5 py-3 shadow-sm">
              <TypingDots />
            </div>
          </div>
        )}

        {/* WhatsApp CTA — shows after 5 messages OR after lead card skipped */}
        {showWhatsAppCTA && (
          <div className="flex justify-center">
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 text-[11px] font-semibold px-3.5 py-2 rounded-full hover:bg-green-100 transition-colors"
            >
              <MessageCircle size={13} />
              अजय सर से directly बात करें →
            </a>
          </div>
        )}

        <div ref={chat.bottomRef} />
      </div>

      {/* Quick chips */}
      <div className="px-3 py-2 flex gap-1.5 overflow-x-auto scrollbar-hide border-t border-slate-100 flex-shrink-0">
        {activeChips.map((chip, i) => (
          <button
            key={chip}
            onClick={() => chat.sendMessage(activeQueries[i])}
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
            placeholder={placeholder}
            className="flex-1 bg-transparent text-[12px] px-2 outline-none text-slate-700 placeholder:text-slate-400"
          />
          <button
            onClick={() => chat.sendMessage()}
            disabled={!chat.input.trim() || chat.typing || chat.streaming}
            className="w-8 h-8 bg-navy rounded-lg flex items-center justify-center disabled:opacity-30 hover:bg-navy-light transition-colors flex-shrink-0"
          >
            <Send size={13} className="text-white" />
          </button>
        </div>
        <p className="text-[9px] text-slate-400 text-center mt-1.5 leading-snug">{disclaimer}</p>
      </div>
    </div>
  )
}
