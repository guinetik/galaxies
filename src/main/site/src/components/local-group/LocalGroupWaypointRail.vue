<template>
  <section class="local-group-waypoint-rail">
    <p class="local-group-waypoint-title">{{ title }}</p>
    <button
      v-for="landmark in landmarks"
      :key="landmark.id"
      class="local-group-waypoint-button"
      :class="{ active: landmark.id === activeId }"
      type="button"
      @click="emit('select', landmark.id)"
    >
      <span class="local-group-waypoint-index">{{ landmarkIndex(landmark.id) }}</span>
      <span class="local-group-waypoint-label">{{ landmark.label }}</span>
    </button>
  </section>
</template>

<script setup lang="ts">
import type { LocalGroupLandmark } from '@/three/local-group/localGroupTypes'

const props = defineProps<{
  title: string
  landmarks: LocalGroupLandmark[]
  activeId: string | null
}>()

const emit = defineEmits<{
  select: [id: string]
}>()

/**
 * Returns the human-readable order for a waypoint.
 */
function landmarkIndex(id: string): string {
  return String(props.landmarks.findIndex((landmark) => landmark.id === id) + 1).padStart(2, '0')
}
</script>

<style scoped>
.local-group-waypoint-rail {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: min(320px, calc(100vw - 40px));
  padding: 14px;
  border: 1px solid rgba(110, 195, 236, 0.16);
  background: rgba(3, 10, 17, 0.74);
  backdrop-filter: blur(16px);
  box-shadow: 0 18px 50px rgba(0, 0, 0, 0.3);
}

.local-group-waypoint-title {
  margin: 0 0 4px;
  font-family: "IBM Plex Sans", "Segoe UI", sans-serif;
  font-size: 10px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: rgba(165, 220, 242, 0.54);
}

.local-group-waypoint-button {
  display: grid;
  grid-template-columns: 36px minmax(0, 1fr);
  gap: 10px;
  align-items: center;
  padding: 10px 12px;
  border: 1px solid transparent;
  background: linear-gradient(180deg, rgba(10, 23, 35, 0.9), rgba(4, 11, 19, 0.72));
  color: rgba(219, 242, 250, 0.84);
  cursor: pointer;
  transition: border-color 0.2s ease, transform 0.2s ease, background 0.2s ease;
}

.local-group-waypoint-button:hover {
  transform: translateX(-2px);
  border-color: rgba(114, 205, 255, 0.32);
  background: linear-gradient(180deg, rgba(12, 28, 42, 0.95), rgba(5, 12, 20, 0.82));
}

.local-group-waypoint-button.active {
  border-color: rgba(114, 205, 255, 0.48);
  box-shadow: inset 0 0 0 1px rgba(183, 237, 255, 0.08);
}

.local-group-waypoint-index {
  font-family: "Orbitron", "Trebuchet MS", sans-serif;
  font-size: 13px;
  color: rgba(90, 199, 255, 0.82);
}

.local-group-waypoint-label {
  text-align: left;
  font-family: "IBM Plex Sans", "Segoe UI", sans-serif;
  font-size: 13px;
  line-height: 1.3;
}
</style>
