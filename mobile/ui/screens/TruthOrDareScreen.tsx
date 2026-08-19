import { useState } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import type { TruthOrDareGame } from '@/application/truth-or-dare-game'
import type { IntensityLevel, Prompt } from '@/domain/truth-or-dare'
import { BackButton } from '../components/BackButton'
import { colors, fonts, radii } from '../theme'

const LEVELS: ReadonlyArray<{ id: IntensityLevel; label: string }> = [
  { id: 'soft', label: 'Suave' },
  { id: 'spicy', label: 'Picante' },
  { id: 'fire', label: 'Fuego' },
]

export function TruthOrDareScreen({
  game,
  onBack,
  onActivity,
}: {
  game: TruthOrDareGame
  onBack: () => void
  onActivity: () => void
}) {
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
            <Text
              style={[styles.levelLabel, level === option.id && styles.levelLabelActive]}
              numberOfLines={1}
            >
              {option.label}
            </Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.body}>
        {prompt ? (
          <View style={styles.promptCard}>
            <Text style={styles.promptKind}>{prompt.kind === 'truth' ? 'Verdad' : 'Reto'}</Text>
            <Text style={styles.promptText}>{prompt.text}</Text>
          </View>
        ) : (
          <Text style={styles.hint}>Elijan nivel y su destino</Text>
        )}
      </View>

      <View style={styles.actionRow}>
        <Pressable
          style={[styles.button, styles.buttonOutline]}
          onPress={() => {
            setPrompt(game.draw('truth', level))
            onActivity()
          }}
        >
          <Text style={[styles.buttonLabel, styles.buttonLabelOutline]}>Verdad</Text>
        </Pressable>
        <Pressable
          style={[styles.button, styles.buttonFilled]}
          onPress={() => {
            setPrompt(game.draw('dare', level))
            onActivity()
          }}
        >
          <Text style={[styles.buttonLabel, styles.buttonLabelFilled]}>Reto</Text>
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
    fontFamily: fonts.display,
    color: colors.text,
    fontSize: 30,
    textAlign: 'center',
  },
  levelRow: {
    flexDirection: 'row',
    gap: 8,
    width: '100%',
  },
  levelButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 11,
    borderRadius: radii.pill,
    backgroundColor: colors.bgCard,
    borderWidth: 1,
    borderColor: colors.borderStrong,
  },
  levelButtonActive: {
    backgroundColor: colors.fire,
    borderColor: colors.fire,
  },
  levelLabel: {
    fontFamily: fonts.medium,
    color: colors.textDim,
    fontSize: 13,
  },
  levelLabelActive: {
    color: colors.onFire,
  },
  body: {
    flex: 1,
    justifyContent: 'center',
  },
  hint: {
    fontFamily: fonts.body,
    color: colors.textDim,
    textAlign: 'center',
    fontSize: 14.5,
    lineHeight: 23,
  },
  promptCard: {
    padding: 26,
    borderRadius: radii.large,
    backgroundColor: colors.bgCard,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    gap: 12,
  },
  promptKind: {
    fontFamily: fonts.body,
    color: colors.textDim,
    fontSize: 11.5,
    letterSpacing: 2.3,
    textTransform: 'uppercase',
  },
  promptText: {
    fontFamily: fonts.display,
    color: colors.text,
    fontSize: 27,
    lineHeight: 34,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 16,
    paddingBottom: 16,
  },
  button: {
    flex: 1,
    paddingVertical: 17,
    borderRadius: radii.pill,
    alignItems: 'center',
  },
  buttonOutline: {
    borderWidth: 1,
    borderColor: 'rgba(238, 110, 62, 0.4)',
  },
  buttonFilled: {
    backgroundColor: colors.fire,
  },
  buttonLabel: {
    fontFamily: fonts.medium,
    fontSize: 16,
  },
  buttonLabelOutline: {
    color: colors.fire,
  },
  buttonLabelFilled: {
    color: colors.onFire,
  },
})
