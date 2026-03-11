<template>
  <div
    class="carousel-container"
    ref="containerRef"
    tabindex="0"
    @keydown="onKeydown"
    @mousedown="onMouseDown"
    @mousemove="onMouseMove"
    @mouseup="onMouseUp"
    @mouseleave="onMouseLeave"
    @touchstart="onTouchStart"
    @touchmove="onTouchMove"
    @touchend="onTouchEnd"
  >
    <div class="carousel-wrapper" ref="wrapperRef">
      <RouterLink
        v-for="(item, index) in items"
        :key="item.pgc"
        :to="`/g/${item.pgc}`"
        class="galaxy-card"
        :class="cardClass(index)"
        @click.prevent="onCardClick(index)"
      >
        <div class="galaxy-card-overlay">
          <div class="galaxy-card-name">{{ displayName(item) }}</div>
          <div class="galaxy-card-meta">
            <span v-if="item.constellation">{{ item.constellation }}</span>
            <span v-if="item.constellation && item.galaxy"> · </span>
            <span v-if="item.galaxy">{{ Math.round(item.galaxy.distance_mly) }} {{ t('pages.tour.mly') }}</span>
            <span v-if="item.galaxy?.vcmb"> · {{ Math.round(item.galaxy.vcmb) }} {{ t('pages.tour.velocity') }}</span>
          </div>
          <div v-if="item.type" class="galaxy-card-type">{{ item.type }}</div>
        </div>
        <img
          :src="imageSrc(item.pgc)"
          :alt="displayName(item)"
          class="galaxy-card-image"
          loading="lazy"
          @error="onImageError"
        />
      </RouterLink>
    </div>

    <button
      v-if="items.length > 1"
      type="button"
      class="carousel-nav carousel-nav-left"
      aria-label="Previous"
      @click.stop="navigate(-1)"
    >
      <span class="carousel-nav-icon">‹</span>
    </button>
    <button
      v-if="items.length > 1"
      type="button"
      class="carousel-nav carousel-nav-right"
      aria-label="Next"
      @click.stop="navigate(1)"
    >
      <span class="carousel-nav-icon">›</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import type { Galaxy } from '@/types/galaxy'

export interface TourGalaxyItem {
  pgc: number
  names: string[]
  type: string
  category: string
  constellation?: string
  description?: string
  galaxy?: Galaxy | null
}

const props = withDefaults(
  defineProps<{
    items?: TourGalaxyItem[]
  }>(),
  { items: () => [] }
)

const { t } = useI18n()
const router = useRouter()
const containerRef = ref<HTMLElement | null>(null)
const wrapperRef = ref<HTMLElement | null>(null)

const currentIndex = ref(0)
const isAnimating = ref(false)
const touchStartX = ref(0)
const touchStartY = ref(0)
const touchEndX = ref(0)
const isDragging = ref(false)
const dragStartX = ref(0)
/** Set when navigating from drag; suppresses the next click to avoid accidental navigation. */
const shouldIgnoreNextClick = ref(false)
let parallaxRafId = 0
let lastParallaxX = 0
let lastParallaxY = 0
let lastCenterX = 0
let lastCenterY = 0

const total = computed(() => props.items.length)

/** Primary display name (first in names array). */
function displayName(item: TourGalaxyItem): string {
  return item.names?.[0] ?? `PGC ${item.pgc}`
}

/** Image path: /{pgc}.webp in public folder. */
function imageSrc(pgc: number): string {
  return `/${pgc}.webp`
}

function onImageError(e: Event) {
  const img = e.target as HTMLImageElement
  img.style.display = 'none'
  img.parentElement?.classList.add('no-image')
}

function cardClass(index: number): string {
  const diff = index - currentIndex.value
  let norm = diff
  if (diff > total.value / 2) norm = diff - total.value
  else if (diff < -total.value / 2) norm = diff + total.value

  if (norm === 0) return 'active'
  if (norm === -1) return 'left-1'
  if (norm === -2) return 'left-2'
  if (norm === -3) return 'left-3'
  if (norm === 1) return 'right-1'
  if (norm === 2) return 'right-2'
  if (norm === 3) return 'right-3'
  return 'hidden'
}

