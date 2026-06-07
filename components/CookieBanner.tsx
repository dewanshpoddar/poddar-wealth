'use client'
import CookieConsent from 'react-cookie-consent'

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
  }
}

export default function CookieBanner() {
  return (
    <CookieConsent
      location="bottom"
      containerClasses="cookie-banner-container"
      buttonText="Accept"
      declineButtonText="Decline"
      enableDeclineButton
      cookieName="poddar-wealth-consent"
      style={{
        background: '#111827',
        borderTop: '1px solid #1F2937',
        padding: '12px 20px',
        fontSize: '13px',
        zIndex: 9999,
        alignItems: 'center',
      }}
      buttonStyle={{
        background: '#F59E0B',
        color: '#fff',
        borderRadius: '8px',
        padding: '8px 20px',
        fontSize: '13px',
        fontWeight: '600',
      }}
      declineButtonStyle={{
        background: 'transparent',
        border: '1px solid #4B5563',
        color: '#9CA3AF',
        borderRadius: '8px',
        padding: '8px 20px',
        fontSize: '13px',
      }}
      onAccept={() => {
        if (typeof window !== 'undefined' && window.gtag) {
          window.gtag('consent', 'update', { analytics_storage: 'granted' })
        }
      }}
      onDecline={() => {
        if (typeof window !== 'undefined' && window.gtag) {
          window.gtag('consent', 'update', { analytics_storage: 'denied' })
        }
      }}
    >
      We use cookies to improve your experience.{' '}
      <a href="/privacy-policy" style={{ color: '#F59E0B', textDecoration: 'underline' }}>
        Privacy Policy
      </a>
    </CookieConsent>
  )
}
