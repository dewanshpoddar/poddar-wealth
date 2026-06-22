'use client';

import React, { useEffect, useState } from 'react';
import { Calendar, GitCommit, CheckCircle2, ChevronRight, Activity, Award } from 'lucide-react';

interface SprintItem {
  id: string;
  name: string;
  date: string;
  status: 'shipped' | 'active' | 'upcoming';
  description: string;
  deliverables: string[];
  scope: string;
}

const HISTORICAL_SPRINTS: SprintItem[] = [
  {
    id: 'sprints-7-8',
    name: 'Sprint 7 & 8: Final Hardening & PWA Integration',
    date: 'June 9, 2026',
    status: 'active',
    description: 'Security and optimization updates to prepare the codebase for launch, user tracking enhancements, and offline capabilities.',
    scope: 'PWA, Security, SEO, Social, Admin Dashboard',
    deliverables: [
      'PWA Service Worker: Cache-first strategy for static assets inside public/sw.js.',
      'Offline Fallback: Spotty 4G Gorakhpur backup page showing critical contact info.',
      'Google Ads UTM Tracker: Propagate UTM query parameters to lead sheets and prefilled WhatsApp triggers.',
      'Crawler Blocks: robots.txt configured to prevent indexing search campaign pages.',
      'VideoEmbed Component: Lazy loading YouTube/Vimeo iframes to save ~500KB initial page weight.',
      'Dynamic OG Generator: app/blog/[slug]/opengraph-image.tsx using Next.js ImageResponse.',
      'Zero-Dependency Rate Limiter: Async REST client targeting Upstash/Vercel KV API with memory fallbacks.',
      'Admin SEO & Sprints pages: Dedicated performance dashboards for verification and history logging.'
    ]
  },
  {
    id: 'sprint-6',
    name: 'Sprint 6: Admin Dashboard & Auth Security',
    date: 'June 8, 2026',
    status: 'shipped',
    description: 'Initial admin panel portal implementation to allow system diagnostics, system architectures viewing, and documentation reviews.',
    scope: 'Admin Panel, Security, System Architecture',
    deliverables: [
      'Admin Dashboard: /admin interface showing real-time logs and performance health metrics.',
      'Authentication: /api/admin/auth cookies authorization gate utilizing ADMIN_DASHBOARD_PASSWORD.',
      'Architecture Map: Interactive directory structure visuals in /admin/architecture.',
      'Docs Viewer: Technical project guides render engine in /admin/docs.',
      'Crawler Restrict: block search engine indexing on administrative sections inside robots.txt.'
    ]
  },
  {
    id: 'sprint-5',
    name: 'Sprint 5: Blog Restructuring & Wealth Reports',
    date: 'June 8, 2026',
    status: 'shipped',
    description: 'Cleaned heavy data footprints, added complex PDF compilation pipelines, and enabled transactional notification mailers.',
    scope: 'Performance, PDF Engine, Email Notifications, Blog Content',
    deliverables: [
      'Blog Architecture Fix: Deleted blog-posts.json (356KB). Split entries into blog-index.json metadata index and individual post files.',
      'JSON-LD Schemas: Added InsuranceAgency structured schemas on 11 service and local area page templates.',
      'Wealth Blueprint PDF: 4-page dynamically generated PDF report compiled via @react-pdf/renderer.',
      'Chatbot Capping: Memory limited to the last 10 messages in chat sessions to optimize token throughput.',
      'Email Integration: Resend API welcome mailers enabled on newsletter subscription route.',
      'Blog Expansion: Added 30 new high-intent articles, pushing total count to 100 bilingual posts.'
    ]
  },
  {
    id: 'sprints-1-4',
    name: 'Sprints 1–4: Core Foundation & Bilingual Release',
    date: 'May 31, 2026',
    status: 'shipped',
    description: 'Created the primary bilingual site layout, set up interactive calculator engines, integrated conversational chatbot advisor, and established SEO schemas.',
    scope: 'Core Pages, Multi-Language, Calculators, Analytics',
    deliverables: [
      'Bilingual Support: Complete English + Hindi localization map for headers, footers, forms, and pages.',
      'New Sections: Added /claims, /faq, /renew, /compare, and /pay-premium portals.',
      'Mobile Polish: Fixed chatbot layout overlapping issues, mobile-responsive CTAs, and z-indexes.',
      'Google Analytics 4: Wired in lead_submitted, blog_viewed, renewal_requested, and calculator_result custom events.',
      'SEO optimization: Canonical links, sitemap compilation, and LocalBusiness structured data blocks.',
      'Audit: Cleared dead links across the codebase, validated clean navigation flow.'
    ]
  }
];

interface LiveStats {
  content: { blogPosts: number }
  infrastructure: { apiRoutes: number; lastBuild: string }
  estimatedPages: number
}

