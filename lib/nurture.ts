/**
 * Calculator lead nurture queue.
 * Appends a trigger record to nurture-queue.json so the cron job can pick it up.
 * Day 0 email is sent immediately by the lead capture route.
 */
import fs from 'fs'
import path from 'path'

const QUEUE_PATH = path.join(process.cwd(), 'lib/data/nurture-queue.json')
const MAX_ENTRIES = 5000

export interface NurtureEntry {
  id: string
  phone: string
  email: string
  name: string
  calculator: string
  capturedAt: string
  day2SentAt?: string
  day7SentAt?: string
}

function readQueue(): NurtureEntry[] {
  try {
    return JSON.parse(fs.readFileSync(QUEUE_PATH, 'utf8'))
  } catch {
    return []
  }
}

function writeQueue(entries: NurtureEntry[]): void {
  // Trim oldest entries if over cap to prevent unbounded growth
  const trimmed = entries.slice(-MAX_ENTRIES)
  fs.writeFileSync(QUEUE_PATH, JSON.stringify(trimmed, null, 2))
}

export function enqueueNurture(
  phone: string,
  email: string,
  name: string,
  calculator: string,
): void {
  try {
    const queue = readQueue()
    // Deduplicate by phone + calculator within 7 days
    const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000
    const exists = queue.some(
      (e) =>
        e.phone === phone &&
        e.calculator === calculator &&
        new Date(e.capturedAt).getTime() > sevenDaysAgo,
    )
    if (exists) return

    queue.push({
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      phone,
      email,
      name,
      calculator,
      capturedAt: new Date().toISOString(),
    })
    writeQueue(queue)
  } catch {
    // Non-fatal — nurture is best-effort
  }
}

export function getPendingDay2(): NurtureEntry[] {
  const twoDaysAgo = Date.now() - 2 * 24 * 60 * 60 * 1000
  const threeDaysAgo = Date.now() - 3 * 24 * 60 * 60 * 1000
  return readQueue().filter(
    (e) =>
      !e.day2SentAt &&
      new Date(e.capturedAt).getTime() <= twoDaysAgo &&
      new Date(e.capturedAt).getTime() >= threeDaysAgo,
  )
}

export function getPendingDay7(): NurtureEntry[] {
  const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000
  const eightDaysAgo = Date.now() - 8 * 24 * 60 * 60 * 1000
  return readQueue().filter(
    (e) =>
      !e.day7SentAt &&
      new Date(e.capturedAt).getTime() <= sevenDaysAgo &&
      new Date(e.capturedAt).getTime() >= eightDaysAgo,
  )
}

export function markDay2Sent(id: string): void {
  try {
    const queue = readQueue()
    const entry = queue.find((e) => e.id === id)
    if (entry) {
      entry.day2SentAt = new Date().toISOString()
      writeQueue(queue)
    }
  } catch {}
}

export function markDay7Sent(id: string): void {
  try {
    const queue = readQueue()
    const entry = queue.find((e) => e.id === id)
    if (entry) {
      entry.day7SentAt = new Date().toISOString()
      writeQueue(queue)
    }
  } catch {}
}
