import type { NightLogState } from './night-log'

/** Port: where the activity log is persisted. Implemented per platform. */
export interface NightLogRepository {
  load(): Promise<NightLogState>
  save(state: NightLogState): Promise<void>
}
