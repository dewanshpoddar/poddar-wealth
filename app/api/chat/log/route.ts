import { NextRequest, NextResponse } from 'next/server'

async function logToSheets(sessionId: string, userMsg: string, botReply: string) {
  const url = process.env.GOOGLE_SHEETS_WEBHOOK_URL
  if (!url) return
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
        '', '', '', '', '', 'Chat Log (fallback)', '', '',
      ],
    }),
  })
}

export async function POST(req: NextRequest) {
  try {
    const { sessionId, userMsg, botReply } = await req.json()
    if (sessionId && userMsg && botReply) {
      await logToSheets(sessionId, userMsg, botReply)
    }
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: false })
  }
}
