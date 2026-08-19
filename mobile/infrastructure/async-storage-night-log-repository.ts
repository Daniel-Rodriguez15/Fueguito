import AsyncStorage from '@react-native-async-storage/async-storage'
import { EMPTY_NIGHT_LOG, type NightLogState } from '@/domain/night-log'
import type { NightLogRepository } from '@/domain/night-log-repository'

const STORAGE_KEY = 'fueguito:night-log:v1'

function isValidState(value: unknown): value is NightLogState {
  return (
    typeof value === 'object' &&
    value !== null &&
    'entries' in value &&
    typeof (value as NightLogState).entries === 'object' &&
    (value as NightLogState).entries !== null
  )
}

export function createAsyncStorageNightLogRepository(): NightLogRepository {
  return {
    async load() {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY)
        if (raw === null) {
          return EMPTY_NIGHT_LOG
        }
        const parsed: unknown = JSON.parse(raw)
        return isValidState(parsed) ? parsed : EMPTY_NIGHT_LOG
      } catch {
        return EMPTY_NIGHT_LOG
      }
    },

    async save(state) {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    },
  }
}
