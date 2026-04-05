'use client'
import { useLang } from '@/lib/LangContext'

export default function TrustSection() {
  const { t } = useLang()

  return (
    <>
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
