'use client';

import { useEffect, useState } from 'react';

interface DocsData {
  claudeMd: string
  envExample: string
  packageJson: string
  vercelJson: string
}

const envVars = [
  { name: 'GROQ_API_KEY', description: 'Groq API key - https://console.groq.com (free, 14400 req/day)', required: true },
  { name: 'GROQ_MODEL', description: 'Groq model ID (default: llama-3.3-70b-versatile)', required: false },
  { name: 'GOOGLE_SHEETS_WEBHOOK_URL', description: 'Apps Script endpoint - lead capture + newsletter', required: true },
  { name: 'ADMIN_SHEETS_WEBHOOK_URL', description: 'Apps Script endpoint - admin notifications to Ajay sir', required: true },
  { name: 'CRON_SECRET', description: 'Protects /api/cron/* routes (Vercel sends as Bearer token)', required: true },
  { name: 'SYNC_SECRET', description: 'Protects /api/lic-plans/sync (manual sync endpoint)', required: true },
  { name: 'ADMIN_SECRET', description: 'Protects /api/admin/* routes (x-admin-secret header)', required: true },
  { name: 'ADMIN_DASHBOARD_PASSWORD', description: 'Admin dashboard login password (/admin/auth)', required: true },
  { name: 'NEXT_PUBLIC_GA_ID', description: 'Google Analytics 4 Measurement ID (G-XXXXXXXXXX)', required: true },
  { name: 'RESEND_API_KEY', description: 'Resend email API - https://resend.com (free: 3000/month). Verify poddarwealth.com domain first.', required: false },
];

const conventions = [
  { rule: 'Match existing patterns', detail: 'Before adding a component, check src/features/* and components/ for similar ones.' },
  { rule: 'Data in JSON', detail: 'Never hardcode lists/plans/prices in JSX. Use src/data/*.json or lib/data/*.json.' },
  { rule: 'Bilingual', detail: 'All user-facing strings go in lib/en.json AND lib/hi.json.' },
  { rule: 'Tailwind only', detail: 'No inline style={}, no CSS modules, no @import.' },
  { rule: 'TypeScript strict', detail: 'No any - use unknown + type narrowing. All files .tsx or .ts.' },
  { rule: 'Phone number constant', detail: "Ajay sir's number is ADVISOR_PHONE from lib/constants.ts. Never hardcode 9415313434." },
  { rule: 'Error handling', detail: 'Generic message to client in 500s. Detailed errors to adminNotify() only.' },
  { rule: 'Input sanitization', detail: 'Use clean(), csvSanitize() from lib/server-utils.ts. Never inline.' },
  { rule: 'Fonts', detail: 'Use next/font/google via CSS vars (--font-sans, --font-display). No @import.' },
];

const commitConvention = [
  { prefix: 'feat:', example: 'feat: add /renew page with lead capture' },
  { prefix: 'fix:', example: 'fix: chatbot history role order bug' },
  { prefix: 'refactor:', example: 'refactor: DRY extraction to server-utils.ts' },
  { prefix: 'docs:', example: 'docs: update CLAUDE.md sprint 5 log' },
  { prefix: 'perf:', example: 'perf: convert hero images to next/image' },
  { prefix: 'security:', example: 'security: add sheetName whitelist to /api/track' },
];

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-gray-500 text-[10px] font-bold uppercase tracking-wider mb-2">{title}</h2>
      {children}
    </section>
  );
}

function FileSection({ title, content }: { title: string; content: string }) {
  return (
    <details className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
      <summary className="px-5 py-3 text-sm font-semibold text-amber-600 cursor-pointer hover:bg-gray-50 transition-colors select-none">
        {title}
      </summary>
      <pre className="overflow-auto text-xs bg-gray-50 text-gray-800 font-mono p-4 rounded-b-xl max-h-96 whitespace-pre-wrap break-all border-t border-gray-100">
        {content}
      </pre>
    </details>
  );
}

