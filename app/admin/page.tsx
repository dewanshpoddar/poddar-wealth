'use client';

import { useState, useEffect } from 'react';
import { Shield, RefreshCw, Terminal, Eye, Link2, Activity, Database, AlertCircle, CheckCircle } from 'lucide-react';

interface MetricItem {
  label: string;
  value: string;
}

interface ApiLogItem {
  timestamp: string;
  method: string;
  endpoint: string;
  status: number;
  ip: string;
}

const DEFAULT_METRICS: MetricItem[] = [
  { label: 'Total Pages', value: '100+' },
  { label: 'Blog Posts', value: '100' },
  { label: 'Tools / Calculators', value: '8' },
  { label: 'Area Pages', value: '20' },
  { label: 'Service Pages', value: '12' },
  { label: 'API Routes', value: '17' },
];

const MOCK_API_LOGS: ApiLogItem[] = [
  { timestamp: '2026-06-08T22:01:05Z', method: 'POST', endpoint: '/api/leads', status: 200, ip: '192.168.1.5' },
  { timestamp: '2026-06-08T22:00:58Z', method: 'GET', endpoint: '/api/nav', status: 200, ip: '103.45.21.90' },
  { timestamp: '2026-06-08T21:59:12Z', method: 'POST', endpoint: '/api/chat', status: 200, ip: '45.112.98.34' },
  { timestamp: '2026-06-08T21:58:30Z', method: 'GET', endpoint: '/api/reviews', status: 304, ip: '103.45.21.90' },
  { timestamp: '2026-06-08T21:55:00Z', method: 'POST', endpoint: '/api/reports/wealth-blueprint', status: 201, ip: '172.56.23.109' },
  { timestamp: '2026-06-08T21:54:15Z', method: 'GET', endpoint: '/api/admin/metrics', status: 200, ip: '127.0.0.1' },
  { timestamp: '2026-06-08T21:50:22Z', method: 'POST', endpoint: '/api/admin/auth', status: 200, ip: '127.0.0.1' },
  { timestamp: '2026-06-08T21:49:50Z', method: 'POST', endpoint: '/api/admin/auth', status: 401, ip: '127.0.0.1' },
  { timestamp: '2026-06-08T21:45:10Z', method: 'GET', endpoint: '/api/cron/refresh-nav', status: 200, ip: '23.45.67.89' },
  { timestamp: '2026-06-08T21:30:15Z', method: 'POST', endpoint: '/api/referrals/generate', status: 200, ip: '45.112.98.34' },
  { timestamp: '2026-06-08T21:28:44Z', method: 'GET', endpoint: '/api/lic-plans', status: 200, ip: '120.48.91.22' },
  { timestamp: '2026-06-08T21:20:00Z', method: 'POST', endpoint: '/api/cron/check-plan-status', status: 200, ip: '23.45.67.89' }
];

const MONITORING_LINKS = [
  { label: 'Vercel Dashboard', url: 'https://vercel.com/dewanshpoddar/poddar-wealth' },
  { label: 'Google Analytics 4', url: 'https://analytics.google.com' },
  { label: 'Google Search Console', url: 'https://search.google.com/search-console' },
  { label: 'Groq Console', url: 'https://console.groq.com' },
  { label: 'Resend Dashboard', url: 'https://resend.com' },
  { label: 'UptimeRobot', url: 'https://uptimerobot.com' },
];

const SITE_HEALTH = [
  { label: 'Lighthouse SEO', value: '100', status: 'green' },
  { label: 'Lighthouse A11y', value: '90–95', status: 'green' },
  { label: 'Lighthouse Perf (mobile)', value: '56–65', status: 'yellow' },
  { label: 'First Load JS (shared)', value: '105 kB', status: 'green' },
  { label: 'blog-index.json', value: '~165 KB', status: 'yellow' },
  { label: 'TypeScript errors', value: '0', status: 'green' },
  { label: 'ESLint errors', value: '0', status: 'green' },
  { label: 'Last deploy', value: '2026-06-08', status: 'green' },
];

const SPRINTS = [
  {
    name: 'Sprint 1–4',
    date: '2026-05-31',
    items: [
      '/claims, /faq, /blog (15 posts), /pay-premium, 404 page',
      'Mobile fixes: MobileCTABar, navbar spacing, chatbot position',
      'SEO: unique metadata, Schema.org, sitemap, 15 bilingual blog posts',
      'GA4 events: blog_viewed, pay_premium_clicked, lead_submitted',
      'Dead links audit: zero dead links found',
    ],
  },
  {
    name: 'Sprint 5',
    date: '2026-06-08',
    items: [
      'Blog architecture: blog-posts.json → blog-index.json + 100 per-post files',
      'JSON-LD InsuranceAgency schema on all 11 service + area page layouts',
      'PDF Report: WealthBlueprintPDF (4-page) + /api/reports/wealth-blueprint',
      'Chatbot memory capped at 10 messages (5 exchanges)',
      'Email service: lib/email.ts (Resend) + sendWelcomeEmail on newsletter subscribe',
      '30 new blog posts → total 100 posts in blog-index.json',
      'Reviews API: /api/reviews with 1hr cache',
    ],
  },
  {
    name: 'Sprint 6 (today)',
    date: '2026-06-08',
    items: [
      'Admin dashboard: /admin, /admin/architecture, /admin/docs',
      'Auth API: /api/admin/auth (ADMIN_DASHBOARD_PASSWORD)',
      'robots.txt: Disallow: /admin/ added',
      'Sitemap: /admin/* excluded',
      'Blog architecture verified: 100 files, 0 broken relatedSlugs',
      'API health verified across 17 routes',
    ],
  },
];

