/**
 * Shared server-side utilities for API routes.
 * Import from here - do NOT duplicate these in individual route files.
 */

import fs from 'fs'
import path from 'path'
import { adminNotify } from '@/lib/admin-notify'

/** Strip control characters, truncate, normalize whitespace. Safe for logging and sheet cells. */
export function clean(s: unknown, max = 500): string {
  return String(s ?? '').slice(0, max).replace(/[\r\n\t]/g, ' ').trim()
}

/** Return true if the value is a 10-digit Indian mobile number (spaces allowed). */
export function isValidPhone(phone: unknown): boolean {
  return /^\d{10}$/.test(String(phone ?? '').replace(/\s/g, ''))
}

/**
 * Wrap a value in CSV double-quotes.
 * Strips leading formula-injection characters (=, +, -, @, tab, CR) per OWASP CSV injection guidance.
 */
export function csvSanitize(v: unknown): string {
  const s = String(v ?? '').replace(/^[=+\-@\t\r]/, "'")
  return `"${s.replace(/"/g, '""')}"`
}

/**
 * Append one data row to a CSV file under /tmp.
 * Creates the file with a header row if it does not yet exist.
 */
export function appendToCsv(filename: string, headers: string[], row: unknown[]): void {
  const filePath = path.join('/tmp', filename)
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, headers.join(',') + '\n')
  }
  fs.appendFileSync(filePath, row.map(csvSanitize).join(',') + '\n')
}

export interface SheetsPayload {
  row: unknown[]
  intent: string
  sheetName: string
  headers: string[]
}

/**
 * POST a row to the Google Sheets Apps Script webhook.
 *
 * Non-fatal: on network failure the error is logged and forwarded to adminNotify,
 * but never thrown - the caller's CSV write is the source-of-truth backup.
 *
 * Uses AbortSignal.timeout(5000) - equivalent to the manual AbortController + setTimeout
 * pattern it replaces; already used in admin-notify.ts.
 */
export async function pushToSheets(
  url: string,
  payload: SheetsPayload,
  route: string,
  failMessage: string,
): Promise<void> {
  try {
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(5000),
    })
  } catch (err) {
    console.error(`[pushToSheets] ${route} webhook failed (non-fatal):`, err)
    adminNotify({
      type: 'LEAD_FAIL',
      severity: 'warn',
      route,
      message: failMessage,
      detail: String(err),
    }).catch(() => {})
  }
}

export interface ValidationRule {
  type: 'string' | 'number' | 'boolean'
  required?: boolean
  min?: number
  max?: number
  regex?: RegExp
  enum?: string[]
}

export interface ValidationSchema {
  [key: string]: ValidationRule
}

/**
 * Validates request parameters against a lightweight schema.
 * Replaces heavy external libraries like zod/yup for standard API routes.
 */
export function validateParams(
  data: any,
  schema: ValidationSchema,
): { success: true; data: any } | { success: false; error: string } {
  if (!data || typeof data !== 'object') {
    return { success: false, error: 'Request body must be a valid JSON object' }
  }

  const result: any = {}
  
  for (const [key, rule] of Object.entries(schema)) {
    const val = data[key]
    
    if (val === undefined || val === null || val === '') {
      if (rule.required) {
        return { success: false, error: `Missing required field: ${key}` }
      }
      continue
    }

    if (rule.type === 'number') {
      const num = Number(val)
      if (isNaN(num)) {
        return { success: false, error: `Field "${key}" must be a number` }
      }
      if (rule.min !== undefined && num < rule.min) {
        return { success: false, error: `Field "${key}" must be at least ${rule.min}` }
      }
      if (rule.max !== undefined && num > rule.max) {
        return { success: false, error: `Field "${key}" must be at most ${rule.max}` }
      }
      result[key] = num
    } else if (rule.type === 'string') {
      const str = String(val).trim()
      if (rule.regex && !rule.regex.test(str)) {
        return { success: false, error: `Field "${key}" is invalid` }
      }
      if (rule.enum && !rule.enum.includes(str)) {
        return { success: false, error: `Field "${key}" must be one of: ${rule.enum.join(', ')}` }
      }
      result[key] = str
    } else if (rule.type === 'boolean') {
      result[key] = String(val) === 'true' || val === true
    }
  }

  return { success: true, data: result }
}

