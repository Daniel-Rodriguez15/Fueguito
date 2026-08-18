import { createPromptDeck, type Prompt } from './truth-or-dare'

const PROMPTS: Prompt[] = [
  { kind: 'truth', level: 'soft', text: 'truth-soft-a' },
  { kind: 'truth', level: 'soft', text: 'truth-soft-b' },
  { kind: 'truth', level: 'soft', text: 'truth-soft-c' },
  { kind: 'truth', level: 'fire', text: 'truth-fire-a' },
  { kind: 'dare', level: 'soft', text: 'dare-soft-a' },
  { kind: 'dare', level: 'soft', text: 'dare-soft-b' },
]

describe('createPromptDeck', () => {
  it('deals every prompt of a kind and level once before repeating', () => {
    const deck = createPromptDeck(PROMPTS, Math.random)

    const dealt = [
      deck.draw('truth', 'soft').text,
      deck.draw('truth', 'soft').text,
      deck.draw('truth', 'soft').text,
    ]

    expect(dealt.sort()).toEqual(['truth-soft-a', 'truth-soft-b', 'truth-soft-c'])
  })

  it('reshuffles and keeps dealing after the pile is exhausted', () => {
    const deck = createPromptDeck(PROMPTS, Math.random)
    deck.draw('dare', 'soft')
    deck.draw('dare', 'soft')

    const afterRefill = deck.draw('dare', 'soft')

    expect(['dare-soft-a', 'dare-soft-b']).toContain(afterRefill.text)
  })

  it('only deals prompts of the requested kind and level', () => {
    const deck = createPromptDeck(PROMPTS, Math.random)

    for (let i = 0; i < 10; i++) {
      const prompt = deck.draw('truth', 'soft')
      expect(prompt.kind).toBe('truth')
      expect(prompt.level).toBe('soft')
    }
  })

  it('throws when there are no prompts for the requested kind and level', () => {
    const deck = createPromptDeck(PROMPTS, Math.random)

    expect(() => deck.draw('dare', 'fire')).toThrow('No prompts available')
  })
})
