import { NextRequest, NextResponse } from 'next/server';
import { scrapeLicPlans } from '@/scripts/lic-scraper';
import { runDiff } from '@/scripts/lic-diff';

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('x-sync-secret');
    const secret = process.env.SYNC_SECRET;
    if (!secret || authHeader !== secret) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    console.log('🔄 Manual Sync Triggered...');
    const newPlans = await scrapeLicPlans();
    
    if (!newPlans || newPlans.length === 0) {
      return NextResponse.json({ success: false, error: 'Scraper returned no data' }, { status: 500 });
    }

    const diff = await runDiff(newPlans);

    return NextResponse.json({ 
      success: true, 
      message: 'Sync completed successfully',
      diff 
    });

  } catch (error: any) {
    console.error('❌ Sync API failed:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
