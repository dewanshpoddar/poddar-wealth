'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Shield, Terminal, Eye, AlertCircle } from 'lucide-react';

type AdminRole = 'admin' | 'developer' | 'viewer';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [authenticated, setAuthenticated] = useState(false);
  const [role, setRole] = useState<AdminRole>('viewer');

  useEffect(() => {
    const cookies = document.cookie.split('; ');
    const authCookie = cookies.find((c) => c.startsWith('admin_auth='));
    const roleCookie = cookies.find((c) => c.startsWith('admin_role='));

    if (authCookie?.split('=')[1] === 'true') {
      setAuthenticated(true);
      setRole((roleCookie?.split('=')[1] as AdminRole) || 'viewer');
    } else {
      router.replace('/login');
    }
  }, [router]);

  const logout = () => {
    document.cookie = 'admin_auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=Strict';
    document.cookie = 'admin_role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=Strict';
    document.cookie = 'admin_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=Strict';
    setAuthenticated(false);
    router.push('/login');
  };

  // Route protection logic
  const isLeadsOrReferralsRoute = pathname === '/admin/leads' || pathname === '/admin/referrals';
  const isDevRoute = 
    pathname === '/admin/architecture' || 
    pathname === '/admin/docs' || 
    pathname === '/admin/seo' || 
    pathname === '/admin/ab' || 
    pathname === '/admin/sprints';

  const hasAccess = () => {
    if (!authenticated) return false;
    if (isLeadsOrReferralsRoute && role !== 'admin') return false;
    if (isDevRoute && role === 'viewer') return false;
    return true;
  };

  if (!authenticated) {
    return null; // useEffect handles redirect to /login
  }

  // Handle access restrictions
  const renderNavLinks = () => {
    return (
      <div className="flex items-center gap-6">
        <span className="text-amber-500 font-black text-sm select-none tracking-widest uppercase">PW Admin</span>
        
        {/* Dashboard Link (Always available) */}
        <Link 
          href="/admin" 
          className={`text-xs font-bold uppercase tracking-widest transition-colors ${
            pathname === '/admin' ? 'text-white' : 'text-gray-400 hover:text-white'
          }`}
        >
          Dashboard
        </Link>
        
        {/* Developer routes (Admin & Dev) */}
        {role !== 'viewer' && (
          <>
            <Link 
              href="/admin/architecture" 
              className={`text-xs font-bold uppercase tracking-widest transition-colors ${
                pathname === '/admin/architecture' ? 'text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              Architecture
            </Link>
            <Link 
              href="/admin/docs" 
              className={`text-xs font-bold uppercase tracking-widest transition-colors ${
                pathname === '/admin/docs' ? 'text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              Docs
            </Link>
          </>
        )}

        {/* Leads & Referrals Link (Admin only) */}
        {role === 'admin' && (
          <>
            <Link 
              href="/admin/leads" 
              className={`text-xs font-bold uppercase tracking-widest transition-colors ${
                pathname === '/admin/leads' ? 'text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              Leads
            </Link>
            <Link 
              href="/admin/referrals" 
              className={`text-xs font-bold uppercase tracking-widest transition-colors ${
                pathname === '/admin/referrals' ? 'text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              Referrals
            </Link>
          </>
        )}

        {/* Dev metrics/status (Admin & Dev) */}
        {role !== 'viewer' && (
          <>
            <Link 
              href="/admin/seo" 
              className={`text-xs font-bold uppercase tracking-widest transition-colors ${
                pathname === '/admin/seo' ? 'text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              SEO
            </Link>
            <Link 
              href="/admin/ab" 
              className={`text-xs font-bold uppercase tracking-widest transition-colors ${
                pathname === '/admin/ab' ? 'text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              A/B Tests
            </Link>
            <Link 
              href="/admin/sprints" 
              className={`text-xs font-bold uppercase tracking-widest transition-colors ${
                pathname === '/admin/sprints' ? 'text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              Sprints
            </Link>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col font-sans">
        
        {/* Header navigation bar */}
        <header className="bg-gray-900 border-b border-gray-800/80 px-6 py-4 flex items-center justify-between shrink-0 shadow-lg">
          <nav className="flex items-center gap-6">
            {renderNavLinks()}
          </nav>
          
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5 bg-gray-950 border border-gray-800 text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-xl text-amber-500 select-none">
              {role === 'admin' ? <Shield size={12} /> : role === 'developer' ? <Terminal size={12} /> : <Eye size={12} />}
              {role}
            </span>
            <button
              onClick={logout}
              className="text-[10px] font-bold text-gray-500 hover:text-white uppercase tracking-widest border border-gray-800 hover:border-gray-700 px-3 py-1.5 rounded-xl transition-all cursor-pointer"
            >
              Logout
            </button>
          </div>
        </header>

        {/* Content body with route authorization checks */}
        <main className="p-6 sm:p-8 flex-1 overflow-auto">
          {hasAccess() ? (
            children
          ) : (
            <div className="h-full flex items-center justify-center py-24">
              <div className="max-w-md bg-gray-900 border border-gray-800 rounded-3xl p-8 text-center shadow-2xl relative overflow-hidden">
                <div className="w-14 h-14 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertCircle size={24} />
                </div>
                <h2 className="text-white text-lg font-black mb-2">Access Denied</h2>
                <p className="text-gray-400 text-xs sm:text-sm font-medium leading-relaxed mb-6">
                  Your current session role <code className="text-amber-500 font-bold bg-gray-950 px-1.5 py-0.5 rounded">[{role}]</code> does not have permission to access the endpoint <code className="text-gray-300 font-bold bg-gray-950 px-1.5 py-0.5 rounded">{pathname}</code>.
                </p>
                <Link
                  href="/admin"
                  className="inline-flex bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs px-5 py-3 rounded-xl transition-all cursor-pointer"
                >
                  Return to Dashboard
                </Link>
              </div>
            </div>
          )}
        </main>
    </div>
  );
}
