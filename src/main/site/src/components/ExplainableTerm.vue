<template>
  <span
    class="explainable-term"
    :class="{ 'show-icon': showIcon }"
    role="button"
    tabindex="0"
    @click="openDialog"
    @keydown.enter="openDialog"
    @keydown.space.prevent="openDialog"
  >
    <slot />
    <span v-if="showIcon" class="explainable-icon" aria-hidden="true">ⓘ</span>
    <span class="explainable-underline" aria-hidden="true" />
  </span>
  <PropertyExplanationDialog
    :is-open="isOpen"
    :term-key="termKey"
    :category="category"
    @close="closeDialog"
  />
</template>

<script setup lang="ts">
/**
 * ExplainableTerm
 * Makes any term/label clickable to show an explanation dialog.
 * Vue port of exoplanets ExplainableProperty.
 */
import { ref } from 'vue'
import PropertyExplanationDialog from './PropertyExplanationDialog.vue'

const props = withDefaults(
  defineProps<{
    termKey: string
    category?: string
    showIcon?: boolean
  }>(),
  { category: 'cosmography', showIcon: false },
)

const isOpen = ref(false)

function openDialog() {
  isOpen.value = true
}

function closeDialog() {
  isOpen.value = false
}
</script>

<style scoped>
.explainable-term {
  cursor: pointer;
  text-decoration: underline;
  text-decoration-style: dotted;
  text-underline-offset: 2px;
  color: inherit;
  transition: color 0.2s;
}

.explainable-term:hover {
  color: #22d3ee;
}

.explainable-icon {
  margin-left: 0.2em;
  font-size: 0.85em;
  opacity: 0.7;
}

.explainable-underline {
  display: none;
}
</style>
