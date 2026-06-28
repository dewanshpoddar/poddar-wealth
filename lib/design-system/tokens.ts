/**
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║         PODDAR WEALTH — DESIGN TOKEN SYSTEM                     ║
 * ║                                                                  ║
 * ║  Color Theory, Spacing, Elevation, Motion Tokens                ║
 * ║  Ready to apply when you decide to upgrade the design            ║
 * ╚══════════════════════════════════════════════════════════════════╝
 */

// ─────────────────────────────────────────────────────────────────────────────
// COLOR THEORY — 60-30-10 RULE
// ─────────────────────────────────────────────────────────────────────────────
// 60% → Neutral surfaces (white, off-white, near-black backgrounds)
// 30% → Primary brand (Navy)
// 10% → Accent (Gold — used ONLY for CTAs, highlights, key numbers)
//
// HOW TO USE:
//   Never use gold for more than 10% of any screen
//   Navy is structural — backgrounds, nav, footer, dark cards
//   White/cream is the resting state — all body content lives here

export const COLORS = {
  // ── Primary Brand (Navy) — HSL(228, 40%, 12%) ────────────────────
  navy: {
    50:  'hsl(228, 40%, 97%)',  // Almost white, subtle navy tint
    100: 'hsl(228, 35%, 93%)',  // Light navy wash — hover states
    200: 'hsl(228, 30%, 85%)',  // Light navy — borders on light bg
    300: 'hsl(228, 28%, 70%)',  // Medium navy — disabled text
    400: 'hsl(228, 32%, 50%)',  // Mid navy — secondary text on dark
    500: 'hsl(228, 36%, 35%)',  // Working navy — active borders
    600: 'hsl(228, 38%, 25%)',  // Deep navy — dark card borders
    700: 'hsl(228, 40%, 18%)',  // Navy light — dark card backgrounds
    800: 'hsl(228, 40%, 12%)',  // Navy DEFAULT — main dark bg
    900: 'hsl(228, 42%, 7%)',   // Navy deep — deepest dark
    950: 'hsl(228, 45%, 4%)',   // Almost black navy
  },

  // ── Accent (Gold) — HSL(43, 85%, 40%) ────────────────────────────
  gold: {
    50:  'hsl(43, 85%, 97%)',   // Near white with gold warmth — subtle bg
    100: 'hsl(43, 80%, 93%)',   // Gold wash — hover bg
    200: 'hsl(43, 75%, 85%)',   // Light gold — disabled gold
    300: 'hsl(43, 80%, 70%)',   // Mid gold — decorative
    400: 'hsl(43, 82%, 55%)',   // Bright gold — highlights
    500: 'hsl(43, 85%, 40%)',   // Gold DEFAULT — primary accent
    600: 'hsl(43, 85%, 33%)',   // Gold hover — darker on hover
    700: 'hsl(43, 82%, 25%)',   // Dark gold — text on gold bg
    800: 'hsl(43, 78%, 18%)',   // Deeper gold — titles on gold
    900: 'hsl(43, 72%, 12%)',   // Near brown — darkest gold text
  },

  // ── Neutral — HSL(40, 10%, N%) — warm-tinted grays ───────────────
  neutral: {
    0:   'hsl(0, 0%, 100%)',    // Pure white
    50:  'hsl(40, 20%, 98%)',   // Warm white — page bg
    100: 'hsl(40, 15%, 96%)',   // Cream — section alternates
    200: 'hsl(40, 10%, 92%)',   // Light gray — borders
    300: 'hsl(40, 8%, 83%)',    // Medium gray — disabled borders
    400: 'hsl(40, 6%, 67%)',    // Muted — placeholder text
    500: 'hsl(40, 6%, 50%)',    // Secondary text
    600: 'hsl(40, 7%, 37%)',    // Body text muted
    700: 'hsl(40, 8%, 25%)',    // Dark body text
    800: 'hsl(40, 10%, 14%)',   // Near black — primary text
    900: 'hsl(40, 12%, 8%)',    // Richest black — headings
  },

  // ── Semantic Colors ───────────────────────────────────────────────
  success: {
    light: 'hsl(152, 55%, 94%)',
    mid:   'hsl(152, 50%, 35%)',
    DEFAULT: 'hsl(152, 52%, 28%)',
    dark:  'hsl(152, 55%, 18%)',
  },
  danger: {
    light: 'hsl(0, 72%, 95%)',
    mid:   'hsl(0, 70%, 50%)',
    DEFAULT: 'hsl(0, 68%, 45%)',
    dark:  'hsl(0, 65%, 32%)',
  },
  warning: {
    light: 'hsl(38, 92%, 95%)',
    mid:   'hsl(38, 90%, 55%)',
    DEFAULT: 'hsl(38, 88%, 45%)',
    dark:  'hsl(38, 85%, 32%)',
  },
  info: {
    light: 'hsl(210, 80%, 95%)',
    mid:   'hsl(210, 75%, 50%)',
    DEFAULT: 'hsl(210, 72%, 40%)',
    dark:  'hsl(210, 70%, 28%)',
  },
}

