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
