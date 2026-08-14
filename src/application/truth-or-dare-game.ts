import type { PromptRepository } from '@/domain/prompt-repository'
import type { RandomSource } from '@/domain/random'
import { createPromptDeck, type Prompt, type PromptKind } from '@/domain/truth-or-dare'

export interface TruthOrDareGame {
  draw(kind: PromptKind): Prompt
}

/** Use case: play truth-or-dare drawing from the repository's prompts without repeats. */
export function createTruthOrDareGame(
  repository: PromptRepository,
  random: RandomSource,
): TruthOrDareGame {
  const deck = createPromptDeck(repository.getPrompts(), random)
  return {
    draw: (kind) => deck.draw(kind),
  }
}
