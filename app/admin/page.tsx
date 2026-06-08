export const metadata = { robots: 'noindex,nofollow' };

const metrics = [
  { label: 'Total Pages', value: '100+' },
  { label: 'Blog Posts', value: '100' },
  { label: 'Tools / Calculators', value: '8' },
  { label: 'Area Pages', value: '20' },
  { label: 'Service Pages', value: '12' },
  { label: 'API Routes', value: '17' },
];

const monitoringLinks = [
  { label: 'Vercel Dashboard', url: 'https://vercel.com/dewanshpoddar/poddar-wealth' },
  { label: 'Google Analytics 4', url: 'https://analytics.google.com' },
  { label: 'Google Search Console', url: 'https://search.google.com/search-console' },
  { label: 'Groq Console', url: 'https://console.groq.com' },
  { label: 'Resend Dashboard', url: 'https://resend.com' },
  { label: 'UptimeRobot', url: 'https://uptimerobot.com' },
];

const siteHealth = [
  { label: 'Lighthouse SEO', value: '100', status: 'green' },
  { label: 'Lighthouse A11y', value: '90–95', status: 'green' },
  { label: 'Lighthouse Perf (mobile)', value: '56–65', status: 'yellow' },
  { label: 'First Load JS (shared)', value: '105 kB', status: 'green' },
  { label: 'blog-index.json', value: '~165 KB', status: 'yellow' },
  { label: 'TypeScript errors', value: '0', status: 'green' },
  { label: 'ESLint errors', value: '0', status: 'green' },
  { label: 'Last deploy', value: '2026-06-08', status: 'green' },
];

const sprints = [
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

const pendingTasks = [
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
    green: 'bg-green-500',
    yellow: 'bg-yellow-500',
    red: 'bg-red-500',
  };
  return <span className={`inline-block w-2 h-2 rounded-full ${colors[status] ?? 'bg-gray-500'} mr-2`} />;
}

export default function AdminDashboard() {
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">Poddar Wealth — Admin Dashboard</h1>
        <p className="text-gray-500 text-sm">Last updated: 2026-06-08 · Internal use only</p>
      </div>

      {/* Metrics */}
      <section>
        <h2 className="text-gray-400 text-xs uppercase tracking-widest mb-3">Site Metrics</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {metrics.map(m => (
            <div key={m.label} className="bg-gray-900 rounded-xl p-4 border border-gray-800">
              <p className="text-2xl font-bold text-amber-400">{m.value}</p>
              <p className="text-gray-400 text-xs mt-1">{m.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Monitoring */}
      <section>
        <h2 className="text-gray-400 text-xs uppercase tracking-widest mb-3">Monitoring Links</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {monitoringLinks.map(l => (
            <a
              key={l.label}
              href={l.url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gray-900 border border-gray-800 rounded-xl p-4 hover:border-amber-500 transition-colors group"
            >
              <p className="text-white text-sm font-medium group-hover:text-amber-400 transition-colors">{l.label}</p>
              <p className="text-gray-500 text-xs mt-1 truncate">{l.url.replace('https://', '')}</p>
            </a>
          ))}
        </div>
      </section>

      {/* Site Health */}
      <section>
        <h2 className="text-gray-400 text-xs uppercase tracking-widest mb-3">Site Health</h2>
        <div className="bg-gray-900 border border-gray-800 rounded-xl divide-y divide-gray-800">
          {siteHealth.map(h => (
            <div key={h.label} className="flex items-center justify-between px-5 py-3">
              <span className="text-gray-300 text-sm"><StatusDot status={h.status} />{h.label}</span>
              <span className="text-white text-sm font-mono">{h.value}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Sprint History */}
      <section>
        <h2 className="text-gray-400 text-xs uppercase tracking-widest mb-3">Sprint History</h2>
        <div className="space-y-4">
          {sprints.map(s => (
            <div key={s.name} className="bg-gray-900 border border-gray-800 rounded-xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-amber-400 font-semibold text-sm">{s.name}</span>
                <span className="text-gray-500 text-xs">{s.date}</span>
              </div>
              <ul className="space-y-1">
                {s.items.map((item, i) => (
                  <li key={i} className="text-gray-400 text-sm flex gap-2">
                    <span className="text-green-500 mt-0.5">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Pending Tasks */}
      <section>
        <h2 className="text-gray-400 text-xs uppercase tracking-widest mb-3">Pending Tasks</h2>
        <div className="bg-gray-900 border border-gray-800 rounded-xl divide-y divide-gray-800">
          {pendingTasks.map(t => (
            <div key={t.task} className="flex items-start justify-between px-5 py-3 gap-4">
              <span className="text-gray-300 text-sm">{t.task}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full shrink-0 ${
                t.priority === 'High' ? 'bg-red-900 text-red-400' :
                t.priority === 'Medium' ? 'bg-yellow-900 text-yellow-400' :
                'bg-gray-800 text-gray-400'
              }`}>{t.priority}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
