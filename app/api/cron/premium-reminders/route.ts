import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { Resend } from 'resend'
import { ADVISOR_PHONE } from '@/lib/constants'

const SCHEDULE_PATH = path.join(process.cwd(), 'lib/data/premium-schedule.json')

interface PremiumEntry {
  email: string
  name: string
  policyNumber: string
  dueDate: string   // YYYY-MM-DD
  amount: number
}

function daysUntil(dateStr: string): number {
  const due = new Date(dateStr)
  const now = new Date()
  return Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
}

function formatAmount(n: number): string {
  return new Intl.NumberFormat('en-IN').format(n)
}

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const resendKey = process.env.RESEND_API_KEY
  if (!resendKey) {
    return NextResponse.json({ skipped: 'RESEND_API_KEY not configured' })
  }

  let schedule: PremiumEntry[] = []
  try { schedule = JSON.parse(fs.readFileSync(SCHEDULE_PATH, 'utf8')) } catch { /* empty */ }

  if (!schedule.length) {
    return NextResponse.json({ sent: 0, note: 'No entries in premium-schedule.json' })
  }

  const resend = new Resend(resendKey)
  const sent: string[] = []
  const errors: string[] = []

  for (const entry of schedule) {
    const days = daysUntil(entry.dueDate)
    if (days !== 7 && days !== 1) continue

    const isUrgent = days === 1
    const subject = isUrgent
      ? `🔔 URGENT: LIC Premium Due Tomorrow — ₹${formatAmount(entry.amount)}`
      : `Reminder: LIC Premium Due in 7 Days — ₹${formatAmount(entry.amount)}`

    const body = `<div style="font-family:sans-serif;max-width:600px;margin:0 auto;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden">
      <div style="background:#111827;padding:24px;text-align:center">
        <h1 style="color:#F59E0B;font-size:18px;margin:0;font-weight:700">PODDAR WEALTH MANAGEMENT</h1>
      </div>
      <div style="padding:24px">
        <p style="color:#111827;font-size:16px">Dear <strong>${entry.name}</strong>,</p>
        <p style="color:#374151">Your LIC premium of <strong>₹${formatAmount(entry.amount)}</strong> for policy <strong>${entry.policyNumber}</strong> is due on <strong>${entry.dueDate}</strong>.</p>
        ${isUrgent ? '<p style="color:#DC2626;font-weight:bold">⚠️ This is due tomorrow. Please pay today to avoid lapse.</p>' : ''}
        <div style="background:#FEF3C7;border:1px solid #F59E0B;border-radius:8px;padding:16px;margin:16px 0">
          <p style="margin:0;color:#92400E;font-size:14px">💻 Pay online: <a href="https://poddarwealth.com/pay-premium" style="color:#D97706">poddarwealth.com/pay-premium</a></p>
          <p style="margin:8px 0 0;color:#92400E;font-size:14px">📞 Need help? Call Ajay sir: <strong>${ADVISOR_PHONE}</strong></p>
        </div>
        <p style="color:#6B7280;font-size:12px">This is an automated reminder from Poddar Wealth Management. To unsubscribe, reply to this email.</p>
      </div>
    </div>`

    try {
      await resend.emails.send({
        from: 'Poddar Wealth <noreply@poddarwealth.com>',
        to: entry.email,
        subject,
        html: body,
      })
      sent.push(entry.email)
    } catch (err) {
      console.error('[premium-reminders] email error', err)
      errors.push(entry.email)
    }
  }

  return NextResponse.json({ sent: sent.length, errors: errors.length, sentTo: sent })
}
