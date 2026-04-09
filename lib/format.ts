/**
 * Formats a number as a currency string with Indian units (Lakh, Crore).
 */
export function fmt(n: number) {
  if (!n && n !== 0) return '—'
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(2)} Cr`
  if (n >= 100000)   return `₹${(n / 100000).toFixed(1)} L`
  return `₹${Math.round(n).toLocaleString('en-IN')}`
}

/**
 * Formats Sum Assured specifically (usually simpler rounding).
 */
export function fmtSA(n: number) {
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(1)} Cr`
  if (n >= 100000)   return `₹${(n / 100000).toFixed(0)} L`
  return `₹${n.toLocaleString('en-IN')}`
}

/**
 * Converts a large number to its word representation (Thousands, Lakhs, Crores).
 */
export function toWords(n: number): string {
  if (!n) return ''
  if (n >= 10000000) return `${(n / 10000000) % 1 === 0 ? n / 10000000 : (n / 10000000).toFixed(1)} Crore`
  if (n >= 100000)   return `${(n / 100000) % 1 === 0 ? n / 100000 : (n / 100000).toFixed(1)} Lakh`
  if (n >= 1000)     return `${Math.round(n / 1000)} Thousand`
  return String(n)
}
