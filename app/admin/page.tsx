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

function Skeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} className="h-20 bg-gray-800 rounded-xl animate-pulse" />
      ))}
    </div>
  )
}

function StatCard({ label, value, color = 'amber', sub }: { label: string; value: string | number; color?: string; sub?: string }) {
  const colors: Record<string, string> = {
    amber: 'text-amber-400',
    blue: 'text-blue-400',
    green: 'text-emerald-400',
    purple: 'text-purple-400',
    indigo: 'text-indigo-400',
    gray: 'text-white',
    red: 'text-red-400',
  }
  return (
    <div className="bg-gray-900 border border-gray-800/80 rounded-2xl p-4">
      <div className={`text-3xl font-black ${colors[color] ?? colors.amber}`}>{value}</div>
      <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-1">{label}</div>
      {sub && <div className="text-[9px] text-gray-600 mt-0.5 font-medium">{sub}</div>}
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
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Poddar Wealth — System Metrics</h1>
          <p className="text-gray-500 text-sm">
            Current Session Role: <span className="text-amber-500 font-bold uppercase">[{role}]</span> · Auto-refreshing every 60s
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          {lastRefresh && (
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">
              Refreshed: {lastRefresh}
            </span>
          )}
          <button
            onClick={fetchMetrics}
            disabled={loading}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-400 hover:text-white border border-gray-800 hover:border-gray-700 px-4 py-2.5 rounded-xl transition-all cursor-pointer bg-gray-900"
          >
            <RefreshCw size={12} className={loading ? 'animate-spin text-amber-500' : ''} />
            Fetch Updates
          </button>
        </div>
      </div>

      {loading && <Skeleton />}
      {!loading && !metrics && (
        <div className="p-8 text-red-400 bg-red-950/30 border border-red-900/40 rounded-2xl">
          Failed to load metrics. Check /api/admin/metrics.
        </div>
      )}

      {metrics && (() => {
        const { content, admin, crm, features, infrastructure, i18n } = metrics
        return (
          <>
            {/* Site Overview */}
            <section>
              <h2 className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-3 flex items-center gap-1.5">
                <Database size={14} className="text-amber-500" />
                Site Metrics
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                <StatCard label="Blog Posts" value={content.blogPosts} color="amber" />
                <StatCard label="Area Pages" value={content.areaPages} color="blue" />
                <StatCard label="Tools" value={content.calculators + content.lifeEvents} sub="calc + life events" color="green" />
                <StatCard label="API Routes" value={infrastructure.apiRoutes} color="purple" />
                <StatCard label="Est. Total Pages" value={metrics.estimatedPages} color="indigo" />
                <StatCard label="Admin Pages" value={admin.pages} color="gray" />
              </div>
            </section>

            {/* CRM */}
            <section>
              <h2 className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-3 flex items-center gap-1.5">
                <Activity size={14} className="text-amber-500" />
                CRM & Leads
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                <StatCard label="Total Leads" value={crm.leads.total} color="gray" />
                <StatCard label="New" value={crm.leads.new} color="blue" />
                <StatCard label="Contacted" value={crm.leads.contacted} color="amber" />
                <StatCard label="Meeting" value={crm.leads.meeting} color="purple" />
                <StatCard label="Converted" value={crm.leads.converted} color="green" />
                <StatCard label="Newsletter" value={crm.newsletter} sub="subscribers" color="indigo" />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-3">
                <StatCard label="Referral Codes" value={crm.referrals.total} sub={`${crm.referrals.active} active`} color="gray" />
                <Link href="/admin/leads" className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 flex items-center justify-between hover:bg-amber-500/20 transition-colors">
                  <span className="text-sm font-bold text-amber-400">View Leads →</span>
                </Link>
                <Link href="/admin/referrals" className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4 flex items-center justify-between hover:bg-blue-500/20 transition-colors">
                  <span className="text-sm font-bold text-blue-400">View Referrals →</span>
                </Link>
              </div>
            </section>

            {/* Environment Health */}
            <section>
              <h2 className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-3 flex items-center gap-1.5">
                <CheckCircle size={14} className="text-amber-500" />
                Environment Health —{' '}
                <span className={infrastructure.envConfigured === infrastructure.envTotal ? 'text-emerald-400' : 'text-amber-400'}>
                  {infrastructure.envConfigured}/{infrastructure.envTotal} configured
                </span>
              </h2>
              <div className="bg-gray-900 border border-gray-800 rounded-3xl p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                {Object.entries(infrastructure.envVars).map(([key, val]) => {
                  const ok = val === true || (typeof val === 'string' && val !== 'not set')
                  return (
                    <div key={key} className="flex items-center gap-2 text-xs">
                      <span className={`w-2 h-2 rounded-full flex-shrink-0 ${ok ? 'bg-emerald-500' : 'bg-red-400'}`} />
                      <span className={ok ? 'text-gray-300 font-mono' : 'text-red-400 font-mono font-semibold'}>{key}</span>
                      {typeof val === 'string' && val !== 'not set' && (
                        <span className="text-gray-500 truncate">{val}</span>
                      )}
                    </div>
                  )
                })}
              </div>
            </section>

            {/* Features */}
            <section>
              <h2 className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-3">Features</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <StatCard label="NAV Funds Tracked" value={features.navTracker.funds} sub={`${features.navTracker.alerts} alerts active`} color="gray" />
                <StatCard label="A/B Test Events" value={features.abTests} color="indigo" />
                <StatCard label="Cron Jobs" value={features.cronJobs} sub="scheduled" color="amber" />
                <Link href="/admin/ab" className="bg-gray-900 border border-gray-800 rounded-2xl p-4 hover:border-amber-500/40 transition-colors flex flex-col justify-between">
                  <div className="text-2xl font-black text-white">{features.cronJobs}</div>
                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-1">A/B Tests →</div>
                </Link>
              </div>
              {features.cronList.length > 0 && (
                <div className="mt-3 bg-gray-900 border border-gray-800 rounded-2xl divide-y divide-gray-800/60">
                  {features.cronList.map(c => (
                    <div key={c.path} className="flex justify-between px-5 py-3 text-xs">
                      <span className="font-mono text-amber-400">{c.path}</span>
                      <span className="text-gray-500">{c.schedule}</span>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Content Details */}
            <section>
              <h2 className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-3">Content</h2>
              <div className="bg-gray-900 border border-gray-800 rounded-3xl divide-y divide-gray-800/60 shadow-lg">
                {[
                  ['Blog categories', content.blogCategoryList.join(', ') || 'none'],
                  ['Latest post', content.blogLatest ? `${content.blogLatest.title} · ${content.blogLatest.date}` : 'none'],
                  ['Blog index size', `${content.blogIndexSizeKB} KB`],
                  ['Reviews', String(content.reviews)],
                  ['Search index entries', String(content.searchIndexEntries)],
                  ['Service pages', String(content.servicePages)],
                  ['Area pages', String(content.areaPages)],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between px-5 py-3 text-sm">
                    <span className="text-gray-500">{label}</span>
                    <span className="font-medium text-gray-300 truncate max-w-xs text-right">{value}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* i18n */}
            <section>
              <h2 className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-3">i18n Status</h2>
              <div className="bg-gray-900 border border-gray-800 rounded-3xl divide-y divide-gray-800/60 shadow-lg">
                {[
                  ['English keys', String(i18n.enKeys)],
                  ['Hindi keys', String(i18n.hiKeys)],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between px-5 py-3 text-sm">
                    <span className="text-gray-500">{label}</span>
                    <span className="font-medium text-white">{value}</span>
                  </div>
                ))}
                <div className="flex justify-between px-5 py-3 text-sm">
                  <span className="text-gray-500">Parity</span>
                  <span className={`font-semibold ${i18n.parity ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {i18n.parity ? '✓ Perfect' : `${i18n.gap} keys missing`}
                  </span>
                </div>
              </div>
            </section>

            {/* Infrastructure */}
            <section>
              <h2 className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-3">Infrastructure</h2>
              <div className="bg-gray-900 border border-gray-800 rounded-3xl divide-y divide-gray-800/60 shadow-lg">
                {[
                  ['Next.js', infrastructure.nextVersion],
                  ['React', infrastructure.reactVersion],
                  ['Environment', infrastructure.environment],
                  ['Last build', infrastructure.lastBuild ? new Date(infrastructure.lastBuild).toLocaleString() : 'unknown'],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between px-5 py-3 text-sm">
                    <span className="text-gray-500">{label}</span>
                    <span className="font-medium text-white font-mono text-xs">{value}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Monitoring links (role-gated) */}
            {role !== 'viewer' ? (
              <section>
                <h2 className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-3 flex items-center gap-1.5">
                  <Link2 size={14} className="text-amber-500" />
                  External Consoles
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {MONITORING_LINKS.map(l => (
                    <a
                      key={l.label}
                      href={l.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-gray-900 border border-gray-800 rounded-2xl p-4 hover:border-amber-500/40 transition-all group"
                    >
                      <p className="text-white text-xs font-extrabold uppercase tracking-wider group-hover:text-amber-400 transition-colors">
                        {l.label}
                      </p>
                      <p className="text-gray-500 text-[10px] mt-1 truncate font-mono">
                        {l.url.replace('https://', '')}
                      </p>
                    </a>
                  ))}
                </div>
              </section>
            ) : (
              <div className="bg-gray-900/30 border border-gray-800/50 rounded-3xl p-6 flex flex-col justify-center items-center text-center">
                <AlertCircle size={24} className="text-gray-500 mb-3" />
                <h3 className="text-white font-extrabold text-sm mb-1">External Console Access Restricted</h3>
                <p className="text-gray-500 text-xs leading-relaxed max-w-xs font-medium">
                  Vercel, GA4, Resend, and Search Console links are hidden for the viewer role.
                </p>
              </div>
            )}

            <p className="text-xs text-gray-600 text-right pb-4">
              Data as of {new Date(metrics.timestamp).toLocaleString()} · Auto-refreshes every 60s
            </p>
          </>
        )
      })()}
    </div>
  )
}
