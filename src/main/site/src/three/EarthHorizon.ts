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

    // Local City Position (on the unrotated sphere)
    const localCity = new THREE.Vector3(
      -Math.cos(phi) * Math.sin(theta),
       Math.cos(theta),
       Math.sin(phi) * Math.sin(theta)
    ).normalize()

    // Local North Pole (on the unrotated sphere)
    const localNorth = new THREE.Vector3(0, 1, 0)

    // Tangent North vector at City: component of North Pole perpendicular to Up
    // We want the vector pointing towards the North Pole along the surface.
    const up = localCity.clone()
    const northTangent = new THREE.Vector3()
    
    if (Math.abs(up.y) > 0.99) {
      // At poles, "North" is singular.
      // If we are at North Pole (up ~ +Y), any direction is South.
      // Let's align Prime Meridian (Z axis) to South (+Z).
      // So "North" direction is -Z.
      northTangent.set(0, 0, -1)
    } else {
      // Project North Pole onto tangent plane
      // T = N - (N.U)U
      northTangent.copy(localNorth).sub(up.clone().multiplyScalar(localNorth.dot(up))).normalize()
    }

    // East = North x Up?
    // In standard RH system: X x Y = Z.
    // Here: North (-Z) x Up (Y) = +X (East).
    // So East = cross(NorthTangent, Up).
    // Wait. If North is tangent pointing North, and Up is Up.
    // North x Up = East?
    // Let's visualize: North is forward. Up is up. East is right.
    // Forward x Up = Right?
    // (-Z) x (Y) = (0,0,-1) x (0,1,0) = (1,0,0) = +X. Yes.
    // So East = North x Up.
    const eastTangent = new THREE.Vector3().crossVectors(northTangent, up).normalize()

    // Construct Rotation Matrix
    // We want to map:
    //   eastTangent -> (1, 0, 0)
    //   up          -> (0, 1, 0)
    //   northTangent -> (0, 0, -1)
    
    // Basis Matrix M_local has columns [East, Up, North]
    const localBasis = new THREE.Matrix4().makeBasis(eastTangent, up, northTangent)
    
    // Target Basis M_target has columns [(1,0,0), (0,1,0), (0,0,-1)]
    const targetBasis = new THREE.Matrix4().makeBasis(
      new THREE.Vector3(1, 0, 0),
      new THREE.Vector3(0, 1, 0),
      new THREE.Vector3(0, 0, -1)
    )

    // R * M_local = M_target
    // R = M_target * M_local^-1
    // Since orthogonal, M_local^-1 = M_local^T
    
    const rotationMatrix = targetBasis.multiply(localBasis.transpose())
    this.targetQuat.setFromRotationMatrix(rotationMatrix)
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
