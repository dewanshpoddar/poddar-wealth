/**
 * Analytics helper — wraps gtag() calls with type safety.
 * GA4 Measurement ID is set via NEXT_PUBLIC_GA_ID in .env.local
 * Microsoft Clarity ID is set via NEXT_PUBLIC_CLARITY_ID in .env.local
 */

export type AnalyticsEvent =
  // Primary funnel — Blueprint Calculator
  | 'hero_cta_clicked'
  | 'blueprint_started'
  | 'blueprint_step_completed'
  | 'blueprint_step_abandoned'
  | 'blueprint_completed'
  | 'blueprint_lead_submitted'
  | 'blueprint_lead_failed'
  // Secondary funnel — Calculators
  | 'calculator_opened'
  | 'calculator_result_shown'
  | 'calculator_lead_clicked'
  // Service pages
  | 'service_page_viewed'
  | 'consultation_form_submitted'
  | 'consultation_form_failed'
  // Lead Popup
  | 'lead_popup_opened'
  | 'lead_popup_dismissed'
  | 'lead_popup_submitted'
  // Product discovery
  | 'plan_card_expanded'
  | 'plan_quote_clicked'
  | 'products_filter_applied'
  // Engagement
  | 'whatsapp_clicked'
  | 'ai_chat_opened'
  | 'ai_chat_message_sent'
  // Agent funnel
  | 'advisor_application_started'
  | 'advisor_application_submitted'

export function trackEvent(
  name: AnalyticsEvent,
  params?: Record<string, string | number | boolean>
) {
  if (typeof window === 'undefined') return
  const w = window as Window & { gtag?: (...args: unknown[]) => void }
  if (typeof w.gtag !== 'function') return
  w.gtag('event', name, params ?? {})
}
