import { NextResponse } from 'next/server'
import { clean, pushToSheets } from '@/lib/server-utils'
import { logger } from '@/lib/logger'
import type { NewsletterSubscribeResponse } from '@/lib/types/newsletter'

const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Per-IP rate limit: 3 subscribes/hour
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()
const RATE_WINDOW = 60 * 60 * 1000
const RATE_LIMIT = 3

// Per-email dedup: 24-hour window
const emailDedupeMap = new Map<string, number>()
const DEDUP_WINDOW = 24 * 60 * 60 * 1000

const HEADERS = ['Timestamp', 'Email', 'Source', 'Language']

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const entry = rateLimitMap.get(ip)
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW })
    return true
  }
  if (entry.count >= RATE_LIMIT) return false
  entry.count++
  return true
}

export async function POST(request: Request): Promise<NextResponse<NewsletterSubscribeResponse>> {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'

  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { success: false, error: 'Please try again later.' },
      { status: 429 }
    )
  }

  let data: Record<string, unknown>
  try {
    data = await request.json()
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid request.' }, { status: 400 })
  }

  const email = clean((data.email as string) ?? '', 200).toLowerCase().trim()
  const language = clean((data.language as string) ?? 'en', 5)

  if (!email || !EMAIL_REGEX.test(email)) {
    return NextResponse.json(
      { success: false, error: 'Please enter a valid email address.' },
      { status: 400 }
    )
  }

  // Dedup — return success silently to avoid email enumeration
  const lastSub = emailDedupeMap.get(email)
  if (lastSub && Date.now() - lastSub < DEDUP_WINDOW) {
    logger.info('/api/newsletter/subscribe', 'Duplicate subscription suppressed', { ip })
    return NextResponse.json({ success: true, message: "You're already subscribed. Thank you!" })
  }
  emailDedupeMap.set(email, Date.now())

  const timestamp = new Date().toISOString()
  const row = [timestamp, email, 'website_newsletter', language]

  if (webhookUrl) {
    await pushToSheets(
      webhookUrl,
      { row, intent: 'newsletter_subscribe', sheetName: 'Newsletter', headers: HEADERS },
      '/api/newsletter/subscribe',
      'Newsletter subscription failed to sync to Sheets',
    )
  }

  logger.info('/api/newsletter/subscribe', 'New subscriber', { ip })
  return NextResponse.json({ success: true, message: 'Subscribed successfully! Welcome to Poddar Wealth insights.' })
}
