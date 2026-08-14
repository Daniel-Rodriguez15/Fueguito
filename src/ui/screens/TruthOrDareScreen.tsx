import { useState } from 'react'
import type { TruthOrDareGame } from '@/application/truth-or-dare-game'
import type { Prompt } from '@/domain/truth-or-dare'
import { BackButton } from '../components/BackButton'

export function TruthOrDareScreen({ game, onBack }: { game: TruthOrDareGame; onBack: () => void }) {
  const [prompt, setPrompt] = useState<Prompt | null>(null)

  return (
    <main className="screen">
      <BackButton onBack={onBack} />
      <h2 className="screen-title">Verdad o Reto</h2>

      {prompt ? (
        <section className={`prompt-card ${prompt.kind}`} aria-live="polite">
          <span className="prompt-kind">{prompt.kind === 'truth' ? 'Verdad' : 'Reto'}</span>
          <p className="prompt-text">{prompt.text}</p>
        </section>
      ) : (
        <p className="screen-hint">Pasa el teléfono y elige tu destino</p>
      )}

      <div className="action-row">
        <button type="button" className="btn btn-truth" onClick={() => setPrompt(game.draw('truth'))}>
          Verdad
        </button>
        <button type="button" className="btn btn-dare" onClick={() => setPrompt(game.draw('dare'))}>
          Reto
        </button>
      </div>
    </main>
  )
}
