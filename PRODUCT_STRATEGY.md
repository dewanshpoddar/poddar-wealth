# Poddar Wealth — Product & UX Strategy Document

**Role:** Product Head + UX Strategist + Frontend Architect  
**Date:** 2026-04-13  
**Site:** https://www.poddarwealth.com  
**Stack:** Next.js 14 App Router · Tailwind CSS · Framer Motion · Anthropic Claude

---

## 1. IDEAL USER JOURNEY

The site serves one type of user: **an Indian family head (25–55, salaried/business) who is anxious about financial security and does not yet trust insurance advisors.**

The winning journey is not "browse → buy." It is **"anxiety → insight → trust → action."**

```
AWARENESS
  User lands via WhatsApp share / Google search / referral
  ↓
HOOK (< 3 seconds)
  Hero: "Your Family's Protection, 31 Years of Wealth Trust"
  One primary CTA: "Get Wealth Health Report" (Blueprint Calculator)
  ↓
TRUST PROOF (< 30 seconds)
  Trust strip: 31 yrs · 5000+ families · MDRT · ₹500Cr claims settled
  ↓
PROBLEM RECOGNITION (30–90 seconds)
  Wealth Blueprint Calculator: user inputs age, income, family
  → Calculator outputs: "You have a ₹1.8 Cr protection gap"
  This is the moment of self-identified need
  ↓
PERSONALISED INSIGHT (90–180 seconds)
  Results show: HLV · Retirement corpus · Plans recommended
  User sees their specific number, not generic content
  ↓
SOCIAL PROOF (optional, 60 sec)
  Testimonials / TrustSection
  ↓
ACTION (one step)
  "Book Free Consultation" → WhatsApp or lead form (name + phone only)
  ↓
FOLLOW-UP (Ajay calls within 24h)
  Conversion happens off-platform, in person or by phone
```

**The ONE primary entry action:** Complete the Wealth Blueprint Calculator.  
Everything else on the site is secondary to getting the user to that calculator.

---

## 2. PAGE-TO-JOURNEY MAPPING

| Stage | Pages That Serve It | Problem |
|-------|-------------------|---------|
| Hook | `/` Hero | Diluted — 2 CTAs fight each other ("Get Wealth Health Report" vs "Book Free Wealth Consultation") |
| Trust | `/` TrustSection, `/about` | Trust section buried after hero — users scroll past before reading it |
| Problem Recognition | `/` Blueprint Calculator | Too far down the homepage (6th section). Users drop off before reaching it |
| Insight | Blueprint step 4 results | Good concept, but result screen has no clear next action after showing numbers |
| Social Proof | `/` Testimonials | Fine |
| Action | `/contact`, `LeadPopup`, WhatsApp | Three competing conversion paths with zero coordination |
| Exploration (secondary) | `/products`, `/services/*`, `/calculators/*` | For users who want to self-research before trusting Ajay |

**Pages that are redundant:**
- `/become-advisor` — completely separate audience (agents, not clients). Should be removed from main nav entirely. A footer link is sufficient.
- `LeadForm` component on every service page — it is the **agent recruitment form** (green, "Join as Agent" copy), wrongly placed on client-facing service pages. This actively confuses users who land on `/services/life-insurance` and see a recruitment pitch instead of a consultation form.

**Pages that are missing:**
- **Claim Support page** — nav lists it but no page exists. This is a high-trust signal for existing policyholders. Missing = trust gap.
- **Privacy Policy / Terms** — regulatory requirement. Missing = legal risk.
- **FAQ** — reduces the "I need to call first to understand" barrier.
- **`/blog` or `/insights`** — SEO entry point. Every competitor ranks on "LIC Jeevan Umang review" type queries. No content = no organic growth.

---

## 3. CONVERSION LEAKS (BRUTAL)

### Homepage `/`
- **Leak 1 — Hero CTA confusion.** Two primary buttons of equal visual weight. User freezes. Pick ONE: "Get Free Wealth Report" → Blueprint Calculator. Make the second button text-only.
- **Leak 2 — Blueprint Calculator is 6 sections deep.** By the time the user reaches it, they've already decided whether to trust the site. Move it to section 2, right after the hero.
- **Leak 3 — TrustSection competes with itself.** Stats (31 yrs, 5000 families) shown in hero, then repeated in full TrustSection. Redundant. Condense.
- **Leak 4 — `ChatBot` section on homepage.** A static section promoting the AI chatbot, followed by a floating chat button. Why have both? The section wastes real estate. Remove the static section — keep only the floating button.
- **Leak 5 — `IntentSection` is undefined in purpose.** "What are you planning for?" cards that go nowhere. These are a second version of the hero's quick-items. Either make them route to sub-pages or remove them.

