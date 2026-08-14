import { useEffect, useRef, useState } from 'react'
import { Animated, Easing, Pressable, StyleSheet, Text, View } from 'react-native'
import { rollDice } from '@/domain/dice'
import type { RandomSource } from '@/domain/random'
import { BackButton } from '../components/BackButton'
import { Die } from '../components/Die'
import { colors, radius } from '../theme'

const ROLL_DURATION_MS = 600
const DICE_COUNTS = [1, 2] as const

export function DiceScreen({ random, onBack }: { random: RandomSource; onBack: () => void }) {
  const [count, setCount] = useState<number>(2)
  const [values, setValues] = useState<number[] | null>(null)
  const [rolling, setRolling] = useState(false)
  const shake = useRef(new Animated.Value(0)).current
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(
    () => () => {
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current)
      }
      shake.stopAnimation()
    },
    [shake],
  )

  const roll = () => {
    if (rolling) {
      return
    }
    setRolling(true)
    shake.setValue(0)
    Animated.loop(
      Animated.sequence([
        Animated.timing(shake, { toValue: 1, duration: 75, easing: Easing.linear, useNativeDriver: true }),
        Animated.timing(shake, { toValue: -1, duration: 150, easing: Easing.linear, useNativeDriver: true }),
        Animated.timing(shake, { toValue: 0, duration: 75, easing: Easing.linear, useNativeDriver: true }),
      ]),
    ).start()
    timerRef.current = setTimeout(() => {
      shake.stopAnimation()
      shake.setValue(0)
      setValues(rollDice(count, random))
      setRolling(false)
    }, ROLL_DURATION_MS)
  }

  const selectCount = (nextCount: number) => {
    if (rolling) {
      return
    }
    setCount(nextCount)
    setValues(null)
  }

  const rotate = shake.interpolate({ inputRange: [-1, 1], outputRange: ['-6deg', '6deg'] })
  const total = values && count > 1 ? values.reduce((sum, value) => sum + value, 0) : null

  return (
    <View style={styles.screen}>
      <BackButton onBack={onBack} />
      <Text style={styles.title}>Dados</Text>

      <View style={styles.countRow}>
        {DICE_COUNTS.map((option) => (
          <Pressable
            key={option}
            style={[styles.countButton, count === option && styles.countButtonActive]}
            onPress={() => selectCount(option)}
          >
            <Text style={styles.countLabel}>
              {option} {option === 1 ? 'dado' : 'dados'}
            </Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.body}>
        <Animated.View style={[styles.diceRow, { transform: [{ rotate }] }]}>
          {Array.from({ length: count }, (_, index) => (
            <Die key={index} value={values?.[index] ?? null} />
          ))}
        </Animated.View>
        <Text style={styles.total} accessibilityLiveRegion="polite">
          {total !== null ? `Total: ${total}` : ' '}
        </Text>
      </View>

      <View style={styles.actionRow}>
        <Pressable
          style={[styles.rollButton, rolling && styles.rollButtonDisabled]}
          onPress={roll}
          disabled={rolling}
        >
          <Text style={styles.rollLabel}>{rolling ? 'Rodando…' : 'Lanzar'}</Text>
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
  countRow: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
  },
  countButton: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: radius,
    backgroundColor: colors.surface,
  },
  countButtonActive: {
    backgroundColor: colors.fire,
  },
  countLabel: {
    color: colors.text,
    fontWeight: '600',
  },
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
  },
  diceRow: {
    flexDirection: 'row',
    gap: 20,
  },
  total: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '700',
    minHeight: 24,
  },
  actionRow: {
    alignItems: 'center',
    paddingBottom: 16,
  },
  rollButton: {
    backgroundColor: colors.fire,
    paddingVertical: 15,
    paddingHorizontal: 48,
    borderRadius: radius,
  },
  rollButtonDisabled: {
    opacity: 0.45,
  },
  rollLabel: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
  },
})
