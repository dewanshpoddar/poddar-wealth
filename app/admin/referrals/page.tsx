export const metadata = { robots: 'noindex,nofollow' };

import fs from 'fs'
import path from 'path'

import { cookies } from 'next/headers'
import { verifySession } from '@/lib/admin-auth'

interface Referral {
  code: string
  referrerPhone: string
  referrerName: string
  createdAt: string
  uses: number
  conversions: number
  referredLeads?: Array<{ phone: string; name: string; timestamp: string }>
}

function getReferrals(): Referral[] {
  try {
    return JSON.parse(fs.readFileSync(path.join(process.cwd(), 'lib/data/referrals.json'), 'utf8'))
  } catch { return [] }
}

export default async function ReferralsPage() {
  const cookieStore = await cookies()
  const token = cookieStore.get('admin_session')?.value
  const session = token ? verifySession(token) : null

  if (!session || session.role !== 'admin') {
    return (
      <div className="max-w-5xl mx-auto py-12 text-center text-rose-500 font-bold">
        Access Denied: Admin session is invalid or has expired. Please log in first.
      </div>
    )
  }

  const referrals = getReferrals()
  const sorted = [...referrals].sort((a, b) => b.uses - a.uses)
  const totalUses = referrals.reduce((s, r) => s + r.uses, 0)
  const totalConversions = referrals.reduce((s, r) => s + r.conversions, 0)

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Referral Program</h1>
        <p className="text-gray-500 text-sm">All referral codes and usage</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Codes', value: referrals.length },
          { label: 'Total Uses', value: totalUses },
          { label: 'Conversions', value: totalConversions },
        ].map(m => (
          <div key={m.label} className="bg-white border border-gray-200 rounded-xl p-4">
            <p className="text-2xl font-bold text-amber-400">{m.value}</p>
            <p className="text-gray-400 text-xs mt-1">{m.label}</p>
          </div>
        ))}
      </div>

      {sorted.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl p-8 text-center text-gray-500 text-sm">
          No referral codes generated yet. Codes appear here once users generate them via the site.
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl divide-y divide-gray-200">
          <div className="grid grid-cols-5 px-5 py-2 text-[10px] uppercase tracking-widest text-gray-500 font-bold">
            <span>Code</span>
            <span>Referrer</span>
            <span>Phone</span>
            <span className="text-center">Uses</span>
            <span>Created</span>
          </div>
          {sorted.map(r => (
            <div key={r.code} className="grid grid-cols-5 px-5 py-3 items-center">
              <code className="text-amber-400 text-xs font-mono">{r.code}</code>
              <span className="text-gray-900 text-sm">{r.referrerName}</span>
              <span className="text-gray-400 text-sm">{r.referrerPhone}</span>
              <span className="text-center">
                <span className={`text-xs px-2 py-0.5 rounded-full ${r.uses > 0 ? 'bg-green-900 text-green-400' : 'bg-gray-800 text-gray-400'}`}>
                  {r.uses}
                </span>
              </span>
              <span className="text-gray-500 text-xs">{r.createdAt.split('T')[0]}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
