import {
  EMPTY_NIGHT_LOG,
  activeDaysInMonth,
  currentStreak,
  logActivity,
  previousDay,
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

describe('currentStreak', () => {
  it('counts consecutive days ending today', () => {
    let state = EMPTY_NIGHT_LOG
    for (const date of ['2026-08-16', '2026-08-17', '2026-08-18']) {
      state = logActivity(state, date, 'dice')
    }
    expect(currentStreak(state, '2026-08-18')).toBe(3)
  })

  it('keeps the streak alive when today has no activity yet', () => {
    let state = logActivity(EMPTY_NIGHT_LOG, '2026-08-16', 'dice')
    state = logActivity(state, '2026-08-17', 'dice')
    expect(currentStreak(state, '2026-08-18')).toBe(2)
  })

  it('breaks on a gap', () => {
    let state = logActivity(EMPTY_NIGHT_LOG, '2026-08-14', 'dice')
    state = logActivity(state, '2026-08-17', 'dice')
    expect(currentStreak(state, '2026-08-17')).toBe(1)
    expect(currentStreak(state, '2026-08-19')).toBe(0)
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
