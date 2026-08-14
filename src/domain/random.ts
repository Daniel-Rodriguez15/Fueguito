/** Source of randomness in the [0, 1) range. Injected so domain logic stays deterministic in tests. */
export type RandomSource = () => number

export function randomIndex(length: number, random: RandomSource): number {
  return Math.floor(random() * length)
}

/** Fisher-Yates shuffle. Returns a new array, does not mutate the input. */
export function shuffle<T>(items: readonly T[], random: RandomSource): T[] {
  const result = [...items]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}
