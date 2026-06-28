/**
 * Bilinear interpolation on LIC tabular rate grids.
 *
 * LIC brochures publish rates at fixed age/term breakpoints.
 * A 32-year-old with a 22-year term must be interpolated between
 * (30yr, 20yr) and (35yr, 25yr) — not snapped to nearest, which
 * causes 5–15% errors.
 */

import type { TabularRateGrid } from './types'

/**
 * Returns the interpolated rate per ₹1000 SA for the given age and term.
 * Falls back to nearest-neighbour only when the grid has a single breakpoint.
 */
export function interpolateRate(
  grid: TabularRateGrid,
  age: number,
  term: number,
): number {
  const ages = Object.keys(grid).map(Number).sort((a, b) => a - b)
  if (!ages.length) return 50 // grid is empty

  // Find surrounding age breakpoints
  const [ageLo, ageHi] = bracket(ages, age)

  if (ageLo === ageHi) {
    // Only one age band — interpolate on term only
    return interpolateTerm(grid[ageLo], term)
  }

  const rateLo = interpolateTerm(grid[ageLo], term)
  const rateHi = interpolateTerm(grid[ageHi], term)

  // Linear interpolation between the two age bands
  const t = (age - ageLo) / (ageHi - ageLo)
  return round(rateLo + t * (rateHi - rateLo))
}

function interpolateTerm(
  termMap: Record<number, number>,
  term: number,
): number {
  const terms = Object.keys(termMap).map(Number).sort((a, b) => a - b)
  if (!terms.length) return 50

  const [termLo, termHi] = bracket(terms, term)
  if (termLo === termHi) return termMap[termLo]

  const lo = termMap[termLo]
  const hi = termMap[termHi]
  const t = (term - termLo) / (termHi - termLo)
  return round(lo + t * (hi - lo))
}

/** Returns [lower, upper] bracketing breakpoints. If out of range, clamps. */
function bracket(sorted: number[], value: number): [number, number] {
  if (value <= sorted[0]) return [sorted[0], sorted[0]]
  if (value >= sorted[sorted.length - 1]) {
    const last = sorted[sorted.length - 1]
    return [last, last]
  }
  for (let i = 0; i < sorted.length - 1; i++) {
    if (value >= sorted[i] && value <= sorted[i + 1]) {
      return [sorted[i], sorted[i + 1]]
    }
  }
  const last = sorted[sorted.length - 1]
  return [last, last]
}

function round(n: number): number {
  return Math.round(n * 100) / 100
}

/**
 * GSV factor interpolation.
 * grid: policy_year → gsv_percent (e.g. {3: 30, 4: 35, 5: 50 ...})
 */
export function interpolateGSV(
  grid: Record<number, number>,
  policyYear: number,
): number {
  const years = Object.keys(grid).map(Number).sort((a, b) => a - b)
  if (!years.length) return 30 // fallback: 30% GSV

  const [lo, hi] = bracket(years, policyYear)
  if (lo === hi) return grid[lo]

  const t = (policyYear - lo) / (hi - lo)
  return round(grid[lo] + t * (grid[hi] - grid[lo]))
}
