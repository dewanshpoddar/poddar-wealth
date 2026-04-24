# Poddar Wealth — Growth, Analytics & Conversion Optimization System

**Role:** Growth PM + UX Researcher + Analytics Expert  
**Date:** 2026-04-13  
**Phase:** Post-build optimization (website is live and functional)  
**Goal:** Turn a working product into a continuously improving growth engine

---

## 1. PRIMARY USER JOURNEY (Instrumented)

Every event below maps to a stage in this funnel. If a stage has no data, it is a blind spot.

```
ACQUISITION
  Google Search / WhatsApp share / referral link
  ↓ [track: page_view + source/medium]

LANDING
  Homepage hero visible
  ↓ [track: hero_viewed]

INTENT SIGNAL
  User clicks "Get Wealth Health Report" → Blueprint Calculator
  ↓ [track: blueprint_cta_clicked, position: hero]

ENGAGEMENT — CALCULATOR STEPS
  Step 1: Identity (age, income, city, employment)
  ↓ [track: blueprint_step_completed, step: 1]
  Step 2: Family (married, children, parents)
  ↓ [track: blueprint_step_completed, step: 2]
  Step 3: Shield (existing cover, loans)
  ↓ [track: blueprint_step_completed, step: 3]
  Step 4: Wealth (assets, goals, retirement age)
  ↓ [track: blueprint_step_completed, step: 4]

INSIGHT
  Results page renders (score, HLV, gap, prescription)
  ↓ [track: blueprint_completed, score: X, gap_lakhs: Y]

CRITICAL MOMENT — Result → Action
  User fills name + phone in "Save & Book Call" form
  ↓ [track: blueprint_lead_submitted]

CONVERSION
  Ajay calls user → offline
  ↓ [track manually in CRM: call_completed, outcome: converted|follow_up|lost]
```

**Secondary — Agent Funnel:**
```
Footer/mobile nav → /become-advisor → form submit
[track: advisor_application_started, advisor_application_submitted]
```

**The critical gap to close:** Blueprint completion → lead submission.  
This is where most users drop. Everything else is working.

---

## 2. ANALYTICS SETUP PLAN

### 2A. Google Analytics 4 (GA4)

**Setup steps:**
1. Create GA4 property at analytics.google.com
2. Add to `app/layout.tsx` via `next/script` with `strategy="afterInteractive"`
3. Use `gtag()` for custom events OR install `@next/third-parties/google` (Next.js official)

**Implementation in `app/layout.tsx`:**
```tsx
import { GoogleAnalytics } from '@next/third-parties/google'
// In <body>:
<GoogleAnalytics gaId="G-XXXXXXXXXX" />
```

**Custom event helper — create `lib/analytics.ts`:**
```ts
export function trackEvent(
  name: string,
  params?: Record<string, string | number | boolean>
) {
  if (typeof window === 'undefined') return
  if (typeof (window as any).gtag !== 'function') return
  ;(window as any).gtag('event', name, params ?? {})
}
```

---

### 2B. Complete Event Registry

