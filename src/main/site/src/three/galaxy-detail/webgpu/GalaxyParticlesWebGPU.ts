import * as THREE from 'three/webgpu'
import {
  vec2, vec3, vec4, float, mix, uv, texture, uniform, cameraPosition,
  Fn, If, min, max, abs, length, normalize, cos, sin, pow, exp, varying, smoothstep,
} from 'three/tsl'
import { createDustAtlas } from '../dustAtlas'
import { CINEMATIC, getStellarBodyVisibility } from '../cinematicAppearance'
import { noise2d } from './tsl-helpers'
import type { GalaxyRenderParams } from '../morphology'
import type { GalaxyBuffers, GalaxyUniforms } from './GalaxyComputeInit'

/** Fine stars and unresolved stellar light share the exact morphology buffers. */
export class GalaxyParticlesWebGPU {
  readonly sprite: THREE.Sprite
  readonly foregroundSprite: THREE.Sprite
  readonly bodySprite: THREE.Sprite
  private materials: THREE.SpriteNodeMaterial[] = []
  private dustMap: THREE.DataTexture
  private dustNode: ReturnType<typeof texture>
  private readonly uScreenH = uniform(800)
  private readonly rotationAge = uniform(0)
  private readonly bodyVisibility = uniform(1)
  private readonly foregroundEnabled = uniform(0)
  private readonly uTanHalfFov = uniform(Math.tan(Math.PI / 6))

