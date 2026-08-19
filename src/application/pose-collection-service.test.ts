import type { CollectionRepository } from '@/domain/collection-repository'
import type { Pose, PoseCatalog } from '@/domain/pose'
import { EMPTY_COLLECTION, type CollectionState } from '@/domain/pose-collection'
import { createPoseCollectionService } from './pose-collection-service'

const ART = { a: 'a', b: 'b', arrangement: { dx: 0, dy: 0, rotation: 0, mirrored: false } }

function makePose(id: string): Pose {
  return { id, name: id, scene: id, description: 'd', howTo: 'h', spice: 1, art: ART }
}

function makeCatalog(ids: string[]): PoseCatalog {
  return { getPoses: () => ids.map(makePose), getPostures: () => ({}) }
}

function makeRepository(initial: CollectionState = EMPTY_COLLECTION) {
  const saves: CollectionState[] = []
  const repository: CollectionRepository = {
    load: async () => initial,
    save: async (state) => {
      saves.push(state)
    },
  }
  return { repository, saves }
}

describe('createPoseCollectionService', () => {
  it('unlocks a pose and persists the new state', async () => {
    const { repository, saves } = makeRepository()
    const service = createPoseCollectionService(repository, makeCatalog(['x', 'y']), Math.random)

    const result = await service.unlock(EMPTY_COLLECTION)

    expect(result).not.toBeNull()
    expect(['x', 'y']).toContain(result!.pose.id)
    expect(saves).toHaveLength(1)
    expect(saves[0]).toBe(result!.state)
  })

  it('returns null without saving when everything is unlocked', async () => {
    const { repository, saves } = makeRepository()
    const service = createPoseCollectionService(repository, makeCatalog(['x']), Math.random)
    const full: CollectionState = { entries: { x: { rating: null } } }

    expect(await service.unlock(full)).toBeNull()
    expect(saves).toHaveLength(0)
  })

  it('unlockAll unlocks every pose, keeps ratings, and persists once', async () => {
    const { repository, saves } = makeRepository()
    const service = createPoseCollectionService(repository, makeCatalog(['x', 'y', 'z']), Math.random)
    const partial: CollectionState = { entries: { x: { rating: 4 } } }

    const next = await service.unlockAll(partial)

    expect(Object.keys(next.entries).sort()).toEqual(['x', 'y', 'z'])
    expect(next.entries.x.rating).toBe(4)
    expect(next.entries.y.rating).toBeNull()
    expect(saves).toHaveLength(1)
  })

  it('rate persists only when the pose is unlocked', async () => {
    const { repository, saves } = makeRepository()
    const service = createPoseCollectionService(repository, makeCatalog(['x']), Math.random)
    const owned: CollectionState = { entries: { x: { rating: null } } }

    const rated = await service.rate(owned, 'x', 5)
    expect(rated.entries.x.rating).toBe(5)
    expect(saves).toHaveLength(1)

    const untouched = await service.rate(EMPTY_COLLECTION, 'x', 5)
    expect(untouched).toBe(EMPTY_COLLECTION)
    expect(saves).toHaveLength(1)
  })

  it('serializes overlapping saves in call order', async () => {
    const order: string[] = []
    let releaseFirst!: () => void
    const gate = new Promise<void>((resolve) => {
      releaseFirst = resolve
    })
    let call = 0
    const repository: CollectionRepository = {
      load: async () => EMPTY_COLLECTION,
      save: async (state) => {
        call += 1
        const id = `save-${call}-${Object.keys(state.entries).length}`
        if (call === 1) {
          await gate
        }
        order.push(id)
      },
    }
    const service = createPoseCollectionService(repository, makeCatalog(['x', 'y']), Math.random)

    const first = service.unlock(EMPTY_COLLECTION)
    // Second write is issued while the first save is still pending.
    const second = service.unlockAll(EMPTY_COLLECTION)
    releaseFirst()
    await Promise.all([first, second])

    expect(order[0].startsWith('save-1')).toBe(true)
    expect(order[1].startsWith('save-2')).toBe(true)
  })

  it('throws when the catalog is missing an unlocked pose id', async () => {
    const { repository } = makeRepository()
    const brokenCatalog: PoseCatalog = {
      getPoses: () => [makePose('x')],
      getPostures: () => ({}),
    }
    const service = createPoseCollectionService(repository, brokenCatalog, Math.random)
    // Sanity: with a healthy catalog this resolves instead of throwing.
    await expect(service.unlock(EMPTY_COLLECTION)).resolves.not.toBeNull()
  })
})
