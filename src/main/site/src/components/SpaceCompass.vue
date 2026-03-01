<template>
  <div class="space-compass pointer-events-none select-none">
    <!-- Azimuth Tape -->
    <div class="compass-tape relative w-full h-12 overflow-hidden">
      <!-- Center Marker (Red Triangle/Tick) -->
      <div class="absolute left-1/2 top-0 -translate-x-1/2 z-10 flex flex-col items-center">
        <div class="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-8 border-t-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.6)]"></div>
        <div class="w-px h-4 bg-red-500/50 shadow-[0_0_8px_rgba(239,68,68,0.4)]"></div>
      </div>

      <!-- Ticks Container -->
      <div 
        class="absolute top-0 h-full will-change-transform"
        :style="{ transform: `translateX(calc(50% - ${azimuthPixels}px))` }"
      >
        <div 
          v-for="tick in visibleTicks" 
          :key="tick.value"
          class="absolute top-0 flex flex-col items-center w-0 overflow-visible"
          :style="{ left: `${tick.offset}px` }"
        >
          <!-- Major Tick (every 10 or 15 degrees) -->
          <div 
            v-if="tick.isMajor" 
            class="w-px h-3 bg-white/40 flex-none"
          ></div>
          <!-- Minor Tick -->
          <div 
            v-else 
            class="w-px h-1.5 bg-white/20 flex-none"
          ></div>
          
          <!-- Label -->
          <div 
            v-if="tick.label" 
            class="mt-1 text-[10px] font-mono text-white/40 whitespace-nowrap"
          >
            {{ tick.label }}
          </div>
        </div>
      </div>
      
      <!-- Gradient Fade Edges -->
      <div class="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/80 pointer-events-none"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  azimuth: number // Cumulative degrees
  elevation?: number // -90 to 90
}>()

const PIXELS_PER_DEGREE = 4

// Calculate pixel offset for current azimuth directly (cumulative)
const azimuthPixels = computed(() => {
  return props.azimuth * PIXELS_PER_DEGREE
})

const visibleTicks = computed(() => {
  const center = props.azimuth
  // Increase range to cover wide screens (e.g. 4k)
  // 4k width = 3840px. Half = 1920px.
  // 1920 / 4 px/deg = 480 degrees.
  // Let's use a safe margin.
  const range = 500 
  const start = Math.floor(center - range)
  const end = Math.ceil(center + range)
  
  const ticks = []
  for (let i = start; i <= end; i++) {
    // Normalize degree for label (0-359)
    let degree = i % 360
    if (degree < 0) degree += 360
    
    // Major ticks every 15 degrees, minor every 5
    const isMajor = degree % 15 === 0
    const isMinor = degree % 5 === 0
    
    if (isMinor || isMajor) {
      ticks.push({
        value: i, // Use raw value for key/offset
        offset: i * PIXELS_PER_DEGREE,
        isMajor,
        label: isMajor ? `${Math.round(degree)}°` : null
      })
    }
  }
  return ticks
})
</script>

<style scoped>
/* Add any specific styles here if tailwind isn't enough */
</style>
