/**
 * LIC brochure PDF parser — structured JSON extraction (pdf2json).
 *
 * Extracts two data types from LIC sales brochures:
 *   1. Illustration rates: "Sample Illustrative Premium" table → 3-4 age×term anchor points
 *   2. GSV factors: Guaranteed Surrender Value tables → full term×policyYear grid
 *
 * Note: LIC sales brochures do NOT contain full age×term premium rate grids.
 * Those are in separate LIC Agent Rate Books (future data source).
 * The illustration table gives 3-4 anchor points usable for bilinear interpolation.
 */
import type { TabularRateGrid, GSVFactorGrid } from '@/lib/lic-engine/types'

export interface ParsedBrochure {
  rates: TabularRateGrid                        // age → { term → ratePerThousand }
  gsvByTerm: Record<number, GSVFactorGrid>      // term → { policyYear → gsvPercent }
  gsvFactors: GSVFactorGrid                     // term-agnostic fallback
  source: 'rule' | 'llm' | 'empty'
  rowCount: number
  rawText: string
}

// ── pdf2json types ─────────────────────────────────────────────────────────────

interface PDFTextItem {
  x: number
  y: number
  R?: Array<{ T: string }>
}

interface PDFPage {
  Texts?: PDFTextItem[]
}

interface PDFData {
  Pages?: PDFPage[]
}

interface PDFParserInstance {
  on(event: 'pdfParser_dataError', cb: (err: { parserError: Error }) => void): void
  on(event: 'pdfParser_dataReady', cb: () => void): void
  parseBuffer(buf: Buffer): void
  getRawTextContent(): string
  data?: PDFData
}

// ── Row reconstruction helpers ─────────────────────────────────────────────────

type RowMap = Record<number, Array<{ x: number; str: string }>>

function buildRowMap(page: PDFPage): RowMap {
  const rows: RowMap = {}
  for (const text of (page.Texts ?? [])) {
    const y = Math.round(text.y * 2) / 2  // 0.5-unit Y buckets
    const str = (text.R ?? []).map(r => {
      try { return decodeURIComponent(r.T) } catch { return r.T }
    }).join('').trim()
    if (!str) continue
    ;(rows[y] = rows[y] ?? []).push({ x: text.x, str })
  }
  for (const row of Object.values(rows)) row.sort((a, b) => a.x - b.x)
  return rows
}

function yKeys(rows: RowMap): number[] {
  return Object.keys(rows).map(Number).sort((a, b) => a - b)
}

function lineTokens(rows: RowMap, y: number): string[] {
  return (rows[y] ?? []).map(i => i.str).filter(Boolean)
}

// Strip commas from Indian number format: "16,229" → "16229"
function parseIndianNumber(s: string): number {
  return parseFloat(s.replace(/,/g, ''))
}

// ── PDF text extraction ────────────────────────────────────────────────────────

async function loadPDFPages(buffer: Buffer): Promise<PDFPage[]> {
  const PDFParser = (await import('pdf2json')).default as unknown as new (ctx?: null, verbosity?: number) => PDFParserInstance
  return new Promise((resolve, reject) => {
    const parser = new PDFParser(null, 1)
    parser.on('pdfParser_dataError', ({ parserError }) => reject(parserError))
    parser.on('pdfParser_dataReady', () => resolve(parser.data?.Pages ?? []))
    parser.parseBuffer(buffer)
  })
}

// ── 1. Illustration table extraction ──────────────────────────────────────────

/**
 * Finds "Sample Illustrative Premium" tables in LIC brochures.
 * These show annual premiums (in ₹) for a stated SA at 3-4 ages × 3-4 terms.
 * Converts to rate_per_1000 = premium / (SA / 1000).
 *
 * Example (Plan 715):
 *   SA = ₹2,00,000
 *   AGE  15    25    35
 *   20   16229  9339  6517
 *   → rate[20][15] = 16229/200 = 81.145
 */
