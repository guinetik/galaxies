import * as THREE from 'three'

const CYLINDER_COLOR = 0x22d3ee
const CYLINDER_SHELL_OPACITY = 0.1
const CYLINDER_RING_OPACITY_MIN = 0.08
const CYLINDER_RING_OPACITY_RANGE = 0.18
const CYLINDER_RING_STEPS = [0.25, 0.5, 0.75, 1]
const DEFAULT_COSMIC_MAP_HEIGHT_SCALE = 1.2

export interface CosmicMapCylinderExtents {
  radius: number
  halfHeight: number
}

/**
 * Returns the default cosmic-map cylinder profile with a slightly elongated
 * vertical span while keeping the same map width.
 */
export function getDefaultCosmicMapCylinderExtents(mapExtent: number): CosmicMapCylinderExtents {
  return {
    radius: mapExtent,
    halfHeight: mapExtent * DEFAULT_COSMIC_MAP_HEIGHT_SCALE,
  }
}

/**
 * Renders an astronomy-style cylindrical frame aligned to SGZ.
 */
export class CosmicMapCylinderFrame {
  readonly group = new THREE.Group()

  private shell: THREE.LineSegments | null = null
  private rings: THREE.LineLoop[] = []

  constructor(extents: CosmicMapCylinderExtents) {
    this.setExtents(extents)
  }

  /**
   * Rebuilds the cylinder shell and cap rings for a new data extent.
   */
  setExtents(extents: CosmicMapCylinderExtents): void {
    this.disposeFrameObjects()

    const cylinderGeometry = new THREE.CylinderGeometry(
      extents.radius,
      extents.radius,
      extents.halfHeight * 2,
      48,
      8,
      true,
    )

    const shellEdges = new THREE.EdgesGeometry(cylinderGeometry)
    const shellMaterial = new THREE.LineBasicMaterial({
      color: CYLINDER_COLOR,
      transparent: true,
      opacity: CYLINDER_SHELL_OPACITY,
      depthWrite: false,
    })
    this.shell = new THREE.LineSegments(shellEdges, shellMaterial)
    this.group.add(this.shell)

    cylinderGeometry.dispose()

    for (const side of [1, -1]) {
      for (const step of CYLINDER_RING_STEPS) {
        const ringGeometry = this.makeCircle(extents.radius * step, 96)
        const ringMaterial = new THREE.LineBasicMaterial({
          color: CYLINDER_COLOR,
          transparent: true,
          opacity: CYLINDER_RING_OPACITY_MIN + step * CYLINDER_RING_OPACITY_RANGE,
          depthWrite: false,
        })
        const ring = new THREE.LineLoop(ringGeometry, ringMaterial)
        ring.position.y = extents.halfHeight * side
        ring.rotation.x = -Math.PI / 2
        this.rings.push(ring)
        this.group.add(ring)
      }
    }
  }

  /**
   * Shows or hides the entire cylinder frame.
   */
  setVisible(visible: boolean): void {
    this.group.visible = visible
  }

  /**
   * Releases all Three.js resources owned by the frame.
   */
  dispose(): void {
    this.disposeFrameObjects()
  }

  /**
   * Builds a circle in the SGX/SGY plane for a cylinder cap ring.
   */
  private makeCircle(radius: number, segments: number): THREE.BufferGeometry {
    const positions = new Float32Array((segments + 1) * 3)

    for (let index = 0; index <= segments; index++) {
      const angle = (index / segments) * Math.PI * 2
      positions[index * 3] = Math.cos(angle) * radius
      positions[index * 3 + 1] = Math.sin(angle) * radius
      positions[index * 3 + 2] = 0
    }

    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    return geometry
  }

  /**
   * Removes the current frame meshes and disposes their geometries and materials.
   */
  private disposeFrameObjects(): void {
    if (this.shell) {
      this.group.remove(this.shell)
      this.shell.geometry.dispose()
      this.disposeMaterial(this.shell.material)
      this.shell = null
    }

    for (const ring of this.rings) {
      this.group.remove(ring)
      ring.geometry.dispose()
      this.disposeMaterial(ring.material)
    }

    this.rings = []
  }

  /**
   * Disposes a Three.js material regardless of whether it is singular or an array.
   */
  private disposeMaterial(material: THREE.Material | THREE.Material[]): void {
    if (Array.isArray(material)) {
      for (const entry of material) {
        entry.dispose()
      }
      return
    }

    material.dispose()
  }
}