  constructor(count: number, buffers: GalaxyBuffers, baseDistance: number, params: GalaxyRenderParams, uniforms: GalaxyUniforms) {
    this.dustMap = createDustAtlas(params)
    this.dustNode = texture(this.dustMap)
    const starPos = buffers.positionBuffer.toAttribute()
    const starColor = buffers.colorBuffer.toAttribute()
    const starSize = buffers.sizeBuffer.toAttribute()
    const fgAlpha = buffers.foregroundAlphaBuffer.toAttribute().mul(this.foregroundEnabled)
    const R = uniforms.galaxyRadius
    const restPosition = (p: any) => Fn(() => {
      const r: any = length(p)
      const omega = uniforms.rotationSpeed.div(pow(max(r.mul(R).div(uniforms.rotationTurnover), float(1)), uniforms.rotationFalloff)).toVar()
      If(r.mul(R).lessThan(uniforms.barLength), () => { omega.assign(uniforms.rotationSpeed) })
      const angle = omega.mul(this.rotationAge)
      return vec2(p.x.mul(cos(angle)).sub(p.y.mul(sin(angle))), p.x.mul(sin(angle)).add(p.y.mul(cos(angle))))
    })()

    // Same thin-slab sightline approximation as dust-transmission.glsl.
    const transmission = varying(Fn(() => {
      const origin = starPos.div(R)
      const eye = cameraPosition.div(R)
      const ray = normalize(eye.sub(origin))
      const dy = max(abs(ray.y), float(0.001)).toVar()
      If(ray.y.lessThan(0), () => { dy.mulAssign(-1) })
      const a = float(-0.018).sub(origin.y).div(dy)
      const b = float(0.018).sub(origin.y).div(dy)
      const entry = max(float(0), min(a, b))
      const end = min(min(length(eye.sub(origin)), float(2.6)), max(a, b))
      const path = max(float(0), end.sub(entry))
      const mid = origin.add(ray.mul(entry.add(path.mul(0.5))))
      const local = restPosition(mid.xz)
      const tau: any = (this.dustNode.sample(local.div(2.6).add(0.5)) as any).level(0).r.mul(8)
        .mul(min(path.div(0.036), float(7))).mul(0.65)
      return vec3((exp as any)(vec3(-0.65, -0.9, -1.2).mul(tau)))
    })())

    const dist = cameraPosition.sub(starPos).length().max(0.001)
    const size = starSize.mul(0.30).add(0.35)
    const targetPx = size.mul(baseDistance * 1.28).div(dist).clamp(0.25, 3.2)
    const rasterPx = targetPx.max(1)
    const coverage = targetPx.div(rasterPx).pow(2)
    const scale = rasterPx.mul(dist).mul(this.uTanHalfFov.mul(2)).div(this.uScreenH)

    const makeMaterial = () => {
      const material = new THREE.SpriteNodeMaterial()
      material.transparent = true
      material.depthWrite = false
      material.blending = THREE.AdditiveBlending
      material.positionNode = starPos
      this.materials.push(material)
      return material
    }
    const starFragment = (split: any) => {
      const p = uv().sub(0.5).mul(2)
      const core = exp(p.dot(p).mul(-4.5))
      const color = mix(starColor.rgb, vec3(0.85, 0.9, 1), float(0.12)).mul(transmission)
      // Straight RGB: Three's additive blend applies alpha once.
      const alpha = starColor.w.mul(core).mul(split).mul(coverage).mul(0.65)
      return vec4(color.mul(1.8), alpha)
    }
    const material = makeMaterial()
    material.scaleNode = scale
    material.colorNode = starFragment(float(1).sub(fgAlpha))
    this.sprite = new THREE.Sprite(material)
    this.sprite.count = count
    this.sprite.frustumCulled = false

    const foreground = makeMaterial()
    foreground.scaleNode = scale
    foreground.colorNode = starFragment(fgAlpha)
    this.foregroundSprite = new THREE.Sprite(foreground)
    this.foregroundSprite.count = count
    this.foregroundSprite.frustumCulled = false
    this.foregroundSprite.renderOrder = 2

    // GPU generation interleaves populations: this prefix samples the whole
    // morphology. No second generator, cloud physics, or alternative arm model.
    const bodyCount = Math.min(count, CINEMATIC.bodySamples)
    const body = makeMaterial()
    const radius = starPos.length().div(R)
    const oldPopulation = smoothstep(0, 0.01, uniforms.ellipticity)
    const outerTint = mix(vec3(0.48, 0.62, 0.9), vec3(0.82, 0.71, 0.57), oldPopulation)
    const tint = mix(vec3(0.92, 0.76, 0.55), outerTint, radius.mul(2.5).clamp(0, 1))
    const envelope = exp(radius.mul(-2.3)).mul(float(1).sub(smoothstep(0.85, 1.2, radius)))
    // Unwind the renderer's rotation so the mottled light travels with the stars.
    const patchiness = varying(mix(noise2d(restPosition(starPos.xz.div(R)).mul(22)).pow(2).mul(2).add(0.25), float(1), oldPopulation))
    const coord = uv().sub(0.5).mul(2)
    const gaussian = exp(coord.dot(coord).mul(-5)).sub(Math.exp(-5)).max(0)
    const resolveFade = this.bodyVisibility
    body.scaleNode = R.mul(CINEMATIC.bodyDiameter)
    body.colorNode = vec4(tint.mul(transmission), gaussian.mul(envelope).mul(patchiness).mul(resolveFade).mul(CINEMATIC.bodyOpacity * 30000 / bodyCount))
    this.bodySprite = new THREE.Sprite(body)
    this.bodySprite.count = bodyCount
    this.bodySprite.frustumCulled = false
    this.bodySprite.renderOrder = -2
  }

  updateAppearance(params: GalaxyRenderParams): void {
    this.rotationAge.value = 0
    const old = this.dustMap
    this.dustMap = createDustAtlas(params)
    this.dustNode.value = this.dustMap
    old.dispose()
  }

  advance(dt: number): void {
    this.rotationAge.value += dt
  }

  updateVisibility(distance: number, galaxyRadius: number, nucleusVisible: boolean): void {
    this.bodyVisibility.value = getStellarBodyVisibility(distance, galaxyRadius)
    this.bodySprite.visible = this.bodyVisibility.value > 0
    this.foregroundEnabled.value = nucleusVisible ? 1 : 0
    this.foregroundSprite.visible = nucleusVisible
  }

  updateSizeUniforms(screenHpx: number, tanHalfFov: number): void {
    this.uScreenH.value = Math.max(screenHpx, 1)
    this.uTanHalfFov.value = tanHalfFov
  }

  dispose(): void {
    this.materials.forEach(material => material.dispose())
    this.dustMap.dispose()
  }
}
