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

      // Debug: Log the raw response structure
      console.log('SIMBAD response:', data)
      console.log('Has data.data:', !!data.data)
      console.log('Data array length:', data.data?.length || 0)
      if (data.data && data.data.length > 0) {
        console.log('First row keys:', Object.keys(data.data[0]))
        console.log('First row:', data.data[0])
      }

      // Parse SIMBAD JSON response
      // The API returns { columns: [...], data: [[...], [...]] }
      // where columns describe the field names and data contains the rows
      if (data.columns && data.data && Array.isArray(data.data)) {
        // Create a mapping of column names to indices
        const columnMap: Record<string, number> = {}
        data.columns.forEach((col: any, idx: number) => {
          columnMap[col.name.toLowerCase()] = idx
        })

        console.log('Column map:', columnMap)

        // Convert array rows to objects using the column mapping
        results.value = data.data
          .map((row: any[]) => {
            const mainIdIdx = columnMap['main_id']
            const typeIdx = columnMap['otype']
            const raIdx = columnMap['ra']
            const decIdx = columnMap['dec']

            return {
              name: row[mainIdIdx] || 'Unknown',
              type: row[typeIdx] || 'Unknown',
              ra: raIdx !== undefined ? parseFloat(row[raIdx]) : undefined,
              dec: decIdx !== undefined ? parseFloat(row[decIdx]) : undefined,
            }
          })
          .filter((obj: any) => obj.name && obj.name !== 'Unknown') // Only include objects with names
          .slice(0, 20) // Limit to 20 results for UI
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