### Products `/products`
- **Leak 6 — No mobile filter.** On mobile there is no filter mechanism. The sidebar filters are desktop-only. A user on mobile sees all 39 plans in an unfiltered list. Cognitive overload → exit.
- **Leak 7 — Plan cards have no CTA.** User can expand a plan card to see details, but there is no "Get Quote" or "Ask Ajay" button on the card itself. Dead end.

### Service pages `/services/*`
- **Leak 8 — Wrong form on service pages.** `LeadForm` is the **agent recruitment form** with green styling and "Join as agent" copy. It is rendered at the bottom of every service detail page. A user reading about life insurance for their family hits an agent recruitment pitch. This likely increases bounce rate significantly.
- **Leak 9 — No hero CTA specificity.** Life insurance page CTA says "Protect My Family" → `#lead-form` which is the wrong form (see Leak 8). The anchor scrolls to the agent form.

### Calculators
- **Leak 10 — Calculators are disconnected from conversion.** Life insurance calculator shows a coverage recommendation but has no persistent CTA. User calculates "I need ₹1.5Cr cover" and then what? There is no "Get this cover" button that routes them to a consultation.
- **Leak 11 — Premium calculator result table has no clear next action.** User sees premium breakdown, no "Book this plan" CTA.

### Contact `/contact`
- **Leak 12 — Too many fields.** 5 fields (name, phone, want-to, I-am, message) before a user can submit. Phone number alone is enough to start a conversation. Every extra field reduces submission rate by ~10%.
- **Leak 13 — `brand-600` color used in Clock icon.** `text-brand-600` is undefined — renders as black. Minor but signals code quality issues.

### AI Advisor `/ai-advisor`
- **Leak 14 — Full page exists but is barely linked.** The floating button opens a chat panel, but `/ai-advisor` as a destination page is not in the main nav or footer. Users who could benefit from a structured chat session never find it.

---

## 4. MOBILE-FIRST UX CRITIQUE

| Page | Issue | Severity |
|------|-------|----------|
| `/products` | No filter mechanism at all on mobile | Critical |
| `/` Blueprint Calculator | Slider inputs on mobile — `<input type="range">` has tiny touch targets (44px minimum required, current ~20px) | High |
| `/services/*` | Hero image + text grid collapses well, but hero CTA buttons sometimes overflow on 320px screens | Medium |
| `/calculators/retirement` | "Power of Starting Early" 3-column grid doesn't stack on mobile — cards become 33% wide and text wraps awkwardly | Medium |
| `/` HeroSection | Fixed — but the mobile badge overlaps dot navigation on very small screens (360px) | Low |
| Navbar | Fixed — but `हिंदी` button in lang toggle truncates at 320px | Low |
| `LeadForm` | `grid grid-cols-1 sm:grid-cols-2` — fine on mobile | OK |
| `/contact` | Two-col layout collapses correctly, contact info below form — acceptable | OK |

**Most critical mobile gap:** `/products` without filters. This is the most feature-rich page and completely unusable for self-service on mobile.

---

## 5. STRUCTURAL FIXES

### Merges
1. **Merge `LeadForm` (agent recruitment) and consultation CTA into two separate, correctly named components:**
   - `AgentRecruitmentForm` — green theme, "Join as Agent" — only on `/become-advisor`
   - `ConsultationForm` — gold theme, "Book a free call" — on all service and calculator pages
   - Currently these are swapped/conflated.

2. **Merge `/ai-advisor` into the floating chat panel.** The full-page `/ai-advisor` is a ghost page (not in nav). Either add it to nav or remove the page and route the floating button to open the same panel in-page. Don't maintain two experiences.

3. **Merge `/calculators/premium` and `/products`.** The premium calculator lets you select a plan and get a quote. The products page lists all plans. These serve overlapping intent. Combine into one "Plans & Calculator" page with tab navigation: Browse Plans | Calculate Premium.

