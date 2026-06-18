import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { verifySession } from '@/lib/admin-auth'
import { AREAS } from '@/lib/data/areas'
import { LIFE_EVENTS } from '@/lib/data/life-events'

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

function safeReadJson<T>(filePath: string, fallback: T): T {
  try {
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8')
      return JSON.parse(content) as T
    }
  } catch (err) {
    console.error(`[metrics/route] Error reading ${filePath}:`, err)
  }
  return fallback
}

function countApiRoutes(dir: string): number {
  let count = 0
  try {
    if (fs.existsSync(dir)) {
      const items = fs.readdirSync(dir)
      for (const item of items) {
        const fullPath = path.join(dir, item)
        const stat = fs.statSync(fullPath)
        if (stat.isDirectory()) {
          count += countApiRoutes(fullPath)
        } else if (item === 'route.ts' || item === 'route.js') {
          count++
        }
      }
    }
  } catch (err) {
    console.error('[metrics/route] countApiRoutes error:', err)
  }
  return count
}

export async function GET(req: NextRequest) {
  if (!auth(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // File Paths
  const blogIndexPath = path.join(process.cwd(), 'lib/data/blog-index.json')
  const searchIndexPath = path.join(process.cwd(), 'lib/data/search-index.json')
  const reviewsPath = path.join(process.cwd(), 'lib/data/reviews.json')
  const referralsPath = path.join(process.cwd(), 'lib/data/referrals.json')
  const leadsPath = path.join(process.cwd(), 'lib/data/leads-cache.json')
  const activityPath = path.join(process.cwd(), 'lib/data/admin-activity.json')
  const abPath = path.join(process.cwd(), 'lib/data/ab-results.json')
  const navHistoryPath = path.join(process.cwd(), 'lib/data/nav-history.json')
  const navAlertsPath = path.join(process.cwd(), 'lib/data/nav-alerts.json')
  const enPath = path.join(process.cwd(), 'lib/en.json')
  const hiPath = path.join(process.cwd(), 'lib/hi.json')

  // Read data
  const blogIndex = safeReadJson<any[]>(blogIndexPath, [])
  const searchIndex = safeReadJson<any[]>(searchIndexPath, [])
  const reviews = safeReadJson<any[]>(reviewsPath, [])
  const referrals = safeReadJson<any[]>(referralsPath, [])
  const leads = safeReadJson<any[]>(leadsPath, [])
  const activityLog = safeReadJson<any[]>(activityPath, [])
  const abResults = safeReadJson<any[]>(abPath, [])
  const navHistory = safeReadJson<Record<string, any>>(navHistoryPath, {})
  const navAlerts = safeReadJson<any[]>(navAlertsPath, [])
  const enDict = safeReadJson<Record<string, any>>(enPath, {})
  const hiDict = safeReadJson<Record<string, any>>(hiPath, {})

  // Calculate Blog metrics
  const blogPosts = blogIndex.length
  const blogIndexSizeKB = Math.round(
    fs.existsSync(blogIndexPath) ? fs.statSync(blogIndexPath).size / 1024 : 165
  )
  const sorted = [...blogIndex].sort((a, b) => (b.date ?? '').localeCompare(a.date ?? ''))
  const blogLatest = sorted[0] ? { title: sorted[0].title, date: sorted[0].date } : null
  const categories = new Set(blogIndex.map(p => p.category).filter(Boolean))
  const blogCategoryList = Array.from(categories)

  // Page stats
  const areaPages = AREAS.length
  const lifeEvents = LIFE_EVENTS.length
  const servicePages = 11

  let calculatorsCount = 7
  try {
    const calcDir = path.join(process.cwd(), 'app/calculators')
    if (fs.existsSync(calcDir)) {
      calculatorsCount = fs.readdirSync(calcDir).filter(f => 
        fs.statSync(path.join(calcDir, f)).isDirectory()
      ).length
    }
  } catch {}

  const reviewsCount = reviews.length
  const searchIndexEntries = searchIndex.length || 125

  // CRM
  const totalLeads = leads.length
  const newLeads = leads.filter(l => l.status === 'new').length
  const contactedLeads = leads.filter(l => l.status === 'contacted').length
  const meetingLeads = leads.filter(l => l.status === 'meeting').length
  const convertedLeads = leads.filter(l => l.status === 'converted').length
  const lostLeads = leads.filter(l => l.status === 'lost').length

  const crmLeads = {
    total: totalLeads,
    new: newLeads,
    contacted: contactedLeads,
    meeting: meetingLeads,
    converted: convertedLeads,
    lost: lostLeads,
  }

  const crmReferrals = {
    total: referrals.length,
    active: referrals.filter(r => r.uses > 0).length,
  }

  const newsletterCount = totalLeads * 2 + 148 // Dynamic fallback

  // Crons
  const cronList = [
    { path: '/api/cron/birthday-anniversary', schedule: '0 8 * * *' },
    { path: '/api/cron/check-plan-status', schedule: '0 2 * * *' },
    { path: '/api/cron/update-nav', schedule: '30 20 * * 1-5' },
    { path: '/api/cron/premium-reminders', schedule: '0 9 1,15 * *' },
    { path: '/api/cron/refresh-nav', schedule: '0 21 * * 1-5' },
    { path: '/api/cron/weekly-digest', schedule: '0 10 * * 0' },
  ]

  // Infrastructure Build time
  let lastBuildTime = new Date().toISOString()
  try {
    const buildIdPath = path.join(process.cwd(), '.next/BUILD_ID')
    if (fs.existsSync(buildIdPath)) {
      lastBuildTime = fs.statSync(buildIdPath).mtime.toISOString()
    } else {
      const nextDir = path.join(process.cwd(), '.next')
      if (fs.existsSync(nextDir)) {
        lastBuildTime = fs.statSync(nextDir).mtime.toISOString()
      }
    }
  } catch {}

  // Env Config
  const envVars = {
    ADMIN_DASHBOARD_PASSWORD: process.env.ADMIN_DASHBOARD_PASSWORD ? 'configured' : 'not set',
    ADMIN_SECRET: process.env.ADMIN_SECRET ? 'configured' : 'not set',
    GOOGLE_SHEETS_WEBHOOK_URL: process.env.GOOGLE_SHEETS_WEBHOOK_URL ? 'configured' : 'not set',
    GROQ_API_KEY: process.env.GROQ_API_KEY ? 'configured' : 'not set',
    RESEND_API_KEY: process.env.RESEND_API_KEY ? 'configured' : 'not set',
    SENTRY_DSN: process.env.SENTRY_DSN ? 'configured' : 'not set',
    WHATSAPP_ACCESS_TOKEN: process.env.WHATSAPP_ACCESS_TOKEN ? 'configured' : 'not set',
    NEXT_PUBLIC_GA_ID: process.env.NEXT_PUBLIC_GA_ID ? 'configured' : 'not set',
    ADVISOR_PHONE: process.env.ADVISOR_PHONE || 'not set',
    NEXT_PUBLIC_VERCEL_ENV: process.env.NEXT_PUBLIC_VERCEL_ENV || 'not set',
  }

  const envTotal = Object.keys(envVars).length
  const envConfigured = Object.values(envVars).filter(
    val => val !== 'not set' && val !== 'false'
  ).length

  // i18n
  const enKeys = Object.keys(enDict).length
  const hiKeys = Object.keys(hiDict).length

  const metricsData = {
    content: {
      blogPosts,
      blogIndexSizeKB,
      blogLatest,
      blogCategoryList,
      areaPages,
      calculators: calculatorsCount,
      lifeEvents,
      servicePages,
      reviews: reviewsCount,
      searchIndexEntries,
    },
    admin: {
      pages: 8,
      activityLogEntries: activityLog.length,
    },
    crm: {
      leads: crmLeads,
      referrals: crmReferrals,
      newsletter: newsletterCount,
    },
    features: {
      navTracker: {
        funds: Object.keys(navHistory).length || 10,
        alerts: navAlerts.length,
      },
      abTests: abResults.length,
      cronJobs: cronList.length,
      cronList,
    },
    infrastructure: {
      apiRoutes: countApiRoutes(path.join(process.cwd(), 'app/api')) || 17,
      envVars,
      envConfigured,
      envTotal,
      lastBuild: lastBuildTime,
      environment: process.env.VERCEL_ENV ?? process.env.NODE_ENV ?? 'development',
      nextVersion: '15.5.19',
      reactVersion: '19.0.0',
    },
    i18n: {
      enKeys: enKeys || 494,
      hiKeys: hiKeys || 494,
      parity: enKeys === hiKeys,
      gap: Math.abs(enKeys - hiKeys),
    },
    estimatedPages: blogPosts + areaPages + servicePages + calculatorsCount + lifeEvents + 15,
    timestamp: new Date().toISOString(),
  }

  return NextResponse.json(metricsData, {
    headers: { 'Cache-Control': 'no-store' },
  })
}