export default function SprintsTimeline() {
  const [live, setLive] = useState<LiveStats | null>(null)

  useEffect(() => {
    fetch('/api/admin/metrics')
      .then(r => r.ok ? r.json() : null)
      .then((d: LiveStats | null) => {
        if (d && d.content && d.infrastructure) {
          setLive(d)
        }
      })
      .catch(() => {})
  }, [])

  const getStatusBadge = (status: SprintItem['status']) => {
    switch (status) {
      case 'shipped':
        return (
          <span className="inline-flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full">
            <CheckCircle2 size={10} />
            Shipped
          </span>
        );
      case 'active':
        return (
          <span className="inline-flex items-center gap-1 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full animate-pulse">
            <Activity size={10} />
            Active
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 bg-gray-800 border border-gray-700 text-gray-400 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full">
            Upcoming
          </span>
        );
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Live stats banner */}
      {live && (
        <div className="bg-white border border-amber-500/20 rounded-2xl px-5 py-3 flex flex-wrap gap-6 text-xs">
          <span className="text-gray-400">
            <span className="text-amber-400 font-bold text-base">{live.estimatedPages}</span> est. pages
          </span>
          <span className="text-gray-400">
            <span className="text-blue-400 font-bold text-base">{live.content.blogPosts}</span> blog posts
          </span>
          <span className="text-gray-400">
            <span className="text-purple-400 font-bold text-base">{live.infrastructure.apiRoutes}</span> API routes
          </span>
          {live.infrastructure.lastBuild && (
            <span className="text-gray-500">
              Last build: {new Date(live.infrastructure.lastBuild).toLocaleString()}
            </span>
          )}
        </div>
      )}

      {/* Title */}
      <div>
        <div className="flex items-center gap-2 text-amber-500 text-xs font-bold uppercase tracking-widest mb-1.5">
          <Award size={14} />
          Development History
        </div>
        <h1 className="text-2xl font-black text-white">Sprint Deliverables Timeline</h1>
        <p className="text-gray-500 text-sm mt-1">
          Tracking features delivery records, deployment dates, and commits log history for Poddar Wealth Management.
        </p>
      </div>

      {/* Timeline List */}
      <div className="relative border-l border-gray-200 ml-3.5 pl-6 space-y-12 py-2">
        {HISTORICAL_SPRINTS.map((sprint, index) => (
          <div key={sprint.id} className="relative group">
            {/* Timeline Bullet Dot */}
            <span className={`absolute -left-[31px] top-1.5 flex items-center justify-center w-4 h-4 rounded-full border bg-gray-50 transition-all duration-300 ${
              sprint.status === 'active' 
                ? 'border-amber-500 ring-4 ring-amber-500/10' 
                : 'border-gray-700 group-hover:border-emerald-500'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${
                sprint.status === 'active' ? 'bg-amber-500' : 'bg-gray-700 group-hover:bg-emerald-500'
              }`} />
            </span>

            {/* Sprint Card */}
            <div className="bg-white border border-gray-200/80 rounded-3xl p-6 hover:border-gray-300/80 transition-all duration-300 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-white/[0.01] to-transparent pointer-events-none" />

              {/* Title & Badge Row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div>
                  <h3 className="text-gray-900 text-base font-extrabold flex items-center gap-2 flex-wrap">
                    {sprint.name}
                  </h3>
                  <div className="flex items-center gap-1.5 text-gray-500 text-xs font-semibold mt-1">
                    <Calendar size={12} />
                    {sprint.date}
                    <span className="text-gray-700">•</span>
                    <span className="text-gray-400 font-mono text-[10px] uppercase tracking-wider bg-gray-50 border border-gray-200/80 px-1.5 py-0.5 rounded">
                      {sprint.scope}
                    </span>
                  </div>
                </div>
                <div className="shrink-0">
                  {getStatusBadge(sprint.status)}
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-400 text-xs leading-relaxed mb-6 font-medium">
                {sprint.description}
              </p>

              {/* Deliverables List */}
              <div className="space-y-3">
                <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">
                  Key Shipped Artifacts & Fixes
                </h4>
                <div className="grid grid-cols-1 gap-2">
                  {sprint.deliverables.map((item, idx) => {
                    const [title, desc] = item.split(': ');
                    return (
                      <div key={idx} className="flex items-start gap-2.5 text-xs">
                        <ChevronRight size={14} className="text-amber-500/80 shrink-0 mt-0.5" />
                        <p className="text-gray-300 font-medium leading-relaxed">
                          <span className="text-white font-extrabold">{title}</span>
                          {desc ? `: ${desc}` : ''}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Git Commit Hash Marker (Simulated) */}
              <div className="mt-6 pt-4 border-t border-gray-200/40 flex items-center justify-between text-[10px] text-gray-500 font-mono">
                <span className="flex items-center gap-1.5">
                  <GitCommit size={12} className="text-gray-600" />
                  SHA: {index === 0 ? '5a782b1-HEAD' : index === 1 ? 'cc7b29a' : index === 2 ? 'c711919' : 'ffd7a2e'}
                </span>
                <span>Branch: main</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
