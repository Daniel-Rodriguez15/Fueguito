import { useState } from 'react'
import type { TruthOrDareGame } from '@/application/truth-or-dare-game'
import type { IntensityLevel, Prompt } from '@/domain/truth-or-dare'
import { BackButton } from '../components/BackButton'

const LEVELS: ReadonlyArray<{ id: IntensityLevel; label: string }> = [
  { id: 'soft', label: '😊 Suave' },
  { id: 'spicy', label: '🌶️ Picante' },
  { id: 'fire', label: '🔥 Fuego' },
]

export function TruthOrDareScreen({ game, onBack }: { game: TruthOrDareGame; onBack: () => void }) {
  const [level, setLevel] = useState<IntensityLevel>('soft')
  const [prompt, setPrompt] = useState<Prompt | null>(null)

  return (
    <main className="screen">
      <BackButton onBack={onBack} />
      <h2 className="screen-title">Verdad o Reto</h2>

      <div className="level-row" role="group" aria-label="Nivel de intensidad">
        {LEVELS.map((option) => (
          <button
            key={option.id}
            type="button"
            className={`btn btn-small ${level === option.id ? 'active' : ''}`}
            onClick={() => setLevel(option.id)}
          >
            {option.label}
          </button>
        ))}
      </div>

      {prompt ? (
        <section className={`prompt-card ${prompt.kind}`} aria-live="polite">
          <span className="prompt-kind">{prompt.kind === 'truth' ? 'Verdad' : 'Reto'}</span>
          <p className="prompt-text">{prompt.text}</p>
        </section>
      ) : (
        <p className="screen-hint">Elijan nivel y su destino</p>
      )}

      <div className="action-row">
        <button
          type="button"
          className="btn btn-truth"
          onClick={() => setPrompt(game.draw('truth', level))}
        >
          Verdad
        </button>
        <button
          type="button"
          className="btn btn-dare"
          onClick={() => setPrompt(game.draw('dare', level))}
        >
          Reto
        </button>
      </div>
    </main>
  )
}
