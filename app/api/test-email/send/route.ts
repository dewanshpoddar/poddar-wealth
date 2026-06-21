import { NextResponse } from 'next/server'
import { Resend } from 'resend'

// TEMPORARY — delete after email verification
export async function POST(req: Request) {
  const { to } = await req.json().catch(() => ({}))
  if (!to) return NextResponse.json({ error: 'to address required' }, { status: 400 })

  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json({ error: 'RESEND_API_KEY not configured' }, { status: 500 })
  }

  const resend = new Resend(process.env.RESEND_API_KEY)

  try {
    const { data, error } = await resend.emails.send({
      from: 'Poddar Wealth <noreply@poddarwealth.com>',
      to: [to],
      subject: 'Test Email — Poddar Wealth Management',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #111827; padding: 24px; text-align: center; border-radius: 12px 12px 0 0;">
            <h1 style="color: #F59E0B; font-size: 20px; margin: 0;">Poddar Wealth Management</h1>
            <p style="color: #9CA3AF; font-size: 12px; margin: 4px 0 0;">Excellence in Service Since 1994</p>
          </div>
          <div style="padding: 24px; border: 1px solid #E5E7EB; border-top: none; border-radius: 0 0 12px 12px;">
            <h2 style="color: #111827; font-size: 18px; margin: 0 0 12px;">Email System Working ✓</h2>
            <p style="color: #4B5563; line-height: 1.6; margin: 0 0 16px;">
              This confirms the Poddar Wealth email system is properly configured via Resend.
            </p>
            <p style="color: #9CA3AF; font-size: 12px; margin: 0;">Sent at: ${new Date().toISOString()}</p>
          </div>
        </div>
      `,
    })

    if (error) {
      console.error('[test-email] Resend error:', error)
      return NextResponse.json({ success: false, error }, { status: 500 })
    }

    return NextResponse.json({ success: true, id: data?.id })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown error'
    console.error('[test-email] Failed:', msg)
    return NextResponse.json({ success: false, error: msg }, { status: 500 })
  }
}
