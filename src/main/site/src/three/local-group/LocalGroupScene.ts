import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { velocityToColor } from '@/types/galaxy'
import type { GalaxyGroup } from '@/types/galaxy'
import {
  getLocalGroupRangeRingsMpc,
  LOCAL_GROUP_SCENE_UNITS_PER_MPC,
} from './localGroupProjection'
import { LOCAL_GROUP_LANDMARKS } from './localGroupLandmarks'
import type {
  LocalGroupCoordinates,
  LocalGroupLandmark,
  LocalGroupLayerVisibility,
  LocalGroupPointHit,
} from './localGroupTypes'

const MAX_RANGE_MPC = 100
const RANGE_STEP_MPC = 10
const MAX_RANGE_SCENE_UNITS = MAX_RANGE_MPC * LOCAL_GROUP_SCENE_UNITS_PER_MPC
const CAMERA_HEIGHT = 3000 // Z position for top-down orthographic view
const FOCUS_OFFSET = 1600 // Camera position offset when focusing (for compatibility)

/**
 * Three.js scene for the NASA-inspired Local Group visualization.
 */
export class LocalGroupScene {
  private readonly renderer: THREE.WebGLRenderer
  private readonly scene: THREE.Scene
  private readonly camera: THREE.OrthographicCamera
  private readonly controls: OrbitControls
  private readonly resizeObserver: ResizeObserver
  private readonly clock = new THREE.Clock(false)
  private readonly projectionGroup = new THREE.Group()
  private readonly atmosphere: THREE.Mesh
  private readonly shellGroup = new THREE.Group()
  private readonly ringGroup = new THREE.Group()
  private readonly guideGroup = new THREE.Group()
  private readonly stemGroup = new THREE.Group()
  private readonly labelGroup = new THREE.Group()
  private readonly beaconGroup = new THREE.Group()
  private readonly pointGeometry = new THREE.BufferGeometry()
  private readonly pointMaterial: THREE.PointsMaterial
  private readonly points: THREE.Points
  private readonly defaultTarget = new THREE.Vector3(0, 0, 0)
  private readonly defaultCamPos = new THREE.Vector3(-3200, 2400, 6900)
  private readonly layerVisibility: LocalGroupLayerVisibility = {
    shells: true,
    rings: true,
    stems: true,
    labels: true,
  }

  private animationId = 0
  private focusTarget: THREE.Vector3 | null = null
  private focusZoom: number | null = null
  private focusCamPos: THREE.Vector3 | null = null
  private pointPositions = new Float32Array(0)
  private pointData: GalaxyGroup[] = []
  private landmarkPositions = new Map<string, THREE.Vector3>()
  private landmarks: LocalGroupLandmark[] = LOCAL_GROUP_LANDMARKS

