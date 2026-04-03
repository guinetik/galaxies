import { ref } from 'vue'
import type { Galaxy, GalaxyGroup } from '@/types/galaxy'
import initSqlJs from 'sql.js'
import type { Database } from 'sql.js'

const isLoading = ref(true)
const galaxyCount = ref(0)

let db: Database | null = null
let initPromise: Promise<void> | null = null

/** Verified morphology types from tour.json — overrides DB values */
let tourMorphologyOverrides: Map<number, string> | null = null

function rowToGalaxy(columns: string[], values: any[]): Galaxy {
  const obj: any = {}
  for (let i = 0; i < columns.length; i++) {
    obj[columns[i]] = values[i]
  }
  // Apply verified morphology from tour.json (overrides DB when present)
  if (tourMorphologyOverrides?.has(obj.pgc)) {
    obj.morphology = tourMorphologyOverrides.get(obj.pgc)
  }
  return obj as Galaxy
}

function rowToGroup(columns: string[], values: any[]): GalaxyGroup {
  const obj: any = {}
  for (let i = 0; i < columns.length; i++) {
    obj[columns[i]] = values[i]
  }
  return obj as GalaxyGroup
}

async function loadTourOverrides(): Promise<void> {
  try {
    const res = await fetch('/tour.json')
    const data = (await res.json()) as Record<string, { type?: string }>
    tourMorphologyOverrides = new Map()
    for (const [pgcStr, entry] of Object.entries(data)) {
      if (entry.type) {
        tourMorphologyOverrides.set(Number(pgcStr), entry.type)
      }
    }
  } catch {
    // Non-critical — fall through to DB morphology
  }
}

async function initDatabase(): Promise<void> {
  if (db) return

  const [SQL] = await Promise.all([
    initSqlJs({ locateFile: () => '/data/sql-wasm.wasm' }),
    loadTourOverrides(),
  ])

  const response = await fetch('/data/galaxies.db')
  const buffer = await response.arrayBuffer()
  db = new SQL.Database(new Uint8Array(buffer))

  const result = db.exec('SELECT COUNT(*) FROM galaxies')
  galaxyCount.value = result[0].values[0][0] as number
  isLoading.value = false
}

export function useGalaxyData() {
  if (!initPromise) {
    initPromise = initDatabase()
  }

  function getAllGalaxies(): Galaxy[] {
    if (!db) return []
    const stmt = db.prepare('SELECT * FROM galaxies WHERE ra IS NOT NULL AND dec IS NOT NULL')
    const galaxies: Galaxy[] = []
    const columns = stmt.getColumnNames()
    while (stmt.step()) {
      galaxies.push(rowToGalaxy(columns, stmt.get() as any[]))
    }
    stmt.free()
    return galaxies
  }

  function getGalaxiesByRedshiftRange(min: number, max: number): Galaxy[] {
    if (!db) return []
    const c = 299792.458
    const stmt = db.prepare(
      'SELECT * FROM galaxies WHERE ra IS NOT NULL AND dec IS NOT NULL AND vcmb >= ? AND vcmb <= ?'
    )
    stmt.bind([min * c, max * c])
    const galaxies: Galaxy[] = []
    const columns = stmt.getColumnNames()
    while (stmt.step()) {
      galaxies.push(rowToGalaxy(columns, stmt.get() as any[]))
    }
    stmt.free()
    return galaxies
  }

  function searchGalaxies(query: string): Galaxy[] {
    if (!db) return []
    const stmt = db.prepare(
      "SELECT * FROM galaxies WHERE CAST(pgc AS TEXT) LIKE ? LIMIT 100"
    )
    const pattern = `%${query}%`
    stmt.bind([pattern])
    const galaxies: Galaxy[] = []
    const columns = stmt.getColumnNames()
    while (stmt.step()) {
      galaxies.push(rowToGalaxy(columns, stmt.get() as any[]))
    }
    stmt.free()
    return galaxies
  }

  function getAllGroups(): GalaxyGroup[] {
    if (!db) return []
    const stmt = db.prepare(
      'SELECT group_pgc, sgx, sgy, sgz, dist_mpc, vh, sgl, sgb, hi, log_hi FROM galaxy_groups WHERE sgx IS NOT NULL'
    )
    const groups: GalaxyGroup[] = []
    const columns = stmt.getColumnNames()
    while (stmt.step()) {
      groups.push(rowToGroup(columns, stmt.get() as any[]))
    }
    stmt.free()
    return groups
  }

  /**
   * Returns a random sample of galaxies for sampling by morphology.
   * @param limit Maximum number of galaxies to return
   */
  function getRandomGalaxies(limit: number): Galaxy[] {
    if (!db) return []
    const stmt = db.prepare(
      'SELECT * FROM galaxies WHERE ra IS NOT NULL AND dec IS NOT NULL ORDER BY RANDOM() LIMIT ?'
    )
    stmt.bind([limit])
    const galaxies: Galaxy[] = []
    const columns = stmt.getColumnNames()
    while (stmt.step()) {
      galaxies.push(rowToGalaxy(columns, stmt.get() as any[]))
    }
    stmt.free()
    return galaxies
  }

  function getGalaxyByPgc(pgc: number): Galaxy | null {
    if (!db) return null
    const stmt = db.prepare('SELECT * FROM galaxies WHERE pgc = ?')
    stmt.bind([pgc])
    if (stmt.step()) {
      const values = stmt.get()
      const columns = stmt.getColumnNames()
      stmt.free()
      return rowToGalaxy(columns, values as any[])
    }
    stmt.free()
    return null
  }

  /**
   * Returns galaxies matching the given PGC list. Used for tour/catalog joins.
   * @param pgcList Array of PGC numbers to look up
   */
  function getGalaxiesByPgcList(pgcList: number[]): Galaxy[] {
    if (!db || pgcList.length === 0) return []
    const placeholders = pgcList.map(() => '?').join(',')
    const stmt = db.prepare(`SELECT * FROM galaxies WHERE pgc IN (${placeholders})`)
    stmt.bind(pgcList)
    const galaxies: Galaxy[] = []
    const columns = stmt.getColumnNames()
    while (stmt.step()) {
      galaxies.push(rowToGalaxy(columns, stmt.get() as any[]))
    }
    stmt.free()
    return galaxies
  }

  /**
   * Execute an arbitrary read-only SQL query against the database.
   * Returns column names and row data. Rejects non-SELECT statements.
   */
  function executeRawQuery(sql: string): { columns: string[]; rows: unknown[][] } {
    if (!db) throw new Error('Database not loaded')
    const trimmed = sql.trim().replace(/;+$/, '').trim()
    if (!/^SELECT\b/i.test(trimmed)) {
      throw new Error('Only SELECT queries are allowed')
    }
    // Enforce LIMIT — append if missing, cap if over 1000
    const hasLimit = /\bLIMIT\s+\d+/i.test(trimmed)
    const query = hasLimit ? trimmed : `${trimmed} LIMIT 1000`
    const result = db.exec(query)
    if (!result || result.length === 0) return { columns: [], rows: [] }
    // sql.js may use 'columns' or 'lc' depending on build/version
    const cols: string[] = result[0].columns ?? (result[0] as any).lc ?? []
    return { columns: cols, rows: result[0].values }
  }

  return {
    isLoading,
    galaxyCount,
    ready: initPromise,
    getAllGalaxies,
    getGalaxiesByRedshiftRange,
    searchGalaxies,
    getRandomGalaxies,
    getGalaxyByPgc,
    getGalaxiesByPgcList,
    getAllGroups,
    executeRawQuery,
  }
}
