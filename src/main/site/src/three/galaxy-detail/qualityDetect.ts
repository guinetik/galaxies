/**
 * Detects device quality tier for GPU-load decisions at startup.
 * Uses navigator.maxTouchPoints which is reliable for Z Fold and
 * other Android foldables without user-agent sniffing.
 */
export type Quality = 'mobile' | 'desktop'

export function detectQuality(): Quality {
  return navigator.maxTouchPoints > 1 ? 'mobile' : 'desktop'
}

/** DPR cap per quality tier. Reduces fragment count on high-DPR displays. */
export function dprCap(quality: Quality): number {
  if (quality === 'mobile') return 1.5
  // At 4K+, native resolution is already sharp — supersampling wastes GPU.
  // physical pixels = CSS width × DPR
  const physicalW = typeof window !== 'undefined'
    ? window.screen.width * window.devicePixelRatio
    : 1920
  if (physicalW > 4500) return 1.0 // 5K+ — cap hard at native
  if (physicalW > 3000) return 1.0 // 4K  — no supersampling needed
  return 2.0 // 1080p/1440p — allow retina
}

/** Render-target resolution scale. Reduces expensive passes on high-res displays. */
export function rtScale(quality: Quality): number {
  if (quality === 'mobile') return 0.5
  // At 4K+ (screen width > 3000 CSS px with DPR ≥ 1.5), render post-FX at 75%
  const w = typeof window !== 'undefined' ? window.screen.width * window.devicePixelRatio : 1920
  if (w > 4500) return 0.5  // 5K+
  if (w > 3000) return 0.75 // 4K
  return 1.0
}
