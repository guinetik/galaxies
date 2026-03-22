import { ref, readonly } from 'vue'
import { arcsecToDeg } from '@/lib/astronomy'

/**
 * Result from SIMBAD cone search
 */
export interface SimbadObject {
  name: string
  type: string
  ra?: number
  dec?: number
  distance?: number
  simbadUrl?: string
}

/**
 * Object types to exclude (emission-based, radio, etc.).
 * SIMBAD classifies as "peculiar emitters" when physical nature is unknown.
 */
const EXCLUDED_OTYPES = [
  'radio',
  'em*',
  'ir',
  'uv',
  'x',
  'gam',
  'gamma',
  'grb',
  'pulsar',
  'maser',
]

/**
 * Returns true if the object type should be shown (not filtered out).
 * Excludes emission-based types (Radio, Em*, IR, X, etc.).
 */
export function isDisplayableSimbadType(otype: string): boolean {
  if (!otype || otype === 'Unknown') return false
  const lower = otype.toLowerCase()
  return !EXCLUDED_OTYPES.some((ex) => lower.includes(ex))
}

/**
 * Composable for querying SIMBAD astronomical objects by coordinates
 */
export function useSimbadLookup() {
  const loading = ref(false)
  const results = ref<SimbadObject[]>([])
  const error = ref<string | null>(null)
  let fetchAbort: AbortController | null = null

  /**
   * Clears UI state and aborts any in-flight SIMBAD request.
   */
  function reset(): void {
    fetchAbort?.abort()
    fetchAbort = null
    loading.value = false
    error.value = null
    results.value = []
  }

  /**
   * Query SIMBAD for objects near given coordinates
   * @param ra Right ascension in decimal degrees
   * @param dec Declination in decimal degrees
   * @param radiusArcsec Search radius in arcseconds (default: 30)
   * @param options.objectTypeFilter When 'starsAndGalaxies', uses TAP API to filter at source (excludes Nova, Em*, etc.)
   */
  async function query(
    ra: number,
    dec: number,
    radiusArcsec: number = 30,
    options?: { objectTypeFilter?: 'starsAndGalaxies' }
  ): Promise<void> {
    fetchAbort?.abort()
    fetchAbort = new AbortController()
    const signal = fetchAbort.signal

    loading.value = true
    error.value = null
    results.value = []

    try {
      const radiusDeg = arcsecToDeg(radiusArcsec)

      if (options?.objectTypeFilter === 'starsAndGalaxies') {
        // TAP API: filter at source — stars only (exclude Nova, Em*, galaxies)
        const adql = `SELECT TOP 50 main_id, ra, dec, otype FROM basic WHERE CONTAINS(POINT('ICRS', ra, dec), CIRCLE('ICRS', ${ra}, ${dec}, ${radiusDeg})) = 1 AND otype = 'Star..' AND otype NOT IN ('No*', 'Em*')`
        const url = `https://simbad.cds.unistra.fr/simbad/sim-tap/sync?REQUEST=doQuery&LANG=ADQL&FORMAT=json&QUERY=${encodeURIComponent(adql)}`
        const response = await fetch(url, { signal })
        if (!response.ok) throw new Error(`SIMBAD TAP error: ${response.statusText}`)
        const data = await response.json()
        if (data.data && Array.isArray(data.data)) {
          results.value = data.data.map((row: unknown[]) => ({
            name: row[0] || 'Unknown',
            type: row[3] || 'Unknown',
            ra: typeof row[1] === 'number' ? row[1] : undefined,
            dec: typeof row[2] === 'number' ? row[2] : undefined,
            simbadUrl: `https://simbad.cds.unistra.fr/simbad/sim-id?Ident=${encodeURIComponent(String(row[0] || ''))}`,
          })).filter((obj: SimbadObject) => obj.name && obj.name !== 'Unknown')
        }
      } else {
        // Cone search (all types, client-side filter)
        const coneUrl = new URL('https://simbad.cds.unistra.fr/cone/')
        coneUrl.searchParams.set('RA', ra.toString())
        coneUrl.searchParams.set('DEC', dec.toString())
        coneUrl.searchParams.set('SR', radiusDeg.toString())
        coneUrl.searchParams.set('RESPONSEFORMAT', 'json')
        coneUrl.searchParams.set('VERB', '2')
        const response = await fetch(coneUrl.toString(), { signal })
        if (!response.ok) throw new Error(`SIMBAD API error: ${response.statusText}`)
        const data = await response.json()
        if (data.columns && data.data && Array.isArray(data.data)) {
          const columnMap: Record<string, number> = {}
          data.columns.forEach((col: { name: string }, idx: number) => {
            columnMap[col.name.toLowerCase()] = idx
          })
          results.value = data.data
            .map((row: unknown[]) => {
              const mainIdIdx = columnMap['main_id']
              const typeIdx = columnMap['otype']
              const raIdx = columnMap['ra']
              const decIdx = columnMap['dec']
              const arr = row as unknown[]
              const name = arr[mainIdIdx] || 'Unknown'
              return {
                name,
                type: arr[typeIdx] || 'Unknown',
                ra: raIdx !== undefined ? parseFloat(arr[raIdx] as string) : undefined,
                dec: decIdx !== undefined ? parseFloat(arr[decIdx] as string) : undefined,
                simbadUrl: `https://simbad.cds.unistra.fr/simbad/sim-id?Ident=${encodeURIComponent(String(name))}`,
              }
            })
            .filter((obj: SimbadObject) => obj.name && obj.name !== 'Unknown' && isDisplayableSimbadType(obj.type))
            .slice(0, 50)
        }
      }
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        return
      }
      error.value = err instanceof Error ? err.message : 'Unknown error'
      results.value = []
    } finally {
      if (!signal.aborted) {
        loading.value = false
        fetchAbort = null
      }
    }
  }

  return {
    loading: readonly(loading),
    results: readonly(results),
    error: readonly(error),
    query,
    reset,
  }
}
