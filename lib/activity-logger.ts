import fs from 'fs'
import path from 'path'
import crypto from 'crypto'

const LOG_PATH = path.join(process.cwd(), 'lib/data/admin-activity.json')
const MAX_ENTRIES = 100

interface ActivityEntry {
  timestamp: string
  route: string
  method: string
  ip_hash: string
  status: number
}

function readLog(): ActivityEntry[] {
  try {
    const raw = fs.readFileSync(LOG_PATH, 'utf8')
    return JSON.parse(raw)
  } catch {
    return []
  }
}

export function logActivity(
  route: string,
  method: string,
  status: number,
  ip = 'unknown',
) {
  try {
    const entries = readLog()
    const ip_hash = crypto.createHash('sha256').update(ip).digest('hex').slice(0, 12)
    entries.unshift({ timestamp: new Date().toISOString(), route, method, status, ip_hash })
    const trimmed = entries.slice(0, MAX_ENTRIES)
    fs.writeFileSync(LOG_PATH, JSON.stringify(trimmed, null, 2))
  } catch {
    // Non-fatal - never crash a route because of logging
  }
}