### Simplifications
4. **Remove `IntentSection` from homepage.** It duplicates the hero's "What are you planning for?" quick-items. Replacing it with the Blueprint Calculator (moved up) is a net gain.

5. **Remove `ChatBot` static section from homepage.** The floating `AIChatButton` already does this job. The static section is dead weight (section 8 of 9 on homepage — no user reaches it organically).

6. **Simplify Blueprint Calculator to 3 steps, not 4.** Steps 2 (Shield) and 3 (Wealth) both ask about coverage. Merge them. Reducing steps by 25% typically increases completion rate by 15–20%.

### Steps to Remove
7. **Remove "Login" from the navbar.** There is no login system. The link goes to `href="#"`. It signals a missing feature and erodes trust. Remove or replace with "Policy Renewal" (which has a genuine use case).

---

## 6. CONVERSION OPTIMIZATION

### CTA Hierarchy (fix globally)
```
Primary   → ONE gold/navy button per page: "Get Free Report" / "Book Free Call"
Secondary → One outline/text link: "Learn More" / "See Plans"
Tertiary  → WhatsApp (floating, always present)
Emergency → Phone number in header (visible on all pages)
```
**Currently:** Every page has 2–3 primary-weight CTAs fighting for attention. This is the single biggest conversion killer.

### Trust Signal Upgrades
| Signal | Current | Recommended |
|--------|---------|-------------|
| Credentials | Mentioned in hero, full section below | Pin one credential bar directly below every calculator result: "Reviewed by MDRT Member Ajay Poddar" |
| Social proof | Testimonials — no photos, no names visible | Add initials + city + policy type: "R.S., Jaipur · LIC Jeevan Umang" |
| Claims settled | "₹500Cr+ Claims Settled" in stats | Add a dedicated "Claims We've Settled" section with 3 anonymised stories — this is the most underused trust asset in insurance |
| IRDAI auth | Only in footer fine print | Add "IRDAI Authorised Agent" badge near every form |
| Response time | "Within 24 hours" on contact success | Show on every CTA: "Ajay typically responds in 2–4 hours" |

### Motivational Sequence (per page)
Every key page should follow: **Problem → Stakes → Solution → Proof → Action**
- Current: pages start with a hero, dump features, end with a form. There are no stakes.
- Fix: Add one sentence of stakes to each page hero. Example on life insurance page: *"If you passed away today, your family would have ₹0 income — for how many years could they survive?"*

### Form Optimization
- **Contact form:** Reduce to name + phone + intent (3 fields). Add: "Your number is only shared with Ajay."
- **Blueprint Calculator:** After step 4 (results), auto-open the lead popup with pre-filled intent from the calculation. Currently there is no connection between the calculator output and the lead capture.
- **LeadPopup:** Currently has 4 fields. Reduce to 2 (name + phone) with intent pre-filled from context.

---

## 7. TECH & ARCHITECTURE IMPROVEMENTS

### DRY Violations (critical)

**A. Calculator page hero is copied 3 times**
```
/calculators/life-insurance/page.tsx  ─┐
/calculators/retirement/page.tsx       ├─ Identical hero section HTML (navy gradient,
/calculators/premium/page.tsx         ─┘  eyebrow, h1, subtitle, CTA buttons, IRDAI disclaimer)
```
Fix: Create `components/CalculatorPageWrapper.tsx`:
```tsx
<CalculatorPageWrapper
  icon="🧮"
  label="Life Insurance Calculator"
  title="How much life cover does your family need?"
  subtitle="..."
  ctaHref="#calculator"
>
  {/* calculator content */}
</CalculatorPageWrapper>
```

**B. Service page hero is copied 5 times**
```
/services/life-insurance/page.tsx
/services/health-insurance/page.tsx
/services/child-planning/page.tsx
/services/retirement/page.tsx
/services/tax-planning/page.tsx    ← newly created
```
All have the same navy hero with icon badge, h1, subtitle, two CTA buttons, right-side image. Fix:
```tsx
<ServicePageWrapper
  icon="🛡️"
  label="Life Insurance"
  title="..."
  subtitle="..."
  primaryCta={{ label: "Protect My Family", href: "#lead-form" }}
  secondaryCta={{ label: "Calculate Coverage", href: "/calculators/life-insurance" }}
  image={{ src: "...", alt: "..." }}
>
```

