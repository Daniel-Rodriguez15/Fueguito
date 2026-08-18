import type { RandomSource } from './random'
import { randomIndex } from './random'

export const DICE_ACTIONS: readonly string[] = [
  'Besa',
  'Lame',
  'Muerde suave',
  'Masajea',
  'Acaricia',
  'Sopla',
] as const

export const DICE_ZONES: readonly string[] = [
  'el cuello',
  'la oreja',
  'los labios',
  'la espalda',
  'el abdomen',
  'los muslos',
] as const

export interface ActionZoneRoll {
  readonly actionIndex: number
  readonly zoneIndex: number
  readonly action: string
  readonly zone: string
}

/** Classic couples dice: one die says what to do, the other one where. */
export function rollActionZone(random: RandomSource): ActionZoneRoll {
  const actionIndex = randomIndex(DICE_ACTIONS.length, random)
  const zoneIndex = randomIndex(DICE_ZONES.length, random)
  return {
    actionIndex,
    zoneIndex,
    action: DICE_ACTIONS[actionIndex],
    zone: DICE_ZONES[zoneIndex],
  }
}
