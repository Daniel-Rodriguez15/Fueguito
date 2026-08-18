import type { RandomSource } from './random'
import { randomIndex } from './random'

export type PoseRating = 1 | 2 | 3 | 4 | 5

export interface CollectionEntry {
  readonly rating: PoseRating | null
}

export interface CollectionState {
  readonly entries: Readonly<Record<string, CollectionEntry>>
}

export const EMPTY_COLLECTION: CollectionState = { entries: {} }

export function isUnlocked(state: CollectionState, poseId: string): boolean {
  return poseId in state.entries
}

export function unlockedCount(state: CollectionState): number {
  return Object.keys(state.entries).length
}

export interface UnlockResult {
  readonly state: CollectionState
  readonly poseId: string
}

/**
 * Unlocks one random pose the player does not own yet.
 * Returns null when the whole catalog is already unlocked.
 */
export function unlockRandomPose(
  state: CollectionState,
  poseIds: readonly string[],
  random: RandomSource,
): UnlockResult | null {
  const locked = poseIds.filter((id) => !isUnlocked(state, id))
  if (locked.length === 0) {
    return null
  }
  const poseId = locked[randomIndex(locked.length, random)]
  return {
    poseId,
    state: { entries: { ...state.entries, [poseId]: { rating: null } } },
  }
}

/** Unlocks every pose at once, keeping any existing ratings. */
export function unlockAllPoses(state: CollectionState, poseIds: readonly string[]): CollectionState {
  const entries = { ...state.entries }
  for (const id of poseIds) {
    if (!(id in entries)) {
      entries[id] = { rating: null }
    }
  }
  return { entries }
}

/** Rating an unknown pose is a no-op: you can only rate what you unlocked. */
export function ratePose(
  state: CollectionState,
  poseId: string,
  rating: PoseRating,
): CollectionState {
  if (!isUnlocked(state, poseId)) {
    return state
  }
  return { entries: { ...state.entries, [poseId]: { rating } } }
}
