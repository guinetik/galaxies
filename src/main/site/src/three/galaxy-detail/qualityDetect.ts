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
  return quality === 'mobile' ? 1.5 : 2.0
}

/** Render-target resolution scale. Mobile renders to a half-res RT then upscales via bilinear. */
export function rtScale(quality: Quality): number {
  return quality === 'mobile' ? 0.5 : 1.0
}
