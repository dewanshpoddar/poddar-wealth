import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { name, mobile, email, wantTo, iAm, intent, city, profession, experience, message } = data;

    const timestamp = new Date().toISOString();
    const filePath = path.join(process.cwd(), 'leads.csv');

    const sanitize = (str: any) => `"${String(str || '').replace(/"/g, '""')}"`;
    const line = [
      sanitize(timestamp), sanitize(name), sanitize(mobile), sanitize(email),
      sanitize(city), sanitize(profession), sanitize(wantTo), sanitize(iAm),
      sanitize(intent), sanitize(experience), sanitize(message),
    ].join(',') + '\n';

    if (!fs.existsSync(filePath)) {
      const headers = 'Timestamp,Name,Mobile,Email,City,Profession,Want To,I Am,Interest,Experience,Message\n';
      fs.writeFileSync(filePath, headers);
    }
    fs.appendFileSync(filePath, line);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Lead submission error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
