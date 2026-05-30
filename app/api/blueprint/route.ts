import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { adminNotify } from '@/lib/admin-notify'
import { clean, isValidPhone, csvSanitize, appendToCsv, pushToSheets } from '@/lib/server-utils'

const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL

const HEADERS = [
  'Timestamp', 'Name', 'Phone',
  // Profile
  'Age', 'MonthlyIncome', 'Employment', 'CityTier',
  // Family
  'Married', 'Children', 'ChildAges', 'HasAgedParents',
  // Current shield
  'LifeCoverL', 'HealthCoverL', 'HomeLoanL', 'OtherLoansL',
  // Wealth
  'EquityL', 'DebtSavingsL', 'RealEstateL', 'RetirementAge', 'Goals',
  // Calculated blueprint
  'HLV_L', 'ProtectionGapL', 'ProtectionGapPct',
  'RetCorpusCrore', 'TotalProjectedCrore', 'RetSurplusDeficitCrore',
  'TotalEduCorpusL', 'NetWorthL', 'BlueprintScore',
  'TotalMonthlyRecommended',
]

export async function POST(request: Request) {
  try {
    const { name, phone, profile: p, blueprint: bp } = await request.json()

    // Validate name and phone before writing
    if (!name || clean(name, 100).length < 2) {
      return NextResponse.json({ error: 'Invalid name' }, { status: 400 })
    }
    if (!phone || !isValidPhone(phone)) {
      return NextResponse.json({ error: 'Invalid phone — must be 10 digits' }, { status: 400 })
    }
    const timestamp = new Date().toISOString()

    const row = [
      timestamp,
      name ?? '', phone ?? '',
      p.age, p.monthlyIncome, p.employment, p.cityTier,
      p.isMarried, p.children, (p.childAges ?? []).slice(0, p.children).join(';'), p.hasAgedParents,
      p.existingLifeCoverL, p.existingHealthL, p.homeLoanL, p.otherLoansL,
      p.equityL, p.debtSavingsL, p.realEstateL, p.retirementAge, (p.goals ?? []).join(';'),
      bp.hlvL, bp.protectionGapL, bp.protectionGapPct,
      bp.retCorpusCrore, bp.totalProjectedCrore, bp.retSurplusDeficitCrore,
      bp.totalEduL, bp.netWorthL, bp.score,
      bp.totalMonthly,
    ]

    // 1. Always write to local CSV (CSV injection prevention inside appendToCsv)
    appendToCsv('blueprints.csv', HEADERS, row)

    // 2. Push to Google Sheets (optional, non-fatal)
    if (webhookUrl) {
      await pushToSheets(
        webhookUrl,
        { row, intent: 'Wealth Blueprint', sheetName: 'Wealth Blueprint', headers: HEADERS },
        '/api/blueprint',
        'Blueprint webhook sync failed — blueprint saved to CSV only',
      )
    }

    // 3. Also append a standard lead row to leads.csv if it already exists
    //    (does NOT create the file — leads.csv is owned by /api/leads)
    try {
      const leadsPath = path.join('/tmp', 'leads.csv')
      const leadRow = [timestamp, name ?? '', '', phone ?? '', '', '', 'Wealth Blueprint Calculator', '', 'Blueprint Lead', '', '']
      if (fs.existsSync(leadsPath)) {
        fs.appendFileSync(leadsPath, leadRow.map(csvSanitize).join(',') + '\n')
      }
    } catch { /* non-fatal */ }

    return NextResponse.json({ success: true })
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error)
    const stack = error instanceof Error ? (error.stack ?? msg) : msg
    console.error('Blueprint save error:', error)
    adminNotify({
      type: 'API_ERROR', severity: 'error', route: '/api/blueprint',
      message: `Blueprint submission crashed: ${msg}`,
      detail: stack,
    }).catch(() => {})
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
