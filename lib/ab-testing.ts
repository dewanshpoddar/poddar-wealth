/**
 * A/B Testing utilities for Poddar Wealth Management
 *
 * Deterministic variant assignment based on testName + userId hash.
 * Same user always gets the same variant for the same test.
 */

export function getVariant(testName: string, userId: string): 'A' | 'B' {
  const hash = simpleHash(testName + userId)
  return hash % 2 === 0 ? 'A' : 'B'
}

function simpleHash(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i)
    hash = hash & hash
  }
  return Math.abs(hash)
}
