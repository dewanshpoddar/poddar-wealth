'use client'
import { useState, useRef, useEffect } from 'react'

export type Message = {
  from:  'bot' | 'user'
  text:  string
  card?: 'lead' | 'lead_done' | 'lead_skip'
}

// ── Fallback responses (when API fails) ────────────────────────────────────
const FALLBACK: Record<string, string> = {
  term:       'Term plan (jaise LIC Jeevan Amar) mein sirf pure protection milti hai — premium sabse kam hota hai. 30 saal ke liye ₹50L cover roughly ₹4,200-5,500/saal. Exact quote ke liye Ajay sir se milein: 9415313434.',
  health:     'Star Health Family Health Optima plan 4 logo ke liye roughly ₹10,000-14,000/saal mein ₹5L cover deta hai. 14,000+ cashless hospitals. Call 9415313434.',
  retirement: 'LIC Jeevan Shanti aur Jeevan Umang retirement ke liye bahut acche hain. 35 saal mein ₹10,000/month se shuru karke 60 tak ₹1Cr+ ban sakta hai. Call 9415313434.',
  child:      'LIC Jeevan Tarun baccho ki padhai aur shaadi ke liye best hai. 4 options hain survival benefit ke liye. Jaldi start karne par zyada benefit milta hai. Call 9415313434.',
  claim:      'LIC claim: death certificate, policy documents aur claim form LIC branch mein submit karein. Ajay sir har claim mein personally help karte hain. 30-45 din mein settle hota hai. Call 9415313434.',
  mdrt:       'MDRT (Million Dollar Round Table) duniya ka sabse prestigious insurance award hai — sirf top 1% agents qualify karte hain. Ajay sir MDRT member hain, isliye aapko world-class advice milti hai.',
  default:    'Main Poddar Ji hun — Poddar Wealth Management ka AI advisor. LIC, Star Health, retirement, ya kisi bhi insurance topic par sawaal puchiye. Personalized advice ke liye: 9415313434.',
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

// ── Dynamic follow-up chips based on bot reply content ─────────────────────
export function getFollowUps(reply: string): string[] {
  const l = reply.toLowerCase()
  if (l.includes('term') || l.includes('jeevan amar') || l.includes('yuva term')) {
    return ['Premium kitna hoga?', 'Smoker ke liye kya?', 'Claim kaise karein?']
  }
  if (l.includes('health') || l.includes('star health') || l.includes('floater')) {
    return ['Cashless hospitals Gorakhpur mein?', 'Senior citizen plan?', 'Family vs individual?']
  }
  if (l.includes('pension') || l.includes('retirement') || l.includes('jeevan shanti') || l.includes('jeevan umang')) {
    return ['Monthly kitna milega?', '₹10,000/month invest karein?', 'NPS se compare?']
  }
  if (l.includes('child') || l.includes('tarun') || l.includes('bacch') || l.includes('education')) {
    return ['Premium kitna hoga?', 'Maturity kab milegi?', 'PWB rider kya hai?']
  }
  if (l.includes('endowment') || l.includes('jeevan anand') || l.includes('jeevan labh')) {
    return ['Returns kitne honge?', 'Loan mil sakta hai?', 'Surrender value?']
  }
  if (l.includes('claim') || l.includes('document') || l.includes('settlement')) {
    return ['Documents kya chahiye?', 'Online claim ho sakta hai?', 'Timeline kitni?']
  }
  if (l.includes('tax') || l.includes('80c') || l.includes('section')) {
    return ['Kitna tax bachega?', 'Best tax-saving plan?', 'ULIP vs endowment?']
  }
  return ['Aur detail batayein', 'Mera plan suggest karein', 'Ajay sir se baat karein']
}

// ── Lead card injected after 3 user messages ───────────────────────────────
const LEAD_PROMPT: Message = {
  from: 'bot',
  text: 'Lagta hai aap apni planning ke baare mein serious hain! 🎯\n\nChaahein toh Ajay sir aapko personally call karein — bilkul free, koi pressure nahi.',
  card: 'lead',
}

// ── Session helpers ────────────────────────────────────────────────────────
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

// ── Main hook ──────────────────────────────────────────────────────────────
export function usePoddarJiChat(greeting: string) {
  const [sessionId]  = useState(getOrCreateSessionId)
  const [messages, setMessages] = useState<Message[]>(() => loadSavedMessages(greeting))
  const [input, setInput]       = useState('')
  const [typing, setTyping]     = useState(false)
  const [leadDone, setLeadDone] = useState(false)
  const [followUps, setFollowUps] = useState<string[]>([])
  const bottomRef               = useRef<HTMLDivElement>(null)

  // Persist messages across popup open/close within same browser session
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
    setFollowUps([])

    const updated: Message[] = [...messages, { from: 'user', text }]
    setMessages(updated)
    setTyping(true)

    try {
      // Minimum 800ms typing delay so it feels like the bot is reading + thinking
      const [res] = await Promise.all([
        fetch('/api/chat', {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body:    JSON.stringify({
            sessionId,
            messages: updated
              .filter(m => !m.card)
              .map(m => ({ role: m.from === 'user' ? 'user' : 'assistant', content: m.text })),
          }),
        }),
        new Promise<void>(r => setTimeout(r, 800)),
      ])

      if (!res.ok || !res.body) throw new Error('API error')

      const reader  = res.body.getReader()
      const decoder = new TextDecoder()

      // Switch from typing dots to streaming text
      setTyping(false)
      setMessages(prev => [...prev, { from: 'bot', text: '' }])

      let fullText = ''
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        fullText += decoder.decode(value, { stream: true })
        const snapshot = fullText
        setMessages(prev => {
          const msgs = [...prev]
          msgs[msgs.length - 1] = { from: 'bot', text: snapshot }
          return msgs
        })
      }

      // Dynamic follow-up chips based on the reply
      setFollowUps(getFollowUps(fullText))

      // Lead card injection after exactly 3 user messages
      const userCount  = updated.filter(m => m.from === 'user').length
      const hasLeadCard = updated.some(m => m.card)
      if (userCount >= 3 && !hasLeadCard && !leadDone) {
        setTimeout(() => setMessages(prev => [...prev, LEAD_PROMPT]), 1200)
      }
    } catch {
      setTyping(false)
      const fallback = getFallback(text)
      setMessages(prev => {
        const msgs = [...prev]
        // Fill in-progress streaming message if empty, otherwise append
        if (msgs[msgs.length - 1]?.from === 'bot' && msgs[msgs.length - 1]?.text === '') {
          msgs[msgs.length - 1] = { from: 'bot', text: fallback }
          return msgs
        }
        return [...msgs, { from: 'bot', text: fallback }]
      })
    }
  }

  return {
    messages, input, setInput, typing,
    sendMessage, bottomRef,
    leadDone, dismissLeadCard, markLeadCaptured,
    followUps,
    sessionId,
  }
}
