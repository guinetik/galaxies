import { describe, expect, it } from 'vitest'
import { createDustAtlas } from '../dustAtlas'
import { MORPHOLOGY_PRESETS, type GalaxyRenderParams } from '../morphology/GalaxyMorphology'

function params(preset: 'elliptical' | 'spiral'): GalaxyRenderParams {
  return {
    morphology: { ...MORPHOLOGY_PRESETS[preset] }, galaxyRadius: 300,
    starCount: 10000, diameterKpc: 25, sizeSource: 'observed',
    rotationOmega0: 0.12, rotationFalloff: 1, rotationTurnover: 45,
  }
}

describe('morphology dust atlas', () => {
  it('does not invent dust lanes in a dust-free elliptical', () => {
    const atlas = createDustAtlas(params('elliptical'))
    expect(Array.from(atlas.image.data!).every(value => value === 0)).toBe(true)
    atlas.dispose()
  })

  it('contains absorbing spiral structure but leaves space outside the disk clear', () => {
    const atlas = createDustAtlas(params('spiral'))
    const data = atlas.image.data!
    const width = atlas.image.width
    expect(Array.from(data).some(value => value > 20)).toBe(true)
    // The outer rows/columns are beyond the physical disk; clamped texture
    // sampling must not extend dust into the surrounding background.
    for (let i = 0; i < width; i++) {
      expect(data[i]).toBe(0)
      expect(data[(width - 1) * width + i]).toBe(0)
      expect(data[i * width]).toBe(0)
      expect(data[i * width + width - 1]).toBe(0)
    }
    atlas.dispose()
  })
})
