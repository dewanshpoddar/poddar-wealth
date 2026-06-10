# Poddar Wealth Management — Project Memory

> This file is the source of truth for working in this project.
> Read it before making ANY changes. Update it when project structure changes.

---

## ⚠️ CRITICAL — CANONICAL LOCATION

**The ONLY valid project folder is `/Users/dewanshpoddar/PW`.**

There are 3 archived stale copies at `~/Desktop/poddar-wealth-ARCHIVES-2026-05-30/` (created 2026-05-30). **DO NOT** open, edit, or reference them. They exist only as a safety net and will be deleted after 2026-06-30.

If you (human or agent) ever see a window titled `poddar-wealth` instead of `PW`, STOP. You are in the wrong folder. Close it and open `/Users/dewanshpoddar/PW`.

---

## What this project is

A bilingual (English + Hindi) financial advisory website for Poddar Wealth Management — Ajay Kumar Poddar, MDRT Member & Chairman's Club awardee, 31+ years in life insurance and wealth planning.

- **Live site:** https://poddarwealth.com
- **GitHub:** https://github.com/dewanshpoddar/poddar-wealth
- **Hosting:** Vercel (auto-deploys on push to `main`, Hobby plan — max 2-3 deploys/day)
- **Domain:** poddarwealth.com (managed via Vercel)

---

## Tech stack

- **Framework:** Next.js 15.5.x (App Router)
- **Language:** TypeScript + React 19
- **Styling:** Tailwind CSS
- **Fonts:** next/font/google (Fraunces display, Plus Jakarta Sans body)
- **Architecture:** Feature-Sliced Design (FSD) under `src/features/*`
- **AI:** Groq API (llama-3.3-70b-versatile for Poddar Ji chatbot)
- **Forms:** Google Sheets webhooks (lead capture, admin notifications)
- **Scrapers:** LIC plan list, NAV refresh (Vercel cron jobs)
- **Analytics:** Google Analytics 4
- **IDE:** ESLint, Prettier (format on save), Tailwind IntelliSense, Error Lens, GitLens

---

## LLM Integration

- **Provider:** Groq (switched from Gemini on 2026-05-30)
- **Model:** llama-3.3-70b-versatile
- **Why Groq:** Gemini free tier returned limit:0 across all models on this GCP project (account-level quota issue). Groq has 14,400 req/day free tier, fastest inference, no credit card required.
- **Env vars:** GROQ_API_KEY, GROQ_MODEL
- **Endpoint:** app/api/chat/route.ts
- **System prompt:** buildSystemPrompt() in same file — bilingual Hindi+English financial advisor persona "Poddar Ji"
- **History handling:** Leading non-user messages are filtered before API call (defensive code from Gemini migration)

---

## Folder structure

