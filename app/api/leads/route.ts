import { NextResponse } from 'next/server'

import { adminNotify } from '@/lib/admin-notify'
import { clean, isValidPhone, appendToCsv, pushToSheets } from '@/lib/server-utils'

const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL

const HEADERS = [
  'Timestamp', 'Name', 'Mobile', 'Email',
  'City', 'Profession', 'Want To', 'I Am',
  'Intent', 'Experience', 'Message',
]

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
    const data = await request.json()
    const { name, mobile, email, wantTo, iAm, intent, city, profession, experience, message } = data

    // Validate required fields
    if (!name || clean(name, 100).length < 2) {
      return NextResponse.json({ error: 'Invalid name' }, { status: 400 })
    }
    if (!mobile || !isValidPhone(mobile)) {
      return NextResponse.json({ error: 'Invalid mobile number — must be 10 digits' }, { status: 400 })
    }

    const timestamp = new Date().toISOString()
    const row = [
      timestamp,
      clean(name, 100),
      clean(mobile, 10),
      clean(email, 200),
      clean(city, 100),
      clean(profession, 100),
      clean(wantTo, 200),
      clean(iAm, 100),
      clean(intent, 200),
      clean(experience, 200),
      clean(message, 1000),
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

    return NextResponse.json({ success: true })
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error)
    const stack = error instanceof Error ? (error.stack ?? msg) : msg
    console.error('Lead submission error:', error)
    adminNotify({
      type: 'API_ERROR', severity: 'error', route: '/api/leads',
      message: `Lead submission crashed: ${msg}`,
      detail: stack,
    }).catch(() => {})
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
