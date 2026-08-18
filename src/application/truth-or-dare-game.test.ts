import type { PromptRepository } from '@/domain/prompt-repository'
import { createTruthOrDareGame } from './truth-or-dare-game'

const repository: PromptRepository = {
  getPrompts: () => [
    { kind: 'truth', level: 'soft', text: 'truth-a' },
    { kind: 'dare', level: 'fire', text: 'dare-a' },
  ],
}

describe('createTruthOrDareGame', () => {
  it('draws prompts of the requested kind and level from the repository', () => {
    const game = createTruthOrDareGame(repository, Math.random)

    expect(game.draw('truth', 'soft')).toEqual({ kind: 'truth', level: 'soft', text: 'truth-a' })
    expect(game.draw('dare', 'fire')).toEqual({ kind: 'dare', level: 'fire', text: 'dare-a' })
  })
})
