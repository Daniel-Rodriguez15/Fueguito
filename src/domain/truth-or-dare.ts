import type { RandomSource } from './random'
import { shuffle } from './random'

export type PromptKind = 'truth' | 'dare'

export interface Prompt {
  readonly kind: PromptKind
  readonly text: string
}

export interface PromptDeck {
  draw(kind: PromptKind): Prompt
}

/**
 * Deck that deals every prompt of a kind exactly once before reshuffling,
 * so players never see a repeat until the pile is exhausted.
 */
export function createPromptDeck(prompts: readonly Prompt[], random: RandomSource): PromptDeck {
  const piles: Record<PromptKind, Prompt[]> = { truth: [], dare: [] }

  function refill(kind: PromptKind): void {
    piles[kind] = shuffle(
      prompts.filter((prompt) => prompt.kind === kind),
      random,
    )
  }

  return {
    draw(kind: PromptKind): Prompt {
      if (piles[kind].length === 0) {
        refill(kind)
      }
      const prompt = piles[kind].pop()
      if (!prompt) {
        throw new Error(`No prompts available for kind "${kind}"`)
      }
      return prompt
    },
  }
}
