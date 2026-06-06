'use client'
import { useLang } from '@/lib/LangContext'

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
    body: `Form submissions are stored securely in a private Google Sheets spreadsheet accessible only to Ajay Kumar Poddar and his direct team. Data is not transferred to third-party marketing platforms. We use an encrypted Google Apps Script webhook to log inquiries — data is stored in Google Workspace under our account.`,
  },
  {
    title: 'Google Analytics',
    body: `Our website uses Google Analytics 4 (GA4) to understand how visitors use the site — pages visited, session duration, and general geographic region. GA4 data is aggregated and does not personally identify you. No advertising features or remarketing lists are enabled.\n\nGA4 only activates after you accept cookies via our consent banner. If you decline, analytics tracking stays off for your visit. You can also opt out at any time using the Google Analytics Opt-out Browser Add-on at tools.google.com/dlpage/gaoptout.`,
  },
  {
    title: 'Third Parties',
    body: `We do not sell, rent, or share your personal information with third parties for commercial purposes. Our website is hosted on Vercel, which processes server logs in accordance with their privacy policy. Google Workspace is used for internal CRM and data storage purposes only.`,
  },
  {
    title: 'AI Advisor (Poddar Ji)',
    body: `Our AI Advisor "Poddar Ji" is powered by the Groq API (llama-3.3-70b-versatile model). Chat messages you send are processed by Groq Inc. and are subject to their data handling policies. We do not store chat transcripts linked to your personal identity. The AI advisor does not have access to your form submissions or contact details.`,
  },
  {
    title: 'Cookies',
    body: `We use two types of cookies. Essential cookies keep the site working — your language preference (Hindi/English) and session state. These can't be disabled.\n\nAnalytics cookies (via GA4) are optional. We ask for your consent via the banner at the bottom of the page. Accept to help us improve the site; decline and GA4 won't run. Your choice is remembered for 30 days.`,
  },
  {
    title: 'WhatsApp Contact',
    body: `When you contact us via WhatsApp, your phone number and messages are processed through Meta's WhatsApp platform, subject to Meta's privacy policy. We use this information only to respond to your insurance inquiry and provide advisory services. We don't add you to broadcast lists without your explicit request.`,
  },
  {
    title: 'Lead Forms',
    body: `Information you submit through our contact forms — name, phone number, and insurance needs — is stored securely in a private Google Sheets spreadsheet. This data is not shared with third parties or used for automated marketing. We retain contact information for up to 2 years, after which it is deleted. You can request deletion at any time by contacting us directly.`,
  },
  {
    title: 'Your Rights',
    body: `You may request deletion of your personal data at any time by calling or WhatsApp messaging us at +91 94153 13434 or emailing poddarwealth@gmail.com. We will confirm deletion within 7 business days.`,
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
    body: `For any privacy-related questions or data deletion requests:\n\nPoddar Wealth Management\nAD Mall Compound, Vijay Chowk, Gorakhpur, UP 273001\nPhone / WhatsApp: +91 94153 13434\nEmail: poddarwealth@gmail.com\n\nIRDAI Authorised Agent.`,
  },
]

export default function PrivacyPolicyPage() {
  const { t } = useLang()

  return (
    <div className="pt-20 min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-navy py-14 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-2 text-sm font-medium text-white mb-5">
            {t.privacyPolicy.badge}
          </div>
          <h1 className="font-display font-bold text-4xl text-white mb-3">{t.privacyPolicy.title}</h1>
          <p className="text-white/60 text-sm">{t.privacyPolicy.lastUpdated}</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <p className="text-slate-600 text-base leading-relaxed mb-10 p-5 bg-gold/5 border border-gold/20 rounded-2xl">
            {t.privacyPolicy.intro}
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
                <p className="text-slate-600 leading-relaxed pl-10 whitespace-pre-line">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
