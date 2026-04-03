# Database Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a `/database` route with a Postman-style SQL query builder — collapsible sidebar for visual query building, raw SQL editing mode, and a results data table with links to galaxy detail pages.

**Architecture:** Three Vue components (DatabaseView, DatabaseSidebar, DatabaseResultsTable) compose the page. A `useQueryBuilder` composable manages sidebar state → SQL compilation. The existing `useGalaxyData` composable gets a new `executeRawQuery` method that runs arbitrary read-only SQL against the in-browser sql.js database.

**Tech Stack:** Vue 3 Composition API, TypeScript, Tailwind CSS, sql.js (already in project), vue-i18n

---

### Task 1: Add `executeRawQuery` to useGalaxyData composable

**Files:**
- Modify: `src/main/site/src/composables/useGalaxyData.ts:67-193`

- [ ] **Step 1: Add the executeRawQuery method inside useGalaxyData**

Add this method inside the `useGalaxyData()` function, before the `return` statement:

```typescript
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
  if (result.length === 0) return { columns: [], rows: [] }
  return { columns: result[0].columns, rows: result[0].values }
}
```

- [ ] **Step 2: Add executeRawQuery to the return object**

Update the return statement to include `executeRawQuery`:

```typescript
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
```

- [ ] **Step 3: Verify the project compiles**

Run: `cd src/main/site && npx vue-tsc --noEmit`
Expected: No type errors

- [ ] **Step 4: Commit**

```bash
git add src/main/site/src/composables/useGalaxyData.ts
git commit -m "feat(database): add executeRawQuery to useGalaxyData composable"
```

---

### Task 2: Add i18n keys for the Database page

**Files:**
- Modify: `src/main/site/src/i18n/locales/en-US.json`
- Modify: `src/main/site/src/i18n/locales/pt-BR.json`

- [ ] **Step 1: Add nav key and pages.database section to en-US.json**

Add to the `nav` object:
```json
"database": "Database"
```

Add a new `pages.database` section:
```json
"database": {
  "title": "Database",
  "subtitle": "Query the galaxy catalog directly",
  "editToggle": "Edit Query",
  "runButton": "Run",
  "sidebar": {
    "filters": "Filters",
    "columns": "Columns",
    "orderBy": "Order By",
    "limit": "Limit",
    "sampleQueries": "Sample Queries",
    "addFilter": "Add filter",
    "selectAll": "Select all",
    "clearAll": "Clear all",
    "asc": "Ascending",
    "desc": "Descending",
    "columnGroups": {
      "identifiers": "Identifiers",
      "coordinates": "Coordinates",
      "distances": "Distances",
      "distanceMethods": "Distance Methods",
      "physicalProperties": "Physical Properties",
      "hiStarFormation": "HI & Star Formation"
    }
  },
  "operators": {
    "eq": "equals",
    "neq": "not equals",
    "gt": "greater than",
    "lt": "less than",
    "gte": "greater or equal",
    "lte": "less or equal",
    "like": "contains",
    "isNull": "is empty",
    "isNotNull": "is not empty"
  },
  "samples": {
    "nearest": "Nearest galaxies",
    "spirals": "Spiral galaxies",
    "alfalfa": "ALFALFA HI-rich galaxies",
    "cepheid": "Galaxies with Cepheid distances",
    "brightest": "Brightest galaxies"
  },
  "results": {
    "empty": "Run a query to see results",
    "loading": "Running query...",
    "error": "Query error",
    "showing": "Showing {count} results",
    "noResults": "No results found"
  }
}
```

- [ ] **Step 2: Add nav key and pages.database section to pt-BR.json**

Add to the `nav` object:
```json
"database": "Banco de Dados"
```

