'use client'

interface Step {
  num: string
  title: string
  desc: string
}

interface HowItWorksProps {
  title: string
  steps: Step[]
}

export default function HowItWorks({ title, steps }: HowItWorksProps) {
  return (
    <section className="py-24 bg-white text-navy relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 text-center relative z-10">
        <h2 className="font-display font-bold text-3xl md:text-4xl mb-16 tracking-tight">
          {title}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16 relative">
          {/* Connecting SVG Line for Desktop */}
          <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-0.5 border-t border-dashed border-gold/40 z-0" />

          {steps.map((step, idx) => (
            <div key={idx} className="flex flex-col items-center text-center relative z-10 group">
              {/* Step Circle */}
              <div className="w-20 h-20 rounded-full bg-cream border-2 border-gold flex items-center justify-center font-display font-bold text-2xl text-gold mb-6 shadow-gold-sm group-hover:scale-105 transition-transform duration-350">
                {step.num}
              </div>

              {/* Step Content */}
              <h3 className="text-xl font-bold mb-3 tracking-tight text-navy">
                {step.title}
              </h3>
              
              <p className="text-14 text-slate-500 font-medium leading-relaxed max-w-xs">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
