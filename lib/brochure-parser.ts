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
 * Parses term numbers from a token list, handling two formats:
 *   Format A (Plan 715): plain integers   "15  25  35"
 *   Format B (Plan 736): term(ppt) pairs  "16 (10)  21 (15)  25 (16)"
 * Returns only the policy term (first number), filtering 5–40.
 */
function parseTermsFromTokens(tokens: string[]): number[] {
  const terms: number[] = []
  for (const t of tokens) {
    // Strip trailing parenthetical: "16(10)" or "21 (15)" → "16"
    const clean = t.replace(/\(\d+\).*$/, '').trim()
    if (/^\d{1,2}$/.test(clean)) {
      const n = parseInt(clean)
      if (n >= 5 && n <= 40) terms.push(n)
    }
  }
  return terms
}

/**
 * Finds "Sample Illustrative Premium" tables in LIC brochures.
 * Converts premium amounts to rate_per_1000 = premium / (SA / 1000).
 *
 * Handles two header layouts:
 *   Plan 715: "AGE  15  25  35"  (terms on same line as AGE)
 *   Plan 736: "Age  Policy Term/PPT..."  then "16 (10)  21 (15)  25 (16)"
 *             (terms on a separate row 1-3 lines below AGE)
 */
function extractIllustrationRates(pages: PDFPage[]): TabularRateGrid {
  const rates: TabularRateGrid = {}

  for (const page of pages) {
    const rows = buildRowMap(page)
    const ys = yKeys(rows)

    for (let i = 0; i < ys.length; i++) {
      const tokens = lineTokens(rows, ys[i])
      const line = tokens.join(' ')

      if (!/\bAGE\b/i.test(line)) continue

      // Try terms on same line first (Plan 715 format)
      let termNums = parseTermsFromTokens(tokens)

      // If not found, scan next 3 rows for a term header line (Plan 736 format)
      let termRowOffset = 0
      if (termNums.length < 2) {
        for (let k = 1; k <= 3 && i + k < ys.length; k++) {
          const nextTokens = lineTokens(rows, ys[i + k])
          const candidate = parseTermsFromTokens(nextTokens)
          if (candidate.length >= 2) {
            termNums = candidate
            termRowOffset = k
            break
          }
        }
      }
      if (termNums.length < 2) continue

      // Find SA amount: scan up to 8 lines above for currency text
      let saAmount = 0
      for (let j = Math.max(0, i - 8); j < i; j++) {
        const ctx = lineTokens(rows, ys[j]).join(' ')
        const laMatch = ctx.match(/(\d+(?:\.\d+)?)\s*lakh/i)
        if (laMatch) { saAmount = parseFloat(laMatch[1]) * 100000; break }
        const crMatch = ctx.match(/Rs\.?\s*([\d,]+)/i)
        if (crMatch) {
          const v = parseIndianNumber(crMatch[1])
          if (v >= 50000 && v <= 50000000) { saAmount = v; break }
        }
      }
      // Also check the AGE line itself and nearby lines for SA
      if (saAmount === 0) {
        for (let j = i; j <= Math.min(i + termRowOffset + 1, ys.length - 1); j++) {
          const ctx = lineTokens(rows, ys[j]).join(' ')
          const laMatch = ctx.match(/(\d+(?:\.\d+)?)\s*lakh/i)
          if (laMatch) { saAmount = parseFloat(laMatch[1]) * 100000; break }
        }
      }
      if (saAmount === 0) saAmount = 200000  // default 2L

      const divisor = saAmount / 1000

      // Data rows start after the term header row
      const dataStart = i + termRowOffset + 1
      let misses = 0
      for (let j = dataStart; j < ys.length && misses < 4; j++) {
        const dataTokens = lineTokens(rows, ys[j])
        if (dataTokens.length < 2) { misses++; continue }

        const age = parseInt(dataTokens[0])
        if (age < 8 || age > 70) { misses++; continue }

        const premTokens = dataTokens.slice(1).filter(t => /^[\d,]+$/.test(t))
        if (premTokens.length < 1) { misses++; continue }

        const premiums = premTokens.map(parseIndianNumber)
        if (premiums.some(p => p <= 0 || p >= 10000000)) { misses++; continue }

        misses = 0
        rates[age] = rates[age] ?? {}
        termNums.forEach((term, idx) => {
          if (premiums[idx] !== undefined && premiums[idx] > 0) {
            rates[age][term] = Math.round((premiums[idx] / divisor) * 1000) / 1000
          }
        })
      }

      if (Object.keys(rates).length > 0) return rates
    }
  }

  return rates
}

