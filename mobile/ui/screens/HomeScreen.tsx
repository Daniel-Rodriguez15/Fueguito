import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import { colors, radius } from '../theme'

export type GameId =
  | 'truth-or-dare'
  | 'bottle'
  | 'dice'
  | 'collection'
  | 'calendar'
  | 'most-likely'
  | 'roulette'

const GAMES: ReadonlyArray<{ id: GameId; icon: string; name: string; tagline: string }> = [
  { id: 'truth-or-dare', icon: '🎭', name: 'Verdad o Reto', tagline: 'Suave, picante o fuego' },
  { id: 'dice', icon: '🎲', name: 'Dados Hot', tagline: 'Acción, zona… o pose' },
  { id: 'collection', icon: '🎁', name: 'Colección', tagline: 'Raspa y descubre poses' },
  { id: 'most-likely', icon: '👉', name: '¿Más Probable?', tagline: 'Señalen al culpable' },
  { id: 'roulette', icon: '⏱️', name: 'Ruleta Rápida', tagline: 'Retos contra el reloj' },
  { id: 'bottle', icon: '🍾', name: 'Pico Botella', tagline: 'La botella empareja' },
  { id: 'calendar', icon: '📅', name: 'Calentadario', tagline: 'Su racha de fuego' },
]

export function HomeScreen({ onSelectGame }: { onSelectGame: (game: GameId) => void }) {
  return (
    <ScrollView contentContainerStyle={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.title}>Fueguito</Text>
        <Text style={styles.subtitle}>Juegos para encender la noche en pareja 🔥</Text>
      </View>
      <View style={styles.grid}>
        {GAMES.map((game) => (
          <Pressable
            key={game.id}
            style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
            onPress={() => onSelectGame(game.id)}
          >
            <Text style={styles.icon}>{game.icon}</Text>
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
    gap: 24,
  },
  header: {
    alignItems: 'center',
    paddingTop: 28,
  },
  title: {
    fontSize: 46,
    fontWeight: '800',
    color: colors.fire,
  },
  subtitle: {
    marginTop: 6,
    color: colors.textDim,
    fontSize: 14,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  card: {
    width: '48%',
    flexGrow: 1,
    padding: 16,
    borderRadius: radius,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.bgCard,
    gap: 4,
  },
  cardPressed: {
    borderColor: colors.fire,
  },
  icon: {
    fontSize: 28,
  },
  name: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '700',
  },
  tagline: {
    color: colors.textDim,
    fontSize: 12,
  },
})