Add a new `pages.database` section:
```json
"database": {
  "title": "Banco de Dados",
  "subtitle": "Consulte o catálogo de galáxias diretamente",
  "editToggle": "Editar Consulta",
  "runButton": "Executar",
  "sidebar": {
    "filters": "Filtros",
    "columns": "Colunas",
    "orderBy": "Ordenar Por",
    "limit": "Limite",
    "sampleQueries": "Consultas de Exemplo",
    "addFilter": "Adicionar filtro",
    "selectAll": "Selecionar tudo",
    "clearAll": "Limpar tudo",
    "asc": "Crescente",
    "desc": "Decrescente",
    "columnGroups": {
      "identifiers": "Identificadores",
      "coordinates": "Coordenadas",
      "distances": "Distâncias",
      "distanceMethods": "Métodos de Distância",
      "physicalProperties": "Propriedades Físicas",
      "hiStarFormation": "HI e Formação Estelar"
    }
  },
  "operators": {
    "eq": "igual a",
    "neq": "diferente de",
    "gt": "maior que",
    "lt": "menor que",
    "gte": "maior ou igual",
    "lte": "menor ou igual",
    "like": "contém",
    "isNull": "está vazio",
    "isNotNull": "não está vazio"
  },
  "samples": {
    "nearest": "Galáxias mais próximas",
    "spirals": "Galáxias espirais",
    "alfalfa": "Galáxias ALFALFA ricas em HI",
    "cepheid": "Galáxias com distâncias Cefeidas",
    "brightest": "Galáxias mais brilhantes"
  },
  "results": {
    "empty": "Execute uma consulta para ver os resultados",
    "loading": "Executando consulta...",
    "error": "Erro na consulta",
    "showing": "Mostrando {count} resultados",
    "noResults": "Nenhum resultado encontrado"
  }
}
```

- [ ] **Step 3: Commit**

```bash
git add src/main/site/src/i18n/locales/en-US.json src/main/site/src/i18n/locales/pt-BR.json
git commit -m "feat(database): add i18n keys for database page"
```

---

### Task 3: Create useQueryBuilder composable

**Files:**
- Create: `src/main/site/src/composables/useQueryBuilder.ts`

This composable manages sidebar state and compiles it into SQL.

- [ ] **Step 1: Create the composable file**

```typescript
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
```

- [ ] **Step 2: Verify the project compiles**

Run: `cd src/main/site && npx vue-tsc --noEmit`
Expected: No type errors

- [ ] **Step 3: Commit**

```bash
git add src/main/site/src/composables/useQueryBuilder.ts
git commit -m "feat(database): add useQueryBuilder composable for SQL compilation"
```

---

### Task 4: Create DatabaseResultsTable component

**Files:**
- Create: `src/main/site/src/components/database/DatabaseResultsTable.vue`

- [ ] **Step 1: Create the component**

