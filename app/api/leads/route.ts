import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

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
    const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
    if (webhookUrl) {
      await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ row, intent: intent ?? '' }),
      });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Lead submission error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
