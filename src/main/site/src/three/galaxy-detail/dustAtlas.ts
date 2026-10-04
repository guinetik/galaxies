import * as THREE from 'three'
import type { GalaxyRenderParams } from './morphology'
import { computeDustExtinction } from './GalaxyGenerator'
import { deriveBandInfluenceConfig } from './bandInfluence'

/** Optical depth sampled from the existing morphology dust model, not a new layout. */
export function createDustAtlas(params: GalaxyRenderParams): THREE.DataTexture {
  const size = 256
  const data = new Uint8Array(size * size)
  const influence = deriveBandInfluenceConfig(params.bandProfile)
  const angle = influence?.projectedAngle ?? 0
  const minorScale = 1 + ((influence?.projectedAxisRatio ?? 1) - 1) * (influence?.projectedStrength ?? 0)
  const c = Math.cos(angle), s = Math.sin(angle)
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const wx = ((x + 0.5) / size * 2 - 1) * params.galaxyRadius * 1.3
      const wz = ((y + 0.5) / size * 2 - 1) * params.galaxyRadius * 1.3
      const major = wx * c + wz * s
      const minor = (wz * c - wx * s) / Math.max(minorScale, 0.1)
      const px = major * c - minor * s, pz = major * s + minor * c
      const radius = Math.hypot(px, pz) / params.galaxyRadius
      const transmission = computeDustExtinction(px, 0, pz, params).r
      const edge = Math.max(0, Math.min(1, (1.05 - radius) / 0.15))
      data[y * size + x] = Math.round(Math.min(1, -Math.log(Math.max(transmission, 1e-6)) / 0.65 / 8) * edge * 255)
    }
  }
  const map = new THREE.DataTexture(data, size, size, THREE.RedFormat)
  map.minFilter = map.magFilter = THREE.LinearFilter
  map.needsUpdate = true
  return map
}
