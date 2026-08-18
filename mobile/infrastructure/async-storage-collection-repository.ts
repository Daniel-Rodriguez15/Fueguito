import AsyncStorage from '@react-native-async-storage/async-storage'
import type { CollectionRepository } from '@/domain/collection-repository'
import { EMPTY_COLLECTION, type CollectionState } from '@/domain/pose-collection'

const STORAGE_KEY = 'fueguito:pose-collection:v1'

function isValidState(value: unknown): value is CollectionState {
  return (
    typeof value === 'object' &&
    value !== null &&
    'entries' in value &&
    typeof (value as CollectionState).entries === 'object' &&
    (value as CollectionState).entries !== null
  )
}

export function createAsyncStorageCollectionRepository(): CollectionRepository {
  return {
    async load() {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY)
        if (raw === null) {
          return EMPTY_COLLECTION
        }
        const parsed: unknown = JSON.parse(raw)
        return isValidState(parsed) ? parsed : EMPTY_COLLECTION
      } catch {
        return EMPTY_COLLECTION
      }
    },

    async save(state) {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    },
  }
}
