'use client'
import { useLang } from '@/lib/LangContext'

export default function Footer() {
  const { t } = useLang()

  return (
    <footer className="pw-footer">
      <div>
        <div className="pw-footer-brand">{t.footer.brand}</div>
        <div className="pw-footer-address">{t.footer.address}</div>
        <div className="pw-footer-contact">{t.footer.contact}</div>
        <div className="pw-footer-disclaimer">{t.footer.disclaimer}</div>
      </div>
      <div className="flex flex-col gap-2 items-end">
        <a
          href={`https://wa.me/${t.whatsapp.number}`}
          target="_blank"
          rel="noopener noreferrer"
          className="pw-btn pw-btn--whatsapp"
        >
          {t.footer.whatsapp}
        </a>
        <div className="text-10 text-muted">{t.footer.rights}</div>
      </div>
    </footer>
  )
}