  /**
   * Creates the Local Group scene on the provided canvas.
   */
  constructor(canvas: HTMLCanvasElement) {
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false })
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    this.renderer.setSize(canvas.clientWidth, canvas.clientHeight, false)
    this.renderer.setClearColor(0x02060b, 1)

    this.scene = new THREE.Scene()
    this.scene.fog = new THREE.FogExp2(0x02060b, 0.00011)

    // Orthographic camera looking down at origin
    const aspect = canvas.clientWidth / canvas.clientHeight
    const frustumHeight = MAX_RANGE_SCENE_UNITS * 1.1 // 10% margin
    const frustumWidth = frustumHeight * aspect
    this.camera = new THREE.OrthographicCamera(
      -frustumWidth / 2,
      frustumWidth / 2,
      frustumHeight / 2,
      -frustumHeight / 2,
      1,
      200000
    )
    this.camera.position.set(0, 0, CAMERA_HEIGHT)
    this.camera.lookAt(0, 0, 0)

    // Orbit controls for pan/zoom
    this.controls = new OrbitControls(this.camera, canvas)
    this.controls.enableDamping = true
    this.controls.dampingFactor = 0.08
    this.controls.minZoom = 0.5
    this.controls.maxZoom = 3.0
    this.controls.target.set(0, 0, 0)
    this.controls.autoRotate = true
    this.controls.autoRotateSpeed = 0.18
    this.controls.enableRotate = true
    this.controls.enablePan = true
    this.controls.enableZoom = true

    // Projection group has no rotation (flat plane at Z=0)
    this.projectionGroup.position.set(0, 0, 0)
    this.projectionGroup.rotation.order = 'YXZ'
    // NO rotation applied
    this.projectionGroup.add(
      this.shellGroup,
      this.ringGroup,
      this.guideGroup,
      this.labelGroup,
      this.beaconGroup,
    )
    this.scene.add(this.projectionGroup)

    // Point cloud for future galaxy overlay
    this.pointMaterial = new THREE.PointsMaterial({
      size: 52,
      sizeAttenuation: true,
      vertexColors: true,
      transparent: true,
      opacity: 0.92,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })
    this.points = new THREE.Points(this.pointGeometry, this.pointMaterial)
    this.points.frustumCulled = false
    this.projectionGroup.add(this.points)

    // Background atmosphere
    this.atmosphere = this.createAtmosphere()
    this.atmosphere.position.set(0, 0, -12000)
    this.scene.add(this.atmosphere)

    this.resizeObserver = new ResizeObserver(() => {
      const width = canvas.clientWidth
      const height = canvas.clientHeight
      if (width === 0 || height === 0) return
      this.renderer.setSize(width, height, false)
      // Update orthographic camera
      const aspect = width / height
      const frustumHeight = MAX_RANGE_SCENE_UNITS * 1.1
      const frustumWidth = frustumHeight * aspect
      this.camera.left = -frustumWidth / 2
      this.camera.right = frustumWidth / 2
      this.camera.top = frustumHeight / 2
      this.camera.bottom = -frustumHeight / 2
      this.camera.updateProjectionMatrix()
    })
    this.resizeObserver.observe(canvas)
  }

  /**
   * Returns the active camera for pointer picking.
   */
  getCamera(): THREE.OrthographicCamera {
    return this.camera
  }

  /**
   * Starts the animation loop.
   */
  start(): void {
    this.clock.start()

    const animate = () => {
      this.animationId = requestAnimationFrame(animate)
      const elapsed = this.clock.getElapsedTime()

      // Animate camera target and zoom
      if (this.focusTarget) {
        this.controls.target.lerp(this.focusTarget, 0.05)
        if (this.focusZoom) {
          this.camera.zoom += (this.focusZoom - this.camera.zoom) * 0.05
          this.camera.updateProjectionMatrix()
        }
        if (this.controls.target.distanceTo(this.focusTarget) < 2 &&
            (!this.focusZoom || Math.abs(this.camera.zoom - this.focusZoom) < 0.02)) {
          this.focusTarget = null
          this.focusZoom = null
        }
      }

      // Animate ring opacity
      this.shellGroup.children.forEach((mesh, index) => {
        if (mesh instanceof THREE.Mesh) {
          const material = mesh.material as THREE.MeshBasicMaterial
          material.opacity = 0.028 + Math.sin(elapsed * 0.35 + index * 0.25) * 0.006
        }
      })

      this.controls.update()
      this.renderer.render(this.scene, this.camera)
    }

    animate()
  }

  /**
   * Loads galaxy-group data into the Local Group scene.
   */
  loadGroups(groups: GalaxyGroup[], landmarks: LocalGroupLandmark[] = LOCAL_GROUP_LANDMARKS): void {
    const filtered = groups.filter((group) => group.dist_mpc <= MAX_RANGE_MPC)
    this.pointData = filtered
    this.landmarks = landmarks
    this.landmarkPositions.clear()
    this.rebuildRanges()
    this.rebuildMeasurementGuides()
    this.rebuildPoints(filtered)
    this.rebuildLandmarks(filtered, landmarks)
  }

  /**
   * Focuses the camera on a named landmark.
   */
  focusOn(landmarkId: string): LocalGroupLandmark | undefined {
    const landmark = this.landmarks.find((entry) => entry.id === landmarkId)
    const target = this.landmarkPositions.get(landmarkId)
    if (!landmark || !target) return undefined

    this.focusTarget = target.clone()
    this.focusTarget.z = 0

    const distance = Math.sqrt(target.x * target.x + target.y * target.y)
    const zoomLevel = distance > 0 ? (MAX_RANGE_SCENE_UNITS / distance) * 0.6 : 1.0

    this.controls.autoRotate = false
    this.focusZoom = zoomLevel
    return landmark
  }

  /**
   * Resets the camera to the default orbit framing.
   */
  resetView(): void {
    this.focusTarget = this.defaultTarget.clone()
    this.focusZoom = 1.0
    this.controls.autoRotate = true
  }

  /**
   * Toggles visibility for named Local Group layers.
   */
  setLayerVisibility(visibility: Partial<LocalGroupLayerVisibility>): void {
    Object.assign(this.layerVisibility, visibility)
    this.shellGroup.visible = this.layerVisibility.shells
    this.ringGroup.visible = this.layerVisibility.rings
    this.stemGroup.visible = this.layerVisibility.stems
    this.labelGroup.visible = this.layerVisibility.labels
    this.beaconGroup.visible = this.layerVisibility.labels
  }

  /**
   * Hit-tests the point cloud in screen space.
   */
  pickAtScreen(
    screenX: number,
    screenY: number,
    viewportWidth: number,
    viewportHeight: number,
  ): LocalGroupPointHit | null {
    this.points.updateWorldMatrix(true, false)
    const tempLocal = new THREE.Vector3()
    const tempProjected = new THREE.Vector3()
    const pickRadius = 12 * Math.min(window.devicePixelRatio, 2)

    let bestIndex = -1
    let bestDistance = Infinity

    for (let index = 0; index < this.pointPositions.length / 3; index++) {
      const offset = index * 3
      tempLocal.set(
        this.pointPositions[offset],
        this.pointPositions[offset + 1],
        this.pointPositions[offset + 2],
      )
      tempProjected.copy(tempLocal).applyMatrix4(this.points.matrixWorld).project(this.camera)

      if (tempProjected.z < -1 || tempProjected.z > 1) continue

      const px = (tempProjected.x * 0.5 + 0.5) * viewportWidth
      const py = (-tempProjected.y * 0.5 + 0.5) * viewportHeight
      const dx = screenX - px
      const dy = screenY - py

      if (Math.abs(dx) > pickRadius || Math.abs(dy) > pickRadius) continue

      const distance = dx * dx + dy * dy
      if (distance < bestDistance) {
        bestDistance = distance
        bestIndex = index
      }
    }

    if (bestIndex < 0) return null

    const group = this.pointData[bestIndex]
    return {
      pgc: group.group_pgc,
      velocity: group.vh ?? 0,
      distance: group.dist_mpc,
    }
  }

  /**
   * Releases WebGL resources used by the Local Group scene.
   */
  dispose(): void {
    cancelAnimationFrame(this.animationId)
    this.resizeObserver.disconnect()
    this.controls.dispose()
    this.pointGeometry.dispose()
    this.pointMaterial.dispose()
    this.disposeGroup(this.shellGroup)
    this.disposeGroup(this.ringGroup)
    this.disposeGroup(this.guideGroup)
    this.disposeGroup(this.stemGroup)
    this.disposeGroup(this.labelGroup)
    this.disposeGroup(this.beaconGroup)
    disposeObjectResources(this.atmosphere)
    this.renderer.dispose()
  }

  /**
   * Builds the translucent tilted shell stack and the crisp circular ranges.
   */
  private rebuildRanges(): void {
    clearGroup(this.shellGroup)
    clearGroup(this.ringGroup)

    const rings = getLocalGroupRangeRingsMpc(MAX_RANGE_MPC, RANGE_STEP_MPC)
    const sceneUnitsPerMpc = LOCAL_GROUP_SCENE_UNITS_PER_MPC

    // Base disk (ground plane)
    const baseDisk = new THREE.Mesh(
      new THREE.CircleGeometry(MAX_RANGE_SCENE_UNITS, 180),
      new THREE.MeshBasicMaterial({
        color: 0x07131c,
        transparent: true,
        opacity: 0.34,
        side: THREE.DoubleSide,
        depthWrite: false,
      }),
    )
    baseDisk.position.z = 0
    this.shellGroup.add(baseDisk)

    // Color palette for ring fills
    const ringColors = [
      0x4dc9ff, 0x3fb3e6, 0x2e9dd0, 0x2287bb,
      0x1671a6, 0x0a5b91, 0x0a4a7f, 0x08396d,
    ]

    for (let index = 0; index < rings.length; index++) {
      const rangeMpc = rings[index]
      const innerRadiusMpc = index === 0 ? 0 : rings[index - 1]

      const outerRadius = rangeMpc * sceneUnitsPerMpc
      const innerRadius = Math.max(0, innerRadiusMpc * sceneUnitsPerMpc)

      // Ring fill (semi-transparent mesh)
      const shellGeometry = new THREE.RingGeometry(innerRadius, outerRadius, 96)
      const opacityValue = 0.08 + index * 0.008
      const colorIndex = Math.min(index, ringColors.length - 1)
      const shellMaterial = new THREE.MeshBasicMaterial({
        color: new THREE.Color(ringColors[colorIndex]),
        transparent: true,
        opacity: opacityValue,
        side: THREE.DoubleSide,
        depthWrite: false,
      })
      const shell = new THREE.Mesh(shellGeometry, shellMaterial)
      shell.position.z = 0
      this.shellGroup.add(shell)

      // Ring outline (line)
      const ring = new THREE.LineLoop(
        createCircleGeometry(outerRadius, 180),
        new THREE.LineBasicMaterial({
          color: 0x86dfff,
          transparent: true,
          opacity: 0.22 + index * 0.015,
          depthWrite: false,
        }),
      )
      ring.position.z = 0
      this.ringGroup.add(ring)
    }
  }

  /**
   * Builds vertical measurement guides with distance labels along the X-axis.
   */
  private rebuildMeasurementGuides(): void {
    clearGroup(this.guideGroup)

    const rings = getLocalGroupRangeRingsMpc(MAX_RANGE_MPC, RANGE_STEP_MPC)

    for (const rangeMpc of rings) {
      const distanceSceneUnits = rangeMpc * LOCAL_GROUP_SCENE_UNITS_PER_MPC

      // Position guide along positive X-axis at this distance
      const guideX = distanceSceneUnits
      const guideY = 0
      const guideZ = 0

      // Create thin vertical line (cylinder)
      const guideGeometry = new THREE.CylinderGeometry(1.5, 1.5, 400, 8)
      const guideMaterial = new THREE.MeshBasicMaterial({
        color: 0x86dfff,
        transparent: true,
        opacity: 0.6,
        depthWrite: false,
      })
      const guide = new THREE.Mesh(guideGeometry, guideMaterial)
      guide.position.set(guideX, guideY, guideZ + 200) // Centered on Z
      this.guideGroup.add(guide)

      // Create label sprite (e.g., "10 Mpc")
      const label = this.makeGuideLabel(`${rangeMpc}`)
      label.position.set(guideX, guideY, guideZ + 220) // Above the cylinder
      this.guideGroup.add(label)
    }
  }

  /**
   * Creates a distance label sprite for measurement guides.
   */
  private makeGuideLabel(text: string): THREE.Sprite {
    const canvas = document.createElement('canvas')
    const scale = 2
    canvas.width = 200 * scale
    canvas.height = 60 * scale
    const context = canvas.getContext('2d')
    if (!context) {
      throw new Error('2D canvas context unavailable for guide labels.')
    }

    context.scale(scale, scale)
    context.font = '600 18px "IBM Plex Sans", "Segoe UI", sans-serif'
    context.textAlign = 'center'
    context.textBaseline = 'middle'
    context.shadowColor = 'rgba(94,205,255,0.75)'
    context.shadowBlur = 10
    context.fillStyle = 'rgba(211,245,255,0.86)'
    context.fillText(text + ' Mpc', 100, 30)

    const material = new THREE.SpriteMaterial({
      map: new THREE.CanvasTexture(canvas),
      transparent: true,
      depthTest: false,
      depthWrite: false,
    })
    const sprite = new THREE.Sprite(material)
    sprite.scale.set(400, 120, 1)
    return sprite
  }

  /**
   * Rebuilds the projected Local Group point cloud and guide stems.
   */
  private rebuildPoints(groups: GalaxyGroup[]): void {
    clearGroup(this.stemGroup)

    const count = groups.length
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    const stemPositions = new Float32Array(count * 6)

    for (let index = 0; index < count; index++) {
      const group = groups[index]
      const offset = index * 3
      const stemOffset = index * 6
      const local = this.toLocalDisplayCoordinates(group)
      const color = velocityToColor(group.vh ?? 0)

      positions[offset] = local.x
      positions[offset + 1] = local.y
      positions[offset + 2] = local.z

      colors[offset] = color[0]
      colors[offset + 1] = color[1]
      colors[offset + 2] = color[2]

      stemPositions[stemOffset] = group.sgx
      stemPositions[stemOffset + 1] = 0
      stemPositions[stemOffset + 2] = group.sgy
      stemPositions[stemOffset + 3] = local.x
      stemPositions[stemOffset + 4] = local.y
      stemPositions[stemOffset + 5] = local.z
    }

    this.pointPositions = positions
    this.pointGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    this.pointGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

    const stemGeometry = new THREE.BufferGeometry()
    stemGeometry.setAttribute('position', new THREE.BufferAttribute(stemPositions, 3))
    const stemMaterial = new THREE.LineBasicMaterial({
      color: 0x7ad9ff,
      transparent: true,
      opacity: 0.2,
      depthWrite: false,
    })
    this.stemGroup.add(new THREE.LineSegments(stemGeometry, stemMaterial))
  }

  /**
   * Rebuilds scene beacons and labels for the Local Group landmarks.
   */
  private rebuildLandmarks(groups: GalaxyGroup[], landmarks: LocalGroupLandmark[]): void {
    clearGroup(this.labelGroup)
    clearGroup(this.beaconGroup)

    for (const landmark of landmarks) {
      const resolved = this.resolveLandmarkCoordinates(landmark, groups)
      const local = this.toLocalDisplayCoordinates(resolved)

      // Store world position for focus animations
      this.landmarkPositions.set(landmark.id, local.clone())

      // Beacon sphere at landmark position on plane
      const beacon = new THREE.Mesh(
        new THREE.SphereGeometry(landmark.id === 'milky-way' ? 46 : 26, 20, 20),
        new THREE.MeshBasicMaterial({
          color: new THREE.Color(landmark.accent),
          transparent: true,
          opacity: landmark.id === 'milky-way' ? 0.95 : 0.72,
          depthWrite: false,
        }),
      )
      beacon.position.copy(local)
      beacon.position.z = 0 // Ensure on plane
      this.beaconGroup.add(beacon)

      // Label sprite positioned above beacon
      const label = this.makeLabelSprite(landmark.label, landmark.id === 'milky-way')
      label.position.copy(local)
      label.position.z = 80 // Slight Z offset for visibility
      this.labelGroup.add(label)
    }
  }

  /**
   * Adds a subtle central glow behind the tilted Local Group frame.
   */
  private createAtmosphere(): THREE.Mesh {
    return new THREE.Mesh(
      new THREE.PlaneGeometry(26000, 26000),
      new THREE.MeshBasicMaterial({
        color: 0x04111b,
        transparent: true,
        opacity: 0.7,
        depthWrite: false,
      }),
    )
  }

  /**
   * Resolves a landmark to live group coordinates when possible.
   */
  private resolveLandmarkCoordinates(
    landmark: LocalGroupLandmark,
    groups: GalaxyGroup[],
  ): LocalGroupCoordinates {
    if (landmark.groupPgc == null) return landmark.coordinates
    const match = groups.find((group) => group.group_pgc === landmark.groupPgc)
    if (!match) return landmark.coordinates
    return { sgx: match.sgx, sgy: match.sgy, sgz: match.sgz }
  }

  /**
   * Maps SGX, SGY, and SGZ into the flat Local Group display coordinates.
   */
  private toLocalDisplayCoordinates(source: LocalGroupCoordinates): THREE.Vector3 {
    return new THREE.Vector3(
      source.sgx * LOCAL_GROUP_SCENE_UNITS_PER_MPC,
      source.sgy * LOCAL_GROUP_SCENE_UNITS_PER_MPC,
      0 // Always on plane (flat projection)
    )
  }

  /**
   * Creates a lightweight sprite label for a Local Group landmark.
   */
  private makeLabelSprite(text: string, emphasize: boolean): THREE.Sprite {
    const canvas = document.createElement('canvas')
    const scale = 2
    canvas.width = 440 * scale
    canvas.height = 70 * scale
    const context = canvas.getContext('2d')
    if (!context) {
      throw new Error('2D canvas context unavailable for Local Group labels.')
    }

    context.scale(scale, scale)
    context.font = `${emphasize ? '700' : '500'} 18px "IBM Plex Sans", "Segoe UI", sans-serif`
    context.textAlign = 'center'
    context.textBaseline = 'middle'
    context.shadowColor = emphasize ? 'rgba(255,255,255,0.85)' : 'rgba(94,205,255,0.75)'
    context.shadowBlur = emphasize ? 18 : 10
    context.fillStyle = emphasize ? 'rgba(255,255,255,0.95)' : 'rgba(211,245,255,0.86)'
    context.fillText(text, 220, 35)

    const material = new THREE.SpriteMaterial({
      map: new THREE.CanvasTexture(canvas),
      transparent: true,
      depthTest: false,
      depthWrite: false,
    })
    const sprite = new THREE.Sprite(material)
    sprite.scale.set(emphasize ? 680 : 560, emphasize ? 118 : 104, 1)
    return sprite
  }

  /**
   * Disposes geometries and materials from a scene group.
   */
  private disposeGroup(group: THREE.Group): void {
    clearGroup(group)
  }
}

