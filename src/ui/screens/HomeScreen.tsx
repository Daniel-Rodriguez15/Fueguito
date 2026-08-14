import type { GameId } from '../App'

const GAMES: ReadonlyArray<{ id: GameId; icon: string; name: string; tagline: string }> = [
  { id: 'truth-or-dare', icon: '🎭', name: 'Verdad o Reto', tagline: 'Confiesa o cumple' },
  { id: 'bottle', icon: '🍾', name: 'Pico Botella', tagline: 'La botella decide' },
  { id: 'dice', icon: '🎲', name: 'Dados', tagline: 'Que decida la suerte' },
]

export function HomeScreen({ onSelectGame }: { onSelectGame: (game: GameId) => void }) {
  return (
    <main className="screen home">
      <header className="home-header">
        <h1>Fueguito</h1>
        <p className="home-subtitle">Juegos para encender la noche 🔥</p>
      </header>
      <nav className="game-list" aria-label="Juegos">
        {GAMES.map((game) => (
          <button
            key={game.id}
            type="button"
            className="game-card"
            onClick={() => onSelectGame(game.id)}
          >
            <span className="game-icon" aria-hidden="true">
              {game.icon}
            </span>
            <span className="game-info">
              <span className="game-name">{game.name}</span>
              <span className="game-tagline">{game.tagline}</span>
            </span>
          </button>
        ))}
      </nav>
    </main>
  )
}
