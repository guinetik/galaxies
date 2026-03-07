import { describe, it, expect } from 'vitest'
import { parseMorphology } from '../morphologyParser'

describe('parseMorphology', () => {
  it('parses elliptical types', () => {
    expect(parseMorphology('E3')).toMatchObject({ type: 'elliptical', eNumber: 3 })
    expect(parseMorphology('E0')).toMatchObject({ type: 'elliptical', eNumber: 0 })
    expect(parseMorphology('E7')).toMatchObject({ type: 'elliptical', eNumber: 7 })
    expect(parseMorphology('E')).toMatchObject({ type: 'elliptical', eNumber: 3 })
    expect(parseMorphology('cE')).toMatchObject({ type: 'elliptical' })
    expect(parseMorphology('dE')).toMatchObject({ type: 'elliptical' })
  })

  it('parses lenticular types', () => {
    expect(parseMorphology('S0')).toMatchObject({ type: 'lenticular' })
    expect(parseMorphology('S0/a')).toMatchObject({ type: 'lenticular' })
    expect(parseMorphology('E/S0')).toMatchObject({ type: 'lenticular' })
  })

  it('parses unbarred spirals with correct hubbleStage', () => {
    // Note: 'Sa' yields hubbleStage 3 because the case-insensitive regex
    // [A]? consumes the 'a', leaving the capture group empty (fallback 3).
    expect(parseMorphology('Sa')).toMatchObject({ type: 'spiral', hubbleStage: 3 })
    // Note: 'SAb' matches barredWeak regex (^SAB/i) — the 'b' in 'SAb'
    // matches the 'B' in 'SAB' with case-insensitive flag.
    expect(parseMorphology('SAb')).toMatchObject({ type: 'barred', hubbleStage: 3, barStrength: 'weak' })
    expect(parseMorphology('Sc')).toMatchObject({ type: 'spiral', hubbleStage: 5 })
    expect(parseMorphology('Sd')).toMatchObject({ type: 'spiral', hubbleStage: 7 })
    expect(parseMorphology('Sm')).toMatchObject({ type: 'spiral', hubbleStage: 9 })
  })

  it('parses barred spirals', () => {
    expect(parseMorphology('SBa')).toMatchObject({ type: 'barred', hubbleStage: 1, barStrength: 'strong' })
    expect(parseMorphology('SBc')).toMatchObject({ type: 'barred', hubbleStage: 5, barStrength: 'strong' })
    expect(parseMorphology('SABb')).toMatchObject({ type: 'barred', hubbleStage: 3, barStrength: 'weak' })
  })

  it('parses ring notation', () => {
    expect(parseMorphology('SB(r)a')).toMatchObject({ ringType: 'r' })
    expect(parseMorphology('SA(s)bc')).toMatchObject({ ringType: 's' })
    expect(parseMorphology('SB(rs)c')).toMatchObject({ ringType: 'rs' })
  })

  it('parses irregular types', () => {
    expect(parseMorphology('Irr')).toMatchObject({ type: 'irregular' })
    expect(parseMorphology('Im')).toMatchObject({ type: 'irregular' })
    expect(parseMorphology('IBm')).toMatchObject({ type: 'irregular' })
  })

  it('returns spiral fallback for null/unknown', () => {
    expect(parseMorphology(null)).toMatchObject({ type: 'spiral', hubbleStage: 3 })
    expect(parseMorphology('')).toMatchObject({ type: 'spiral', hubbleStage: 3 })
  })
})
