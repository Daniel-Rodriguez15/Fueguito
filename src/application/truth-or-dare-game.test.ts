import type { PromptRepository } from '@/domain/prompt-repository'
import { createTruthOrDareGame } from './truth-or-dare-game'

const repository: PromptRepository = {
  getPrompts: () => [
    { kind: 'truth', text: 'truth-a' },
    { kind: 'dare', text: 'dare-a' },
  ],
}

describe('createTruthOrDareGame', () => {
  it('draws prompts of the requested kind from the repository', () => {
    const game = createTruthOrDareGame(repository, Math.random)

    expect(game.draw('truth')).toEqual({ kind: 'truth', text: 'truth-a' })
    expect(game.draw('dare')).toEqual({ kind: 'dare', text: 'dare-a' })
  })
})
