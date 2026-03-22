import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { LOCAL_GROUP_SCENE_UNITS_PER_MPC } from './localGroupProjection'
import { easeInOutCubic } from '@/lib/math'
import type { LocalGroupLandmark, LocalGroupLayerVisibility, LocalGroupPointHit } from './localGroupTypes'

/** Scene units per MLy — large scale so there's room between rings for content */
const SCENE_UNITS_PER_MLY = 200

/** Conversion: old landmark coords → new scene units */
const MPC_TO_MLY = 3.2616
const LANDMARK_COORD_TO_SCENE = (MPC_TO_MLY * SCENE_UNITS_PER_MLY) / LOCAL_GROUP_SCENE_UNITS_PER_MPC

/** All shell distances in MLy — each gets a dome + equatorial ring + vertical ruler */
const SHELL_DISTANCES_MLY = [0.5, 1, 1.5, 2, 2.5, 3, 4, 5]
/** Ring visual properties */
const RING_TUBE_RADIUS = 1.5
const RING_SEGMENTS = 128

const DOME_COLOR = 0x66aaff
const RING_COLOR = 0x5599cc
const LABEL_COLOR = '#aaddff'
const LABEL_COLOR_DIM = '#6699bb'
const LINE_COLOR = 0x5588aa
const SATELLITE_COLOR = 0xccddee
const SATELLITE_LABEL_COLOR = '#99bbcc'
const LANDMARK_MARKER_SIZE = 6

/** MLy to kpc conversion */
const KPC_PER_MLY = 306.601

/** Camera animation duration in seconds */
const FOCUS_DURATION = 1.5

interface SatelliteData {
  name: string
  distMly: number
  angle: number
  height: number
  prominent?: boolean
}

const SATELLITES: SatelliteData[] = [
  { name: 'Sag DEG',         distMly: 0.08,  angle: 0.3,    height: -0.02, prominent: true },
  { name: 'LMC',             distMly: 0.16,  angle: -0.8,   height: -0.12, prominent: true },
  { name: 'SMC',             distMly: 0.20,  angle: -0.65,  height: -0.15, prominent: true },
  { name: 'Ursa Minor',      distMly: 0.20,  angle: 1.8,    height: 0.15 },
  { name: 'Draco',           distMly: 0.26,  angle: 1.5,    height: 0.18 },
  { name: 'Sculptor',        distMly: 0.26,  angle: -0.2,   height: -0.10, prominent: true },
  { name: 'Carina',          distMly: 0.33,  angle: -1.1,   height: -0.14 },
  { name: 'Sextans',         distMly: 0.28,  angle: 2.8,    height: 0.02, prominent: true },
  { name: 'Fornax',          distMly: 0.46,  angle: -0.35,  height: -0.12, prominent: true },
  { name: 'Hydrus',          distMly: 0.20,  angle: -0.55,  height: -0.08 },
  { name: 'Ret II',          distMly: 0.10,  angle: -0.45,  height: -0.05 },
  { name: 'Tuc III',         distMly: 0.08,  angle: -0.30,  height: -0.06 },
  { name: 'Columba',         distMly: 0.18,  angle: -1.3,   height: -0.06 },
  { name: 'Horologium',      distMly: 0.28,  angle: -0.9,   height: -0.10 },
  { name: 'Pictor',          distMly: 0.38,  angle: -0.75,  height: -0.16 },
  { name: 'Leo IV',          distMly: 0.52,  angle: 3.3,    height: 0.08 },
  { name: 'Leo V',           distMly: 0.58,  angle: 3.4,    height: 0.10 },
  { name: 'CVn II',          distMly: 0.52,  angle: 2.2,    height: 0.22 },
  { name: 'Cra II',          distMly: 0.38,  angle: 3.5,    height: -0.08 },
  { name: 'Crater',          distMly: 0.47,  angle: 3.2,    height: -0.04 },
  { name: 'Boötes',          distMly: 0.21,  angle: 2.5,    height: 0.10 },
  { name: 'Boö II',          distMly: 0.14,  angle: 2.4,    height: 0.08 },
  { name: 'Hercules',        distMly: 0.43,  angle: 2.1,    height: 0.04 },
  { name: 'Coma',            distMly: 0.14,  angle: 2.3,    height: 0.12 },
  { name: 'Vir III',         distMly: 0.48,  angle: 3.1,    height: 0.06 },
  { name: 'Sex II',          distMly: 0.47,  angle: 3.0,    height: 0.04 },
  { name: 'Centaurus',       distMly: 0.43,  angle: -1.5,   height: -0.18 },
  { name: 'Grus',            distMly: 0.38,  angle: -0.1,   height: -0.20 },
  { name: 'Pho III',         distMly: 0.36,  angle: -0.15,  height: -0.14 },
  { name: 'Aqr II',          distMly: 0.35,  angle: 0.6,    height: -0.04 },
  { name: 'Indus',           distMly: 0.42,  angle: 0.1,    height: -0.16 },
  { name: 'Leo I',           distMly: 0.82,  angle: 3.6,    height: 0.12, prominent: true },
  { name: 'Leo II',          distMly: 0.70,  angle: 3.5,    height: 0.20, prominent: true },
  { name: 'CVn I',           distMly: 0.71,  angle: 2.0,    height: 0.30 },
  { name: 'Ursa Major',      distMly: 0.60,  angle: 1.9,    height: 0.25 },
  { name: 'Leo VI',          distMly: 0.60,  angle: 2.6,    height: 0.16 },
  { name: 'Hydra 1',         distMly: 0.44,  angle: 2.7,    height: 0.10 },
  { name: 'Boö IV',          distMly: 0.90,  angle: 2.1,    height: 0.35 },
  { name: 'segue 1',         distMly: 0.75,  angle: 3.7,    height: 0.22 },
  { name: 'Cet III',         distMly: 0.76,  angle: 0.5,    height: 0.08 },
  { name: 'Psc II',          distMly: 0.60,  angle: 0.4,    height: 0.06 },
  { name: 'Peg III',         distMly: 0.72,  angle: 0.3,    height: 0.04 },
  { name: 'NGC 6822',        distMly: 1.63,  angle: 0.2,    height: -0.30 },
  { name: 'Ind II',          distMly: 2.20,  angle: 0.05,   height: -0.50 },
]

