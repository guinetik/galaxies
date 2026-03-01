<template>
  <div class="elevation-indicator pointer-events-none select-none h-64 w-12 flex flex-col items-start relative py-4">
    <!-- Vertical Line -->
    <div class="absolute left-0 top-4 bottom-4 w-px bg-white/10"></div>

    <!-- Ticks & Labels -->
    <div class="relative w-full h-full">
      <div 
        v-for="tick in ticks" 
        :key="tick.value"
        class="absolute left-0 flex items-center justify-start w-full -translate-y-1/2"
        :style="{ top: `${getTickPosition(tick.value)}%` }"
      >
        <div class="w-1.5 h-px bg-white/30"></div>
        <span class="ml-2 text-[10px] font-mono text-white/30">{{ tick.label }}</span>
      </div>

      <!-- Current Value Indicator (Green Tick) -->
      <div 
        class="absolute left-0 flex items-center justify-start w-full transition-all duration-300 ease-out -translate-y-1/2"
        :style="{ top: `${indicatorPosition}%` }"
      >
        <div class="w-3 h-[2px] bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]"></div>
        <span class="ml-2 text-xs font-mono text-green-400 font-bold drop-shadow-md">
          {{ Math.round(elevation) }}°
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  elevation: number // -90 to 90
}>()

// Define scale range
const MIN_ELEVATION = -90
const MAX_ELEVATION = 90

// Ticks for the scale
const ticks = [
  { value: 90, label: '90°' },
  { value: 60, label: '60°' },
  { value: 30, label: '30°' },
  { value: 0, label: '0°' },
  { value: -30, label: '-30°' },
  { value: -60, label: '-60°' },
  { value: -90, label: '-90°' },
]

// Map elevation to percentage position (0% at top, 100% at bottom)
// Max (90) -> 0% top
// Min (-90) -> 100% top (bottom)

function getTickPosition(val: number) {
  const t = (val - MIN_ELEVATION) / (MAX_ELEVATION - MIN_ELEVATION)
  return (1 - t) * 100
}

const indicatorPosition = computed(() => {
  const t = (props.elevation - MIN_ELEVATION) / (MAX_ELEVATION - MIN_ELEVATION)
  // Clamp
  const clampedT = Math.max(0, Math.min(1, t))
  return (1 - clampedT) * 100
})

</script>
