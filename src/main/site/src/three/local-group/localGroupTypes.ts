// src/three/local-group/localGroupTypes.ts

export interface LocalGroupVector3 {
  x: number
  y: number
  z: number
}

export interface LocalGroupCoordinates {
  sgx: number
  sgy: number
  sgz: number
}

export interface LocalGroupLandmark {
  id: string
  label: string
  description: string
  coordinates: LocalGroupCoordinates
  accent: string
  groupPgc?: number
}

export interface LocalGroupLayerVisibility {
  shells: boolean
  rings: boolean
  labels: boolean
}

export interface LocalGroupPointHit {
  pgc: number
  velocity: number
  distance: number
}
