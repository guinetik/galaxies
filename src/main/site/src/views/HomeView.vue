<template>
  <div class="w-full h-full">
    <GalaxyCanvas ref="canvasRef" @ready="onCanvasReady" @hover="onHover" @select="onSelect" />
    
    <!-- Hero CTA overlay — visible at default zoom, dismissed on scroll or click -->
    <Transition name="hero">
      <div v-if="showHero && canvasReady" class="hero-overlay">
        <div class="hero-content">
          <h1 class="hero-title">{{ t('header.siteName') }}</h1>
          <p class="hero-subtitle">{{ t('pages.home.hero.subtitle') }}</p>
          <button class="hero-button" @click="dismissHero">
            {{ t('pages.home.hero.cta') }}
          </button>
          <div class="hero-hint-group">
            <div class="hero-scroll-line"><span /></div>
            <p class="hero-hint">
              {{ isMobile ? t('pages.home.hero.hintMobile') : t('pages.home.hero.hint') }}
            </p>
          </div>
        </div>
      </div>
    </Transition>

    <!-- HUD Indicators -->
    <div class="absolute top-16 left-0 right-0 z-0 pointer-events-none flex justify-center hud-soft" :class="{ 'hud-hidden': showHero }">
      <div class="w-full max-w-3xl">
        <SpaceCompass :azimuth="currentAzimuth" />
      </div>
    </div>
    
    <div class="absolute right-4 top-1/2 -translate-y-1/2 z-0 pointer-events-none hud-soft hud-telemetry" :class="{ 'hud-hidden': showHero }">
      <DistanceIndicator :distance="currentDistance" />
    </div>

    <div class="absolute left-4 top-1/2 -translate-y-1/2 z-0 pointer-events-none hud-soft hud-telemetry" :class="{ 'hud-hidden': showHero }">
      <ElevationIndicator :elevation="currentElevation" />
    </div>

    <SkyFilterPanel
      v-if="canvasReady && !showHero"
      :total-count="totalGalaxyCount"
      :filtered-count="filteredCount"
      @filter-change="onFilterChange"
    />
    <GalaxyTooltip
      :galaxy="tooltipGalaxy"
      :x="tooltipX"
      :y="tooltipY"
      :show-cta="isMobile"
      @navigate="onTooltipNavigate"
    />
    <LoadingOverlay :is-loading="isLoading" />

    <!-- Galaxy count badge (bottom right) -->
    <div
      v-if="canvasReady && filteredCount > 0 && !showHero"
      class="galaxy-count-badge"
    >
      {{ t('app.loaded', { count: filteredCount.toLocaleString() }) }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import GalaxyCanvas from '@/components/GalaxyCanvas.vue'
import type { HoverEvent } from '@/components/GalaxyCanvas.vue'
import SkyFilterPanel from '@/components/SkyFilterPanel.vue'
import { useAppHeader } from '@/composables/useAppHeader'
import GalaxyTooltip from '@/components/GalaxyTooltip.vue'
import LoadingOverlay from '@/components/LoadingOverlay.vue'
import SpaceCompass from '@/components/SpaceCompass.vue'
import DistanceIndicator from '@/components/DistanceIndicator.vue'
import ElevationIndicator from '@/components/ElevationIndicator.vue'
import { useI18n } from 'vue-i18n'
import { useGalaxyData } from '@/composables/useGalaxyData'
import { redshiftToDistanceMLY } from '@/three/celestialMath'
import { CAMERA_FOV_DEFAULT } from '@/three/constants'
import type { Galaxy, MorphologyClass } from '@/types/galaxy'

const router = useRouter()
const { t } = useI18n()
const { isLoading } = useGalaxyData()
const { currentLocation, locationSetter } = useAppHeader()
const isMobile = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches
const canvasRef = ref<InstanceType<typeof GalaxyCanvas> | null>(null)
const canvasReady = ref(false)
const showHero = ref(true)
const totalGalaxyCount = ref(0)
const filteredCount = ref(0)
const hoveredGalaxy = ref<Galaxy | null>(null)
const selectedGalaxy = ref<Galaxy | null>(null)
const tooltipX = ref(0)
const tooltipY = ref(0)

const tooltipGalaxy = computed(() =>
  isMobile ? selectedGalaxy.value : hoveredGalaxy.value
)
const currentAzimuth = computed(() => canvasRef.value?.currentLookAt?.azimuth ?? 0)
const currentElevation = computed(() => canvasRef.value?.currentLookAt?.elevation ?? 0)
const currentDistance = computed(() => {
  const z = canvasRef.value?.currentMaxRedshift ?? 0
  return redshiftToDistanceMLY(z)
})

function onCanvasReady() {
  canvasReady.value = true
  const total = canvasRef.value?.getAllGalaxiesCount() ?? 0
  totalGalaxyCount.value = total
  filteredCount.value = total
  if (canvasRef.value) {
    locationSetter.value = canvasRef.value.setLocation
    currentLocation.value = canvasRef.value.currentLocation
  }
}

onUnmounted(() => {
  locationSetter.value = null
})

function onFilterChange(payload: { morphologies: Set<MorphologyClass>; sources: Set<string> }) {
  const count = canvasRef.value?.applyFilter(payload.morphologies, payload.sources) ?? 0
  filteredCount.value = count
}

function onHover(payload: HoverEvent | null) {
  if (payload) {
    hoveredGalaxy.value = payload.galaxy
    tooltipX.value = payload.screenX
    tooltipY.value = payload.screenY
  } else {
    hoveredGalaxy.value = null
  }
}

function onSelect(payload: HoverEvent | null) {
  if (payload) {
    selectedGalaxy.value = payload.galaxy
    tooltipX.value = payload.screenX
    tooltipY.value = payload.screenY
  } else {
    selectedGalaxy.value = null
  }
}

function onTooltipNavigate() {
  if (selectedGalaxy.value) {
    router.push(`/g/${selectedGalaxy.value.pgc}`)
  }
}

/** Dismiss hero CTA — triggered by button click or zoom detection */
function dismissHero() {
  showHero.value = false
}

const HERO_DISMISS_THRESHOLD = 1

watch(
  () => canvasRef.value?.currentFov,
  (fov) => {
    if (showHero.value && fov !== undefined && fov < CAMERA_FOV_DEFAULT - HERO_DISMISS_THRESHOLD) {
      dismissHero()
    }
  }
)
</script>

<style scoped>
.galaxy-count-badge {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 10;
  padding: 7px 12px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.62);
  background: rgba(0, 0, 0, 0.34);
  backdrop-filter: blur(6px);
  border-radius: 6px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  pointer-events: none;
}

