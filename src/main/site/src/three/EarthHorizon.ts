import * as THREE from 'three'
import { EARTH_RADIUS, EARTH_Y_OFFSET } from './constants'
import earthDayUrl from '@/assets/textures/earth_day.jpg'

const earthVertexShader = /* glsl */ `
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;

void main() {
  vUv = uv;
  vNormal = normalize(normalMatrix * normal);
  vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

const earthFragmentShader = /* glsl */ `
uniform sampler2D uDayMap;
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;

void main() {
  // View direction for Fresnel
  vec3 viewDir = normalize(-vPosition);
  float fresnel = 1.0 - max(dot(viewDir, vNormal), 0.0);
  fresnel = pow(fresnel, 2.0);

  // Earth texture — slightly dimmed for night-sky feel
  vec3 texColor = texture2D(uDayMap, vUv).rgb * 0.6;

  // Atmospheric glow at edges (Fresnel)
  vec3 atmosColor = vec3(0.15, 0.35, 0.65);
  vec3 finalColor = mix(texColor, atmosColor, fresnel * 0.8);

  gl_FragColor = vec4(finalColor, 1.0);
}
`

const EARTH_LERP = 0.04

export class EarthHorizon {
  readonly mesh: THREE.Mesh
  private texture: THREE.Texture | null = null

  // Current and target quaternions for smooth rotation
  private currentQuat = new THREE.Quaternion()
  private targetQuat = new THREE.Quaternion()

  constructor() {
    const geometry = new THREE.SphereGeometry(EARTH_RADIUS, 64, 64)

    const texture = new THREE.TextureLoader().load(earthDayUrl)
    texture.colorSpace = THREE.SRGBColorSpace
    this.texture = texture

    const material = new THREE.ShaderMaterial({
      vertexShader: earthVertexShader,
      fragmentShader: earthFragmentShader,
      uniforms: {
        uDayMap: { value: texture },
      },
      side: THREE.FrontSide,
      depthWrite: true,
    })

    this.mesh = new THREE.Mesh(geometry, material)
    this.mesh.position.set(0, EARTH_Y_OFFSET, 0)
    // Render Earth before galaxies/stars so it writes depth first and occludes them
    this.mesh.renderOrder = -1
  }

  /** Set target rotation so the given lat/lon faces the camera (top of sphere) */
  setLocation(latitude: number, longitude: number): void {
    // Compute city's position on the unit sphere matching Three.js SphereGeometry UVs
    const latRad = latitude * Math.PI / 180
    const lonRad = longitude * Math.PI / 180
    const phi = lonRad + Math.PI           // horizontal angle on sphere
    const theta = (Math.PI / 2) - latRad   // vertical angle from pole

    const cityDir = new THREE.Vector3(
      -Math.cos(phi) * Math.sin(theta),
       Math.cos(theta),
       Math.sin(phi) * Math.sin(theta)
    ).normalize()

    // Rotate the sphere so this city ends up at +Y (top, closest to camera)
    this.targetQuat.setFromUnitVectors(cityDir, new THREE.Vector3(0, 1, 0))
  }

  /** Call each frame to smoothly interpolate toward target rotation */
  update(): void {
    this.currentQuat.slerp(this.targetQuat, EARTH_LERP)
    this.mesh.quaternion.copy(this.currentQuat)
  }

  dispose(): void {
    ;(this.mesh.geometry as THREE.BufferGeometry).dispose()
    ;(this.mesh.material as THREE.ShaderMaterial).dispose()
    this.texture?.dispose()
  }
}
