import { NextRequest, NextResponse } from 'next/server'
import { adminNotify } from '@/lib/admin-notify'
import { clean } from '@/lib/server-utils'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as { name?: unknown; message?: unknown; digest?: unknown; url?: unknown }
    const name    = clean(body.name, 100)
    const message = clean(body.message, 500)
    const digest  = clean(body.digest, 50)
    const url     = clean(body.url, 200)

    await adminNotify({
      type: 'API_ERROR',
      severity: 'error',
      route: url || 'client-side',
      message: `[GlobalError] ${name}: ${message}`,
      detail: digest ? `digest: ${digest}` : undefined,
    }).catch(() => {})

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}
