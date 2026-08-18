import { useEffect, useState } from 'react'
import { StyleSheet } from 'react-native'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import { StatusBar } from 'expo-status-bar'
import { createPoseCollectionService } from '@/application/pose-collection-service'
import { createTruthOrDareGame } from '@/application/truth-or-dare-game'
import { EMPTY_COLLECTION, type CollectionState } from '@/domain/pose-collection'
import { createStaticPoseCatalog } from '@/infrastructure/pose-catalog'
import { createStaticPromptRepository } from '@/infrastructure/static-prompt-repository'
import { createAsyncStorageCollectionRepository } from './infrastructure/async-storage-collection-repository'
import { colors } from './ui/theme'
import { HomeScreen, type GameId } from './ui/screens/HomeScreen'
import { TruthOrDareScreen } from './ui/screens/TruthOrDareScreen'
import { BottleScreen } from './ui/screens/BottleScreen'
import { DiceScreen } from './ui/screens/DiceScreen'
import { CollectionScreen } from './ui/screens/CollectionScreen'

type Screen = 'home' | GameId

const random = Math.random
const catalog = createStaticPoseCatalog()
const truthOrDare = createTruthOrDareGame(createStaticPromptRepository(), random)
const collectionService = createPoseCollectionService(
  createAsyncStorageCollectionRepository(),
  catalog,
  random,
)

export default function App() {
  const [screen, setScreen] = useState<Screen>('home')
  const [collection, setCollection] = useState<CollectionState>(EMPTY_COLLECTION)
  const [collectionReady, setCollectionReady] = useState(false)
  const goHome = () => setScreen('home')

  useEffect(() => {
    let active = true
    collectionService.load().then((state) => {
      if (active) {
        setCollection(state)
        setCollectionReady(true)
      }
    })
    return () => {
      active = false
    }
  }, [])

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.root}>
        <StatusBar style="light" />
        {screen === 'home' && <HomeScreen onSelectGame={setScreen} />}
        {screen === 'truth-or-dare' && <TruthOrDareScreen game={truthOrDare} onBack={goHome} />}
        {screen === 'bottle' && <BottleScreen random={random} onBack={goHome} />}
        {screen === 'dice' && (
          <DiceScreen
            random={random}
            catalog={catalog}
            collection={collection}
            onBack={goHome}
            onGoToCollection={() => setScreen('collection')}
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
