/**
 * Galaxy Params Mapper — Backward-compatible adapter
 *
 * Delegates to the new morphology module. Existing imports continue to work.
 * TODO: Migrate consumers to import from morphology/ directly, then delete this file.
 */

import type { Galaxy } from '@/types/galaxy'
import {
  type GalaxyMorphology,
  type GalaxyRenderParams,
  type MorphologyPreset,
  type ParsedMorphology,
  parseMorphology,
  mapGalaxyToRenderParams,
} from './morphology'

// Re-export types for backward compatibility
export type { GalaxyMorphology, GalaxyRenderParams, MorphologyPreset, ParsedMorphology }
export { parseMorphology }

// The old GeneratorParams was a discriminated union. Re-export the new flat type under the old name.
export type GeneratorParams = GalaxyRenderParams

// Old per-type param interfaces — alias to the flat type for compilation.
// Consumers that cast (e.g., `params as SpiralParams`) will compile but
// won't get per-type narrowing anymore. This is intentional — they will
// be migrated in subsequent tasks.
export type SpiralParams = GalaxyRenderParams
export type BarredParams = GalaxyRenderParams
export type EllipticalParams = GalaxyRenderParams
export type LenticularParams = GalaxyRenderParams
export type IrregularParams = GalaxyRenderParams

/** Backward-compatible entry point — delegates to new mapper. */
export function galaxyToGeneratorParams(galaxy: Galaxy): GalaxyRenderParams {
  return mapGalaxyToRenderParams(galaxy)
}
