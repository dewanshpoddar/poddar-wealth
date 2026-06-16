import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { verifySession } from '@/lib/admin-auth'

function auth(req: NextRequest) {
  // 1. Check header secret key (for server-to-server crons/integrations)
  const secret = process.env.ADMIN_SECRET
  if (secret && req.headers.get('x-admin-secret') === secret) return true

  // 2. Check signed HttpOnly cookie (for browser admin dashboard UI)
  const token = req.cookies.get('admin_session')?.value
  if (token) {
    const session = verifySession(token)
    if (session) return true
  }

  return false
}

export async function GET(req: NextRequest) {
  if (!auth(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // Blog stats
    const blogIndexPath = path.join(process.cwd(), 'lib/data/blog-index.json')
    const blogIndex = JSON.parse(fs.readFileSync(blogIndexPath, 'utf8')) as Array<{
      slug: string; date?: string; category?: string
    }>
    const blogIndexSize = Math.round(fs.statSync(blogIndexPath).size / 1024)
    const categories = new Set(blogIndex.map(p => p.category).filter(Boolean))
    const sorted = [...blogIndex].sort((a, b) =>
      (b.date ?? '').localeCompare(a.date ?? ''))
    const latestPost = sorted[0] ? { slug: sorted[0].slug, date: sorted[0].date } : null

    // Activity log
    const activityPath = path.join(process.cwd(), 'lib/data/admin-activity.json')
    let activityLog: unknown[] = []
    try { activityLog = JSON.parse(fs.readFileSync(activityPath, 'utf8')) } catch { /* empty */ }

    const data = {
      success: true,
      timestamp: new Date().toISOString(),
      environment: process.env.VERCEL_ENV ?? 'development',
      blog: {
        totalPosts: blogIndex.length,
        totalCategories: categories.size,
        latestPost,
        indexSizeKb: blogIndexSize,
      },
      pages: {
        static: 105,
        apiRoutes: 17,
      },
      leads: {
        note: 'Connect Sheets API for live count',
      },
      health: {
        groqConfigured: !!process.env.GROQ_API_KEY,
        sheetsConfigured: !!process.env.GOOGLE_SHEETS_WEBHOOK_URL,
        sentryConfigured: !!process.env.SENTRY_DSN,
        resendConfigured: !!process.env.RESEND_API_KEY,
        adminPasswordSet: !!process.env.ADMIN_DASHBOARD_PASSWORD,
        whatsappConfigured: !!process.env.WHATSAPP_ACCESS_TOKEN,
      },
      activityLog: activityLog.slice(0, 20),
    }

    return NextResponse.json(data, {
      headers: { 'Cache-Control': 'no-store' },
    })
  } catch (err) {
    console.error('[admin/metrics]', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
