import { useState } from 'react'
import type { TruthOrDareGame } from '@/application/truth-or-dare-game'
import type { RandomSource } from '@/domain/random'
import { HomeScreen } from './screens/HomeScreen'
import { TruthOrDareScreen } from './screens/TruthOrDareScreen'
import { BottleScreen } from './screens/BottleScreen'
import { DiceScreen } from './screens/DiceScreen'

export type GameId = 'truth-or-dare' | 'bottle' | 'dice'
type Screen = 'home' | GameId

export interface AppDependencies {
  truthOrDare: TruthOrDareGame
  random: RandomSource
}

export function App({ deps }: { deps: AppDependencies }) {
  const [screen, setScreen] = useState<Screen>('home')
  const goHome = () => setScreen('home')

  switch (screen) {
    case 'home':
      return <HomeScreen onSelectGame={setScreen} />
    case 'truth-or-dare':
      return <TruthOrDareScreen game={deps.truthOrDare} onBack={goHome} />
    case 'bottle':
      return <BottleScreen random={deps.random} onBack={goHome} />
    case 'dice':
      return <DiceScreen random={deps.random} onBack={goHome} />
  }
}