```vue
<template>
  <div class="results-table-container">
    <!-- Status bar -->
    <div class="results-status">
      <span v-if="loading" class="text-white/50">{{ t('pages.database.results.loading') }}</span>
      <span v-else-if="error" class="text-red-400">{{ t('pages.database.results.error') }}: {{ error }}</span>
      <span v-else-if="columns.length === 0" class="text-white/40">{{ t('pages.database.results.empty') }}</span>
      <span v-else-if="rows.length === 0" class="text-white/40">{{ t('pages.database.results.noResults') }}</span>
      <span v-else class="text-white/60">{{ t('pages.database.results.showing', { count: rows.length }) }}</span>
    </div>

    <!-- Table -->
    <div v-if="columns.length > 0 && rows.length > 0" class="table-scroll">
      <table>
        <thead>
          <tr>
            <th
              v-for="col in columns"
              :key="col"
              class="cursor-pointer select-none"
              @click="$emit('sort', col)"
            >
              {{ col }}
              <span v-if="col === currentSort" class="sort-indicator">{{ sortDir === 'ASC' ? '▲' : '▼' }}</span>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, rowIdx) in rows" :key="rowIdx">
            <td v-for="(cell, colIdx) in row" :key="colIdx" :class="cellClass(columns[colIdx], cell)">
              <router-link
                v-if="isLinkColumn(columns[colIdx]) && pgcIndex >= 0"
                :to="`/g/${row[pgcIndex]}`"
                class="cell-link"
              >
                {{ formatCell(cell) }}
              </router-link>
              <span v-else>{{ formatCell(cell) }}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps<{
  columns: string[]
  rows: unknown[][]
  loading: boolean
  error: string
  currentSort: string
  sortDir: 'ASC' | 'DESC'
}>()

defineEmits<{
  sort: [column: string]
}>()

const pgcIndex = computed(() => props.columns.indexOf('pgc'))

const LINK_COLUMNS = new Set(['pgc', 'name'])

function isLinkColumn(col: string): boolean {
  return LINK_COLUMNS.has(col)
}

const NUMERIC_COLUMNS = new Set([
  'pgc', 'group_pgc', 'vcmb', 'dm', 'distance_mpc', 'distance_mly',
  'ra', 'dec', 'glon', 'glat', 'sgl', 'sgb',
  'b_mag', 'diameter_arcsec', 'axial_ratio', 'position_angle', 'ba',
  'agc', 'v_hi', 'log_mhi', 'log_ms_t', 'log_sfr_nuv',
  'dm_snia', 'dm_tf', 'dm_fp', 'dm_sbf', 'dm_snii', 'dm_trgb', 'dm_ceph', 'dm_mas',
])

function cellClass(col: string, _cell: unknown): string {
  return NUMERIC_COLUMNS.has(col) ? 'numeric' : ''
}

function formatCell(value: unknown): string {
  if (value === null || value === undefined) return '—'
  if (typeof value === 'number') {
    return Number.isInteger(value) ? value.toString() : value.toFixed(4)
  }
  return String(value)
}
</script>

<style scoped>
.results-table-container {
  display: flex;
  flex-direction: column;
  min-height: 0;
  flex: 1;
}

.results-status {
  padding: 8px 16px;
  font-size: 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.table-scroll {
  overflow: auto;
  flex: 1;
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

thead {
  position: sticky;
  top: 0;
  z-index: 1;
}

th {
  background: rgba(255, 255, 255, 0.06);
  color: rgba(255, 255, 255, 0.7);
  font-weight: 500;
  text-align: left;
  padding: 8px 12px;
  white-space: nowrap;
  border-bottom: 1px solid rgba(255, 255, 255, 0.15);
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

th:hover {
  color: rgba(255, 255, 255, 0.95);
  background: rgba(255, 255, 255, 0.1);
}

.sort-indicator {
  margin-left: 4px;
  font-size: 9px;
}

td {
  padding: 6px 12px;
  color: rgba(255, 255, 255, 0.8);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  white-space: nowrap;
}

td.numeric {
  font-family: 'SF Mono', 'Fira Code', 'Cascadia Code', monospace;
  font-size: 12px;
}

tr:hover td {
  background: rgba(255, 255, 255, 0.04);
}

tr:nth-child(even) td {
  background: rgba(255, 255, 255, 0.02);
}

tr:nth-child(even):hover td {
  background: rgba(255, 255, 255, 0.06);
}

.cell-link {
  color: rgb(96, 165, 250);
  text-decoration: none;
}

.cell-link:hover {
  text-decoration: underline;
  color: rgb(147, 197, 253);
}
</style>
```

- [ ] **Step 2: Commit**

```bash
git add src/main/site/src/components/database/DatabaseResultsTable.vue
git commit -m "feat(database): add DatabaseResultsTable component"
```

---

### Task 5: Create DatabaseSidebar component

**Files:**
- Create: `src/main/site/src/components/database/DatabaseSidebar.vue`

- [ ] **Step 1: Create the component**

