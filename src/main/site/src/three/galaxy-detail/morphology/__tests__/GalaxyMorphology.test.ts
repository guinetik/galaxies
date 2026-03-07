import { describe, it, expect } from 'vitest'
import {
  MORPHOLOGY_PRESETS,
  presetToCategory,
  type MorphologyPreset,
} from '../GalaxyMorphology'

describe('MORPHOLOGY_PRESETS', () => {
  const EXPECTED_PRESETS: MorphologyPreset[] = [
    'elliptical', 'lenticular',
    'spiralSa', 'spiral', 'grandDesign', 'flocculent',
    'barredTight', 'barred', 'barredOpen',
    'irregular',
  ]

  it('defines all 10 presets', () => {
    expect(Object.keys(MORPHOLOGY_PRESETS)).toHaveLength(10)
    for (const key of EXPECTED_PRESETS) {
      expect(MORPHOLOGY_PRESETS[key]).toBeDefined()
    }
  })

  it('spiral presets have numArms > 0 and no bar', () => {
    for (const key of ['spiralSa', 'spiral', 'grandDesign', 'flocculent'] as const) {
      const p = MORPHOLOGY_PRESETS[key]
      expect(p.numArms).toBeGreaterThan(0)
      expect(p.barLength).toBe(0)
    }
  })

  it('barred presets have barLength > 0', () => {
    for (const key of ['barredTight', 'barred', 'barredOpen'] as const) {
      const p = MORPHOLOGY_PRESETS[key]
      expect(p.barLength).toBeGreaterThan(0)
    }
  })

  it('elliptical has no arms, no bar, high ellipticity', () => {
    const p = MORPHOLOGY_PRESETS.elliptical
    expect(p.numArms).toBe(0)
    expect(p.barLength).toBe(0)
    expect(p.ellipticity).toBeGreaterThan(0)
  })

  it('irregular has high irregularity and clumpCount > 0', () => {
    const p = MORPHOLOGY_PRESETS.irregular
    expect(p.irregularity).toBeGreaterThan(0.3)
    expect(p.clumpCount).toBeGreaterThan(0)
  })

  it('all presets have fractional spatial params in 0-1 range', () => {
    for (const [, p] of Object.entries(MORPHOLOGY_PRESETS)) {
      expect(p.armWidth).toBeGreaterThanOrEqual(0)
      expect(p.armWidth).toBeLessThanOrEqual(1)
      expect(p.bulgeRadius).toBeGreaterThanOrEqual(0)
      expect(p.bulgeRadius).toBeLessThanOrEqual(1)
      expect(p.barLength).toBeGreaterThanOrEqual(0)
      expect(p.barLength).toBeLessThanOrEqual(1)
      expect(p.fieldStarFraction).toBeGreaterThanOrEqual(0)
      expect(p.fieldStarFraction).toBeLessThanOrEqual(1)
    }
  })
})

describe('presetToCategory', () => {
  it('maps spiral presets to spiral', () => {
    expect(presetToCategory('spiralSa')).toBe('spiral')
    expect(presetToCategory('spiral')).toBe('spiral')
    expect(presetToCategory('grandDesign')).toBe('spiral')
    expect(presetToCategory('flocculent')).toBe('spiral')
  })

  it('maps barred presets to barred', () => {
    expect(presetToCategory('barredTight')).toBe('barred')
    expect(presetToCategory('barred')).toBe('barred')
    expect(presetToCategory('barredOpen')).toBe('barred')
  })

  it('maps singular types to themselves', () => {
    expect(presetToCategory('elliptical')).toBe('elliptical')
    expect(presetToCategory('lenticular')).toBe('lenticular')
    expect(presetToCategory('irregular')).toBe('irregular')
  })
})
