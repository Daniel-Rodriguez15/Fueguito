import { spinBottle, MIN_BOTTLE_PLAYERS } from './bottle'

describe('spinBottle', () => {
  it('picks an index within the player range', () => {
    for (let i = 0; i < 50; i++) {
      const { targetIndex } = spinBottle(4, Math.random)
      expect(targetIndex).toBeGreaterThanOrEqual(0)
      expect(targetIndex).toBeLessThan(4)
      expect(Number.isInteger(targetIndex)).toBe(true)
    }
  })

  it('maps the random value onto the target index', () => {
    expect(spinBottle(4, () => 0).targetIndex).toBe(0)
    expect(spinBottle(4, () => 0.999).targetIndex).toBe(3)
  })

  it('rejects fewer players than the minimum', () => {
    expect(() => spinBottle(MIN_BOTTLE_PLAYERS - 1, Math.random)).toThrow('at least')
  })
})
