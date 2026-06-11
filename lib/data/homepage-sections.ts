export const HOMEPAGE_SECTIONS = [
  { id: 'hero', label: 'Hero', order: 1 },
  { id: 'chatbot-widget', label: 'Ask Poddar Ji', order: 2 },
  { id: 'life-events', label: 'Life Events Navigator', order: 3 },
  { id: 'trust-bar', label: 'Trust Bar', order: 4 },
  { id: 'services', label: 'Services', order: 5 },
  { id: 'calculators', label: 'Calculator Tools', order: 6 },
  { id: 'testimonials', label: 'Testimonials & Reviews', order: 7 },
  { id: 'blog-preview', label: 'Blog Preview', order: 8 },
  { id: 'newsletter', label: 'Newsletter', order: 9 },
  { id: 'final-cta', label: 'Final CTA', order: 10 },
] as const;

export type SectionId = typeof HOMEPAGE_SECTIONS[number]['id'];
