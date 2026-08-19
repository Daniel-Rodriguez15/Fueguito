import {
  EMPTY_NIGHT_LOG,
  activeDaysInMonth,
  logActivity,
  previousDay,
  streakInfo,
} from './night-log'

describe('logActivity', () => {
  it('records a game once per day', () => {
    let state = logActivity(EMPTY_NIGHT_LOG, '2026-08-18', 'dice')
    state = logActivity(state, '2026-08-18', 'dice')
    state = logActivity(state, '2026-08-18', 'bottle')

    expect(state.entries['2026-08-18']).toEqual(['dice', 'bottle'])
  })

  it('does not mutate previous state', () => {
    const state = logActivity(EMPTY_NIGHT_LOG, '2026-08-18', 'dice')
    expect(EMPTY_NIGHT_LOG.entries).toEqual({})
    expect(state.entries['2026-08-18']).toEqual(['dice'])
  })
})

describe('previousDay', () => {
  it('handles month and year boundaries', () => {
    expect(previousDay('2026-08-18')).toBe('2026-08-17')
    expect(previousDay('2026-08-01')).toBe('2026-07-31')
    expect(previousDay('2026-01-01')).toBe('2025-12-31')
    expect(previousDay('2024-03-01')).toBe('2024-02-29')
  })
})

describe('streakInfo', () => {
  it('counts consecutive days ending today', () => {
    let state = EMPTY_NIGHT_LOG
    for (const date of ['2026-08-16', '2026-08-17', '2026-08-18']) {
      state = logActivity(state, date, 'dice')
    }
    expect(streakInfo(state, '2026-08-18')).toEqual({ length: 3, atRisk: false })
  })

  it('stays alive when today has no activity yet', () => {
    let state = logActivity(EMPTY_NIGHT_LOG, '2026-08-16', 'dice')
    state = logActivity(state, '2026-08-17', 'dice')
    expect(streakInfo(state, '2026-08-18')).toEqual({ length: 2, atRisk: false })
  })

  it('forgives one missed day and marks the streak at risk', () => {
    let state = logActivity(EMPTY_NIGHT_LOG, '2026-08-15', 'dice')
    state = logActivity(state, '2026-08-16', 'dice')
    // Nothing on the 17th; on the 18th the streak survives but is at risk.
    expect(streakInfo(state, '2026-08-18')).toEqual({ length: 2, atRisk: true })
  })

  it('recovers the streak when they play after the missed day', () => {
    let state = logActivity(EMPTY_NIGHT_LOG, '2026-08-15', 'dice')
    state = logActivity(state, '2026-08-16', 'dice')
    state = logActivity(state, '2026-08-18', 'dice')
    expect(streakInfo(state, '2026-08-18')).toEqual({ length: 3, atRisk: false })
  })

  it('dies after two missed days', () => {
    let state = logActivity(EMPTY_NIGHT_LOG, '2026-08-14', 'dice')
    state = logActivity(state, '2026-08-15', 'dice')
    expect(streakInfo(state, '2026-08-18')).toEqual({ length: 0, atRisk: false })
  })

  it('is zero with no history', () => {
    expect(streakInfo(EMPTY_NIGHT_LOG, '2026-08-18')).toEqual({ length: 0, atRisk: false })
  })
})

describe('activeDaysInMonth', () => {
  it('returns sorted days of the requested month only', () => {
    let state = logActivity(EMPTY_NIGHT_LOG, '2026-08-18', 'dice')
    state = logActivity(state, '2026-08-02', 'bottle')
    state = logActivity(state, '2026-07-30', 'dice')
    expect(activeDaysInMonth(state, '2026-08')).toEqual(['2026-08-02', '2026-08-18'])
  })
})
