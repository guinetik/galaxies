import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import type { GalaxyGroup } from '@/types/galaxy'
import { velocityToColor } from '@/types/galaxy'
import vertexShader from '../cosmic-map/shaders/cosmicmap.vert.glsl?raw'
import fragmentShader from '../cosmic-map/shaders/cosmicmap.frag.glsl?raw'

/** Labeled cosmic structures within ~100 Mpc */
const STRUCTURES = [
  { name: 'Milky Way',        sgx: 0,     sgy: 0,    sgz: 0 },
  { name: 'Virgo',            sgx: -200,  sgy: 1100, sgz: 0 },
  { name: 'Centaurus',        sgx: -3200, sgy: 3200, sgz: 0 },
  { name: 'Hydra',            sgx: -2800, sgy: 3800, sgz: 0 },
  { name: 'Great Attractor',  sgx: -4200, sgy: 1800, sgz: 0 },
  { name: 'Perseus-Pisces',   sgx: -4800, sgy: 4500, sgz: 0 },
  { name: 'Coma',             sgx: -300,  sgy: 6800, sgz: 0 },
]

/** Distance rings on top/bottom caps (in Mpc, converted to km/s via H0~70) */
const DISTANCE_RINGS_MPC = [25, 50, 75, 100]
const MPC_TO_KMS = 70

export class CylinderScene {
  private renderer: THREE.WebGLRenderer
  private scene: THREE.Scene
  private camera: THREE.PerspectiveCamera
  private controls: OrbitControls
  private clock = new THREE.Clock()
  private animationId = 0
  private resizeObserver: ResizeObserver
  private pointsMaterial: THREE.ShaderMaterial | null = null

  constructor(canvas: HTMLCanvasElement) {
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    this.renderer.setSize(canvas.clientWidth, canvas.clientHeight, false)
    this.renderer.setClearColor(0x000000, 0)

    this.scene = new THREE.Scene()

    const aspect = canvas.clientWidth / canvas.clientHeight
    this.camera = new THREE.PerspectiveCamera(50, aspect, 1, 100000)
    this.camera.position.set(6000, 8000, 12000)

    this.controls = new OrbitControls(this.camera, canvas)
    this.controls.enableDamping = true
    this.controls.dampingFactor = 0.08
    this.controls.minDistance = 3000
    this.controls.maxDistance = 30000
    this.controls.target.set(0, 0, 0)
    this.controls.autoRotate = true
    this.controls.autoRotateSpeed = 0.5

    this.resizeObserver = new ResizeObserver(() => {
      const w = canvas.clientWidth
      const h = canvas.clientHeight
      if (w === 0 || h === 0) return
      this.renderer.setSize(w, h, false)
      this.camera.aspect = w / h
      this.camera.updateProjectionMatrix()
    })
    this.resizeObserver.observe(canvas)
  }

  loadGroups(groups: GalaxyGroup[]): void {
    const filtered = groups.filter((g) => g.dist_mpc <= 100)
    const radius = 100 * MPC_TO_KMS
    const halfHeight = this.getHalfHeight(filtered)

    this.buildCylinder(radius, halfHeight)
    this.buildPoints(filtered)
    this.buildLabels(filtered)
  }

  start(): void {
    this.clock.start()

    const animate = () => {
      this.animationId = requestAnimationFrame(animate)
      const elapsed = this.clock.getElapsedTime()

      this.controls.update()
      if (this.pointsMaterial) {
        this.pointsMaterial.uniforms.uTime.value = elapsed
      }
      this.renderer.render(this.scene, this.camera)
    }

    animate()
  }

  dispose(): void {
    cancelAnimationFrame(this.animationId)
    this.resizeObserver.disconnect()
    this.controls.dispose()
    this.scene.traverse((obj) => {
      if (obj instanceof THREE.Mesh || obj instanceof THREE.LineSegments ||
          obj instanceof THREE.Line || obj instanceof THREE.LineLoop ||
          obj instanceof THREE.Points) {
        obj.geometry.dispose()
        if (Array.isArray(obj.material)) {
          obj.material.forEach((m) => m.dispose())
        } else {
          obj.material.dispose()
        }
      }
      if (obj instanceof THREE.Sprite) {
        obj.material.map?.dispose()
        obj.material.dispose()
      }
    })
    this.renderer.dispose()
  }

  private getHalfHeight(groups: GalaxyGroup[]): number {
    let maxSgz = 0
    for (const g of groups) {
      const abs = Math.abs(g.sgz)
      if (abs > maxSgz) maxSgz = abs
    }
    return Math.max(maxSgz * 1.1, 3000)
  }

