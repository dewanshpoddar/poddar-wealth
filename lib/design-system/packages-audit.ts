/**
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║      PODDAR WEALTH — MISSING PACKAGES AUDIT                     ║
 * ║                                                                  ║
 * ║  Packages a scaling Indian fintech site of this complexity      ║
 * ║  should have, grouped by priority                                ║
 * ╚══════════════════════════════════════════════════════════════════╝
 *
 * HOW TO USE THIS FILE:
 *   When you want to implement a feature, find it here.
 *   The install command and usage notes are ready to go.
 */

// ═══════════════════════════════════════════════════════════════════
// 🔴 PRIORITY 1 — CRITICAL (should install before next feature sprint)
// ═══════════════════════════════════════════════════════════════════

export const CRITICAL_PACKAGES = {

  /**
   * ZUSTSTAND — Global State Management
   * WHY NEEDED: Calculator state, user session, language preference, 
   *             lead gate state — all currently scattered in local useState.
   *             A 75-page site needs central state.
   * INSTALL: npm install zustand
   * SIZE: 1.4kb — tiny
   */
  zustand: {
    command: 'npm install zustand',
    why: 'Global state for calculator inputs, user session, UI state',
    replaces: 'Scattered useState across 9 calculator pages',
    effort: 'Medium — create 2-3 stores',
  },

  /**
   * REACT HOOK FORM — Form Management
   * WHY NEEDED: Lead forms, contact forms, quiz — all use manual onChange.
   *             This causes re-renders on every keystroke and has no validation.
   * INSTALL: npm install react-hook-form @hookform/resolvers zod
   * SIZE: ~25kb
   */
  react_hook_form: {
    command: 'npm install react-hook-form @hookform/resolvers zod',
    why: 'Performant forms with validation — lead forms, contact, newsletter',
    replaces: 'Manual useState onChange handlers in every form',
    effort: 'Medium — refactor 4-5 form components',
  },

  /**
   * ZOD — Runtime Type Validation
   * WHY NEEDED: API routes accept user input with no validation.
   *             /api/leads, /api/chat, /api/calculate/* — all vulnerable to
   *             bad input causing unhandled errors or security issues.
   * INSTALL: npm install zod (included above)
   * SIZE: ~13kb
   */
  zod: {
    command: 'npm install zod',
    why: 'Runtime validation for ALL API route inputs',
    replaces: 'Manual if-checks and try-catch in API routes',
    effort: 'Low — add schemas to each API route',
  },

  /**
   * @VERCEL/KV — Redis Key-Value Store (Vercel Edge)
   * WHY NEEDED: Current rate limiting is in-memory (resets on cold start).
   *             Referrals, lead cache, NAV history all use fs.writeFileSync()
   *             which DOESN'T persist on Vercel.
   *             KV is the proper Vercel-native persistence layer.
   * INSTALL: npm install @vercel/kv
   * COST: Free tier — 30k commands/month, 256MB storage
   */
  vercel_kv: {
    command: 'npm install @vercel/kv',
    why: 'Persistent storage for: rate limiting, referrals, lead cache, NAV history',
    replaces: 'fs.writeFileSync() calls that silently fail on Vercel',
    effort: 'Medium — refactor 6 API routes',
    setup: 'Create KV database in Vercel dashboard → add env vars',
  },

  /**
   * SWR — Data Fetching & Caching
   * WHY NEEDED: Multiple pages fetch the same data (plans, reviews, NAV) on
   *             every mount with no caching. SWR adds stale-while-revalidate
   *             caching, deduplication, and automatic revalidation.
   * INSTALL: npm install swr
   * SIZE: ~7kb
   */
  swr: {
    command: 'npm install swr',
    why: 'Client-side data fetching with caching for plans, reviews, NAV data',
    replaces: 'Raw fetch() in useEffect with no caching',
    effort: 'Low — drop-in replacement for fetch patterns',
  },
}

// ═══════════════════════════════════════════════════════════════════
// 🟡 PRIORITY 2 — IMPORTANT (next 2-4 weeks)
// ═══════════════════════════════════════════════════════════════════