```vue
<template>
  <aside class="sidebar" :class="{ collapsed: !open }">
    <button class="sidebar-toggle" @click="$emit('toggle')">
      <span class="toggle-icon">{{ open ? '◂' : '▸' }}</span>
    </button>

    <div v-show="open" class="sidebar-content" :class="{ disabled }">
      <!-- Sample Queries -->
      <section class="sidebar-section">
        <h3 class="section-title">{{ t('pages.database.sidebar.sampleQueries') }}</h3>
        <button
          v-for="sample in SAMPLE_QUERIES"
          :key="sample.key"
          class="sample-btn"
          :disabled="disabled"
          @click="$emit('applySample', sample)"
        >
          {{ t(`pages.database.samples.${sample.key}`) }}
        </button>
      </section>

      <!-- Filters -->
      <section class="sidebar-section">
        <h3 class="section-title">{{ t('pages.database.sidebar.filters') }}</h3>
        <div v-for="(filter, idx) in filters" :key="idx" class="filter-row">
          <select v-model="filter.column" class="filter-select col-select" :disabled="disabled">
            <optgroup v-for="(cols, groupKey) in COLUMN_GROUPS" :key="groupKey" :label="t(`pages.database.sidebar.columnGroups.${groupKey}`)">
              <option v-for="col in cols" :key="col" :value="col">{{ col }}</option>
            </optgroup>
          </select>
          <select v-model="filter.operator" class="filter-select op-select" :disabled="disabled">
            <option v-for="(_, opKey) in OPERATOR_MAP" :key="opKey" :value="opKey">
              {{ t(`pages.database.operators.${opKey}`) }}
            </option>
          </select>
          <input
            v-if="!NO_VALUE_OPERATORS.includes(OPERATOR_MAP[filter.operator])"
            v-model="filter.value"
            class="filter-input"
            :disabled="disabled"
            placeholder="value"
          />
          <button class="remove-btn" :disabled="disabled" @click="$emit('removeFilter', idx)">×</button>
        </div>
        <button class="add-btn" :disabled="disabled" @click="$emit('addFilter')">
          + {{ t('pages.database.sidebar.addFilter') }}
        </button>
      </section>

      <!-- Columns -->
      <section class="sidebar-section">
        <h3 class="section-title">{{ t('pages.database.sidebar.columns') }}</h3>
        <div class="column-actions">
          <button class="text-btn" :disabled="disabled" @click="$emit('selectAllColumns')">
            {{ t('pages.database.sidebar.selectAll') }}
          </button>
          <button class="text-btn" :disabled="disabled" @click="$emit('clearAllColumns')">
            {{ t('pages.database.sidebar.clearAll') }}
          </button>
        </div>
        <div v-for="(cols, groupKey) in COLUMN_GROUPS" :key="groupKey" class="column-group">
          <div class="group-label">{{ t(`pages.database.sidebar.columnGroups.${groupKey}`) }}</div>
          <label v-for="col in cols" :key="col" class="column-check">
            <input
              type="checkbox"
              :value="col"
              :checked="selectedColumns.includes(col)"
              :disabled="disabled"
              @change="$emit('toggleColumn', col)"
            />
            <span>{{ col }}</span>
          </label>
        </div>
      </section>

      <!-- Order By -->
      <section class="sidebar-section">
        <h3 class="section-title">{{ t('pages.database.sidebar.orderBy') }}</h3>
        <div class="order-row">
          <select :value="orderByColumn" :disabled="disabled" class="filter-select" @change="$emit('update:orderByColumn', ($event.target as HTMLSelectElement).value)">
            <optgroup v-for="(cols, groupKey) in COLUMN_GROUPS" :key="groupKey" :label="t(`pages.database.sidebar.columnGroups.${groupKey}`)">
              <option v-for="col in cols" :key="col" :value="col">{{ col }}</option>
            </optgroup>
          </select>
          <select :value="orderByDirection" :disabled="disabled" class="filter-select" @change="$emit('update:orderByDirection', ($event.target as HTMLSelectElement).value)">
            <option value="ASC">{{ t('pages.database.sidebar.asc') }}</option>
            <option value="DESC">{{ t('pages.database.sidebar.desc') }}</option>
          </select>
        </div>
      </section>

      <!-- Limit -->
      <section class="sidebar-section">
        <h3 class="section-title">{{ t('pages.database.sidebar.limit') }}</h3>
        <input
          type="number"
          :value="limit"
          :disabled="disabled"
          min="1"
          max="1000"
          class="filter-input limit-input"
          @input="$emit('update:limit', Math.min(1000, Math.max(1, Number(($event.target as HTMLInputElement).value))))"
        />
      </section>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { COLUMN_GROUPS, OPERATOR_MAP, NO_VALUE_OPERATORS, SAMPLE_QUERIES, type QueryFilter, type SampleQuery } from '@/composables/useQueryBuilder'

const { t } = useI18n()

const props = defineProps<{
  open: boolean
  disabled: boolean
  filters: QueryFilter[]
  selectedColumns: string[]
  orderByColumn: string
  orderByDirection: 'ASC' | 'DESC'
  limit: number
}>()

defineEmits<{
  toggle: []
  addFilter: []
  removeFilter: [index: number]
  applySample: [sample: SampleQuery]
  selectAllColumns: []
  clearAllColumns: []
  toggleColumn: [column: string]
  'update:orderByColumn': [value: string]
  'update:orderByDirection': [value: string]
  'update:limit': [value: number]
}>()

</script>

<style scoped>
.sidebar {
  width: 280px;
  min-width: 280px;
  background: rgba(0, 0, 0, 0.6);
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
  position: relative;
  transition: width 0.2s, min-width 0.2s;
  overflow: hidden;
}

.sidebar.collapsed {
  width: 36px;
  min-width: 36px;
}

.sidebar-toggle {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 24px;
  height: 24px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 4px;
  color: rgba(255, 255, 255, 0.7);
  font-size: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
}

.sidebar.collapsed .sidebar-toggle {
  right: 6px;
}

.sidebar-toggle:hover {
  background: rgba(255, 255, 255, 0.2);
  color: white;
}

.sidebar-content {
  overflow-y: auto;
  padding: 40px 12px 12px;
  flex: 1;
}

.sidebar-content.disabled {
  opacity: 0.35;
  pointer-events: none;
}

.sidebar-section {
  margin-bottom: 20px;
}

.section-title {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: rgba(255, 255, 255, 0.5);
  margin-bottom: 8px;
  font-weight: 500;
}

.sample-btn {
  display: block;
  width: 100%;
  text-align: left;
  padding: 6px 8px;
  font-size: 12px;
  color: rgb(96, 165, 250);
  background: none;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.sample-btn:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.06);
  color: rgb(147, 197, 253);
}

.filter-row {
  display: flex;
  gap: 4px;
  margin-bottom: 6px;
  flex-wrap: wrap;
}

.filter-select {
  background: rgba(255, 255, 255, 0.08);
  color: rgba(255, 255, 255, 0.85);
  font-size: 12px;
  padding: 4px 6px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 4px;
}

.col-select {
  flex: 1;
  min-width: 80px;
}

.op-select {
  min-width: 70px;
}

.filter-input {
  background: rgba(255, 255, 255, 0.08);
  color: rgba(255, 255, 255, 0.85);
  font-size: 12px;
  padding: 4px 6px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 4px;
  flex: 1;
  min-width: 60px;
}

.limit-input {
  width: 80px;
}

.remove-btn {
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.4);
  font-size: 16px;
  cursor: pointer;
  padding: 0 4px;
  line-height: 1;
}

.remove-btn:hover:not(:disabled) {
  color: rgb(248, 113, 113);
}

.add-btn {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.5);
  background: none;
  border: 1px dashed rgba(255, 255, 255, 0.15);
  border-radius: 4px;
  padding: 4px 8px;
  cursor: pointer;
  width: 100%;
}

.add-btn:hover:not(:disabled) {
  color: rgba(255, 255, 255, 0.8);
  border-color: rgba(255, 255, 255, 0.3);
}

.column-actions {
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
}

.text-btn {
  font-size: 11px;
  color: rgb(96, 165, 250);
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
}

.text-btn:hover:not(:disabled) {
  color: rgb(147, 197, 253);
}

.column-group {
  margin-bottom: 8px;
}

.group-label {
  font-size: 10px;
  color: rgba(255, 255, 255, 0.35);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 4px;
}

.column-check {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
  padding: 2px 0;
  cursor: pointer;
}

.column-check input {
  accent-color: rgb(96, 165, 250);
}

.order-row {
  display: flex;
  gap: 6px;
}

.order-row .filter-select {
  flex: 1;
}
</style>
```