| Event Name | Trigger | Parameters | Why It Matters |
|-----------|---------|------------|----------------|
| `page_view` | Every route change | `page_path`, `page_title` | Baseline traffic — auto-tracked by GA4 |
| `hero_cta_clicked` | Hero "Get Wealth Health Report" click | `cta_label`, `position: 'hero'` | Entry into primary funnel |
| `hero_secondary_cta_clicked` | "Book Free Consultation" hero click | `cta_label` | Secondary intent signal |
| `blueprint_started` | User clicks into first Blueprint Calculator field | `entry_point: 'homepage'` | Funnel entry rate |
| `blueprint_step_completed` | Each "Next" click in Blueprint | `step: 1\|2\|3\|4`, `time_on_step_seconds` | Drop-off by step — find the hardest question |
| `blueprint_step_abandoned` | User leaves page mid-step (beforeunload) | `last_step: 1\|2\|3\|4` | Where confusion peaks |
| `blueprint_completed` | Step 4 results rendered | `score: number`, `gap_lakhs: number`, `hlv_lakhs: number`, `is_hni: boolean` | Quality of leads (HNI vs regular) |
| `blueprint_lead_submitted` | "Save & Book Call" button clicked successfully | `score`, `gap_lakhs`, `city_tier` | Primary conversion event |
| `blueprint_lead_failed` | "Save & Book Call" submission error | `error_type` | Fix broken conversion |
| `calculator_opened` | User visits any /calculators/* page | `calculator_type: 'premium'\|'life'\|'retirement'` | Which calculators drive traffic |
| `calculator_result_shown` | Calculator outputs a result | `calculator_type`, `cover_amount`, `plan_name` | Result quality |
| `calculator_lead_clicked` | "Get Exact Quote" / "Get Official Quote" clicked | `calculator_type`, `plan_name`, `cover_amount` | Calculator→lead conversion |
| `service_page_viewed` | Any /services/* page visited | `service: 'life'\|'health'\|'child'\|'retirement'\|'tax'` | Which services have demand |
| `consultation_form_submitted` | ConsultationSection form submit success | `intent`, `service_page` | Service page conversion |
| `consultation_form_failed` | ConsultationSection form error | `error_type` | Fix broken forms |
| `lead_popup_opened` | LeadPopup opens (auto or triggered) | `trigger: 'auto'\|'intent'`, `intent_string` | Popup exposure rate |
| `lead_popup_dismissed` | LeadPopup closed without submitting | `time_open_seconds` | Friction signal |
| `lead_popup_submitted` | LeadPopup form submitted successfully | `intent` | Popup conversion |
| `whatsapp_clicked` | Any WhatsApp link clicked | `source_page`, `source_component` | Direct channel preference |
| `ai_chat_opened` | Floating AI chat button clicked | `page_path` | AI as discovery tool |
| `ai_chat_message_sent` | User sends a message to Poddar Ji | `message_count` (session) | Engagement depth |
| `products_filter_applied` | Filter used on /products | `filter_type`, `filter_value` | What users search for |
| `plan_card_expanded` | Plan card clicked to expand | `plan_name`, `plan_category` | Plan interest |
| `plan_quote_clicked` | "Get Quote" on plan card clicked | `plan_name` | Plan-level conversion intent |
| `advisor_application_started` | User begins /become-advisor form | — | Agent funnel entry |
| `advisor_application_submitted` | Agent form submitted | `city`, `experience_level` | Agent lead quality |
| `scroll_depth_50` | User scrolls 50% of homepage | — | Content engagement |
| `scroll_depth_blueprint` | Blueprint Calculator enters viewport | — | How many users see the tool |

---

### 2C. Microsoft Clarity Setup

**Why Clarity alongside GA4:**
- GA4 = what happened (numbers)
- Clarity = why it happened (visual, qualitative)
- Free, GDPR-friendly, no sampling

**Setup:**
1. Create project at clarity.microsoft.com
2. Add tracking snippet to `app/layout.tsx` via `next/script`:

```tsx
<Script id="clarity" strategy="afterInteractive">
  {`(function(c,l,a,r,i,t,y){
    c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
    t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
    y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
  })(window,document,"clarity","script","YOUR_PROJECT_ID");`}
</Script>
```

3. Tag key elements with `data-clarity-mask="false"` for sensitive fields (phone inputs should be masked by default — verify this).

---

## 3. USER BEHAVIOR ANALYSIS PLAN (Clarity)

### What to Look For Weekly

**Rage Clicks (user clicking repeatedly in frustration):**

| Where you see it | What it means | What to fix |
|-----------------|---------------|-------------|
| Blueprint "Next" button | Validation error not visible enough | Make error message larger, red, above the button |
| Plan card on /products | User expects click to do something | Add clear "Expand" affordance |
| WhatsApp floating button on mobile | Tap target too small | Increase to 56px minimum |
| "Renew Policy" in navbar | Users expect an actual renewal portal | Change copy or link to /contact with pre-filled intent |

**Dead Clicks (clicks on non-interactive elements):**

| Where | What it means |
|-------|---------------|
| Blueprint score ring | Users think the ring is clickable | Add a tooltip or remove hover state |
| Trust stats on hero | Users try to click credential badges | Make them linkable to /about |
| Plan card description text | Users expect the text to expand | Add expand icon |

**Scroll Depth — Homepage:**

| Scroll % | What's there | Target |
|----------|-------------|--------|
| 0–20% | Hero | 100% of visitors |
| 20–35% | Trust strip | >80% should reach here |
| 35–60% | Blueprint Calculator | >60% should reach this — if not, hero CTA is weak |
| 60–75% | Services section | >40% |
| 75–90% | Products teaser + Testimonials | >25% |
| 90–100% | Agent strip + FinalCTA | >15% |

**If <40% of users reach the Blueprint Calculator:** The hero CTA is failing. Primary action to fix.  
**If >60% reach Blueprint but <20% start it:** The calculator's visual entry point is not clear enough.

**Session Recordings — What to Watch:**

- Users who reach Blueprint Step 4 (results) but don't submit the form → watch 10 of these recordings. Look for: hesitation on phone field, reading results then leaving, rage click on something near the form
- Users who open LeadPopup and dismiss it → watch 5. Are they closing immediately (popup annoyance) or reading then leaving (copy problem)?
- Mobile sessions on /products → watch 3. Can they navigate without a filter? Where do they abandon?
- Any session where a user fills 3+ Blueprint steps then leaves → high-value dropout, understand why

**Patterns That Indicate Confusion:**
- Multiple back-forward clicks within Blueprint Calculator steps
- Scroll up after seeing results (looking for context they missed)
- Long pause (>30s) on any single Blueprint step input
- Form field focus → blur → focus → blur repeatedly (indecision)

**Patterns That Indicate Strong Intent:**
- Blueprint completion + immediately filling name/phone form
- Calculator result → opens WhatsApp within 60 seconds
- Visits /products AND /services/life-insurance in same session
- Returns within 48 hours to same calculator

---

## 4. USER TESTING PLAN

### 5 User Profiles

| # | Profile | Age | Income | Geography | Device |
|---|---------|-----|--------|-----------|--------|
| U1 | Salaried professional, first insurance | 28–32 | ₹8–15L/yr | Tier 2 city (Gorakhpur, Lucknow) | Android mobile |
| U2 | Business owner, existing LIC policyholder | 40–50 | ₹20–40L/yr | Tier 2 city | Desktop/laptop |
| U3 | NRI, planning for parents back home | 35–45 | ₹50L+ | Dubai/UK (Hindi speaker) | iPhone |
| U4 | Young married couple, new parents | 30–35 | ₹12–20L | Metro (Delhi/Mumbai) | Android mobile |
| U5 | Retired government employee, existing policy | 58–65 | Pension | Tier 3 town | Feature phone or basic Android |

### Task Script (for each user)

**Give them this briefing (do not explain the site):**
> "You're looking for insurance advice for your family. A friend sent you this website. Please use it as you normally would. Think aloud as you go."

**Tasks:**
1. "Find out if your family has enough life insurance cover." (→ tests Blueprint Calculator discoverability)
2. "Book a call with the advisor." (→ tests consultation form, WhatsApp, lead popup)
3. "Find a plan for your child's education." (→ tests /services/child-planning and product discovery)
4. "Find out what your monthly premium would be for a ₹50 lakh LIC plan." (→ tests /calculators/premium)
5. "Check if this advisor is trustworthy." (→ tests /about, trust signals, credentials)

### What to Observe

- Do they find the Blueprint Calculator without being told?
- Do they understand what the calculator output means?
- After seeing results, what is their first instinct? (Call? WhatsApp? Form? Leave?)
- Can they find the advisor's credentials without prompting?
- On mobile: can they filter plans? Can they read the form without zooming?

### Post-Session Questions (5 minutes)

1. What would you do next if this were real?
2. What was confusing or unclear?
3. Did you trust the advisor based on what you saw? What made you trust or not trust?
4. Was there anything you were looking for that you couldn't find?
5. On a scale of 1–10, how likely are you to actually contact this advisor?

### What to Do With Findings

- Any task where >2 of 5 users fail → P0 fix
- Any task where >3 of 5 users need >60 seconds → UX friction, investigate
- Trust question answers → update TrustSection copy with the exact words users use to describe trustworthiness

---

## 5. CONVERSION OPTIMIZATION — RESULT → ACTION

This is the highest-leverage gap. User has invested 3–5 minutes completing the Blueprint, seen a personalized result, and then... often leaves.

### Why Users Drop After Seeing Results

Based on pattern analysis (pre-instrumentation hypothesis — validate with Clarity):

1. **The result is interesting but the ask feels sudden.** User goes from "seeing their numbers" to "give me your phone number" with no bridge.
2. **The form looks like every other lead capture form on the internet.** Generic = low trust.
3. **No urgency or social proof at the moment of ask.** The result shows a gap but doesn't tell the user what happens if they ignore it.
4. **Phone number field feels risky.** Indian users are conditioned to fear spam calls.

### Fixes (Prioritised)

**Fix 1 — Add a bridge sentence between results and form (no code change needed, copy only)**

Current: Results → "Get Ajay sir's personal review of this blueprint" form  
Better: Add one line above the form: *"Your blueprint shows a ₹X lakh protection gap. Ajay sir reviews every blueprint personally and calls with a specific plan — not a script."*

This makes the form feel like a natural next step, not a conversion trap.

**Fix 2 — Make the phone field feel safer**

Change placeholder from "WhatsApp number" to "Your WhatsApp (Ajay calls personally)"  
Add micro-copy: "No spam. No call centre. Ajay sir calls himself."

**Fix 3 — Add a time-based nudge on the results screen**

After 45 seconds on the results screen with no form interaction, show a subtle inline nudge:
```
💬  Still reviewing? Send this blueprint to yourself — enter your WhatsApp and we'll send a PDF summary.
```
This reframes the ask from "give us your number to get sold to" to "get your report."

**Fix 4 — WhatsApp as an alternative CTA on results**

Add below the form:
```
Or chat directly: 
[WhatsApp Ajay sir →]  wa.me/91XXXXXXX?text=Hi+Ajay+sir,+my+blueprint+score+is+{score}+and+I+have+a+₹{gap}+lakh+protection+gap.
```
Pre-filling the WhatsApp message with the user's actual score makes it personal and dramatically increases click-through. Users who won't fill a form will often send a WhatsApp.

**Fix 5 — Calculator result pages: sticky mobile CTA**

On mobile, after a calculator produces a result, the CTA button scrolls out of view. Add a sticky bottom bar that appears after the result renders:
```tsx
{resultVisible && (
  <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gold/20 p-4 flex gap-3 lg:hidden z-40">
    <button onClick={() => openLeadPopup(`Calculator result: ${planName}, ₹${cover} cover`)}
      className="flex-1 bg-gold text-white font-bold py-3 rounded-xl text-[14px]">
      Get This Plan →
    </button>
    <a href={`https://wa.me/...`} className="px-4 py-3 border border-gold rounded-xl text-gold font-bold">
      💬
    </a>
  </div>
)}
```

**Fix 6 — Lead popup: context-aware copy**

The global LeadPopup currently says "Talk to Ajay sir" regardless of context. Since intent strings are already being passed (`openLeadPopup('Premium quote: LIC Jeevan Umang...')`), use that intent to change the popup headline:

```ts
// In LeadPopup.tsx, derive headline from intent
const headline = intent.startsWith('Premium quote')
  ? 'Get your exact premium confirmed'
  : intent.startsWith('Retirement')
  ? 'Plan your retirement with Ajay sir'
  : 'Book a free call with Ajay sir'
```

---

## 6. MOBILE EXPERIENCE VALIDATION CHECKLIST

Run this checklist monthly on a real Android device (not browser simulation):

### Navigation
- [ ] Navbar hamburger opens within 1 tap
- [ ] All mobile menu links are tappable (min 44px height)
- [ ] Language toggle (EN/हिंदी) is visible and tappable without zooming
- [ ] "Join as Advisor" mobile link is present and subtle (not competing with main links)
- [ ] Closing the menu works reliably

### Homepage
- [ ] Hero CTA button is full-width or nearly full-width on 375px screen
- [ ] Blueprint Calculator is visible above the fold on 375px (should be within first 2 scrolls)
- [ ] Trust strip numbers are readable without zooming
- [ ] Agent teaser strip text wraps correctly on 320px

### Blueprint Calculator
- [ ] All input fields are reachable without horizontal scroll
- [ ] Keyboard doesn't cover the active input field
- [ ] "Next" button is always visible (not hidden behind keyboard)
- [ ] Number inputs on mobile show numeric keyboard (`inputMode="numeric"`)
- [ ] Step indicator shows current progress clearly
- [ ] Results page: score ring + key metrics readable without zoom
- [ ] "Save & Book Call" form: phone field shows numeric keyboard
- [ ] WhatsApp alternative CTA visible on results screen

### Products Page
- [ ] Without a filter drawer, users can at least scroll through plans
- [ ] Plan cards expand/collapse with single tap
- [ ] "Get Quote" on plan cards triggers popup correctly
- [ ] No horizontal overflow (no side-scroll)

### Forms (ConsultationSection, Contact, LeadPopup)
- [ ] Phone field: numeric keyboard opens automatically
- [ ] Submit button not covered by keyboard on small screens
- [ ] Error messages visible without scrolling
- [ ] Success state visible and clear

### General
- [ ] No text smaller than 12px
- [ ] Tap targets minimum 44×44px
- [ ] No fixed elements that overlap content
- [ ] WhatsApp floating button doesn't cover any content or form submit buttons
- [ ] Pages load without layout shift (no elements jumping after load)

### Priority Fixes (if failing):
1. Blueprint Calculator keyboard coverage → add `scroll-mt` to active step container
2. Products page → add mobile filter bottom sheet (P1 backlog item)
3. Form submit buttons behind keyboard → use `pb-safe` padding on form containers

---

## 7. PERFORMANCE CHECKLIST

### Tools to Use
- **Google PageSpeed Insights** — pagespeed.web.dev (test both mobile and desktop)
- **Vercel Speed Insights** — built-in if deployed on Vercel (enable in dashboard)
- **Chrome DevTools** — Network tab, Lighthouse

### Metrics and Benchmarks

| Metric | What It Measures | Good | Acceptable | Bad | Current Risk |
|--------|-----------------|------|-----------|-----|--------------|
| **LCP** (Largest Contentful Paint) | When main content loads | <2.5s | 2.5–4s | >4s | Hero images are `<img>` tags, no `priority` — likely slow |
| **CLS** (Cumulative Layout Shift) | Page elements jumping | <0.1 | 0.1–0.25 | >0.25 | Google Fonts `@import` causes FOUT — risky |
| **FID/INP** (Interaction to Next Paint) | Input responsiveness | <200ms | 200–500ms | >500ms | Framer Motion on every section — risk on low-end Android |
| **TTFB** (Time to First Byte) | Server response | <800ms | 800ms–1.8s | >1.8s | Vercel edge — should be fast |
| **FCP** (First Contentful Paint) | First visible content | <1.8s | 1.8–3s | >3s | Linked to Fonts + Hero image |

### Specific Fixes (in priority order)

**Fix 1 — Hero image priority (LCP impact: HIGH)**
```tsx
// In HeroSection.tsx — first image gets priority, rest lazy
<Image
  src={src}
  alt="..."
  fill
  className={`object-cover transition-opacity ...`}
  priority={idx === 0}      // ← first slide loads eagerly
  loading={idx === 0 ? 'eager' : 'lazy'}
/>
```

**Fix 2 — Move Google Fonts from CSS @import to next/font (CLS + FCP impact: HIGH)**
```tsx
// Remove from globals.css:
// @import url('https://fonts.googleapis.com/...')

// Add to app/layout.tsx:
import { Fraunces, Plus_Jakarta_Sans } from 'next/font/google'
const fraunces = Fraunces({ subsets: ['latin'], variable: '--font-display', display: 'swap' })
const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-sans', display: 'swap' })
```
This eliminates render-blocking font requests and prevents FOUT (Flash of Unstyled Text).

**Fix 3 — Framer Motion dynamic import (INP impact: MEDIUM)**
```tsx
// For non-critical animated sections:
import dynamic from 'next/dynamic'
const TestimonialsSection = dynamic(() => import('@/components/TestimonialsSection'), { ssr: false })
```
Keep Framer Motion server-rendered only for above-the-fold elements.

**Fix 4 — Image format (LCP impact: MEDIUM)**
Next.js `<Image>` automatically serves WebP/AVIF. Migrate remaining `<img>` tags in Footer, TrustSection, and service pages to `<Image>`.

### Monthly Performance Review Process
1. Run PageSpeed on `/` (mobile) — record LCP and CLS scores
2. Run PageSpeed on `/calculators/premium` — this is the most JS-heavy page
3. If LCP >3s on mobile → investigate which image or font is the bottleneck
4. Check Vercel Analytics "Web Vitals" tab → filter by real user data, not synthetic

---

## 8. METRICS DASHBOARD (Weekly)

### Primary Metrics Table

| Metric | How to Measure | Target | Good | Concerning |
|--------|---------------|--------|------|-----------|
| **Weekly Visitors** | GA4 → Users | — | Growing WoW | Flat or declining |
| **Blueprint Start Rate** | `blueprint_started` / visitors | >15% | >20% | <8% |
| **Blueprint Completion Rate** | `blueprint_completed` / `blueprint_started` | >45% | >60% | <25% |
| **Result → Lead Rate** | `blueprint_lead_submitted` / `blueprint_completed` | >20% | >35% | <10% |
| **Total Leads/Week** | All form + popup submissions | 10+ | 20+ | <5 |
| **Calculator Usage** | Sum of `calculator_result_shown` events | — | Growing | Flat |
| **WhatsApp Clicks** | `whatsapp_clicked` events | — | Growing | Flat |
| **Page Load (LCP mobile)** | PageSpeed Insights | <2.5s | <2s | >4s |

### The 4 Numbers That Actually Matter

Every Monday morning, look at only these four:

```
1. Visitors this week vs last week        → Is traffic growing?
2. Blueprint completion rate              → Is the funnel working?
3. Leads generated (all sources)          → Is the business getting calls?
4. Result→Lead conversion %              → Is the critical gap closing?
```

If #3 (leads) is up but #2 (completion rate) is down, you have traffic quality improving.  
If #2 is up but #3 is down, there's a problem between result and action.  
If #1 is up but #3 is flat, conversion is the problem — focus there.

### What Good Looks Like (Month 3 targets)

```
Weekly visitors:              300–500
Blueprint start rate:         18–25%
Blueprint completion rate:    45–65%
Result → lead rate:           20–35%
Leads per week:               12–25
WhatsApp conversations:       5–10/week
```

### What Bad Looks Like (requires intervention)

```
Blueprint start rate < 8%:    Hero CTA is failing — test new copy
Blueprint completion < 20%:   A specific step is causing abandonment — check Clarity
Result → lead < 10%:          Result-to-action gap — implement Fix 3/4/5 from Section 5
Total leads < 3/week:         Funnel is broken at multiple points — run full audit
```

---

## 9. WEEKLY IMPROVEMENT LOOP

### The System (runs every Monday, 30 minutes)

**Step 1 — Collect (10 min)**
```
Open GA4 → check last 7 days:
  □ Visitors vs previous week
  □ blueprint_started events
  □ blueprint_completed events  
  □ blueprint_lead_submitted events
  □ Total lead form submissions
  □ Top 3 pages by traffic
  □ Top exit pages

Open Clarity → check last 7 days:
  □ Rage click report (any new hotspots?)
  □ Blueprint step with highest drop-off (session filter: exited mid-calculator)
  □ 2 session recordings from Blueprint-completers who did NOT submit the form
```

**Step 2 — Identify (5 min)**

Ask one question: **"Where did the most users drop this week?"**

Use this decision tree:
```
Traffic down?          → Check if a page broke or a search ranking dropped
Blueprint starts down? → Hero CTA copy or visibility problem
Mid-Calculator drop?   → Specific step is confusing — watch Clarity recordings
Result drop rate high? → Result→action gap — implement conversion fixes
Leads down despite completions? → Form or popup is broken — test submission
```

**Step 3 — Fix (one fix only)**

Pick the single highest-impact change. Write it as:
> "X% of users who completed the Blueprint did not submit the form this week. Clarity shows they pause >40s on the result page then leave. Fix: Add the WhatsApp pre-fill CTA below the name/phone form. Estimated impact: +20% result→lead rate."

Do the fix. Deploy. Measure next week.

**Do not fix multiple things at once.** If you fix 3 things simultaneously, you can't know what worked.

**Step 4 — Log It**

Keep a simple text log:
```
Week of 2026-04-13:
  Problem: Blueprint completion rate dropped from 52% to 38%
  Root cause: Clarity shows rage clicks on Step 3 "Shield" — existing cover slider hard to use on mobile
  Fix shipped: Replaced range slider with tap-to-select buttons (₹0 / ₹25L / ₹50L / ₹1Cr / Other)
  Expected: Completion rate recovers to 45%+ in 2 weeks

Week of 2026-04-20:
  Result: Completion rate at 47% — fix worked
  New problem: ...
```

---

## 10. IMPLEMENTATION PRIORITY ORDER

Everything in this document is actionable. Here is the sequence:

**Week 1 — Instrument first (no optimization without data)**
1. Install GA4 with `@next/third-parties/google`
2. Create `lib/analytics.ts` helper
3. Add `trackEvent()` calls to Blueprint Calculator (steps 1–4, result, submit)
4. Add tracking to all CTA buttons (hero, consultation section, lead popup)
5. Install Microsoft Clarity
6. Deploy — let it run for 7 days before drawing conclusions

**Week 2 — Fix performance (affects all conversion)**
7. Migrate hero `<img>` to `<Image priority>` for slide 0
8. Move Google Fonts to `next/font` (eliminates FOUT and blocking)
9. Run PageSpeed — record baseline scores

**Week 3 — Close the result→action gap**
10. Add WhatsApp pre-fill CTA below Blueprint result form (dynamic message with score + gap)
11. Add sticky mobile CTA bar on calculator result screens
12. Update LeadPopup headline based on intent string

**Week 4 — First usability test**
13. Run 3 users through the task script (Section 4)
14. Watch 10 Clarity recordings of Blueprint drop-offs
15. Identify the one highest-friction point
16. Fix it

**Monthly — Ongoing**
- Run mobile validation checklist
- Run PageSpeed check
- Run 30-min Monday review (Section 9)
- Ship one fix per week

---

## APPENDIX: ANALYTICS CODE — READY TO IMPLEMENT

### `lib/analytics.ts`
```typescript
export type AnalyticsEvent =
  | 'hero_cta_clicked'
  | 'blueprint_started'
  | 'blueprint_step_completed'
  | 'blueprint_step_abandoned'
  | 'blueprint_completed'
  | 'blueprint_lead_submitted'
  | 'blueprint_lead_failed'
  | 'calculator_opened'
  | 'calculator_result_shown'
  | 'calculator_lead_clicked'
  | 'consultation_form_submitted'
  | 'consultation_form_failed'
  | 'lead_popup_opened'
  | 'lead_popup_dismissed'
  | 'lead_popup_submitted'
  | 'whatsapp_clicked'
  | 'ai_chat_opened'
  | 'service_page_viewed'
  | 'plan_card_expanded'
  | 'advisor_application_submitted'

export function trackEvent(
  name: AnalyticsEvent,
  params?: Record<string, string | number | boolean>
) {
  if (typeof window === 'undefined') return
  if (typeof (window as any).gtag !== 'function') return
  ;(window as any).gtag('event', name, {
    ...params,
    timestamp: Date.now(),
  })
}
```

### Key placement examples

```tsx
// HeroSection.tsx — hero CTA
onClick={() => trackEvent('hero_cta_clicked', { cta_label: t.hero.cta1, position: 'hero' })}

// WealthBlueprintCalculator.tsx — step completion
const handleNext = () => {
  trackEvent('blueprint_step_completed', { step: currentStep, time_on_step_seconds: elapsed })
  setStep(s => s + 1)
}

// WealthBlueprintCalculator.tsx — results rendered
useEffect(() => {
  if (step === 4) {
    trackEvent('blueprint_completed', {
      score: bp.score,
      gap_lakhs: bp.protectionGapL,
      hlv_lakhs: bp.hlvL,
      is_hni: bp.isHNI,
    })
  }
}, [step])

// WealthBlueprintCalculator.tsx — lead submit
const saveBlueprint = async () => {
  // ... existing save logic ...
  trackEvent('blueprint_lead_submitted', { score: bp.score, gap_lakhs: bp.protectionGapL })
}

// WhatsAppButton.tsx
onClick={() => trackEvent('whatsapp_clicked', { source_page: pathname, source_component: 'floating_button' })}
```
