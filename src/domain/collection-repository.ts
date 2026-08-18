import type { CollectionState } from './pose-collection'

/** Port: where the pose collection is persisted. Implemented per platform. */
export interface CollectionRepository {
  load(): Promise<CollectionState>
  save(state: CollectionState): Promise<void>
}
