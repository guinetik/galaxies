import * as THREE from 'three'
import { EARTH_RADIUS, EARTH_Y_OFFSET } from './constants'

const earthVertexShader = /* glsl */ `
varying vec3 vNormal;
varying vec3 vPosition;

void main() {
  vNormal = normalize(normalMatrix * normal);
  vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

const earthFragmentShader = /* glsl */ `
varying vec3 vNormal;
varying vec3 vPosition;

void main() {
  // View direction for Fresnel
  vec3 viewDir = normalize(-vPosition);
  float fresnel = 1.0 - max(dot(viewDir, vNormal), 0.0);
  fresnel = pow(fresnel, 2.0);

  // Dark ocean blue base
  vec3 baseColor = vec3(0.02, 0.04, 0.08);

  // Atmospheric glow at edges (Fresnel)
  vec3 atmosColor = vec3(0.15, 0.35, 0.65);
  vec3 finalColor = mix(baseColor, atmosColor, fresnel * 0.8);

  // Slight emission so the horizon edge is visible
  float alpha = 0.6 + fresnel * 0.4;

  gl_FragColor = vec4(finalColor, alpha);
}
`

export class EarthHorizon {
  readonly mesh: THREE.Mesh

  constructor() {
    const geometry = new THREE.SphereGeometry(EARTH_RADIUS, 64, 64)
    const material = new THREE.ShaderMaterial({
      vertexShader: earthVertexShader,
      fragmentShader: earthFragmentShader,
      side: THREE.BackSide,
      transparent: true,
      depthWrite: false,
    })

    this.mesh = new THREE.Mesh(geometry, material)
    this.mesh.position.set(0, EARTH_Y_OFFSET, 0)
  }

  dispose(): void {
    ;(this.mesh.geometry as THREE.BufferGeometry).dispose()
    ;(this.mesh.material as THREE.ShaderMaterial).dispose()
  }
}
