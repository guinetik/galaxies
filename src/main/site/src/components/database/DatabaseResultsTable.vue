<template>
  <div class="results-table-container">
    <!-- Status bar -->
    <div class="results-status">
      <span v-if="loading" class="text-white/50">{{ t('pages.database.results.loading') }}</span>
      <span v-else-if="error" class="text-red-400">{{ t('pages.database.results.error') }}: {{ error }}</span>
      <span v-else-if="!columns || columns.length === 0" class="text-white/40">{{ t('pages.database.results.empty') }}</span>
      <span v-else-if="!rows || rows.length === 0" class="text-white/40">{{ t('pages.database.results.noResults') }}</span>
      <span v-else class="text-white/60">{{ t('pages.database.results.showing', { count: rows.length }) }}</span>
    </div>

    <!-- Table -->
    <div v-if="columns && columns.length > 0 && rows && rows.length > 0" class="table-scroll">
      <table>
        <thead>
          <tr>
            <th
              v-for="col in columns"
              :key="col"
              class="cursor-pointer select-none"
              :title="COLUMN_DESCRIPTIONS[col] ?? col"
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
import { COLUMN_DESCRIPTIONS } from '@/composables/useQueryBuilder'

const { t } = useI18n()

const props = withDefaults(defineProps<{
  columns?: string[]
  rows?: unknown[][]
  loading?: boolean
  error?: string
  currentSort?: string
  sortDir?: 'ASC' | 'DESC'
}>(), {
  columns: () => [],
  rows: () => [],
  loading: false,
  error: '',
  currentSort: '',
  sortDir: 'ASC',
})

defineEmits<{
  sort: [column: string]
}>()

const pgcIndex = computed(() => props.columns?.indexOf('pgc') ?? -1)

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
  background: rgb(18, 18, 32);
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
  background: rgb(25, 25, 42);
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
