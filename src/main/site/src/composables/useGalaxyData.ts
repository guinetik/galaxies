import { ref } from 'vue'
import type { Galaxy } from '@/types/galaxy'
import initSqlJs from 'sql.js'
import type { Database } from 'sql.js'

const isLoading = ref(true)
const galaxyCount = ref(0)

let db: Database | null = null
let initPromise: Promise<void> | null = null

function rowToGalaxy(columns: string[], values: any[]): Galaxy {
  const obj: any = {}
  for (let i = 0; i < columns.length; i++) {
    obj[columns[i]] = values[i]
  }
  return obj as Galaxy
}

async function initDatabase(): Promise<void> {
  if (db) return

  const SQL = await initSqlJs({
    locateFile: () => '/data/sql-wasm.wasm',
  })

  const response = await fetch('/data/cosmicflows4.db')
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

  return {
    isLoading,
    galaxyCount,
    ready: initPromise,
    getAllGalaxies,
    getGalaxiesByRedshiftRange,
    searchGalaxies,
    getGalaxyByPgc,
  }
}
