/**
 * cn() — class name utility
 * Combines clsx (conditional classes) + tailwind-merge (deduplication)
 * This is the standard pattern used by shadcn/ui, 21st.dev, Radix, etc.
 *
 * Usage:
 *   cn('px-4 py-2', isActive && 'bg-gold', className)
 *   cn('text-white', variant === 'dark' && 'bg-navy', 'rounded-md')
 */
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
