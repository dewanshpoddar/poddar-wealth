import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

// Optional: set GOOGLE_SHEETS_BLUEPRINT_WEBHOOK_URL in .env.local to also
// push blueprint data to a dedicated Google Sheets tab
const webhookUrl = process.env.GOOGLE_SHEETS_BLUEPRINT_WEBHOOK_URL

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

    // 1. Always write to local CSV
    const sanitize = (v: any) => `"${String(v ?? '').replace(/"/g, '""')}"`
    const line = row.map(sanitize).join(',') + '\n'
    const filePath = path.join(process.cwd(), 'blueprints.csv')
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, HEADERS.join(',') + '\n')
    }
    fs.appendFileSync(filePath, line)

    // 2. Push to Google Sheets (optional, non-fatal)
    if (webhookUrl) {
      const ctrl = new AbortController()
      const tid = setTimeout(() => ctrl.abort(), 5000)
      try {
        await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ row, intent: 'Wealth Blueprint' }),
          signal: ctrl.signal,
        })
      } catch (e) {
        console.error('Blueprint webhook failed (non-fatal):', e)
      } finally {
        clearTimeout(tid)
      }
    }

    // 3. Also create a standard lead entry (name + phone + intent)
    try {
      const leadsPath = path.join(process.cwd(), 'leads.csv')
      const leadLine = [timestamp, name ?? '', '', phone ?? '', '', '', 'Wealth Blueprint Calculator', '', 'Blueprint Lead', '', ''].map(
        (v: any) => `"${String(v ?? '').replace(/"/g, '""')}"`
      ).join(',') + '\n'
      if (fs.existsSync(leadsPath)) {
        fs.appendFileSync(leadsPath, leadLine)
      }
    } catch { /* non-fatal */ }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Blueprint save error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
