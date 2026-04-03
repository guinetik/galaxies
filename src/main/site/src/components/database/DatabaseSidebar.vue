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
              <option v-for="col in cols" :key="col" :value="col" :title="COLUMN_DESCRIPTIONS[col] ?? col">{{ col }}</option>
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
          <label v-for="col in cols" :key="col" class="column-check" :title="COLUMN_DESCRIPTIONS[col] ?? col">
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
              <option v-for="col in cols" :key="col" :value="col" :title="COLUMN_DESCRIPTIONS[col] ?? col">{{ col }}</option>
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
import { COLUMN_GROUPS, COLUMN_DESCRIPTIONS, OPERATOR_MAP, NO_VALUE_OPERATORS, SAMPLE_QUERIES, type QueryFilter, type SampleQuery } from '@/composables/useQueryBuilder'

const { t } = useI18n()

defineProps<{
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
  left: 8px;
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
  left: 6px;
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

.filter-select option,
.filter-select optgroup {
  background: #1a1a2e;
  color: rgba(255, 255, 255, 0.85);
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
  color-scheme: dark;
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
