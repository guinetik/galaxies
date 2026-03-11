import { describe, it, expect } from 'vitest'
import { formatRA, formatDec, arcsecToDeg } from '../coordinates'

describe('formatRA', () => {
  it('formats 0° as 00h 00m 00.0s', () => {
    expect(formatRA(0)).toBe('00h 00m 00.0s')
  })

  it('formats 15° as 01h 00m 00.0s', () => {
    expect(formatRA(15)).toBe('01h 00m 00.0s')
  })

  it('formats 180° as 12h 00m 00.0s', () => {
    expect(formatRA(180)).toBe('12h 00m 00.0s')
  })

  it('formats fractional RA correctly', () => {
    const s = formatRA(187.706) // M87
    expect(s).toMatch(/^\d{2}h \d{2}m \d+\.\d+s$/)
  })
})

describe('formatDec', () => {
  it('formats 0° as +00°00\'00.0"', () => {
    expect(formatDec(0)).toMatch(/^\+00°00'/)
  })

  it('formats positive dec', () => {
    const s = formatDec(41.269) // M31
    expect(s).toMatch(/^\+41°/)
  })

  it('formats negative dec with minus sign', () => {
    const s = formatDec(-5.391) // M42
    expect(s).toMatch(/^−/)
    expect(s).toContain('°')
  })
})

describe('arcsecToDeg', () => {
  it('converts 3600 arcsec to 1 degree', () => {
    expect(arcsecToDeg(3600)).toBe(1)
  })

  it('converts 30 arcsec to 1/120 degree', () => {
    expect(arcsecToDeg(30)).toBeCloseTo(30 / 3600, 10)
  })
})
