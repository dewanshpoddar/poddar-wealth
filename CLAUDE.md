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
- **Hosting:** Vercel (auto-deploys on push to `main`)
- **Domain:** poddarwealth.com (managed via Vercel)

---

## Tech stack

- **Framework:** Next.js 15.5.x (App Router)
- **Language:** TypeScript + React 19
- **Styling:** Tailwind CSS
- **Architecture:** Feature-Sliced Design (FSD) under `src/features/*`
- **AI:** Google Gemini API (Poddar Ji chatbot)
- **Forms:** Google Sheets webhooks (lead capture, admin notifications)
- **Scrapers:** LIC plan list, NAV refresh (Vercel cron jobs)
- **Analytics:** Google Analytics + Microsoft Clarity

---

## Folder structure

PW/
├── app/ Next.js App Router pages + API routes
│ ├── (pages)/ about, services, calculators, contact, etc.
│ └── api/ /api/leads, /api/chat, /api/lic-plans, /api/cron/\*
├── components/ Shared UI components (Navbar, Hero, etc.)
├── src/features/ FSD feature modules (canonical pattern)
│ ├── ai-agent/ Poddar Ji chatbot
│ ├── lic-plans/ LIC plans page logic + UI
│ └── wealth-blueprint/ Wealth blueprint calculator engine
├── lib/ Utilities, helpers, data files
├── scripts/ LIC scraper, NAV scraper, diff engine
├── public/ Static assets, images
├── .env.local Local secrets (NEVER commit)
├── vercel.json Cron jobs configuration
└── CLAUDE.md This file

---

## Environment variables required

These MUST exist in `.env.local` (local) AND in Vercel project settings (production):

- `GEMINI_API_KEY` — Google Gemini for AI advisor chat
- `GOOGLE_SHEETS_WEBHOOK_URL` — leads capture endpoint (Apps Script)
- `ADMIN_SHEETS_WEBHOOK_URL` — admin notifications endpoint (Apps Script)
- `CRON_SECRET` — protects cron endpoints from unauthorized calls
- `SYNC_SECRET` — protects LIC sync endpoint
- `ADMIN_SECRET` — protects admin endpoints
- `NEXT_PUBLIC_GA_ID` — Google Analytics tracking ID (public, OK in code)
- `NEXT_PUBLIC_CLARITY_ID` — Microsoft Clarity tracking ID (public, OK in code)

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
4. **Tailwind classes only.** No inline `style={}`, no separate CSS files.
5. **TypeScript strict.** All new files are `.tsx` or `.ts`, never `.jsx` or `.js`.
6. **Phone number:** Ajay sir's number is `9415313434`. Used as a constant.

---

## DO NOT touch without explicit instruction

- `app/api/cron/*` — production cron endpoints
- `vercel.json` — affects deploy & schedule
- `middleware.ts` — affects every route
- `.env.local` — secrets

---

## Quick troubleshooting

- Dev server won't start: `lsof -ti:3000 | xargs kill -9`, then `npm run dev`
- TypeScript errors after pull: `rm -rf .next && npm run dev`
- Vercel CLI not logged in: `npx vercel login`
- Need fresh deps: `rm -rf node_modules package-lock.json && npm install`

---

_Last updated: 2026-05-30 (consolidation day — moved from Desktop/poddar-wealth chaos to clean /PW canonical setup)._
