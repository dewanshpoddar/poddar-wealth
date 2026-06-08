import { ADVISOR_PHONE } from './constants'

const SITE = 'https://poddarwealth.com'

export function getAutoReply(message: string): string | null {
  const m = message.toLowerCase().trim()

  if (/^(hi|hello|hey|helo|नमस्ते|नमस्कार|hii|helo)$/.test(m)) {
    return `Namaste! 🙏 Welcome to *Poddar Wealth Management*.

I'm Poddar Ji, your AI insurance advisor.

Here's what I can help you with:
• *1* — Premium Calculator
• *2* — LIC Plans & Products
• *3* — File a Claim
• *4* — Policy Renewal
• *5* — Speak to Ajay sir

Reply with a number or ask your question in Hindi or English.`
  }

  if (/premium|प्रीमियम|calculate|calculator/.test(m)) {
    return `To calculate your LIC premium instantly, visit:
${SITE}/calculators/premium

Or call Ajay sir on *${ADVISOR_PHONE}* for a personalised quote. 📞`
  }

  if (/claim|क्लेम|death|maturity|settlement/.test(m)) {
    return `For LIC claim support, here's a step-by-step guide:
${SITE}/claims

Need help right now? Call Ajay sir: *${ADVISOR_PHONE}*
He personally assists with every claim. 🙏`
  }

  if (/plan|plans|policy|policies|product|jeevan|endowment|term/.test(m)) {
    return `View all LIC plans with eligibility and benefits:
${SITE}/products

Compare plans side by side:
${SITE}/compare

For a personalised recommendation, call *${ADVISOR_PHONE}*.`
  }

  if (/renew|renewal|नवीनीकरण|lapse|lapsed/.test(m)) {
    return `Renew your LIC policy or revive a lapsed policy:
${SITE}/renew

Pay premium online directly:
${SITE}/pay-premium

Helpline: *${ADVISOR_PHONE}*`
  }

  if (/nav|ulip|fund|market/.test(m)) {
    return `Track your ULIP fund NAV daily:
${SITE}/calculators/policy-health

For investment advice tailored to your goals, call *${ADVISOR_PHONE}*.`
  }

  if (/refer|referral/.test(m)) {
    return `Refer a friend to Poddar Wealth and *both of you get a free policy review!*

Share your referral link:
${SITE}/?ref=YOUR_CODE

To get your personal referral code, WhatsApp your name to *${ADVISOR_PHONE}*.`
  }

  // No match — let AI handle it
  return null
}