PW/
├── app/                    Next.js App Router pages + API routes
│   ├── (pages)/            about, services, calculators, contact, etc.
│   └── api/                /api/leads, /api/chat, /api/lic-plans, /api/cron/*
├── components/             Shared UI components (Navbar, Hero, etc.)
│   ├── base/               BaseLeadForm, shared form elements
│   └── calculators/        Premium/maturity calculator panels
├── src/features/           FSD feature modules (canonical pattern)
│   ├── ai-agent/           Poddar Ji chatbot
│   ├── lic-plans/          LIC plans page logic + UI
│   └── wealth-blueprint/   Wealth blueprint calculator engine
├── lib/                    Utilities, helpers, data files
│   ├── server-utils.ts     Shared: clean(), isValidPhone(), csvSanitize(), appendToCsv(), pushToSheets()
│   ├── constants.ts        GROQ_MODEL, MAX_INPUT_CHARS, rate limits
│   ├── types/lic-plan.ts   LicPlan, PremiumResult, MaturityResult interfaces
│   ├── lic-plans-data.js   LIC plan database (untyped JS, cast as LicPlan[])
│   ├── en.json             English translations
│   └── hi.json             Hindi translations
├── scripts/                LIC scraper, NAV scraper, test scripts
├── public/                 Static assets, images
├── middleware.ts            Rate limiting (30 req/60s per IP, in-memory)
├── .env.local              Local secrets (NEVER commit)
├── vercel.json             Cron jobs configuration
└── CLAUDE.md               This file

---

## Key API routes

- `app/api/chat/route.ts` — AI chatbot (Groq streaming)
- `app/api/leads/route.ts` — Lead capture → Google Sheets + CSV backup
- `app/api/blueprint/route.ts` — Wealth blueprint form → Sheets
- `app/api/track/route.ts` — Analytics tracking (sheetName whitelisted against SHEET_HEADERS)
- `app/api/admin/plan-flags/route.ts` — Plan status flags (typed with PlanFlag interface)
- `app/api/cron/check-plan-status/route.ts` — LIC plan scraper (1st & 15th, 06:00 UTC)
- `app/api/cron/refresh-nav/route.ts` — NAV scraper (weekdays, 13:30 UTC / 19:00 IST)

---

## Environment variables required

These MUST exist in `.env.local` (local) AND in Vercel project settings (production):

- `GROQ_API_KEY` — Groq API key for AI advisor chat
- `GROQ_MODEL` — Groq model identifier (defaults to llama-3.3-70b-versatile)
- `GOOGLE_SHEETS_WEBHOOK_URL` — leads capture endpoint (Apps Script)
- `ADMIN_SHEETS_WEBHOOK_URL` — admin notifications endpoint (Apps Script)
- `CRON_SECRET` — protects cron endpoints from unauthorized calls
- `SYNC_SECRET` — protects LIC sync endpoint
- `ADMIN_SECRET` — protects admin endpoints
- `NEXT_PUBLIC_GA_ID` — Google Analytics 4 Measurement ID

To pull from Vercel: `npx vercel env pull .env.local`

---

## How to run / build / deploy

Local development:

- `cd /Users/dewanshpoddar/PW`
- `npm install`
- `npm run dev` → opens http://localhost:3000

Production build (test locally before pushing):

- `npm run build`
- `npm run start`

Deploy:

- `git push origin main` → Vercel auto-deploys
- **Conserve build minutes:** batch changes into fewer pushes (Hobby plan = 6000 min/month)

---

## Cron jobs (Vercel-managed)

Configured in `vercel.json`:

- `/api/cron/check-plan-status` — 06:00 IST on 1st & 15th of every month
- `/api/cron/refresh-nav` — 19:00 IST on weekdays (Mon-Fri)

Both endpoints require `CRON_SECRET` header to execute.

---

## Conventions for code changes

1. **Match existing patterns.** Before adding a new component, check `src/features/*` and `components/` for similar ones.
2. **Keep data in JSON.** Never hardcode lists, prices, plan details into JSX. Put them in `src/data/*.json` or `lib/data/*.json`.
3. **Bilingual content** lives in `lib/en.json` and `lib/hi.json`. Add new strings to BOTH.
4. **Tailwind classes only.** No inline `style={}`, no separate CSS files, no CSS modules.
5. **TypeScript strict.** No `any` — use `unknown` + type narrowing. All new files `.tsx` or `.ts`.
6. **Phone number:** Ajay sir's number is `9415313434`. Used as a constant.
7. **Error handling:** Generic message to client in 500 responses. Detailed errors to adminNotify() only.
8. **Input sanitization:** Use clean(), csvSanitize() from lib/server-utils.ts. Never inline.
9. **Fonts:** Use next/font/google via CSS vars (--font-sans, --font-display). No @import.
10. **Parallel agents:** Claude handles backend (app/api/*, lib/*), Gemini handles frontend (components/*, src/features/*, pages). Never same file.

---

## DO NOT touch without explicit instruction

- `app/api/cron/*` — production cron endpoints
- `vercel.json` — affects deploy & schedule
- `middleware.ts` — affects every route
- `.env.local` — secrets
- `buildSystemPrompt()` in chat/route.ts — chatbot persona
- Webhook URLs in any route

---

## Known issues / tech debt

- `components/calculators/` should move to `src/features/premium-calculator/` (FSD compliance)
- `ResultsPanel` references `matResult.totalSRB` but `calculateMaturity` never returns it — likely should be `totalBonus`
- `LangContext` forces all pages using translations to be client components (server-side i18n would fix)
- `framer-motion` (~100KB) used only in about page — consider lazy loading
- Login link in navbar is dead (`#`)
- Claims page redirects to `/contact` instead of dedicated page
- Missing pages: /blog, /faq, /privacy-policy, /terms

---

## Quick troubleshooting

- Dev server won't start: `lsof -ti:3000 | xargs kill -9`, then `npm run dev`
- TypeScript errors after pull: `rm -rf .next && npm run dev`
- Vercel CLI not logged in: `npx vercel login`
- Need fresh deps: `rm -rf node_modules package-lock.json && npm install`
- .env.local has quoted values: Next.js strips quotes, but shell scripts don't — use `tr -d '"'`

---

## Recovery log

- **2026-05-30:** Recovered from 5-week stall. Consolidated 4 folders → 1 canonical (/PW).
  Fixed chatbot (history role bug + Gemini→Groq migration).
  Code quality refactor: DRY extraction (server-utils.ts), security (sheetName whitelist,
  generic 500s, csvSanitize), type safety (PlanFlag, LicPlan, calculator props).
  next/font optimization (removed blocking Google Fonts @import).
  Calculator components fully typed. Lead capture + cron routes verified.
  11 commits shipped. Production verified working.

- **2026-05-31:** Sprint 1-4 shipped in single session.
  New pages: /claims, /faq, /blog (15 posts), /pay-premium, 404 (not-found.tsx).
  Mobile fixes: MobileCTABar imported + rendered, bottom overlap resolved,
  navbar spacing (pt-10), WhatsApp FAB hidden on mobile (sm:flex),
  chatbot repositioned (bottom-20 on mobile, z-[9980]).
  UX: testimonial avatars gendered gradients, service cards clickable (Link),
  "Join as Advisor" restyled to gold button, external links open new tab.
  SEO: unique metadata per page (12 layout.tsx files verified working),
  Schema.org LocalBusiness + Article JSON-LD, sitemap verified (app/sitemap.ts),
  15 blog posts with bilingual content.
  GA4: analytics.ts extended (blog_viewed, pay_premium_clicked, lead_submitted),
  events wired in blog post page and pay-premium page.
  Blog: reading time display, WhatsApp + copy-link share buttons.
  Contact: Google Maps link section added.
  FAQ: Related pages section (claims, calculator, products, contact, pay-premium).
  Dead link audit: all 14 internal hrefs verified — zero dead links.

- **2026-05-31 (cont):** Final 20% sprint completed.
  New pages: /renew (policy renewal form + lead capture), 5 service page layout.tsx files (metadata).
  Navbar: "Renew Policy" href updated to /renew.
  GA4: renewal_requested event added. analytics.ts event union extended.
  Blog: Comparison + Guides + Child Plans categories added to filter tabs.
  Dead links: zero found after scan. All service page layouts added.
  Translation keys added: renew (en.json + hi.json).
  Build: 43+ pages, 0 errors.

- **2026-05-31 (cont 2):** Final features sprint.
  Added /compare (plan comparison tool with desktop table + mobile cards).
  ExitIntentPopup: mouseleave/inactivity trigger, sessionStorage guard, lead capture.
  GA4 events: compare_viewed, faq_opened, exit_intent_shown/submitted, plan_quote_clicked.
  Banner "Know more" links: each plan pill now links to its specific page.
  Blog related articles: relatedSlugs added to all 20 posts, Related Articles section in post page.
  Navbar: Compare Plans link with New badge added.
  Translation keys added: compare, exitIntent (en.json + hi.json).
  Code: totalSRB→totalBonus fix, DRY server-utils, banner DOM 10→2 copies.

- **2026-05-31 (evening):** Performance optimization sprint.
  Hero images converted to next/image (fill + sizes="100vw", priority on first).
  Cache headers added to next.config.js (1yr immutable for svg/jpg/png/webp/woff2).
  Security headers already present (X-Frame-Options, X-Content-Type-Options, etc.).
  Heading hierarchy fixed: products page h2→h1, services/page cards h3→h2,
  claims decorative panel h3→h2.
  Color contrast: text-gray-400 → text-gray-500 on 12 light-background files.
  Form a11y: htmlFor+id pairs added to BaseLeadForm, pay-premium, renew, contact;
  aria-label added to compare search input.
  GA4: blueprint_completed event wired in WealthBlueprintCalculator (useEffect on step===4).
  Hydration: suppressHydrationWarning added to <body> in layout.tsx.
  Frontend agent (parallel): GoogleReviewsBadge, BlogPreview components added.
  Build: 0 errors.

- **2026-06-01:** Final production sweep.
  OG metadata fixed: openGraph.title added to all 16 per-page layouts (was inheriting root).
  GA4 events: calculator_result wired in ResultsPanel (plan_name, premium, maturity, term).
  Hindi reading time fixed: charCount/5/200 for hi locale instead of space-split (undercounts Devanagari).
  Products page LCP fix: CSS backgroundImage → next/image with priority; images.pexels.com added to remotePatterns.
  All systems verified: Groq API 200, leads 200, cron 200 (with auth) / 401 (without).
  Lighthouse: SEO 100, A11y 90-95, Perf 56-65 (mobile).
  Search Console verified, sitemap submitted, Google Business Profile linked (4.9★, 154 reviews).
  Error boundary (app/error.tsx), env validation (lib/env.ts), API resilience all confirmed live.
  Build: 0 errors. All routes static/dynamic as expected.

- **2026-06-01 (evening) + 2026-06-02:** Full-site UI audit + Blog/SEO infrastructure sprint.
  UI Audit (8 items): WhatsApp FAB z-index/size fixed (48px max, above MobileCTABar).
  Blog card headers rebuilt — emoji/gradient → solid category colors + Lucide icons.
  Footer completely rebuilt: bg-gray-950, 4-column corporate layout, Google reviews, clickable phone numbers, legal bottom bar.
  Wealth Blueprint section header: amber badge, larger h2, amber step circles + connect lines.
  Homepage cleaned: AgentTeaserStrip removed entirely.
  About + Contact pages: full bilingual translation (heroTitle, founderQuote, form labels, placeholders, validation messages).
  Become Advisor page: new "Join Our Advisory Network" recruitment panel with 3 benefit cards.
  WhatsApp button: enabled universal visibility (removed hidden sm:flex).
  Blog/SEO sprint (5 items): JSON-LD Article schema already in blog/[slug]/page.tsx (confirmed).
  10 new high-intent blog posts added to lib/data/blog-posts.json (total: 30 posts).
  New slugs: lic-premium-payment-online-guide, best-lic-plan-for-30-year-old, lic-maturity-amount-taxable-or-not,
  lic-policy-lapse-revival-complete-guide, whole-life-vs-term-insurance-india,
  lic-jeevan-labh-plan-936-complete-review, lic-surrender-value-calculation,
  lic-jeevan-shree-plan-review, health-insurance-for-self-employed-india, lic-endowment-vs-ppf-fd-comparison.
  All posts: bilingual EN/HI, relatedSlugs, soft CTA with 9415313434.
  Related Articles section already in blog post page (confirmed from prior sprint).
  Pay-premium page: step-by-step "How to Pay" 3-step guide + payment methods strip added above form.
  Build: verified 60+ pages, 0 errors (node node_modules/.bin/next build).

- **2026-06-08:** DRY Contact Refactoring + QA Linting + Pay-Premium enhancements.
  DRY: Replaced all hardcoded instances of Ajay Kumar Poddar's phone number with the centralized `ADVISOR_PHONE` constant defined in `lib/constants.ts`.
  Lint & QA: Fixed unescaped JSX single quotes in `WealthBlueprintPDF.tsx`, `plans/nav-jeevan-shree/page.tsx`, and `services/life-insurance/page.tsx`.
  Policy Analyzer API: Replaced legacy `require` call in `policy-document/route.ts` with standard `import` syntax to resolve ESLint import rules.
  Article Schema: Structured JSON-LD Article schema in `app/blog/[slug]/page.tsx` updated to support correct `author.url`, `publisher.url`, and `mainEntityOfPage`.
  Pay-Premium: Implemented full 5-step "How to Pay LIC Premium Online — Step by Step" guide above lead form with direct gateway link to `customer.onlineportal.licindia.in` and call/trouble support link.

- **2026-06-08 (Sprint 5):** All remaining backend tasks from months 2-8 roadmap.
  Blog architecture: blog-posts.json deleted (was 356KB). All consumers (BlogPreview, blog/page,
  blog/[slug]/page) now use blog-index.json (126KB). /api/blog/[slug] serves individual content
  from lib/data/blog-content/*.json (per-post ~3-8KB).
  JSON-LD: InsuranceAgency schema added to all 11 service page layouts + area service page via lib/schema.ts.
  PDF Report: lib/reports/WealthBlueprintPDF.tsx (4-page: cover, score breakdown, recommendations, about).
  POST /api/reports/wealth-blueprint with 3/hr/IP rate limit.
  Chatbot memory: history capped at last 10 messages (5 exchanges) in app/api/chat/route.ts.
  Email service: lib/email.ts with sendWelcomeEmail() via Resend API. Added to newsletter subscribe route.
  RESEND_API_KEY added to .env.example. (Action: sign up resend.com, verify poddarwealth.com domain)
  Blog posts: 30 new posts added. Total: 100 posts. lib/data/blog-index.json has all 100 entries.
  Reviews API: lib/data/reviews.json (8 reviews) + GET /api/reviews (1hr cache).
  Build: 0 errors. First Load JS shared: 105 kB.
  4 commits: ffd7a2e, 9169dcc, c711919, 2c37e9b.
- **2026-06-09 (Sprint 7 & 8):** Final Sprints Hardening, PWA, and SEO dashboards.
  PWA Support: Service worker `public/sw.js` (cache-first client caching) + `/offline` custom emergency contact layout.
  UTM integration: Campaign lead parameters capturing on `/lp/[campaign]` routes + prefilled WhatsApp query string propagation + GA4 event + sitemap crawler block.
  Video Embed: Lite performance thumbnails component `components/VideoEmbed.tsx` replacing iframe load on-click.
  OG Engine: Edge dynamic OG generator `app/blog/[slug]/opengraph-image.tsx` using `ImageResponse`.
  WhatsApp CTA: Expanded sharing metadata CTA inside `components/WhatsAppShare.tsx`.
  KV Rate Limiter: Zero-dependency client `/pipeline` API client in `lib/rate-limiter-kv.ts` + local Map memory fallbacks.
  Admin Panels: /admin/seo dynamic sitemap status checking, /admin/sprints history timeline log, and expanded layout sidebar navigation options.
  Bengali stats: completions metrics displayed under main admin index.
  Build: verified 0 errors, 102 static pages compiled.

- **2026-06-10 (Sprint 9):** Final backend sprint — flow fixes, content expansion, new features.
  Phase 1 (Flow fixes): Referral cookie (pw_ref) now captured in lead row + HEADERS; cron CRON_SECRET guard
  fixed in update-nav, birthday-anniversary, premium-reminders, weekly-digest (pattern: `cronSecret &&` guard
  prevents blocking when env var is unset); Footer.tsx corrupted ourProducts array reconstructed;
  TypeScript errors in search/page.tsx and SearchModal.tsx fixed (optional chaining on excerptText).
  Phase 2 (Blog): 30 new posts added — total 130 posts (lib/data/blog-index.json + 30 new content files
  in lib/data/blog-content/). Batches: 10 LIC plan reviews, 10 how-to guides, 10 Hindi + trending posts.
  Phase 3 (Areas): 10 Bihar/Jharkhand cities added to lib/data/areas.ts — total 30 area pages.
  Unique descriptions added for all 10 new cities (Patna, Gaya, Muzaffarpur, Bhagalpur, Darbhanga,
  Purnia, Siwan, Chapra, Ranchi, Dhanbad). Area metadata updated to use per-city description.
  Phase 4 (Client Portal): app/client/page.tsx already existed with full implementation — confirmed.
  Phase 5 (Google Places): app/api/reviews/live/route.ts created — live Google Places API with
  24-hour ISR cache, graceful fallback to lib/data/reviews.json if API key missing or fetch fails.
  GOOGLE_PLACES_API_KEY and GOOGLE_PLACE_ID added to .env.example.
  Phase 6 (A/B Testing): lib/ab-testing.ts (getVariant deterministic hash), app/api/ab/track/route.ts
  (POST events → lib/data/ab-results.json, max 10000 entries), lib/data/ab-results.json initialized.
  Admin /admin/ab page already existed with full UI — confirmed in nav.
  Phase 7 (Chatbot): buildSystemPrompt() upgraded with Gorakhpur uncle persona, Hinglish style,
  local examples, conversation rules, and two few-shot examples in app/api/chat/route.ts.
  Phase 8 (Cleanup): TypeScript 0 errors, build 0 errors. TODO documented (GoogleReviewsBadge static data).
  Build: verified 0 errors, 130 blog posts, 30 area pages.

---

_Last updated: 2026-06-10_

