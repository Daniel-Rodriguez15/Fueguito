import { Pressable, StyleSheet, Text, View } from 'react-native'
import { colors, radius } from '../theme'

export type GameId = 'truth-or-dare' | 'bottle' | 'dice' | 'collection'

const GAMES: ReadonlyArray<{ id: GameId; icon: string; name: string; tagline: string }> = [
  { id: 'truth-or-dare', icon: '🎭', name: 'Verdad o Reto', tagline: 'Suave, picante o fuego' },
  { id: 'dice', icon: '🎲', name: 'Dados Hot', tagline: 'Acción, zona… o pose' },
  { id: 'collection', icon: '🎁', name: 'Colección', tagline: 'Raspa y descubre 100 poses' },
  { id: 'bottle', icon: '🍾', name: 'Pico Botella', tagline: 'La botella decide' },
]

export function HomeScreen({ onSelectGame }: { onSelectGame: (game: GameId) => void }) {
  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.title}>Fueguito</Text>
        <Text style={styles.subtitle}>Juegos para encender la noche en pareja 🔥</Text>
      </View>
      <View style={styles.list}>
        {GAMES.map((game) => (
          <Pressable
            key={game.id}
            style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
            onPress={() => onSelectGame(game.id)}
          >
            <Text style={styles.icon}>{game.icon}</Text>
            <View>
              <Text style={styles.name}>{game.name}</Text>
              <Text style={styles.tagline}>{game.tagline}</Text>
            </View>
          </Pressable>
        ))}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 20,
    gap: 24,
  },
  header: {
    alignItems: 'center',
    paddingTop: 40,
  },
  title: {
    fontSize: 48,
    fontWeight: '800',
    color: colors.fire,
  },
  subtitle: {
    marginTop: 8,
    color: colors.textDim,
    fontSize: 15,
  },
  list: {
    gap: 16,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    padding: 18,
    borderRadius: radius,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.bgCard,
  },
  cardPressed: {
    borderColor: colors.fire,
  },
  icon: {
    fontSize: 32,
  },
  name: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '700',
  },
  tagline: {
    color: colors.textDim,
    fontSize: 14,
    marginTop: 2,
  },
})
