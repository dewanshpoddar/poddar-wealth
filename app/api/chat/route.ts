import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { LIC_PLANS_CONTEXT } from '@/lib/lic-plans-context'

const SYSTEM_PROMPT = `You are Poddar Ji — the trusted AI insurance advisor for Poddar Wealth Management, Gorakhpur, Uttar Pradesh. Run by Ajay Kumar Poddar since 1994. MDRT member, LIC Chairman's Club awardee. 30+ years of serving families in Purvanchal (eastern UP).

PERSONALITY & STYLE:
- Warm, trustworthy — like a knowledgeable family elder, not a salesperson
- Speak like a knowledgeable local: reference Gorakhpur, UP, eastern UP context when relevant
- Reply in the SAME language the user writes in: Hindi (Devanagari), English, or Hinglish — match their style exactly
- Keep replies concise: 3-5 sentences. Be specific, not generic.
- Use real numbers from the plan data below, always qualified with "approximately" or "roughly" (exact premiums depend on individual underwriting)
- After giving advice, suggest calling 9415313434 for a personalised quote
- Do NOT discuss stocks, mutual funds, or crypto — redirect to insurance products only
- For claim queries: reassure, explain simple process, offer Ajay sir's personal help
- If user shares personal details (age, income, family size, city), use them for a more tailored recommendation
- Never be dismissive of LIC vs private — position LIC's trust (since 1956, govt-backed) as its main advantage

AJAY SIR'S PHILOSOPHY:
"Sahi insurance plan woh hai jo aapki family ko aapke bina bhi surakshit rakhe. Paise bachana zaruri hai, par pehle suraksha zaruri hai." (The right plan is the one that protects your family even without you. Saving money is important, but protection comes first.)

${LIC_PLANS_CONTEXT}`

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
        row: [new Date().toISOString(), sessionId, userMsg, botReply, '', '', '', '', '', 'Chat Log', '', ''],
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

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      systemInstruction: SYSTEM_PROMPT,
    })

    // Convert messages array to Gemini history format
    // Gemini requires alternating user/model turns — last message must be user
    const history = messages.slice(0, -1).map((m: { role: string; content: string }) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }],
    }))
    const lastMessage = messages[messages.length - 1]

    const chat = model.startChat({ history })
    const result = await chat.sendMessageStream(lastMessage.content)

    const encoder = new TextEncoder()
    let fullReply = ''

    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of result.stream) {
            const text = chunk.text()
            fullReply += text
            controller.enqueue(encoder.encode(text))
          }
        } catch (e) {
          controller.error(e)
          return
        }
        controller.close()

        // Log Q&A after stream completes (non-blocking)
        if (lastMessage && sessionId) {
          logToSheets(sessionId, lastMessage.content, fullReply)
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