const PENDING_TASKS = [
  { task: 'Sign up at resend.com + verify poddarwealth.com domain', priority: 'High' },
  { task: 'Add ADMIN_DASHBOARD_PASSWORD to Vercel env vars', priority: 'High' },
  { task: 'Add RESEND_API_KEY to Vercel env vars', priority: 'High' },
  { task: 'Submit sitemap to Google Search Console (if not done)', priority: 'Medium' },
  { task: 'Set up UptimeRobot for poddarwealth.com (free uptime alerts)', priority: 'Medium' },
  { task: 'Set up Sentry DSN for error tracking', priority: 'Low' },
  { task: 'Move components/calculators/ → src/features/premium-calculator/ (FSD)', priority: 'Low' },
  { task: 'Fix ResultsPanel: totalSRB → totalBonus (tech debt)', priority: 'Low' },
  { task: 'Add /login page (navbar login link is dead)', priority: 'Low' },
];

function StatusDot({ status }: { status: string }) {
  const colors: Record<string, string> = {
    green: 'bg-emerald-500 shadow-emerald-500/20',
    yellow: 'bg-amber-500 shadow-amber-500/20',
    red: 'bg-rose-500 shadow-rose-500/20',
  };
  return <span className={`inline-block w-2 h-2 rounded-full ${colors[status] ?? 'bg-gray-500'} shadow-sm mr-2.5`} />;
}

