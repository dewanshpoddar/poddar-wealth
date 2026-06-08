import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { clean, isValidPhone } from '@/lib/server-utils'
import { logActivity } from '@/lib/activity-logger'

const REFERRALS_PATH = path.join(process.cwd(), 'lib/data/referrals.json')
const BASE_URL = 'https://poddarwealth.com'

// Rate limit: 3 codes per phone per day
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()

interface Referral {
  code: string
  referrerPhone: string
  referrerName: string
  createdAt: string
  uses: number
  conversions: number
}

function readReferrals(): Referral[] {
  try { return JSON.parse(fs.readFileSync(REFERRALS_PATH, 'utf8')) } catch { return [] }
}
function writeReferrals(r: Referral[]) {
  fs.writeFileSync(REFERRALS_PATH, JSON.stringify(r, null, 2))
}

function generateCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  return 'PWM-' + Array.from({ length: 5 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') ?? 'unknown'
  try {
    const body = await req.json().catch(() => null)
    const phone = clean(body?.referrerPhone ?? '')
    const name = clean(body?.referrerName ?? '')

    if (!phone || !isValidPhone(phone)) {
      return NextResponse.json({ error: 'Valid phone number required' }, { status: 400 })
    }
    if (!name) {
      return NextResponse.json({ error: 'Name required' }, { status: 400 })
    }

    // Rate limit
    const now = Date.now()
    const rl = rateLimitMap.get(phone)
    if (rl && now < rl.resetAt && rl.count >= 3) {
      return NextResponse.json({ error: 'Too many codes generated today' }, { status: 429 })
    }
    if (!rl || now > rl.resetAt) {
      rateLimitMap.set(phone, { count: 1, resetAt: now + 86_400_000 })
    } else {
      rl.count++
    }

    // Check if this phone already has an active code
    const referrals = readReferrals()
    const existing = referrals.find(r => r.referrerPhone === phone)
    if (existing) {
      logActivity('/api/referrals/generate', 'POST', 200, ip)
      return NextResponse.json({
        code: existing.code,
        shareUrl: `${BASE_URL}/?ref=${existing.code}`,
        isExisting: true,
      })
    }

    // Generate unique code
    let code = generateCode()
    const usedCodes = new Set(referrals.map(r => r.code))
    while (usedCodes.has(code)) code = generateCode()

    const newReferral: Referral = {
      code,
      referrerPhone: phone,
      referrerName: name,
      createdAt: new Date().toISOString(),
      uses: 0,
      conversions: 0,
    }
    referrals.push(newReferral)
    writeReferrals(referrals)

    logActivity('/api/referrals/generate', 'POST', 201, ip)
    return NextResponse.json(
      { code, shareUrl: `${BASE_URL}/?ref=${code}`, isExisting: false },
      { status: 201 },
    )
  } catch (err) {
    console.error('[referrals/generate]', err)
    logActivity('/api/referrals/generate', 'POST', 500, ip)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
