/**
 * Auto STF (Stretch Transfer Function) image processing.
 * Loads an image, applies PixInsight-style AutoSTF stretch, returns ImageData.
 * @module lib/image/autoStf
 */

import { applyAutoStf } from '@/lib/math'

/**
 * Load an image URL into an offscreen canvas, apply Auto STF, and return the stretched ImageData.
 *
 * @param url - Image URL (must support CORS for canvas access)
 * @returns Stretched ImageData
 */
export async function stretchImage(url: string): Promise<ImageData> {
  const img = new Image()
  img.crossOrigin = 'anonymous'
  img.src = url
  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve()
    img.onerror = () => reject(new Error('Failed to load image'))
  })

  const offscreen = document.createElement('canvas')
  offscreen.width = img.naturalWidth
  offscreen.height = img.naturalHeight
  const ctx = offscreen.getContext('2d')!
  ctx.drawImage(img, 0, 0)

  const imageData = ctx.getImageData(0, 0, offscreen.width, offscreen.height)
  applyAutoStf(imageData)
  return imageData
}
