import { useEffect, useRef, useState } from 'react'
import { rollDice } from '@/domain/dice'
import type { RandomSource } from '@/domain/random'
import { BackButton } from '../components/BackButton'
import { Die } from '../components/Die'

const ROLL_DURATION_MS = 600
const DICE_COUNTS = [1, 2] as const

export function DiceScreen({ random, onBack }: { random: RandomSource; onBack: () => void }) {
  const [count, setCount] = useState<number>(2)
  const [values, setValues] = useState<number[] | null>(null)
  const [rolling, setRolling] = useState(false)
  const timerRef = useRef<number | null>(null)

  useEffect(
    () => () => {
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current)
      }
    },
    [],
  )

  const roll = () => {
    if (rolling) {
      return
    }
    setRolling(true)
    timerRef.current = window.setTimeout(() => {
      setValues(rollDice(count, random))
      setRolling(false)
    }, ROLL_DURATION_MS)
  }

  const selectCount = (nextCount: number) => {
    if (rolling) {
      return
    }
    setCount(nextCount)
    setValues(null)
  }

  return (
    <main className="screen">
      <BackButton onBack={onBack} />
      <h2 className="screen-title">Dados</h2>

      <div className="dice-count" role="group" aria-label="Cantidad de dados">
        {DICE_COUNTS.map((option) => (
          <button
            key={option}
            type="button"
            className={`btn btn-small ${count === option ? 'active' : ''}`}
            onClick={() => selectCount(option)}
          >
            {option} {option === 1 ? 'dado' : 'dados'}
          </button>
        ))}
      </div>

      <div className={`dice-row ${rolling ? 'rolling' : ''}`}>
        {Array.from({ length: count }, (_, index) => (
          <Die key={index} value={values?.[index] ?? null} />
        ))}
      </div>

      <p className="dice-total" aria-live="polite">
        {values && count > 1 ? `Total: ${values.reduce((sum, value) => sum + value, 0)}` : ' '}
      </p>

      <div className="action-row">
        <button type="button" className="btn btn-primary" onClick={roll} disabled={rolling}>
          {rolling ? 'Rodando…' : 'Lanzar'}
        </button>
      </div>
    </main>
  )
}
