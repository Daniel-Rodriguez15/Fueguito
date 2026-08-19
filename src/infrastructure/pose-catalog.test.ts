import { createStaticPoseCatalog } from './pose-catalog'

describe('createStaticPoseCatalog', () => {
  const catalog = createStaticPoseCatalog()
  const poses = catalog.getPoses()

  it('serves the full trimmed catalog', () => {
    expect(poses.length).toBe(30)
  })

  it('has unique ids, names, and scenes', () => {
    expect(new Set(poses.map((p) => p.id)).size).toBe(poses.length)
    expect(new Set(poses.map((p) => p.name)).size).toBe(poses.length)
    expect(new Set(poses.map((p) => p.scene)).size).toBe(poses.length)
  })

  it('gives every pose a description, instructions, and a valid spice level', () => {
    for (const pose of poses) {
      expect(pose.description.length).toBeGreaterThan(0)
      expect(pose.howTo.length).toBeGreaterThan(0)
      expect([1, 2, 3]).toContain(pose.spice)
    }
  })

  it('only references postures that exist in the fallback art', () => {
    const postures = catalog.getPostures()
    for (const pose of poses) {
      expect(postures[pose.art.a]).toBeDefined()
      expect(postures[pose.art.b]).toBeDefined()
    }
  })
})
