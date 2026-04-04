'use client'
import { useLang } from '@/lib/LangContext'

export default function TrustSection() {
  const { t } = useLang()

  return (
    <>
      {/* Trust Bar */}
      <div className="pw-trust-bar">
        {t.trust.stats.map((stat: any, i: number) => (
          <div key={i} className="pw-trust-item">
            <div className="pw-trust-num">{stat.num}</div>
            <div className="pw-trust-label">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Partner Bar */}
      <div className="pw-partner-bar">
        <span className="pw-partners-label">{t.trust.partnersLabel}</span>
        {t.trust.partners.map((partner: any, i: number) => (
          <div key={i} className="pw-partner-badge" style={{ color: partner.color }}>
            {partner.name}
          </div>
        ))}
      </div>
    </>
  )
}
