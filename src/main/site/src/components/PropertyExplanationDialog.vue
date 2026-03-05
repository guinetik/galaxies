<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      class="property-dialog-overlay"
      @click="onClose"
    >
      <div class="property-dialog" @click.stop>
        <button
          class="property-dialog-close"
          aria-label="Close dialog"
          @click="onClose"
        >
          &times;
        </button>
        <h3 class="property-dialog-title">{{ title }}</h3>
        <div class="property-dialog-content">
          <p v-if="description" class="property-dialog-description">{{ description }}</p>
          <div v-if="example" class="property-dialog-example">
            <strong>Example:</strong> {{ example }}
          </div>
          <p v-if="technicalNote" class="property-dialog-technical">
            <strong>Technical:</strong> {{ technicalNote }}
          </p>
          <div v-if="funFact" class="property-dialog-fun-fact">{{ funFact }}</div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
/**
 * PropertyExplanationDialog
 * Reusable glassmorphic modal for explaining astronomical properties.
 * Renders property information from i18n structure.
 */
import { computed, watch, watchEffect } from 'vue'
import { useI18n } from 'vue-i18n'

const props = defineProps<{
  isOpen: boolean
  termKey: string
  category: string
}>()

const emit = defineEmits<{
  close: []
}>()

const { t } = useI18n()

const basePath = computed(() => `propertyExplanations.${props.category}.${props.termKey}`)

const title = computed(() => t(`${basePath.value}.title`))
const description = computed(() => t(`${basePath.value}.description`))
const example = computed(() => t(`${basePath.value}.example`, ''))
const technicalNote = computed(() => t(`${basePath.value}.technicalNote`, ''))
const funFact = computed(() => t(`${basePath.value}.funFact`, ''))

const translationExists = computed(() => {
  const tVal = title.value
  const dVal = description.value
  return !tVal.includes(basePath.value) && !dVal.includes(basePath.value)
})

function onClose() {
  emit('close')
}

/** Handle Escape key and body scroll lock */
watch(
  () => props.isOpen,
  (open) => {
    document.body.style.overflow = open ? 'hidden' : ''
  },
)
watchEffect((onCleanup) => {
  if (!props.isOpen) return
  const handler = (e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose()
  }
  document.addEventListener('keydown', handler)
  onCleanup(() => document.removeEventListener('keydown', handler))
})
</script>

<style scoped>
.property-dialog-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
}

.property-dialog {
  max-width: 28rem;
  width: calc(100% - 2rem);
  padding: 1.5rem;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(12px);
  border-radius: 0.75rem;
  border: 1px solid rgba(255, 255, 255, 0.15);
  position: relative;
}

.property-dialog-close {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.6);
  font-size: 1.5rem;
  cursor: pointer;
  line-height: 1;
  padding: 0.25rem;
}

.property-dialog-close:hover {
  color: #fff;
}

.property-dialog-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #fff;
  margin-bottom: 1rem;
  padding-right: 2rem;
}

.property-dialog-description {
  color: rgba(255, 255, 255, 0.85);
  line-height: 1.6;
  margin-bottom: 0.75rem;
}

.property-dialog-example {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.75);
  margin-bottom: 0.75rem;
}

.property-dialog-technical {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.5);
  line-height: 1.5;
  margin-bottom: 0.75rem;
}

.property-dialog-fun-fact {
  font-size: 0.875rem;
  color: #22d3ee;
  font-style: italic;
}
</style>