/** Stored landmark scene position for camera focus */
interface LandmarkMarker {
  id: string
  position: THREE.Vector3
  landmark: LocalGroupLandmark
}

export class LocalGroupScene {
  private readonly renderer: THREE.WebGLRenderer
  private readonly scene: THREE.Scene
  private readonly camera: THREE.PerspectiveCamera
  private readonly controls: OrbitControls
  private readonly clock = new THREE.Clock()
  private animationId = 0
  private resizeObserver: ResizeObserver

  private readonly domeGroup = new THREE.Group()
  private readonly ringsGroup = new THREE.Group()
  private readonly satellitesGroup = new THREE.Group()
  private readonly landmarksGroup = new THREE.Group()

  private landmarkMarkers: LandmarkMarker[] = []

  // Camera animation state
  private readonly defaultCamPos = new THREE.Vector3(800, 600, 1200)
  private readonly defaultTarget = new THREE.Vector3(0, 0, 0)
  private animStartCamPos = new THREE.Vector3()
  private animStartTarget = new THREE.Vector3()
  private animEndCamPos = new THREE.Vector3()
  private animEndTarget = new THREE.Vector3()
  private animProgress = 1 // 1 = no animation running
  private animDuration = FOCUS_DURATION

  constructor(canvas: HTMLCanvasElement) {
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false })
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    this.renderer.setSize(canvas.clientWidth, canvas.clientHeight, false)
    this.renderer.setClearColor(0x02060b, 1)

    this.scene = new THREE.Scene()

    const aspect = canvas.clientWidth / canvas.clientHeight
    this.camera = new THREE.PerspectiveCamera(50, aspect, 1, 20000)
    this.camera.position.copy(this.defaultCamPos)

    this.controls = new OrbitControls(this.camera, canvas)
    this.controls.enableDamping = true
    this.controls.dampingFactor = 0.08
    this.controls.minDistance = 50
    this.controls.maxDistance = 5000
    this.controls.target.set(0, 0, 0)

    this.buildBackgroundStars()
    this.buildCentralGlow()
    this.buildMilkyWay()
    this.buildShells()
    this.buildHorizontalLine()
    this.buildVerticalAxis()
    this.buildSatellites()

    // Hide satellites for now — keep the data/rendering, just not visible yet
    this.satellitesGroup.visible = false

    this.scene.add(this.domeGroup)
    this.scene.add(this.ringsGroup)
    this.scene.add(this.satellitesGroup)
    this.scene.add(this.landmarksGroup)

    // Subtle depth fog
    this.scene.fog = new THREE.FogExp2(0x020610, 0.00025)

    this.resizeObserver = new ResizeObserver(() => {
      const width = canvas.clientWidth
      const height = canvas.clientHeight
      if (width === 0 || height === 0) return
      this.renderer.setSize(width, height, false)
      this.camera.aspect = width / height
      this.camera.updateProjectionMatrix()
    })
    this.resizeObserver.observe(canvas)
  }

  /** Convert landmark SGX/SGY/SGZ coords to scene position. SGX→X, SGY→Z, SGZ→Y */
  private landmarkToScene(landmark: LocalGroupLandmark): THREE.Vector3 {
    const { sgx, sgy, sgz } = landmark.coordinates
    return new THREE.Vector3(
      sgx * LANDMARK_COORD_TO_SCENE,
      sgz * LANDMARK_COORD_TO_SCENE,
      sgy * LANDMARK_COORD_TO_SCENE,
    )
  }

  private buildBackgroundStars(): void {
    const count = 3000
    const spread = 4000
    const positions = new Float32Array(count * 3)
    const sizes = new Float32Array(count)

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * spread * 2
      positions[i * 3 + 1] = (Math.random() - 0.5) * spread * 2
      positions[i * 3 + 2] = (Math.random() - 0.5) * spread * 2
      sizes[i] = 0.5 + Math.random() * 1.5
    }

    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geo.setAttribute('size', new THREE.BufferAttribute(sizes, 1))

    const mat = new THREE.PointsMaterial({
      color: 0x8899bb,
      size: 1.2,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.4,
      depthWrite: false,
    })

    this.scene.add(new THREE.Points(geo, mat))
  }

  private buildCentralGlow(): void {
    // Large radial gradient sprite at center — warm glow like the reference
    const size = 512
    const canvas = document.createElement('canvas')
    canvas.width = size
    canvas.height = size
    const ctx = canvas.getContext('2d')!

    // Layered radial gradients for depth
    const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
    gradient.addColorStop(0, 'rgba(200, 220, 255, 0.25)')
    gradient.addColorStop(0.15, 'rgba(140, 170, 220, 0.12)')
    gradient.addColorStop(0.4, 'rgba(80, 120, 180, 0.05)')
    gradient.addColorStop(0.7, 'rgba(40, 70, 130, 0.02)')
    gradient.addColorStop(1, 'rgba(10, 20, 40, 0)')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, size, size)

    const texture = new THREE.CanvasTexture(canvas)

    // Main glow — large, centered
    const glowMat = new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      opacity: 1,
    })
    const glow = new THREE.Sprite(glowMat)
    glow.scale.set(800, 800, 1)
    glow.position.set(0, 0, 0)
    this.scene.add(glow)

    // Secondary wider glow — very subtle, adds atmospheric haze
    const glow2Mat = new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      opacity: 0.4,
    })
    const glow2 = new THREE.Sprite(glow2Mat)
    glow2.scale.set(1800, 1800, 1)
    glow2.position.set(0, 0, 0)
    this.scene.add(glow2)
  }

  private buildMilkyWay(): void {
    const geo = new THREE.SphereGeometry(8, 32, 32)
    const mat = new THREE.MeshBasicMaterial({ color: 0xffffff })
    const dot = new THREE.Mesh(geo, mat)
    this.scene.add(dot)

    this.addLabel('Milky Way', 0, 20, 0, { color: '#ffffff', fontSize: 32, scale: 60 })
  }

  private buildShells(): void {
    const count = SHELL_DISTANCES_MLY.length

    for (let i = 0; i < count; i++) {
      const distMLy = SHELL_DISTANCES_MLY[i]
      const radius = distMLy * SCENE_UNITS_PER_MLY
      const isInner = distMLy <= 1

      const shellOpacity = isInner ? 0.10 : 0.06 - i * 0.005
      const ringOpacity = isInner ? 0.45 : 0.30 - i * 0.025

      const domeGeo = new THREE.SphereGeometry(radius, 48, 24, 0, Math.PI * 2, 0, Math.PI / 2)
      const domeMat = new THREE.MeshBasicMaterial({
        color: isInner ? DOME_COLOR : RING_COLOR,
        transparent: true,
        opacity: Math.max(shellOpacity, 0.015),
        side: THREE.DoubleSide,
        depthWrite: false,
      })
      this.domeGroup.add(new THREE.Mesh(domeGeo, domeMat))

      const ringGeo = new THREE.TorusGeometry(radius, RING_TUBE_RADIUS, 8, RING_SEGMENTS)
      const ringMat = new THREE.MeshBasicMaterial({
        color: isInner ? DOME_COLOR : RING_COLOR,
        transparent: true,
        opacity: Math.max(ringOpacity, 0.08),
      })
      const ring = new THREE.Mesh(ringGeo, ringMat)
      ring.rotation.x = -Math.PI / 2
      this.ringsGroup.add(ring)

      const kpc = Math.round(distMLy * KPC_PER_MLY * 10) / 10
      const labelText = distMLy < 1
        ? `${Math.round(distMLy * 1000)} kly - ${kpc} kpc`
        : `${distMLy} MLy - ${kpc} kpc`

      const labelAngles = [Math.PI * 0.15, Math.PI * 0.65, -Math.PI * 0.35, -Math.PI * 0.85]
      for (const angle of labelAngles) {
        const lx = Math.cos(angle) * (radius + 5)
        const lz = Math.sin(angle) * (radius + 5)
        this.addLabel(labelText, lx, 2, lz, {
          color: isInner ? LABEL_COLOR : LABEL_COLOR_DIM,
          fontSize: 22,
          scale: distMLy < 1 ? 55 : 70,
        })
      }

      if (distMLy === 1) {
        const subgroupAngles = [Math.PI * 0.4, -Math.PI * 0.1, Math.PI * 0.9, -Math.PI * 0.6]
        for (const angle of subgroupAngles) {
          const sx = Math.cos(angle) * (radius * 0.75)
          const sz = Math.sin(angle) * (radius * 0.75)
          this.addLabel('M i l k y  W a y  S u b g r o u p', sx, 5, sz, {
            color: '#5588aa',
            fontSize: 20,
            scale: 100,
            opacity: 0.4,
          })
        }
      }

      const tickLen = 12
      const tickPoints = [
        new THREE.Vector3(0, radius - tickLen, 0),
        new THREE.Vector3(0, radius + tickLen, 0),
      ]
      const tickGeo = new THREE.BufferGeometry().setFromPoints(tickPoints)
      const tickMat = new THREE.LineBasicMaterial({
        color: isInner ? DOME_COLOR : RING_COLOR,
        transparent: true,
        opacity: 0.5,
      })
      this.ringsGroup.add(new THREE.Line(tickGeo, tickMat))

      this.addLabel(labelText, 0, radius + tickLen + 8, 0, {
        color: isInner ? LABEL_COLOR : LABEL_COLOR_DIM,
        fontSize: 20,
        scale: distMLy < 1 ? 55 : 70,
      })
    }
  }

  private buildSatellites(): void {
    const dotGeo = new THREE.SphereGeometry(2.5, 12, 12)
    const prominentGeo = new THREE.SphereGeometry(4, 16, 16)
    const dotMat = new THREE.MeshBasicMaterial({ color: SATELLITE_COLOR })

    for (const sat of SATELLITES) {
      const r = sat.distMly * SCENE_UNITS_PER_MLY
      const x = Math.cos(sat.angle) * r
      const z = Math.sin(sat.angle) * r
      const y = sat.height * SCENE_UNITS_PER_MLY

      const dot = new THREE.Mesh(sat.prominent ? prominentGeo : dotGeo, dotMat)
      dot.position.set(x, y, z)
      this.satellitesGroup.add(dot)

      const linePoints = [new THREE.Vector3(x, y, z), new THREE.Vector3(x, 0, z)]
      const lineGeo = new THREE.BufferGeometry().setFromPoints(linePoints)
      const lineMat = new THREE.LineBasicMaterial({
        color: SATELLITE_COLOR,
        transparent: true,
        opacity: 0.15,
      })
      this.satellitesGroup.add(new THREE.Line(lineGeo, lineMat))

      this.addLabel(sat.name, x, y + 8, z, {
        color: sat.prominent ? '#ccddee' : SATELLITE_LABEL_COLOR,
        fontSize: sat.prominent ? 26 : 20,
        scale: sat.prominent ? 50 : 35,
        opacity: sat.prominent ? 0.9 : 0.6,
      }, this.satellitesGroup)
    }
  }

  private buildLandmarks(landmarks: LocalGroupLandmark[]): void {
    // Clear previous
    this.landmarksGroup.clear()
    this.landmarkMarkers = []

    for (const lm of landmarks) {
      // Skip milky way — it's the center dot
      if (lm.id === 'milky-way') {
        this.landmarkMarkers.push({ id: lm.id, position: new THREE.Vector3(0, 0, 0), landmark: lm })
        continue
      }

      const pos = this.landmarkToScene(lm)
      this.landmarkMarkers.push({ id: lm.id, position: pos, landmark: lm })

      const accentColor = new THREE.Color(lm.accent)

      // Diamond marker
      const markerGeo = new THREE.OctahedronGeometry(LANDMARK_MARKER_SIZE, 0)
      const markerMat = new THREE.MeshBasicMaterial({
        color: accentColor,
        transparent: true,
        opacity: 0.9,
      })
      const marker = new THREE.Mesh(markerGeo, markerMat)
      marker.position.copy(pos)
      this.landmarksGroup.add(marker)

      // Glow ring around marker
      const ringGeo = new THREE.TorusGeometry(LANDMARK_MARKER_SIZE * 1.8, 0.5, 8, 32)
      const ringMat = new THREE.MeshBasicMaterial({
        color: accentColor,
        transparent: true,
        opacity: 0.3,
      })
      const ring = new THREE.Mesh(ringGeo, ringMat)
      ring.position.copy(pos)
      ring.rotation.x = -Math.PI / 2
      this.landmarksGroup.add(ring)

      // Connecting line down to equatorial plane
      const linePoints = [pos.clone(), new THREE.Vector3(pos.x, 0, pos.z)]
      const lineGeo = new THREE.BufferGeometry().setFromPoints(linePoints)
      const lineMat = new THREE.LineBasicMaterial({
        color: accentColor,
        transparent: true,
        opacity: 0.25,
      })
      this.landmarksGroup.add(new THREE.Line(lineGeo, lineMat))

      // Label
      this.addLabel(lm.label, pos.x, pos.y + 18, pos.z, {
        color: lm.accent,
        fontSize: 28,
        scale: 70,
        opacity: 0.95,
      }, this.landmarksGroup)

      // Description subtitle
      if (lm.description) {
        this.addLabel(lm.description, pos.x, pos.y - 14, pos.z, {
          color: lm.accent,
          fontSize: 16,
          scale: 90,
          opacity: 0.4,
        }, this.landmarksGroup)
      }
    }
  }

  private buildHorizontalLine(): void {
    const maxRadius = 5 * SCENE_UNITS_PER_MLY
    const lineMat = new THREE.LineBasicMaterial({
      color: LINE_COLOR,
      transparent: true,
      opacity: 0.6,
    })

    const pts1 = [new THREE.Vector3(-maxRadius * 1.3, 0, 0), new THREE.Vector3(maxRadius * 1.3, 0, 0)]
    this.ringsGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts1), lineMat))

    const pts2 = [new THREE.Vector3(0, 0, -maxRadius * 1.3), new THREE.Vector3(0, 0, maxRadius * 1.3)]
    this.ringsGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts2), lineMat.clone()))
  }

  private buildVerticalAxis(): void {
    const maxHeight = 5 * SCENE_UNITS_PER_MLY
    const pts = [new THREE.Vector3(0, -maxHeight * 0.3, 0), new THREE.Vector3(0, maxHeight * 1.1, 0)]
    const mat = new THREE.LineBasicMaterial({ color: LINE_COLOR, transparent: true, opacity: 0.4 })
    this.ringsGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), mat))
  }

  private addLabel(
    text: string,
    x: number,
    y: number,
    z: number,
    opts?: { color?: string; fontSize?: number; scale?: number; opacity?: number },
    parent?: THREE.Group,
  ): void {
    const color = opts?.color ?? LABEL_COLOR
    const fontSize = opts?.fontSize ?? 28
    const spriteScale = opts?.scale ?? 80
    const opacity = opts?.opacity ?? 1

    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')!
    canvas.width = 512
    canvas.height = 64

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.font = `600 ${fontSize}px ui-monospace, monospace`
    ctx.fillStyle = color
    ctx.globalAlpha = opacity
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(text, canvas.width / 2, canvas.height / 2)

    const texture = new THREE.CanvasTexture(canvas)
    texture.minFilter = THREE.LinearFilter

    const spriteMat = new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
      depthWrite: false,
      sizeAttenuation: true,
      opacity,
    })
    const sprite = new THREE.Sprite(spriteMat)
    sprite.position.set(x, y, z)
    sprite.scale.set(spriteScale, spriteScale * (64 / 512), 1)

    const target = parent ?? this.ringsGroup
    target.add(sprite)
  }

  /** Start a smooth camera animation to a target position */
  private animateCamera(targetPos: THREE.Vector3, targetLookAt: THREE.Vector3): void {
    this.animStartCamPos.copy(this.camera.position)
    this.animStartTarget.copy(this.controls.target)
    this.animEndCamPos.copy(targetPos)
    this.animEndTarget.copy(targetLookAt)
    this.animProgress = 0
    this.animDuration = FOCUS_DURATION
  }

  getCamera(): THREE.PerspectiveCamera {
    return this.camera
  }

  start(): void {
    this.clock.start()
    const animate = () => {
      this.animationId = requestAnimationFrame(animate)
      const delta = this.clock.getDelta()

      // Camera animation
      if (this.animProgress < 1) {
        this.animProgress = Math.min(1, this.animProgress + delta / this.animDuration)
        const t = easeInOutCubic(this.animProgress)

        this.camera.position.lerpVectors(this.animStartCamPos, this.animEndCamPos, t)
        this.controls.target.lerpVectors(this.animStartTarget, this.animEndTarget, t)
      }

      this.controls.update()
      this.renderer.render(this.scene, this.camera)
    }
    animate()
  }

  loadGroups(_groups: any, landmarks?: LocalGroupLandmark[]): void {
    if (landmarks) {
      this.buildLandmarks(landmarks)
    }
  }

  focusOn(id: string): LocalGroupLandmark | undefined {
    const marker = this.landmarkMarkers.find((m) => m.id === id)
    if (!marker) return undefined

    const pos = marker.position
    const dist = pos.length()

    // Camera offset: position the camera at a distance proportional to the landmark,
    // slightly above and to the side
    const viewDist = Math.max(dist * 0.6, 150)
    const camPos = new THREE.Vector3(
      pos.x + viewDist * 0.7,
      pos.y + viewDist * 0.5,
      pos.z + viewDist * 0.7,
    )

    this.animateCamera(camPos, pos)
    return marker.landmark
  }

  resetView(): void {
    this.animateCamera(this.defaultCamPos.clone(), this.defaultTarget.clone())
  }

  setLayerVisibility(visibility: LocalGroupLayerVisibility): void {
    this.domeGroup.visible = visibility.shells
    this.ringsGroup.visible = visibility.rings
  }

  pickAtScreen(_screenX: number, _screenY: number, _width: number, _height: number): LocalGroupPointHit | null {
    return null
  }

  dispose(): void {
    cancelAnimationFrame(this.animationId)
    this.resizeObserver.disconnect()
    this.controls.dispose()
    this.scene.traverse((obj) => {
      if (obj instanceof THREE.Mesh) {
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
}
