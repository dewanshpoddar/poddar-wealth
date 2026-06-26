import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { clean as c, isValidPhone as ivp, appendToCsv as acsv, pushToSheets as pts } from '@/lib/server-utils'
import { adminNotify } from '@/lib/admin-notify'
import { logger } from '@/lib/logger'
import { checkRateLimit } from '@/lib/rate-limit'
import { ADVISOR_PHONE } from '@/lib/constants'
import { enqueueNurture } from '@/lib/nurture'

const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL

const CALCULATOR_SLUGS = [
  'premium', 'maturity', 'life-insurance',
  'retirement', 'loan', 'surrender-value', 'policy-health',
] as const
type CalcSlug = (typeof CALCULATOR_SLUGS)[number]

const CALC_LABELS: Record<CalcSlug, string> = {
  premium: 'Premium Calculator',
  maturity: 'Maturity Calculator',
  'life-insurance': 'Life Insurance Need Calculator',
  retirement: 'Retirement Calculator',
  loan: 'Loan Against Policy Calculator',
  'surrender-value': 'Surrender Value Calculator',
  'policy-health': 'Policy Health Score',
}

const HEADERS = [
  'Timestamp', 'Name', 'Phone', 'Email', 'DOB',
  'Calculator', 'Inputs', 'Result', 'Source',
  'UTM Source', 'UTM Medium',
]

// Per-phone rate limit: 3 submissions/hour (in-memory)
const phoneRateMap = new Map<string, { count: number; windowStart: number }>()
const PHONE_LIMIT = 3
const PHONE_WINDOW = 60 * 60 * 1000

function checkPhoneLimit(phone: string): boolean {
  const now = Date.now()
  const entry = phoneRateMap.get(phone)
  if (!entry || now - entry.windowStart > PHONE_WINDOW) {
    phoneRateMap.set(phone, { count: 1, windowStart: now })
    return true
  }
  if (entry.count >= PHONE_LIMIT) return false
  entry.count++
  return true
}

function formatResultSummary(calculator: CalcSlug, result: Record<string, unknown>): string {
  const fmt = (n: unknown) =>
    typeof n === 'number'
      ? n >= 100000
        ? `₹${(n / 100000).toFixed(1)}L`
        : `₹${n.toLocaleString('en-IN')}`
      : String(n ?? '')

  switch (calculator) {
    case 'premium':
      return result.premium ? `Estimated premium: ${fmt(result.premium)}/year` : ''
    case 'maturity':
      return result.maturityValue ? `Maturity value: ${fmt(result.maturityValue)}` : ''
    case 'life-insurance':
      return result.coverageNeed ? `Recommended coverage: ${fmt(result.coverageNeed)}` : ''
    case 'retirement':
      return result.corpus ? `Target corpus: ${fmt(result.corpus)}` : ''
    case 'loan':
      return result.maxLoan ? `Loan available: ${fmt(result.maxLoan)}` : ''
    case 'surrender-value':
      return result.surrenderValue ? `Surrender value: ${fmt(result.surrenderValue)}` : ''
    case 'policy-health':
      return result.score ? `Policy health score: ${result.score}/100` : ''
    default:
      return ''
  }
}

function formatInputSummary(inputs: Record<string, unknown>): string {
  const parts: string[] = []
  if (inputs.age) parts.push(`Age: ${inputs.age}`)
  if (inputs.sumAssured) parts.push(`SA: ₹${Number(inputs.sumAssured).toLocaleString('en-IN')}`)
  if (inputs.term || inputs.policyTerm) parts.push(`Term: ${inputs.term ?? inputs.policyTerm}yr`)
  if (inputs.plan) parts.push(`Plan: ${inputs.plan}`)
  if (inputs.frequency || inputs.mode) parts.push(`Mode: ${inputs.frequency ?? inputs.mode}`)
  return parts.join(', ')
}