- [ ] **Step 2: Commit**

```bash
git add src/main/site/src/components/database/DatabaseSidebar.vue
git commit -m "feat(database): add DatabaseSidebar component with filters, columns, presets"
```

---

### Task 6: Create DatabaseView main view

**Files:**
- Create: `src/main/site/src/views/DatabaseView.vue`

- [ ] **Step 1: Create the view component**

```vue
<template>
  <div class="database-page">
    <!-- Sidebar -->
    <DatabaseSidebar
      :open="sidebarOpen"
      :disabled="editMode"
      :filters="filters"
      :selected-columns="selectedColumns"
      :order-by-column="orderByColumn"
      :order-by-direction="orderByDirection"
      :limit="limit"
      @toggle="sidebarOpen = !sidebarOpen"
      @add-filter="addFilter"
      @remove-filter="removeFilter"
      @apply-sample="onApplySample"
      @select-all-columns="selectAllColumns"
      @clear-all-columns="clearAllColumns"
      @toggle-column="onToggleColumn"
      @update:order-by-column="orderByColumn = $event"
      @update:order-by-direction="orderByDirection = $event as 'ASC' | 'DESC'"
      @update:limit="limit = $event"
    />

    <!-- Main content -->
    <div class="main-content">
      <!-- Page header -->
      <div class="page-header">
        <h1 class="page-title">{{ t('pages.database.title') }}</h1>
        <p class="page-subtitle">{{ t('pages.database.subtitle') }}</p>
      </div>

      <!-- Query bar -->
      <div class="query-bar">
        <div class="query-controls">
          <label class="edit-toggle">
            <input type="checkbox" v-model="editMode" />
            <span>{{ t('pages.database.editToggle') }}</span>
          </label>
        </div>
        <div class="query-row">
          <textarea
            ref="queryTextarea"
            v-model="currentQuery"
            class="query-input"
            :readonly="!editMode"
            :class="{ editable: editMode }"
            rows="4"
            spellcheck="false"
            @keydown.ctrl.enter="runQuery"
          />
          <button class="run-btn" :disabled="isLoading || !currentQuery.trim()" @click="runQuery">
            {{ t('pages.database.runButton') }}
          </button>
        </div>
        <div v-if="queryError" class="query-error">{{ queryError }}</div>
      </div>

      <!-- Results -->
      <DatabaseResultsTable
        :columns="resultColumns"
        :rows="resultRows"
        :loading="queryRunning"
        :error="queryError"
        :current-sort="orderByColumn"
        :sort-dir="orderByDirection"
        @sort="onColumnSort"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useGalaxyData } from '@/composables/useGalaxyData'
import { useQueryBuilder, type SampleQuery } from '@/composables/useQueryBuilder'
import DatabaseSidebar from '@/components/database/DatabaseSidebar.vue'
import DatabaseResultsTable from '@/components/database/DatabaseResultsTable.vue'

const { t } = useI18n()
const { ready, isLoading, executeRawQuery } = useGalaxyData()
const {
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
} = useQueryBuilder()

const sidebarOpen = ref(true)
const editMode = ref(false)
const currentQuery = ref('')
const queryError = ref('')
const queryRunning = ref(false)
const resultColumns = ref<string[]>([])
const resultRows = ref<unknown[][]>([])

// Sync compiled query to the query bar when not in edit mode
watch(compiledQuery, (sql) => {
  if (!editMode.value) {
    currentQuery.value = sql
  }
})

// When edit mode is turned off, sync back to compiled query
watch(editMode, (isEdit) => {
  if (!isEdit) {
    currentQuery.value = compiledQuery.value
  }
})

// Initialize with compiled query
onMounted(async () => {
  await ready
  currentQuery.value = compiledQuery.value
})

function onApplySample(sample: SampleQuery) {
  applySample(sample)
  // compiledQuery watcher will update currentQuery
}

function onToggleColumn(col: string) {
  const idx = selectedColumns.value.indexOf(col)
  if (idx >= 0) {
    selectedColumns.value.splice(idx, 1)
  } else {
    selectedColumns.value.push(col)
  }
}

function onColumnSort(col: string) {
  if (orderByColumn.value === col) {
    orderByDirection.value = orderByDirection.value === 'ASC' ? 'DESC' : 'ASC'
  } else {
    orderByColumn.value = col
    orderByDirection.value = 'ASC'
  }
  if (!editMode.value) {
    runQuery()
  }
}

function runQuery() {
  queryError.value = ''
  queryRunning.value = true
  try {
    const result = executeRawQuery(currentQuery.value)
    resultColumns.value = result.columns
    resultRows.value = result.rows
  } catch (e: unknown) {
    queryError.value = e instanceof Error ? e.message : String(e)
    resultColumns.value = []
    resultRows.value = []
  } finally {
    queryRunning.value = false
  }
}
</script>

<style scoped>
.database-page {
  position: fixed;
  inset: 0;
  top: var(--header-height, 52px);
  display: flex;
  background: rgb(10, 10, 18);
  color: white;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.page-header {
  padding: 20px 24px 0;
}

.page-title {
  font-size: 20px;
  font-weight: 300;
  letter-spacing: 0.05em;
  color: rgba(255, 255, 255, 0.9);
}

.page-subtitle {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.45);
  margin-top: 4px;
}

.query-bar {
  padding: 16px 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.query-controls {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.edit-toggle {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  user-select: none;
}

.edit-toggle input {
  accent-color: rgb(96, 165, 250);
}

.query-row {
  display: flex;
  gap: 12px;
  align-items: stretch;
}

.query-input {
  flex: 1;
  background: rgba(255, 255, 255, 0.05);
  color: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 6px;
  padding: 10px 14px;
  font-family: 'SF Mono', 'Fira Code', 'Cascadia Code', monospace;
  font-size: 13px;
  line-height: 1.5;
  resize: vertical;
  outline: none;
}

.query-input:not(.editable) {
  cursor: default;
  opacity: 0.7;
}

.query-input.editable {
  border-color: rgba(96, 165, 250, 0.4);
  background: rgba(255, 255, 255, 0.08);
}

.query-input:focus {
  border-color: rgba(96, 165, 250, 0.6);
}

.run-btn {
  padding: 10px 24px;
  background: rgb(59, 130, 246);
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  white-space: nowrap;
  align-self: flex-end;
}

.run-btn:hover:not(:disabled) {
  background: rgb(37, 99, 235);
}

.run-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.query-error {
  margin-top: 8px;
  padding: 8px 12px;
  background: rgba(239, 68, 68, 0.15);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 4px;
  color: rgb(248, 113, 113);
  font-size: 12px;
  font-family: 'SF Mono', 'Fira Code', 'Cascadia Code', monospace;
}
</style>
```

