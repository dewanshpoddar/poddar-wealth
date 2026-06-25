'use client'
import { useLang } from '@/lib/LangContext'

const sections = [
  {
    title: 'Nature of Service',
    body: `Poddar Wealth Management provides general insurance advisory and financial planning information through this website. Ajay Kumar Poddar is a licensed IRDAI agent authorised to sell LIC of India and Star Health Insurance products. Any recommendation made through this website or a personal consultation is advisory in nature and does not constitute a binding contract. Final policy terms are governed by the respective insurer's policy document.`,
  },
  {
    title: 'Website Content - For Information Only',
    body: `All content on this website - including calculator outputs, plan comparisons, premium estimates, and wealth projections - is for illustrative and educational purposes only. It does not constitute investment advice, tax advice, or a recommendation to purchase any specific product. Actual premiums, returns, and benefits depend on age, health, insurer underwriting, and applicable IRDAI regulations at the time of purchase.`,
  },
  {
    title: 'Calculator Accuracy',
    body: `Our calculators (Wealth Blueprint Calculator, Premium Calculator, Life Insurance Calculator, Retirement Calculator) use publicly available actuarial assumptions and standard financial models. Results are approximate. Do not make financial decisions based solely on calculator outputs. Always consult a qualified financial advisor and read the product brochure before purchasing.`,
  },
  {
    title: 'IRDAI Compliance',
    body: `Ajay Kumar Poddar is an IRDAI-authorised insurance agent. He is not an insurance company, corporate broker, or registered investment advisor. Products recommended are issued directly by LIC of India and Star Health Insurance and are subject to their respective terms, conditions, and exclusions. No returns, bonuses, or maturity benefits are guaranteed by Poddar Wealth Management. All guarantees are the liability of the issuing insurer only.`,
  },
  {
    title: 'AI Advisor Disclaimer',
    body: `Poddar Ji (our AI Advisor) is powered by the Groq API (llama-3.3-70b-versatile model) and is designed to provide general guidance on insurance and wealth planning. It is not a licensed financial advisor. Responses from the AI are informational only and should not be treated as professional financial, legal, or tax advice. Always verify AI responses with Ajay Kumar Poddar or another licensed advisor before acting on them.`,
  },
  {
    title: 'No Guarantee of Availability',
    body: `We strive to keep this website available at all times but do not guarantee uninterrupted access. Maintenance, updates, or unforeseen technical issues may cause temporary unavailability. We are not liable for losses resulting from website downtime.`,
  },
  {
    title: 'Third-Party Links',
    body: `This website may contain links to LIC of India, Star Health Insurance, and other third-party websites. We are not responsible for the content, accuracy, or privacy practices of those sites. Visiting linked sites is at your own risk.`,
  },
  {
    title: 'Intellectual Property',
    body: `All content on this website - including text, images, logo, design, and calculator logic - is the property of Poddar Wealth Management. You may not reproduce, distribute, or commercialise any content without written permission.`,
  },
  {
    title: 'Limitation of Liability',
    body: `To the maximum extent permitted by applicable law, Poddar Wealth Management shall not be liable for any indirect, incidental, or consequential losses arising from use of this website, reliance on calculator outputs, or AI advisor responses. Our total liability for any claim shall not exceed ₹1,000.`,
  },
  {
    title: 'Governing Law',
    body: `These terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of courts in Gorakhpur, Uttar Pradesh, India.`,
  },
  {
    title: 'Contact',
    body: `For questions about these terms:\n\nPoddar Wealth Management\nAD Mall Compound, Vijay Chowk, Gorakhpur, UP 273001\nPhone / WhatsApp: +91 94153 13434\nEmail: poddarwealth@gmail.com\n\nIRDAI Authorised Agent.`,
  },
]

export default function TermsPage() {
  const { t } = useLang()

  return (
    <div className="pt-20 min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-navy py-14 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-2 text-sm font-medium text-white mb-5">
            {t.terms.badge}
          </div>
          <h1 className="font-display font-bold text-4xl text-white mb-3">{t.terms.title}</h1>
          <p className="text-white/60 text-sm">{t.terms.lastUpdated}</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <p className="text-slate-600 text-base leading-relaxed mb-10 p-5 bg-gold/5 border border-gold/20 rounded-2xl">
            {t.terms.intro}
          </p>

          <div className="space-y-10">
            {sections.map((s, i) => (
              <div key={i}>
                <h2 className="font-display font-bold text-xl text-slate-900 mb-3 flex items-center gap-3">
                  <span className="w-7 h-7 rounded-full bg-navy/10 text-navy text-[12px] font-bold flex items-center justify-center flex-shrink-0">
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
