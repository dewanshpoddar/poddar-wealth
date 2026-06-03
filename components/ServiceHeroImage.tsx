import { 
  Shield, HeartPulse, Calculator, GraduationCap, Landmark, 
  Users, MapPin, ShieldCheck, Stethoscope, LucideIcon 
} from 'lucide-react'

type ServiceHeroImageProps = {
  category: string
  className?: string
}

const heroConfig: Record<string, { bg: string; Icon: LucideIcon }> = {
  'life-insurance': { bg: 'bg-blue-950', Icon: Shield },
  'health-insurance': { bg: 'bg-emerald-900', Icon: HeartPulse },
  'tax-planning': { bg: 'bg-violet-950', Icon: Calculator },
  'child-planning': { bg: 'bg-teal-900', Icon: GraduationCap },
  'retirement': { bg: 'bg-amber-900', Icon: Landmark },
  'become-advisor': { bg: 'bg-gray-900', Icon: Users },
  'area-service': { bg: 'bg-gray-800', Icon: MapPin },
  'personal-accident': { bg: 'bg-orange-900', Icon: ShieldCheck },
  'cancer-cover': { bg: 'bg-rose-900', Icon: Stethoscope },
  'term-life': { bg: 'bg-indigo-950', Icon: ShieldCheck },
  'group-health': { bg: 'bg-cyan-900', Icon: Users },
}

export default function ServiceHeroImage({ category, className = '' }: ServiceHeroImageProps) {
  const config = heroConfig[category] || { bg: 'bg-slate-900', Icon: Shield }
  const Icon = config.Icon

  return (
    <div className={`relative flex items-center justify-center overflow-hidden ${config.bg} ${className}`}>
      {/* Radial overlay for depth */}
      <div 
        className="absolute inset-0 pointer-events-none" 
        style={{ backgroundImage: 'radial-gradient(circle at center, rgba(255,255,255,0.08) 0%, rgba(0,0,0,0.3) 100%)' }} 
      />
      {/* Centered Lucide icon */}
      <Icon className="w-12 h-12 text-white/20 select-none" />
    </div>
  )
}
