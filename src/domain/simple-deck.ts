import type { RandomSource } from './random'
import { shuffle } from './random'

export interface Deck<T> {
  draw(): T
}

/**
 * Deals every item once before reshuffling. When reshuffling, the first item
 * of the new pile never repeats the last card dealt (if there is a choice).
 */
export function createShuffledDeck<T>(items: readonly T[], random: RandomSource): Deck<T> {
  if (items.length === 0) {
    throw new Error('A deck needs at least one item')
  }
  let pile: T[] = shuffle(items, random)
  let last: T | undefined

  return {
    draw(): T {
      if (pile.length === 0) {
        pile = shuffle(items, random)
        if (items.length > 1 && pile[pile.length - 1] === last) {
          const swap = pile[pile.length - 1]
          pile[pile.length - 1] = pile[0]
          pile[0] = swap
        }
      }
      last = pile.pop() as T
      return last
    },
  }
}