function navigate(direction: number) {
  if (total.value === 0 || isAnimating.value) return
  isAnimating.value = true
  currentIndex.value = (currentIndex.value + direction + total.value) % total.value
  setTimeout(() => {
    isAnimating.value = false
  }, 500)
}

function onCardClick(index: number) {
  if (shouldIgnoreNextClick.value) {
    shouldIgnoreNextClick.value = false
    return
  }
  if (index === currentIndex.value) {
    router.push(`/g/${props.items[index].pgc}`)
  } else {
    currentIndex.value = index
  }
}

/** Prevents page scroll when user is swiping horizontally. */
function onTouchMove(e: TouchEvent) {
  if (e.touches.length !== 1) return
  const dx = Math.abs(e.touches[0].screenX - touchStartX.value)
  const dy = Math.abs(e.touches[0].screenY - touchStartY.value)
  if (dx > dy && dx > 10) e.preventDefault()
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'ArrowLeft') {
    e.preventDefault()
    navigate(-1)
  } else if (e.key === 'ArrowRight') {
    e.preventDefault()
    navigate(1)
  } else if (e.key === 'Enter' && total.value > 0) {
    e.preventDefault()
    onCardClick(currentIndex.value)
  }
}

function onTouchStart(e: TouchEvent) {
  const t = e.changedTouches[0]
  touchStartX.value = t.screenX
  touchStartY.value = t.screenY
}

function onTouchEnd(e: TouchEvent) {
  touchEndX.value = e.changedTouches[0].screenX
  const diff = touchStartX.value - touchEndX.value
  if (Math.abs(diff) > 50) {
    shouldIgnoreNextClick.value = true
    navigate(diff > 0 ? 1 : -1)
  }
}

function onMouseDown(e: MouseEvent) {
  isDragging.value = true
  dragStartX.value = e.clientX
}

function onMouseMove(e: MouseEvent) {
  if (isDragging.value || !containerRef.value) return
  const rect = containerRef.value.getBoundingClientRect()
  lastParallaxX = e.clientX - rect.left
  lastParallaxY = e.clientY - rect.top
  lastCenterX = rect.width / 2
  lastCenterY = rect.height / 2
  if (parallaxRafId) return
  parallaxRafId = requestAnimationFrame(applyParallaxTransform)
}

