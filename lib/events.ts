/**
 * Centralized custom event helpers for Poddar Wealth.
 * Use these instead of dispatching raw CustomEvents throughout the codebase.
 */

export const LEAD_POPUP_EVENT = 'open-lead-popup'

/**
 * Opens the global LeadPopup, optionally pre-filling the intent field.
 */
export function openLeadPopup(intent?: string) {
  window.dispatchEvent(
    new CustomEvent(LEAD_POPUP_EVENT, { detail: intent ? { intent } : {} })
  )
}
