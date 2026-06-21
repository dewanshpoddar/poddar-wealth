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
        <div key={i} className="h-24 bg-[#13131A] border border-[#27272A] rounded-2xl animate-pulse" />
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
    <div className={`bg-[#13131A] border border-[#27272A] rounded-2xl p-5 flex flex-col justify-between ${className}`}>
      <div>
        <p className="text-xs text-gray-500 uppercase tracking-wider mb-2 font-medium">
          {label}
        </p>
        <p className="text-3xl font-medium text-white font-mono tracking-tight">
          {value}
        </p>
      </div>
      {sub && (
        <p className="text-xs text-gray-600 mt-2 font-medium">{sub}</p>
      )}
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

  return (
    <div className="max-w-6xl mx-auto space-y-8 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-medium text-white mb-1">Poddar Wealth — System Metrics</h1>
          <p className="text-gray-500 text-sm">
            Current Session Role: <span className="text-amber-500 font-medium uppercase font-mono">[{role}]</span> · Auto-refreshing every 60s
          </p>
        </div>
        <div className="flex items-center gap-3">
          {lastRefresh && (
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider font-mono">
              Refreshed: {lastRefresh}
            </span>
          )}
          <button
            onClick={fetchMetrics}
            disabled={loading}
            className="inline-flex items-center gap-2 text-xs font-medium text-gray-400 hover:text-white border border-[#27272A] hover:border-amber-500/30 px-4 py-2.5 rounded-xl transition-all cursor-pointer bg-[#13131A] disabled:opacity-50"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin text-amber-500' : ''} />
            Fetch Updates
          </button>
        </div>
      </div>

      {loading && <Skeleton />}
      {!loading && !metrics && (
        <div className="p-6 text-red-400 bg-red-950/20 border border-red-900/30 rounded-2xl font-medium text-sm">
          Failed to load metrics. Check /api/admin/metrics.
        </div>
      )}

      {metrics && (() => {
        const { content, admin, crm, features, infrastructure, i18n } = metrics
        return (
          <>
            {/* Site Overview */}
            <section className="space-y-3">
              <h2 className="text-gray-400 text-xs font-medium uppercase tracking-widest flex items-center gap-2">
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
              <h2 className="text-gray-400 text-xs font-medium uppercase tracking-widest flex items-center gap-2">
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
                <Link href="/admin/leads" className="bg-[#13131A] border border-[#27272A] rounded-2xl p-5 flex items-center justify-between hover:border-amber-500/50 transition-colors group">
                  <span className="text-sm font-medium text-amber-500 group-hover:text-amber-400">View Leads →</span>
                </Link>
                <Link href="/admin/referrals" className="bg-[#13131A] border border-[#27272A] rounded-2xl p-5 flex items-center justify-between hover:border-amber-500/50 transition-colors group">
                  <span className="text-sm font-medium text-amber-500 group-hover:text-amber-400">View Referrals →</span>
                </Link>
              </div>
            </section>

            {/* Environment Health */}
            <section className="space-y-3">
              <h2 className="text-gray-400 text-xs font-medium uppercase tracking-widest flex items-center gap-2">
                <CheckCircle size={14} className="text-amber-500" />
                Environment Health —{' '}
                <span className={infrastructure.envConfigured === infrastructure.envTotal ? 'text-emerald-400' : 'text-amber-400 font-mono'}>
                  {infrastructure.envConfigured}/{infrastructure.envTotal} configured
                </span>
              </h2>
              <div className="bg-[#13131A] border border-[#27272A] rounded-2xl p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {Object.entries(infrastructure.envVars)
                  .filter(([key]) => key !== 'SENTRY_DSN' && key !== 'ADVISOR_PHONE')
                  .map(([key, val]) => {
                    const ok = val === true || (typeof val === 'string' && val !== 'not set')
                    let dotColor = ok ? 'bg-emerald-500' : 'bg-red-500'
                    let textColor = ok ? 'text-gray-300 font-mono' : 'text-red-400 font-mono font-medium'

                    if (key === 'WHATSAPP_ACCESS_TOKEN' && !ok) {
                      dotColor = 'bg-amber-500'
                      textColor = 'text-amber-500 font-mono font-medium'
                    }

                    return (
                      <div key={key} className="flex items-center gap-2 text-xs">
                        <span className={`w-2 h-2 rounded-full flex-shrink-0 ${dotColor}`} />
                        <span className={`${textColor} truncate`}>{key}</span>
                        {typeof val === 'string' && val !== 'not set' && (
                          <span className="text-gray-500 truncate font-mono">({val})</span>
                        )}
                      </div>
                    )
                  })}
              </div>
            </section>

            {/* Features */}
            <section className="space-y-3">
              <h2 className="text-gray-400 text-xs font-medium uppercase tracking-widest">Features</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard label="NAV Funds Tracked" value={features.navTracker.funds} sub={`${features.navTracker.alerts} alerts active`} />
                <StatCard label="A/B Test Events" value={features.abTests} />
                <StatCard label="Cron Jobs" value={features.cronJobs} sub="scheduled" />
                <Link href="/admin/ab" className="bg-[#13131A] border border-[#27272A] rounded-2xl p-5 hover:border-amber-500/50 transition-colors flex flex-col justify-between group">
                  <div className="text-3xl font-medium text-white font-mono">{features.cronJobs}</div>
                  <div className="text-xs font-medium text-amber-500 group-hover:text-amber-400 mt-2">A/B Tests →</div>
                </Link>
              </div>
              {features.cronList.length > 0 && (
                <div className="mt-4 bg-[#13131A] border border-[#27272A] rounded-2xl divide-y divide-[#27272A] overflow-hidden">
                  {features.cronList.map(c => (
                    <div key={c.path} className="flex justify-between px-5 py-3.5 text-xs font-mono">
                      <span className="text-amber-500">{c.path}</span>
                      <span className="text-gray-500">{c.schedule}</span>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Activity Log */}
            <section className="space-y-3">
              <h2 className="text-gray-400 text-xs font-medium uppercase tracking-widest flex items-center gap-2">
                <Activity size={14} className="text-amber-500" />
                System Activity Log
              </h2>
              <div className="bg-[#13131A] border border-[#27272A] rounded-2xl overflow-hidden divide-y divide-[#27272A]">
                {MOCK_ACTIVITY.map((log, index) => {
                  const isSuccess = log.status >= 200 && log.status < 300
                  const statusColor = isSuccess
                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                    : 'bg-red-500/10 border-red-500/20 text-red-400'
                  return (
                    <div
                      key={index}
                      className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 gap-3 text-xs ${
                        index % 2 === 0 ? 'bg-[#0A0A0F]' : 'bg-[#13131A]'
                      }`}
                    >
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="font-mono text-zinc-500">
                          {new Date(log.timestamp).toLocaleTimeString()}
                        </span>
                        <span className="bg-[#1A1A24] border border-[#27272A] text-zinc-400 text-[10px] font-medium px-2 py-0.5 rounded font-mono">
                          {log.method}
                        </span>
                        <span className="font-mono text-white bg-[#0A0A0F] border border-[#1E1E26] px-2 py-1 rounded">
                          {log.route}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 justify-between sm:justify-end">
                        <span className="text-zinc-500 font-mono text-[11px]">{log.ip}</span>
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
              <h2 className="text-gray-400 text-xs font-medium uppercase tracking-widest">Content</h2>
              <div className="bg-[#13131A] border border-[#27272A] rounded-2xl divide-y divide-[#27272A] overflow-hidden shadow-sm">
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
                    <span className="font-medium text-gray-300 truncate max-w-xs text-right">{value}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* i18n */}
            <section className="space-y-3">
              <h2 className="text-gray-400 text-xs font-medium uppercase tracking-widest">i18n Status</h2>
              <div className="bg-[#13131A] border border-[#27272A] rounded-2xl divide-y divide-[#27272A] overflow-hidden shadow-sm">
                {[
                  ['English keys', String(i18n.enKeys)],
                  ['Hindi keys', String(i18n.hiKeys)],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between px-5 py-3.5 text-sm">
                    <span className="text-gray-500">{label}</span>
                    <span className="font-medium text-white">{value}</span>
                  </div>
                ))}
                <div className="flex justify-between px-5 py-3.5 text-sm">
                  <span className="text-gray-500">Parity</span>
                  <span className={`font-medium ${i18n.parity ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {i18n.parity ? '✓ Perfect' : `${i18n.gap} keys missing`}
                  </span>
                </div>
              </div>
            </section>

            {/* Infrastructure */}
            <section className="space-y-3">
              <h2 className="text-gray-400 text-xs font-medium uppercase tracking-widest">Infrastructure</h2>
              <div className="bg-[#13131A] border border-[#27272A] rounded-2xl divide-y divide-[#27272A] overflow-hidden shadow-sm">
                {[
                  ['Next.js', infrastructure.nextVersion],
                  ['React', infrastructure.reactVersion],
                  ['Environment', infrastructure.environment],
                  ['Last build', infrastructure.lastBuild ? new Date(infrastructure.lastBuild).toLocaleString() : 'unknown'],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between px-5 py-3.5 text-sm">
                    <span className="text-gray-500">{label}</span>
                    <span className="font-medium text-white font-mono text-xs">{value}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Monitoring links (role-gated) */}
            {role !== 'viewer' ? (
              <section className="space-y-3">
                <h2 className="text-gray-400 text-xs font-medium uppercase tracking-widest flex items-center gap-1.5">
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
                      className="bg-[#13131A] border border-[#27272A] rounded-2xl p-5 hover:border-amber-500/40 transition-all group"
                    >
                      <p className="text-white text-xs font-bold uppercase tracking-wider group-hover:text-amber-500 transition-colors">
                        {l.label}
                      </p>
                      <p className="text-gray-500 text-[10px] mt-1.5 truncate font-mono">
                        {l.url.replace('https://', '')}
                      </p>
                    </a>
                  ))}
                </div>
              </section>
            ) : (
              <div className="bg-[#13131A] border border-[#27272A] rounded-2xl p-6 flex flex-col justify-center items-center text-center">
                <AlertCircle size={24} className="text-gray-500 mb-3" />
                <h3 className="text-white font-medium text-sm mb-1">External Console Access Restricted</h3>
                <p className="text-gray-500 text-xs leading-relaxed max-w-xs font-medium">
                  Vercel, GA4, Resend, and Search Console links are hidden for the viewer role.
                </p>
              </div>
            )}

            <p className="text-xs text-gray-600 text-right pb-4 font-mono">
              Data as of {new Date(metrics.timestamp).toLocaleString()} · Auto-refreshes every 60s
            </p>
          </>
        )
      })()}
    </div>
  )
}