**C. LeadForm / ConsultationForm duplication**
`components/LeadForm.tsx` is rendered on every service page but it's the agent recruitment form (wrong audience). There is a separate `LeadPopup` for client leads. Fix:
- Rename `LeadForm.tsx` → `AgentRecruitmentSection.tsx`
- Create `ConsultationSection.tsx` using `BaseLeadForm` with gold theme and client-facing copy
- Update all 5 service pages to use `ConsultationSection`

**D. Translation data used as component logic**
`lib/en.json` stores `quickItems`, `types`, `perks`, `stats` as data that drives component rendering. This is correct pattern. But `hi.json` service item hrefs are hardcoded in both files separately — a maintenance trap. Fix: extract hrefs into a shared `lib/routes.ts` file that both translation files reference.

### Missing Input Validation (Security)
```ts
// Current in /api/leads/route.ts — no validation:
const { name, mobile, email, wantTo, iAm, intent, city, profession, experience, message } = data;

// Fix — add before processing:
if (!name || typeof name !== 'string' || name.length > 100) {
  return NextResponse.json({ error: 'Invalid name' }, { status: 400 });
}
if (!mobile || !/^\d{10}$/.test(mobile)) {
  return NextResponse.json({ error: 'Invalid mobile' }, { status: 400 });
}
// Sanitize all string fields before writing to CSV:
const clean = (s: any) => String(s ?? '').slice(0, 500).replace(/[\r\n]/g, ' ');
```

**Why this matters:** The CSV writer uses `fs.appendFileSync`. A crafted request with newlines in any field can inject rows into the CSV. The current `sanitize` function only handles double-quotes, not newline injection.

### Missing Rate Limiting
`/api/leads`, `/api/blueprint`, `/api/chat` have no rate limiting. A bot can:
- Spam your CSV with thousands of fake leads
- Run up Anthropic API bills via `/api/chat`

Fix: Add simple in-memory rate limiting or use Vercel's edge middleware:
```ts
// middleware.ts (Vercel edge)
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const rateMap = new Map<string, { count: number; ts: number }>()

export function middleware(req: NextRequest) {
  if (req.nextUrl.pathname.startsWith('/api/')) {
    const ip = req.headers.get('x-forwarded-for') ?? 'unknown'
    const now = Date.now()
    const entry = rateMap.get(ip) ?? { count: 0, ts: now }
    if (now - entry.ts > 60_000) {
      rateMap.set(ip, { count: 1, ts: now })
    } else if (entry.count >= 20) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
    } else {
      rateMap.set(ip, { count: entry.count + 1, ts: entry.ts })
    }
  }
  return NextResponse.next()
}
```

### Performance
- **Hero slideshow:** 5 `<img>` tags all load immediately. Only the first image needs `loading="eager"`, rest should be `loading="lazy"`. Better: migrate to Next.js `<Image>` with `priority` on index 0.
- **Framer Motion:** Imported on nearly every page including server-rendered sections. Should be wrapped in `dynamic(() => import('framer-motion'), { ssr: false })` for non-critical animations.
- **Font import:** Google Fonts `@import` in `globals.css` blocks render. Move to `next/font/google` in `app/layout.tsx`.

---

## 8. SECURITY + STABILITY

### Input Handling
| Issue | File | Risk | Fix |
|-------|------|------|-----|
| No field length limits on API inputs | `/api/leads/route.ts` | CSV row overflow, potential DoS | Add `slice(0, N)` on all fields before writing |
| Newline injection in CSV | `/api/leads/route.ts` | Data corruption, fake rows | Strip `\r\n` from all values |
| No mobile format validation | `/api/leads/route.ts` | Junk data in leads CSV | Regex `^\d{10}$` before accepting |
| No rate limiting on any API | All `/api/*` routes | Anthropic bill abuse, CSV spam | Edge middleware (see above) |
| `text-brand-600` undefined color on contact page | `app/contact/page.tsx:192` | Visual glitch | Replace with `text-gold` |
| `console.error(err)` in contact form catch | `app/contact/page.tsx:30` | Leaks stack traces to browser console | Remove in production or use logger |