// ─────────────────────────────────────────────────────────────────────────────
// TYPOGRAPHY SCALE — Major Third (1.25×)
// ─────────────────────────────────────────────────────────────────────────────
// This creates visual harmony — each size is 1.25× the previous.
// Named semantically so you think about WHAT it's for, not HOW big it is.

export const TYPE_SCALE = {
  '2xs':  { size: '10px', lineHeight: '1.4', letterSpacing: '0.02em' },
  'xs':   { size: '11px', lineHeight: '1.5', letterSpacing: '0.01em' },
  'sm':   { size: '13px', lineHeight: '1.55', letterSpacing: '0' },
  'base': { size: '16px', lineHeight: '1.6', letterSpacing: '-0.01em' },
  'lg':   { size: '18px', lineHeight: '1.5', letterSpacing: '-0.01em' },
  'xl':   { size: '20px', lineHeight: '1.4', letterSpacing: '-0.02em' },
  '2xl':  { size: '24px', lineHeight: '1.3', letterSpacing: '-0.02em' },
  '3xl':  { size: '30px', lineHeight: '1.2', letterSpacing: '-0.025em' },
  '4xl':  { size: '36px', lineHeight: '1.15', letterSpacing: '-0.03em' },
  '5xl':  { size: '48px', lineHeight: '1.1', letterSpacing: '-0.03em' },
  '6xl':  { size: '60px', lineHeight: '1.05', letterSpacing: '-0.035em' },
  '7xl':  { size: '72px', lineHeight: '1.0', letterSpacing: '-0.04em' },
}

// Font Theory: When to use which role
export const FONT_ROLES = {
  display: {
    font: 'var(--font-display)',  // Fraunces
    usage: 'Hero h1, emotional CTAs, big financial numbers (₹50,00,000)',
    weight: '400, 700',
    tracking: '-0.03em to -0.04em at large sizes',
  },
  sans: {
    font: 'var(--font-sans)',     // Plus Jakarta Sans
    usage: 'All UI text, body copy, buttons, labels, navigation',
    weight: '400, 500, 600, 700',
    tracking: '0 for body, 0.08em for uppercase labels',
  },
  mono: {
    font: 'var(--font-mono)',     // DM Mono (install when ready)
    usage: 'Policy numbers, premium amounts, table data, codes',
    weight: '400, 500',
    tracking: '-0.02em',
  },
}

// ─────────────────────────────────────────────────────────────────────────────
// ELEVATION SYSTEM — Material Design 3 adapted
// ─────────────────────────────────────────────────────────────────────────────
// Rule: Higher elevation = more important, more attention
// Navy-tinted shadows (not pure black) for brand coherence

export const ELEVATION = {
  0: 'none',
  1: '0 1px 2px rgba(12,23,64,0.04), 0 1px 4px rgba(12,23,64,0.04)',       // Resting card
  2: '0 2px 6px rgba(12,23,64,0.06), 0 2px 12px rgba(12,23,64,0.06)',      // Hover card
  3: '0 4px 16px rgba(12,23,64,0.10), 0 4px 24px rgba(12,23,64,0.08)',     // Floating panel
  4: '0 8px 32px rgba(12,23,64,0.14), 0 8px 48px rgba(12,23,64,0.10)',     // Drawer / modal
  5: '0 16px 64px rgba(12,23,64,0.20), 0 16px 80px rgba(12,23,64,0.14)',   // Full modal overlay
  gold: '0 4px 24px rgba(200,150,12,0.28), 0 2px 8px rgba(200,150,12,0.15)', // Gold accent glow
  navy: '0 4px 24px rgba(12,23,64,0.40), 0 2px 8px rgba(12,23,64,0.25)',    // Navy button glow
}

// ─────────────────────────────────────────────────────────────────────────────
// MOTION SYSTEM — Material Design motion curves
// ─────────────────────────────────────────────────────────────────────────────
// Rule: Entering elements decelerate, exiting elements accelerate
// Interactive elements use spring curves for tactile feel