export const IMPORTANT_PACKAGES = {

  /**
   * NEXT-AUTH — Authentication
   * WHY NEEDED: /login and /client portal are currently dead ends.
   *             Admin panel uses a simple password — not secure.
   *             NextAuth adds proper session management with Google OAuth.
   * INSTALL: npm install next-auth
   */
  next_auth: {
    command: 'npm install next-auth',
    why: 'Real auth for /client portal and secure /admin access',
    replaces: 'Password string comparison in middleware',
    effort: 'High — need DB for sessions (pair with Supabase or KV)',
  },

  /**
   * @SUPABASE/SUPABASE-JS — Database
   * WHY NEEDED: All data is flat JSON files. Leads, referrals, chat logs
   *             need a real database. Supabase is PostgreSQL + real-time + auth.
   *             Free tier: 500MB, 50K active users/month.
   * INSTALL: npm install @supabase/supabase-js
   */
  supabase: {
    command: 'npm install @supabase/supabase-js',
    why: 'Real database for leads, referrals, client records, chat history',
    replaces: 'Google Sheets webhook + flat JSON files',
    effort: 'High — schema design + migration + refactor API routes',
    tables_needed: ['leads', 'clients', 'referrals', 'chat_sessions', 'nav_history'],
  },

  /**
   * DATE-FNS — Date Utilities
   * WHY NEEDED: Cron jobs, policy anniversaries, birthday reminders, 
   *             premium due dates — all use raw Date() arithmetic which
   *             is error-prone. date-fns is the modern date utility library.
   * INSTALL: npm install date-fns
   * SIZE: Tree-shakeable — only imports what you use
   */
  date_fns: {
    command: 'npm install date-fns',
    why: 'Reliable date arithmetic for policy dates, renewals, birthdays',
    replaces: 'Raw Date() manipulation in cron jobs and calculators',
    effort: 'Low — utility functions',
  },

  /**
   * RECHARTS — Data Visualization
   * WHY NEEDED: Premium calculators, NAV tracker, retirement planning — 
   *             all need charts. Recharts is the standard React chart library.
   *             Works with SSR, fully TypeScript, customizable.
   * INSTALL: npm install recharts
   */
  recharts: {
    command: 'npm install recharts',
    why: 'Charts for NAV tracker, maturity projections, retirement planning',
    replaces: 'No charts currently — text-only results',
    effort: 'Low per chart — high value visual impact',
    use_cases: ['NAV history line chart', 'Maturity value bar chart', 'Premium allocation pie chart', 'Retirement corpus projection'],
  },

  /**
   * NUQS — URL State Management
   * WHY NEEDED: Calculator inputs (plan, sum assured, age, term) should be
   *             shareable via URL. Currently all state is local — refresh = lost data.
   *             nuqs syncs React state to URL search params.
   * INSTALL: npm install nuqs
   */
  nuqs: {
    command: 'npm install nuqs',
    why: 'Persist calculator inputs in URL — shareable results, back-button safe',
    replaces: 'useSearchParams (partial implementation) + local useState',
    effort: 'Low — drop-in for existing useSearchParams usage',
  },

  /**
   * REACT-TABLE (TanStack Table) — Advanced Tables
   * WHY NEEDED: Plan comparison tables, admin lead tables, data tables —
   *             all need sorting, filtering, pagination.
   * INSTALL: npm install @tanstack/react-table
   */
  tanstack_table: {
    command: 'npm install @tanstack/react-table',
    why: 'Sortable, filterable data tables for admin, plan comparison, leads',
    replaces: 'Plain HTML tables with no interactivity',
    effort: 'Medium',
  },
}

// ═══════════════════════════════════════════════════════════════════
// 🟢 PRIORITY 3 — NICE TO HAVE (future sprints)
// ═══════════════════════════════════════════════════════════════════

