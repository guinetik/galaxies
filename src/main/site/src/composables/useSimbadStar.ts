import { ref, readonly } from 'vue'

export interface SimbadStar {
  mainId: string
  ra: number
  dec: number
  objectType: string
  spectralType: string | null
  parallax: number | null
  vMag: number | null
  bMag: number | null
  teff: number | null
  logg: number | null
  feh: number | null
  simbadUrl: string
}

export function useSimbadStar() {
  const loading = ref(false)
  const star = ref<SimbadStar | null>(null)
  const error = ref<string | null>(null)
  let fetchAbort: AbortController | null = null

  async function query(mainId: string): Promise<void> {
    fetchAbort?.abort()
    fetchAbort = new AbortController()
    const signal = fetchAbort.signal

    loading.value = true
    error.value = null
    star.value = null

    try {
      const adql = `SELECT TOP 1
  b.main_id, b.ra, b.dec, b.otype_txt, b.sp_type, b.plx_value,
  a.V, a.B,
  f.teff, f.log_g, f.fe_h
FROM basic AS b
LEFT JOIN allfluxes AS a ON b.oid = a.oidref
LEFT JOIN (
  SELECT oidref, teff, log_g, fe_h
  FROM mesFe_h
  WHERE mespos = 1
) AS f ON b.oid = f.oidref
WHERE b.main_id = '${mainId.replace(/'/g, "''")}'`

      const url = `https://simbad.cds.unistra.fr/simbad/sim-tap/sync?REQUEST=doQuery&LANG=ADQL&FORMAT=json&QUERY=${encodeURIComponent(adql)}`
      const response = await fetch(url, { signal })
      if (!response.ok) throw new Error(`SIMBAD TAP error: ${response.statusText}`)
      const data = await response.json()

      if (data.data && Array.isArray(data.data) && data.data.length > 0) {
        const row = data.data[0] as unknown[]
        // Columns: main_id(0), ra(1), dec(2), otype_txt(3), sp_type(4), plx_value(5),
        //          V(6), B(7), teff(8), log_g(9), fe_h(10)
        star.value = {
          mainId: String(row[0] ?? mainId),
          ra: Number(row[1]) || 0,
          dec: Number(row[2]) || 0,
          objectType: String(row[3] ?? 'Star'),
          spectralType: row[4] != null ? String(row[4]) : null,
          parallax: typeof row[5] === 'number' ? row[5] : null,
          vMag: typeof row[6] === 'number' ? row[6] : null,
          bMag: typeof row[7] === 'number' ? row[7] : null,
          teff: typeof row[8] === 'number' ? row[8] : null,
          logg: typeof row[9] === 'number' ? row[9] : null,
          feh: typeof row[10] === 'number' ? row[10] : null,
          simbadUrl: `https://simbad.cds.unistra.fr/simbad/sim-id?Ident=${encodeURIComponent(mainId)}`,
        }
      } else {
        error.value = 'Star not found in SIMBAD'
      }
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') return
      error.value = err instanceof Error ? err.message : 'Unknown error'
    } finally {
      if (!signal.aborted) {
        loading.value = false
        fetchAbort = null
      }
    }
  }

  function reset(): void {
    fetchAbort?.abort()
    fetchAbort = null
    loading.value = false
    error.value = null
    star.value = null
  }

  return {
    loading: readonly(loading),
    star: readonly(star),
    error: readonly(error),
    query,
    reset,
  }
}
