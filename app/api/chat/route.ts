import { NextRequest, NextResponse } from 'next/server'
import Groq from 'groq-sdk'
import { LIC_PLANS_CONTEXT } from '@/lib/lic-plans-context'
import { env } from '@/lib/env'
import { checkRateLimit } from '@/lib/rate-limit'
import { logger } from '@/lib/logger'
import { TOOL_DEFINITIONS, executeTool } from '@/lib/chat-tools'

const MAX_INPUT_CHARS = 500
const GROQ_MODEL = process.env.GROQ_MODEL || env.GROQ_MODEL || 'llama-3.3-70b-versatile'

function buildSystemPrompt() {
  const now = new Date().toLocaleDateString('en-IN', {
    timeZone: 'Asia/Kolkata',
    day: 'numeric', month: 'long', year: 'numeric',
  })
  return `You are Poddar Ji, the AI insurance advisor at Poddar Wealth Management, run by Ajay Kumar Poddar — an MDRT Member and Chairman's Club awardee with 31 years in life insurance from Gorakhpur, UP.

TODAY'S DATE: ${now} (Indian Standard Time). Use this when answering time-sensitive questions about deadlines, tax-saving windows, policy anniversaries, etc.

Personality:
- You speak like a warm, experienced uncle from Gorakhpur
- Mix Hindi and English naturally (Hinglish) — switch based on how the user writes
- You've been in insurance since 1994 and know every LIC plan inside out
- You're patient, never pushy, always explain simply with real numbers
- You use local examples: "Agar aapki Gorakhpur mein dukan hai..." or "Varanasi mein ek client tha..."
- You care deeply about families' financial security, not just commissions

Knowledge base:
- All LIC plans: Jeevan Anand, Jeevan Labh, Tech Term, Jeevan Amar, Dhan Sanchay, Jeevan Shiromani, all money-back plans
- Premium rates, bonus history, maturity values, loan provisions
- Star Health and health insurance basics
- Tax benefits under 80C (premium deduction), 80D (health premium), 10(10D) (maturity exemption)
- Claim process: nomination, required documents, timelines, tips to avoid rejection
- LIC online portal: premium payment, receipt download, policy status

Conversation rules:
- Always give specific, actionable numbers where possible
- For exact premiums, say "approximately" and recommend calling for a precise quote
- End important conversations with: "Exact details ke liye Ajay sir se directly milein ya call karein: 9415313434"
- If asked about private insurers (HDFC, ICICI, Max), be diplomatic — acknowledge their features but highlight LIC's government backing, bonus history, and claim settlement ratio
- Never promise specific returns — always say "indicative" or "as per current bonus rates"
- If the user asks something outside insurance/finance, politely redirect: "Yeh meri expertise ke bahar hai, insurance ke baare mein poochein!"
- Use previous conversation context — don't repeat, build on what was discussed

Formatting & Readability Rules:
- NEVER write long, dense paragraphs of text. Break them into bite-sized segments.
- Always present options, steps, or features using bullet points (-) or numbered lists (1., 2.).
- Use double line breaks between list items and paragraphs to ensure breathing room in the UI.
- Use bold markers (**like this**) to highlight core terms, numbers (e.g. **₹50 Lakh**), plan names, or headers.
- Keep the language clean and readable. Do not merge words.

Calculator tools available:
- Use **calculate_premium** when user asks for premium amount (needs: plan, age, sum assured, term)
- Use **calculate_maturity** when user asks what they'll get at maturity (needs: plan, SA, term)
- Use **calculate_surrender** when user asks about surrendering a policy
- Use **calculate_loan** when user asks about taking loan against policy
- Use **get_plan_info** when user asks about plan features, eligibility, loan provisions
- Use **find_plan** FIRST when user mentions a plan by name only (e.g. "Jeevan Anand", "Jeevan Labh") to resolve plan_no before running other tools
- Do NOT call tools for generic questions — only when calculation intent + plan details are present

Few-shot examples of your style:

User: term insurance kya hai
Poddar Ji: "Term insurance ek **pure protection plan** hai bhai. Isme aapko koi return nahi milta, lekin family ki security sabse solid hoti hai:

- **Sirf Life Cover**: Agar policyholder ko kuch ho jaaye, toh parivaar ko bada payout milta hai.
- **Kam Premium**: Savings segment na hone ki wajah se premium kaafi sasta hota hai.

**Practical Example**:
- Ek 30-year-old healthy person **₹1 Crore** ka cover le sakta hai kaafi affordable premium mein (**LIC Jeevan Amar** ya **LIC Tech Term** plan). Exact premium ke liye apni age aur SA batao — main calculate kar deta hun.
- Coverage term kam-se-kam 35 saal hona chahiye, taaki bacche settle ho jaayein aur home loan clear ho sake.

Exact details ke liye Ajay sir se call par baat karein: 9415313434."

User: mujhe 20 saal baad 50 lakh chahiye
Poddar Ji: "Bahut badhiya goal hai! **₹50 Lakh in 20 years** target karne ke liye hum teen approaches le sakte hain:

1. **LIC Jeevan Labh**: Endowment/Savings Plan — SA + accrued bonuses pe strong maturity returns. Apni age aur budget batao, main exact premium calculate kar deta hun.

2. **LIC New Endowment**: Consistent bonus history wala plan, moderate premium.

3. **Mix Approach (Recommended)**:
   - **Term Plan** (cheap protection) + **Endowment** (savings accumulation) for balanced coverage.

Apni **age aur monthly budget** batao — main real numbers nikaal deta hun!"

${LIC_PLANS_CONTEXT}`
}

