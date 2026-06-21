'use client'

import { useState, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  LayoutDashboard,
  Map,
  FileText,
  Users,
  Gift,
  Search,
  FlaskConical,
  Rocket,
  ExternalLink,
  LogOut,
  Menu,
  X,
  Shield,
  Terminal,
  Eye
} from 'lucide-react'

const navItems = [
  { href: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/admin/architecture', icon: Map, label: 'Architecture' },
  { href: '/admin/docs', icon: FileText, label: 'Docs' },
  { href: '/admin/leads', icon: Users, label: 'Leads' },
  { href: '/admin/referrals', icon: Gift, label: 'Referrals' },
  { href: '/admin/seo', icon: Search, label: 'SEO' },
  { href: '/admin/ab', icon: FlaskConical, label: 'A/B Tests' },
  { href: '/admin/sprints', icon: Rocket, label: 'Sprints' }
]

type AdminRole = 'admin' | 'developer' | 'viewer'

export default function AdminNav() {
  const pathname = usePathname()
  const router = useRouter()
  const [role, setRole] = useState<AdminRole>('viewer')
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const cookies = document.cookie.split('; ')
    const roleCookie = cookies.find(c => c.startsWith('admin_role='))
    if (roleCookie) {
      setRole((roleCookie.split('=')[1] as AdminRole) || 'viewer')
    }
  }, [pathname])

  // Close mobile drawer on route changes
  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  const isLeadsOrReferralsRoute = (href: string) => href === '/admin/leads' || href === '/admin/referrals'
  const isDevRoute = (href: string) =>
    href === '/admin/architecture' ||
    href === '/admin/docs' ||
    href === '/admin/seo' ||
    href === '/admin/ab' ||
    href === '/admin/sprints'

  const filteredItems = navItems.filter(item => {
    if (isLeadsOrReferralsRoute(item.href) && role !== 'admin') return false
    if (isDevRoute(item.href) && role === 'viewer') return false
    return true
  })

  const isActive = (href: string) => {
    if (href === '/admin') {
      return pathname === '/admin'
    }
    return pathname?.startsWith(href)
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' })
    } catch { /* ignore */ }
    document.cookie = 'admin_auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=Strict'
    document.cookie = 'admin_role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=Strict'
    document.cookie = 'admin_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=Strict'
    window.location.href = '/login'
  }

  const getRoleIcon = () => {
    switch (role) {
      case 'admin':
        return <Shield size={12} className="text-amber-500" />
      case 'developer':
        return <Terminal size={12} className="text-amber-500" />
      default:
        return <Eye size={12} className="text-amber-500" />
    }
  }

  const renderNavContent = () => (
    <div className="flex flex-col h-full bg-[#0A0A0F] text-zinc-300">
      {/* Logo Section */}
      <div className="p-5 border-b border-[#1E1E26]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0">
            <span className="text-amber-500 text-xs font-bold font-mono">PW</span>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-white truncate">Poddar Wealth</p>
            <div className="flex items-center gap-1 mt-0.5">
              {getRoleIcon()}
              <p className="text-[10px] text-gray-500 uppercase tracking-wider truncate font-medium">{role}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {filteredItems.map(item => {
          const active = isActive(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 ${
                active
                  ? 'bg-amber-500/10 text-amber-500 font-medium'
                  : 'text-gray-400 hover:text-white hover:bg-[#13131A]'
              }`}
            >
              <item.icon size={18} className="shrink-0" />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Bottom Section */}
      <div className="p-3 border-t border-[#1E1E26] space-y-1">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-500 hover:text-white hover:bg-[#13131A] transition-colors"
        >
          <ExternalLink size={16} className="shrink-0" />
          <span>View live site</span>
        </a>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-500 hover:text-red-400 hover:bg-red-500/5 transition-colors w-full text-left cursor-pointer"
        >
          <LogOut size={16} className="shrink-0" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile Top Bar */}
      <header className="fixed top-0 left-0 w-full h-16 bg-[#13131A] border-b border-[#27272A] flex items-center justify-between px-4 z-40 md:hidden">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileOpen(true)}
            className="p-1 text-zinc-400 hover:text-white transition-colors cursor-pointer"
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>
          <span className="text-sm font-medium text-white tracking-wide">Poddar Wealth</span>
        </div>
        <div className="flex items-center gap-2 bg-[#0A0A0F] border border-[#27272A] text-[10px] font-medium uppercase tracking-wider px-2.5 py-1.5 rounded-full text-amber-500">
          {getRoleIcon()}
          <span>{role}</span>
        </div>
      </header>

      {/* Mobile Drawer (Overlay and Slider) */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          {/* Slider Drawer Container */}
          <aside className="absolute top-0 left-0 h-full w-60 z-50 flex flex-col shadow-2xl animate-in slide-in-from-left duration-250">
            {/* Close Button Inside Drawer */}
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors z-50 cursor-pointer"
              aria-label="Close menu"
            >
              <X size={18} />
            </button>
            <div className="h-full w-full">
              {renderNavContent()}
            </div>
          </aside>
        </div>
      )}

      {/* Desktop Persistent Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-60 bg-[#0A0A0F] border-r border-[#1E1E26] hidden md:flex flex-col z-40">
        {renderNavContent()}
      </aside>
    </>
  )
}
