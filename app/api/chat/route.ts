import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

// Swap model via env var — default to Sonnet for quality
const CHAT_MODEL = (process.env.CHAT_MODEL || 'claude-sonnet-4-6') as Parameters<typeof client.messages.create>[0]['model']

const SYSTEM_PROMPT = `You are Poddar Ji — the AI insurance advisor for Poddar Wealth Management, Gorakhpur, UP, India. Run by Ajay Kumar Poddar since 1994. MDRT member, LIC Chairman's Club awardee.

Products:
- LIC of India: Jeevan Amar (term), New Jeevan Anand (endowment), Jeevan Umang (whole life), Jeevan Tarun (child), Jeevan Shanti / Jeevan Akshay (pension), money-back, ULIP
- Star Health Insurance: family floater, individual, senior citizen, accident plans

Your style:
- Warm, trustworthy, like a knowledgeable family friend — not a salesperson
- Reply in the same language the user writes in (Hindi in Devanagari or English, or Hinglish)
- Keep replies concise — 3–5 sentences. Be specific, not generic.
- Never quote exact premiums — say "roughly" or "approximately" and direct to Ajay sir for exact figures
- After giving advice, gently suggest calling 9415313434 for a personalised plan
- Do not discuss stocks, mutual funds, or crypto
- For claim queries: reassure them, explain the simple process, offer Ajay sir's personal help
- If someone shares personal details (age, income, family size), use them to give a more specific recommendation`

// ── Google Sheets logger (fire-and-forget) ─────────────────────────────────
async function logToSheets(sessionId: string, userMsg: string, botReply: string) {
  const url = process.env.GOOGLE_SHEETS_WEBHOOK_URL
  if (!url) return
  try {
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        intent: 'Chat Log',
        row: [
          new Date().toISOString(),
          sessionId,
          userMsg,
          botReply,
          '',   // email — blank for chat logs
          '',   // city
          '',   // profession
          '',   // wantTo
          '',   // iAm
          'Chat Log',
          '',   // experience
          '',   // message
        ],
      }),
    })
  } catch {
    // Non-critical — never block the chat response
  }
}

// ── Route handler ──────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const { messages, sessionId } = await req.json()

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 })
    }

    const response = await client.messages.create({
      model:      CHAT_MODEL,
      max_tokens: 400,
      system:     SYSTEM_PROMPT,
      messages,
    })

    const reply = response.content[0].type === 'text' ? response.content[0].text : ''

    // Log last user message + reply (non-blocking)
    const lastUser = [...messages].reverse().find((m: any) => m.role === 'user')
    if (lastUser && sessionId) {
      logToSheets(sessionId, lastUser.content, reply)
    }

    return NextResponse.json({ reply })
  } catch (error: any) {
    console.error('Chat API error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
