import { useEffect, useMemo, useRef, useState } from 'react'
import { Animated, Pressable, StyleSheet, Text, Vibration, View } from 'react-native'
import type { RandomSource } from '@/domain/random'
import { createShuffledDeck } from '@/domain/simple-deck'
import { ROULETTE_CHALLENGES, type RouletteChallenge } from '@/infrastructure/roulette-challenges'
import { BackButton } from '../components/BackButton'
import { colors, radius } from '../theme'

export function RouletteScreen({
  random,
  onBack,
  onActivity,
}: {
  random: RandomSource
  onBack: () => void
  onActivity: () => void
}) {
  const deck = useMemo(() => createShuffledDeck(ROULETTE_CHALLENGES, random), [random])
  const [challenge, setChallenge] = useState<RouletteChallenge | null>(null)
  const [secondsLeft, setSecondsLeft] = useState(0)
  const [running, setRunning] = useState(false)
  const progress = useRef(new Animated.Value(1)).current
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(
    () => () => {
      if (timerRef.current !== null) {
        clearInterval(timerRef.current)
      }
      progress.stopAnimation()
    },
    [progress],
  )

  const stopTimer = () => {
    if (timerRef.current !== null) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }

  const spin = () => {
    stopTimer()
    const next = deck.draw()
    setChallenge(next)
    setSecondsLeft(next.seconds)
    setRunning(true)
    onActivity()
    progress.setValue(1)
    Animated.timing(progress, {
      toValue: 0,
      duration: next.seconds * 1000,
      useNativeDriver: false,
    }).start()
    timerRef.current = setInterval(() => {
      setSecondsLeft((current) => {
        if (current <= 1) {
          stopTimer()
          setRunning(false)
          Vibration.vibrate([0, 200, 120, 200])
          return 0
        }
        return current - 1
      })
    }, 1000)
  }

  const barWidth = progress.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] })

  return (
    <View style={styles.screen}>
      <BackButton onBack={onBack} />
      <Text style={styles.title}>Ruleta Rápida</Text>

      <View style={styles.body}>
        {challenge ? (
          <View style={styles.card}>
            <Text style={styles.challenge}>{challenge.text}</Text>
            <Text style={[styles.timer, secondsLeft === 0 && styles.timerDone]}>
              {secondsLeft > 0 ? `${secondsLeft}s` : '¡Tiempo! 🔥'}
            </Text>
            <View style={styles.track}>
              <Animated.View style={[styles.fill, { width: barWidth }]} />
            </View>
          </View>
        ) : (
          <Text style={styles.hint}>
            Un reto corto, un temporizador y cero excusas. Giren y cumplan.
          </Text>
        )}
      </View>

      <View style={styles.actionRow}>
        <Pressable
          style={[styles.spinButton, running && styles.spinButtonDisabled]}
          onPress={spin}
          disabled={running}
        >
          <Text style={styles.spinLabel}>
            {running ? 'En curso…' : challenge ? 'Otro reto' : 'Girar'}
          </Text>
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
  card: {
    backgroundColor: colors.bgCard,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius,
    padding: 26,
    alignItems: 'center',
    gap: 18,
  },
  challenge: {
    color: colors.text,
    fontSize: 21,
    lineHeight: 30,
    textAlign: 'center',
    fontWeight: '600',
  },
  timer: {
    color: colors.fire,
    fontSize: 42,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
  },
  timerDone: {
    color: colors.dare,
    fontSize: 30,
  },
  track: {
    width: '100%',
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.surface,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: colors.fire,
  },
  actionRow: {
    alignItems: 'center',
    paddingBottom: 16,
  },
  spinButton: {
    backgroundColor: colors.fire,
    paddingVertical: 15,
    paddingHorizontal: 48,
    borderRadius: radius,
  },
  spinButtonDisabled: {
    opacity: 0.45,
  },
  spinLabel: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
  },
})