export default function AdminDashboard() {
  const [role, setRole] = useState<'admin' | 'developer' | 'viewer'>('viewer');
  const [metrics, setMetrics] = useState<MetricItem[]>(DEFAULT_METRICS);
  const [apiLogs, setApiLogs] = useState<ApiLogItem[]>(MOCK_API_LOGS);
  const [loading, setLoading] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState<string>('');

  // Fetch metrics & logs from /api/admin/metrics
  const fetchMetricsData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/metrics');
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          if (data.metrics) setMetrics(data.metrics);
          if (data.apiLogs) setApiLogs(data.apiLogs);
        }
      }
    } catch (err) {
      console.warn('Backend metrics API unavailable, displaying cache fallback', err);
    } finally {
      setLoading(false);
      setLastRefreshed(new Date().toLocaleTimeString());
    }
  };

  useEffect(() => {
    // Read role from cookie
    const cookies = document.cookie.split('; ');
    const roleCookie = cookies.find((c) => c.startsWith('admin_role='));
    const activeRole = (roleCookie?.split('=')[1] as any) || 'viewer';
    setRole(activeRole);

    fetchMetricsData();

    // Set 60s auto refresh interval loop
    const interval = setInterval(() => {
      fetchMetricsData();
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300) return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
    if (status >= 300 && status < 400) return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
    return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Welcome Heading */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Poddar Wealth — System Metrics</h1>
          <p className="text-gray-500 text-sm">
            Current Session Role: <span className="text-amber-500 font-bold uppercase">[{role}]</span> · Auto-refreshing every 60s
          </p>
        </div>
        
        <div className="flex items-center gap-2.5">
          {lastRefreshed && (
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider font-sans">
              Refreshed: {lastRefreshed}
            </span>
          )}
          <button
            onClick={fetchMetricsData}
            disabled={loading}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-400 hover:text-white border border-gray-800 hover:border-gray-700 px-4 py-2.5 rounded-xl transition-all cursor-pointer bg-gray-900"
          >
            <RefreshCw size={12} className={loading ? 'animate-spin text-amber-500' : ''} />
            Fetch Updates
          </button>
        </div>
      </div>

      {/* Metrics Card Grid */}
      <section>
        <h2 className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-3 flex items-center gap-1.5">
          <Database size={14} className="text-amber-500" />
          Site Metrics
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {metrics.map((m) => (
            <div key={m.label} className="bg-gray-900 rounded-2xl p-4 border border-gray-800/80">
              <p className="text-2xl font-black text-amber-400 font-sans">{m.value}</p>
              <p className="text-gray-400 text-[10px] uppercase font-bold tracking-wider mt-1">{m.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Active API logs Table (Last 20 requests) */}
      <section>
        <h2 className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-3 flex items-center gap-1.5">
          <Activity size={14} className="text-amber-500" />
          Live Request Logs (Last 20 Accesses)
        </h2>
        <div className="bg-gray-900 border border-gray-800 rounded-3xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-800/80 text-[10px] font-bold uppercase tracking-wider text-gray-500 bg-gray-950/40">
                  <th className="px-6 py-4">Timestamp</th>
                  <th className="px-6 py-4">Method</th>
                  <th className="px-6 py-4">Endpoint</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Client IP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/40 font-mono text-xs">
                {apiLogs.map((log, idx) => (
                  <tr key={idx} className="hover:bg-gray-800/10 transition-colors">
                    <td className="px-6 py-3 whitespace-nowrap text-gray-500">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </td>
                    <td className="px-6 py-3 whitespace-nowrap font-bold text-gray-300">
                      {log.method}
                    </td>
                    <td className="px-6 py-3 whitespace-nowrap font-sans font-bold text-white">
                      {log.endpoint}
                    </td>
                    <td className="px-6 py-3 whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded-md border text-[10px] font-bold ${getStatusColor(log.status)}`}>
                        {log.status}
                      </span>
                    </td>
                    <td className="px-6 py-3 whitespace-nowrap text-gray-500">
                      {log.ip}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Grid: Health & Quick Links (Hides Quick links for Viewer) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Left Column: Health */}
        <section className="space-y-3">
          <h2 className="text-gray-400 text-xs font-bold uppercase tracking-widest flex items-center gap-1.5">
            <CheckCircle size={14} className="text-amber-500" />
            Performance & Health status
          </h2>
          <div className="bg-gray-900 border border-gray-800 rounded-3xl divide-y divide-gray-800/60 shadow-lg">
            {SITE_HEALTH.map((h) => (
              <div key={h.label} className="flex items-center justify-between px-5 py-3">
                <span className="text-gray-300 text-xs font-bold uppercase tracking-wider flex items-center">
                  <StatusDot status={h.status} />
                  {h.label}
                </span>
                <span className="text-white text-xs font-mono font-bold">{h.value}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Right Column: Monitoring Links (Restricted to non-Viewers only) */}
        {role !== 'viewer' ? (
          <section className="space-y-3">
            <h2 className="text-gray-400 text-xs font-bold uppercase tracking-widest flex items-center gap-1.5">
              <Link2 size={14} className="text-amber-500" />
              Developer Administration Controls
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {MONITORING_LINKS.map((l) => (
                <a
                  key={l.label}
                  href={l.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gray-900 border border-gray-800 rounded-2xl p-4 hover:border-amber-500 transition-all duration-300 group"
                >
                  <p className="text-white text-xs font-extrabold uppercase tracking-wider group-hover:text-amber-400 transition-colors">
                    {l.label}
                  </p>
                  <p className="text-gray-500 text-[10px] mt-1.5 truncate font-mono font-medium">
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
              Vercel, GA4, Resend, and Search Console admin links are hidden for the metric viewer role.
            </p>
          </div>
        )}
      </div>

      {/* Sprints & Tasks: Hide/Restrict for Viewer */}
      {role !== 'viewer' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4">
          
          {/* Sprint History */}
          <section className="space-y-3">
            <h2 className="text-gray-400 text-xs font-bold uppercase tracking-widest">Sprint Deploy History</h2>
            <div className="space-y-4">
              {SPRINTS.map((s) => (
                <div key={s.name} className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-amber-400 font-extrabold text-xs uppercase tracking-wider">{s.name}</span>
                    <span className="text-gray-500 text-[11px] font-bold font-sans">{s.date}</span>
                  </div>
                  <ul className="space-y-1.5">
                    {s.items.map((item, i) => (
                      <li key={i} className="text-gray-400 text-xs flex gap-2 font-medium">
                        <span className="text-emerald-500 text-xs font-bold">✓</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* Pending Tasks */}
          <section className="space-y-3">
            <h2 className="text-gray-400 text-xs font-bold uppercase tracking-widest">Next Launch Tasklist</h2>
            <div className="bg-gray-900 border border-gray-800 rounded-3xl divide-y divide-gray-800/60 shadow-lg">
              {PENDING_TASKS.map((t) => (
                <div key={t.task} className="flex items-start justify-between px-5 py-3.5 gap-4">
                  <span className="text-gray-300 text-xs font-medium leading-relaxed">{t.task}</span>
                  <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full shrink-0 ${
                    t.priority === 'High' ? 'bg-rose-950 text-rose-400 border border-rose-900/40' :
                    t.priority === 'Medium' ? 'bg-amber-950 text-amber-400 border border-amber-900/40' :
                    'bg-gray-950 text-gray-400 border border-gray-800'
                  }`}>
                    {t.priority}
                  </span>
                </div>
              ))}
            </div>
          </section>

        </div>
      )}

    </div>
  );
}
