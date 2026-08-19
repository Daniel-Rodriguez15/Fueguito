import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import type { NightLogState } from '@/domain/night-log'
import { GameIcon, type GameIconId } from '../components/GameIcon'
import { MiniCalendar } from '../components/MiniCalendar'
import { colors, fonts, radii } from '../theme'

export type GameId =
  | 'truth-or-dare'
  | 'bottle'
  | 'dice'
  | 'collection'
  | 'calendar'
  | 'most-likely'
  | 'roulette'

const GAMES: ReadonlyArray<{ id: GameIconId; name: string; tagline: string }> = [
  { id: 'truth-or-dare', name: 'Verdad o Reto', tagline: 'Suave, picante o fuego' },
  { id: 'dice', name: 'Dados', tagline: 'Acción, zona o pose' },
  { id: 'collection', name: 'Colección', tagline: 'Raspa y descubre poses' },
  { id: 'most-likely', name: '¿Más probable?', tagline: 'Señalen al culpable' },
  { id: 'roulette', name: 'Contrarreloj', tagline: 'Un reto, un tiempo' },
  { id: 'bottle', name: 'Pico Botella', tagline: 'La botella empareja' },
]

export function HomeScreen({
  onSelectGame,
  nightLog,
}: {
  onSelectGame: (game: GameId) => void
  nightLog: NightLogState
}) {
  return (
    <ScrollView contentContainerStyle={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.kicker}>Juegos para dos</Text>
        <Text style={styles.title}>Fueguito</Text>
      </View>
      <MiniCalendar log={nightLog} onPress={() => onSelectGame('calendar')} />
      <View style={styles.grid}>
        {GAMES.map((game) => (
          <Pressable
            key={game.id}
            style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
            onPress={() => onSelectGame(game.id)}
          >
            <GameIcon id={game.id} />
            <Text style={styles.name}>{game.name}</Text>
            <Text style={styles.tagline}>{game.tagline}</Text>
          </Pressable>
        ))}
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  screen: {
    padding: 20,
    gap: 20,
  },
  header: {
    alignItems: 'center',
    paddingTop: 26,
    gap: 10,
  },
  kicker: {
    fontFamily: fonts.body,
    fontSize: 11.5,
    letterSpacing: 2.6,
    textTransform: 'uppercase',
    color: colors.textDim,
  },
  title: {
    fontFamily: fonts.display,
    fontSize: 58,
    lineHeight: 58,
    color: colors.text,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  card: {
    width: '48%',
    flexGrow: 1,
    padding: 18,
    borderRadius: radii.medium,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.bgCard,
    gap: 4,
  },
  cardPressed: {
    borderColor: colors.fire,
  },
  name: {
    fontFamily: fonts.medium,
    color: colors.text,
    fontSize: 15,
    marginTop: 10,
  },
  tagline: {
    fontFamily: fonts.body,
    color: colors.textDim,
    fontSize: 12.5,
  },
})
