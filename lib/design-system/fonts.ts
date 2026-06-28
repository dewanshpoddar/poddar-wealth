/**
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║           PODDAR WEALTH — FONT LIBRARY REFERENCE                ║
 * ║                                                                  ║
 * ║  All fonts are pre-installed via @fontsource-variable/*         ║
 * ║  To use: import the font here, add to layout.tsx                ║
 * ║                                                                  ║
 * ║  HOW TO SWITCH FONTS:                                           ║
 * ║  1. Import the font below                                        ║
 * ║  2. Pass variable to <body className={font.variable}>            ║
 * ║  3. Update tailwind.config.js fontFamily to match               ║
 * ╚══════════════════════════════════════════════════════════════════╝
 *
 * ─────────────────────────────────────────────────────────────────
 * FONT THEORY GUIDE
 * ─────────────────────────────────────────────────────────────────
 * A great font pairing has 3 roles:
 *   DISPLAY  → Hero headings, big numbers, emotional moments
 *   SANS     → UI text, body copy, labels, buttons
 *   MONO     → Financial figures, code, data tables
 *
 * Pairing rules:
 *  • Contrast: Pair a serif display with a geometric sans
 *  • Similarity: Both fonts should share similar x-height
 *  • Hierarchy: Display is ONLY used for 32px+ text
 *  • Numbers: Mono fonts make financial data feel precise and trustworthy
 */

// ─── CURRENT ACTIVE FONTS (loaded in layout.tsx) ─────────────────────────────
// Display:  Fraunces     → Elegant serif, great for emotional trust moments
// Sans:     Plus Jakarta Sans → Clean, modern, highly legible
// To change these, swap the import and CSS variable in layout.tsx

// ─── AVAILABLE FONT OPTIONS ──────────────────────────────────────────────────
// All of these are installed in node_modules. To activate any of them:
// 1. Import it in layout.tsx
// 2. Add .variable to body className
// 3. Update fontFamily in tailwind.config.js

