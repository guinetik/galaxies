import { LOCAL_GROUP_SCENE_UNITS_PER_MPC } from './localGroupProjection'
import type { LocalGroupLandmark } from './localGroupTypes'

const M31_PGC = 2557

/**
 * Narrative landmark presets for the Local Group waypoint rail and focus actions.
 * Coordinates are in supergalactic Cartesian (Mpc) × LOCAL_GROUP_SCENE_UNITS_PER_MPC.
 * Range: 0–10 Mpc (~32.6 MLy).
 */
export const LOCAL_GROUP_LANDMARKS: LocalGroupLandmark[] = [
  // === Local Group core (< 1.5 Mpc) ===
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
    description: 'A nearby dwarf galaxy subgroup at the edge of the Local Group.',
    coordinates: {
      sgx: -1.4 * LOCAL_GROUP_SCENE_UNITS_PER_MPC,
      sgy: 1.1 * LOCAL_GROUP_SCENE_UNITS_PER_MPC,
      sgz: 0.35 * LOCAL_GROUP_SCENE_UNITS_PER_MPC,
    },
    accent: '#4dd3ff',
  },

  // === Nearby groups (3–4 Mpc) ===
  {
    id: 'maffei-group',
    label: 'Maffei Group',
    description: 'Hidden behind the Milky Way disk, one of the nearest galaxy groups.',
    coordinates: {
      sgx: -2.8 * LOCAL_GROUP_SCENE_UNITS_PER_MPC,
      sgy: -0.5 * LOCAL_GROUP_SCENE_UNITS_PER_MPC,
      sgz: -0.8 * LOCAL_GROUP_SCENE_UNITS_PER_MPC,
    },
    accent: '#ff9966',
  },
  {
    id: 'ic342-group',
    label: 'IC 342 Group',
    description: 'The "Hidden Galaxy" group, obscured by galactic dust.',
    coordinates: {
      sgx: -3.0 * LOCAL_GROUP_SCENE_UNITS_PER_MPC,
      sgy: 0.3 * LOCAL_GROUP_SCENE_UNITS_PER_MPC,
      sgz: 1.2 * LOCAL_GROUP_SCENE_UNITS_PER_MPC,
    },
    accent: '#ccaa77',
  },
  {
    id: 'sculptor-group',
    label: 'Sculptor Group',
    description: 'Nearest group to the south galactic pole, anchored by NGC 253.',
    coordinates: {
      sgx: 1.2 * LOCAL_GROUP_SCENE_UNITS_PER_MPC,
      sgy: -0.5 * LOCAL_GROUP_SCENE_UNITS_PER_MPC,
      sgz: -3.2 * LOCAL_GROUP_SCENE_UNITS_PER_MPC,
    },
    accent: '#66ccaa',
  },
  {
    id: 'm81-group',
    label: 'M81 Group',
    description: 'Home of Bode\'s Galaxy (M81) and the starburst M82.',
    coordinates: {
      sgx: -2.1 * LOCAL_GROUP_SCENE_UNITS_PER_MPC,
      sgy: 1.7 * LOCAL_GROUP_SCENE_UNITS_PER_MPC,
      sgz: 2.4 * LOCAL_GROUP_SCENE_UNITS_PER_MPC,
    },
    accent: '#77bbff',
  },
  {
    id: 'cena-group',
    label: 'Centaurus A Group',
    description: 'Dominated by the radio galaxy NGC 5128 (Centaurus A).',
    coordinates: {
      sgx: -1.5 * LOCAL_GROUP_SCENE_UNITS_PER_MPC,
      sgy: 2.8 * LOCAL_GROUP_SCENE_UNITS_PER_MPC,
      sgz: -1.9 * LOCAL_GROUP_SCENE_UNITS_PER_MPC,
    },
    accent: '#ff7799',
  },

  // === Further groups (5–10 Mpc) ===
  {
    id: 'm101-group',
    label: 'M101 Group',
    description: 'The Pinwheel Galaxy group, a loose association of spirals.',
    coordinates: {
      sgx: -4.5 * LOCAL_GROUP_SCENE_UNITS_PER_MPC,
      sgy: 1.2 * LOCAL_GROUP_SCENE_UNITS_PER_MPC,
      sgz: 5.0 * LOCAL_GROUP_SCENE_UNITS_PER_MPC,
    },
    accent: '#aabb55',
  },
  {
    id: 'ngc253',
    label: 'NGC 253',
    description: 'The Sculptor Galaxy, a bright starburst spiral visible to the naked eye.',
    coordinates: {
      sgx: 1.0 * LOCAL_GROUP_SCENE_UNITS_PER_MPC,
      sgy: -0.4 * LOCAL_GROUP_SCENE_UNITS_PER_MPC,
      sgz: -3.3 * LOCAL_GROUP_SCENE_UNITS_PER_MPC,
    },
    accent: '#55ddaa',
  },
  {
    id: 'canes-venatici-cloud',
    label: 'Canes Venatici Cloud',
    description: 'A loose cloud of galaxies stretching toward the M94 group.',
    coordinates: {
      sgx: -3.5 * LOCAL_GROUP_SCENE_UNITS_PER_MPC,
      sgy: 3.0 * LOCAL_GROUP_SCENE_UNITS_PER_MPC,
      sgz: 4.5 * LOCAL_GROUP_SCENE_UNITS_PER_MPC,
    },
    accent: '#88aadd',
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
