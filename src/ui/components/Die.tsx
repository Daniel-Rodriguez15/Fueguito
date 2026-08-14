const PIPS_BY_VALUE: Record<number, readonly number[]> = {
  1: [4],
  2: [0, 8],
  3: [0, 4, 8],
  4: [0, 2, 6, 8],
  5: [0, 2, 4, 6, 8],
  6: [0, 2, 3, 5, 6, 8],
}

const CELLS = Array.from({ length: 9 }, (_, index) => index)

export function Die({ value }: { value: number | null }) {
  const pips = value === null ? [] : (PIPS_BY_VALUE[value] ?? [])
  return (
    <div className="die" role="img" aria-label={value === null ? 'Dado sin lanzar' : `Dado: ${value}`}>
      {CELLS.map((cell) => (
        <span key={cell} className={pips.includes(cell) ? 'pip' : 'pip-empty'} />
      ))}
    </div>
  )
}