/**
 * Removes all current children from a scene group.
 */
function clearGroup(group: THREE.Group): void {
  while (group.children.length > 0) {
    const child = group.children[0]
    group.remove(child)
    disposeObjectResources(child)
  }
}

/**
 * Disposes any geometry, texture, or material attached to the provided object.
 */
function disposeObjectResources(object: THREE.Object3D): void {
  if (
    object instanceof THREE.Mesh ||
    object instanceof THREE.Line ||
    object instanceof THREE.LineLoop ||
    object instanceof THREE.LineSegments
  ) {
    object.geometry.dispose()
    if (Array.isArray(object.material)) {
      object.material.forEach((material) => material.dispose())
    } else {
      object.material.dispose()
    }
  }

  if (object instanceof THREE.Sprite) {
    object.material.map?.dispose()
    object.material.dispose()
  }
}

/**
 * Creates a circular line geometry in the local range plane.
 */
function createCircleGeometry(radius: number, segments: number): THREE.BufferGeometry {
  const positions = new Float32Array((segments + 1) * 3)
  for (let index = 0; index <= segments; index++) {
    const angle = (index / segments) * Math.PI * 2
    positions[index * 3] = Math.cos(angle) * radius
    positions[index * 3 + 1] = 0
    positions[index * 3 + 2] = Math.sin(angle) * radius
  }

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  return geometry
}