export const NICE_TO_HAVE = {

  /**
   * REACT-PDF — Already Installed ✅
   * Using: @react-pdf/renderer for wealth blueprint
   */
  react_pdf: { status: 'ALREADY INSTALLED ✅', package: '@react-pdf/renderer' },

  /**
   * FRAMER MOTION — Already Installed ✅
   * Using: framer-motion for animations
   */
  framer_motion: { status: 'ALREADY INSTALLED ✅', package: 'framer-motion' },

  /**
   * REACT-INTERSECTION-OBSERVER — Scroll Animations
   * WHY: Animate sections as they enter the viewport (count-up stats, fade-ins)
   * INSTALL: npm install react-intersection-observer
   */
  intersection_observer: {
    command: 'npm install react-intersection-observer',
    why: 'Scroll-triggered animations — count-up, fade-in sections',
    effort: 'Low',
  },

  /**
   * USE-SOUND — Micro Sound Effects
   * WHY: Subtle audio feedback for calculator results, chat messages, form success
   * INSTALL: npm install use-sound
   */
  use_sound: {
    command: 'npm install use-sound',
    why: 'Subtle audio feedback for premium UX moments',
    effort: 'Very Low',
  },

  /**
   * REACT-COUNTUP — Animated Number Counting
   * WHY: "5000+ families" stat, maturity value reveal, premium count — should animate
   * INSTALL: npm install react-countup
   */
  react_countup: {
    command: 'npm install react-countup',
    why: 'Animate stat numbers on scroll, calculator result reveals',
    effort: 'Very Low — 3 lines per number',
  },

  /**
   * REACT-HOT-TOAST — Toast Notifications
   * WHY: Form submit success/error, copy-to-share, calculation complete
   * INSTALL: npm install react-hot-toast
   * SIZE: 5kb — tiny
   */
  react_hot_toast: {
    command: 'npm install react-hot-toast',
    why: 'User feedback toasts — form success, errors, copy confirmation',
    replaces: 'Browser alert() calls and inline error messages',
    effort: 'Very Low — global provider + 1 line to trigger',
  },

  /**
   * POSTHOG — Product Analytics
   * WHY: Beyond GA4 — track which calculator flows convert, where users drop off,
   *      A/B test results, session recordings.
   * INSTALL: npm install posthog-js
   * COST: Free up to 1M events/month
   */
  posthog: {
    command: 'npm install posthog-js',
    why: 'Deep product analytics — funnel analysis, session replay, feature flags',
    replaces: 'Current basic /api/track implementation',
    effort: 'Low',
  },

  /**
   * @RADIX-UI/REACT-DIALOG + REACT-POPOVER — Accessible UI Primitives
   * WHY: Current modals and popovers are custom-built without accessibility.
   *      Radix provides keyboard navigation, focus trapping, ARIA out of the box.
   * INSTALL: npm install @radix-ui/react-dialog @radix-ui/react-popover @radix-ui/react-tooltip
   */
  radix_ui: {
    command: 'npm install @radix-ui/react-dialog @radix-ui/react-popover @radix-ui/react-tooltip @radix-ui/react-select @radix-ui/react-slider',
    why: 'Accessible UI primitives for modals, tooltips, sliders, dropdowns',
    effort: 'Low — replace existing components gradually',
  },

  /**
   * VERCEL/BLOB — File Storage
   * WHY: Policy document uploads for the analyzer currently have no storage.
   *      Uploaded PDFs need to go somewhere. Vercel Blob is the native solution.
   * INSTALL: npm install @vercel/blob
   * COST: Free 1GB storage, 10GB bandwidth/month on hobby plan
   */
  vercel_blob: {
    command: 'npm install @vercel/blob',
    why: 'Store uploaded policy PDFs for the analyzer feature',
    effort: 'Low',
  },

  /**
   * NODEMAILER + RESEND (already installed) — Email
   * WHY: Resend is already installed. Need email templates for:
   *      - Lead acknowledgment
   *      - Policy anniversary reminders  
   *      - Monthly newsletter
   * STATUS: Resend already installed ✅. Just need RESEND_API_KEY in env.
   */
  resend: {
    status: 'ALREADY INSTALLED ✅ — needs RESEND_API_KEY in Vercel env',
    command: 'Already done — add env var',
  },
}

// ═══════════════════════════════════════════════════════════════════
// 📦 CURRENTLY INSTALLED — INVENTORY
// ═══════════════════════════════════════════════════════════════════

export const INSTALLED = {
  // Design
  'framer-motion': '✅ Animations',
  'lucide-react': '✅ Icons',
  'clsx': '✅ Just installed — class utilities',
  'tailwind-merge': '✅ Just installed — Tailwind deduplication',
  'class-variance-authority': '✅ Just installed — component variants',

  // Fonts
  '@fontsource-variable/geist': '✅ Just installed',
  '@fontsource-variable/outfit': '✅ Just installed',
  '@fontsource-variable/dm-sans': '✅ Just installed',
  '@fontsource-variable/space-grotesk': '✅ Just installed',
  '@fontsource-variable/sora': '✅ Just installed',
  '@fontsource-variable/manrope': '✅ Just installed',
  '@fontsource-variable/nunito': '✅ Just installed',
  '@fontsource-variable/figtree': '✅ Just installed',
  '@fontsource-variable/inter': '✅ Just installed',
  '@fontsource-variable/josefin-sans': '✅ Just installed',
  '@fontsource/cormorant-garamond': '✅ Just installed',
  '@fontsource/dm-serif-display': '✅ Just installed',
  '@fontsource/playfair-display': '✅ Just installed',
  '@fontsource/lora': '✅ Just installed',
  '@fontsource-variable/dm-mono': '✅ Just installed',
  '@fontsource-variable/jetbrains-mono': '✅ Just installed',
  '@fontsource-variable/fira-code': '✅ Just installed',

  // Data & AI
  'groq-sdk': '✅ LLM',
  'pdf-parse': '✅ Policy PDF parsing',
  'cheerio': '✅ Web scraping',

  // Comms
  'resend': '✅ Email (needs API key)',

  // Platform
  '@vercel/analytics': '✅',
  '@vercel/speed-insights': '✅',

  // UI
  '@react-pdf/renderer': '✅ PDF generation',
  'react-cookie-consent': '✅ GDPR consent banner',
  'react-markdown': '✅ Chat message rendering',
}

// ═══════════════════════════════════════════════════════════════════
// 🚀 RECOMMENDED NEXT INSTALL (single command)
// ═══════════════════════════════════════════════════════════════════

export const NEXT_INSTALL_COMMAND = `
# Priority 1 — Install these next for a production-ready foundation:
npm install zustand swr zod react-hook-form @hookform/resolvers date-fns

# Priority 2 — When building features:
npm install recharts nuqs react-intersection-observer react-countup react-hot-toast

# Priority 3 — When ready for full platform:
npm install @supabase/supabase-js @vercel/kv next-auth @tanstack/react-table @radix-ui/react-dialog @radix-ui/react-tooltip
`
