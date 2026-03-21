import { describe, expect, it } from 'vitest'
import * as THREE from 'three'
import {
  CosmicMapCylinderFrame,
  getDefaultCosmicMapCylinderExtents,
} from '../cosmic-map/CosmicMapCylinderFrame'

describe('getDefaultCosmicMapCylinderExtents', () => {
  it('keeps the map width but stretches the cylinder vertically', () => {
    const extents = getDefaultCosmicMapCylinderExtents(16000)

    expect(extents.radius).toBe(16000)
    expect(extents.halfHeight).toBeGreaterThan(16000)
  })
})

describe('CosmicMapCylinderFrame', () => {
  it('rebuilds top and bottom rings on the vertical axis when extents change', () => {
    const frame = new CosmicMapCylinderFrame({ radius: 9000, halfHeight: 2500 })

    expect(frame.group.children).toHaveLength(9)

    const rings = frame.group.children.filter(
      (child): child is THREE.LineLoop => child instanceof THREE.LineLoop,
    )

    expect(rings).toHaveLength(8)
    expect(rings[0].position.y).toBe(2500)
    expect(rings[4].position.y).toBe(-2500)

    frame.setExtents({ radius: 12000, halfHeight: 4000 })

    const updatedRings = frame.group.children.filter(
      (child): child is THREE.LineLoop => child instanceof THREE.LineLoop,
    )
    const positions = updatedRings[0].geometry.getAttribute('position')

    expect(updatedRings[0].position.y).toBe(4000)
    expect(updatedRings[4].position.y).toBe(-4000)
    expect(positions.getX(0)).toBeCloseTo(3000)
  })

  it('toggles visibility without changing geometry', () => {
    const frame = new CosmicMapCylinderFrame({ radius: 9000, halfHeight: 2500 })

    frame.setVisible(false)
    expect(frame.group.visible).toBe(false)

    frame.setVisible(true)
    expect(frame.group.visible).toBe(true)
  })
})
