import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Poddar Wealth Management — Trusted Insurance Advisory Since 1994'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          display: 'flex',
          background: '#1a2744',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Gold accent bar - left edge */}
        <div style={{ position: 'absolute', left: 0, top: 0, width: '8px', height: '100%', background: '#c9a96e', display: 'flex' }} />

        {/* Subtle radial glow */}
        <div style={{
          position: 'absolute', top: '-100px', right: '-100px',
          width: '600px', height: '600px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(201,169,110,0.12) 0%, transparent 70%)',
          display: 'flex',
        }} />

        {/* Content */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '60px 80px 60px 88px', width: '100%' }}>

          {/* Top row: badges */}
          <div style={{ display: 'flex', gap: '12px' }}>
            {['MDRT Member', "LIC Chairman's Club", '30+ Years'].map((badge) => (
              <div key={badge} style={{
                background: 'rgba(201,169,110,0.15)',
                border: '1px solid rgba(201,169,110,0.4)',
                borderRadius: '100px',
                padding: '6px 16px',
                color: '#c9a96e',
                fontSize: '14px',
                fontWeight: 600,
                display: 'flex',
              }}>
                {badge}
              </div>
            ))}
          </div>

          {/* Main headline */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ color: '#c9a96e', fontSize: '18px', fontWeight: 600, letterSpacing: '3px', textTransform: 'uppercase', display: 'flex' }}>
              Poddar Wealth Management
            </div>
            <div style={{ color: '#ffffff', fontSize: '52px', fontWeight: 700, lineHeight: 1.15, display: 'flex', flexDirection: 'column' }}>
              <span>Protecting Families</span>
              <span style={{ color: '#c9a96e' }}>Since 1994</span>
            </div>
            <div style={{ color: 'rgba(255,255,255,0.65)', fontSize: '22px', lineHeight: 1.5, display: 'flex' }}>
              Expert LIC · Health · Wealth Planning · Gorakhpur, UP
            </div>
          </div>

          {/* Bottom row: contact + CTA */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', display: 'flex' }}>Ajay Kumar Poddar</div>
              <div style={{ color: '#c9a96e', fontSize: '20px', fontWeight: 600, display: 'flex' }}>📞 94153 13434</div>
            </div>
            <div style={{
              background: '#c9a96e',
              borderRadius: '12px',
              padding: '16px 32px',
              color: '#1a2744',
              fontSize: '18px',
              fontWeight: 700,
              display: 'flex',
            }}>
              Free Consultation →
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size }
  )
}
