'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { RefreshCw, Database, Activity, CheckCircle, Link2, AlertCircle } from 'lucide-react'

interface LeadStatus { total: number; new: number; contacted: number; meeting: number; converted: number; lost: number }
interface Metrics {
  content: {
    blogPosts: number
    blogIndexSizeKB: number
    blogLatest: { title: string; date: string } | null
    blogCategoryList: string[]
    areaPages: number
    calculators: number
    lifeEvents: number
    servicePages: number
    reviews: number
    searchIndexEntries: number
  }
  admin: { pages: number; activityLogEntries: number }
  crm: { leads: LeadStatus; referrals: { total: number; active: number }; newsletter: number }
  features: {
    navTracker: { funds: number; alerts: number }
    abTests: number
    cronJobs: number
    cronList: { path: string; schedule: string }[]
  }
  infrastructure: {
    apiRoutes: number
    envVars: Record<string, boolean | string>
    envConfigured: number
    envTotal: number
    lastBuild: string
    environment: string
    nextVersion: string
    reactVersion: string
  }
  i18n: { enKeys: number; hiKeys: number; parity: boolean; gap: number }
  estimatedPages: number
  timestamp: string
}

const MOCK_ACTIVITY = [
  { timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(), route: '/api/leads', method: 'POST', status: 200, ip: '157.48.xx.xx' },
  { timestamp: new Date(Date.now() - 1000 * 60 * 12).toISOString(), route: '/api/admin/metrics', method: 'GET', status: 200, ip: '103.22.xx.xx' },
  { timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(), route: '/api/chat', method: 'POST', status: 200, ip: '202.14.xx.xx' },
  { timestamp: new Date(Date.now() - 1000 * 60 * 110).toISOString(), route: '/api/cron/update-nav', method: 'POST', status: 200, ip: 'system' },
  { timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString(), route: '/api/admin/auth', method: 'POST', status: 401, ip: '157.48.xx.xx' }
]

function Skeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} className="h-24 bg-gray-100 rounded-2xl animate-pulse" />
      ))}
    </div>
  )
}

function StatCard({
  label,
  value,
  className = '',
  sub
}: {
  label: string
  value: string | number
  className?: string
  sub?: string
}) {
  return (
    <div className={`bg-white border border-gray-200 rounded-2xl p-5 flex flex-col justify-between shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 ${className}`}>
      <div>
        <p className="text-xs text-gray-500 uppercase tracking-wider mb-2 font-medium">{label}</p>
        <p className="text-3xl font-medium text-gray-900 font-mono tracking-tight">{value}</p>
      </div>
      {sub && <p className="text-xs text-gray-400 mt-2 font-medium">{sub}</p>}
    </div>
  )
}

const MONITORING_LINKS = [
  { label: 'Google Analytics', url: 'https://analytics.google.com' },
  { label: 'Vercel Dashboard', url: 'https://vercel.com/dewanshpoddar/poddar-wealth' },
  { label: 'Search Console', url: 'https://search.google.com/search-console' },
  { label: 'Google Business', url: 'https://business.google.com' },
  { label: 'Groq Console', url: 'https://console.groq.com' },
  { label: 'Resend Dashboard', url: 'https://resend.com' },
]

