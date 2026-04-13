export const metadata = {
  title: 'Privacy Policy — Poddar Wealth Management',
  description: 'How Poddar Wealth Management collects, uses, and protects your personal information.',
}

const sections = [
  {
    title: 'Information We Collect',
    body: `When you fill a form on our website, we collect your name, mobile number, email address (where provided), and details about your insurance or financial planning inquiry. We also collect the city you are based in and a brief description of your goals. We do not collect payment information, Aadhaar, PAN, or any government-issued identification through this website.`,
  },
  {
    title: 'How We Use Your Information',
    body: `Your information is used solely to contact you regarding your insurance or wealth planning inquiry. Ajay Kumar Poddar or a member of his advisory team will call or message you on the number provided. We do not use your information for automated marketing campaigns, unsolicited calls, or any purpose unrelated to your original inquiry.`,
  },
  {
    title: 'Data Storage',
    body: `Form submissions are stored securely in a private spreadsheet accessible only to Ajay Kumar Poddar and his direct team. Data is not transferred to third-party marketing platforms. We use an encrypted Google Apps Script webhook to log inquiries — data is stored in Google Workspace under our account.`,
  },
  {
    title: 'Third Parties',
    body: `We do not sell, rent, or share your personal information with third parties. We use Google Sheets (via Apps Script) for internal CRM purposes only. Our website is hosted on Vercel, which processes server logs in accordance with their privacy policy. Our AI Advisor (Poddar Ji) uses the Anthropic Claude API to respond to your questions — chat messages are processed by Anthropic and are subject to their data handling policies.`,
  },
  {
    title: 'Cookies',
    body: `Our website uses only essential cookies required for navigation and language preference storage. We do not use advertising cookies, tracking pixels, or cross-site behavioural analytics. We do not use Google Analytics or Facebook Pixel.`,
  },
  {
    title: 'Your Rights',
    body: `You may request deletion of your personal data at any time by calling or WhatsApp messaging us at +91 94153 13434 or emailing us at the address in our footer. We will confirm deletion within 7 business days.`,
  },
  {
    title: 'Children',
    body: `Our services are intended for adults (18+). We do not knowingly collect information from minors. If you believe a minor has submitted information, please contact us immediately.`,
  },
  {
    title: 'Changes to This Policy',
    body: `We may update this policy as required by law or changes in our operations. The "Last updated" date at the top of this page will reflect any changes. Continued use of our website after changes constitutes acceptance.`,
  },
  {
    title: 'Contact',
    body: `For any privacy-related questions: Call/WhatsApp +91 94153 13434 or visit our Contact page. Poddar Wealth Management, Gorakhpur, Uttar Pradesh, India. IRDAI Authorised Agent.`,
  },
]

export default function PrivacyPolicyPage() {
  return (
    <div className="pt-20 min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-navy py-14 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-2 text-sm font-medium text-white mb-5">
            🔒 Privacy Policy
          </div>
          <h1 className="font-display font-bold text-4xl text-white mb-3">Privacy Policy</h1>
          <p className="text-white/60 text-sm">Last updated: April 2026</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <p className="text-slate-600 text-base leading-relaxed mb-10 p-5 bg-gold/5 border border-gold/20 rounded-2xl">
            Poddar Wealth Management is committed to protecting the privacy of every person who contacts us. This policy explains what information we collect, how it is used, and your rights. We do not sell your data. Ever.
          </p>

          <div className="space-y-10">
            {sections.map((s, i) => (
              <div key={i}>
                <h2 className="font-display font-bold text-xl text-slate-900 mb-3 flex items-center gap-3">
                  <span className="w-7 h-7 rounded-full bg-gold/10 text-gold text-[12px] font-bold flex items-center justify-center flex-shrink-0">
                    {i + 1}
                  </span>
                  {s.title}
                </h2>
                <p className="text-slate-600 leading-relaxed pl-10">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
