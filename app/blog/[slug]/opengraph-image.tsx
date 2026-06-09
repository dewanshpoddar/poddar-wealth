import { ImageResponse } from 'next/og'
import posts from '@/lib/data/blog-index.json'

export const runtime = 'edge'
export const alt = 'Poddar Wealth Management Blog'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image({ params }: { params: Promise<{ slug: string }> | { slug: string } }) {
  // Support both Promise and sync params just in case of differences across Next.js versions
  const resolvedParams = 'then' in params ? await params : params
  const { slug } = resolvedParams
  
  const post = posts.find((p) => p.slug === slug)
  const title = post ? post.title : slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
  const category = post ? post.category : 'Blog'

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

          {/* Top row: badge + blog marker */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <div style={{
              background: 'rgba(201,169,110,0.15)',
              border: '1px solid rgba(201,169,110,0.4)',
              borderRadius: '100px',
              padding: '6px 16px',
              color: '#c9a96e',
              fontSize: '14px',
              fontWeight: 600,
              display: 'flex',
              textTransform: 'uppercase',
              letterSpacing: '1px',
            }}>
              {category}
            </div>
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '16px', fontWeight: 500, letterSpacing: '2px', textTransform: 'uppercase', display: 'flex' }}>
              Poddar Wealth Blog
            </div>
          </div>

          {/* Main Title section */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '40px', marginBottom: '40px' }}>
            <div style={{ color: '#ffffff', fontSize: '44px', fontWeight: 700, lineHeight: 1.25, display: 'flex', maxHeight: '220px', overflow: 'hidden' }}>
              {title}
            </div>
            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '20px', display: 'flex' }}>
              Expert Financial Insights & Planning Strategies
            </div>
          </div>

          {/* Bottom row: author + CTA */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', width: '100%' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', display: 'flex' }}>Published by Ajay Kumar Poddar</div>
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
              Read Article →
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size }
  )
}