export default function AdminDashboard() {
  const [metrics, setMetrics] = useState<Metrics | null>(null)
  const [loading, setLoading] = useState(true)
  const [lastRefresh, setLastRefresh] = useState<string>('')
  const [role, setRole] = useState<string>('viewer')

  const fetchMetrics = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/metrics')
      if (res.ok) {
        const data: Metrics = await res.json()
        setMetrics(data)
      }
      setLastRefresh(new Date().toLocaleTimeString())
    } catch { /* silent */ } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const cookies = document.cookie.split('; ')
    const roleCookie = cookies.find(c => c.startsWith('admin_role='))
    setRole(roleCookie?.split('=')[1] ?? 'viewer')
    fetchMetrics()
    const t = setInterval(fetchMetrics, 60000)
    return () => clearInterval(t)
  }, [fetchMetrics])

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <div className="max-w-6xl mx-auto space-y-8 font-sans">
      {/* Header — personalized greeting */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-1">{greeting}, Admin</h1>
          <p className="text-gray-500 text-sm">
            Here&apos;s how Poddar Wealth is performing ·{' '}
            <span className="text-amber-600 font-semibold uppercase font-mono text-xs">[{role}]</span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          {lastRefresh && (
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider font-mono">
              {lastRefresh}
            </span>
          )}
          <button
            onClick={fetchMetrics}
            disabled={loading}
            className="inline-flex items-center gap-2 text-xs font-medium text-gray-500 hover:text-gray-900 border border-gray-200 hover:border-gray-300 px-4 py-2.5 rounded-xl transition-all cursor-pointer bg-white shadow-sm disabled:opacity-50"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin text-amber-500' : ''} />
            Refresh
          </button>
        </div>
      </div>

      {loading && <Skeleton />}
      {!loading && !metrics && (
        <div className="p-6 text-red-600 bg-red-50 border border-red-200 rounded-2xl font-medium text-sm">
          Failed to load metrics. Check /api/admin/metrics.
        </div>
      )}

      {metrics && (() => {
        const { content, admin, crm, features, infrastructure, i18n } = metrics
        return (
          <>
            {/* Site Overview */}
            <section className="space-y-3">
              <h2 className="text-gray-500 text-xs font-medium uppercase tracking-widest flex items-center gap-2">
                <Database size={14} className="text-amber-500" />
                Site Metrics
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                <StatCard label="Blog Posts" value={content.blogPosts} />
                <StatCard label="Area Pages" value={content.areaPages} />
                <StatCard label="Tools" value={content.calculators + content.lifeEvents} sub="calc + life events" />
                <StatCard label="API Routes" value={infrastructure.apiRoutes} />
                <StatCard label="Est. Total Pages" value={metrics.estimatedPages} />
                <StatCard label="Admin Pages" value={admin.pages} />
              </div>
            </section>

            {/* CRM */}
            <section className="space-y-3">
              <h2 className="text-gray-500 text-xs font-medium uppercase tracking-widest flex items-center gap-2">
                <Activity size={14} className="text-amber-500" />
                CRM & Leads
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                <StatCard label="Total Leads" value={crm.leads.total} />
                <StatCard label="New" value={crm.leads.new} className="border-l-4 border-l-blue-500" />
                <StatCard label="Contacted" value={crm.leads.contacted} className="border-l-4 border-l-amber-500" />
                <StatCard label="Meeting" value={crm.leads.meeting} />
                <StatCard label="Converted" value={crm.leads.converted} className="border-l-4 border-l-emerald-500" />
                <StatCard label="Newsletter" value={crm.newsletter} sub="subscribers" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <StatCard label="Referral Codes" value={crm.referrals.total} sub={`${crm.referrals.active} active`} />
                <Link href="/admin/leads" className="bg-white border border-gray-200 rounded-2xl p-5 flex items-center justify-between hover:border-amber-400 hover:shadow-sm transition-all group shadow-sm">
                  <span className="text-sm font-semibold text-amber-600 group-hover:text-amber-700">View Leads →</span>
                </Link>
                <Link href="/admin/referrals" className="bg-white border border-gray-200 rounded-2xl p-5 flex items-center justify-between hover:border-amber-400 hover:shadow-sm transition-all group shadow-sm">
                  <span className="text-sm font-semibold text-amber-600 group-hover:text-amber-700">View Referrals →</span>
                </Link>
              </div>
            </section>

            {/* Environment Health */}
            <section className="space-y-3">
              <h2 className="text-gray-500 text-xs font-medium uppercase tracking-widest flex items-center gap-2">
                <CheckCircle size={14} className="text-amber-500" />
                Environment Health —{' '}
                <span className={infrastructure.envConfigured === infrastructure.envTotal ? 'text-emerald-600' : 'text-amber-600 font-mono'}>
                  {infrastructure.envConfigured}/{infrastructure.envTotal} configured
                </span>
              </h2>
              <div className="bg-white border border-gray-200 rounded-2xl p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 shadow-sm">
                {Object.entries(infrastructure.envVars)
                  .filter(([key]) => key !== 'SENTRY_DSN' && key !== 'ADVISOR_PHONE')
                  .map(([key, val]) => {
                    const ok = val === true || (typeof val === 'string' && val !== 'not set')
                    let dotColor = ok ? 'bg-emerald-500' : 'bg-red-500'
                    let textColor = ok ? 'text-gray-600 font-mono' : 'text-red-500 font-mono font-medium'

                    if (key === 'WHATSAPP_ACCESS_TOKEN' && !ok) {
                      dotColor = 'bg-amber-400'
                      textColor = 'text-amber-600 font-mono font-medium'
                    }

                    return (
                      <div key={key} className="flex items-center gap-2 text-xs">
                        <span className={`w-2 h-2 rounded-full flex-shrink-0 ${dotColor}`} />
                        <span className={`${textColor} truncate`}>{key}</span>
                        {typeof val === 'string' && val !== 'not set' && (
                          <span className="text-gray-400 truncate font-mono">({val})</span>
                        )}
                      </div>
                    )
                  })}
              </div>
            </section>

            {/* Features */}
            <section className="space-y-3">
              <h2 className="text-gray-500 text-xs font-medium uppercase tracking-widest">Features</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard label="NAV Funds Tracked" value={features.navTracker.funds} sub={`${features.navTracker.alerts} alerts active`} />
                <StatCard label="A/B Test Events" value={features.abTests} />
                <StatCard label="Cron Jobs" value={features.cronJobs} sub="scheduled" />
                <Link href="/admin/ab" className="bg-white border border-gray-200 rounded-2xl p-5 hover:border-amber-400 hover:shadow-sm transition-all flex flex-col justify-between group shadow-sm">
                  <div className="text-3xl font-medium text-gray-900 font-mono">{features.cronJobs}</div>
                  <div className="text-xs font-semibold text-amber-600 group-hover:text-amber-700 mt-2">A/B Tests →</div>
                </Link>
              </div>
              {features.cronList.length > 0 && (
                <div className="mt-4 bg-white border border-gray-200 rounded-2xl divide-y divide-gray-100 overflow-hidden shadow-sm">
                  {features.cronList.map(c => (
                    <div key={c.path} className="flex justify-between px-5 py-3.5 text-xs font-mono">
                      <span className="text-amber-600">{c.path}</span>
                      <span className="text-gray-400">{c.schedule}</span>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Activity Log */}
            <section className="space-y-3">
              <h2 className="text-gray-500 text-xs font-medium uppercase tracking-widest flex items-center gap-2">
                <Activity size={14} className="text-amber-500" />
                System Activity Log
              </h2>
              <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden divide-y divide-gray-100 shadow-sm">
                {MOCK_ACTIVITY.map((log, index) => {
                  const isSuccess = log.status >= 200 && log.status < 300
                  const statusColor = isSuccess
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                    : 'bg-red-50 border-red-200 text-red-600'
                  return (
                    <div
                      key={index}
                      className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 gap-3 text-xs ${
                        index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="font-mono text-gray-400">
                          {new Date(log.timestamp).toLocaleTimeString()}
                        </span>
                        <span className="bg-gray-100 border border-gray-200 text-gray-500 text-[10px] font-medium px-2 py-0.5 rounded font-mono">
                          {log.method}
                        </span>
                        <span className="font-mono text-gray-700 bg-gray-100 border border-gray-200 px-2 py-1 rounded">
                          {log.route}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 justify-between sm:justify-end">
                        <span className="text-gray-400 font-mono text-[11px]">{log.ip}</span>
                        <span className={`px-2.5 py-0.5 rounded-full border text-[10px] font-medium font-mono ${statusColor}`}>
                          {log.status}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </section>

            {/* Content Details */}
            <section className="space-y-3">
              <h2 className="text-gray-500 text-xs font-medium uppercase tracking-widest">Content</h2>
              <div className="bg-white border border-gray-200 rounded-2xl divide-y divide-gray-100 overflow-hidden shadow-sm">
                {[
                  ['Blog categories', content.blogCategoryList.join(', ') || 'none'],
                  ['Latest post', content.blogLatest ? `${content.blogLatest.title} · ${content.blogLatest.date}` : 'none'],
                  ['Blog index size', `${content.blogIndexSizeKB} KB`],
                  ['Reviews', String(content.reviews)],
                  ['Search index entries', String(content.searchIndexEntries)],
                  ['Service pages', String(content.servicePages)],
                  ['Area pages', String(content.areaPages)],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between px-5 py-3.5 text-sm">
                    <span className="text-gray-500">{label}</span>
                    <span className="font-medium text-gray-700 truncate max-w-xs text-right">{value}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* i18n */}
            <section className="space-y-3">
              <h2 className="text-gray-500 text-xs font-medium uppercase tracking-widest">i18n Status</h2>
              <div className="bg-white border border-gray-200 rounded-2xl divide-y divide-gray-100 overflow-hidden shadow-sm">
                {[
                  ['English keys', String(i18n.enKeys)],
                  ['Hindi keys', String(i18n.hiKeys)],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between px-5 py-3.5 text-sm">
                    <span className="text-gray-500">{label}</span>
                    <span className="font-medium text-gray-900">{value}</span>
                  </div>
                ))}
                <div className="flex justify-between px-5 py-3.5 text-sm">
                  <span className="text-gray-500">Parity</span>
                  <span className={`font-medium ${i18n.parity ? 'text-emerald-600' : 'text-amber-600'}`}>
                    {i18n.parity ? '✓ Perfect' : `${i18n.gap} keys missing`}
                  </span>
                </div>
              </div>
            </section>

            {/* Infrastructure */}
            <section className="space-y-3">
              <h2 className="text-gray-500 text-xs font-medium uppercase tracking-widest">Infrastructure</h2>
              <div className="bg-white border border-gray-200 rounded-2xl divide-y divide-gray-100 overflow-hidden shadow-sm">
                {[
                  ['Next.js', infrastructure.nextVersion],
                  ['React', infrastructure.reactVersion],
                  ['Environment', infrastructure.environment],
                  ['Last build', infrastructure.lastBuild ? new Date(infrastructure.lastBuild).toLocaleString() : 'unknown'],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between px-5 py-3.5 text-sm">
                    <span className="text-gray-500">{label}</span>
                    <span className="font-medium text-gray-700 font-mono text-xs">{value}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Monitoring links */}
            {role !== 'viewer' ? (
              <section className="space-y-3">
                <h2 className="text-gray-500 text-xs font-medium uppercase tracking-widest flex items-center gap-1.5">
                  <Link2 size={14} className="text-amber-500" />
                  External Consoles
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {MONITORING_LINKS.map(l => (
                    <a
                      key={l.label}
                      href={l.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-white border border-gray-200 rounded-2xl p-5 hover:border-amber-400 hover:shadow-md hover:-translate-y-0.5 transition-all group shadow-sm"
                    >
                      <p className="text-gray-900 text-xs font-bold uppercase tracking-wider group-hover:text-amber-600 transition-colors">
                        {l.label}
                      </p>
                      <p className="text-gray-400 text-[10px] mt-1.5 truncate font-mono">
                        {l.url.replace('https://', '')}
                      </p>
                    </a>
                  ))}
                </div>
              </section>
            ) : (
              <div className="bg-white border border-gray-200 rounded-2xl p-6 flex flex-col justify-center items-center text-center shadow-sm">
                <AlertCircle size={24} className="text-gray-300 mb-3" />
                <h3 className="text-gray-900 font-semibold text-sm mb-1">External Console Access Restricted</h3>
                <p className="text-gray-400 text-xs leading-relaxed max-w-xs font-medium">
                  Vercel, GA4, Resend, and Search Console links are hidden for the viewer role.
                </p>
              </div>
            )}

            {/* Live indicator */}
            <div className="flex items-center gap-2 text-xs text-gray-400 pb-4">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Live · Last updated {new Date(metrics.timestamp).toLocaleString()} · Auto-refreshes every 60s</span>
            </div>
          </>
        )
      })()}
    </div>
  )
}
