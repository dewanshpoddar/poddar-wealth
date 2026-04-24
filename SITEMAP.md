# Poddar Wealth — Complete Sitemap & Audit

**Last updated:** 2026-04-13  
**Live site:** https://www.poddarwealth.com

---

## Pages (14 live + 1 missing)

| # | URL | Type | Purpose |
|---|-----|------|---------|
| 1 | `/` | Marketing | Homepage — hero slideshow, trust stats, Wealth Blueprint Calculator, why-us strip |
| 2 | `/about` | Marketing | About Ajay Kumar Poddar — timeline, credentials, film strip, philosophy |
| 3 | `/products` | Product browser | All LIC plans with sidebar filters (category, status, premium range) |
| 4 | `/services` | Hub | Overview of 5 service areas with cards linking to sub-pages |
| 5 | `/services/life-insurance` | Service detail | Life insurance — types, why you need it, lead form |
| 6 | `/services/health-insurance` | Service detail | Health insurance service page |
| 7 | `/services/child-planning` | Service detail | Child planning service page |
| 8 | `/services/retirement` | Service detail | Retirement planning service page |
| 9 | `/services/tax-planning` | Service detail | **WAS MISSING — now created** |
| 10 | `/calculators/premium` | Tool | Premium calculator — browse plans + get quote |
| 11 | `/calculators/life-insurance` | Tool | HLV-based life cover need calculator |
| 12 | `/calculators/retirement` | Tool | Retirement corpus calculator |
| 13 | `/ai-advisor` | Tool | Poddar Ji AI chatbot (full-page experience) |
| 14 | `/become-advisor` | Lead gen | LIC agent recruitment landing page |
| 15 | `/contact` | Lead gen | Contact form + WhatsApp + office address |

---

## Multi-Step Flows (single URL, multiple states)

| Flow | States | Location |
|------|--------|----------|
| Wealth Blueprint Calculator | Step 0 Identity → 1 Family → 2 Shield → 3 Wealth → 4 Results | `/` homepage section |
| Premium Calculator | Plan browser → Selected plan → Premium result → Quote table | `/calculators/premium` |
| Life Insurance Calculator | Need input → Coverage recommendation | `/calculators/life-insurance` |
| AI Advisor | Chat session → WhatsApp handoff | `/ai-advisor` + floating button on all pages |

---

## API Routes (7)

| Route | Method | Purpose |
|-------|--------|---------|
| `/api/blueprint` | POST | Save blueprint results → CSV + Google Sheets webhook |
| `/api/chat` | POST | Poddar Ji chatbot (Anthropic Claude) |
| `/api/chat/history` | GET | Retrieve chat history by session ID |
| `/api/chat/log` | POST | Log chat messages |
| `/api/leads` | POST | Save leads → CSV + Google Sheets |
| `/api/lic-plans` | GET | Return filtered LIC plans JSON |
| `/api/lic-plans/sync` | POST | Daily sync to refresh plan data |

---

## Global Components (present on every page)

| Component | Type | Notes |
|-----------|------|-------|
| `Navbar` | Layout | Logo, nav links, EN/हिंदी toggle, mobile menu |
| `Footer` | Layout | Links, socials, IRDAI disclaimer |
| `AIChatButton` | Floating | Bottom-right chatbot trigger |
| `WhatsAppButton` | Floating | WhatsApp CTA |
| `LeadPopup` | Modal | Triggered by `openLeadPopup()` events site-wide |

---

## Known Issues & Fix Status

| Issue | Severity | Status |
|-------|----------|--------|
| `/services/tax-planning` — no page, linked from nav | **Critical** | ✅ Fixed |
| `btn-secondary` class used but undefined | High | ✅ Fixed |
| `section-subtitle` class used but undefined | Medium | ✅ Fixed |
| `section-title` class used but undefined | Medium | ✅ Fixed |
| `badge` class used but undefined | Medium | ✅ Fixed |
| `card` class used but undefined | Medium | ✅ Fixed |
| `shadow-hero` / `shadow-card-hover` tokens undefined | Medium | ✅ Fixed |
| `/services/retirement` uses `amber-*` colors not design system | Low | ⚠️ Pending |
| Privacy Policy page missing | High | ⚠️ Pending |
| Terms of Service page missing | High | ⚠️ Pending |
| FAQ / Help page missing | Medium | ⚠️ Pending |
| Hero slideshow uses `<img>` not Next.js `<Image>` | Low | ⚠️ Pending |
| Mobile Products filter drawer missing | High | ⚠️ Pending |

---

## UX Fix Priority Order

| Priority | Fix | Reason |
|----------|-----|--------|
| **P0** | `/services/tax-planning` page | Active 404 from main navigation |
| **P1** | Mobile filter drawer for `/products` | No way to filter plans on mobile |
| **P1** | Privacy Policy + Terms of Service | Regulatory / IRDAI compliance |
| **P2** | Define missing CSS classes (`btn-secondary`, `badge`, `card`, etc.) | Silent styling failures |
| **P2** | Extract `<CalculatorPageWrapper>` component | All 3 calculators share identical hero + disclaimer HTML |
| **P2** | Convert hero `<img>` → Next.js `<Image priority>` | LCP performance — above-fold slideshow |
| **P3** | Unify ad-hoc CSS to `pw-*` system | 59+ bridge definitions, not native `pw-*` |
| **P3** | FAQ page | Reduces WhatsApp/email support load |
| **P4** | `/become-advisor` lead form submission | Currently a static page, no form handling |
