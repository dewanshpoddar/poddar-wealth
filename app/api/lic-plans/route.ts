import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DATA_PATH = path.join(process.cwd(), 'lib/data/lic-plans.json');
const LOG_PATH = path.join(process.cwd(), 'lib/data/sync-log.json');

export async function GET() {
  try {
    if (!fs.existsSync(DATA_PATH)) {
      return NextResponse.json({ success: false, error: 'Data not found' }, { status: 404 });
    }

    const data = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));
    const logs = fs.existsSync(LOG_PATH) ? JSON.parse(fs.readFileSync(LOG_PATH, 'utf8')) : [];

    return NextResponse.json({ 
      success: true, 
      data: data,
      lastSync: logs[0] || null
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=59'
      }
    });

  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to load plans' }, { status: 500 });
  }
}