function applyParallaxTransform() {
  parallaxRafId = 0
  if (!wrapperRef.value || isDragging.value) return
  const rotateY = ((lastParallaxX - lastCenterX) / lastCenterX) * 5
  const rotateX = -((lastParallaxY - lastCenterY) / lastCenterY) * 5
  wrapperRef.value.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`
}

function onMouseUp(e: MouseEvent) {
  if (!isDragging.value) return
  isDragging.value = false
  const diff = dragStartX.value - e.clientX
  if (Math.abs(diff) > 50) {
    shouldIgnoreNextClick.value = true
    navigate(diff > 0 ? 1 : -1)
  }
}

function onMouseLeave() {
  isDragging.value = false
  if (parallaxRafId) {
    cancelAnimationFrame(parallaxRafId)
    parallaxRafId = 0
  }
  if (wrapperRef.value) wrapperRef.value.style.transform = ''
}
</script>

<style scoped>
.carousel-container {
  perspective: 1400px;
  width: 100%;
  height: 520px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  outline: none;
  touch-action: pan-y;
  cursor: grab;
  user-select: none;
  -webkit-user-select: none;
}

.carousel-container:active {
  cursor: grabbing;
}

.carousel-container:focus-visible {
  outline: 2px solid rgba(34, 211, 238, 0.5);
  outline-offset: 4px;
}

.carousel-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  will-change: transform;
}

.galaxy-card {
  position: absolute;
  width: 320px;
  height: 440px;
  left: 50%;
  top: 50%;
  margin-left: -160px;
  margin-top: -220px;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: saturate(180%) blur(20px);
  -webkit-backdrop-filter: saturate(180%) blur(20px);
  border-radius: 0.5rem;
  border: 1px solid rgba(255, 255, 255, 0.15);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  transform-style: preserve-3d;
  cursor: pointer;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  text-decoration: none;
  color: inherit;
}

.galaxy-card.no-image {
  background: linear-gradient(135deg, rgba(30, 30, 50, 0.9) 0%, rgba(10, 10, 30, 0.9) 100%);
}

.galaxy-card-overlay {
  flex-shrink: 0;
  padding: 1rem;
  background: rgba(0, 0, 0, 0.7);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.galaxy-card-name {
  font-size: 1rem;
  font-weight: 600;
  color: #fff;
  margin-bottom: 0.35rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.galaxy-card-meta {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.7);
}

.galaxy-card-type {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.5);
  margin-top: 0.25rem;
}

.galaxy-card-image {
  width: 100%;
  flex: 1;
  min-height: 0;
  object-fit: cover;
  pointer-events: none;
}

.galaxy-card.active {
  z-index: 10;
  opacity: 1;
  transform: translateX(0) rotateY(0deg) scale(1) translateZ(0);
}

.galaxy-card.active:hover {
  transform: translateX(0) rotateY(0deg) scale(1.03) translateZ(20px);
  border-color: rgba(34, 211, 238, 0.5);
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.6);
}

.galaxy-card.left-1 {
  z-index: 8;
  opacity: 1;
  transform: translateX(-220px) rotateY(40deg) scale(0.9) translateZ(-120px);
}

.galaxy-card.left-2 {
  z-index: 6;
  opacity: 1;
  transform: translateX(-360px) rotateY(50deg) scale(0.75) translateZ(-220px);
}

.galaxy-card.left-3 {
  z-index: 4;
  opacity: 1;
  transform: translateX(-460px) rotateY(60deg) scale(0.65) translateZ(-320px);
}

.galaxy-card.right-1 {
  z-index: 8;
  opacity: 1;
  transform: translateX(220px) rotateY(-40deg) scale(0.9) translateZ(-120px);
}

.galaxy-card.right-2 {
  z-index: 6;
  opacity: 1;
  transform: translateX(360px) rotateY(-50deg) scale(0.75) translateZ(-220px);
}

.galaxy-card.right-3 {
  z-index: 4;
  opacity: 1;
  transform: translateX(460px) rotateY(-60deg) scale(0.65) translateZ(-320px);
}

.galaxy-card.hidden {
  opacity: 0;
  pointer-events: none;
  transform: translateX(0) rotateY(0deg) scale(0.5) translateZ(-500px);
}

.carousel-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 100;
  width: 48px;
  height: 48px;
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #fff;
  font-size: 1.5rem;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.carousel-nav:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(34, 211, 238, 0.5);
}

.carousel-nav-icon {
  display: block;
  line-height: 0;
  transform: translateY(-0.08em);
}

.carousel-nav-left {
  left: 1rem;
}

.carousel-nav-right {
  right: 1rem;
}

@media (max-width: 768px) {
  .carousel-container {
    height: 420px;
    perspective: 1000px;
  }

  .galaxy-card {
    width: 260px;
    height: 360px;
    margin-left: -130px;
    margin-top: -180px;
  }

  .galaxy-card.left-1 {
    transform: translateX(-160px) rotateY(35deg) scale(0.85) translateZ(-80px);
  }

  .galaxy-card.right-1 {
    transform: translateX(160px) rotateY(-35deg) scale(0.85) translateZ(-80px);
  }

  .galaxy-card.left-2,
  .galaxy-card.left-3,
  .galaxy-card.right-2,
  .galaxy-card.right-3 {
    display: none;
  }

  .carousel-nav {
    display: none;
  }
}
</style>
