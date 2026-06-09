import { NextResponse } from 'next/server'
import { clean, pushToSheets } from '@/lib/server-utils'
import { logger } from '@/lib/logger'
import { sendWelcomeEmail } from '@/lib/email'
import { checkRateLimit } from '@/lib/rate-limit'
import type { NewsletterSubscribeResponse } from '@/lib/types/newsletter'

const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Per-email dedup: 24-hour window
const emailDedupeMap = new Map<string, number>()
const DEDUP_WINDOW = 24 * 60 * 60 * 1000

const HEADERS = ['Timestamp', 'Email', 'Source', 'Language']

export async function POST(request: Request): Promise<NextResponse<NewsletterSubscribeResponse>> {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'

  const { allowed } = await checkRateLimit(ip, 3, 3600, 'rl-newsletter')
  if (!allowed) {
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
  // Fire-and-forget welcome email — don't fail subscription if email fails
  sendWelcomeEmail(email).catch(() => {})
  return NextResponse.json({ success: true, message: 'Subscribed successfully! Welcome to Poddar Wealth insights.' })
}
