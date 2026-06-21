import { NextResponse } from 'next/server'

export async function POST() {
  const res = NextResponse.json({ success: true })
  const expired = 'expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Strict'
  res.headers.append('Set-Cookie', `admin_auth=; ${expired}`)
  res.headers.append('Set-Cookie', `admin_role=; ${expired}`)
  res.headers.append('Set-Cookie', `admin_session=; ${expired}`)
  return res
}
