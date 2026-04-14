import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

import { adminNotify } from '@/lib/admin-notify'

// Set GOOGLE_SHEETS_WEBHOOK_URL in .env.local to push leads to Google Sheets
const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL

const HEADERS = [
  'Timestamp', 'Name', 'Mobile', 'Email',
  'City', 'Profession', 'Want To', 'I Am',
  'Intent', 'Experience', 'Message',
];

// Sanitize: strip newlines/tabs, limit length
const clean = (s: any, max = 500): string =>
  String(s ?? '').slice(0, max).replace(/[\r\n\t]/g, ' ').trim()

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
    const data = await request.json();
    const { name, mobile, email, wantTo, iAm, intent, city, profession, experience, message } = data;

    // Validate required fields
    if (!name || clean(name, 100).length < 2) {
      return NextResponse.json({ error: 'Invalid name' }, { status: 400 });
    }
    if (!mobile || !/^\d{10}$/.test(String(mobile).replace(/\s/g, ''))) {
      return NextResponse.json({ error: 'Invalid mobile number — must be 10 digits' }, { status: 400 });
    }

    const timestamp = new Date().toISOString();
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
    ];

    // 1. Always write to local CSV as backup
    const sanitize = (str: any) => `"${String(str || '').replace(/"/g, '""')}"`;
    const line = row.map(sanitize).join(',') + '\n';
    const filePath = path.join('/tmp', 'leads.csv');
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, HEADERS.join(',') + '\n');
    }
    fs.appendFileSync(filePath, line);

    // 2. Send to Google Sheets via Apps Script webhook
    //    Wrapped in try/catch with timeout so it never breaks the user-facing response
    if (webhookUrl) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout
      try {
        await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            row,
            intent:    intent ?? '',
            sheetName: resolveLeadTab(intent ?? '', iAm ?? '', wantTo ?? ''),
            headers: HEADERS,
          }),
          signal: controller.signal,
        });
      } catch (webhookError) {
        // Log but DO NOT throw — CSV is our source of truth backup
        console.error('Google Sheets webhook failed (non-fatal):', webhookError)
        adminNotify({
          type: 'LEAD_FAIL', severity: 'warn', route: '/api/leads',
          message: 'Google Sheets lead sync failed — lead saved to CSV only',
          detail: String(webhookError),
        }).catch(() => {})
      } finally {
        clearTimeout(timeoutId);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Lead submission error:', error)
    adminNotify({
      type: 'API_ERROR', severity: 'error', route: '/api/leads',
      message: `Lead submission crashed: ${error.message}`,
      detail: error.stack ?? String(error),
    }).catch(() => {})
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

