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
      const radiusDeg = radiusArcsec / 3600 // Convert arcseconds to degrees

      // Build SIMBAD cone search URL
      const url = new URL('https://simbad.cds.unistra.fr/cone/')
      url.searchParams.set('RA', ra.toString())
      url.searchParams.set('DEC', dec.toString())
      url.searchParams.set('SR', radiusDeg.toString())
      url.searchParams.set('RESPONSEFORMAT', 'json')
      url.searchParams.set('VERB', '2')

      const response = await fetch(url.toString())
      if (!response.ok) {
        throw new Error(`SIMBAD API error: ${response.statusText}`)
      }

      const data = await response.json()

      // Parse SIMBAD VOTable JSON response
      // Expected format: { resources: [{ table: { data: { rows: [...] } } }] }
      if (data.resources && data.resources[0]?.table?.data?.rows) {
        const rows = data.resources[0].table.data.rows
        results.value = rows.map((row: any) => ({
          name: row.MAIN_ID || 'Unknown',
          type: row.OTYPE || 'Unknown',
          ra: parseFloat(row.RA_d),
          dec: parseFloat(row.DEC_d),
          distance: parseFloat(row.DISTANCE), // in degrees
        }))
      } else {
        results.value = []
      }
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
