import { NextResponse } from 'next/server'

import { adminNotify } from '@/lib/admin-notify'
import { clean, isValidPhone, appendToCsv, pushToSheets } from '@/lib/server-utils'
import { logger } from '@/lib/logger'
import { leadStats } from '@/lib/lead-stats'

const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL
const adminWebhookUrl = process.env.ADMIN_SHEETS_WEBHOOK_URL

const HEADERS = [
  'Timestamp', 'Name', 'Mobile', 'Email',
  'City', 'Profession', 'Want To', 'I Am',
  'Intent', 'Experience', 'Message',
  'Page URL', 'Language', 'UTM Source', 'UTM Medium', 'UTM Campaign',
]

// Deduplication: prevent double-submissions within 60 seconds
const dedupeMap = new Map<string, number>()
const DEDUP_WINDOW = 60_000

/**
 * Route each lead to its own dedicated tab — nothing gets merged.
 *
 * Tab strategy:
 *  Agent Recruitment  — advisor/agent intent or iAm=Agent
 *  Popup Inquiries    — plan interest popups, quick quote buttons
 *  Chat Lead Capture  — leads captured inside the AI chat
 *  Premium Calculator — calculator unlock (user enters mobile to see full results)
 *  Wealth Blueprint   — blueprint form submissions (handled by /api/blueprint)
 *  All Leads          — contact page form, general enquiries
 */
function resolveLeadTab(intent: string, iAm: string, wantTo: string): string {
  const i = intent.toLowerCase()
  const a = iAm.toLowerCase()
  const w = wantTo.toLowerCase()

  if (a.includes('agent') || w.includes('advisor') || i.includes('advisor') || i.includes('agent recruitment'))
    return 'Agent Recruitment'

  if (i.includes('chat lead') || i.includes('chat capture'))
    return 'Chat Lead Capture'

  if (i.includes('calc unlock') || i.includes('premium calc'))
    return 'Premium Calculator'

  if (i.includes('blueprint'))
    return 'Wealth Blueprint'

  // Popup = any plan interest, service consultation, quick quote from product cards
  if (
    i.includes('interest in') || i.includes('popup') ||
    i.includes('service consultation') || i.includes('free quote') ||
    i.includes('book') || i.includes('enquiry') || i.includes('inquiry')
  )
    return 'Popup Inquiries'

  return 'All Leads'
}

export async function POST(request: Request) {
  try {
    let data: Record<string, unknown>
    try {
      data = await request.json()
    } catch {
      return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
    }
    const { name, mobile, email, wantTo, iAm, intent, city, profession, experience, message,
            pageUrl, language, utmSource, utmMedium, utmCampaign } = data as Record<string, string>

    // Validate required fields
    if (!name || clean(name, 100).length < 2) {
      return NextResponse.json({ error: 'Invalid name' }, { status: 400 })
    }
    if (!mobile || !isValidPhone(mobile)) {
      return NextResponse.json({ error: 'Invalid mobile number — must be 10 digits' }, { status: 400 })
    }

    // Deduplication — silent success to prevent form retry loops
    const cleanMobile = clean(mobile, 10)
    const dedupeKey = `${cleanMobile}-${clean(intent ?? 'general', 200)}`
    const lastSubmit = dedupeMap.get(dedupeKey)
    if (lastSubmit && Date.now() - lastSubmit < DEDUP_WINDOW) {
      logger.info('/api/leads', 'Deduplicated lead submission', { mobile: cleanMobile })
      return NextResponse.json({ success: true, deduplicated: true })
    }
    dedupeMap.set(dedupeKey, Date.now())

    const timestamp = new Date().toISOString()
    const row = [
      timestamp,
      clean(name, 100),
      cleanMobile,
      clean(email, 200),
      clean(city, 100),
      clean(profession, 100),
      clean(wantTo, 200),
      clean(iAm, 100),
      clean(intent, 200),
      clean(experience, 200),
      clean(message, 1000),
      clean(pageUrl, 500),
      clean(language, 10),
      clean(utmSource, 100),
      clean(utmMedium, 100),
      clean(utmCampaign, 200),
    ]

    // 1. Always write to local CSV as backup (CSV injection prevention inside appendToCsv)
    appendToCsv('leads.csv', HEADERS, row)

    // 2. Send to Google Sheets via Apps Script webhook — non-fatal if it fails
    if (webhookUrl) {
      await pushToSheets(
        webhookUrl,
        {
          row,
          intent:    intent ?? '',
          sheetName: resolveLeadTab(intent ?? '', iAm ?? '', wantTo ?? ''),
          headers:   HEADERS,
        },
        '/api/leads',
        'Google Sheets lead sync failed — lead saved to CSV only',
      )
    }

    // 3. Admin notification — one-tap WhatsApp + call links for Ajay sir
    if (adminWebhookUrl) {
      const digitsOnly = cleanMobile.replace(/\D/g, '')
      const notifyPayload = {
        notification_type: 'new_lead_alert',
        timestamp,
        name: clean(name, 100),
        mobile: cleanMobile,
        source: clean(intent ?? 'general', 200),
        whatsapp_link: `https://wa.me/91${digitsOnly}`,
        call_link: `tel:+91${digitsOnly}`,
        urgency: 'respond_within_5_minutes',
      }
      fetch(adminWebhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(notifyPayload),
      }).catch((err) => logger.warn('/api/leads', 'Admin notification failed', { error: String(err) }))
    }

    // Update in-memory stats
    const source = clean(intent ?? 'general', 200)
    leadStats.total++
    leadStats.bySource[source] = (leadStats.bySource[source] ?? 0) + 1
    leadStats.lastLead = timestamp

    logger.info('/api/leads', 'Lead captured', { mobile: cleanMobile })
    return NextResponse.json({ success: true })
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error)
    const stack = error instanceof Error ? (error.stack ?? msg) : msg
    logger.error('/api/leads', 'Lead submission crashed', { error: msg })
    adminNotify({
      type: 'API_ERROR', severity: 'error', route: '/api/leads',
      message: `Lead submission crashed: ${msg}`,
      detail: stack,
    }).catch(() => {})
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
