import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { name, mobile, email, intent } = data;

    const timestamp = new Date().toISOString();
    const filePath = path.join(process.cwd(), 'leads.csv');
    
    const sanitize = (str: any) => `"${String(str || '').replace(/"/g, '""')}"`;
    const line = [sanitize(timestamp), sanitize(name), sanitize(mobile), sanitize(email), sanitize(intent)].join(',') + '\n';

    if (!fs.existsSync(filePath)) {
      const headers = 'Timestamp,Name,Mobile,Email,Interest\n';
      fs.writeFileSync(filePath, headers);
    }
    fs.appendFileSync(filePath, line);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Lead submission error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
