import type { RandomSource } from './random'

export const DIE_SIDES = 6

export function rollDice(count: number, random: RandomSource): number[] {
  if (count < 1) {
    throw new Error('At least one die is required')
  }
  return Array.from({ length: count }, () => 1 + Math.floor(random() * DIE_SIDES))
}
