import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    groqConfigured: !!process.env.GROQ_API_KEY,
    sheetsConfigured: !!process.env.GOOGLE_SHEETS_WEBHOOK_URL,
  })
}
