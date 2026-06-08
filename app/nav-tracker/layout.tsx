import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'LIC ULIP NAV Tracker — Live Fund Values | Poddar Wealth',
  description: 'Track live and historical Net Asset Value (NAV) of LIC ULIP plans (SIIP, Nivesh Plus, New Pension Plus). Compare 7D, 30D, 1Y fund values and set email alerts.',
  keywords: 'LIC ULIP NAV, LIC fund NAV today, SIIP 752 NAV, Nivesh Plus 749 NAV, Pension Plus 867, LIC mutual fund NAV today',
  openGraph: {
    title: 'LIC ULIP NAV Tracker — Live Fund Values | Poddar Wealth',
    description: 'Track live and historical Net Asset Value (NAV) of LIC ULIP plans (SIIP, Nivesh Plus, New Pension Plus). Compare 7D, 30D, 1Y fund values and set email alerts.',
    url: 'https://poddarwealth.com/nav-tracker',
    type: 'website',
  }
}

export default function NavTrackerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
