import { useEffect, useRef, useState } from 'react'
import { MIN_BOTTLE_PLAYERS, spinBottle } from '@/domain/bottle'
import type { RandomSource } from '@/domain/random'
import { BackButton } from '../components/BackButton'

const SPIN_EXTRA_TURNS = 4
const SPIN_DURATION_MS = 3000

export function BottleScreen({ random, onBack }: { random: RandomSource; onBack: () => void }) {
  const [players, setPlayers] = useState<string[]>([])
  const [name, setName] = useState('')
  const [rotation, setRotation] = useState(0)
  const [spinning, setSpinning] = useState(false)
  const [targetIndex, setTargetIndex] = useState<number | null>(null)
  const timerRef = useRef<number | null>(null)

  useEffect(
    () => () => {
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current)
      }
    },
    [],
  )

  const addPlayer = () => {
    const trimmed = name.trim()
    if (trimmed === '' || players.includes(trimmed)) {
      return
    }
    setPlayers([...players, trimmed])
    setName('')
    setTargetIndex(null)
  }

  const removePlayer = (index: number) => {
    if (spinning) {
      return
    }
    setPlayers(players.filter((_, i) => i !== index))
    setTargetIndex(null)
  }

  const spin = () => {
    if (spinning || players.length < MIN_BOTTLE_PLAYERS) {
      return
    }
    const { targetIndex: chosen } = spinBottle(players.length, random)
    const anglePerPlayer = 360 / players.length
    const currentAngle = ((rotation % 360) + 360) % 360
    const delta = (chosen * anglePerPlayer - currentAngle + 360) % 360
    setRotation(rotation + SPIN_EXTRA_TURNS * 360 + delta)
    setSpinning(true)
    setTargetIndex(null)
    timerRef.current = window.setTimeout(() => {
      setSpinning(false)
      setTargetIndex(chosen)
    }, SPIN_DURATION_MS)
  }

  const anglePerPlayer = players.length > 0 ? 360 / players.length : 0

  return (
    <main className="screen">
      <BackButton onBack={onBack} />
      <h2 className="screen-title">Pico Botella</h2>

      <form
        className="player-form"
        onSubmit={(event) => {
          event.preventDefault()
          addPlayer()
        }}
      >
        <input
          className="player-input"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Nombre del jugador"
          aria-label="Nombre del jugador"
          maxLength={20}
        />
        <button type="submit" className="btn btn-small">
          Agregar
        </button>
      </form>

      <div className="bottle-circle">
        {players.map((player, index) => (
          <button
            key={player}
            type="button"
            className={`player-chip ${targetIndex === index ? 'chosen' : ''}`}
            style={{
              transform: `translate(-50%, -50%) rotate(${index * anglePerPlayer}deg) translateY(-8.5rem) rotate(${-index * anglePerPlayer}deg)`,
            }}
            onClick={() => removePlayer(index)}
            title="Tocar para quitar"
          >
            {player}
          </button>
        ))}
        <div
          className="bottle"
          style={{
            transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
            transition: spinning ? `transform ${SPIN_DURATION_MS}ms cubic-bezier(0.2, 0.8, 0.2, 1)` : 'none',
          }}
          aria-hidden="true"
        >
          <div className="bottle-neck" />
          <div className="bottle-body" />
        </div>
      </div>

      {players.length < MIN_BOTTLE_PLAYERS ? (
        <p className="screen-hint">Agrega al menos {MIN_BOTTLE_PLAYERS} jugadores</p>
      ) : (
        <p className="bottle-result" aria-live="polite">
          {targetIndex !== null ? `La botella eligió a ${players[targetIndex]} 🔥` : ' '}
        </p>
      )}

      <div className="action-row">
        <button
          type="button"
          className="btn btn-primary"
          onClick={spin}
          disabled={spinning || players.length < MIN_BOTTLE_PLAYERS}
        >
          {spinning ? 'Girando…' : 'Girar botella'}
        </button>
      </div>
    </main>
  )
}