- [ ] **Step 2: Commit**

```bash
git add src/main/site/src/views/DatabaseView.vue
git commit -m "feat(database): add DatabaseView with query bar, sidebar, and results table"
```

---

### Task 7: Add route and navigation

**Files:**
- Modify: `src/main/site/src/router/index.ts:99-108`
- Modify: `src/main/site/src/components/AppHeader.vue:13-32` (desktop nav)
- Modify: `src/main/site/src/components/AppHeader.vue:80-101` (mobile nav)

- [ ] **Step 1: Add the /database route to the router**

In `src/main/site/src/router/index.ts`, add this route entry after the `star` route (before the closing `]`):

```typescript
{
  path: '/database',
  name: 'database',
  component: () => import('@/views/DatabaseView.vue'),
  meta: {
    title: 'Database | Galaxies',
    description: 'Query the galaxy catalog directly — explore 88,000+ galaxies with filters, SQL, and linked results.',
  },
},
```

- [ ] **Step 2: Add nav link to AppHeader desktop nav**

In `src/main/site/src/components/AppHeader.vue`, add after the `/local-group` link in the desktop nav section:

```html
<router-link to="/database" class="text-xs text-white/50 hover:text-white/80 transition-colors">
  {{ t('nav.database') }}
</router-link>
```

