<template>
  <section class="local-group-layers-panel">
    <div class="local-group-layers-header">
      <p class="local-group-layers-title">{{ title }}</p>
      <button class="local-group-layers-collapse" type="button" @click="emit('toggleOpen')">
        {{ open ? '−' : '+' }}
      </button>
    </div>

    <div v-if="open" class="local-group-layers-body">
      <button
        v-for="control in controls"
        :key="control.key"
        class="local-group-layer-toggle"
        :class="{ active: visibility[control.key] }"
        type="button"
        @click="emit('toggleLayer', control.key)"
      >
        <span class="local-group-layer-dot" />
        <span>{{ control.label }}</span>
      </button>

      <div class="local-group-layers-legend">
        <p class="local-group-legend-title">{{ legendTitle }}</p>
        <div class="local-group-legend-grid">
          <div v-for="bin in velocityBins" :key="bin.label" class="local-group-legend-item">
            <span class="local-group-legend-swatch" :style="{ background: colorToCss(bin.color) }" />
            <span class="local-group-legend-label">{{ bin.label }}</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { LocalGroupLayerVisibility } from '@/three/local-group/localGroupTypes'

defineProps<{
  title: string
  legendTitle: string
  open: boolean
  controls: Array<{ key: keyof LocalGroupLayerVisibility; label: string }>
  visibility: LocalGroupLayerVisibility
  velocityBins: Array<{ label: string; color: [number, number, number] }>
}>()

const emit = defineEmits<{
  toggleLayer: [key: keyof LocalGroupLayerVisibility]
  toggleOpen: []
}>()

/**
 * Converts a normalized RGB tuple into CSS color syntax.
 */
function colorToCss(color: [number, number, number]): string {
  return `rgb(${Math.round(color[0] * 255)}, ${Math.round(color[1] * 255)}, ${Math.round(color[2] * 255)})`
}
</script>

<style scoped>
.local-group-layers-panel {
  width: min(260px, calc(100vw - 40px));
  padding: 14px;
  border: 1px solid rgba(110, 195, 236, 0.16);
  background: rgba(3, 10, 17, 0.74);
  backdrop-filter: blur(16px);
  box-shadow: 0 18px 50px rgba(0, 0, 0, 0.3);
}

.local-group-layers-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.local-group-layers-title,
.local-group-legend-title {
  margin: 0;
  font-family: "IBM Plex Sans", "Segoe UI", sans-serif;
  font-size: 10px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: rgba(165, 220, 242, 0.54);
}

.local-group-layers-collapse {
  width: 30px;
  height: 30px;
  border: 1px solid rgba(107, 187, 224, 0.24);
  background: rgba(8, 20, 30, 0.72);
  color: rgba(220, 243, 252, 0.85);
  cursor: pointer;
}

.local-group-layers-body {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 12px;
}

.local-group-layer-toggle {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 10px;
  border: 1px solid rgba(70, 128, 156, 0.2);
  background: rgba(8, 19, 29, 0.74);
  color: rgba(216, 241, 250, 0.76);
  font-family: "IBM Plex Sans", "Segoe UI", sans-serif;
  font-size: 12px;
  cursor: pointer;
  transition: border-color 0.2s ease, color 0.2s ease;
}

.local-group-layer-toggle.active {
  border-color: rgba(111, 205, 255, 0.42);
  color: rgba(240, 251, 255, 0.94);
}

.local-group-layer-dot {
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: rgba(104, 205, 255, 0.82);
  box-shadow: 0 0 12px rgba(104, 205, 255, 0.4);
}

.local-group-layers-legend {
  margin-top: 8px;
  padding-top: 10px;
  border-top: 1px solid rgba(93, 151, 180, 0.16);
}

.local-group-legend-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 5px;
  margin-top: 10px;
}

.local-group-legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.local-group-legend-swatch {
  width: 14px;
  height: 8px;
  flex-shrink: 0;
}

.local-group-legend-label {
  font-family: "IBM Plex Sans", "Segoe UI", sans-serif;
  font-size: 11px;
  color: rgba(207, 231, 242, 0.65);
}
</style>
