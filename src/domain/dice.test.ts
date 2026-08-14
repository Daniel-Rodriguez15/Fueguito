import { rollDice, DIE_SIDES } from './dice'

describe('rollDice', () => {
  it('returns one value per die, each within 1 and the number of sides', () => {
    for (let i = 0; i < 50; i++) {
      const values = rollDice(2, Math.random)
      expect(values).toHaveLength(2)
      for (const value of values) {
        expect(value).toBeGreaterThanOrEqual(1)
        expect(value).toBeLessThanOrEqual(DIE_SIDES)
        expect(Number.isInteger(value)).toBe(true)
      }
    }
  })

  it('maps the random extremes onto the lowest and highest faces', () => {
    expect(rollDice(1, () => 0)).toEqual([1])
    expect(rollDice(1, () => 0.999)).toEqual([DIE_SIDES])
  })

  it('rejects rolling zero dice', () => {
    expect(() => rollDice(0, Math.random)).toThrow('At least one die')
  })
})
