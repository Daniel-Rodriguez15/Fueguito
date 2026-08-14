import type { RandomSource } from './random'
import { randomIndex } from './random'

export const MIN_BOTTLE_PLAYERS = 2

export interface BottleSpin {
  /** Index of the player the bottle points at. */
  readonly targetIndex: number
}

export function spinBottle(playerCount: number, random: RandomSource): BottleSpin {
  if (playerCount < MIN_BOTTLE_PLAYERS) {
    throw new Error(`Spinning the bottle needs at least ${MIN_BOTTLE_PLAYERS} players`)
  }
  return { targetIndex: randomIndex(playerCount, random) }
}
