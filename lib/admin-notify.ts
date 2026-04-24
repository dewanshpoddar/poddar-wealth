/**
 * Admin Notifications — central utility
 *
 * Sends structured alerts to a dedicated "Admin Notifications" tab
 * in Google Sheets via ADMIN_SHEETS_WEBHOOK_URL.
 *
 * Usage anywhere in the codebase:
 *   import { adminNotify } from '@/lib/admin-notify'
 *   await adminNotify({ type: 'API_ERROR', severity: 'error', route: '/api/leads', message: '...' })
 *
 * Types:
 *   PLAN_ALERT   — plan may be withdrawn (from fortnightly cron)
 *   API_ERROR    — unhandled error in an API route
 *   SCRAPE_FAIL  — LIC scraper / NAV fetch failed
 *   CRON_WARN    — cron ran but with partial failures
 *   LEAD_FAIL    — Google Sheets lead push failed (not the lead itself, just the sync)
 *   SYSTEM       — anything else worth logging
 *
 * Severities: 'info' | 'warn' | 'error'
 */

export type AdminNotifyPayload = {
  type:     'PLAN_ALERT' | 'API_ERROR' | 'SCRAPE_FAIL' | 'CRON_WARN' | 'LEAD_FAIL' | 'SYSTEM'
  severity: 'info' | 'warn' | 'error'
  route:    string        // e.g. '/api/leads', '/api/cron/check-plan-status'
  message:  string        // short summary (≤ 300 chars)
  detail?:  string        // stack trace, full error, JSON snippet (≤ 2000 chars)
  planNo?:  number        // for PLAN_ALERT
  planName?: string
}

const WEBHOOK = () => process.env.ADMIN_SHEETS_WEBHOOK_URL ?? ''

export async function adminNotify(payload: AdminNotifyPayload): Promise<void> {
  const url = WEBHOOK()
  if (!url) return  // silently skip if not configured

  const body = {
    timestamp:  new Date().toISOString(),
    type:       payload.type,
    severity:   payload.severity.toUpperCase(),
    route:      payload.route,
    message:    payload.message.slice(0, 300),
    detail:     (payload.detail ?? '').slice(0, 2000),
    planNo:     payload.planNo  ?? '',
    planName:   payload.planName ?? '',
  }

  try {
    await fetch(url, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(body),
      signal:  AbortSignal.timeout(6000),
    })
  } catch (_) {
    // Notification failure must never crash the calling code
    console.error('[adminNotify] Webhook failed silently', payload.message)
  }
}
