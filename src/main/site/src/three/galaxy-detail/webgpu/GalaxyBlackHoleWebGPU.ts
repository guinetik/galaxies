/**
 * WebGPU Black Hole — Ray-marched accretion disk on billboard quad (native TSL).
 *
 * Ports blackhole.frag.glsl to TSL Fn() nodes on a MeshBasicNodeMaterial.
 * Visual output matches the WebGL version.
 */

import * as THREE from 'three/webgpu'
import {
  uniform,
  vec2,
  vec3,
  vec4,
  float,
  Fn,
  Loop,
  If,
  Break,
  Discard,
  uv,
  length,
  normalize,
  cross,
  dot,
  cos,
  sin,
  atan,
  abs,
  sqrt,
  exp,
  mix,
  smoothstep,
  max,
  clamp,
  pow,
} from 'three/tsl'
import { hash13, noise2d } from './tsl-helpers'

export class GalaxyBlackHoleWebGPU {
  readonly mesh: THREE.Mesh
  readonly depthMesh: THREE.Mesh
  private quadSize: number

  // TSL uniforms (reactive via .value)
  private uTime = uniform(0)
  private uTiltX = uniform(0)
  private uRotY = uniform(0)
  private uLOD = uniform(0)

  constructor(quadSize = 60) {
    this.quadSize = quadSize

    // Depth sphere (invisible, writes depth to occlude stars behind BH)
    const depthGeometry = new THREE.SphereGeometry(1, 4, 4)
    const depthMaterial = new THREE.MeshBasicNodeMaterial({ visible: false })
    this.depthMesh = new THREE.Mesh(depthGeometry, depthMaterial)

    // Build TSL fragment
    const uTime = this.uTime
    const uTiltX = this.uTiltX
    const uRotY = this.uRotY
    const uLOD = this.uLOD

    const blackHoleFragment = Fn(() => {
      // UV → NDC
      const pp = uv().sub(0.5).mul(2.0)
      const screenR = length(pp)

      // Early discard outside circle
      If(screenR.greaterThan(1.0), () => {
        Discard()
      })

      // Camera setup
      const lookAt = vec3(0.0, -0.1, 0.0)
      const eyer = float(2.0)
      const eyea = uRotY
      const eyea2 = uTiltX.add(1.2)

      const ro = vec3(
        eyer.mul(cos(eyea)).mul(sin(eyea2)),
        eyer.mul(cos(eyea2)),
        eyer.mul(sin(eyea)).mul(sin(eyea2)),
      )

      const front = normalize(lookAt.sub(ro))
      const left = normalize(cross(normalize(vec3(0.0, 1.0, -0.1)), front))
      const up = normalize(cross(front, left))
      const rd = normalize(front.mul(1.5).add(left.mul(pp.x)).add(up.mul(pp.y)))

      // Black hole parameters
      const bh = vec3(0.0, 0.0, 0.0)
      const bhr = float(0.1)
      const bhmass = float(0.008)

      // Mutable ray state
      const p = ro.toVar()
      const pv = rd.toVar()

      // Jitter to reduce banding
      p.addAssign(pv.mul(hash13(rd.add(uTime)).mul(0.02)))

      // LOD-driven parameters
      const intensity = mix(float(0.3), float(1.0), uLOD)
      const stepSz = mix(float(0.012), float(0.005), uLOD)
      const animSpeed = mix(float(0.005), float(0.02), uLOD)
      const grainMix = mix(float(0.1), float(0.5), uLOD)

      const baseDt = float(0.02)
      const col = vec3(0.0, 0.0, 0.0).toVar()
      const noncaptured = float(1.0).toVar()
      const captured = float(0.0).toVar()

      // Disk colors: inner hot white → mid orange → outer deep red
      const cInner = vec3(1.0, 0.72, 0.28)
      const cMid = vec3(1.0, 0.55, 0.12)
      const cOuter = vec3(0.5, 0.12, 0.02)
      const diskInner = float(0.32)
      const diskOuter = float(2.6)
      const diskHalfThickness = float(0.04)
      const ringRadius = float(0.40)
      const captureSoftness = float(0.10)
      const viewTop = abs(sin(uTiltX))
      const diskFlatten = mix(float(4.2), float(1.0), viewTop)
      const bandWidth = mix(float(0.007), float(0.018), viewTop)

      const diskRotSpeed = uTime.mul(animSpeed).mul(30.0)

      // Ray march with gravity
      const t = float(0.0).toVar()
      Loop(200, () => {
        If(t.greaterThanEqual(1.0), () => {
          Break()
        })

        const toBH = bh.sub(p)
        const distSq = dot(toBH, toBH)
        const dist = sqrt(distSq)
        const holeShadow = smoothstep(bhr.mul(1.15), bhr.mul(2.8), dist)

        // Adaptive step: smaller near BH for accuracy
        const adaptDt = baseDt.mul(
          mix(float(0.8), float(1.5), smoothstep(float(0.2), float(1.5), dist)),
        )
        p.addAssign(pv.mul(adaptDt).mul(noncaptured))

        // Gravity: Newton's inverse-square
        pv.addAssign(toBH.mul(bhmass.div(dist.mul(distSq))))

        // Capture test (wide smoothstep for natural photon ring dimming)
        const distToHorizon = dist.sub(bhr)
        noncaptured.assign(
          smoothstep(float(0.0), captureSoftness, distToHorizon),
        )
        captured.assign(max(captured, float(1.0).sub(noncaptured)))

        // Early exit if captured
        If(noncaptured.lessThan(0.001), () => {
          Break()
        })

        // ── Accretion disk ──────────────────────────────────────────

        const diskRadius = length(toBH.xz)
        const diskT = clamp(
          diskRadius.sub(diskInner).div(diskOuter.sub(diskInner)),
          float(0.0),
          float(1.0),
        )
        const diskY = abs(p.y).mul(diskFlatten)
        const verticalMask = float(1.0).sub(
          smoothstep(diskHalfThickness, diskHalfThickness.mul(2.0), diskY),
        )
        const radialIn = smoothstep(diskInner.sub(0.08), diskInner.add(0.12), diskRadius)
        const radialOut = float(1.0).sub(
          smoothstep(diskOuter.sub(0.7), diskOuter.add(0.2), diskRadius),
        )
        const midRingSuppression = float(1.0).sub(
          float(1.0).sub(smoothstep(float(0.55), float(0.95), diskRadius))
            .mul(float(1.0).sub(smoothstep(float(0.01), float(0.045), diskY))),
        )
        const diskMask = verticalMask.mul(radialIn).mul(radialOut).mul(midRingSuppression)

        const diskAngle = atan(toBH.x, toBH.z)
        const rotAngle = diskAngle.add(diskRotSpeed)

        // Procedural noise texture
        const diskUV = vec2(
          mix(float(0.2), float(1.0), diskT).mul(12.0),
          rotAngle.mul(5.0),
        )
        const turbulence = max(
          float(0.0),
          noise2d(diskUV.mul(vec2(0.1, 0.5))).add(0.05),
        )
        const grain = noise2d(diskUV.mul(vec2(1.5, 3.0)).add(77.0))
        const streaks = noise2d(
          vec2(
            rotAngle.mul(18.0).sub(uTime.mul(animSpeed).mul(140.0)),
            diskT.mul(36.0).add(11.0),
          ),
        )
        const clumps = noise2d(
          vec2(
            rotAngle.mul(34.0).add(grain.mul(2.0)),
            diskT.mul(80.0).sub(uTime.mul(animSpeed).mul(40.0)),
          ),
        )
        const innerMask = float(1.0).sub(smoothstep(float(0.08), float(0.42), diskT))
        const innerTexture = mix(float(0.45), float(1.15), streaks.mul(clumps))
        const darkLanes = mix(
          float(1.0),
          mix(float(0.32), float(1.0), smoothstep(float(0.18), float(0.82), grain)),
          innerMask,
        )
        const diskTexBase = turbulence.mul(
          float(1.0).sub(grainMix).add(grainMix.mul(grain)),
        )
        const diskTex = diskTexBase.mul(
          mix(float(1.0), innerTexture.mul(darkLanes), innerMask),
        )

        // Doppler beaming — approaching side brighter
        const doppler = float(1.0).add(cos(rotAngle).mul(0.7))

        // 3-color radial gradient
        const diskColor1 = mix(cInner, cMid, smoothstep(float(0.0), float(0.28), diskT))
        const diskColor2 = mix(diskColor1, cOuter, smoothstep(float(0.35), float(1.0), diskT))
        const radialBoost = mix(float(0.30), float(0.42), pow(diskT, float(0.7)))
        const innerSuppression = mix(
          float(0.14),
          float(1.0),
          smoothstep(float(0.02), float(0.3), diskT),
        )
        const outerLift = mix(
          float(0.88),
          float(1.16),
          smoothstep(float(0.45), float(1.0), diskT),
        )
        const diskColor = diskColor2
          .mul(diskTex)
          .mul(doppler)
          .mul(radialBoost)
          .mul(innerSuppression)
          .mul(outerLift)

        col.addAssign(
          max(vec3(0.0, 0.0, 0.0), diskColor.mul(diskMask).mul(noncaptured).mul(holeShadow)),
        )

        const midBand = exp(pow(diskY.div(bandWidth), float(2.0)).negate())
        const midBandRadial = smoothstep(float(0.48), float(0.72), diskRadius).mul(
          float(1.0).sub(smoothstep(float(1.05), float(1.38), diskRadius)),
        )
        const midBandNoise = mix(float(0.65), float(1.55), streaks.mul(0.7).add(clumps.mul(0.3)))
        const midBandColor = mix(cInner, cMid, float(0.45))
          .mul(diskTex)
          .mul(midBandNoise)
        col.addAssign(
          midBandColor
            .mul(midBand)
            .mul(midBandRadial)
            .mul(noncaptured)
            .mul(holeShadow)
            .mul(0.42),
        )

        // Ambient glow near event horizon
        col.addAssign(
          vec3(0.8, 0.5, 0.2)
            .mul(float(1.0).div(distSq))
            .mul(0.000003)
            .mul(noncaptured)
            .mul(holeShadow),
        )

        // Photon ring at photon sphere (~1.5× event horizon)
        const ringCore = exp(
          pow(dist.sub(ringRadius).div(0.028), float(2.0)).negate(),
        )
        const ringHalo = exp(
          pow(dist.sub(ringRadius.add(0.08)).div(0.08), float(2.0)).negate(),
        )
        col.addAssign(
          vec3(1.0, 0.78, 0.42)
            .mul(ringCore.mul(0.035).add(ringHalo.mul(0.004)))
            .mul(noncaptured)
            .mul(holeShadow),
        )

        t.addAssign(stepSz)
      })

      // Apply LOD intensity
      col.mulAssign(intensity)
      col.mulAssign(float(1.0).sub(captured.mul(0.98)))

      // Output with alpha
      const feather = float(1.0).sub(
        smoothstep(float(0.3), float(1.0), screenR),
      )
      const lum = dot(col, vec3(0.299, 0.587, 0.114))
      const glowAlpha = pow(
        clamp(lum.mul(3.0), float(0.0), float(1.0)),
        float(1.5),
      ).mul(feather)
      const alpha = max(glowAlpha, captured)
      col.mulAssign(feather)

      return vec4(col, alpha)
    })

    // Material
    const material = new THREE.MeshBasicNodeMaterial()
    material.transparent = true
    material.depthWrite = false
    material.side = THREE.DoubleSide
    material.fragmentNode = blackHoleFragment()

    // Visual billboard quad
    this.mesh = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), material)
    this.mesh.scale.set(quadSize, quadSize, 1)
    this.mesh.renderOrder = 1
  }

  update(
    time: number,
    cameraTiltX: number,
    cameraRotY: number,
    camera: THREE.Camera,
    rendererSize: THREE.Vector2,
    dpr: number,
  ): void {
    this.uTime.value = time
    this.uTiltX.value = cameraTiltX
    this.uRotY.value = cameraRotY

    this.mesh.quaternion.copy(camera.quaternion)

    // LOD: 0 = far away (dim), 1 = close up (full intensity)
    const camDist = camera.position.length()
    const fov = (camera as THREE.PerspectiveCamera).fov ?? 60
    const vFov = (fov * Math.PI) / 180
    const screenH = rendererSize.y * dpr
    const apparentPx =
      (this.quadSize / camDist) * (screenH / (2 * Math.tan(vFov / 2)))
    this.uLOD.value = Math.min(Math.max((apparentPx - 6) / 220, 0), 1)
  }

  getLOD(): number {
    return this.uLOD.value as number
  }

  dispose(): void {
    ;(this.mesh.material as THREE.Material).dispose()
    ;(this.mesh.geometry as THREE.BufferGeometry).dispose()
    ;(this.depthMesh.geometry as THREE.BufferGeometry).dispose()
    ;(this.depthMesh.material as THREE.Material).dispose()
  }
}
