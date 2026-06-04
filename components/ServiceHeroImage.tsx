import {
  Shield, HeartPulse, Calculator, GraduationCap, Landmark,
  Users, MapPin, ShieldCheck, Stethoscope, LucideIcon
} from 'lucide-react'

type ServiceHeroImageProps = {
  category: string
  className?: string
}

const heroConfig: Record<string, { bg: string; Icon: LucideIcon; label: string }> = {
  'life-insurance':    { bg: 'bg-blue-950',    Icon: Shield,       label: 'Life Insurance' },
  'health-insurance':  { bg: 'bg-emerald-900', Icon: HeartPulse,   label: 'Health Insurance' },
  'tax-planning':      { bg: 'bg-violet-950',  Icon: Calculator,   label: 'Tax Planning' },
  'child-planning':    { bg: 'bg-teal-900',    Icon: GraduationCap,label: 'Child Planning' },
  'retirement':        { bg: 'bg-amber-900',   Icon: Landmark,     label: 'Retirement' },
  'become-advisor':    { bg: 'bg-gray-900',    Icon: Users,        label: 'Become Advisor' },
  'area-service':      { bg: 'bg-gray-800',    Icon: MapPin,       label: 'Local Service' },
  'personal-accident': { bg: 'bg-orange-900', Icon: ShieldCheck,  label: 'Personal Accident' },
  'cancer-cover':      { bg: 'bg-rose-900',    Icon: Stethoscope,  label: 'Cancer Cover' },
  'term-life':         { bg: 'bg-indigo-950',  Icon: ShieldCheck,  label: 'Term Life' },
  'group-health':      { bg: 'bg-cyan-900',    Icon: Users,        label: 'Group Health' },
}

export default function ServiceHeroImage({ category, className = '' }: ServiceHeroImageProps) {
  const config = heroConfig[category] || { bg: 'bg-slate-900', Icon: Shield, label: 'Insurance' }
  const Icon = config.Icon

  return (
    <div className={`relative flex flex-col items-center justify-center overflow-hidden ${config.bg} min-h-[192px] ${className}`}>
      {/* Gradient depth overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-black/30 pointer-events-none" />
      {/* Dot texture */}
      <div
        className="absolute inset-0 opacity-[0.08] pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '20px 20px' }}
      />
      {/* Icon + label */}
      <div className="relative flex flex-col items-center gap-3 z-10">
        <Icon size={56} className="text-white/40" />
        <span className="text-white/40 text-xs font-semibold uppercase tracking-[0.15em]">
          {config.label}
        </span>
      </div>
    </div>
  )
}
