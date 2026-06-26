import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { ADVISOR_PHONE } from '@/lib/constants'
import {
  getPendingDay2,
  getPendingDay7,
  markDay2Sent,
  markDay7Sent,
} from '@/lib/nurture'

const CALC_LABELS: Record<string, string> = {
  premium: 'Premium Calculator',
  maturity: 'Maturity Calculator',
  'life-insurance': 'Life Insurance Need Calculator',
  retirement: 'Retirement Calculator',
  loan: 'Loan Against Policy Calculator',
  'surrender-value': 'Surrender Value Calculator',
  'policy-health': 'Policy Health Score',
}

const CALC_SERVICE: Record<string, string> = {
  premium: '/services/life-insurance',
  maturity: '/services/savings',
  'life-insurance': '/services/protection',
  retirement: '/services/retirement',
  loan: '/services/life-insurance',
  'surrender-value': '/services/life-insurance',
  'policy-health': '/services',
}

function calcUrl(calc: string): string {
  const slug = calc === 'life-insurance' ? 'life-insurance'
    : calc === 'surrender-value' ? 'surrender-value'
    : calc === 'policy-health' ? 'policy-health'
    : calc
  return `https://poddarwealth.com/calculators/${slug}`
}

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET?.trim()
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json({ skipped: true, reason: 'RESEND_API_KEY not set' })
  }

  const resend = new Resend(process.env.RESEND_API_KEY)
  let day2Sent = 0
  let day7Sent = 0

  // Day 2: follow-up
  const day2 = getPendingDay2()
  for (const entry of day2) {
    const label = CALC_LABELS[entry.calculator] ?? entry.calculator
    const calcLink = calcUrl(entry.calculator)
    const greeting = entry.name ? entry.name : 'ji'

    try {
      await resend.emails.send({
        from: 'Poddar Wealth <noreply@poddarwealth.com>',
        to: entry.email,
        subject: `Did you have questions about your ${label} result?`,
        html: `
          <div style="font-family:sans-serif;max-width:600px;margin:0 auto;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden">
            <div style="background:#111827;padding:24px;text-align:center">
              <h1 style="color:#F59E0B;font-size:18px;margin:0;font-weight:700">PODDAR WEALTH MANAGEMENT</h1>
            </div>
            <div style="padding:28px 24px">
              <h2 style="color:#111827;font-size:18px;margin:0 0 12px">Namaste ${greeting},</h2>
              <p style="color:#4B5563;line-height:1.7;margin:0 0 16px">
                Two days ago you used our <strong>${label}</strong>. Did you have any questions about your result?
              </p>
              <p style="color:#4B5563;line-height:1.7;margin:0 0 24px">
                You can go back to the calculator anytime —
                <a href="${calcLink}" style="color:#D97706;font-weight:600">view your ${label}</a>.
              </p>
              <p style="color:#4B5563;line-height:1.7;margin:0 0 24px">
                Or speak directly with Ajay sir who can help you understand your numbers and find the right plan:
              </p>
              <div style="background:#F9FAFB;border-radius:8px;padding:16px;margin-bottom:24px">
                <p style="color:#4B5563;font-size:14px;margin:0 0 8px">
                  📞 <a href="tel:+91${ADVISOR_PHONE}" style="color:#F59E0B;font-weight:700">+91 ${ADVISOR_PHONE}</a>
                </p>
                <p style="color:#4B5563;font-size:14px;margin:0">
                  💬 <a href="https://wa.me/91${ADVISOR_PHONE}" style="color:#25D366;font-weight:700">WhatsApp Ajay sir</a>
                </p>
              </div>
              <p style="color:#9CA3AF;font-size:12px;margin:0">
                Ajay Kumar Poddar · MDRT Member · 31 Years Experience
              </p>
            </div>
          </div>
        `,
      })
      markDay2Sent(entry.id)
      day2Sent++
    } catch {
      // Non-fatal — continue with next entry
    }
  }

  // Day 7: service recommendation
  const day7 = getPendingDay7()
  for (const entry of day7) {
    const label = CALC_LABELS[entry.calculator] ?? entry.calculator
    const serviceLink = `https://poddarwealth.com${CALC_SERVICE[entry.calculator] ?? '/services'}`
    const greeting = entry.name ? entry.name : 'ji'

    try {
      await resend.emails.send({
        from: 'Poddar Wealth <noreply@poddarwealth.com>',
        to: entry.email,
        subject: `Ajay ji can help you choose the right plan`,
        html: `
          <div style="font-family:sans-serif;max-width:600px;margin:0 auto;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden">
            <div style="background:#111827;padding:24px;text-align:center">
              <h1 style="color:#F59E0B;font-size:18px;margin:0;font-weight:700">PODDAR WEALTH MANAGEMENT</h1>
            </div>
            <div style="padding:28px 24px">
              <h2 style="color:#111827;font-size:18px;margin:0 0 12px">Namaste ${greeting},</h2>
              <p style="color:#4B5563;line-height:1.7;margin:0 0 16px">
                A week ago you used our <strong>${label}</strong>. If you are still thinking about the right plan,
                Ajay Kumar Poddar — MDRT Member with 31 years of experience — can help you decide.
              </p>
              <div style="text-align:center;margin:0 0 24px">
                <a href="${serviceLink}"
                   style="display:inline-block;background:#F59E0B;color:#111827;padding:14px 28px;border-radius:50px;text-decoration:none;font-weight:700;font-size:14px">
                  Explore Plans →
                </a>
              </div>
              <div style="background:#F9FAFB;border-radius:8px;padding:16px;margin-bottom:24px">
                <p style="color:#4B5563;font-size:14px;margin:0 0 8px">
                  📞 <a href="tel:+91${ADVISOR_PHONE}" style="color:#F59E0B;font-weight:700">+91 ${ADVISOR_PHONE}</a>
                </p>
                <p style="color:#4B5563;font-size:14px;margin:0">
                  💬 <a href="https://wa.me/91${ADVISOR_PHONE}" style="color:#25D366;font-weight:700">WhatsApp Ajay sir</a>
                </p>
              </div>
              <p style="color:#9CA3AF;font-size:12px;margin:0">
                Ajay Kumar Poddar · MDRT Member · 31 Years Experience
              </p>
            </div>
          </div>
        `,
      })
      markDay7Sent(entry.id)
      day7Sent++
    } catch {
      // Non-fatal
    }
  }

  return NextResponse.json({ success: true, day2Sent, day7Sent })
}
