import { ref, computed, type Ref } from 'vue'

export interface QueryFilter {
  column: string
  operator: string
  value: string
}

export interface QueryBuilderState {
  selectedColumns: Ref<string[]>
  filters: Ref<QueryFilter[]>
  orderByColumn: Ref<string>
  orderByDirection: Ref<'ASC' | 'DESC'>
  limit: Ref<number>
}

/** Column definitions grouped by category */
export const COLUMN_GROUPS: Record<string, string[]> = {
  identifiers: ['pgc', 'name', 'agc', 'source'],
  coordinates: ['ra', 'dec', 'glon', 'glat', 'sgl', 'sgb'],
  distances: ['vcmb', 'dm', 'distance_mpc', 'distance_mly'],
  distanceMethods: [
    'dm_snia', 'e_dm_snia', 'dm_tf', 'e_dm_tf', 'dm_fp', 'e_dm_fp',
    'dm_sbf', 'e_dm_sbf', 'dm_snii', 'e_dm_snii', 'dm_trgb', 'e_dm_trgb',
    'dm_ceph', 'e_dm_ceph', 'dm_mas', 'e_dm_mas', 't17',
  ],
  physicalProperties: ['morphology', 'b_mag', 'diameter_arcsec', 'axial_ratio', 'position_angle', 'ba'],
  hiStarFormation: [
    'log_mhi', 'e_log_mhi', 'log_ms_t', 'e_log_ms_t',
    'log_sfr_nuv', 'e_log_sfr_nuv', 'v_hi',
  ],
}

/** All column names flattened */
export const ALL_COLUMNS = Object.values(COLUMN_GROUPS).flat()

const DEFAULT_COLUMNS = ['pgc', 'name', 'ra', 'dec', 'morphology', 'distance_mly', 'source']

/** Operators that don't require a value input */
export const NO_VALUE_OPERATORS = ['IS NULL', 'IS NOT NULL']

/** Operator map from key to SQL */
export const OPERATOR_MAP: Record<string, string> = {
  eq: '=',
  neq: '!=',
  gt: '>',
  lt: '<',
  gte: '>=',
  lte: '<=',
  like: 'LIKE',
  isNull: 'IS NULL',
  isNotNull: 'IS NOT NULL',
}

export interface SampleQuery {
  key: string
  columns: string[]
  filters: QueryFilter[]
  orderByColumn: string
  orderByDirection: 'ASC' | 'DESC'
  limit: number
}

export const SAMPLE_QUERIES: SampleQuery[] = [
  {
    key: 'nearest',
    columns: DEFAULT_COLUMNS,
    filters: [],
    orderByColumn: 'distance_mly',
    orderByDirection: 'ASC',
    limit: 50,
  },
  {
    key: 'spirals',
    columns: DEFAULT_COLUMNS,
    filters: [{ column: 'morphology', operator: 'eq', value: 'spiral' }],
    orderByColumn: 'pgc',
    orderByDirection: 'ASC',
    limit: 100,
  },
  {
    key: 'alfalfa',
    columns: [...DEFAULT_COLUMNS, 'log_mhi'],
    filters: [{ column: 'source', operator: 'eq', value: 'ALFALFA' }],
    orderByColumn: 'log_mhi',
    orderByDirection: 'DESC',
    limit: 100,
  },
  {
    key: 'cepheid',
    columns: [...DEFAULT_COLUMNS, 'dm_ceph'],
    filters: [{ column: 'dm_ceph', operator: 'isNotNull', value: '' }],
    orderByColumn: 'pgc',
    orderByDirection: 'ASC',
    limit: 100,
  },
  {
    key: 'brightest',
    columns: [...DEFAULT_COLUMNS, 'b_mag'],
    filters: [{ column: 'b_mag', operator: 'isNotNull', value: '' }],
    orderByColumn: 'b_mag',
    orderByDirection: 'ASC',
    limit: 100,
  },
]

export function useQueryBuilder() {
  const selectedColumns = ref<string[]>([...DEFAULT_COLUMNS])
  const filters = ref<QueryFilter[]>([])
  const orderByColumn = ref('pgc')
  const orderByDirection = ref<'ASC' | 'DESC'>('ASC')
  const limit = ref(100)

  const compiledQuery = computed(() => {
    const cols = selectedColumns.value.length > 0 ? selectedColumns.value.join(', ') : '*'
    let sql = `SELECT ${cols}\nFROM galaxies`

    if (filters.value.length > 0) {
      const whereClauses = filters.value.map((f) => {
        const sqlOp = OPERATOR_MAP[f.operator] ?? '='
        if (sqlOp === 'IS NULL' || sqlOp === 'IS NOT NULL') {
          return `${f.column} ${sqlOp}`
        }
        if (sqlOp === 'LIKE') {
          return `${f.column} LIKE '%${f.value.replace(/'/g, "''")}%'`
        }
        // Numeric vs string detection
        const isNumeric = !isNaN(Number(f.value)) && f.value.trim() !== ''
        const val = isNumeric ? f.value : `'${f.value.replace(/'/g, "''")}'`
        return `${f.column} ${sqlOp} ${val}`
      })
      sql += `\nWHERE ${whereClauses.join('\n  AND ')}`
    }

    sql += `\nORDER BY ${orderByColumn.value} ${orderByDirection.value}`
    sql += `\nLIMIT ${Math.min(limit.value, 1000)}`

    return sql
  })

  function addFilter() {
    filters.value.push({ column: 'pgc', operator: 'eq', value: '' })
  }

  function removeFilter(index: number) {
    filters.value.splice(index, 1)
  }

  function applySample(sample: SampleQuery) {
    selectedColumns.value = [...sample.columns]
    filters.value = sample.filters.map((f) => ({ ...f }))
    orderByColumn.value = sample.orderByColumn
    orderByDirection.value = sample.orderByDirection
    limit.value = sample.limit
  }

  function selectAllColumns() {
    selectedColumns.value = [...ALL_COLUMNS]
  }

  function clearAllColumns() {
    selectedColumns.value = []
  }

  return {
    selectedColumns,
    filters,
    orderByColumn,
    orderByDirection,
    limit,
    compiledQuery,
    addFilter,
    removeFilter,
    applySample,
    selectAllColumns,
    clearAllColumns,
  }
}
