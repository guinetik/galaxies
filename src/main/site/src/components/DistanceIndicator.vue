<template>
  <div class="distance-indicator pointer-events-none select-none h-64 w-12 flex flex-col items-end relative py-4">
    <!-- Vertical Line -->
    <div class="absolute right-0 top-4 bottom-4 w-px bg-white/10"></div>

    <!-- Ticks & Labels -->
    <div class="relative w-full h-full">
      <div 
        v-for="tick in ticks" 
        :key="tick.value"
        class="absolute right-0 flex items-center justify-end w-full -translate-y-1/2"
        :style="{ top: `${getTickPosition(tick.value)}%` }"
      >
        <span class="mr-2 text-[10px] font-mono text-white/30">{{ tick.label }}</span>
        <div class="w-1.5 h-px bg-white/30"></div>
      </div>

      <!-- Current Value Indicator (Blue Tick) -->
      <div 
        class="absolute right-0 flex items-center justify-end w-full transition-all duration-300 ease-out -translate-y-1/2"
        :style="{ top: `${indicatorPosition}%` }"
      >
        <span class="mr-2 text-xs font-mono text-blue-400 font-bold drop-shadow-md">
          {{ Math.round(distance) }} mLY
        </span>
        <div class="w-3 h-[2px] bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  distance: number // mLY
}>()

// Define scale range
const MIN_DIST = 0
const MAX_DIST = 1600 // Slightly more than max ~1536

// Ticks for the scale
const ticks = [
  { value: 1500, label: '1.5k' },
  { value: 1000, label: '1k' },
  { value: 500, label: '500' },
  { value: 100, label: '100' },
  { value: 0, label: '0' },
]

// Map distance to percentage position (0% at top, 100% at bottom)
// Or 100% at top (Max) and 0% at bottom (0)?
// User sketch: Max at top.
// So Max -> 0% top, 0 -> 100% top (bottom of container).

function getTickPosition(val: number) {
  // Linear scale for now
  const t = (val - MIN_DIST) / (MAX_DIST - MIN_DIST)
  return (1 - t) * 100
}

const indicatorPosition = computed(() => {
  const t = (props.distance - MIN_DIST) / (MAX_DIST - MIN_DIST)
  // Clamp
  const clampedT = Math.max(0, Math.min(1, t))
  return (1 - clampedT) * 100
})

</script>