export async function POST(request: Request) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
  const { allowed } = await checkRateLimit(ip, 10, 60, 'rl-calc-lead')
  if (!allowed) {
    return NextResponse.json({ success: false, error: 'Too many submissions' }, { status: 429 })
  }

  let data: Record<string, unknown>
  try {
    data = await request.json()
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid JSON' }, { status: 400 })
  }

  const {
    phone, name, email, dob, calculator,
    inputs, result, timestamp, source, utm,
  } = data as {
    phone?: string
    name?: string
    email?: string
    dob?: string
    calculator?: string
    inputs?: Record<string, unknown>
    result?: Record<string, unknown>
    timestamp?: string
    source?: string
    utm?: Record<string, string>
  }

  // Validate phone
  if (!phone || !ivp(phone)) {
    return NextResponse.json({ success: false, error: 'Invalid phone number' }, { status: 400 })
  }

  // Validate email if provided
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ success: false, error: 'Invalid email address' }, { status: 400 })
  }

  // Validate calculator slug
  if (!calculator || !CALCULATOR_SLUGS.includes(calculator as CalcSlug)) {
    return NextResponse.json({ success: false, error: 'Unknown calculator type' }, { status: 400 })
  }

  const cleanPhone = c(phone, 10)

  // Per-phone rate limit
  if (!checkPhoneLimit(cleanPhone)) {
    return NextResponse.json({ success: false, error: 'Too many submissions' }, { status: 429 })
  }

  const calcSlug = calculator as CalcSlug
  const cleanName = c(name ?? '', 100)
  const cleanEmail = c(email ?? '', 200)
  const cleanDob = c(dob ?? '', 20)
  const cleanSource = c(source ?? '', 100)
  const utmSource = c(utm?.utm_source ?? '', 100)
  const utmMedium = c(utm?.utm_medium ?? '', 100)
  const safeInputs = JSON.stringify(inputs ?? {})
  const safeResult = JSON.stringify(result ?? {})
  const ts = c(timestamp ?? new Date().toISOString(), 30)

  const row = [
    ts, cleanName, cleanPhone, cleanEmail, cleanDob,
    calcSlug, safeInputs, safeResult, cleanSource,
    utmSource, utmMedium,
  ]

  try {
    // 1. CSV backup
    acsv('calculator-leads.csv', HEADERS, row)

    // 2. Google Sheets
    if (webhookUrl) {
      await pts(
        webhookUrl,
        { row, intent: 'calculator-lead', sheetName: 'Calculator Leads', headers: HEADERS },
        '/api/leads/calculator',
        'Calculator lead Sheets push failed — saved to CSV',
      )
    }

    // 3. Email (only if email provided)
    if (cleanEmail && process.env.RESEND_API_KEY) {
      const resend = new Resend(process.env.RESEND_API_KEY)
      const calcLabel = CALC_LABELS[calcSlug]
      const resultLine = formatResultSummary(calcSlug, result ?? {})
      const inputLine = formatInputSummary(inputs ?? {})
      const greeting = cleanName ? cleanName : 'ji'

      await resend.emails.send({
        from: 'Poddar Wealth <noreply@poddarwealth.com>',
        to: cleanEmail,
        subject: `Your ${calcLabel} Result — Poddar Wealth`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden;">
            <div style="background: #111827; padding: 28px 24px; text-align: center;">
              <h1 style="color: #F59E0B; font-size: 20px; margin: 0; font-weight: 700; letter-spacing: 0.05em;">
                PODDAR WEALTH MANAGEMENT
              </h1>
              <p style="color: #9CA3AF; font-size: 11px; margin: 6px 0 0; letter-spacing: 0.1em; text-transform: uppercase;">
                Excellence in Protection Since 1994
              </p>
            </div>
            <div style="padding: 32px 24px;">
              <h2 style="color: #111827; font-size: 20px; margin: 0 0 16px;">
                Namaste ${greeting},
              </h2>
              <p style="color: #4B5563; line-height: 1.7; margin: 0 0 24px;">
                Here is your calculation summary from the <strong>${calcLabel}</strong>.
              </p>
              <div style="background: #F9FAFB; border-left: 4px solid #F59E0B; border-radius: 4px; padding: 16px 20px; margin-bottom: 24px;">
                <p style="color: #111827; font-weight: 700; font-size: 16px; margin: 0 0 8px;">${calcLabel}</p>
                ${resultLine ? `<p style="color: #059669; font-size: 15px; font-weight: 600; margin: 0 0 6px;">${resultLine}</p>` : ''}
                ${inputLine ? `<p style="color: #6B7280; font-size: 13px; margin: 0;">${inputLine}</p>` : ''}
              </div>
              <p style="color: #4B5563; line-height: 1.7; margin: 0 0 24px;">
                Want to discuss this with our advisor and find the best plan for your family?
              </p>
              <div style="background: #F9FAFB; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
                <p style="color: #374151; font-size: 14px; margin: 0 0 12px; font-weight: 600;">Get in touch with Ajay sir</p>
                <p style="color: #4B5563; font-size: 14px; margin: 0 0 8px;">
                  📞 Call: <a href="tel:+91${ADVISOR_PHONE}" style="color: #F59E0B; font-weight: 700;">+91 ${ADVISOR_PHONE}</a>
                </p>
                <p style="color: #4B5563; font-size: 14px; margin: 0;">
                  💬 <a href="https://wa.me/91${ADVISOR_PHONE}" style="color: #25D366; font-weight: 700;">WhatsApp Now</a>
                </p>
              </div>
              <p style="color: #6B7280; font-size: 13px; line-height: 1.6; margin: 0;">
                <strong style="color: #111827;">Ajay Kumar Poddar</strong><br>
                MDRT USA Member | 31 Years Experience<br>
                Poddar Wealth Management, Gorakhpur
              </p>
            </div>
            <div style="background: #F3F4F6; padding: 16px 24px; text-align: center; border-top: 1px solid #E5E7EB;">
              <p style="color: #9CA3AF; font-size: 11px; margin: 0;">
                Poddar Wealth Management · AD Mall Compound, Vijay Chowk, Gorakhpur 273001
              </p>
              <p style="color: #9CA3AF; font-size: 11px; margin: 4px 0 0;">
                IRDAI Authorised Insurance Agent · MDRT Member · Chairman's Club Awardee
              </p>
            </div>
          </div>
        `,
      }).catch((err: unknown) => {
        logger.warn('/api/leads/calculator', 'Resend email failed', { error: String(err) })
      })
    }

    // 4. Enqueue nurture emails (Day 2 + Day 7) if email provided
    if (cleanEmail) {
      enqueueNurture(cleanPhone, cleanEmail, cleanName, calcSlug)
    }

    logger.info('/api/leads/calculator', 'Calculator lead captured', { phone: cleanPhone, calculator: calcSlug })
    return NextResponse.json({ success: true, message: 'Saved' })
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error)
    logger.error('/api/leads/calculator', 'Calculator lead crashed', { error: msg })
    adminNotify({
      type: 'API_ERROR', severity: 'error', route: '/api/leads/calculator',
      message: `Calculator lead crashed: ${msg}`,
      detail: msg,
    }).catch(() => {})
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
