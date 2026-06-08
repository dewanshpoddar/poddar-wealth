import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)
  if (!body?.password) {
    return NextResponse.json({ success: false, error: 'Password required' }, { status: 400 })
  }

  const adminPassword = process.env.ADMIN_DASHBOARD_PASSWORD
  if (!adminPassword) {
    return NextResponse.json({ success: false, error: 'Not configured' }, { status: 503 })
  }

  if (body.password === adminPassword) {
    return NextResponse.json({ success: true })
  }

  return NextResponse.json({ success: false }, { status: 401 })
}