.hud-soft {
  opacity: 0.42;
  transition: opacity 600ms ease;
}

.hud-soft:hover {
  opacity: 0.72;
}

.hud-telemetry {
  opacity: 0.36;
}

.hud-hidden {
  opacity: 0 !important;
}

/* ── Hero CTA Overlay ── */

.hero-overlay {
  position: fixed;
  inset: 0;
  z-index: 15;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}

.hero-content {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 24px;
}

.hero-title {
  font-size: clamp(2.4rem, 6vw, 4.5rem);
  font-weight: 200;
  letter-spacing: 0.35em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.88);
  margin: 0;
  text-indent: 0.35em;
  animation: heroFadeUp 1s ease-out 0.2s both;
}

.hero-subtitle {
  font-size: clamp(0.78rem, 1.4vw, 0.95rem);
  font-weight: 300;
  letter-spacing: 0.12em;
  color: rgba(255, 255, 255, 0.4);
  max-width: 480px;
  line-height: 1.7;
  margin: 1.2rem 0 0;
  animation: heroFadeUp 1s ease-out 0.55s both;
}

.hero-button {
  pointer-events: auto;
  margin-top: 2.2rem;
  padding: 13px 52px;
  font-size: 0.7rem;
  font-weight: 400;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  text-indent: 0.3em;
  color: rgba(255, 255, 255, 0.75);
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 0;
  cursor: pointer;
  transition: border-color 0.4s ease, color 0.4s ease, background 0.4s ease;
  animation: heroFadeUp 0.9s ease-out 0.85s both;
}

.hero-button:hover {
  border-color: rgba(255, 255, 255, 0.5);
  color: rgba(255, 255, 255, 0.95);
  background: rgba(255, 255, 255, 0.04);
}

.hero-hint-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 3rem;
  gap: 0.8rem;
  animation: heroFadeUp 0.8s ease-out 1.2s both;
}

.hero-scroll-line {
  width: 1px;
  height: 36px;
  background: rgba(255, 255, 255, 0.08);
  position: relative;
  overflow: hidden;
}

.hero-scroll-line span {
  position: absolute;
  width: 1px;
  height: 10px;
  left: 0;
  background: rgba(255, 255, 255, 0.4);
  border-radius: 1px;
  animation: scrollDot 2.4s ease-in-out infinite;
}

.hero-hint {
  font-size: 0.62rem;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  text-indent: 0.22em;
  color: rgba(255, 255, 255, 0.22);
  margin: 0;
}

@keyframes heroFadeUp {
  from {
    opacity: 0;
    transform: translateY(18px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes scrollDot {
  0% { top: -10px; opacity: 0; }
  15% { opacity: 1; }
  85% { opacity: 1; }
  100% { top: 36px; opacity: 0; }
}

/* Hero exit transition */
.hero-leave-active {
  transition: all 0.7s cubic-bezier(0.4, 0, 0.2, 1);
}

.hero-leave-active .hero-title,
.hero-leave-active .hero-subtitle,
.hero-leave-active .hero-button,
.hero-leave-active .hero-hint-group {
  transition: all 0.7s cubic-bezier(0.4, 0, 0.2, 1);
}

.hero-leave-to {
  opacity: 0;
}

.hero-leave-to .hero-title {
  transform: translateY(-24px);
  opacity: 0;
}

.hero-leave-to .hero-subtitle {
  transform: translateY(-16px);
  opacity: 0;
}

.hero-leave-to .hero-button {
  transform: translateY(-10px);
  opacity: 0;
}

.hero-leave-to .hero-hint-group {
  transform: translateY(10px);
  opacity: 0;
}
</style>
