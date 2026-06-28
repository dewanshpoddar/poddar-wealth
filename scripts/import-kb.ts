/**
 * Import poddar_ji_knowledge_base.json → Supabase lic_plans table
 * Run: npx tsx scripts/import-kb.ts
 * Requires: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local
 */

import * as fs from 'fs'
import * as path from 'path'
import * as dotenv from 'dotenv'
import { createClient } from '@supabase/supabase-js'

dotenv.config({ path: path.resolve(__dirname, '../.env.local') })

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY)

// ─── Helpers ─────────────────────────────────────────────────────────────────

const UNKNOWN_PATTERNS = [
  /^unknown/i,
  /^n\/a/i,
  /^no known/i,
  /^not publicly/i,
  /^requires brochure/i,
  /^plan withdrawn/i,
  /^currently active/i,
  /^no limit/i,
]

function isUnknown(val: unknown): boolean {
  if (val === null || val === undefined || val === '') return true
  return UNKNOWN_PATTERNS.some(p => p.test(String(val).trim()))
}

function nullIfUnknown(val: unknown): string | null {
  return isUnknown(val) ? null : String(val).trim()
}

function parsePlanNo(val: unknown): number | null {
  if (isUnknown(val)) return null
  const n = parseFloat(String(val))
  return isNaN(n) ? null : Math.round(n)
}

function parseVersion(val: unknown): number {
  if (!val) return 1
  const m = String(val).match(/\d+/)
  return m ? parseInt(m[0]) : 1
}

function parseDate(val: unknown): string | null {
  if (isUnknown(val)) return null
  const s = String(val).trim()
  if (s.toLowerCase().includes('currently active')) return null
  const d = new Date(s)
  return isNaN(d.getTime()) ? null : d.toISOString().split('T')[0]
}

function parseBool(val: unknown, truePattern = /^yes/i): boolean {
  if (isUnknown(val)) return false
  return truePattern.test(String(val).trim())
}

function parseFloat2(val: unknown): number | null {
  if (isUnknown(val)) return null
  const m = String(val).match(/[\d.]+/)
  return m ? parseFloat(m[0]) : null
}

function parseInt2(val: unknown): number | null {
  const f = parseFloat2(val)
  return f !== null ? Math.round(f) : null
}

/** Extract first ₹N number from bonus rate strings like "₹37-46 (15yr=37...)" → 37 */
function parseBonusRate(val: unknown): number | null {
  if (isUnknown(val)) return null
  const s = String(val)
  const m = s.match(/₹\s*([\d.]+)/)
  return m ? parseFloat(m[1]) : null
}

/** Extract first float from loan interest strings like "9.50% p.a." → 9.5 */
function parseLoanRate(val: unknown): number | null {
  if (isUnknown(val)) return null
  const m = String(val).match(/([\d.]+)\s*%/)
  return m ? parseFloat(m[1]) : null
}

/** Parse IRR range "5.0% - 6.5%" → { min: 5.0, max: 6.5 } */
function parseIRR(val: unknown): { min: number | null; max: number | null } {
  if (isUnknown(val)) return { min: null, max: null }
  const nums = String(val).match(/[\d.]+/g)
  if (!nums || nums.length < 2) return { min: null, max: null }
  return { min: parseFloat(nums[0]), max: parseFloat(nums[1]) }
}

/** Parse grace/free-look/revival days, take max number found */
function parseDays(val: unknown): number | null {
  if (isUnknown(val)) return null
  const nums = String(val).match(/\d+/g)
  if (!nums) return null
  return Math.max(...nums.map(Number))
}

/** Parse GA rate "Yes - ₹50 per ₹1000 SA per year" → 50.0 */
function parseGARate(val: unknown): number | null {
  if (isUnknown(val)) return null
  const s = String(val)
  if (!/yes/i.test(s)) return null
  const m = s.match(/₹\s*([\d.]+)/)
  return m ? parseFloat(m[1]) : null
}

/** Parse death_floor_pct "105% of total premiums paid" → 105.0 */
function parseDeathFloor(val: unknown): number | null {
  if (isUnknown(val)) return null
  const m = String(val).match(/([\d.]+)\s*%/)
  return m ? parseFloat(m[1]) : null
}

