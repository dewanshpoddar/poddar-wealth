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

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { name, mobile, email, wantTo, iAm, intent, city, profession, experience, message } = data;

    const timestamp = new Date().toISOString();
    const row = [
      timestamp, name ?? '', mobile ?? '', email ?? '',
      city ?? '', profession ?? '', wantTo ?? '', iAm ?? '',
      intent ?? '', experience ?? '', message ?? '',
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

