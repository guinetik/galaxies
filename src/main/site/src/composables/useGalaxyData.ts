import { ref } from 'vue'
import type { Galaxy } from '@/types/galaxy'
import initSqlJs, { type Database } from 'sql.js'

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
    locateFile: (file: string) => `https://sql.js.org/dist/${file}`,
  })

  const response = await fetch('/data/galaxies_combined.db')
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
    const result = db.exec('SELECT * FROM galaxies WHERE ra IS NOT NULL AND dec IS NOT NULL')
    if (result.length === 0) return []
    return result[0].values.map((row) => rowToGalaxy(result[0].columns, row as any[]))
  }

  function getGalaxiesByRedshiftRange(min: number, max: number): Galaxy[] {
    if (!db) return []
    const stmt = db.prepare(
      'SELECT * FROM galaxies WHERE ra IS NOT NULL AND dec IS NOT NULL AND redshift >= ? AND redshift <= ?'
    )
    stmt.bind([min, max])
    const galaxies: Galaxy[] = []
    while (stmt.step()) {
      const values = stmt.get()
      const columns = stmt.getColumnNames()
      galaxies.push(rowToGalaxy(columns, values as any[]))
    }
    stmt.free()
    return galaxies
  }

  function searchGalaxies(query: string): Galaxy[] {
    if (!db) return []
    const stmt = db.prepare(
      "SELECT * FROM galaxies WHERE name LIKE ? OR morphology LIKE ? LIMIT 100"
    )
    const pattern = `%${query}%`
    stmt.bind([pattern, pattern])
    const galaxies: Galaxy[] = []
    while (stmt.step()) {
      const values = stmt.get()
      const columns = stmt.getColumnNames()
      galaxies.push(rowToGalaxy(columns, values as any[]))
    }
    stmt.free()
    return galaxies
  }

  function getGalaxyById(id: number): Galaxy | null {
    if (!db) return null
    const stmt = db.prepare('SELECT * FROM galaxies WHERE id = ?')
    stmt.bind([id])
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
    getGalaxyById,
  }
}
