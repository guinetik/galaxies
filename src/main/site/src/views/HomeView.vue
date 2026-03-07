<template>
  <div class="w-full h-full">
    <GalaxyCanvas ref="canvasRef" @ready="onCanvasReady" @hover="onHover" @select="onSelect" />
    
    <!-- Hero CTA overlay — visible at default zoom, dismissed on scroll or click -->
    <Transition name="hero">
      <div v-if="showHero && canvasReady" class="hero-overlay">
        <!-- Radial glow that follows the cursor — the "mass" of the gravitational lens -->
        <div
          v-if="!isMobile"
          class="hero-lens-glow"
          :style="lensGlowStyle"
        />
        <div class="hero-content">
          <h1 ref="titleRef" class="hero-title">
            <span
              v-for="(char, i) in titleChars"
              :key="i"
              class="hero-char"
              :style="{
                ...getCharLensStyle(i),
                '--twinkle-dur': `${2.5 + i * 0.4}s`,
                animationDelay: `${0.2 + i * 0.35}s, ${1.0 + i * 0.6}s`,
              }"
            >{{ char }}</span>
          </h1>
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
import type { Galaxy } from '@/types/galaxy'
import type { MorphologyCategory } from '@/three/galaxy-detail/morphology'

const router = useRouter()
const { t } = useI18n()
const { isLoading } = useGalaxyData()
const { currentLocation, locationSetter } = useAppHeader()
const isMobile = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches
const canvasRef = ref<InstanceType<typeof GalaxyCanvas> | null>(null)
const titleRef = ref<HTMLElement | null>(null)
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
  window.removeEventListener('mousemove', onLensMouseMove)
  window.removeEventListener('resize', onLensResize)
  window.removeEventListener('wheel', onHeroWheel, { capture: true } as EventListenerOptions)
  window.removeEventListener('touchmove', onHeroTouch, { capture: true } as EventListenerOptions)
})

