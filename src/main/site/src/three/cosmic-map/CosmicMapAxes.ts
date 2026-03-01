import * as THREE from 'three'

const AXIS_LENGTH = 500

/**
 * Reference frame for the cosmic map: RGB axis arrows, bounding box wireframe,
 * and distance tick labels along each axis.
 */
export class CosmicMapAxes {
  readonly group: THREE.Group

  private arrowX: THREE.ArrowHelper
  private arrowY: THREE.ArrowHelper
  private arrowZ: THREE.ArrowHelper
  private box: THREE.LineSegments
  private tickLabels: THREE.Sprite[] = []

  constructor(dataExtent: number = 16000) {
    this.group = new THREE.Group()

    // --- Axis arrows (SGX=red, SGY=green, SGZ=blue) ---
    const origin = new THREE.Vector3(0, 0, 0)
    this.arrowX = new THREE.ArrowHelper(
      new THREE.Vector3(1, 0, 0), origin, AXIS_LENGTH, 0xff0000, AXIS_LENGTH * 0.06, AXIS_LENGTH * 0.03,
    )
    this.arrowY = new THREE.ArrowHelper(
      new THREE.Vector3(0, 1, 0), origin, AXIS_LENGTH, 0x00ff00, AXIS_LENGTH * 0.06, AXIS_LENGTH * 0.03,
    )
    this.arrowZ = new THREE.ArrowHelper(
      new THREE.Vector3(0, 0, 1), origin, AXIS_LENGTH, 0x0088ff, AXIS_LENGTH * 0.06, AXIS_LENGTH * 0.03,
    )
    this.group.add(this.arrowX, this.arrowY, this.arrowZ)

    // --- Bounding box wireframe ---
    const boxGeo = new THREE.BoxGeometry(dataExtent * 2, dataExtent * 2, dataExtent * 2)
    const edges = new THREE.EdgesGeometry(boxGeo)
    this.box = new THREE.LineSegments(
      edges,
      new THREE.LineBasicMaterial({ color: 0xffffff, opacity: 0.08, transparent: true }),
    )
    this.group.add(this.box)
    boxGeo.dispose()

    // --- Distance tick labels along each axis ---
    const tickInterval = 5000  // Mpc
    const axes: { dir: THREE.Vector3; label: string }[] = [
      { dir: new THREE.Vector3(1, 0, 0), label: 'SGX' },
      { dir: new THREE.Vector3(0, 1, 0), label: 'SGY' },
      { dir: new THREE.Vector3(0, 0, 1), label: 'SGZ' },
    ]

    for (const axis of axes) {
      // Axis label at tip
      const tipSprite = this.makeLabel(axis.label, 14)
      tipSprite.position.copy(axis.dir).multiplyScalar(AXIS_LENGTH + 40)
      this.group.add(tipSprite)
      this.tickLabels.push(tipSprite)

      // Tick marks at intervals along positive and negative directions
      for (let d = tickInterval; d <= dataExtent; d += tickInterval) {
        for (const sign of [1, -1]) {
          const pos = axis.dir.clone().multiplyScalar(d * sign)
          const label = `${(d * sign / 1000).toFixed(0)}k`
          const sprite = this.makeLabel(label, 10)
          sprite.position.copy(pos)
          this.group.add(sprite)
          this.tickLabels.push(sprite)
        }
      }
    }

    // --- Origin marker ---
    const originSprite = this.makeLabel('0', 10)
    originSprite.position.set(0, -30, 0)
    this.group.add(originSprite)
    this.tickLabels.push(originSprite)
  }

  private makeLabel(text: string, fontSize: number): THREE.Sprite {
    const canvas = document.createElement('canvas')
    const scale = 2  // Higher res for retina
    canvas.width = 128 * scale
    canvas.height = 32 * scale
    const ctx = canvas.getContext('2d')!
    ctx.scale(scale, scale)
    ctx.font = `${fontSize}px monospace`
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(text, 64, 16)

    const texture = new THREE.CanvasTexture(canvas)
    const material = new THREE.SpriteMaterial({ map: texture, transparent: true, depthTest: false })
    const sprite = new THREE.Sprite(material)
    sprite.scale.set(200, 50, 1)
    return sprite
  }

  setVisible(visible: boolean): void {
    this.group.visible = visible
  }

  dispose(): void {
    this.arrowX.dispose()
    this.arrowY.dispose()
    this.arrowZ.dispose()
    this.box.geometry.dispose()
    ;(this.box.material as THREE.Material).dispose()
    for (const sprite of this.tickLabels) {
      ;(sprite.material as THREE.SpriteMaterial).map?.dispose()
      sprite.material.dispose()
    }
  }
}
