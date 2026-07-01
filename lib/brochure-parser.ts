/**
 * LIC brochure PDF parser.
 * Stage 1: regex rule-based extraction of premium rate tables.
 * Stage 2: if <5 rows found, Groq LLM fallback with raw PDF text.
 */
import type { TabularRateGrid, GSVFactorGrid } from '@/lib/lic-engine/types'

export interface ParsedBrochure {
  rates: TabularRateGrid     // age → { term → ratePerThousand }
  gsvFactors: GSVFactorGrid  // policyYear → gsvPercent
  source: 'rule' | 'llm' | 'empty'
  rowCount: number
  rawText: string
}

// ── PDF text extraction ───────────────────────────────────────────────────────

export async function parseBrochurePdf(url: string): Promise<ParsedBrochure> {
  const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } })
  if (!res.ok) throw new Error(`PDF fetch failed: ${res.status} ${url}`)

  const buffer = await res.arrayBuffer()
  const pdfMod   = await import('pdf-parse')
  const pdfParse = (pdfMod as unknown as { default: (buf: Buffer) => Promise<{ text: string }> }).default ?? pdfMod
  const parsed   = await (pdfParse as (buf: Buffer) => Promise<{ text: string }>)(Buffer.from(buffer))
  const rawText  = parsed.text ?? ''

  // Stage 1 — rule-based
  const rates     = extractPremiumRates(rawText)
  const gsvFactors = extractGsvFactors(rawText)
  const rowCount  = countRateRows(rates)

  if (rowCount >= 5) {
    return { rates, gsvFactors, source: 'rule', rowCount, rawText }
  }

  // Stage 2 — Groq LLM fallback (truncate text to ~6000 chars to fit context)
  const truncated = rawText.slice(0, 6000)
  const llmResult = await llmExtract(truncated)
  const llmRows   = countRateRows(llmResult.rates)

  return {
    rates:      llmRows > 0 ? llmResult.rates : rates,
    gsvFactors: Object.keys(llmResult.gsvFactors).length > 0 ? llmResult.gsvFactors : gsvFactors,
    source:     llmRows > 0 ? 'llm' : 'empty',
    rowCount:   Math.max(rowCount, llmRows),
    rawText,
  }
}

// ── Stage 1: regex extraction ─────────────────────────────────────────────────

function countRateRows(rates: TabularRateGrid): number {
  return Object.values(rates).reduce((sum, terms) => sum + Object.keys(terms).length, 0)
}

/**
 * Extracts premium rate tables from LIC brochure text.
 * LIC tables typically look like:
 *   Age  10yrs  15yrs  20yrs  25yrs  30yrs
 *   18   55.60  40.30  32.10  27.80  24.50
 *   25   58.90  43.20  34.50  29.60  25.90
 */
function extractPremiumRates(text: string): TabularRateGrid {
  const rates: TabularRateGrid = {}

  // Normalize whitespace
  const lines = text.replace(/\r\n/g, '\n').split('\n').map(l => l.trim()).filter(Boolean)

  // Detect header row: a row with "Age" followed by year numbers or term numbers
  // Pattern: "Age  10  15  20  25  30" or "Age  10 Years  15 Years  20 Years"
  const headerPattern = /^Age\b(.+)/i
  const termFromHeaderPattern = /(\d{1,2})\s*(?:yrs?|years?)?/gi

  let headerTerms: number[] = []
  let inTable = false
  let consecutiveMisses = 0

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]

    if (!inTable) {
      const headerMatch = headerPattern.exec(line)
      if (headerMatch) {
        const terms: number[] = []
        let m: RegExpExecArray | null
        while ((m = termFromHeaderPattern.exec(headerMatch[1])) !== null) {
          const t = parseInt(m[1])
          if (t >= 5 && t <= 40) terms.push(t)
        }
        termFromHeaderPattern.lastIndex = 0
        if (terms.length >= 2) {
          headerTerms = terms
          inTable = true
          consecutiveMisses = 0
        }
      }
      continue
    }

    // In table: expect "age rate1 rate2 rate3..."
    const nums = line.match(/\d+\.?\d*/g)?.map(Number)
    if (!nums || nums.length < 2) {
      consecutiveMisses++
      if (consecutiveMisses > 4) { inTable = false; headerTerms = [] }
      continue
    }

    const age = nums[0]
    if (age < 0 || age > 75) { consecutiveMisses++; continue }

    const rateValues = nums.slice(1)
    if (rateValues.length < headerTerms.length) { consecutiveMisses++; continue }

    // Rates are per ₹1000 SA — sanity check: should be between 10 and 200
    if (rateValues.some(r => r < 5 || r > 500)) { consecutiveMisses++; continue }

    consecutiveMisses = 0
    rates[age] = rates[age] ?? {}
    headerTerms.forEach((term, idx) => {
      if (rateValues[idx] !== undefined) {
        rates[age][term] = rateValues[idx]
      }
    })
  }

  return rates
}

/**
 * Extract GSV (Guaranteed Surrender Value) factors.
 * LIC tables: "Policy Year  GSV Factor (%)"  3→30%, 5→50%, etc.
 */
function extractGsvFactors(text: string): GSVFactorGrid {
  const gsv: GSVFactorGrid = {}

  // Pattern: row like "3   30%" or "3  30.00"
  const gsvPattern = /\b(\d{1,2})\s+(\d{2,3}(?:\.\d+)?)\s*%?/g
  const lines = text.split('\n')

  for (const line of lines) {
    if (!/gsv|guaranteed\s*surrender|surrender\s*value/i.test(line)) continue
    let m: RegExpExecArray | null
    while ((m = gsvPattern.exec(line)) !== null) {
      const yr  = parseInt(m[1])
      const pct = parseFloat(m[2])
      if (yr >= 3 && yr <= 30 && pct >= 20 && pct <= 100) {
        gsv[yr] = pct
      }
    }
    gsvPattern.lastIndex = 0
  }

  return gsv
}

// ── Stage 2: Groq LLM fallback ────────────────────────────────────────────────

async function llmExtract(pdfText: string): Promise<{ rates: TabularRateGrid; gsvFactors: GSVFactorGrid }> {
  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) return { rates: {}, gsvFactors: {} }

  const prompt = `You are parsing a LIC India insurance brochure. Extract the premium rate table and GSV factor table from the text below.

Return ONLY a valid JSON object in this exact format (no markdown, no explanation):
{
  "rates": { "<age>": { "<term>": <ratePerThousand> } },
  "gsvFactors": { "<policyYear>": <gsvPercent> }
}

Where:
- rates: age (integer) → policy term (integer) → premium rate per ₹1000 SA (number, e.g. 42.5)
- gsvFactors: policy year (integer) → GSV percentage (number, e.g. 30 for 30%)
- If no rate table is found, return empty objects {}

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
    if (!res.ok) return { rates: {}, gsvFactors: {} }
    const data = await res.json() as { choices: { message: { content: string } }[] }
    const content = data.choices[0]?.message?.content?.trim() ?? ''
    const json = JSON.parse(content) as { rates?: TabularRateGrid; gsvFactors?: GSVFactorGrid }
    return { rates: json.rates ?? {}, gsvFactors: json.gsvFactors ?? {} }
  } catch {
    return { rates: {}, gsvFactors: {} }
  }
}
