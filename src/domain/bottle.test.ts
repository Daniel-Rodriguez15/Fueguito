import { spinBottle, MIN_BOTTLE_PLAYERS } from './bottle'

describe('spinBottle', () => {
  it('picks a tip index within the player range', () => {
    for (let i = 0; i < 50; i++) {
      const { tipIndex } = spinBottle(4, Math.random)
      expect(tipIndex).toBeGreaterThanOrEqual(0)
      expect(tipIndex).toBeLessThan(4)
      expect(Number.isInteger(tipIndex)).toBe(true)
    }
  })

  it('maps the random value onto the tip index', () => {
    expect(spinBottle(4, () => 0).tipIndex).toBe(0)
    expect(spinBottle(4, () => 0.999).tipIndex).toBe(3)
  })

  it('pairs the tip with the player across the circle', () => {
    expect(spinBottle(4, () => 0)).toEqual({ tipIndex: 0, baseIndex: 2 })
    expect(spinBottle(4, () => 0.999)).toEqual({ tipIndex: 3, baseIndex: 1 })
    expect(spinBottle(2, () => 0)).toEqual({ tipIndex: 0, baseIndex: 1 })
  })

  it('takes the nearest player when the base lands between two (odd count)', () => {
    const { tipIndex, baseIndex } = spinBottle(5, () => 0)
    expect(tipIndex).toBe(0)
    expect(baseIndex).toBe(3)
    expect(baseIndex).not.toBe(tipIndex)
  })

  it('never pairs a player with themselves', () => {
    for (let players = 2; players <= 8; players++) {
      for (let i = 0; i < 30; i++) {
        const { tipIndex, baseIndex } = spinBottle(players, Math.random)
        expect(baseIndex).not.toBe(tipIndex)
      }
    }
  })

  it('rejects fewer players than the minimum', () => {
    expect(() => spinBottle(MIN_BOTTLE_PLAYERS - 1, Math.random)).toThrow('at least')
  })
})
