/**
 * CSS filter presets for image display (e.g. lightbox).
 * @module lib/image/filterPresets
 */

export interface FilterPreset {
  label: string
  value: string
}

/** Presets for CSS filter property (e.g. lightbox display). */
export const filterPresets: FilterPreset[] = [
  { label: 'Normal', value: 'none' },
  { label: 'Negative', value: 'invert(1)' },
  { label: 'Cyanotype', value: 'sepia(1) hue-rotate(180deg) saturate(1.5)' },
  { label: 'Amber', value: 'sepia(1) saturate(1.5)' },
  { label: 'Hard', value: 'contrast(1.5) brightness(0.9)' },
]
