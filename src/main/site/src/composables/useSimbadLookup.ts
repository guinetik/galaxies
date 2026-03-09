import { ref, readonly } from 'vue'

/**
 * Result from SIMBAD cone search
 */
export interface SimbadObject {
  name: string
  type: string
  ra?: number
  dec?: number
  distance?: number
}

/**
 * Composable for querying SIMBAD astronomical objects by coordinates
 */
export function useSimbadLookup() {
  const loading = ref(false)
  const results = ref<SimbadObject[]>([])
  const error = ref<string | null>(null)

  /**
   * Query SIMBAD for objects near given coordinates
   * @param ra Right ascension in decimal degrees
   * @param dec Declination in decimal degrees
   * @param radiusArcsec Search radius in arcseconds (default: 30)
   */
  async function query(
    ra: number,
    dec: number,
    radiusArcsec: number = 30
  ): Promise<void> {
    loading.value = true
    error.value = null
    results.value = []

    try {
      // Implementation to follow in next task
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unknown error'
      results.value = []
    } finally {
      loading.value = false
    }
  }

  return {
    loading: readonly(loading),
    results: readonly(results),
    error: readonly(error),
    query,
  }
}