function extractIllustrationRates(pages: PDFPage[]): TabularRateGrid {
  const rates: TabularRateGrid = {}

  for (const page of pages) {
    const rows = buildRowMap(page)
    const ys = yKeys(rows)

    for (let i = 0; i < ys.length; i++) {
      const tokens = lineTokens(rows, ys[i])
      const line = tokens.join(' ')

      // Look for header row containing "AGE" and policy term numbers
      const hasAge = /\bAGE\b/i.test(line)
      if (!hasAge) continue

      // Extract term numbers from this header row
      const termNums = tokens
        .filter(t => /^\d{1,2}$/.test(t))
        .map(Number)
        .filter(n => n >= 5 && n <= 40)
      if (termNums.length < 2) continue

      // Find SA amount: scan up to 8 lines above for currency text
      let saAmount = 0
      for (let j = Math.max(0, i - 8); j < i; j++) {
        const ctx = lineTokens(rows, ys[j]).join(' ')
        // Match "2 lakh", "₹2,00,000", "200000", etc.
        const laMatch = ctx.match(/(\d+(?:\.\d+)?)\s*lakh/i)
        if (laMatch) { saAmount = parseFloat(laMatch[1]) * 100000; break }
        const crMatch = ctx.match(/₹?\s*([\d,]+)\s*(?:\/\s*-)?/)
        if (crMatch) {
          const v = parseIndianNumber(crMatch[1])
          if (v >= 50000 && v <= 50000000) { saAmount = v; break }
        }
      }
      if (saAmount === 0) saAmount = 200000  // default 2L if not found

      const divisor = saAmount / 1000  // convert to per-₹1000 rate

      // Parse data rows below the header
      let misses = 0
      for (let j = i + 1; j < ys.length && misses < 4; j++) {
        const dataTokens = lineTokens(rows, ys[j])
        if (dataTokens.length < 2) { misses++; continue }

        const age = parseInt(dataTokens[0])
        if (age < 18 || age > 70) { misses++; continue }

        // Parse premium values (may be comma-formatted like "16,229" or split across tokens)
        // Collect all numeric tokens after the age
        const premTokens = dataTokens.slice(1).filter(t => /^[\d,]+$/.test(t))
        if (premTokens.length < 1) { misses++; continue }

        const premiums = premTokens.map(parseIndianNumber)
        // Validate: premiums should be > 0 and reasonable (100 – 500000 range per ₹1000)
        const valid = premiums.every(p => p > 0 && p < 10000000)
        if (!valid) { misses++; continue }

        misses = 0
        rates[age] = rates[age] ?? {}
        termNums.forEach((term, idx) => {
          if (premiums[idx] !== undefined && premiums[idx] > 0) {
            rates[age][term] = Math.round((premiums[idx] / divisor) * 1000) / 1000
          }
        })
      }

      // Found at least one row — no need to scan more pages
      if (Object.keys(rates).length > 0) return rates
    }
  }

  return rates
}

// ── 2. GSV factor extraction ───────────────────────────────────────────────────

/**
 * Extracts GSV factor tables from LIC brochures.
 *
 * LIC brochure GSV tables have this structure:
 *   - Rows indexed by Policy Term (e.g., 35, 34, ..., 15) — leftmost column
 *   - Columns indexed by Policy Year (1, 2, 3, ...) — found as footer row
 *   - Cell values are percentages (e.g., "51.11%", "30.00%")
 *
 * Returns: { term → { policyYear → gsvPct } }
 *
 * Detects pages where majority of text items are percentage values.
 */
function extractGsvStructured(pages: PDFPage[]): Record<number, GSVFactorGrid> {
  const result: Record<number, GSVFactorGrid> = {}

  for (const page of pages) {
    const rows = buildRowMap(page)
    const ys = yKeys(rows)

    // Count percentage items to identify GSV table pages
    const allTokens = ys.flatMap(y => lineTokens(rows, y))
    const pctCount = allTokens.filter(t => /^\d{1,3}\.\d+%$/.test(t)).length
    if (pctCount < 10) continue  // not a GSV page

    // Find policy year header row (contains sequential small integers like 1 2 3 4...)
    let colYears: number[] = []
    for (const y of ys) {
      const nums = lineTokens(rows, y)
        .filter(t => /^\d{1,2}$/.test(t))
        .map(Number)
        .filter(n => n >= 1 && n <= 40)
      // Header should have sequential years starting near 1
      if (nums.length >= 5 && nums[0] <= 3) {
        colYears = [...(colYears.length ? colYears : []), ...nums]
      }
    }
    // Deduplicate and sort
    colYears = [...new Set(colYears)].sort((a, b) => a - b)
    if (colYears.length === 0) {
      // Fallback: policy years are positional 1..N
      colYears = Array.from({ length: 35 }, (_, i) => i + 1)
    }

    // Extract data rows: first token is policy term (integer 10-40), rest are pct values
    for (const y of ys) {
      const tokens = lineTokens(rows, y)
      if (tokens.length < 2) continue

      const term = parseInt(tokens[0])
      if (isNaN(term) || term < 10 || term > 40) continue

      const pcts = tokens.slice(1)
        .filter(t => /^\d{1,3}\.?\d*%?$/.test(t))
        .map(t => parseFloat(t.replace('%', '')))
        .filter(p => !isNaN(p) && p >= 0 && p <= 100)

      if (pcts.length < 2) continue

      result[term] = result[term] ?? {}
      pcts.forEach((pct, idx) => {
        const yr = colYears[idx] ?? (idx + 1)
        result[term][yr] = pct
      })
    }
  }

  return result
}

/**
 * Term-agnostic GSV fallback: flatten gsvByTerm by averaging across terms,
 * or fall back to a minimal scan of any percentage-followed-by-year pattern.
 */
