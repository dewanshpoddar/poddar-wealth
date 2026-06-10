import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const RESULTS_PATH = path.join(process.cwd(), 'lib/data/ab-results.json')
const MAX_ENTRIES = 10000

interface ABResult {
  test: string
  variant: 'A' | 'B'
  event: string
  timestamp: string
}

function readResults(): ABResult[] {
  try {
    const raw = fs.readFileSync(RESULTS_PATH, 'utf8')
    const parsed: unknown = JSON.parse(raw)
    return Array.isArray(parsed) ? (parsed as ABResult[]) : []
  } catch {
    return []
  }
}

function writeResults(results: ABResult[]): void {
  fs.writeFileSync(RESULTS_PATH, JSON.stringify(results, null, 2))
}

export async function POST(request: Request): Promise<NextResponse<{ ok: boolean } | { error: string }>> {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  if (typeof body !== 'object' || body === null) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const { test, variant, event } = body as Record<string, unknown>

  if (typeof test !== 'string' || !test.trim()) {
    return NextResponse.json({ error: 'test name required' }, { status: 400 })
  }
  if (variant !== 'A' && variant !== 'B') {
    return NextResponse.json({ error: 'variant must be A or B' }, { status: 400 })
  }
  if (typeof event !== 'string' || !event.trim()) {
    return NextResponse.json({ error: 'event name required' }, { status: 400 })
  }

  const entry: ABResult = {
    test: test.slice(0, 100),
    variant,
    event: event.slice(0, 100),
    timestamp: new Date().toISOString(),
  }

  const results = readResults()
  results.push(entry)

  // Trim oldest entries if over limit
  const trimmed = results.length > MAX_ENTRIES ? results.slice(results.length - MAX_ENTRIES) : results

  try {
    writeResults(trimmed)
  } catch {
    // Non-fatal — file write may fail in serverless environments
  }

  return NextResponse.json({ ok: true })
}
