import type { CollectionRepository } from '@/domain/collection-repository'
import type { Pose, PoseCatalog } from '@/domain/pose'
import {
  ratePose,
  unlockRandomPose,
  type CollectionState,
  type PoseRating,
} from '@/domain/pose-collection'
import type { RandomSource } from '@/domain/random'

export interface UnlockedPose {
  readonly state: CollectionState
  readonly pose: Pose
}

/** Use case: manage the scratch-card pose collection with persistence. */
export interface PoseCollectionService {
  load(): Promise<CollectionState>
  unlock(state: CollectionState): Promise<UnlockedPose | null>
  rate(state: CollectionState, poseId: string, rating: PoseRating): Promise<CollectionState>
}

export function createPoseCollectionService(
  repository: CollectionRepository,
  catalog: PoseCatalog,
  random: RandomSource,
): PoseCollectionService {
  const poses = catalog.getPoses()
  const byId = new Map(poses.map((pose) => [pose.id, pose]))

  // Serialize writes so overlapping unlock/rate calls cannot land out of order.
  let writeQueue: Promise<void> = Promise.resolve()
  const enqueueSave = (state: CollectionState): Promise<void> => {
    writeQueue = writeQueue.then(() => repository.save(state))
    return writeQueue
  }

  return {
    load: () => repository.load(),

    async unlock(state) {
      const result = unlockRandomPose(
        state,
        poses.map((pose) => pose.id),
        random,
      )
      if (!result) {
        return null
      }
      const pose = byId.get(result.poseId)
      if (!pose) {
        throw new Error(`Pose "${result.poseId}" is missing from the catalog`)
      }
      await enqueueSave(result.state)
      return { state: result.state, pose }
    },

    async rate(state, poseId, rating) {
      const next = ratePose(state, poseId, rating)
      if (next !== state) {
        await enqueueSave(next)
      }
      return next
    },
  }
}
