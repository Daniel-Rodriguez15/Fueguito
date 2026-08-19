import type { RandomSource } from './random'
import { randomIndex } from './random'

export const MIN_BOTTLE_PLAYERS = 2

export interface BottleSpin {
  /** Index of the player the bottle tip points at. */
  readonly tipIndex: number
  /** Index of the player closest to where the bottle base points; they kiss the tip player. */
  readonly baseIndex: number
}

export function spinBottle(playerCount: number, random: RandomSource): BottleSpin {
  if (playerCount < MIN_BOTTLE_PLAYERS) {
    throw new Error(`Spinning the bottle needs at least ${MIN_BOTTLE_PLAYERS} players`)
  }
  const tipIndex = randomIndex(playerCount, random)
  // The base points to the opposite side of the circle; with an odd player
  // count that lands between two players, so we take the nearest one.
  const baseIndex = (tipIndex + Math.round(playerCount / 2)) % playerCount
  return { tipIndex, baseIndex }
}