/*
 * ═══════════════════════════════════════════════════════════════════
 * DISPLAY / HEADLINE FONTS (use for h1, h2, hero text, big numbers)
 * ═══════════════════════════════════════════════════════════════════
 *
 * 1. FRAUNCES ★ (CURRENT) — @fontsource/fraunces
 *    Style: Optical variable serif with "wonky" axis. Luxury editorial feel.
 *    Best for: Hero headlines, financial taglines, emotional CTAs
 *    Pair with: Plus Jakarta Sans, DM Sans, Outfit
 *    Import: import { Fraunces } from 'next/font/google'
 *
 * 2. CORMORANT GARAMOND — @fontsource/cormorant-garamond
 *    Style: Ultra-thin, high-contrast old-style serif. Extremely refined.
 *    Best for: Luxury wealth management, premium financial brands
 *    Pair with: Outfit, Geist, Space Grotesk
 *    Import: import '@fontsource/cormorant-garamond/400.css'
 *    CSS: font-family: 'Cormorant Garamond', serif;
 *
 * 3. DM SERIF DISPLAY — @fontsource/dm-serif-display
 *    Style: Modern editorial serif. Friendly yet authoritative.
 *    Best for: Finance, wealth, insurance brands targeting millennials
 *    Pair with: DM Sans (perfect system pairing), Manrope
 *    Import: import '@fontsource/dm-serif-display/400.css'
 *    CSS: font-family: 'DM Serif Display', serif;
 *
 * 4. PLAYFAIR DISPLAY — @fontsource/playfair-display
 *    Style: High-contrast transitional serif. Classic newspaper elegance.
 *    Best for: Premium CTAs, testimonial quotes, awards sections
 *    Pair with: Source Sans, Nunito, Inter
 *    Import: import '@fontsource/playfair-display/400.css'
 *    CSS: font-family: 'Playfair Display', serif;
 *
 * 5. LORA — @fontsource/lora
 *    Style: Contemporary serif with calligraphic roots. Warm and readable.
 *    Best for: Long-form content, blog posts, trust-building sections
 *    Pair with: Nunito, Figtree, DM Sans
 *    Import: import '@fontsource/lora/400.css'
 *    CSS: font-family: 'Lora', serif;
 *
 * ═══════════════════════════════════════════════════════════════════
 * SANS-SERIF UI FONTS (use for body, labels, buttons, UI)
 * ═══════════════════════════════════════════════════════════════════
 *
 * 6. PLUS JAKARTA SANS ★ (CURRENT) — @fontsource-variable/plus-jakarta-sans
 *    Style: Geometric humanist. Slightly rounded, very clean.
 *    Best for: Financial tech UI, calculator inputs, navigation
 *    Variable font: YES (weight: 200–800)
 *    Import: import '@fontsource-variable/plus-jakarta-sans/index.css'
 *
 * 7. OUTFIT — @fontsource-variable/outfit
 *    Style: Geometric sans with friendly proportions. Very modern.
 *    Best for: Fintech startups, modern insurance platforms
 *    Variable font: YES (weight: 100–900)
 *    Import: import '@fontsource-variable/outfit/index.css'
 *    CSS: font-family: 'Outfit Variable', sans-serif;
 *
 * 8. GEIST — @fontsource-variable/geist
 *    Style: Vercel's flagship font. Clean, neutral, highly functional.
 *    Best for: Dashboard UIs, data-heavy pages, admin sections
 *    Variable font: YES (weight: 100–900)
 *    Import: import '@fontsource-variable/geist/index.css'
 *    CSS: font-family: 'Geist Variable', sans-serif;
 *
 * 9. DM SANS — @fontsource-variable/dm-sans
 *    Style: Geometric sans. Ultra-clean, slightly technical.
 *    Best for: Perfect pairing with DM Serif Display (same type family)
 *    Variable font: YES
 *    Import: import '@fontsource-variable/dm-sans/index.css'
 *    CSS: font-family: 'DM Sans Variable', sans-serif;
 *
 * 10. MANROPE — @fontsource-variable/manrope
 *     Style: Geometric sans with distinctive character shapes. Premium feel.
 *     Best for: Premium financial UX, wealth management dashboards
 *     Variable font: YES (weight: 200–800)
 *     Import: import '@fontsource-variable/manrope/index.css'
 *     CSS: font-family: 'Manrope Variable', sans-serif;
 *
 * 11. SPACE GROTESK — @fontsource-variable/space-grotesk
 *     Style: Quirky geometric sans with unique letterforms. Techy brand feel.
 *     Best for: Calculator labels, tech-forward sections, nav items
 *     Variable font: YES
 *     Import: import '@fontsource-variable/space-grotesk/index.css'
 *     CSS: font-family: 'Space Grotesk Variable', sans-serif;
 *
 * 12. SORA — @fontsource-variable/sora
 *     Style: Japanese-influenced geometric sans. Modern, distinctive.
 *     Best for: Modern Indian fintech brands, digital-first platforms
 *     Variable font: YES (weight: 100–800)
 *     Import: import '@fontsource-variable/sora/index.css'
 *     CSS: font-family: 'Sora Variable', sans-serif;
 *
 * 13. FIGTREE — @fontsource-variable/figtree
 *     Style: Rounded geometric. Friendly and approachable.
 *     Best for: Consumer-facing financial apps, onboarding flows
 *     Variable font: YES
 *     Import: import '@fontsource-variable/figtree/index.css'
 *     CSS: font-family: 'Figtree Variable', sans-serif;
 *
 * 14. NUNITO — @fontsource-variable/nunito
 *     Style: Rounded sans. Highly readable, warm and friendly.
 *     Best for: Customer-facing content, FAQs, chatbot UI text
 *     Variable font: YES (weight: 200–900)
 *     Import: import '@fontsource-variable/nunito/index.css'
 *     CSS: font-family: 'Nunito Variable', sans-serif;
 *
 * 15. INTER — @fontsource-variable/inter
 *     Style: The industry standard. Designed for screen readability.
 *     Best for: Any UI — safe, universally loved, works everywhere
 *     Variable font: YES (weight: 100–900)
 *     Import: import '@fontsource-variable/inter/index.css'
 *     CSS: font-family: 'Inter Variable', sans-serif;
 *
 * 16. JOSEFIN SANS — @fontsource-variable/josefin-sans
 *     Style: Art deco geometric. Elegant, slightly vintage.
 *     Best for: Section eyebrows, uppercase labels, award badges
 *     Variable font: YES
 *     Import: import '@fontsource-variable/josefin-sans/index.css'
 *     CSS: font-family: 'Josefin Sans Variable', sans-serif;
 *
 * ═══════════════════════════════════════════════════════════════════
 * MONOSPACE FONTS (use for numbers, financial data, code)
 * ═══════════════════════════════════════════════════════════════════
 *
 * 17. DM MONO — @fontsource/dm-mono  (NOT variable — fixed weight only)
 *     Style: Clean, slightly humanist mono. Part of the DM type family.
 *     Best for: Premium amount displays, financial tables
 *     Variable font: NO — use weight 400 or 500
 *     Import: import '@fontsource/dm-mono/400.css'
 *     CSS: font-family: 'DM Mono', monospace;
 *
 * 18. JETBRAINS MONO — @fontsource-variable/jetbrains-mono
 *     Style: Developer's choice. Highly legible, distinctive ligatures.
 *     Best for: Technical displays, policy numbers, codes
 *     Variable font: YES (weight: 100–800)
 *     Import: import '@fontsource-variable/jetbrains-mono/index.css'
 *     CSS: font-family: 'JetBrains Mono Variable', monospace;
 *
 * 19. FIRA CODE — @fontsource-variable/fira-code
 *     Style: Mozilla's mono with programming ligatures. Very readable.
 *     Best for: Policy numbers, calculator output, data tables
 *     Variable font: YES
 *     Import: import '@fontsource-variable/fira-code/index.css'
 *     CSS: font-family: 'Fira Code Variable', monospace;
 */

