import { useMemo, useState } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import type { RandomSource } from '@/domain/random'
import { createShuffledDeck } from '@/domain/simple-deck'
import { MOST_LIKELY_QUESTIONS } from '@/infrastructure/most-likely-questions'
import { BackButton } from '../components/BackButton'
import { colors, fonts, radii } from '../theme'

export function MostLikelyScreen({
  random,
  onBack,
  onActivity,
}: {
  random: RandomSource
  onBack: () => void
  onActivity: () => void
}) {
  const deck = useMemo(() => createShuffledDeck(MOST_LIKELY_QUESTIONS, random), [random])
  const [question, setQuestion] = useState<string | null>(null)

  const draw = () => {
    setQuestion(deck.draw())
    onActivity()
  }

  return (
    <View style={styles.screen}>
      <BackButton onBack={onBack} />
      <Text style={styles.title}>¿Quién es más probable?</Text>

      <View style={styles.body}>
        {question ? (
          <View style={styles.card}>
            <Text style={styles.cardLabel}>¿Quién es más probable...?</Text>
            <Text style={styles.question}>{question.replace('¿Quién es más probable que ', '¿...que ')}</Text>
            <Text style={styles.hintSmall}>A la cuenta de tres, señalen al culpable</Text>
          </View>
        ) : (
          <Text style={styles.hint}>
            Saquen una carta y señalen al mismo tiempo. Sin apelaciones.
          </Text>
        )}
      </View>

      <View style={styles.actionRow}>
        <Pressable style={styles.drawButton} onPress={draw}>
          <Text style={styles.drawLabel}>{question ? 'Otra carta' : 'Sacar carta'}</Text>
        </Pressable>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 20,
    gap: 16,
  },
  title: {
    fontFamily: fonts.display,
    color: colors.text,
    fontSize: 30,
    textAlign: 'center',
  },
  body: {
    flex: 1,
    justifyContent: 'center',
  },
  hint: {
    color: colors.textDim,
    textAlign: 'center',
    fontSize: 16,
    paddingHorizontal: 12,
  },
  hintSmall: {
    color: colors.textDim,
    fontSize: 12,
  },
  card: {
    backgroundColor: colors.bgCard,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    borderRadius: radii.large,
    padding: 26,
    gap: 12,
  },
  cardLabel: {
    fontFamily: fonts.body,
    color: colors.textDim,
    fontSize: 11.5,
    letterSpacing: 2.3,
    textTransform: 'uppercase',
  },
  question: {
    fontFamily: fonts.display,
    color: colors.text,
    fontSize: 27,
    lineHeight: 34,
  },
  actionRow: {
    alignItems: 'center',
    paddingBottom: 16,
  },
  drawButton: {
    backgroundColor: colors.fire,
    paddingVertical: 17,
    paddingHorizontal: 48,
    borderRadius: radii.pill,
  },
  drawLabel: {
    fontFamily: fonts.medium,
    color: colors.onFire,
    fontSize: 16,
  },
})
