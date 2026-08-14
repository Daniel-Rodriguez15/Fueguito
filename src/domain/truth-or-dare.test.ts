import { createPromptDeck, type Prompt } from './truth-or-dare'

const PROMPTS: Prompt[] = [
  { kind: 'truth', text: 'truth-a' },
  { kind: 'truth', text: 'truth-b' },
  { kind: 'truth', text: 'truth-c' },
  { kind: 'dare', text: 'dare-a' },
  { kind: 'dare', text: 'dare-b' },
]

describe('createPromptDeck', () => {
  it('deals every prompt of a kind once before repeating', () => {
    const deck = createPromptDeck(PROMPTS, Math.random)

    const dealt = [deck.draw('truth').text, deck.draw('truth').text, deck.draw('truth').text]

    expect(dealt.sort()).toEqual(['truth-a', 'truth-b', 'truth-c'])
  })

  it('reshuffles and keeps dealing after the pile is exhausted', () => {
    const deck = createPromptDeck(PROMPTS, Math.random)
    deck.draw('dare')
    deck.draw('dare')

    const afterRefill = deck.draw('dare')

    expect(['dare-a', 'dare-b']).toContain(afterRefill.text)
  })

  it('only deals prompts of the requested kind', () => {
    const deck = createPromptDeck(PROMPTS, Math.random)

    for (let i = 0; i < 10; i++) {
      expect(deck.draw('dare').kind).toBe('dare')
    }
  })

  it('throws when there are no prompts of the requested kind', () => {
    const deck = createPromptDeck([{ kind: 'truth', text: 'truth-a' }], Math.random)

    expect(() => deck.draw('dare')).toThrow('No prompts available')
  })
})
