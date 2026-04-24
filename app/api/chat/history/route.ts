import { NextRequest, NextResponse } from 'next/server'

// Fetch chat history for a session ID from Google Sheets (via Apps Script GET)
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const sid = searchParams.get('sid')
  const limit = searchParams.get('limit') || '20'

  if (!sid) return NextResponse.json({ messages: [] })

  const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL
  if (!webhookUrl) return NextResponse.json({ messages: [] })

  try {
    const res = await fetch(`${webhookUrl}?sid=${encodeURIComponent(sid)}&limit=${limit}`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
    })

    // Apps Script redirects — follow them (fetch follows by default)
    const text = await res.text()

    // Apps Script sometimes wraps JSON in HTML on error — try to extract JSON
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) return NextResponse.json({ messages: [] })

    const data = JSON.parse(jsonMatch[0])
    return NextResponse.json({ messages: data.messages || [] })
  } catch {
    return NextResponse.json({ messages: [] })
  }
}
