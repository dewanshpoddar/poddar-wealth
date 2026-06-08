import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { Resend } from 'resend'
import { ADVISOR_PHONE } from '@/lib/constants'

const DATES_PATH = path.join(process.cwd(), 'lib/data/client-dates.json')

interface ClientDate {
  email: string
  name: string
  birthday?: string            // MM-DD
  policyAnniversary?: string   // MM-DD
  policyStartYear?: number     // for calculating years
}

function isTodayMD(mmdd: string): boolean {
  const today = new Date()
  const [month, day] = mmdd.split('-').map(Number)
  return today.getMonth() + 1 === month && today.getDate() === day
}

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const resendKey = process.env.RESEND_API_KEY
  if (!resendKey) return NextResponse.json({ skipped: 'RESEND_API_KEY not configured' })

  let clients: ClientDate[] = []
  try { clients = JSON.parse(fs.readFileSync(DATES_PATH, 'utf8')) } catch { /* empty */ }

  if (!clients.length) return NextResponse.json({ sent: 0, note: 'No entries in client-dates.json' })

  const resend = new Resend(resendKey)
  const sent: string[] = []

  for (const client of clients) {
    const emails: Array<{ subject: string; html: string }> = []

    if (client.birthday && isTodayMD(client.birthday)) {
      emails.push({
        subject: `🎂 Happy Birthday, ${client.name}! From Poddar Wealth`,
        html: `<div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;text-align:center">
          <div style="font-size:48px">🎂</div>
          <h2 style="color:#D97706">Happy Birthday, ${client.name}ji!</h2>
          <p style="color:#374151">Wishing you good health, happiness, and financial security. May this year bring you and your family immense joy.</p>
          <p style="color:#374151">As your trusted advisor, Ajay sir is always here for you.<br><strong>${ADVISOR_PHONE}</strong></p>
          <p style="color:#6B7280;font-size:12px">With blessings — Ajay Kumar Poddar, Poddar Wealth Management</p>
        </div>`,
      })
    }

    if (client.policyAnniversary && isTodayMD(client.policyAnniversary)) {
      const years = client.policyStartYear ? new Date().getFullYear() - client.policyStartYear : null
      emails.push({
        subject: `🎉 Your Policy Anniversary — ${years ? `${years} Years` : 'A Milestone'} with Poddar Wealth`,
        html: `<div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px">
          <h2 style="color:#D97706">🎉 Policy Anniversary!</h2>
          <p style="color:#374151">Dear <strong>${client.name}</strong>,</p>
          <p style="color:#374151">Your policy turns <strong>${years ? `${years} year${years > 1 ? 's' : ''}` : 'another year'}</strong> old today. Congratulations on this milestone!</p>
          <p style="color:#374151">This is a great time for a free policy review — to ensure your coverage still matches your life situation.</p>
          <div style="background:#FEF3C7;border:1px solid #F59E0B;border-radius:8px;padding:16px;margin:16px 0">
            <p style="margin:0;color:#92400E">📞 Schedule your free review: <strong>${ADVISOR_PHONE}</strong></p>
          </div>
          <p style="color:#6B7280;font-size:12px">— Ajay Kumar Poddar, Poddar Wealth Management</p>
        </div>`,
      })
    }

    for (const mail of emails) {
      try {
        await resend.emails.send({
          from: 'Ajay Kumar Poddar <noreply@poddarwealth.com>',
          to: client.email,
          ...mail,
        })
        sent.push(`${client.email} (${mail.subject.split(' ').slice(0, 3).join(' ')})`)
      } catch (err) {
        console.error('[birthday-anniversary]', client.email, err)
      }
    }
  }

  return NextResponse.json({ sent: sent.length, sentTo: sent })
}
