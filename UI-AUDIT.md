# UI/UX Audit — poddarwealth.com
## Date: 2026-05-31
## Status: Pre-launch — final verification pass

### COMPLETED ✅
1. Unique meta per page — 12+ layout.tsx files, verified via curl (all unique titles confirmed)
2. Banner DOM bloat — 10→2 copies (animate-marquee translateX(-50%))
3. Custom 404 — app/not-found.tsx, bilingual, branded, 4 nav links
4. /pay-premium — lead capture + opens LIC portal in new tab
5. /renew — policy renewal form, lead capture, success state, no external redirect
6. Mobile bottom overlap — WhatsApp FAB hidden sm:, chatbot bottom-20 sm:bottom-6
7. Navbar: pt-10 mobile menu, "Join as Advisor" gold button, Pay Premium link, Renew Policy → /renew
8. External links open new tab (window.open)
9. Testimonial avatars — gendered gradients (pink/blue)
10. Service cards — clickable via Link to svc.href
11. Blog — reading time, WhatsApp + copy-link share buttons
12. Blog — Comparison, Guides, Child Plans categories in filter tabs
13. Contact — Google Maps link card
14. FAQ — Related pages section (claims, calculator, products, contact, pay-premium)
15. GA4 — blog_viewed, pay_premium_clicked, renewal_requested, lead_submitted events wired
16. Dead links — zero found (all 14+ internal hrefs resolve to existing pages)
17. Service page layouts — 5 unique layout.tsx files for SEO metadata
18. MobileCTABar — imported + rendered in root layout ✅
19. Schema.org — LocalBusiness + Article JSON-LD
20. Sitemap — app/sitemap.ts (Next.js built-in, 15+ routes)
21. Blog posts — 15 posts, bilingual, Ajay Poddar's voice

### REMAINING
- Homepage: 3 testimonials → need 6-8
- Products: loading skeleton
- Services: keyman + critical illness dedicated sub-pages
- Blog: author bio section, reading time uses English word count for Hindi too
- About: real office photos
- Navbar: "Calculators" → dropdown for premium/life-insurance/retirement
- Mobile: test on real iOS Safari (safe-area-inset for MobileCTABar)
- Analytics: calculator_result event not yet wired to specific plan
- og:title still uses root layout values on per-page layouts (only <title> is unique)

### RECALL CODE: "show UI audit"