function onFilterChange(payload: { morphologies: Set<MorphologyCategory>; sources: Set<string> }) {
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

let introAnimating = false

/**
 * Dismiss hero CTA and launch the cinematic intro zoom.
 * Zooms from deepest field (CAMERA_FOV_MIN) back to default,
 * creating a "reverse journey" from billions of light-years to local space.
 */
async function dismissHero() {
  if (!showHero.value || introAnimating) return
  introAnimating = true
  showHero.value = false
  if (canvasRef.value) {
    await canvasRef.value.animateIntroZoom()
  }
  introAnimating = false
}

function onHeroWheel(e: WheelEvent) {
  if (showHero.value) {
    e.preventDefault()
    dismissHero()
  }
}

function onHeroTouch(e: TouchEvent) {
  if (showHero.value && e.touches.length >= 2) {
    e.preventDefault()
    dismissHero()
  }
}

watch(
  () => showHero.value && canvasReady.value,
  (heroActive) => {
    if (heroActive) {
      canvasRef.value?.setZoomLock(true)
      window.addEventListener('wheel', onHeroWheel, { passive: false, capture: true })
      window.addEventListener('touchmove', onHeroTouch, { passive: false, capture: true })
    } else {
      window.removeEventListener('wheel', onHeroWheel, { capture: true } as EventListenerOptions)
      window.removeEventListener('touchmove', onHeroTouch, { capture: true } as EventListenerOptions)
    }
  },
  { immediate: true }
)

// ── Gravitational lensing effect on hero title ──

const titleChars = computed(() => t('header.siteName').split(''))

const lensMouseX = ref(-9999)
const lensMouseY = ref(-9999)
let charRestPositions: { x: number; y: number }[] = []

const LENS_RADIUS = 180
const LENS_MAX_DISPLACE = 16
const LENS_MAX_SCALE = 0.25
const LENS_GLOW_PEAK = 0.6

/** Snapshot each character's center before any lens transforms are applied */
function cacheCharPositions() {
  if (!titleRef.value) return
  charRestPositions = Array.from(titleRef.value.children).map(child => {
    const rect = (child as HTMLElement).getBoundingClientRect()
    return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
  })
}

function onLensMouseMove(e: MouseEvent) {
  if (charRestPositions.length === 0) cacheCharPositions()
  lensMouseX.value = e.clientX
  lensMouseY.value = e.clientY
}

function onLensResize() {
  charRestPositions = []
}

/**
 * Compute per-character gravitational lens transform.
 * Uses cached rest positions so feedback from previous-frame transforms
 * cannot cause oscillation.
 */
function getCharLensStyle(i: number): Record<string, string> {
  const mx = lensMouseX.value
  const my = lensMouseY.value
  if (isMobile) return {}

  const pos = charRestPositions[i]
  if (!pos) return {}

  const dx = pos.x - mx
  const dy = pos.y - my
  const dist = Math.sqrt(dx * dx + dy * dy)

  if (dist > LENS_RADIUS) return {}

  const proximity = 1 - dist / LENS_RADIUS
  const strength = proximity * proximity

  if (dist < 1) {
    return {
      scale: `${1 + LENS_MAX_SCALE}`,
      textShadow: `0 0 20px rgba(255,255,255,${LENS_GLOW_PEAK})`,
    }
  }

  const displaceX = (dx / dist) * strength * LENS_MAX_DISPLACE
  const displaceY = (dy / dist) * strength * LENS_MAX_DISPLACE
  const sc = 1 + strength * LENS_MAX_SCALE
  const glow = strength * LENS_GLOW_PEAK

  return {
    translate: `${displaceX.toFixed(1)}px ${displaceY.toFixed(1)}px`,
    scale: `${sc.toFixed(3)}`,
    textShadow: glow > 0.02 ? `0 0 ${(24 * strength).toFixed(0)}px rgba(255,255,255,${glow.toFixed(2)})` : 'none',
  }
}

/** Radial glow orb that tracks the cursor — acts as the visible "mass" of the lens */
const lensGlowStyle = computed(() => {
  const mx = lensMouseX.value
  const my = lensMouseY.value
  if (mx < -999) return { opacity: '0' }
  return {
    left: `${mx}px`,
    top: `${my}px`,
    opacity: '1',
  }
})

if (!isMobile) {
  watch(
    () => showHero.value && canvasReady.value,
    (active) => {
      if (active) {
        window.addEventListener('mousemove', onLensMouseMove)
        window.addEventListener('resize', onLensResize)
      } else {
        window.removeEventListener('mousemove', onLensMouseMove)
        window.removeEventListener('resize', onLensResize)
        charRestPositions = []
      }
    },
    { immediate: true }
  )
}
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

.hero-lens-glow {
  position: fixed;
  width: 500px;
  height: 500px;
  border-radius: 50%;
  pointer-events: none;
  transform: translate(-50%, -50%);
  background: radial-gradient(
    circle,
    rgba(200, 220, 255, 0.18) 0%,
    rgba(160, 190, 255, 0.10) 20%,
    rgba(130, 160, 255, 0.05) 40%,
    rgba(100, 130, 255, 0.02) 60%,
    transparent 80%
  );
  filter: blur(16px);
  opacity: 0;
  transition: opacity 0.6s ease-out;
  z-index: 0;
  mix-blend-mode: screen;
}

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
  padding-left: 0.35em;
  animation: heroFadeUp 1s ease-out 0.2s both;
}

.hero-char {
  display: inline-block;
  transition: text-shadow 120ms ease-out;
  will-change: translate, scale;
  text-shadow:
    0 0 6px rgba(200, 220, 255, 0.5),
    0 0 18px rgba(160, 190, 255, 0.3),
    0 0 40px rgba(140, 170, 255, 0.12);
  animation:
    heroFadeUp 1s ease-out both,
    twinkle var(--twinkle-dur, 3s) ease-in-out infinite;
}

@keyframes twinkle {
  0%, 100% {
    filter: brightness(0.85);
  }
  50% {
    filter: brightness(1.4);
  }
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
