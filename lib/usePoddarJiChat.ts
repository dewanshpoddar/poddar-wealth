'use client'
import { useState, useRef, useEffect } from 'react'

export type Message = { from: 'bot' | 'user'; text: string }

const FALLBACK: Record<string, string> = {
  term:       'A term plan (like LIC Jeevan Amar) gives the highest life cover at the lowest premium. For a 35-year-old, ₹50L cover costs roughly ₹4,000–5,000/quarter. For an exact quote, call Ajay sir at 9415313434.',
  health:     'Star Health offers excellent family floater plans from ~₹8,000/year for a family of 4. Cashless at 14,000+ hospitals. Call 9415313434 for the best plan.',
  retirement: 'LIC Jeevan Shanti and Jeevan Akshay are excellent pension plans. Starting at 30–35 with ₹10,000/month can build ₹1Cr+ by 60. Call 9415313434 for a personalised plan.',
  child:      'LIC Jeevan Tarun is built for children\'s education and marriage. Starting early gives maximum benefit — approx ₹5,000–8,000/quarter for ₹10L maturity. Call 9415313434.',
  claim:      'LIC claim: submit death certificate, policy docs, and claim form to branch. Ajay sir personally assists every step. Most claims settle in 30–45 days. Call 9415313434.',
  mdrt:       'MDRT (Million Dollar Round Table) is the world\'s most prestigious insurance award — only the top 1% qualify. Ajay sir is an MDRT member, so you get world-class advice.',
  default:    'Main Poddar Ji hun — Poddar Wealth Management ka AI advisor. LIC, Star Health, retirement, ya kisi bhi insurance topic par Hindi ya English mein sawaal puchiye. Personalized advice ke liye call karein: 9415313434.',
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

export function usePoddarJiChat(greeting: string) {
  const [messages, setMessages] = useState<Message[]>([{ from: 'bot', text: greeting }])
  const [input, setInput]       = useState('')
  const [typing, setTyping]     = useState(false)
  const bottomRef               = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (messages.length > 1 || typing) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }
  }, [messages, typing])

  const sendMessage = async (preset?: string) => {
    const text = preset || input.trim()
    if (!text || typing) return
    setInput('')

    const updated: Message[] = [...messages, { from: 'user', text }]
    setMessages(updated)
    setTyping(true)

    try {
      const res  = await fetch('/api/chat', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          messages: updated.map(m => ({
            role:    m.from === 'user' ? 'user' : 'assistant',
            content: m.text,
          })),
        }),
      })
      const data = await res.json()
      setMessages(prev => [...prev, { from: 'bot', text: data.reply || getFallback(text) }])
    } catch {
      setMessages(prev => [...prev, { from: 'bot', text: getFallback(text) }])
    } finally {
      setTyping(false)
    }
  }

  return { messages, input, setInput, typing, sendMessage, bottomRef }
}