// ── 2. GSV factor extraction ───────────────────────────────────────────────────

/**
 * LIC brochures use two GSV table orientations:
 *
 * Format A — Plan 715 style (term-as-row, year-as-column):
 *   Rows:    Policy Term (35, 34, ..., 15) — left column
 *   Columns: Policy Year (1, 2, ..., 35)   — footer row below data
 *   → many rows, many columns, triangular shape
 *
 * Format B — Plan 736 style (year-as-row, term-as-column):
 *   Header:  "16 (10)  21 (15)  25 (16)"  — terms above data
 *   Rows:    Policy Year (1, 2, ..., 25)   — left column
 *   Columns: Policy Term (16, 21, 25)
 *   → few columns, clean rectangle
 *
 * Both return { term → { policyYear → gsvPct } }
 */
function extractGsvStructured(pages: PDFPage[]): Record<number, GSVFactorGrid> {
  // Try Format B first (more common in recent LIC brochures)
  const formatB = extractGsvFormatB(pages)
  if (Object.keys(formatB).length > 0) return formatB

  // Fall back to Format A
  return extractGsvFormatA(pages)
}

/** Format B: header row has terms, data rows have year → pct values */
function extractGsvFormatB(pages: PDFPage[]): Record<number, GSVFactorGrid> {
  const result: Record<number, GSVFactorGrid> = {}

  for (const page of pages) {
    const rows = buildRowMap(page)
    const ys = yKeys(rows)

    const allTokens = ys.flatMap(y => lineTokens(rows, y))
    const pctCount = allTokens.filter(t => /^\d{1,3}\.\d+%$/.test(t)).length
    if (pctCount < 5) continue

    // Find header row: contains 2-5 terms in range 10-40
    // Handles "16 (10)  21 (15)  25 (16)" — parseTermsFromTokens strips the (PPT)
    for (let i = 0; i < ys.length; i++) {
      const headerTokens = lineTokens(rows, ys[i])
      const colTerms = parseTermsFromTokens(headerTokens)
      if (colTerms.length < 2 || colTerms.length > 8) continue
      // All terms must be >= 10 to distinguish from policy years
      if (colTerms.some(t => t < 10)) continue

      // Scan rows below: first token = policy year (1-40), rest = pct values
      let hits = 0
      for (let j = i + 1; j < ys.length; j++) {
        const dataTokens = lineTokens(rows, ys[j])
        if (dataTokens.length < 2) continue

        const yr = parseInt(dataTokens[0])
        if (isNaN(yr) || yr < 1 || yr > 40) continue

        const pcts = dataTokens.slice(1)
          .filter(t => /^\d{1,3}\.?\d*%?$/.test(t))
          .map(t => parseFloat(t.replace('%', '')))
          .filter(p => !isNaN(p) && p >= 0 && p <= 100)

        if (pcts.length < 1) continue

        hits++
        colTerms.forEach((term, idx) => {
          if (pcts[idx] !== undefined) {
            result[term] = result[term] ?? {}
            result[term][yr] = pcts[idx]
          }
        })
      }

      if (hits >= 3) return result  // found a valid table on this page
      // Reset if this header didn't pan out
      for (const t of colTerms) delete result[t]
    }
  }

  return result
}

/** Format A: footer row has years, data rows have term → pct values */
function extractGsvFormatA(pages: PDFPage[]): Record<number, GSVFactorGrid> {
  const result: Record<number, GSVFactorGrid> = {}

  for (const page of pages) {
    const rows = buildRowMap(page)
    const ys = yKeys(rows)

    const allTokens = ys.flatMap(y => lineTokens(rows, y))
    const pctCount = allTokens.filter(t => /^\d{1,3}\.\d+%$/.test(t)).length
    if (pctCount < 10) continue

    // Find footer row: sequential small integers starting near 1 (policy years)
    let colYears: number[] = []
    for (const y of ys) {
      const nums = lineTokens(rows, y)
        .filter(t => /^\d{1,2}$/.test(t))
        .map(Number)
        .filter(n => n >= 1 && n <= 40)
      if (nums.length >= 5 && nums[0] <= 3) {
        colYears = [...new Set([...colYears, ...nums])].sort((a, b) => a - b)
      }
    }
    if (colYears.length === 0) {
      colYears = Array.from({ length: 35 }, (_, i) => i + 1)
    }

    // Data rows: first token is policy term (10-40), rest are pct values
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