// ── Google Sheets logger (fire-and-forget) ─────────────────────────────────
async function logToSheets(sessionId: string, userMsg: string, botReply: string) {
  const url = env.GOOGLE_SHEETS_WEBHOOK_URL
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
  // Guard 1: GROQ_API_KEY check
  if (!process.env.GROQ_API_KEY && !env.GROQ_API_KEY) {
    return NextResponse.json({
      response: "Poddar Ji abhi setup ho raha hai. Seedha Ajay sir se baat karein: 9415313434.",
      fallback: true
    })
  }

  const ip = req.headers.get('x-forwarded-for') ?? 'unknown'
  
  // Guard 2: Rate limit check wrapped in try-catch
  let allowed = true
  try {
    const res = await checkRateLimit(ip, 30, 60, 'rl-chat')
    allowed = res.allowed
  } catch (e) {
    console.warn('Rate limiter unavailable, skipping:', e)
  }

  if (!allowed) {
    logger.warn('/api/chat', 'Rate limit exceeded', { ip })
    return NextResponse.json(
      { error: 'Rate limit exceeded. Please try again later.' },
      { status: 429, headers: { 'Retry-After': '60' } }
    )
  }

  try {
    let body: { messages?: unknown; sessionId?: unknown }
    try {
      body = await req.json()
    } catch {
      return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
    }
    const { messages, sessionId } = body

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'No message' }, { status: 400 })
    }

    const lastMessage = messages[messages.length - 1]
    if (!lastMessage) return NextResponse.json({ error: 'No message' }, { status: 400 })

    // Input sanitisation — cap at MAX_INPUT_CHARS, strip HTML tags
    const rawContent = String(lastMessage.content || '').replace(/<[^>]*>/g, '').trim()
    const safeContent = rawContent.slice(0, MAX_INPUT_CHARS)
    if (!safeContent) return NextResponse.json({ error: 'Empty message' }, { status: 400 })

    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY || env.GROQ_API_KEY })

    // Convert prior turns to Groq format — normalize any non-user role to 'assistant'
    const history = messages.slice(0, -1).map((m: { role: string; content: string }) => ({
      role: (m.role === 'user' ? 'user' : 'assistant') as 'user' | 'assistant',
      content: String(m.content || '').slice(0, MAX_INPUT_CHARS),
    }))

    // Drop any leading 'assistant' turns so the first message is always from the user.
    // Cap at last 10 items (5 user + 5 assistant) to keep token count manageable.
    const firstUserIdx = history.findIndex((m: { role: string }) => m.role === 'user')
    const trimmed = firstUserIdx === -1 ? [] : history.slice(firstUserIdx)
    const safeHistory = trimmed.slice(-10)

    const groqMessages: Groq.Chat.ChatCompletionMessageParam[] = [
      { role: 'system', content: buildSystemPrompt() },
      ...safeHistory,
      { role: 'user', content: safeContent },
    ]

    // ── Pass 1: non-streaming tool resolution ─────────────────────────────────
    let finalMessages: Groq.Chat.ChatCompletionMessageParam[] = groqMessages
    let toolUsed: string | null = null
    try {
      console.log('[D3:pass1] sending tool pass, user:', safeContent.slice(0, 80))
      const toolPass = await groq.chat.completions.create(
        { model: GROQ_MODEL, messages: groqMessages, tools: TOOL_DEFINITIONS, tool_choice: 'auto', max_tokens: 300 },
        { timeout: 8000 }
      )
      const choice = toolPass.choices[0]
      console.log('[D3:pass1] finish_reason:', choice?.finish_reason, '| tool_calls:', choice?.message?.tool_calls?.length ?? 0)
      if (choice?.finish_reason === 'tool_calls' && choice.message?.tool_calls?.length) {
        const toolCall = choice.message.tool_calls[0] // max 1 per turn
        toolUsed = toolCall.function.name
        let toolArgs: Record<string, unknown> = {}
        try { toolArgs = JSON.parse(toolCall.function.arguments) } catch { /* malformed args */ }
        console.log('[D3:pass1] executing tool:', toolUsed, 'args:', JSON.stringify(toolArgs))
        const toolResult = await executeTool(toolCall.function.name, toolArgs)
        console.log('[D3:pass1] tool result (first 200 chars):', toolResult.slice(0, 200))
        finalMessages = [
          ...groqMessages,
          { role: 'assistant', content: null, tool_calls: choice.message.tool_calls } as unknown as Groq.Chat.ChatCompletionMessageParam,
          { role: 'tool', tool_call_id: toolCall.id, content: toolResult } as unknown as Groq.Chat.ChatCompletionMessageParam,
        ]
      }
    } catch (e: unknown) {
      // Tool pass failed — fall through to direct streaming without tools
      console.error('[D3:pass1] FAILED:', e instanceof Error ? e.message : String(e))
    }
    console.log('[D3:pass2] streaming with tool context:', toolUsed ? `yes (${toolUsed})` : 'no')

    // ── Pass 2: streaming reply (with or without tool context) ────────────────
    let stream
    try {
      stream = await groq.chat.completions.create({ model: GROQ_MODEL, messages: finalMessages, stream: true }, { timeout: 8000 })
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : ''
      if (msg.includes('429')) {
        await new Promise(r => setTimeout(r, 2000))
        stream = await groq.chat.completions.create({ model: GROQ_MODEL, messages: finalMessages, stream: true }, { timeout: 8000 })
      } else {
        throw e
      }
    }

    const encoder = new TextEncoder()
    let fullReply = ''

    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const text = chunk.choices[0]?.delta?.content ?? ''
            if (text) {
              fullReply += text
              controller.enqueue(encoder.encode(text))
            }
          }
        } catch (e) {
          controller.error(e)
          return
        }

        if (!fullReply) {
          const fallback = 'Yeh sawaal thoda sensitive lag raha hai — main insurance ke baare mein hi baat kar sakta hun. Koi LIC ya health plan ke baare mein puchiye, ya Ajay sir se directly baat karein: 9415313434.'
          fullReply = fallback
          controller.enqueue(encoder.encode(fallback))
        }

        controller.close()

        if (sessionId && typeof sessionId === 'string') {
          logToSheets(sessionId, safeContent, fullReply)
        }
      },
    })

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'X-AI-Disclaimer': 'AI-generated responses are for information only. For personalised advice, speak with Ajay Kumar Poddar directly on 9415313434.',
      },
    })
  } catch (error: unknown) {
    const e = error as { message?: string; status?: number; error?: unknown }
    console.error('Groq error:', e?.message || error)
    console.error('Groq status:', e?.status)
    console.error('Groq error body:', JSON.stringify(e?.error))
    logger.error('/api/chat', 'Chat API error', { error: String(error) })
    return NextResponse.json({
      response: "Abhi Poddar Ji thoda busy hain. Aap directly Ajay sir se baat karein — 9415313434. WhatsApp par bhi message kar sakte hain.",
      cached: false,
      fallback: true,
    }, { status: 200 })
  }
}
