export const metadata = { robots: 'noindex,nofollow' };

type PageStatus = 'live' | 'new' | 'pending';

interface SiteSection {
  category: string;
  pages: { route: string; title: string; status: PageStatus }[];
}

const siteSections: SiteSection[] = [
  {
    category: 'Core Pages',
    pages: [
      { route: '/', title: 'Homepage', status: 'live' },
      { route: '/about', title: 'About Ajay Poddar', status: 'live' },
      { route: '/contact', title: 'Contact', status: 'live' },
      { route: '/products', title: 'Products (LIC Plans)', status: 'live' },
      { route: '/compare', title: 'Compare Plans', status: 'live' },
      { route: '/blog', title: 'Blog Index', status: 'live' },
      { route: '/blog/[slug]', title: 'Blog Post (100 posts)', status: 'live' },
      { route: '/faq', title: 'FAQ', status: 'live' },
      { route: '/claims', title: 'Claims Guide', status: 'live' },
      { route: '/renew', title: 'Policy Renewal', status: 'live' },
      { route: '/pay-premium', title: 'Pay Premium Online', status: 'live' },
      { route: '/become-advisor', title: 'Join as Advisor', status: 'live' },
      { route: '/privacy-policy', title: 'Privacy Policy', status: 'live' },
      { route: '/terms', title: 'Terms of Service', status: 'live' },
    ],
  },
  {
    category: 'Service Pages',
    pages: [
      { route: '/services', title: 'Services Hub', status: 'live' },
      { route: '/services/life-insurance', title: 'Life Insurance', status: 'live' },
      { route: '/services/health-insurance', title: 'Health Insurance', status: 'live' },
      { route: '/services/child-planning', title: 'Child Planning', status: 'live' },
      { route: '/services/retirement', title: 'Retirement Planning', status: 'live' },
      { route: '/services/tax-planning', title: 'Tax Planning', status: 'live' },
      { route: '/services/keyman-insurance', title: 'Keyman Insurance', status: 'live' },
      { route: '/services/critical-illness', title: 'Critical Illness', status: 'live' },
      { route: '/services/personal-accident', title: 'Personal Accident', status: 'live' },
      { route: '/services/cancer-cover', title: 'Cancer Cover', status: 'live' },
      { route: '/services/term-life', title: 'Term Life', status: 'live' },
      { route: '/services/group-health', title: 'Group Health', status: 'live' },
    ],
  },
  {
    category: 'Area Pages (20)',
    pages: [
      { route: '/services/gorakhpur', title: 'Gorakhpur', status: 'live' },
      { route: '/services/golghar', title: 'Golghar', status: 'live' },
      { route: '/services/shahpur', title: 'Shahpur', status: 'live' },
      { route: '/services/padrauna', title: 'Padrauna', status: 'live' },
      { route: '/services/deoria', title: 'Deoria', status: 'live' },
      { route: '/services/maharajganj', title: 'Maharajganj', status: 'live' },
      { route: '/services/kushinagar', title: 'Kushinagar', status: 'live' },
      { route: '/services/basti', title: 'Basti', status: 'live' },
      { route: '/services/siddharthnagar', title: 'Siddharthnagar', status: 'live' },
      { route: '/services/sant-kabir-nagar', title: 'Sant Kabir Nagar', status: 'live' },
      { route: '/services/azamgarh', title: 'Azamgarh', status: 'live' },
      { route: '/services/mau', title: 'Mau', status: 'live' },
      { route: '/services/ballia', title: 'Ballia', status: 'live' },
      { route: '/services/jaunpur', title: 'Jaunpur', status: 'live' },
      { route: '/services/gonda', title: 'Gonda', status: 'live' },
      { route: '/services/bahraich', title: 'Bahraich', status: 'live' },
      { route: '/services/sultanpur', title: 'Sultanpur', status: 'live' },
      { route: '/services/varanasi', title: 'Varanasi', status: 'live' },
      { route: '/services/lucknow', title: 'Lucknow', status: 'live' },
      { route: '/services/prayagraj', title: 'Prayagraj', status: 'live' },
    ],
  },
  {
    category: 'Calculators & Tools (8)',
    pages: [
      { route: '/calculators/premium', title: 'Premium Calculator', status: 'live' },
      { route: '/calculators/maturity', title: 'Maturity Calculator', status: 'live' },
      { route: '/calculators/life-insurance', title: 'Life Cover Calculator', status: 'live' },
      { route: '/calculators/retirement', title: 'Retirement Calculator', status: 'live' },
      { route: '/calculators/surrender-value', title: 'Surrender Value Calculator', status: 'live' },
      { route: '/calculators/loan', title: 'Policy Loan Calculator', status: 'live' },
      { route: '/calculators/policy-health', title: 'Policy Health Checker', status: 'live' },
      { route: '/analyzers/policy-document', title: 'AI Policy Analyzer', status: 'live' },
    ],
  },
  {
    category: 'AI & Special Pages',
    pages: [
      { route: '/ai-advisor', title: 'Poddar Ji AI Advisor', status: 'live' },
      { route: '/insurance-quiz', title: 'Insurance Quiz', status: 'live' },
      { route: '/bima-sugam', title: 'Bima Sugam Info', status: 'live' },
      { route: '/lic-help', title: 'LIC Help Center', status: 'live' },
      { route: '/lic-bonus', title: 'LIC Bonus Info', status: 'live' },
      { route: '/policy-revival', title: 'Policy Revival Guide', status: 'live' },
      { route: '/premium-reminder', title: 'Premium Reminder', status: 'live' },
      { route: '/plans/nav-jeevan-shree', title: 'Nav Jeevan Shree Plan', status: 'live' },
      { route: '/best-plan/[age]', title: 'Best Plan by Age (6 pages)', status: 'live' },
    ],
  },
  {
    category: 'API Routes (17)',
    pages: [
      { route: '/api/chat', title: 'AI Chat (Groq streaming)', status: 'live' },
      { route: '/api/leads', title: 'Lead Capture → Sheets + CSV', status: 'live' },
      { route: '/api/blueprint', title: 'Wealth Blueprint Form', status: 'live' },
      { route: '/api/newsletter/subscribe', title: 'Newsletter Subscribe (Resend)', status: 'live' },
      { route: '/api/track', title: 'GA4 Event Tracking', status: 'live' },
      { route: '/api/reviews', title: 'Reviews (1hr cache)', status: 'live' },
      { route: '/api/health', title: 'Health Check', status: 'live' },
      { route: '/api/admin/auth', title: 'Admin Auth', status: 'new' },
      { route: '/api/admin/plan-flags', title: 'Plan Flag Management', status: 'live' },
      { route: '/api/analyzers/policy-document', title: 'PDF Policy Analyzer (Groq)', status: 'live' },
      { route: '/api/reports/wealth-blueprint', title: 'PDF Report Generator', status: 'live' },
      { route: '/api/calculators/*', title: 'Calculator APIs (4 routes)', status: 'live' },
      { route: '/api/blog/[slug]', title: 'Blog Content API', status: 'live' },
      { route: '/api/lic-plans', title: 'LIC Plans Data', status: 'live' },
      { route: '/api/nav', title: 'NAV Data', status: 'live' },
      { route: '/api/cron/check-plan-status', title: 'Plan Status Cron (1st & 15th)', status: 'live' },
      { route: '/api/cron/refresh-nav', title: 'NAV Refresh Cron (weekdays)', status: 'live' },
    ],
  },
];

