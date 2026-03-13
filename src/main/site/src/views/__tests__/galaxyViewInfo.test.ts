import { describe, expect, it } from 'vitest'
import { getGalaxyViewInfoKey } from '../galaxyViewInfo'

describe('getGalaxyViewInfoKey', () => {
  it('returns the band-guided variant when NSA data is available', () => {
    expect(getGalaxyViewInfoKey(true)).toBe('bandGuided')
  })

  it('returns the fallback variant when NSA data is unavailable', () => {
    expect(getGalaxyViewInfoKey(false)).toBe('proceduralFallback')
  })
})
