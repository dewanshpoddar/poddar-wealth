'use client';
import { useState, useEffect } from 'react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const stored = document.cookie
      .split('; ')
      .find(c => c.startsWith('admin_auth='));
    if (stored?.split('=')[1] === 'true') setAuthenticated(true);
  }, []);

  const login = async () => {
    setLoading(true);
    const r = await fetch('/api/admin/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    const data = await r.json();
    setLoading(false);
    if (data.success) {
      document.cookie = 'admin_auth=true; path=/admin; max-age=86400; SameSite=Strict';
      setAuthenticated(true);
    } else {
      alert('Wrong password');
    }
  };

  if (!authenticated) {
    return (
      <>
        <meta name="robots" content="noindex,nofollow" />
        <div className="min-h-screen bg-gray-950 flex items-center justify-center">
          <div className="bg-gray-900 p-8 rounded-2xl w-80 border border-gray-800">
            <h1 className="text-white text-lg font-semibold mb-1">Admin Access</h1>
            <p className="text-gray-500 text-sm mb-6">Poddar Wealth — internal only</p>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && login()}
              placeholder="Enter password"
              className="w-full bg-gray-800 text-white px-4 py-3 rounded-xl border border-gray-700 mb-4 outline-none focus:border-amber-500 transition-colors"
            />
            <button
              onClick={login}
              disabled={loading}
              className="w-full bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-colors"
            >
              {loading ? 'Checking…' : 'Login'}
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <meta name="robots" content="noindex,nofollow" />
      <div className="min-h-screen bg-gray-950 text-white">
        <nav className="bg-gray-900 border-b border-gray-800 px-6 py-3 flex items-center gap-6">
          <span className="text-amber-400 font-semibold text-sm">PW Admin</span>
          <a href="/admin" className="text-gray-400 hover:text-white text-sm transition-colors">Dashboard</a>
          <a href="/admin/architecture" className="text-gray-400 hover:text-white text-sm transition-colors">Architecture</a>
          <a href="/admin/docs" className="text-gray-400 hover:text-white text-sm transition-colors">Docs</a>
          <a href="/" className="text-gray-400 hover:text-white text-sm transition-colors ml-auto">← Live site</a>
        </nav>
        <main className="p-6">{children}</main>
      </div>
    </>
  );
}
