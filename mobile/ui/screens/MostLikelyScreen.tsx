import { useMemo, useState } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import type { RandomSource } from '@/domain/random'
import { createShuffledDeck } from '@/domain/simple-deck'
import { MOST_LIKELY_QUESTIONS } from '@/infrastructure/most-likely-questions'
import { BackButton } from '../components/BackButton'
import { colors, radius } from '../theme'

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
            <Text style={styles.cardIcon}>👉</Text>
            <Text style={styles.question}>{question}</Text>
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
    color: colors.text,
    fontSize: 24,
    fontWeight: '700',
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
    borderColor: colors.border,
    borderRadius: radius,
    padding: 26,
    alignItems: 'center',
    gap: 14,
  },
  cardIcon: {
    fontSize: 36,
  },
  question: {
    color: colors.text,
    fontSize: 21,
    lineHeight: 30,
    textAlign: 'center',
    fontWeight: '600',
  },
  actionRow: {
    alignItems: 'center',
    paddingBottom: 16,
  },
  drawButton: {
    backgroundColor: colors.fire,
    paddingVertical: 15,
    paddingHorizontal: 48,
    borderRadius: radius,
  },
  drawLabel: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
  },
})
