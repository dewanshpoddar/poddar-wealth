import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

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
    const filePath = path.join(process.cwd(), 'leads.csv');
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
          body: JSON.stringify({ row, intent: intent ?? '' }),
          signal: controller.signal,
        });
      } catch (webhookError) {
        // Log but DO NOT throw — CSV is our source of truth backup
        console.error('Google Sheets webhook failed (non-fatal):', webhookError);
      } finally {
        clearTimeout(timeoutId);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Lead submission error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

