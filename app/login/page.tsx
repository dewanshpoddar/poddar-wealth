'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Shield, User, ChevronRight, ArrowLeft, ExternalLink, TrendingUp, MessageCircle } from 'lucide-react'

export default function LoginPage() {
  const [role, setRole] = useState<'admin' | 'customer' | null>(null)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleAdminLogin() {
    if (!password) return
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password, role: 'admin' }),
      })
      const data = await res.json()
      if (data.success) {
        document.cookie = `admin_auth=true; path=/; max-age=86400; SameSite=Strict`
        document.cookie = `admin_role=admin; path=/; max-age=86400; SameSite=Strict`
        router.push('/admin')
      } else {
        setError('Incorrect password')
      }
    } catch {
      setError('Connection error. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Background accent — subtle gradient orb */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative w-full max-w-md">
        {/* Logo + brand */}
        <div className="text-center mb-8">
          <Image
            src="/assets/pwm-logo.svg"
            alt="Poddar Wealth Management"
            width={56}
            height={56}
            className="mx-auto mb-4 bg-white p-1 rounded-xl border border-[#27272A]"
          />
          <h1 className="text-xl font-medium text-white">Poddar Wealth Management</h1>
          <p className="text-sm text-gray-500 mt-1">Secure access portal</p>
        </div>

        {/* Role selection — if no role selected yet */}
        {!role && (
          <div className="space-y-3">
            <button
              onClick={() => setRole('admin')}
              className="w-full bg-[#13131A] border border-[#27272A] hover:border-amber-500/50 rounded-2xl p-5 text-left transition-all group cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center group-hover:bg-amber-500/20 transition-colors">
                  <Shield className="w-6 h-6 text-amber-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium text-base">Admin Dashboard</p>
                  <p className="text-sm text-gray-500 mt-0.5 truncate">
                    Manage site, view analytics, leads
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-600 ml-auto group-hover:text-amber-500 transition-colors shrink-0" />
              </div>
            </button>

            <button
              onClick={() => setRole('customer')}
              className="w-full bg-[#13131A] border border-[#27272A] hover:border-blue-500/50 rounded-2xl p-5 text-left transition-all group cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                  <User className="w-6 h-6 text-blue-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium text-base">Client Portal</p>
                  <p className="text-sm text-gray-500 mt-0.5 truncate">
                    View policies, pay premium, track NAV
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-600 ml-auto group-hover:text-blue-500 transition-colors shrink-0" />
              </div>
            </button>
          </div>
        )}

        {/* Admin password form — if admin role selected */}
        {role === 'admin' && (
          <div className="bg-[#13131A] border border-[#27272A] rounded-2xl p-6">
            <button
              onClick={() => {
                setRole(null)
                setPassword('')
                setError('')
              }}
              className="text-sm text-gray-500 hover:text-white mb-4 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <ArrowLeft size={14} /> Back
            </button>

            <h2 className="text-lg font-medium text-white mb-1">Admin Login</h2>
            <p className="text-sm text-gray-500 mb-6">Enter your admin password</p>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAdminLogin()}
              placeholder="Password"
              className="w-full bg-[#0A0A0F] border border-[#27272A] text-white px-4 py-3 rounded-xl text-sm placeholder:text-gray-600 focus:outline-none focus:border-amber-500/50 transition-colors"
              autoFocus
            />

            {error && <p className="text-sm text-red-400 mt-2 font-medium">{error}</p>}

            <button
              onClick={handleAdminLogin}
              disabled={loading || !password}
              className="w-full bg-amber-500 hover:bg-amber-600 text-white font-medium py-3 rounded-xl mt-4 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Verifying...
                </>
              ) : (
                'Login'
              )}
            </button>
          </div>
        )}

        {/* Customer portal — coming soon */}
        {role === 'customer' && (
          <div className="bg-[#13131A] border border-[#27272A] rounded-2xl p-6">
            <button
              onClick={() => setRole(null)}
              className="text-sm text-gray-500 hover:text-white mb-4 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <ArrowLeft size={14} /> Back
            </button>

            <h2 className="text-lg font-medium text-white mb-1">Client Portal</h2>
            <p className="text-sm text-gray-500 mb-6">Access your policies and services</p>

            <div className="space-y-3">
              <a
                href="https://customer.onlineportal.licindia.in"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 bg-[#0A0A0F] border border-[#27272A] rounded-xl hover:border-blue-500/30 transition-colors group"
              >
                <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
                  <ExternalLink size={18} className="text-blue-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white group-hover:text-blue-400 transition-colors">MyLIC Portal</p>
                  <p className="text-xs text-gray-500 mt-0.5">Check policy status, pay premium</p>
                </div>
              </a>

              <a
                href="/calculators/policy-health"
                className="flex items-center gap-4 p-4 bg-[#0A0A0F] border border-[#27272A] rounded-xl hover:border-amber-500/30 transition-colors group"
              >
                <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0">
                  <Shield size={18} className="text-amber-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white group-hover:text-amber-400 transition-colors">Policy Health Score</p>
                  <p className="text-xs text-gray-500 mt-0.5">Check if your coverage is adequate</p>
                </div>
              </a>

              <a
                href="/nav-tracker"
                className="flex items-center gap-4 p-4 bg-[#0A0A0F] border border-[#27272A] rounded-xl hover:border-emerald-500/30 transition-colors group"
              >
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
                  <TrendingUp size={18} className="text-emerald-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white group-hover:text-emerald-400 transition-colors">NAV Tracker</p>
                  <p className="text-xs text-gray-500 mt-0.5">Track your ULIP fund performance</p>
                </div>
              </a>

              <a
                href="https://wa.me/919415313434"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 bg-[#0A0A0F] border border-[#27272A] rounded-xl hover:border-green-500/30 transition-colors group"
              >
                <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center shrink-0">
                  <MessageCircle size={18} className="text-green-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white group-hover:text-green-400 transition-colors">Talk to Ajay sir</p>
                  <p className="text-xs text-gray-500 mt-0.5">Direct WhatsApp or call</p>
                </div>
              </a>
            </div>

            <p className="text-xs text-gray-600 text-center mt-6">
              OTP-based login coming soon via WhatsApp
            </p>
          </div>
        )}

        {/* Footer */}
        <p className="text-center text-xs text-gray-600 mt-8">
          © 2026 Poddar Wealth Management
        </p>
      </div>
    </div>
  )
}
