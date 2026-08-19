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

export interface StreakInfo {
  /** Consecutive active days, forgiving at most one missed day. */
  readonly length: number
  /** True when the streak dies unless they play today (grace day in use). */
  readonly atRisk: boolean
}

/**
 * Streak with one grace day: a single missed day does not kill the streak,
 * but a second one does. Today never consumes the grace (it is not over yet).
 */
export function streakInfo(state: NightLogState, today: string): StreakInfo {
  const active = (date: string) => date in state.entries
  let cursor = today
  if (!active(cursor)) {
    cursor = previousDay(cursor)
  }
  let length = 0
  let graceUsed = false
  while (true) {
    if (active(cursor)) {
      length += 1
      cursor = previousDay(cursor)
    } else if (!graceUsed) {
      graceUsed = true
      cursor = previousDay(cursor)
    } else {
      break
    }
  }
  const atRisk = length > 0 && !active(today) && !active(previousDay(today))
  return { length, atRisk }
}

export function activeDaysInMonth(state: NightLogState, yearMonth: string): readonly string[] {
  return Object.keys(state.entries)
    .filter((date) => date.startsWith(yearMonth))
    .sort()
}
