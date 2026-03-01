<template>
  <div class="lens-container" @click="toggle" role="button" tabindex="0" @keydown.enter="toggle">
    <!-- Telescope image (always visible as base layer) -->
    <img
      v-if="telescopeLoaded"
      :src="telescopeSrc"
      :alt="telescopeAlt"
      class="lens-img lens-telescope"
    />
    <div v-else class="lens-placeholder">
      <span>{{ telescopeAlt }}</span>
    </div>

    <!-- Observation image (revealed by aperture) -->
    <div
      class="lens-aperture"
      :class="{ open }"
      :style="apertureStyle"
    >
      <img
        v-if="observationLoaded"
        :src="observationSrc"
        :alt="observationAlt"
        class="lens-img lens-observation"
      />
      <div v-else class="lens-placeholder lens-placeholder-dark">
        <span>{{ observationAlt }}</span>
      </div>
    </div>

    <!-- Vignette overlay when open -->
    <div class="lens-vignette" :class="{ open }" />

    <!-- Hint -->
    <div class="lens-hint" :class="{ hidden: open }">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const props = defineProps<{
  telescopeSrc: string
  telescopeAlt: string
  observationSrc: string
  observationAlt: string
}>()

const open = ref(false)
const clickX = ref(50)
const clickY = ref(50)

const telescopeLoaded = ref(false)
const observationLoaded = ref(false)

// Probe whether images exist
const imgTelescope = new Image()
imgTelescope.onload = () => { telescopeLoaded.value = true }
imgTelescope.src = props.telescopeSrc

const imgObservation = new Image()
imgObservation.onload = () => { observationLoaded.value = true }
imgObservation.src = props.observationSrc

const apertureStyle = computed(() => ({
  clipPath: open.value
    ? `circle(75% at ${clickX.value}% ${clickY.value}%)`
    : `circle(0% at ${clickX.value}% ${clickY.value}%)`,
}))

function toggle(e: MouseEvent | KeyboardEvent) {
  if (!open.value && e instanceof MouseEvent) {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    clickX.value = ((e.clientX - rect.left) / rect.width) * 100
    clickY.value = ((e.clientY - rect.top) / rect.height) * 100
  }
  open.value = !open.value
}
</script>

<style scoped>
.lens-container {
  position: relative;
  width: 100%;
  aspect-ratio: 4 / 3;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  border: 1px solid rgba(255, 255, 255, 0.12);
}

.lens-img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.lens-placeholder {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: rgba(255, 255, 255, 0.35);
  font-size: 0.8rem;
  font-family: ui-monospace, monospace;
  text-align: center;
  line-height: 1.5;
}

.lens-placeholder-dark {
  background: rgba(0, 0, 0, 0.85);
}

.lens-aperture {
  position: absolute;
  inset: 0;
  clip-path: circle(0% at 50% 50%);
  transition: clip-path 0.4s ease-out;
  z-index: 2;
}

.lens-aperture.open {
  transition: clip-path 0.4s ease-out;
}

.lens-vignette {
  position: absolute;
  inset: 0;
  z-index: 3;
  pointer-events: none;
  opacity: 0;
  background: radial-gradient(circle, transparent 50%, rgba(0, 0, 0, 0.7) 100%);
  box-shadow: inset 0 0 40px rgba(0, 0, 0, 0.6);
  transition: opacity 0.4s ease-out;
}

.lens-vignette.open {
  opacity: 1;
}

.lens-hint {
  position: absolute;
  bottom: 8px;
  right: 8px;
  z-index: 4;
  color: rgba(255, 255, 255, 0.4);
  transition: opacity 0.3s;
}

.lens-hint.hidden {
  opacity: 0;
}
</style>
