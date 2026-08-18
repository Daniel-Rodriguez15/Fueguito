import { useState } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import type { TruthOrDareGame } from '@/application/truth-or-dare-game'
import type { IntensityLevel, Prompt } from '@/domain/truth-or-dare'
import { BackButton } from '../components/BackButton'
import { colors, radius } from '../theme'

const LEVELS: ReadonlyArray<{ id: IntensityLevel; label: string }> = [
  { id: 'soft', label: '😊 Suave' },
  { id: 'spicy', label: '🌶️ Picante' },
  { id: 'fire', label: '🔥 Fuego' },
]

export function TruthOrDareScreen({ game, onBack }: { game: TruthOrDareGame; onBack: () => void }) {
  const [level, setLevel] = useState<IntensityLevel>('soft')
  const [prompt, setPrompt] = useState<Prompt | null>(null)

  return (
    <View style={styles.screen}>
      <BackButton onBack={onBack} />
      <Text style={styles.title}>Verdad o Reto</Text>

      <View style={styles.levelRow}>
        {LEVELS.map((option) => (
          <Pressable
            key={option.id}
            style={[styles.levelButton, level === option.id && styles.levelButtonActive]}
            onPress={() => setLevel(option.id)}
          >
            <Text style={styles.levelLabel}>{option.label}</Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.body}>
        {prompt ? (
          <View
            style={[
              styles.promptCard,
              { borderTopColor: prompt.kind === 'truth' ? colors.truth : colors.dare },
            ]}
          >
            <Text style={styles.promptKind}>{prompt.kind === 'truth' ? 'Verdad' : 'Reto'}</Text>
            <Text style={styles.promptText}>{prompt.text}</Text>
          </View>
        ) : (
          <Text style={styles.hint}>Elijan nivel y su destino</Text>
        )}
      </View>

      <View style={styles.actionRow}>
        <Pressable
          style={[styles.button, { backgroundColor: colors.truth }]}
          onPress={() => setPrompt(game.draw('truth', level))}
        >
          <Text style={styles.buttonLabel}>Verdad</Text>
        </Pressable>
        <Pressable
          style={[styles.button, { backgroundColor: colors.dare }]}
          onPress={() => setPrompt(game.draw('dare', level))}
        >
          <Text style={styles.buttonLabel}>Reto</Text>
        </Pressable>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 20,
    gap: 20,
  },
  title: {
    color: colors.text,
    fontSize: 26,
    fontWeight: '700',
    textAlign: 'center',
  },
  levelRow: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
  },
  levelButton: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: radius,
    backgroundColor: colors.surface,
  },
  levelButtonActive: {
    backgroundColor: colors.fire,
  },
  levelLabel: {
    color: colors.text,
    fontWeight: '600',
  },
  body: {
    flex: 1,
    justifyContent: 'center',
  },
  hint: {
    color: colors.textDim,
    textAlign: 'center',
    fontSize: 16,
  },
  promptCard: {
    padding: 28,
    borderRadius: radius,
    backgroundColor: colors.bgCard,
    borderTopWidth: 4,
    alignItems: 'center',
    gap: 12,
  },
  promptKind: {
    color: colors.textDim,
    fontSize: 13,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  promptText: {
    color: colors.text,
    fontSize: 21,
    lineHeight: 30,
    textAlign: 'center',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 16,
    paddingBottom: 16,
  },
  button: {
    flex: 1,
    paddingVertical: 15,
    borderRadius: radius,
    alignItems: 'center',
  },
  buttonLabel: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
  },
})
