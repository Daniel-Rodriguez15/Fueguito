import {
  EMPTY_COLLECTION,
  isUnlocked,
  ratePose,
  unlockRandomPose,
  unlockedCount,
} from './pose-collection'

const POSE_IDS = ['a', 'b', 'c']

describe('unlockRandomPose', () => {
  it('unlocks a pose that was not unlocked before', () => {
    const result = unlockRandomPose(EMPTY_COLLECTION, POSE_IDS, Math.random)

    expect(result).not.toBeNull()
    expect(POSE_IDS).toContain(result!.poseId)
    expect(isUnlocked(result!.state, result!.poseId)).toBe(true)
    expect(unlockedCount(result!.state)).toBe(1)
  })

  it('never unlocks the same pose twice', () => {
    let state = EMPTY_COLLECTION
    const seen: string[] = []
    for (let i = 0; i < POSE_IDS.length; i++) {
      const result = unlockRandomPose(state, POSE_IDS, Math.random)!
      seen.push(result.poseId)
      state = result.state
    }

    expect(seen.sort()).toEqual(['a', 'b', 'c'])
  })

  it('returns null once the whole catalog is unlocked', () => {
    let state = EMPTY_COLLECTION
    for (let i = 0; i < POSE_IDS.length; i++) {
      state = unlockRandomPose(state, POSE_IDS, Math.random)!.state
    }

    expect(unlockRandomPose(state, POSE_IDS, Math.random)).toBeNull()
  })

  it('does not mutate the previous state', () => {
    const result = unlockRandomPose(EMPTY_COLLECTION, POSE_IDS, Math.random)!

    expect(unlockedCount(EMPTY_COLLECTION)).toBe(0)
    expect(unlockedCount(result.state)).toBe(1)
  })
})

describe('ratePose', () => {
  it('stores a rating for an unlocked pose', () => {
    const { state, poseId } = unlockRandomPose(EMPTY_COLLECTION, POSE_IDS, Math.random)!

    const rated = ratePose(state, poseId, 4)

    expect(rated.entries[poseId].rating).toBe(4)
  })

  it('ignores ratings for poses that are not unlocked', () => {
    const rated = ratePose(EMPTY_COLLECTION, 'a', 5)

    expect(rated).toBe(EMPTY_COLLECTION)
  })
})