const userJourneys = [
  {
    name: 'First-time visitor → lead',
    steps: ['Homepage', 'Hero CTA / ExitIntentPopup', 'Lead Form (BaseLeadForm)', '/api/leads', 'Google Sheets + Admin Notify'],
  },
  {
    name: 'Premium calculation → conversion',
    steps: ['Homepage / Products', '/calculators/premium', 'Enter details → ResultsPanel', 'Phone unlock → Lead capture', '/api/leads (intent: calc unlock)'],
  },
  {
    name: 'Blog reader → consultation',
    steps: ['/blog (search/filter)', '/blog/[slug] (read post)', 'Related Articles CTA', 'WhatsApp CTA (9415313434)', 'Optional: lead form'],
  },
  {
    name: 'AI advisor conversation',
    steps: ['Any page → Chatbot FAB', 'Groq llama-3.3-70b-versatile (≤10 msg memory)', 'Poddar Ji responds bilingually', 'Chat lead capture (if asked name/phone)', '/api/leads (intent: chat lead)'],
  },
  {
    name: 'Policy document upload',
    steps: ['/analyzers/policy-document', 'Upload PDF (≤5MB)', '/api/analyzers/policy-document (Groq)', 'Structured analysis returned', 'CTA: speak to Poddar Ji'],
  },
];

const statusColors: Record<PageStatus, string> = {
  live: 'bg-green-900 text-green-400',
  new: 'bg-amber-900 text-amber-400',
  pending: 'bg-gray-800 text-gray-400',
};

export default function ArchitecturePage() {
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">Site Architecture</h1>
        <p className="text-gray-500 text-sm">Complete page inventory + user journey flows</p>
      </div>

      {/* Site sections */}
      {siteSections.map(section => (
        <section key={section.category}>
          <h2 className="text-gray-400 text-xs uppercase tracking-widest mb-3">{section.category}</h2>
          <div className="bg-gray-900 border border-gray-800 rounded-xl divide-y divide-gray-800">
            {section.pages.map(page => (
              <div key={page.route} className="flex items-center justify-between px-5 py-3 gap-4">
                <code className="text-amber-400 text-xs font-mono shrink-0">{page.route}</code>
                <span className="text-gray-300 text-sm flex-1">{page.title}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[page.status]}`}>
                  {page.status}
                </span>
              </div>
            ))}
          </div>
        </section>
      ))}

      {/* User journeys */}
      <section>
        <h2 className="text-gray-400 text-xs uppercase tracking-widest mb-3">User Journeys</h2>
        <div className="space-y-4">
          {userJourneys.map(journey => (
            <div key={journey.name} className="bg-gray-900 border border-gray-800 rounded-xl p-5">
              <p className="text-white font-medium text-sm mb-3">{journey.name}</p>
              <div className="flex flex-wrap items-center gap-2">
                {journey.steps.map((step, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="bg-gray-800 text-gray-300 text-xs px-3 py-1.5 rounded-lg">{step}</span>
                    {i < journey.steps.length - 1 && (
                      <span className="text-gray-600">→</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