export const MOTION = {
  duration: {
    instant:  '80ms',   // State changes (toggle, active)
    fast:     '150ms',  // Hover effects
    normal:   '250ms',  // Most transitions
    slow:     '400ms',  // Page sections, important reveals
    slower:   '600ms',  // Hero animations
    slowest:  '800ms',  // Complex multi-step animations
  },
  easing: {
    // Standard — for elements that change but stay visible
    standard:    'cubic-bezier(0.2, 0, 0, 1)',
    // Decelerate — for ENTERING elements (slide in, fade in)
    decelerate:  'cubic-bezier(0, 0, 0.2, 1)',
    // Accelerate — for EXITING elements (fade out, slide away)
    accelerate:  'cubic-bezier(0.3, 0, 1, 1)',
    // Spring — for interactive elements (buttons, toggles, clicks)
    spring:      'cubic-bezier(0.34, 1.56, 0.64, 1)',
    // Elastic — for bouncy reveals (counts, achievements)
    elastic:     'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },
}

// ─────────────────────────────────────────────────────────────────────────────
// SPACING SYSTEM — 4px base grid
// ─────────────────────────────────────────────────────────────────────────────
// All spacing is multiples of 4px. This creates visual rhythm.
// Tailwind already handles this — this is for reference.

export const SPACING_NOTES = {
  rule: 'All spacing must be multiples of 4px (0.25rem)',
  micro: '4px — icon padding, tiny gaps',
  small: '8-12px — input padding, badge padding',
  medium: '16-20px — card padding, section gaps',
  large: '24-32px — section padding, component gaps',
  xlarge: '48-64px — section margins, hero padding',
  xxlarge: '80-120px — page section separators',
}

// ─────────────────────────────────────────────────────────────────────────────
// BORDER RADIUS SYSTEM
// ─────────────────────────────────────────────────────────────────────────────
// Rule: Smaller components = smaller radius. Buttons/inputs use sm/md, cards use lg.
// Pill is for badges and tags only.

export const RADIUS = {
  none: '0',
  xs:   '4px',   // Micro elements — progress bars, color swatches
  sm:   '6px',   // Small elements — code, inline badges
  md:   '8px',   // Default — inputs, buttons, small cards
  lg:   '12px',  // Standard cards, panels, dropdowns
  xl:   '16px',  // Large cards, modals, sheets
  '2xl': '20px', // Featured cards, hero cards
  '3xl': '24px', // Large modals, bottom sheets
  full: '9999px', // Pills, chips, tags, avatars
}

// ─────────────────────────────────────────────────────────────────────────────
// GLASSMORPHISM RECIPES
// ─────────────────────────────────────────────────────────────────────────────
// Ready-to-apply glass surface styles.
// Add to globals.css when implementing.

export const GLASS_RECIPES = {
  // Dark glass — for overlays on navy/dark backgrounds
  dark: `
    background: rgba(12, 23, 64, 0.65);
    backdrop-filter: blur(20px) saturate(180%);
    -webkit-backdrop-filter: blur(20px) saturate(180%);
    border: 0.5px solid rgba(255, 255, 255, 0.08);
  `,
  // Light glass — for cards floating on colored/image backgrounds
  light: `
    background: rgba(255, 255, 255, 0.72);
    backdrop-filter: blur(16px) saturate(150%);
    -webkit-backdrop-filter: blur(16px) saturate(150%);
    border: 0.5px solid rgba(255, 255, 255, 0.5);
  `,
  // Gold glass — for premium CTA surfaces
  gold: `
    background: rgba(200, 150, 12, 0.12);
    backdrop-filter: blur(12px) saturate(140%);
    -webkit-backdrop-filter: blur(12px) saturate(140%);
    border: 0.5px solid rgba(200, 150, 12, 0.25);
  `,
  // Navy glass — for calculator shell, modals
  navy_frosted: `
    background: rgba(18, 21, 42, 0.80);
    backdrop-filter: blur(24px) saturate(200%);
    -webkit-backdrop-filter: blur(24px) saturate(200%);
    border: 0.5px solid rgba(255, 255, 255, 0.06);
  `,
}

// ─────────────────────────────────────────────────────────────────────────────
// COLOR USAGE GUIDE (Practical Reference)
// ─────────────────────────────────────────────────────────────────────────────

export const COLOR_USAGE = {
  // When text is on white/cream backgrounds:
  on_white: {
    heading: 'text-gray-900',
    body: 'text-gray-600',
    muted: 'text-gray-400',
    accent: 'text-gold-DEFAULT',
    link: 'text-navy-800 hover:text-gold-500',
  },
  // When text is on navy/dark backgrounds:
  on_dark: {
    heading: 'text-white',
    body: 'text-navy-300 (muted bluish-white)',
    muted: 'text-navy-400',
    accent: 'text-gold-400',
    link: 'text-gold-300 hover:text-gold-400',
  },
  // When text is on gold backgrounds:
  on_gold: {
    heading: 'text-navy-900',
    body: 'text-navy-800',
    muted: 'text-gold-700',
  },
}
