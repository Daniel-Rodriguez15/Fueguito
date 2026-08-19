/** Activity log: which games were played on which date (YYYY-MM-DD, local). */
export interface NightLogState {
  readonly entries: Readonly<Record<string, readonly string[]>>
}

export const EMPTY_NIGHT_LOG: NightLogState = { entries: {} }

/** Records a game played on a date; a game appears at most once per day. */
export function logActivity(state: NightLogState, date: string, game: string): NightLogState {
  const games = state.entries[date] ?? []
  if (games.includes(game)) {
    return state
  }
  return { entries: { ...state.entries, [date]: [...games, game] } }
}

export function previousDay(date: string): string {
  const [year, month, day] = date.split('-').map(Number)
  const time = new Date(Date.UTC(year, month - 1, day))
  time.setUTCDate(time.getUTCDate() - 1)
  return time.toISOString().slice(0, 10)
}

/**
 * Consecutive days with activity ending today. A streak survives if the last
 * activity was yesterday (today just has not happened yet).
 */
export function currentStreak(state: NightLogState, today: string): number {
  let cursor = today in state.entries ? today : previousDay(today)
  let streak = 0
  while (cursor in state.entries) {
    streak += 1
    cursor = previousDay(cursor)
  }
  return streak
}

export function activeDaysInMonth(state: NightLogState, yearMonth: string): readonly string[] {
  return Object.keys(state.entries)
    .filter((date) => date.startsWith(yearMonth))
    .sort()
}
