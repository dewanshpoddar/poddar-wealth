'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { AlertCircle } from 'lucide-react';
import AdminNav from '@/components/admin/AdminNav';

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
  }, [router, pathname]);

  // Route protection logic
  const isLeadsOrReferralsRoute = pathname === '/admin/leads' || pathname === '/admin/referrals';
  const isDevRoute =
    pathname === '/admin/architecture' ||
    pathname === '/admin/docs' ||
    pathname === '/admin/seo' ||
    pathname === '/admin/ab';

  const hasAccess = () => {
    if (!authenticated) return false;
    if (isLeadsOrReferralsRoute && role !== 'admin') return false;
    if (isDevRoute && role === 'viewer') return false;
    return true;
  };

  if (!authenticated) {
    return null; // useEffect handles redirect to /login
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans flex flex-col">
      <AdminNav />
      
      {/* 
        Layout offsets:
        - Mobile: pt-16 (to offset fixed top bar)
        - Desktop: md:pt-0, md:ml-60 (to offset fixed sidebar)
      */}
      <div className="pt-16 md:pt-0 md:ml-60 flex flex-col flex-1 overflow-x-hidden">
        <main className="p-4 md:p-6 flex-1 flex flex-col min-w-0">
          {hasAccess() ? (
            <div>
              {children}
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center py-12">
              <div className="w-full max-w-md bg-white border border-gray-200 rounded-2xl p-8 text-center shadow-sm relative overflow-hidden">
                <div className="w-14 h-14 bg-red-50 border border-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertCircle size={24} />
                </div>
                <h2 className="text-gray-900 text-lg font-semibold mb-2">Access Denied</h2>
                <p className="text-gray-500 text-sm leading-relaxed mb-6">
                  Your current session role <code className="text-amber-600 font-mono font-medium bg-amber-50 px-1.5 py-0.5 rounded">[{role}]</code> does not have permission to access <code className="text-gray-700 font-mono font-medium bg-gray-100 px-1.5 py-0.5 rounded">{pathname}</code>.
                </p>
                <Link
                  href="/admin"
                  className="inline-flex bg-amber-500 hover:bg-amber-600 text-white font-medium text-sm px-5 py-3 rounded-xl transition-colors cursor-pointer"
                >
                  Return to Dashboard
                </Link>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