  private buildCylinder(radius: number, halfHeight: number): void {
    const CYAN = new THREE.Color(0x22d3ee)

    // Main cylinder wireframe
    const cylGeo = new THREE.CylinderGeometry(radius, radius, halfHeight * 2, 32, 8, true)
    const edges = new THREE.EdgesGeometry(cylGeo)
    const wireMat = new THREE.LineBasicMaterial({
      color: CYAN,
      transparent: true,
      opacity: 0.12,
      depthWrite: false,
    })
    this.scene.add(new THREE.LineSegments(edges, wireMat))
    cylGeo.dispose()

    // Top and bottom cap rings
    for (const y of [halfHeight, -halfHeight]) {
      for (const ringMpc of DISTANCE_RINGS_MPC) {
        const r = ringMpc * MPC_TO_KMS
        const ringGeo = this.makeCircle(r, 64)
        const opacity = 0.08 + (ringMpc / 100) * 0.18
        const ringMat = new THREE.LineBasicMaterial({
          color: CYAN,
          transparent: true,
          opacity,
          depthWrite: false,
        })
        const ring = new THREE.LineLoop(ringGeo, ringMat)
        ring.position.y = y
        ring.rotation.x = -Math.PI / 2
        this.scene.add(ring)
      }
    }
  }

  private makeCircle(radius: number, segments: number): THREE.BufferGeometry {
    const positions = new Float32Array((segments + 1) * 3)
    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI * 2
      positions[i * 3] = Math.cos(angle) * radius
      positions[i * 3 + 1] = Math.sin(angle) * radius
      positions[i * 3 + 2] = 0
    }
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    return geo
  }

  private buildPoints(groups: GalaxyGroup[]): void {
    const count = groups.length
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    const sizes = new Float32Array(count)

    for (let i = 0; i < count; i++) {
      const g = groups[i]
      positions[i * 3] = g.sgx
      positions[i * 3 + 1] = g.sgz
      positions[i * 3 + 2] = g.sgy

      const c = velocityToColor(g.vh ?? 0)
      colors[i * 3] = c[0]
      colors[i * 3 + 1] = c[1]
      colors[i * 3 + 2] = c[2]

      sizes[i] = 3.0
    }

    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('aColor', new THREE.BufferAttribute(colors, 3))
    geometry.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1))

    this.pointsMaterial = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
        uTime: { value: 0 },
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })

    const points = new THREE.Points(geometry, this.pointsMaterial)
    points.frustumCulled = false
    this.scene.add(points)
  }

  private buildLabels(groups: GalaxyGroup[]): void {
    for (const structure of STRUCTURES) {
      // Find real SGZ from closest galaxy group (don't mutate the shared constant)
      let sgz = 0
      if (structure.name !== 'Milky Way') {
        let bestDist = Infinity
        for (const g of groups) {
          const dx = g.sgx - structure.sgx
          const dz = g.sgy - structure.sgy
          const d = dx * dx + dz * dz
          if (d < bestDist) {
            bestDist = d
            sgz = g.sgz
          }
        }
      }

      const isMW = structure.name === 'Milky Way'
      const sprite = this.makeLabel(structure.name, isMW)
      sprite.position.set(structure.sgx, sgz + 300, structure.sgy)
      this.scene.add(sprite)

      if (!isMW) {
        const lineGeo = new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(structure.sgx, sgz, structure.sgy),
          new THREE.Vector3(structure.sgx, 0, structure.sgy),
        ])
        const lineMat = new THREE.LineBasicMaterial({
          color: 0x22d3ee,
          transparent: true,
          opacity: 0.15,
          depthWrite: false,
        })
        this.scene.add(new THREE.Line(lineGeo, lineMat))
      }
    }

    const halfHeight = this.getHalfHeight(groups)
    for (const mpc of DISTANCE_RINGS_MPC) {
      const r = mpc * MPC_TO_KMS
      const label = this.makeLabel(`${mpc} Mpc`, false, 10, 0.5)
      label.position.set(r, halfHeight, 0)
      this.scene.add(label)
    }
  }

  private makeLabel(
    text: string,
    highlight = false,
    fontSize = 14,
    alphaMultiplier = 1.0,
  ): THREE.Sprite {
    const canvas = document.createElement('canvas')
    const scale = 2
    canvas.width = 256 * scale
    canvas.height = 48 * scale
    const ctx = canvas.getContext('2d')!
    ctx.scale(scale, scale)

    ctx.font = `${highlight ? '700' : '500'} ${fontSize}px system-ui, -apple-system, sans-serif`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'

    ctx.shadowColor = highlight
      ? 'rgba(255, 255, 255, 0.8)'
      : 'rgba(34, 211, 238, 0.6)'
    ctx.shadowBlur = highlight ? 12 : 8
    ctx.fillStyle = highlight
      ? 'rgba(255, 255, 255, 1.0)'
      : `rgba(255, 255, 255, ${0.85 * alphaMultiplier})`
    ctx.fillText(text, 128, 24)

    ctx.shadowBlur = 0
    ctx.fillText(text, 128, 24)

    const texture = new THREE.CanvasTexture(canvas)
    const material = new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
      depthTest: false,
    })
    const sprite = new THREE.Sprite(material)
    sprite.scale.set(highlight ? 1000 : 800, highlight ? 200 : 150, 1)
    return sprite
  }
}
