import * as THREE from 'three'
import type { Planet } from './PlanetGenerator'

// Common GLSL libraries (prepended at runtime, same pattern as StarScene.ts)
import noiseLib from './shaders/noise.glsl?raw'
import colorLib from './shaders/color.glsl?raw'
import seedLib from './shaders/seed.glsl?raw'
import lightingLib from './shaders/lighting.glsl?raw'

// Vertex shader (shared by all planet types)
import planetVert from './shaders/planet/planet.vert.glsl?raw'

// Fragment shaders (10 types)
import rockyFrag from './shaders/planet/rocky.frag.glsl?raw'
import gasGiantFrag from './shaders/planet/gasGiant.frag.glsl?raw'
import hotJupiterFrag from './shaders/planet/hotJupiter.frag.glsl?raw'
import iceGiantFrag from './shaders/planet/iceGiant.frag.glsl?raw'
import icyWorldFrag from './shaders/planet/icyWorld.frag.glsl?raw'
import lavaWorldFrag from './shaders/planet/lavaWorld.frag.glsl?raw'
import oceanWorldFrag from './shaders/planet/oceanWorld.frag.glsl?raw'
import subNeptuneFrag from './shaders/planet/subNeptune.frag.glsl?raw'
import desertWorldFrag from './shaders/planet/desertWorld.frag.glsl?raw'
import tidallyLockedFrag from './shaders/planet/tidallyLocked.frag.glsl?raw'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type PlanetShaderType =
  | 'rocky'
  | 'gasGiant'
  | 'hotJupiter'
  | 'iceGiant'
  | 'icyWorld'
  | 'lavaWorld'
  | 'oceanWorld'
  | 'subNeptune'
  | 'desertWorld'
  | 'tidallyLocked'

// ---------------------------------------------------------------------------
// Internal maps
// ---------------------------------------------------------------------------

const FRAG_SHADERS: Record<PlanetShaderType, string> = {
  rocky: rockyFrag,
  gasGiant: gasGiantFrag,
  hotJupiter: hotJupiterFrag,
  iceGiant: iceGiantFrag,
  icyWorld: icyWorldFrag,
  lavaWorld: lavaWorldFrag,
  oceanWorld: oceanWorldFrag,
  subNeptune: subNeptuneFrag,
  desertWorld: desertWorldFrag,
  tidallyLocked: tidallyLockedFrag,
}

export const BASE_COLORS: Record<PlanetShaderType, THREE.Color> = {
  rocky:          new THREE.Color(0.6, 0.5, 0.4),
  gasGiant:       new THREE.Color(0.8, 0.7, 0.5),
  hotJupiter:     new THREE.Color(0.9, 0.4, 0.2),
  iceGiant:       new THREE.Color(0.4, 0.6, 0.8),
  icyWorld:       new THREE.Color(0.7, 0.8, 0.9),
  lavaWorld:      new THREE.Color(0.9, 0.3, 0.1),
  oceanWorld:     new THREE.Color(0.2, 0.4, 0.7),
  subNeptune:     new THREE.Color(0.5, 0.6, 0.7),
  desertWorld:    new THREE.Color(0.8, 0.65, 0.4),
  tidallyLocked:  new THREE.Color(0.5, 0.4, 0.3),
}

// ---------------------------------------------------------------------------
// Shader-type selection
// ---------------------------------------------------------------------------

/**
 * Determine which fragment shader to use for a planet based on its physical
 * properties.
 */
export function mapPlanetToShaderType(planet: Planet): PlanetShaderType {
  const { type, temperature: teq, mass, radius } = planet

  if (type === 'GasGiant') {
    if (teq > 1000) return 'hotJupiter'
    if (teq < 200)  return 'iceGiant'
    return 'gasGiant'
  }

  if (type === 'SubNeptune') {
    if (teq < 200) return 'iceGiant'
    return 'subNeptune'
  }

  // Rocky
  if (teq > 800) return 'lavaWorld'
  if (teq < 200) return 'icyWorld'
  if (teq > 400 && teq < 800) return 'desertWorld'
  // Habitable-zone ocean worlds: 250 K < Teq < 350 K and low density (mass < 3)
  if (teq > 250 && teq < 350 && mass < 3) return 'oceanWorld'
  return 'rocky'
}

// ---------------------------------------------------------------------------
// Shader source accessors
// ---------------------------------------------------------------------------

/** Vertex shader shared by all planet types. */
export function getPlanetVertexShader(): string {
  return planetVert
}

/**
 * Fragment shader for the given type, with all common GLSL libraries
 * prepended (noise → color → lighting → seed → type-specific frag).
 */
export function getPlanetFragmentShader(shaderType: PlanetShaderType): string {
  return noiseLib + colorLib + lightingLib + seedLib + FRAG_SHADERS[shaderType]
}

// ---------------------------------------------------------------------------
// Uniform factory
// ---------------------------------------------------------------------------

/**
 * Create Three.js shader uniforms for a planet mesh.
 *
 * @param planet      - Planet data from PlanetGenerator
 * @param shaderType  - Shader type (from mapPlanetToShaderType)
 * @param planetSeed  - Deterministic seed value for this planet [0, 1]
 * @param starTeff    - Host star effective temperature in Kelvin
 */
export function createPlanetUniforms(
  planet: Planet,
  shaderType: PlanetShaderType,
  planetSeed: number,
  starTeff: number,
): Record<string, { value: unknown }> {
  // Normalized density: Earth-like density ≈ 5.5 g/cm³ as reference
  const rawDensity = planet.mass / Math.pow(planet.radius, 3) / 5.5
  const uDensity = Math.max(0, Math.min(1, rawDensity))

  // Insolation: flux ∝ 1/a², clamped to [0, 1]
  const uInsolation = Math.max(0, Math.min(1, 1 / (planet.semiMajorAxis * planet.semiMajorAxis)))

  // Atmosphere flag: Rocky planets are assumed airless by default
  const uHasAtmosphere = planet.type === 'Rocky' ? 0.0 : 1.0

  return {
    uBaseColor:                 { value: BASE_COLORS[shaderType].clone() },
    uTime:                      { value: 0 },
    uTemperature:               { value: planet.temperature },
    uHasAtmosphere:             { value: uHasAtmosphere },
    uSeed:                      { value: planetSeed },
    uDensity:                   { value: uDensity },
    uInsolation:                { value: uInsolation },
    uStarTemp:                  { value: starTeff },
    uDetailLevel:               { value: 1.0 },
    uEnableTerminator:          { value: 0.0 },
    uColorTempFactor:           { value: 0.5 },
    uColorCompositionFactor:    { value: 0.5 },
    uColorIrradiationFactor:    { value: 0.3 },
    uColorMetallicityFactor:    { value: 0.3 },
  }
}
