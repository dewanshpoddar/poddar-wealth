'use client'
import { Star } from 'lucide-react'

interface TestimonialData {
  quote: string
  author: string
  location: string
  policy: string
  rating: number
}

interface ServiceTestimonialProps {
  testimonial: TestimonialData
  lang: 'en' | 'hi' | 'bn'
}

export default function ServiceTestimonial({
  testimonial,
  lang,
}: ServiceTestimonialProps) {
  // Extract initials for the avatar
  const getInitials = (name: string) => {
    if (!name) return 'PW'
    const parts = name.split(' ')
    if (parts.length > 1) {
      return (parts[0][0] + parts[1][0]).toUpperCase()
    }
    return name.slice(0, 2).toUpperCase()
  }

  const initials = getInitials(testimonial.author)

  // Deterministic gradient selection based on author name
  const gradients = [
    'from-blue-600 to-navy-light',
    'from-amber-600 to-orange-600',
    'from-emerald-600 to-teal-600',
    'from-purple-600 to-indigo-600',
  ]
  const charCodeSum = testimonial.author.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0)
  const gradient = gradients[charCodeSum % gradients.length]

  return (
    <section className="py-24 bg-white text-navy relative overflow-hidden border-t border-b border-gray-150/40">
      <div className="max-w-4xl mx-auto px-6 text-center relative">
        {/* Decorative Quote Mark */}
        <div className="absolute top-[-40px] left-1/2 -translate-x-1/2 select-none font-display font-bold text-[160px] leading-none text-gold/10 pointer-events-none z-0">
          “
        </div>

        <div className="relative z-10">
          {/* Star Rating */}
          {testimonial.rating && (
            <div className="flex items-center justify-center gap-1 mb-8 animate-fade-in">
              {Array.from({ length: testimonial.rating }).map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-gold text-gold" />
              ))}
            </div>
          )}

          {/* Testimonial Quote */}
          <blockquote className="font-display italic text-20 md:text-[28px] leading-[1.4] text-navy/90 max-w-3xl mx-auto mb-10 tracking-tight">
            &ldquo;{testimonial.quote}&rdquo;
          </blockquote>

          {/* Customer info */}
          <div className="flex flex-col items-center">
            {/* Gradient initials avatar */}
            <div
              className={`w-14 h-14 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center text-white font-bold text-16 shadow-md mb-4`}
            >
              {initials}
            </div>

            <div className="font-bold text-15 text-navy tracking-tight">
              {testimonial.author}
            </div>
            
            <div className="text-12 text-slate-500 font-bold uppercase tracking-widest mt-1">
              {testimonial.location} &middot; {testimonial.policy}
            </div>

            {/* TODO: Replace with real testimonial from Ajay sir */}
          </div>
        </div>
      </div>
    </section>
  )
}
