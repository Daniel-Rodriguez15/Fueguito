import { DICE_ACTIONS, DICE_ZONES, rollActionZone } from './sex-dice'

describe('rollActionZone', () => {
  it('returns an action and a zone from the known faces', () => {
    const roll = rollActionZone(Math.random)

    expect(DICE_ACTIONS).toContain(roll.action)
    expect(DICE_ZONES).toContain(roll.zone)
    expect(DICE_ACTIONS[roll.actionIndex]).toBe(roll.action)
    expect(DICE_ZONES[roll.zoneIndex]).toBe(roll.zone)
  })

  it('is deterministic given a fixed random source', () => {
    const roll = rollActionZone(() => 0)

    expect(roll.action).toBe(DICE_ACTIONS[0])
    expect(roll.zone).toBe(DICE_ZONES[0])
  })
})
