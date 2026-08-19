import { createShuffledDeck } from './simple-deck'

describe('createShuffledDeck', () => {
  it('deals every item once before repeating', () => {
    const deck = createShuffledDeck(['a', 'b', 'c'], Math.random)
    const dealt = [deck.draw(), deck.draw(), deck.draw()]
    expect(dealt.sort()).toEqual(['a', 'b', 'c'])
  })

  it('never repeats the last card across a reshuffle', () => {
    const deck = createShuffledDeck(['a', 'b', 'c'], Math.random)
    for (let i = 0; i < 30; i++) {
      const previous = deck.draw()
      const next = deck.draw()
      expect(next).not.toBe(previous)
    }
  })

  it('rejects an empty deck', () => {
    expect(() => createShuffledDeck([], Math.random)).toThrow('at least one item')
  })
})
