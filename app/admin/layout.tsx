'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Shield, Terminal, Eye, Lock, ArrowLeft, AlertCircle } from 'lucide-react';

type AdminRole = 'admin' | 'developer' | 'viewer';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [authenticated, setAuthenticated] = useState(false);
  const [role, setRole] = useState<AdminRole>('viewer');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<AdminRole>('admin');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const cookies = document.cookie.split('; ');
    const authCookie = cookies.find((c) => c.startsWith('admin_auth='));
    const roleCookie = cookies.find((c) => c.startsWith('admin_role='));

    if (authCookie?.split('=')[1] === 'true') {
      setAuthenticated(true);
      setRole((roleCookie?.split('=')[1] as AdminRole) || 'viewer');
    }
  }, []);

  const login = async () => {
    if (!password) return;
    setLoading(true);
    try {
      const r = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password, role: selectedRole }),
      });
      const data = await r.json();
      setLoading(false);
      if (data.success) {
        document.cookie = 'admin_auth=true; path=/admin; max-age=86400; SameSite=Strict';
        document.cookie = `admin_role=${selectedRole}; path=/admin; max-age=86400; SameSite=Strict`;
        setRole(selectedRole);
        setAuthenticated(true);
      } else {
        alert('Wrong password');
      }
    } catch {
      setLoading(false);
      alert('Authentication request failed');
    }
  };

  const logout = () => {
    document.cookie = 'admin_auth=; path=/admin; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=Strict';
    document.cookie = 'admin_role=; path=/admin; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=Strict';
    setAuthenticated(false);
    router.push('/admin');
  };

  // Route protection logic
  const isLeadsRoute = pathname === '/admin/leads';
  const isDevRoute = pathname === '/admin/architecture' || pathname === '/admin/docs';

  const hasAccess = () => {
    if (!authenticated) return false;
    if (isLeadsRoute && role !== 'admin') return false;
    if (isDevRoute && role === 'viewer') return false;
    return true;
  };

  if (!authenticated) {
    return (
      <>
        <meta name="robots" content="noindex,nofollow" />
        <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8 w-full max-w-md shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />
            
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
                <Lock size={18} />
              </div>
              <div>
                <h1 className="text-white text-lg font-bold">Admin Portal</h1>
                <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider">Internal access only</p>
              </div>
            </div>

            {/* Selectable Role Cards */}
            <div className="space-y-3 mb-6">
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">
                Select Workspace Role
              </label>
              
              <div className="grid grid-cols-3 gap-2">
                {/* Admin Role */}
                <button
                  type="button"
                  onClick={() => setSelectedRole('admin')}
                  className={`p-3 rounded-2xl border text-center flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                    selectedRole === 'admin'
                      ? 'bg-amber-500/10 border-amber-500 text-amber-400'
                      : 'bg-gray-950 border-gray-800 text-gray-500 hover:border-gray-700 hover:text-gray-300'
                  }`}
                >
                  <Shield size={16} />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Admin</span>
                </button>

                {/* Developer Role */}
                <button
                  type="button"
                  onClick={() => setSelectedRole('developer')}
                  className={`p-3 rounded-2xl border text-center flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                    selectedRole === 'developer'
                      ? 'bg-amber-500/10 border-amber-500 text-amber-400'
                      : 'bg-gray-950 border-gray-800 text-gray-500 hover:border-gray-700 hover:text-gray-300'
                  }`}
                >
                  <Terminal size={16} />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Dev</span>
                </button>

                {/* Viewer Role */}
                <button
                  type="button"
                  onClick={() => setSelectedRole('viewer')}
                  className={`p-3 rounded-2xl border text-center flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                    selectedRole === 'viewer'
                      ? 'bg-amber-500/10 border-amber-500 text-amber-400'
                      : 'bg-gray-950 border-gray-800 text-gray-500 hover:border-gray-700 hover:text-gray-300'
                  }`}
                >
                  <Eye size={16} />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Viewer</span>
                </button>
              </div>
            </div>

            {/* Password input */}
            <div className="space-y-3 mb-6">
              <label htmlFor="pass" className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">
                Security Password
              </label>
              <input
                id="pass"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && login()}
                placeholder="••••••••••••"
                className="w-full bg-gray-950 text-white px-4 py-3 rounded-xl border border-gray-800 hover:border-gray-700 focus:border-amber-500 transition-colors outline-none text-sm font-semibold"
              />
            </div>

            <button
              onClick={login}
              disabled={loading}
              className="w-full bg-amber-500 hover:bg-amber-600 disabled:bg-gray-800 text-white font-bold text-sm py-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                'Authenticate'
              )}
            </button>
          </div>
          
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-[11px] font-bold text-gray-500 hover:text-white uppercase tracking-widest mt-6 group transition-colors"
          >
            <ArrowLeft size={12} className="group-hover:-translate-x-0.5 transition-transform" />
            Back to Site
          </Link>
        </div>
      </>
    );
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
          Metrics
        </Link>
        
        {/* Leads Pipeline Link (Admin only) */}
        {role === 'admin' && (
          <Link 
            href="/admin/leads" 
            className={`text-xs font-bold uppercase tracking-widest transition-colors ${
              pathname === '/admin/leads' ? 'text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            Leads Pipeline
          </Link>
        )}

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
      </div>
    );
  };

  return (
    <>
      <meta name="robots" content="noindex,nofollow" />
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
    </>
  );
}
