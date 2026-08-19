import { useEffect, useRef, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import { StatusBar } from 'expo-status-bar'
import { useFonts } from 'expo-font'
import { DMSans_400Regular, DMSans_500Medium } from '@expo-google-fonts/dm-sans'
import {
  InstrumentSerif_400Regular,
  InstrumentSerif_400Regular_Italic,
} from '@expo-google-fonts/instrument-serif'
import { createPoseCollectionService } from '@/application/pose-collection-service'
import { createTruthOrDareGame } from '@/application/truth-or-dare-game'
import { EMPTY_NIGHT_LOG, logActivity, type NightLogState } from '@/domain/night-log'
import { EMPTY_COLLECTION, type CollectionState } from '@/domain/pose-collection'
import { createStaticPoseCatalog } from '@/infrastructure/pose-catalog'
import { createStaticPromptRepository } from '@/infrastructure/static-prompt-repository'
import { createAsyncStorageCollectionRepository } from './infrastructure/async-storage-collection-repository'
import { createAsyncStorageNightLogRepository } from './infrastructure/async-storage-night-log-repository'
import { colors } from './ui/theme'
import { HomeScreen, type GameId } from './ui/screens/HomeScreen'
import { TruthOrDareScreen } from './ui/screens/TruthOrDareScreen'
import { BottleScreen } from './ui/screens/BottleScreen'
import { DiceScreen } from './ui/screens/DiceScreen'
import { CollectionScreen } from './ui/screens/CollectionScreen'
import { CalendarScreen } from './ui/screens/CalendarScreen'
import { MostLikelyScreen } from './ui/screens/MostLikelyScreen'
import { RouletteScreen } from './ui/screens/RouletteScreen'

type Screen = 'home' | GameId

const random = Math.random
const catalog = createStaticPoseCatalog()
const truthOrDare = createTruthOrDareGame(createStaticPromptRepository(), random)
const collectionService = createPoseCollectionService(
  createAsyncStorageCollectionRepository(),
  catalog,
  random,
)
const nightLogRepository = createAsyncStorageNightLogRepository()

function todayLocal(): string {
  const now = new Date()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${now.getFullYear()}-${month}-${day}`
}

export default function App() {
  const [fontsLoaded] = useFonts({
    DMSans_400Regular,
    DMSans_500Medium,
    InstrumentSerif_400Regular,
    InstrumentSerif_400Regular_Italic,
  })
  const [screen, setScreen] = useState<Screen>('home')
  const [collection, setCollection] = useState<CollectionState>(EMPTY_COLLECTION)
  const [collectionReady, setCollectionReady] = useState(false)
  const [nightLog, setNightLog] = useState<NightLogState>(EMPTY_NIGHT_LOG)
  const nightLogSaveQueue = useRef<Promise<void>>(Promise.resolve())
  const goHome = () => setScreen('home')

  useEffect(() => {
    let active = true
    collectionService.load().then((state) => {
      if (active) {
        setCollection(state)
        setCollectionReady(true)
      }
    })
    nightLogRepository.load().then((state) => {
      if (active) {
        setNightLog(state)
      }
    })
    return () => {
      active = false
    }
  }, [])

  const recordActivity = (game: string) => {
    setNightLog((current) => {
      const next = logActivity(current, todayLocal(), game)
      if (next !== current) {
        nightLogSaveQueue.current = nightLogSaveQueue.current.then(() =>
          nightLogRepository.save(next).catch(() => {}),
        )
      }
      return next
    })
  }

  if (!fontsLoaded) {
    return <View style={styles.root} />
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.root}>
        <StatusBar style="light" />
        {screen === 'home' && <HomeScreen onSelectGame={setScreen} nightLog={nightLog} />}
        {screen === 'truth-or-dare' && (
          <TruthOrDareScreen
            game={truthOrDare}
            onBack={goHome}
            onActivity={() => recordActivity('truth-or-dare')}
          />
        )}
        {screen === 'bottle' && (
          <BottleScreen random={random} onBack={goHome} onActivity={() => recordActivity('bottle')} />
        )}
        {screen === 'dice' && (
          <DiceScreen
            random={random}
            catalog={catalog}
            collection={collection}
            onBack={goHome}
            onGoToCollection={() => setScreen('collection')}
            onActivity={() => recordActivity('dice')}
          />
        )}
        {screen === 'collection' && (
          <CollectionScreen
            catalog={catalog}
            service={collectionService}
            collection={collection}
            ready={collectionReady}
            onCollectionChange={setCollection}
            onBack={goHome}
            onActivity={() => recordActivity('collection')}
          />
        )}
        {screen === 'calendar' && <CalendarScreen log={nightLog} onBack={goHome} />}
        {screen === 'most-likely' && (
          <MostLikelyScreen
            random={random}
            onBack={goHome}
            onActivity={() => recordActivity('most-likely')}
          />
        )}
        {screen === 'roulette' && (
          <RouletteScreen
            random={random}
            onBack={goHome}
            onActivity={() => recordActivity('roulette')}
          />
        )}
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
