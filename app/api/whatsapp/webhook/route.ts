import { NextRequest, NextResponse } from 'next/server'
import Groq from 'groq-sdk'
import { sendWhatsAppMessage } from '@/lib/whatsapp'
import { getAutoReply } from '@/lib/whatsapp-templates'
import { logActivity } from '@/lib/activity-logger'
import { ADVISOR_PHONE } from '@/lib/constants'

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })
const MODEL = process.env.GROQ_MODEL ?? 'llama-3.3-70b-versatile'

const SYSTEM_PROMPT = `You are Poddar Ji — the trusted WhatsApp AI insurance advisor for Poddar Wealth Management, Gorakhpur. Run by Ajay Kumar Poddar since 1994. MDRT member, LIC Chairman's Club awardee.

Reply in the SAME language the user writes in (Hindi or English). Keep replies under 150 words. Always end with: "For a personalised quote, call ${ADVISOR_PHONE}" or the Hindi equivalent. Only discuss insurance — redirect other queries politely.`

// ── GET — Meta webhook verification ────────────────────────────────────────
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const mode = searchParams.get('hub.mode')
  const token = searchParams.get('hub.verify_token')
  const challenge = searchParams.get('hub.challenge')

  if (mode === 'subscribe' && token === process.env.WHATSAPP_VERIFY_TOKEN) {
    return new NextResponse(challenge, { status: 200 })
  }
  return NextResponse.json({ error: 'Verification failed' }, { status: 403 })
}

// ── POST — Incoming messages ────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') ?? 'unknown'
  let status = 200
  try {
    const body = await req.json()

    const entry = body?.entry?.[0]
    const changes = entry?.changes?.[0]
    const value = changes?.value
    const messages = value?.messages

    if (!messages?.length) {
      // Delivery receipts / status updates — acknowledge silently
      return NextResponse.json({ status: 'ok' })
    }

    const message = messages[0]
    const from: string = message.from
    const msgType: string = message.type

    if (msgType !== 'text') {
      await sendWhatsAppMessage(
        from,
        `I can only process text messages right now. For document analysis, visit: https://poddarwealth.com/analyzers/policy-document\nOr call ${ADVISOR_PHONE}`,
      )
      logActivity('/api/whatsapp/webhook', 'POST', 200, ip)
      return NextResponse.json({ status: 'ok' })
    }

    const text: string = message.text?.body ?? ''

    // Try template auto-reply first
    const autoReply = getAutoReply(text)
    if (autoReply) {
      await sendWhatsAppMessage(from, autoReply)
      logActivity('/api/whatsapp/webhook', 'POST', 200, ip)
      return NextResponse.json({ status: 'ok' })
    }

    // Fall back to Groq AI
    const completion = await groq.chat.completions.create({
      model: MODEL,
      max_tokens: 300,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: text.slice(0, 500) },
      ],
    })
    const reply = completion.choices[0]?.message?.content ?? `For assistance, please call ${ADVISOR_PHONE}.`
    await sendWhatsAppMessage(from, reply)

    logActivity('/api/whatsapp/webhook', 'POST', 200, ip)
    return NextResponse.json({ status: 'ok' })
  } catch (err) {
    console.error('[whatsapp/webhook]', err)
    status = 500
    logActivity('/api/whatsapp/webhook', 'POST', status, ip)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
