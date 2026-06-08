import { Resend } from 'resend'
import { ADVISOR_PHONE } from './constants'

export async function sendWelcomeEmail(email: string, name?: string): Promise<boolean> {
  if (!process.env.RESEND_API_KEY) return false
  const resend = new Resend(process.env.RESEND_API_KEY)
  try {
    await resend.emails.send({
      from: 'Poddar Wealth <noreply@poddarwealth.com>',
      to: email,
      subject: name
        ? `Welcome, ${name}! Your insurance insights start now`
        : 'Welcome to Poddar Wealth — Insurance insights weekly',
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
            <h2 style="color: #111827; font-size: 20px; margin: 0 0 12px;">
              ${name ? `Hi ${name},` : 'Welcome!'} You're in.
            </h2>
            <p style="color: #4B5563; line-height: 1.7; margin: 0 0 16px;">
              You'll receive weekly insurance insights from Ajay Kumar Poddar,
              MDRT Member with 31 years of experience advising 5,000+ families
              across Gorakhpur and eastern UP.
            </p>
            <p style="color: #4B5563; line-height: 1.7; margin: 0 0 24px;">
              What to expect: LIC plan updates, tax-saving tips before March,
              premium reminders, and practical guides in Hindi and English. No spam, ever.
            </p>
            <div style="text-align: center; margin: 0 0 28px;">
              <a href="https://www.poddarwealth.com/calculators/policy-health"
                 style="display: inline-block; background: #F59E0B; color: #111827; padding: 14px 28px;
                        border-radius: 50px; text-decoration: none; font-weight: 700; font-size: 14px;">
                Check Your Policy Health Score — Free
              </a>
            </div>
            <div style="background: #F9FAFB; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
              <p style="color: #374151; font-size: 13px; margin: 0 0 8px; font-weight: 600;">
                Have an urgent insurance question?
              </p>
              <p style="color: #6B7280; font-size: 13px; margin: 0;">
                Call Ajay sir directly: <strong style="color: #111827;">+91 ${ADVISOR_PHONE}</strong>
              </p>
            </div>
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
    })
    return true
  } catch (error) {
    console.error('Welcome email send failed:', error)
    return false
  }
}
