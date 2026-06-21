import { NextResponse } from 'next/server'

// TEMPORARY — delete after email verification
export async function GET() {
  const hasKey = !!process.env.RESEND_API_KEY
  const keyPrefix = process.env.RESEND_API_KEY?.substring(0, 8) || 'not set'
  return NextResponse.json({
    resendConfigured: hasKey,
    keyPrefix: keyPrefix + '...',
    timestamp: new Date().toISOString(),
  })
}
