import type { RandomSource } from './random'
import { shuffle } from './random'

export type PromptKind = 'truth' | 'dare'
export type IntensityLevel = 'soft' | 'spicy' | 'fire'

export const INTENSITY_LEVELS: readonly IntensityLevel[] = ['soft', 'spicy', 'fire']

export interface Prompt {
  readonly kind: PromptKind
  readonly level: IntensityLevel
  readonly text: string
}

export interface PromptDeck {
  draw(kind: PromptKind, level: IntensityLevel): Prompt
}

type PileKey = `${PromptKind}:${IntensityLevel}`

/**
 * Deck that deals every prompt of a kind and level exactly once before
 * reshuffling, so players never see a repeat until the pile is exhausted.
 */
export function createPromptDeck(prompts: readonly Prompt[], random: RandomSource): PromptDeck {
  const piles = new Map<PileKey, Prompt[]>()

  function refill(kind: PromptKind, level: IntensityLevel): Prompt[] {
    const pile = shuffle(
      prompts.filter((prompt) => prompt.kind === kind && prompt.level === level),
      random,
    )
    piles.set(`${kind}:${level}`, pile)
    return pile
  }

  return {
    draw(kind: PromptKind, level: IntensityLevel): Prompt {
      let pile = piles.get(`${kind}:${level}`)
      if (!pile || pile.length === 0) {
        pile = refill(kind, level)
      }
      const prompt = pile.pop()
      if (!prompt) {
        throw new Error(`No prompts available for kind "${kind}" and level "${level}"`)
      }
      return prompt
    },
  }
}
