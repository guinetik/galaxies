/**
 * Returns the translation key suffix for the explanation shown in `GalaxyView`.
 */
export function getGalaxyViewInfoKey(hasNSAData: boolean): 'bandGuided' | 'proceduralFallback' {
  return hasNSAData ? 'bandGuided' : 'proceduralFallback'
}