// ─── Transform one plan row ───────────────────────────────────────────────────

function transform(p: Record<string, unknown>) {
  const planNo = parsePlanNo(p['Plan No'])
  const maxSa = parseFloat2(p['max_sa_int'])
  const irr = parseIRR(p['Indicative IRR Range'])
  const loanMaxPct = parseFloat2(p['loan_max_pct'])

  return {
    plan_no:                    planNo,
    uin:                        nullIfUnknown(p['UIN']),
    name:                       String(p['Product Name'] ?? '').trim(),
    product_family:             nullIfUnknown(p['Product Family']),
    version:                    parseVersion(p['Version']),
    is_current_version:         false, // set in second pass

    category:                   nullIfUnknown(p['Category'])?.toLowerCase() ?? null,
    subcategory:                nullIfUnknown(p['Subcategory']),
    status:                     String(p['Status'] ?? 'withdrawn').toLowerCase() as 'active' | 'withdrawn',
    is_serviceable:             parseBool(p['Serviceable']),
    is_group:                   /group/i.test(String(p['Type'] ?? '')),

    launch_date:                parseDate(p['Active From']),
    withdrawal_date:            parseDate(p['Active To']),
    irdai_circular:             nullIfUnknown(p['IRDAI Master Circular Ref']),

    min_age:                    parseInt2(p['min_age_int']),
    max_age:                    parseInt2(p['max_age_int']),
    min_sa:                     parseFloat2(p['min_sa_int']),
    max_sa:                     maxSa === 999999999 ? null : maxSa,
    min_term:                   null, // in Policy Term Options text — not machine-readable
    max_term:                   null,
    min_ppt:                    null,
    max_ppt:                    null,

    premium_type:               nullIfUnknown(p['Premium Type']),
    premium_mode:               nullIfUnknown(p['Premium Mode']),

    death_formula:              nullIfUnknown(p['Death Benefit Formula']),
    death_multiplier_bsa:       parseFloat2(p['death_multiplier_bsa_pct']),
    death_multiplier_ap:        parseFloat2(p['death_multiplier_ap_x']),
    death_floor_pct:            parseDeathFloor(p['Death Benefit Min Guarantee']),
    post_maturity_death_benefit: nullIfUnknown(p['Post Maturity Death Benefit']),

    maturity_formula:           nullIfUnknown(p['Maturity Benefit Formula']),
    has_srb:                    parseBool(p['Simple Reversionary Bonus']),
    has_fab:                    parseBool(p['Final Additional Bonus']),
    has_guaranteed_add:         parseBool(p['Guaranteed Additions']),
    ga_rate_per_1000:           parseGARate(p['Guaranteed Additions']),
    has_loyalty_add:            parseBool(p['Loyalty Addition']),
    survival_benefit:           nullIfUnknown(p['Survival Benefit']),

    gsv_start_year:             parseInt2(p['gsv_start_year']),
    gsv_formula:                nullIfUnknown(p['GSV Formula']),
    has_ssv:                    parseBool(p['SSV Available']),

    loan_max_pct:               loanMaxPct,
    loan_interest_rate:         parseLoanRate(p['Loan Interest Rate']),

    section_80c:                parseBool(p['Section 80C']),
    section_10_10d:             parseBool(p['Section 10_10D']),
    gst_first_yr_pct:           parseFloat2(p['gst_first_yr_pct']),
    gst_renewal_pct:            parseFloat2(p['gst_renewal_pct']),

    bonus_rate_fy25:            parseBonusRate(p['Bonus Rate FY2024-25 (per ₹1000 SA)']),
    fab_rate:                   parseBonusRate(p['FAB Rate']),
    bonus_circular_url:         nullIfUnknown(p['LIC Bonus Circular URL']),

    irr_min:                    irr.min,
    irr_max:                    irr.max,

    supersedes_uin:             nullIfUnknown(p['Supersedes UIN']),
    superseded_by_uin:          nullIfUnknown(p['Superseded By UIN']),

    available_riders:           nullIfUnknown(p['Available Riders']),
    free_look_days:             parseDays(p['Free Look Period']) ?? 30,
    revival_years:              parseDays(p['Revival Period']) ?? 5,
    grace_days:                 parseDays(p['Grace Period']) ?? 30,

    brochure_url:               nullIfUnknown(p['Official Brochure URL']),
    annual_report_ref:          nullIfUnknown(p['Annual Report URL']),
  }
}

