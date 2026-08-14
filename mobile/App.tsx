import { useState } from 'react'
import { StyleSheet } from 'react-native'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import { StatusBar } from 'expo-status-bar'
import { createTruthOrDareGame } from '@/application/truth-or-dare-game'
import { createStaticPromptRepository } from '@/infrastructure/static-prompt-repository'
import { colors } from './ui/theme'
import { HomeScreen, type GameId } from './ui/screens/HomeScreen'
import { TruthOrDareScreen } from './ui/screens/TruthOrDareScreen'
import { BottleScreen } from './ui/screens/BottleScreen'
import { DiceScreen } from './ui/screens/DiceScreen'

type Screen = 'home' | GameId

const random = Math.random
const truthOrDare = createTruthOrDareGame(createStaticPromptRepository(), random)

export default function App() {
  const [screen, setScreen] = useState<Screen>('home')
  const goHome = () => setScreen('home')

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.root}>
        <StatusBar style="light" />
        {screen === 'home' && <HomeScreen onSelectGame={setScreen} />}
        {screen === 'truth-or-dare' && <TruthOrDareScreen game={truthOrDare} onBack={goHome} />}
        {screen === 'bottle' && <BottleScreen random={random} onBack={goHome} />}
        {screen === 'dice' && <DiceScreen random={random} onBack={goHome} />}
      </SafeAreaView>
    </SafeAreaProvider>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bg,
  },
})
