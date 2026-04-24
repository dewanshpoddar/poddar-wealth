import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { LIC_PLANS_CONTEXT } from '@/lib/lic-plans-context'

const MAX_INPUT_CHARS = 500

function buildSystemPrompt() {
  const now = new Date().toLocaleDateString('en-IN', {
    timeZone: 'Asia/Kolkata',
    day: 'numeric', month: 'long', year: 'numeric',
  })
  return `You are Poddar Ji — the trusted AI insurance advisor for Poddar Wealth Management, Gorakhpur, Uttar Pradesh. Run by Ajay Kumar Poddar since 1994. MDRT member, LIC Chairman's Club awardee. 30+ years of serving families in Purvanchal (eastern UP).

TODAY'S DATE: ${now} (Indian Standard Time). Use this when answering time-sensitive questions about deadlines, tax-saving windows, policy anniversaries, etc.

PERSONALITY & STYLE:
- Warm, trustworthy — like a knowledgeable family elder, not a salesperson
- Speak like a knowledgeable local: reference Gorakhpur, UP, eastern UP context when relevant
- Reply in the SAME language the user writes in: Hindi (Devanagari), English, or Hinglish — match their style exactly
- Keep replies concise: 3-5 sentences. Be specific, not generic.
- Use real numbers from the plan data below, always qualified with "approximately" or "roughly" (exact premiums depend on individual underwriting)
- After giving advice, suggest calling 9415313434 for a personalised quote
- Do NOT discuss stocks, mutual funds, or crypto — redirect to insurance products only
- For claim queries (including accidental death, suicide clause after 1 year, disability): reassure, explain the simple LIC process, offer Ajay sir's personal help. These are 100% legitimate insurance questions.
- If user shares personal details (age, income, family size, city), use them for a more tailored recommendation
- Never be dismissive of LIC vs private — position LIC's trust (since 1956, govt-backed) as its main advantage
- If asked something completely unrelated to insurance/finance: politely say you only know about insurance and redirect

AJAY SIR'S PHILOSOPHY:
"Sahi insurance plan woh hai jo aapki family ko aapke bina bhi surakshit rakhe. Paise bachana zaruri hai, par pehle suraksha zaruri hai."

${LIC_PLANS_CONTEXT}`
}

// ── Google Sheets logger (fire-and-forget) ─────────────────────────────────
async function logToSheets(sessionId: string, userMsg: string, botReply: string) {
  const url = process.env.GOOGLE_SHEETS_WEBHOOK_URL
  if (!url) return
  try {
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        intent:    'Chat Log',
        sheetName: 'Chat Logs',
        headers:   ['Timestamp', 'Session ID', 'User Message', 'Bot Reply'],
        row:       [new Date().toISOString(), sessionId, userMsg, botReply],
      }),
    })
  } catch { /* non-critical */ }
}

// ── Streaming route handler ────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const { messages, sessionId } = await req.json()

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 })
    }

    const lastMessage = messages[messages.length - 1]
    if (!lastMessage) return NextResponse.json({ error: 'No message' }, { status: 400 })

    // Input sanitisation — cap at MAX_INPUT_CHARS, strip HTML tags
    const rawContent = String(lastMessage.content || '').replace(/<[^>]*>/g, '').trim()
    const safeContent = rawContent.slice(0, MAX_INPUT_CHARS)
    if (!safeContent) return NextResponse.json({ error: 'Empty message' }, { status: 400 })

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash',
      systemInstruction: buildSystemPrompt(),
    })

    // Convert to Gemini history format — MUST use 'model' not 'assistant'
    const history = messages.slice(0, -1).map((m: { role: string; content: string }) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: String(m.content || '').slice(0, MAX_INPUT_CHARS) }],
    }))

    const chat = model.startChat({ history })

    // Retry once on 429 rate-limit with 2s back-off
    let result
    try {
      result = await chat.sendMessageStream(safeContent)
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : ''
      if (msg.includes('429')) {
        await new Promise(r => setTimeout(r, 2000))
        result = await chat.sendMessageStream(safeContent)
      } else {
        throw e
      }
    }

    const encoder = new TextEncoder()
    let fullReply = ''

    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of result.stream) {
            const text = chunk.text()
            // Safety filter: Gemini returns empty string when blocked
            if (text) {
              fullReply += text
              controller.enqueue(encoder.encode(text))
            }
          }
        } catch (e) {
          controller.error(e)
          return
        }

        // If Gemini returned nothing (safety filter blocked), send a graceful fallback
        if (!fullReply) {
          const fallback = 'Yeh sawaal thoda sensitive lag raha hai — main insurance ke baare mein hi baat kar sakta hun. Koi LIC ya health plan ke baare mein puchiye, ya Ajay sir se directly baat karein: 9415313434.'
          fullReply = fallback
          controller.enqueue(encoder.encode(fallback))
        }

        controller.close()

        if (sessionId) {
          logToSheets(sessionId, safeContent, fullReply)
        }
      },
    })

    return new Response(readable, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    })
  } catch (error: unknown) {
    console.error('Chat API error:', error)
    const msg = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