// ─── is_current_version logic ────────────────────────────────────────────────

function setCurrentVersions(rows: ReturnType<typeof transform>[]) {
  // Group by plan_no (null plan_nos each get their own "group" via UIN)
  const groups = new Map<string, typeof rows>()

  for (const row of rows) {
    const key = row.plan_no !== null ? `plan_no:${row.plan_no}` : `uin:${row.uin}`
    if (!groups.has(key)) groups.set(key, [])
    groups.get(key)!.push(row)
  }

  for (const group of groups.values()) {
    if (group.length === 1) {
      group[0].is_current_version = true
      continue
    }
    // Prefer active rows; among actives pick highest version
    const actives = group.filter(r => r.status === 'active')
    if (actives.length > 0) {
      const best = actives.reduce((a, b) => (a.version ?? 1) >= (b.version ?? 1) ? a : b)
      best.is_current_version = true
    } else {
      // All withdrawn — pick most recent withdrawal_date
      const sorted = group.sort((a, b) => {
        if (!a.withdrawal_date) return 1
        if (!b.withdrawal_date) return -1
        return b.withdrawal_date.localeCompare(a.withdrawal_date)
      })
      sorted[0].is_current_version = true
    }
  }

  return rows
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const kbPath = path.resolve(__dirname, '../lib/data/poddar_ji_knowledge_base.json')
  const raw = JSON.parse(fs.readFileSync(kbPath, 'utf-8'))
  const plans: Record<string, unknown>[] = raw['plans']

  console.log(`\nLoaded ${plans.length} plans from KB`)

  // Transform
  let rows = plans.map(transform)
  rows = setCurrentVersions(rows)

  const currentCount = rows.filter(r => r.is_current_version).length
  console.log(`is_current_version: ${currentCount} rows flagged`)

  // Insert in batches of 50
  let inserted = 0, skipped = 0, errored = 0
  const errors: string[] = []
  const BATCH = 50

  for (let i = 0; i < rows.length; i += BATCH) {
    const batch = rows.slice(i, i + BATCH)
    const { error } = await supabase
      .from('lic_plans')
      .upsert(batch, { onConflict: 'uin', ignoreDuplicates: false })

    if (error) {
      // Try row-by-row to isolate failures
      for (const row of batch) {
        const { error: rowErr } = await supabase
          .from('lic_plans')
          .upsert(row, { onConflict: 'uin', ignoreDuplicates: false })
        if (rowErr) {
          errored++
          errors.push(`UIN ${row.uin} (Plan ${row.plan_no}): ${rowErr.message}`)
        } else {
          inserted++
        }
      }
    } else {
      inserted += batch.length
    }

    process.stdout.write(`\r  Progress: ${Math.min(i + BATCH, rows.length)}/${rows.length}`)
  }

  console.log('\n')

  // Audit log entry
  await supabase.from('admin_audit_log').insert({
    table_name: 'lic_plans',
    record_id: 'bulk_import',
    action: 'insert',
    new_value: { total: plans.length, inserted, skipped, errored },
    source: 'import_script',
    notes: `KB import v1.0 — poddar_ji_knowledge_base.json (${plans.length} plans)`,
  })

  // Report
  console.log('─'.repeat(50))
  console.log(`✅ Inserted / upserted : ${inserted}`)
  console.log(`⏭  Skipped (NULL UIN)  : ${skipped}`)
  console.log(`❌ Errored             : ${errored}`)
  if (errors.length) {
    console.log('\nErrors:')
    errors.forEach(e => console.log('  ', e))
  }
  console.log('─'.repeat(50))
}

main().catch(err => {
  console.error('Fatal:', err)
  process.exit(1)
})
