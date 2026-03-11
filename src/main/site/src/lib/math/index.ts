/**
 * Math utilities: transfer functions, statistics, interpolation.
 * @module lib/math
 */

export { mtf, computeStfParams, applyAutoStf } from './transfer'
export { medianFromHistogram } from './statistics'
export { clamp, easeInOutCubic, easeOutCubic, mpcToPercent, seededRandom } from './interpolation'