- [ ] **Step 3: Add nav link to AppHeader mobile nav**

In the mobile nav section, add before the `<div class="mobile-menu-divider" />`:

```html
<router-link to="/database" class="mobile-link" @click="menuOpen = false">
  {{ t('nav.database') }}
</router-link>
```

- [ ] **Step 4: Verify the project compiles**

Run: `cd src/main/site && npx vue-tsc --noEmit`
Expected: No type errors

- [ ] **Step 5: Commit**

```bash
git add src/main/site/src/router/index.ts src/main/site/src/components/AppHeader.vue
git commit -m "feat(database): add /database route and nav links"
```

---

### Task 8: Manual testing and polish

- [ ] **Step 1: Start dev server and test**

Run: `cd src/main/site && npm run dev`

Test checklist:
1. Navigate to `/database` — page loads with sidebar open, query bar shows default SELECT
2. Click "Run" — results table populates with default columns
3. Click a sample query (e.g., "Nearest galaxies") — sidebar updates, query regenerates, click Run
4. Add a filter (morphology = spiral) — query updates in textarea
5. Toggle "Edit Query" ON — textarea becomes editable, sidebar grays out
6. Type a custom query: `SELECT pgc, name, distance_mly FROM galaxies WHERE distance_mly < 10 ORDER BY distance_mly ASC LIMIT 20` — click Run
7. Toggle edit OFF — query reverts to sidebar-compiled version
8. Click a PGC number in results — navigates to `/g/:pgc`
9. Click column header — re-sorts and re-runs
10. Collapse/expand sidebar — layout adjusts
11. Try an invalid query (e.g., `DROP TABLE galaxies`) — error shown, no crash
12. Switch language to PT — all labels translate

- [ ] **Step 2: Fix any issues found during testing**

- [ ] **Step 3: Final commit if any fixes were needed**

```bash
git add -u
git commit -m "fix(database): polish from manual testing"
```
