export interface NSAMetadata {
  pgc: number
  nsa_iau_name: string
  nsaid: number
  ra: number
  dec: number
  /** Image pixel scale in arcseconds per pixel (from FITS WCS header) */
  pixel_scale?: number
  bands: string[]
  dimensions: [number, number]
  data_ranges: Record<string, [number, number]>
  fetched_date: string
  nsa_url: string
}
