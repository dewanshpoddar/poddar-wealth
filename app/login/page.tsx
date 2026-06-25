'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ADVISOR_PHONE } from '@/lib/constants'
import Toast from '@/components/Toast'

function LogoutToast({ onShow }: { onShow: (msg: string) => void }) {
  const searchParams = useSearchParams()
  useEffect(() => {
    if (searchParams.get('logged_out') === 'true') {
      onShow("You've been logged out successfully")
      window.history.replaceState({}, '', '/login')
    }
  }, [searchParams, onShow])
  return null
}
import {
  Shield,
  User,
  ChevronRight,
  ArrowLeft,
  ExternalLink,
  TrendingUp,
  MessageCircle,
  AlertCircle,
} from 'lucide-react'

export default function LoginPage() {
  const [role, setRole] = useState<'admin' | 'customer' | null>(null)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const authCookie = document.cookie.split('; ').find(c => c.startsWith('admin_auth='))
    if (authCookie?.split('=')[1] === 'true') {
      router.replace('/admin')
    }
  }, [router])

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
    <>
    <Suspense fallback={null}><LogoutToast onShow={setToast} /></Suspense>
    {toast && <Toast message={toast} type="success" onClose={() => setToast(null)} />}
    <div className="min-h-screen flex font-sans">

      {/* LEFT — Brand panel (desktop only) */}
      <div className="hidden md:flex w-1/2 bg-amber-50 relative flex-col items-center justify-center p-12 overflow-hidden border-r border-amber-100">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-200/30 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-100/40 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 max-w-sm text-center">
          <Link href="/" className="inline-block mb-6">
            <Image
              src="/assets/pwm-logo.svg"
              alt="Poddar Wealth Management"
              width={72}
              height={72}
            />
          </Link>

          <h1 className="text-2xl font-semibold text-gray-900 mb-2">
            Poddar Wealth Management
          </h1>
          <p className="text-sm text-gray-500 mb-8">Excellence in Service Since 1994</p>

          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-xl p-4 shadow-sm border border-amber-100">
              <p className="text-xl font-bold text-amber-600">31+</p>
              <p className="text-xs text-gray-500 mt-1 leading-tight">Years of<br />Service</p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-amber-100">
              <p className="text-xl font-bold text-amber-600">5000+</p>
              <p className="text-xs text-gray-500 mt-1 leading-tight">Families<br />Protected</p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-amber-100">
              <p className="text-xl font-bold text-amber-600">4.9★</p>
              <p className="text-xs text-gray-500 mt-1 leading-tight">Google<br />Rating</p>
            </div>
          </div>

          <div className="bg-white border border-amber-100 rounded-2xl p-5 shadow-sm text-left">
            <p className="text-sm text-gray-700 italic leading-relaxed">
              &ldquo;Ajay sir helped my family choose the right plan.
              Very knowledgeable and patient.&rdquo;
            </p>
            <p className="text-xs text-gray-500 mt-3">— Google Review, Gorakhpur</p>
          </div>

          <p className="text-xs text-amber-700 font-medium mt-6 bg-amber-100 inline-block px-3 py-1 rounded-full">
            MDRT Member · Chairman&apos;s Club Awardee
          </p>
        </div>
      </div>

      {/* RIGHT — Login form */}
      <div className="w-full md:w-1/2 bg-white flex items-center justify-center p-6 md:p-12 relative">
        <Link
          href="/"
          className="absolute top-6 left-6 flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          <ArrowLeft size={16} />
          <span>Back to website</span>
        </Link>

        {/* Mobile logo — only visible when left panel is hidden */}
        <Link href="/" className="absolute top-6 right-6 md:hidden">
          <Image src="/assets/pwm-logo.svg" alt="Home" width={36} height={36} />
        </Link>

        <div className="w-full max-w-sm mt-12 md:mt-0">
          <h2 className="text-2xl font-semibold text-gray-900 mb-1">Welcome back</h2>
          <p className="text-sm text-gray-500 mb-8">Choose how you&apos;d like to continue</p>

          {/* Role selection */}
          {!role && (
            <div className="space-y-3">
              <button
                onClick={() => setRole('admin')}
                className="w-full border border-gray-200 hover:border-amber-400 hover:bg-amber-50/50 rounded-2xl p-5 text-left transition-all duration-150 group bg-white shadow-sm cursor-pointer active:scale-[0.97]"
              >
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl bg-amber-50 flex items-center justify-center group-hover:bg-amber-100 transition-colors border border-amber-100">
                    <Shield className="w-5 h-5 text-amber-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-900 font-semibold text-sm">Admin Dashboard</p>
                    <p className="text-xs text-gray-500 mt-0.5">Manage site, analytics, leads</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-amber-500 transition-colors" />
                </div>
              </button>

              <button
                onClick={() => setRole('customer')}
                className="w-full border border-gray-200 hover:border-blue-400 hover:bg-blue-50/30 rounded-2xl p-5 text-left transition-all duration-150 group bg-white shadow-sm cursor-pointer active:scale-[0.97]"
              >
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors border border-blue-100">
                    <User className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-900 font-semibold text-sm">Client Services</p>
                    <p className="text-xs text-gray-500 mt-0.5">Policies, premium, NAV tracker</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-blue-500 transition-colors" />
                </div>
              </button>
            </div>
          )}

          {/* Admin login form */}
          {role === 'admin' && (
            <div>
              <button
                onClick={() => { setRole(null); setPassword(''); setError('') }}
                className="text-sm text-gray-500 hover:text-gray-700 mb-6 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <ArrowLeft size={14} /> Back
              </button>

              <h3 className="text-lg font-semibold text-gray-900 mb-1">Admin Login</h3>
              <p className="text-sm text-gray-500 mb-6">Enter your admin password to continue</p>

              <div className="space-y-4">
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleAdminLogin()}
                  placeholder="Password"
                  autoFocus
                  className="w-full border border-gray-200 text-gray-900 px-4 py-3 rounded-xl text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400/30 focus:border-amber-400 transition-all bg-gray-50"
                />

                {error && (
                  <p className="text-sm text-red-500 flex items-center gap-1.5">
                    <AlertCircle size={14} /> {error}
                  </p>
                )}

                <button
                  onClick={handleAdminLogin}
                  disabled={loading || !password}
                  className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 rounded-xl transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed shadow-sm cursor-pointer"
                >
                  {loading ? 'Verifying...' : 'Continue'}
                </button>
              </div>
            </div>
          )}

          {/* Customer services panel */}
          {role === 'customer' && (
            <div>
              <button
                onClick={() => setRole(null)}
                className="text-sm text-gray-500 hover:text-gray-700 mb-6 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <ArrowLeft size={14} /> Back
              </button>

              <h3 className="text-lg font-semibold text-gray-900 mb-1">Client Services</h3>
              <p className="text-sm text-gray-500 mb-6">Access your policies and services</p>

              <div className="space-y-2.5">
                <a
                  href="https://customer.onlineportal.licindia.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl hover:border-blue-200 hover:bg-blue-50/40 transition-all"
                >
                  <ExternalLink size={18} className="text-blue-500 shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">MyLIC Portal</p>
                    <p className="text-xs text-gray-500">Policy status, pay premium</p>
                  </div>
                </a>

                <a
                  href="/calculators/policy-health"
                  className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl hover:border-amber-200 hover:bg-amber-50/40 transition-all"
                >
                  <Shield size={18} className="text-amber-500 shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Policy Health Score</p>
                    <p className="text-xs text-gray-500">Check your coverage</p>
                  </div>
                </a>

                <a
                  href="/nav-tracker"
                  className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl hover:border-emerald-200 hover:bg-emerald-50/40 transition-all"
                >
                  <TrendingUp size={18} className="text-emerald-500 shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">NAV Tracker</p>
                    <p className="text-xs text-gray-500">ULIP fund performance</p>
                  </div>
                </a>

                <a
                  href={`https://wa.me/91${ADVISOR_PHONE}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl hover:border-green-200 hover:bg-green-50/40 transition-all"
                >
                  <MessageCircle size={18} className="text-green-500 shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Talk to Ajay sir</p>
                    <p className="text-xs text-gray-500">WhatsApp or call</p>
                  </div>
                </a>
              </div>

              <p className="text-xs text-gray-500 text-center mt-6">OTP login coming soon</p>
            </div>
          )}

          <p className="text-xs text-gray-500 text-center mt-10">
            © 2026 Poddar Wealth Management
          </p>
        </div>
      </div>
    </div>
    </>
  )
}
