import { describe, expect, it } from 'vitest'
import { getOverviewZoom, getNucleusVisibility, getStellarBodyVisibility } from '../cinematicAppearance'

describe('galaxy overview framing', () => {
  it('stops drawing unresolved light once the camera is inside its zero-opacity region', () => {
    expect(getStellarBodyVisibility(0.2, 1)).toBe(0)
    expect(getStellarBodyVisibility(0.35, 1)).toBe(0)
    expect(getStellarBodyVisibility(2.4, 1)).toBe(1)
    expect(getStellarBodyVisibility(0.825, 1)).toBeCloseTo(0.5)
    expect(getStellarBodyVisibility(825, 1000)).toBeCloseTo(0.5)
  })
  it.each([0.45, 1, 16 / 9, 3])('fits the full galaxy with a margin at aspect %s', (aspect) => {
    const halfVertical = Math.PI / 6
    const halfHorizontal = Math.atan(Math.tan(halfVertical) * aspect)
    const distanceInRadii = 1.7 / getOverviewZoom(aspect)
    const angularRadius = Math.asin(1 / distanceInRadii)
    expect(angularRadius).toBeLessThan(Math.min(halfVertical, halfHorizontal) * 0.9)
    expect(angularRadius).toBeGreaterThan(Math.min(halfVertical, halfHorizontal) * 0.65)
  })

  it('keeps the nucleus detail hidden at overview distance and reveals it on approach', () => {
    expect(getNucleusVisibility(3, 1)).toBe(0)
    expect(getNucleusVisibility(0.2, 1)).toBe(1)
    expect(getNucleusVisibility(0.5, 1)).toBeGreaterThan(0)
    expect(getNucleusVisibility(0.5, 1)).toBeLessThan(1)
    expect(getNucleusVisibility(500, 1000)).toBe(getNucleusVisibility(0.5, 1))
  })
})