export default function DocsPage() {
  const [docs, setDocs] = useState<DocsData | null>(null)
  const [loadingDocs, setLoadingDocs] = useState(true)

  useEffect(() => {
    fetch('/api/admin/docs')
      .then(r => r.ok ? r.json() : null)
      .then((d: DocsData | null) => {
        if (d && d.claudeMd) {
          setDocs(d);
        }
      })
      .catch(() => {})
      .finally(() => setLoadingDocs(false))
  }, [])

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Developer Docs</h1>
        <p className="text-gray-500 text-sm">Environment vars, conventions, agent rules, git format</p>
      </div>

      {/* Env vars */}
      <Section title="Environment Variables">
        <div className="bg-white border border-gray-200 rounded-xl divide-y divide-gray-100 shadow-sm">
          {envVars.map(v => (
            <div key={v.name} className="px-5 py-3">
              <div className="flex items-center gap-3 mb-1">
                <code className="text-amber-700 text-xs font-mono font-semibold">{v.name}</code>
                {v.required && <span className="text-[10px] font-bold bg-rose-50 border border-rose-100 text-rose-700 px-2 py-0.5 rounded-full">Required</span>}
              </div>
              <p className="text-gray-600 text-sm font-medium">{v.description}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Code conventions */}
      <Section title="Code Conventions">
        <div className="bg-white border border-gray-200 rounded-xl divide-y divide-gray-100 shadow-sm">
          {conventions.map(c => (
            <div key={c.rule} className="flex gap-4 px-5 py-3">
              <span className="text-gray-900 text-sm font-bold shrink-0 w-44">{c.rule}</span>
              <span className="text-gray-600 text-sm font-medium">{c.detail}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* Git convention */}
      <Section title="Git Commit Convention">
        <div className="bg-white border border-gray-200 rounded-xl divide-y divide-gray-100 shadow-sm">
          {commitConvention.map(c => (
            <div key={c.prefix} className="flex gap-4 px-5 py-3 items-center">
              <code className="text-amber-700 text-xs font-mono font-semibold w-20 shrink-0">{c.prefix}</code>
              <code className="text-gray-600 text-xs font-mono font-semibold">{c.example}</code>
            </div>
          ))}
        </div>
      </Section>

      {/* Quick troubleshooting */}
      <Section title="Quick Troubleshooting">
        <div className="bg-white border border-gray-200 rounded-xl divide-y divide-gray-100 shadow-sm">
          {[
            { problem: "Dev server won't start", fix: "lsof -ti:3000 | xargs kill -9 && npm run dev" },
            { problem: 'TypeScript errors after pull', fix: 'rm -rf .next && npm run dev' },
            { problem: 'Vercel CLI not logged in', fix: 'npx vercel login' },
            { problem: 'Need fresh deps', fix: 'rm -rf node_modules package-lock.json && npm install' },
            { problem: 'Pull Vercel env vars locally', fix: 'npx vercel env pull .env.local' },
            { problem: 'Check build before pushing', fix: 'npm run build && npm run start' },
          ].map(t => (
            <div key={t.problem} className="flex gap-4 px-5 py-3">
              <span className="text-gray-900 text-sm font-bold shrink-0 w-52">{t.problem}</span>
              <code className="text-amber-700 text-xs font-mono font-semibold">{t.fix}</code>
            </div>
          ))}
        </div>
      </Section>

      {/* Live file viewer */}
      <Section title="Live Project Files">
        {loadingDocs ? (
          <div className="bg-white border border-gray-200 rounded-xl p-6 text-center text-gray-500 text-sm animate-pulse shadow-sm">
            Loading files from /api/admin/docs…
          </div>
        ) : docs ? (
          <div className="space-y-3">
            <FileSection title="CLAUDE.md - Project memory & conventions" content={docs.claudeMd} />
            <FileSection title=".env.example - Required environment variables" content={docs.envExample} />
            <FileSection title="package.json - Dependencies & scripts" content={docs.packageJson} />
            <FileSection title="vercel.json - Cron jobs & deploy config" content={docs.vercelJson} />
          </div>
        ) : (
          <div className="bg-rose-50 border border-rose-100 rounded-xl p-5 text-rose-700 text-sm">
            Failed to load files from /api/admin/docs.
          </div>
        )}
      </Section>
    </div>
  );
}
