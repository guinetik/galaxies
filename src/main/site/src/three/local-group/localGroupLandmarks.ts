import { LOCAL_GROUP_SCENE_UNITS_PER_MPC } from './localGroupProjection'
import type { LocalGroupLandmark } from './localGroupTypes'

const M31_PGC = 2557

/**
 * Narrative landmark presets for the Local Group waypoint rail and focus actions.
 */
export const LOCAL_GROUP_LANDMARKS: LocalGroupLandmark[] = [
  {
    id: 'milky-way',
    label: 'Milky Way',
    description: 'Our home frame at the center of the projected local map.',
    coordinates: { sgx: 0, sgy: 0, sgz: 0 },
    accent: '#8fe9ff',
  },
  {
    id: 'andromeda',
    label: 'Andromeda (M31)',
    description: 'The nearest giant spiral and gravitational partner of the Milky Way.',
    coordinates: { sgx: 0.8 * LOCAL_GROUP_SCENE_UNITS_PER_MPC, sgy: 0, sgz: 0 },
    accent: '#d8f8ff',
    groupPgc: M31_PGC,
  },
  {
    id: 'antlia-sextans',
    label: 'Antlia-Sextans',
    description: 'A nearby subgroup highlighted in the NASA composition language.',
    coordinates: {
      sgx: -1.4 * LOCAL_GROUP_SCENE_UNITS_PER_MPC,
      sgy: 1.1 * LOCAL_GROUP_SCENE_UNITS_PER_MPC,
      sgz: 0.35 * LOCAL_GROUP_SCENE_UNITS_PER_MPC,
    },
    accent: '#4dd3ff',
  },
  {
    id: 'virgo-cluster',
    label: 'Virgo Cluster',
    description: 'The nearest major cluster, used as a wider-scale waypoint in the local universe.',
    coordinates: {
      sgx: -3.1 * LOCAL_GROUP_SCENE_UNITS_PER_MPC,
      sgy: 15.7 * LOCAL_GROUP_SCENE_UNITS_PER_MPC,
      sgz: 0.5 * LOCAL_GROUP_SCENE_UNITS_PER_MPC,
    },
    accent: '#73c7ff',
  },
  {
    id: 'great-attractor',
    label: 'Great Attractor',
    description: 'A distant flow anchor that gives the oblique range frame a dramatic outer target.',
    coordinates: {
      sgx: -60 * LOCAL_GROUP_SCENE_UNITS_PER_MPC,
      sgy: 26 * LOCAL_GROUP_SCENE_UNITS_PER_MPC,
      sgz: 4 * LOCAL_GROUP_SCENE_UNITS_PER_MPC,
    },
    accent: '#00a5ff',
  },
]

/**
 * Returns the ordered landmark ids used by the Local Group waypoint rail.
 */
export function getLocalGroupLandmarkIds(): string[] {
  return LOCAL_GROUP_LANDMARKS.map((landmark) => landmark.id)
}

/**
 * Finds a landmark preset by id.
 */
export function getLocalGroupLandmarkById(id: string): LocalGroupLandmark | undefined {
  return LOCAL_GROUP_LANDMARKS.find((landmark) => landmark.id === id)
}