// ─── RECOMMENDED PAIRS FOR PODDAR WEALTH ─────────────────────────────────────

export const FONT_PAIRS = {
  /** CURRENT — warm, editorial, trustworthy */
  current: {
    display: 'Fraunces (next/font/google)',
    sans: 'Plus Jakarta Sans (next/font/google)',
    mono: 'none',
    character: 'Warm, editorial, trusted advisor feel'
  },

  /** OPTION A — Modern Indian fintech (most recommended upgrade) */
  modern_fintech: {
    display: 'DM Serif Display',
    sans: 'DM Sans Variable',
    mono: 'DM Mono Variable',
    character: 'Clean, modern, same type family — harmonious and professional'
  },

  /** OPTION B — Ultra premium wealth management */
  ultra_premium: {
    display: 'Cormorant Garamond',
    sans: 'Manrope Variable',
    mono: 'JetBrains Mono Variable',
    character: 'Luxury, refined, high-fashion finance aesthetic'
  },

  /** OPTION C — Tech-forward, data dashboard feel */
  tech_dashboard: {
    display: 'Playfair Display',
    sans: 'Geist Variable',
    mono: 'Fira Code Variable',
    character: 'Editorial headlines with ultra-clean UI — like Bloomberg/Groww'
  },

  /** OPTION D — Friendly, consumer-facing */
  friendly_consumer: {
    display: 'Lora',
    sans: 'Nunito Variable',
    mono: 'DM Mono Variable',
    character: 'Approachable, warm — like Zepto or Slice for insurance'
  },

  /** OPTION E — Premium geometric brand */
  geometric_brand: {
    display: 'Fraunces (current)',
    sans: 'Outfit Variable',
    mono: 'DM Mono Variable',
    character: 'Keep display, upgrade sans to Outfit — minimal change, big improvement'
  },
} as const

export type FontPairKey = keyof typeof FONT_PAIRS
