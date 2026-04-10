'use client'
import { useState, useRef, useEffect } from 'react'

export type Message = {
  from:  'bot' | 'user'
  text:  string
  card?: 'lead' | 'lead_done' | 'lead_skip'
}

const FALLBACK: Record<string, string> = {
  term:       'A term plan (like LIC Jeevan Amar) gives the highest life cover at the lowest premium. For a 35-year-old, ₹50L cover costs roughly ₹4,000–5,000/quarter. For an exact quote, call Ajay sir at 9415313434.',
  health:     'Star Health offers excellent family floater plans from ~₹8,000/year for a family of 4. Cashless at 14,000+ hospitals. Call 9415313434 for the best plan.',
  retirement: 'LIC Jeevan Shanti and Jeevan Akshay are excellent pension plans. Starting at 30–35 with ₹10,000/month can build ₹1Cr+ by 60. Call 9415313434 for a personalised plan.',
  child:      'LIC Jeevan Tarun is built for children\'s education and marriage. Starting early gives maximum benefit — approx ₹5,000–8,000/quarter for ₹10L maturity. Call 9415313434.',
  claim:      'LIC claim: submit death certificate, policy docs, and claim form to branch. Ajay sir personally assists every step. Most claims settle in 30–45 days. Call 9415313434.',
  mdrt:       'MDRT (Million Dollar Round Table) is the world\'s most prestigious insurance award — only top 1% qualify. Ajay sir is an MDRT member, so you get world-class advice.',
  default:    'Main Poddar Ji hun — Poddar Wealth Management ka AI advisor. LIC, Star Health, retirement, ya kisi bhi insurance topic par sawaal puchiye. Personalized advice: 9415313434.',
}

function getFallback(msg: string): string {
  const l = msg.toLowerCase()
  if (l.includes('term') || l.includes('life') || l.includes('jeevan amar')) return FALLBACK.term
  if (l.includes('health') || l.includes('medical') || l.includes('star'))    return FALLBACK.health
  if (l.includes('retire') || l.includes('pension') || l.includes('shanti'))  return FALLBACK.retirement
  if (l.includes('child') || l.includes('education') || l.includes('bachch') || l.includes('tarun')) return FALLBACK.child
  if (l.includes('claim') || l.includes('dava'))                               return FALLBACK.claim
  if (l.includes('mdrt') || l.includes('million'))                             return FALLBACK.mdrt
  return FALLBACK.default
}

// Lead card prompt injected after 3 user messages
const LEAD_PROMPT: Message = {
  from: 'bot',
  text: 'Lagta hai aap apni planning ke baare mein serious hain! 🎯\n\nChaahein toh Ajay sir aapko personally call karein — bilkul free, koi pressure nahi.',
  card: 'lead',
}

function getOrCreateSessionId(): string {
  if (typeof window === 'undefined') return 'ssr'
  let id = sessionStorage.getItem('poddarji_sid')
  if (!id) {
    id = `pj_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
    sessionStorage.setItem('poddarji_sid', id)
  }
  return id
}

function loadSavedMessages(greeting: string): Message[] {
  if (typeof window === 'undefined') return [{ from: 'bot', text: greeting }]
  try {
    const saved = sessionStorage.getItem('poddarji_msgs')
    if (saved) return JSON.parse(saved)
  } catch { /* ignore */ }
  return [{ from: 'bot', text: greeting }]
}

export function usePoddarJiChat(greeting: string) {
  const [sessionId] = useState(getOrCreateSessionId)
  const [messages, setMessages] = useState<Message[]>(() => loadSavedMessages(greeting))
  const [input, setInput]       = useState('')
  const [typing, setTyping]     = useState(false)
  const [leadDone, setLeadDone] = useState(false)
  const bottomRef               = useRef<HTMLDivElement>(null)

  // Persist messages across popup close/open in same session
  useEffect(() => {
    if (typeof window === 'undefined') return
    try { sessionStorage.setItem('poddarji_msgs', JSON.stringify(messages)) } catch { /* ignore */ }
  }, [messages])

  // Auto-scroll
  useEffect(() => {
    if (messages.length > 1 || typing) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }
  }, [messages, typing])

  const dismissLeadCard = () => {
    setMessages(prev => prev.map(m => m.card === 'lead' ? { ...m, card: 'lead_skip' } : m))
  }

  const markLeadCaptured = () => {
    setLeadDone(true)
    setMessages(prev => prev.map(m => m.card === 'lead' ? { ...m, card: 'lead_done' } : m))
  }

  const sendMessage = async (preset?: string) => {
    const text = preset || input.trim()
    if (!text || typing) return
    setInput('')

    const updated: Message[] = [...messages, { from: 'user', text }]
    setMessages(updated)
    setTyping(true)

    try {
      const res = await fetch('/api/chat', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          sessionId,
          messages: updated
            .filter(m => !m.card)                         // strip card messages from API context
            .map(m => ({ role: m.from === 'user' ? 'user' : 'assistant', content: m.text })),
        }),
      })
      const data = await res.json()
      const reply = data.reply || getFallback(text)
      const botMsg: Message = { from: 'bot', text: reply }
      const next = [...updated, botMsg]
      setMessages(next)

      // Inject lead card after exactly 3 user exchanges (and only once)
      const userCount = next.filter(m => m.from === 'user').length
      const hasLeadCard = next.some(m => m.card)
      if (userCount === 3 && !hasLeadCard && !leadDone) {
        setTimeout(() => setMessages(prev => [...prev, LEAD_PROMPT]), 1200)
      }
    } catch {
      setMessages(prev => [...prev, { from: 'bot', text: getFallback(text) }])
    } finally {
      setTyping(false)
    }
  }

  return {
    messages, input, setInput, typing,
    sendMessage, bottomRef,
    leadDone, dismissLeadCard, markLeadCaptured,
    sessionId,
  }
}
