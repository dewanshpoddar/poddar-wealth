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

---

_Last updated: 2026-05-30_
