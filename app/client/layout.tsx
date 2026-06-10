import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Client Portal — Policy Servicing | Poddar Wealth',
  robots: { index: false, follow: false },
};

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
