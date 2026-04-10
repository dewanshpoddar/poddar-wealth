import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { google } from 'googleapis';

// ─── Google Sheets helper ────────────────────────────────────────────────────

const SPREADSHEET_ID = process.env.GOOGLE_SHEET_ID;

async function getSheets() {
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (!raw || !SPREADSHEET_ID) return null;

  const credentials = JSON.parse(raw);
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
  return google.sheets({ version: 'v4', auth });
}

// Map intent → sheet tab name
function tabForIntent(intent?: string): string {
  if (!intent) return 'All Leads';
  if (intent.toLowerCase().includes('agent')) return 'Agent Recruitment';
  if (intent.toLowerCase().includes('lic') || intent.toLowerCase().includes('plan')) return 'LIC Plans';
  return 'Popup Inquiries';
}

const HEADERS = [
  'Timestamp', 'Name', 'Mobile', 'Email',
  'City', 'Profession', 'Want To', 'I Am',
  'Intent', 'Experience', 'Message',
];

async function ensureTab(sheets: any, tabName: string) {
  const meta = await sheets.spreadsheets.get({ spreadsheetId: SPREADSHEET_ID });
  const exists = meta.data.sheets?.some(
    (s: any) => s.properties?.title === tabName
  );
  if (!exists) {
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId: SPREADSHEET_ID,
      requestBody: {
        requests: [{ addSheet: { properties: { title: tabName } } }],
      },
    });
    // Write header row into new tab
    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: `${tabName}!A1`,
      valueInputOption: 'RAW',
      requestBody: { values: [HEADERS] },
    });
  }
}

async function appendRow(sheets: any, tabName: string, row: string[]) {
  await ensureTab(sheets, tabName);
  await sheets.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID,
    range: `${tabName}!A1`,
    valueInputOption: 'RAW',
    requestBody: { values: [row] },
  });
}

// ─── Route handler ───────────────────────────────────────────────────────────

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

    // 2. Write to Google Sheets (All Leads + intent-specific tab)
    const sheets = await getSheets();
    if (sheets) {
      await Promise.all([
        appendRow(sheets, 'All Leads', row),
        appendRow(sheets, tabForIntent(intent), row),
      ]);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Lead submission error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
