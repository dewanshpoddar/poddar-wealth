import { NextRequest, NextResponse } from 'next/server'
import { leadStats } from '@/lib/lead-stats'

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get('secret')
  if (!secret || secret !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  return NextResponse.json({
    total:    leadStats.total,
    bySource: leadStats.bySource,
    lastLead: leadStats.lastLead,
    uptime:   process.uptime(),
  })
}