### Failure States
| Scenario | Current Behavior | Better Behavior |
|----------|-----------------|-----------------|
| Google Sheets webhook fails | Silently fails, CSV saves ✓ | Already handled correctly — good |
| Blueprint API fails | No error shown to user | Show "Saved locally — Ajay will contact you" |
| Chat API down | Spinner hangs | Timeout after 15s with "Try WhatsApp instead" |
| Form submit without internet | Generic browser error | Detect offline with `navigator.onLine` before submit |

---

## 9. FINAL OUTPUT

### 9.1 Ideal User Journey (definitive)

```
1. Land on homepage
2. Read hero: "31 Years · 5000+ Families · MDRT"  [3 seconds]
3. Click ONE CTA: "Get My Wealth Report"  → jumps to Blueprint Calculator
4. Enter 4 fields: age, income, city, family size  [60 seconds]
5. See personalised results: protection gap + retirement corpus
6. Results page shows: "You need ₹X cover. Book a free call with Ajay."
7. Click → Name + Phone popup (2 fields)
8. Submit → "Ajay will call you in 2–4 hours"
9. Ajay calls → offline conversion
```

Everything else on the site serves users who need more convincing before step 6.

---

### 9.2 Revised Sitemap (optimised)

```
PRIMARY FUNNEL
├── /                          Homepage (hero → trust → calculator → testimonials → CTA)
└── /wealth-report             Blueprint Calculator (dedicated page, not homepage section)

EXPLORE (secondary)
├── /plans                     Merged: Products + Premium Calculator (tab navigation)
├── /services                  Hub (5 service cards)
│   ├── /services/life-insurance
│   ├── /services/health-insurance
│   ├── /services/child-planning
│   ├── /services/retirement
│   └── /services/tax-planning
└── /calculators
    ├── /calculators/life-insurance
    └── /calculators/retirement

TRUST
├── /about
├── /testimonials              (extract from homepage, make standalone for SEO)
└── /claims                    (NEW — 3 anonymised claim stories, huge trust builder)

SUPPORT
├── /contact
├── /faq                       (NEW — reduces WhatsApp noise)
├── /privacy-policy            (NEW — legal requirement)
└── /terms                     (NEW — legal requirement)

AI
└── /ai-advisor                (Add to nav, or merge with floating chat)

HIDDEN (footer only)
└── /become-advisor            (Move from main nav — different audience)
```

---

### 9.3 Top 10 UX Issues

1. **Wrong form on service pages** — Agent recruitment form on client pages. Highest confusion point.
2. **Blueprint Calculator is section 6 of 9 on homepage** — The core conversion tool is buried. Move to section 2.
3. **Two equally weighted CTAs in hero** — Users paralysed by choice. Remove one.
4. **No mobile filter on /products** — 39 plans, no way to filter on mobile. Complete dead end.
5. **Calculator results have no next action** — After showing "You need ₹1.5Cr cover," there is no CTA. The insight evaporates.
6. **"Login" in navbar leads to `#`** — Broken link erodes trust and signals unfinished product.
7. **Trust signals are reactive, not proactive** — MDRT badge is in a strip, not adjacent to the action. Place trust proof *next to* CTAs and forms, not in separate sections.
8. **LeadPopup context is generic** — It says "Get Free Quote" regardless of where it opens. A popup opened from the life insurance calculator should say "Get your ₹1.5Cr cover quote."
9. **Testimonials have no specificity** — No names, no cities, no plan types, no amounts. "Happy customer" testimonials are ignored. Add: "Ramesh S., Jaipur · LIC Jeevan Umang · ₹50L policy."
10. **No WhatsApp pre-fill context** — WhatsApp links use generic text. They should carry context: "Hi Ajay ji, I calculated a ₹1.8Cr protection gap on your website and want to discuss."

---

### 9.4 Page-wise Fix Strategy

