import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { clean, isValidPhone } from '@/lib/server-utils'
import { sendWhatsAppMessage } from '@/lib/whatsapp'
import { logActivity } from '@/lib/activity-logger'

const REFERRALS_PATH = path.join(process.cwd(), 'lib/data/referrals.json')

interface Referral {
  code: string
  referrerPhone: string
  referrerName: string
  createdAt: string
  uses: number
  conversions: number
  referredLeads?: Array<{ phone: string; name: string; timestamp: string }>
}

function readReferrals(): Referral[] {
  try { return JSON.parse(fs.readFileSync(REFERRALS_PATH, 'utf8')) } catch { return [] }
}
function writeReferrals(r: Referral[]) {
  fs.writeFileSync(REFERRALS_PATH, JSON.stringify(r, null, 2))
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') ?? 'unknown'
  try {
    const body = await req.json().catch(() => null)
    const code = (body?.code ?? '').trim().toUpperCase()
    const referredPhone = clean(body?.referredPhone ?? '')
    const referredName = clean(body?.referredName ?? '')

    if (!code || !referredPhone || !isValidPhone(referredPhone)) {
      return NextResponse.json({ error: 'code and valid referredPhone required' }, { status: 400 })
    }

    const referrals = readReferrals()
    const idx = referrals.findIndex(r => r.code === code)
    if (idx === -1) {
      return NextResponse.json({ error: 'Invalid referral code' }, { status: 404 })
    }

    const ref = referrals[idx]
    ref.uses += 1
    if (!ref.referredLeads) ref.referredLeads = []
    ref.referredLeads.push({
      phone: referredPhone,
      name: referredName,
      timestamp: new Date().toISOString(),
    })
    referrals[idx] = ref
    writeReferrals(referrals)

    // Notify referrer via WhatsApp (fire-and-forget)
    if (referredName) {
      sendWhatsAppMessage(
        ref.referrerPhone,
        `🎉 ${ref.referrerName}ji, your referral *${referredName}* just signed up with Poddar Wealth!\n\nAs promised, both of you will get a *free policy review*. Ajay sir will be in touch soon.\n\nThank you for spreading the word! 🙏`,
      ).catch(() => {})
    }

    logActivity('/api/referrals/track', 'POST', 200, ip)
    return NextResponse.json({ success: true, referrerName: ref.referrerName })
  } catch (err) {
    console.error('[referrals/track]', err)
    logActivity('/api/referrals/track', 'POST', 500, ip)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