function flattenGsvFactors(gsvByTerm: Record<number, GSVFactorGrid>): GSVFactorGrid {
  const merged: Record<number, number[]> = {}
  for (const yearMap of Object.values(gsvByTerm)) {
    for (const [yr, pct] of Object.entries(yearMap)) {
      const y = Number(yr)
      ;(merged[y] = merged[y] ?? []).push(pct)
    }
  }
  const result: GSVFactorGrid = {}
  for (const [yr, pcts] of Object.entries(merged)) {
    result[Number(yr)] = Math.round((pcts.reduce((s, p) => s + p, 0) / pcts.length) * 100) / 100
  }
  return result
}

// ── Main export ────────────────────────────────────────────────────────────────

export async function parseBrochurePdf(url: string): Promise<ParsedBrochure> {
  const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } })
  if (!res.ok) throw new Error(`PDF fetch failed: ${res.status} ${url}`)

  const buffer = Buffer.from(await res.arrayBuffer())
  const pages = await loadPDFPages(buffer)

  // Raw text for LLM fallback (getRawTextContent via re-parse)
  const rawText = pages
    .flatMap(p => (p.Texts ?? []).map(t =>
      (t.R ?? []).map(r => { try { return decodeURIComponent(r.T) } catch { return r.T } }).join('')
    ))
    .join(' ')
    .slice(0, 8000)

  // Stage 1 — structured extraction
  const rates     = extractIllustrationRates(pages)
  const gsvByTerm = extractGsvStructured(pages)
  const gsvFactors = flattenGsvFactors(gsvByTerm)

  const rateRows = Object.values(rates).reduce((s, t) => s + Object.keys(t).length, 0)
  const gsvRows  = Object.values(gsvByTerm).reduce((s, y) => s + Object.keys(y).length, 0)
  const rowCount = rateRows + gsvRows

  if (rowCount >= 3) {
    return { rates, gsvByTerm, gsvFactors, source: 'rule', rowCount, rawText }
  }

  // Stage 2 — Groq LLM fallback
  const llmResult = await llmExtract(rawText)
  const llmRateRows = Object.values(llmResult.rates).reduce((s, t) => s + Object.keys(t).length, 0)
  const llmGsvRows  = Object.values(llmResult.gsvByTerm ?? {}).reduce((s, y) => s + Object.keys(y).length, 0)
  const llmTotal = llmRateRows + llmGsvRows

  if (llmTotal > 0) {
    const merged = {
      rates:      llmRateRows > 0 ? llmResult.rates : rates,
      gsvByTerm:  llmGsvRows  > 0 ? (llmResult.gsvByTerm ?? {}) : gsvByTerm,
      gsvFactors: Object.keys(llmResult.gsvFactors).length > 0 ? llmResult.gsvFactors : gsvFactors,
    }
    return { ...merged, source: 'llm', rowCount: Math.max(rowCount, llmTotal), rawText }
  }

  return { rates, gsvByTerm, gsvFactors, source: 'empty', rowCount, rawText }
}

// ── Groq LLM fallback ─────────────────────────────────────────────────────────

async function llmExtract(pdfText: string): Promise<{
  rates: TabularRateGrid
  gsvFactors: GSVFactorGrid
  gsvByTerm: Record<number, GSVFactorGrid>
}> {
  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) return { rates: {}, gsvFactors: {}, gsvByTerm: {} }

  const prompt = `You are parsing a LIC India insurance brochure. Extract:
1. "Sample Illustrative Premium" table: age × term → annual premium (in ₹). Note the SA amount stated.
   Convert to rate_per_1000 = premium / (SA / 1000).
2. GSV factor table: policy term × policy year → surrender value percentage.

Return ONLY valid JSON:
{
  "rates": { "<age>": { "<term>": <ratePerThousand> } },
  "gsvByTerm": { "<term>": { "<policyYear>": <gsvPercent> } },
  "gsvFactors": { "<policyYear>": <gsvPercent> }
}

PDF text:
${pdfText}`

  try {
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: process.env.GROQ_MODEL ?? 'llama-3.3-70b-versatile',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0,
        max_tokens: 2000,
      }),
    })
    if (!res.ok) return { rates: {}, gsvFactors: {}, gsvByTerm: {} }
    const data = await res.json() as { choices: Array<{ message: { content: string } }> }
    const content = data.choices[0]?.message?.content?.trim() ?? ''
    const json = JSON.parse(content) as {
      rates?: TabularRateGrid
      gsvFactors?: GSVFactorGrid
      gsvByTerm?: Record<number, GSVFactorGrid>
    }
    return {
      rates:      json.rates      ?? {},
      gsvFactors: json.gsvFactors ?? {},
      gsvByTerm:  json.gsvByTerm  ?? {},
    }
  } catch {
    return { rates: {}, gsvFactors: {}, gsvByTerm: {} }
  }
}