| Page | Priority Fix | Effort |
|------|-------------|--------|
| `/` | Move Blueprint Calculator to section 2. Remove IntentSection. Remove ChatBot section. Reduce hero to ONE CTA. | 2h |
| `/products` | Add mobile filter drawer (bottom sheet on mobile). Add "Get Quote" CTA on each plan card. | 4h |
| `/services/*` (all 5) | Replace `LeadForm` (agent) with new `ConsultationSection` (client). Fix hero CTA anchor. | 2h |
| `/calculators/*` (all 3) | Add persistent CTA panel after results. Wire to LeadPopup with pre-filled context. | 3h |
| `/contact` | Reduce form to 3 fields. Fix `text-brand-600` → `text-gold`. | 30min |
| `/become-advisor` | Move to footer only. Add actual form submission (currently none). | 1h |
| All pages | Replace Navbar "Login → #" with "Renew Policy → /contact". | 15min |

---

### 9.5 Conversion Optimization Plan

**Phase 1 — Remove friction (Week 1)**
- [ ] Single primary CTA on homepage hero
- [ ] Move Blueprint Calculator to section 2
- [ ] Fix agent form / client form mismatch on service pages
- [ ] Add "Ajay responds in 2–4 hours" to every CTA

**Phase 2 — Close the loop (Week 2)**
- [ ] Blueprint result → auto-trigger LeadPopup with pre-filled context
- [ ] Calculator result pages → sticky "Get This Plan" bottom bar on mobile
- [ ] WhatsApp links pre-fill message with user's calculated need
- [ ] Add IRDAI badge adjacent to every form

**Phase 3 — Build trust (Week 3)**
- [ ] Add claim stories page `/claims`
- [ ] Improve testimonials with specificity (name, city, plan, amount)
- [ ] Add FAQ page (reduces "call first" barrier)
- [ ] Add Privacy Policy (legal compliance)

**Phase 4 — SEO + organic (Month 2)**
- [ ] Add `/blog` or `/insights` with plan reviews
- [ ] Structured data (LocalBusiness schema, FAQ schema)
- [ ] Convert Google Fonts `@import` to `next/font` (Core Web Vitals)

---

### 9.6 Tech + DRY Improvements

| Improvement | Files Affected | What to Create |
|-------------|---------------|----------------|
| Service page wrapper | 5 `/services/*` pages | `components/ServicePageWrapper.tsx` |
| Calculator page wrapper | 3 `/calculators/*` pages | `components/CalculatorPageWrapper.tsx` |
| Correct client form | 5 service pages | `components/ConsultationSection.tsx` |
| Input validation + sanitization | `/api/leads`, `/api/blueprint` | Shared `lib/validate.ts` |
| Rate limiting | All `/api/*` | `middleware.ts` at project root |
| Route constants | `lib/en.json`, `lib/hi.json` | `lib/routes.ts` (single source for hrefs) |
| Font optimization | `app/globals.css`, `app/layout.tsx` | Move to `next/font/google` |
| Hero images | `components/HeroSection.tsx` | Replace `<img>` with `<Image>` + `priority` |

---

### 9.7 Execution Roadmap

**SPRINT 1 — Fix Leaks (Days 1–3) · Highest ROI**
1. Fix agent form / client form mismatch — all service pages
2. Reduce homepage to: Hero → Trust Strip → Blueprint Calculator → Testimonials → Final CTA
3. Single CTA in hero
4. Remove "Login → #" from navbar
5. Fix `text-brand-600` on contact page

**SPRINT 2 — Close the Loop (Days 4–7)**
6. Blueprint Calculator result → auto-trigger lead popup
7. Add mobile filter drawer on /products
8. Add plan-card CTAs on /products
9. Add "Get This Plan" sticky CTA after calculator results
10. WhatsApp links with pre-filled context

**SPRINT 3 — DRY + Architecture (Week 2)**
11. Create `ServicePageWrapper` — remove 5x duplicate hero code
12. Create `CalculatorPageWrapper` — remove 3x duplicate hero code
13. Add input validation to `/api/leads` and `/api/blueprint`
14. Add rate limiting middleware
15. Migrate Google Fonts to `next/font`

**SPRINT 4 — Trust + Legal (Week 3)**
16. Privacy Policy page
17. Terms of Service page
18. Claims/testimonials page with specific social proof
19. FAQ page
20. Add IRDAI badge to all forms

**SPRINT 5 — SEO + Growth (Month 2)**
21. Blog/insights section
22. Structured data (LocalBusiness, FAQ schema)
23. Sitemap.xml + robots.txt
24. Core Web Vitals audit + image optimization
25. Google Analytics / Vercel Analytics setup
