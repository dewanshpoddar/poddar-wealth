/**
 * /api/track — lightweight activity tracker
 *
 * Captures calculator usage, plan views, and other non-lead activity
 * into dedicated Google Sheets tabs via the main webhook.
 *
 * POST body:
 * {
 *   event:     'calc_run' | 'calc_unlock' | 'calc_share' | 'plan_view' | 'blueprint_run'
 *   sheetName: 'Premium Calculator' | 'Wealth Blueprint' | 'Plan Views'
 *   data:      { ...event-specific fields }
 * }
 */

import { NextResponse } from 'next/server'

const WEBHOOK = process.env.GOOGLE_SHEETS_WEBHOOK_URL ?? ''

const clean = (s: any, max = 300): string =>
  String(s ?? '').slice(0, max).replace(/[\r\n\t]/g, ' ').trim()

// Sheet column definitions per event type
const SHEET_HEADERS: Record<string, string[]> = {
  'Premium Calculator': [
    'Timestamp', 'Event', 'Plan No.', 'Plan Name', 'Category',
    'Age', 'Sum Assured', 'Term', 'PPT', 'Mode',
    'Gender', 'Annual Premium', 'Total Paid', 'Maturity Value',
    'Client Name', 'Unlock Mobile', 'Session'
  ],
  'Wealth Blueprint': [
    'Timestamp', 'Name', 'Mobile',
    'Age', 'Monthly Income', 'Employment', 'City Tier',
    'Married', 'Children', 'Aged Parents',
    'Life Cover (L)', 'Health Cover (L)', 'Home Loan (L)', 'Other Loans (L)',
    'Equity (L)', 'Debt Savings (L)', 'Real Estate (L)',
    'Retirement Age', 'Goals',
    'HLV (L)', 'Protection Gap (L)', 'Gap %',
    'Ret Corpus (Cr)', 'Total Projected (Cr)', 'Surplus/Deficit (Cr)',
    'Edu Corpus (L)', 'Net Worth (L)', 'Blueprint Score',
    'Monthly Recommended'
  ],
  'Plan Views': [
    'Timestamp', 'Plan No.', 'Plan Name', 'Category', 'Source Page', 'Session'
  ],
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { event, sheetName, data } = body

    if (!event || !sheetName || !data) {
      return NextResponse.json({ error: 'event, sheetName, data required' }, { status: 400 })
    }

    const now = new Date().toISOString()

    // Build row based on sheetName
    let row: any[] = []

    if (sheetName === 'Premium Calculator') {
      row = [
        now,
        clean(event),
        clean(data.planNo),
        clean(data.planName),
        clean(data.category),
        data.age ?? '',
        clean(data.sa),
        data.term ?? '',
        data.ppt ?? '',
        clean(data.mode),
        clean(data.gender),
        clean(data.annualPremium),
        clean(data.totalPaid),
        clean(data.maturityValue),
        clean(data.clientName),
        clean(data.unlockMobile),
        clean(data.session),
      ]
    } else if (sheetName === 'Wealth Blueprint') {
      const p = data.profile ?? {}
      const bp = data.blueprint ?? {}
      row = [
        now,
        clean(data.name), clean(data.mobile),
        p.age, p.monthlyIncome, clean(p.employment), clean(p.cityTier),
        p.isMarried, p.children, p.hasAgedParents,
        p.existingLifeCoverL, p.existingHealthL, p.homeLoanL, p.otherLoansL,
        p.equityL, p.debtSavingsL, p.realEstateL,
        p.retirementAge, (p.goals ?? []).join('; '),
        bp.hlvL, bp.protectionGapL, bp.protectionGapPct,
        bp.retCorpusCrore, bp.totalProjectedCrore, bp.retSurplusDeficitCrore,
        bp.totalEduL, bp.netWorthL, bp.score,
        bp.totalMonthly,
      ]
    } else if (sheetName === 'Plan Views') {
      row = [
        now,
        clean(data.planNo),
        clean(data.planName),
        clean(data.category),
        clean(data.sourcePage),
        clean(data.session),
      ]
    } else {
      // Generic fallback — just dump key-value pairs
      row = [now, clean(event), clean(sheetName), JSON.stringify(data).slice(0, 500)]
    }

    if (!WEBHOOK) return NextResponse.json({ success: true, note: 'no webhook configured' })

    await fetch(WEBHOOK, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sheetName, headers: SHEET_HEADERS[sheetName], row, intent: event }),
      signal: AbortSignal.timeout(5000),
    }).catch(() => {})

    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}
