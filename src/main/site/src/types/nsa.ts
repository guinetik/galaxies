export interface NSAMetadata {
  pgc: number
  nsa_iau_name: string
  nsaid: number
  ra: number
  dec: number
  bands: string[]
  dimensions: [number, number]
  data_ranges: Record<string, [number, number]>
  fetched_date: string
  nsa_url: string
}
