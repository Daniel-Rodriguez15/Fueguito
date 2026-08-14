import { useEffect, useRef, useState } from 'react'
import { Animated, Easing, Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import { MIN_BOTTLE_PLAYERS, spinBottle } from '@/domain/bottle'
import type { RandomSource } from '@/domain/random'
import { BackButton } from '../components/BackButton'
import { colors, radius } from '../theme'

const SPIN_EXTRA_TURNS = 4
const SPIN_DURATION_MS = 3000
const CIRCLE_SIZE = 300
const CHIP_RADIUS = 128

export function BottleScreen({ random, onBack }: { random: RandomSource; onBack: () => void }) {
  const [players, setPlayers] = useState<string[]>([])
  const [name, setName] = useState('')
  const [spinning, setSpinning] = useState(false)
  const [targetIndex, setTargetIndex] = useState<number | null>(null)
  const rotationRef = useRef(0)
  const rotation = useRef(new Animated.Value(0)).current

  useEffect(() => () => rotation.stopAnimation(), [rotation])

  const addPlayer = () => {
    const trimmed = name.trim()
    if (trimmed === '' || players.includes(trimmed)) {
      return
    }
    setPlayers([...players, trimmed])
    setName('')
    setTargetIndex(null)
  }

  const removePlayer = (index: number) => {
    if (spinning) {
      return
    }
    setPlayers(players.filter((_, i) => i !== index))
    setTargetIndex(null)
  }

  const spin = () => {
    if (spinning || players.length < MIN_BOTTLE_PLAYERS) {
      return
    }
    const { targetIndex: chosen } = spinBottle(players.length, random)
    const anglePerPlayer = 360 / players.length
    const currentAngle = ((rotationRef.current % 360) + 360) % 360
    const delta = (chosen * anglePerPlayer - currentAngle + 360) % 360
    const nextRotation = rotationRef.current + SPIN_EXTRA_TURNS * 360 + delta

    setSpinning(true)
    setTargetIndex(null)
    Animated.timing(rotation, {
      toValue: nextRotation,
      duration: SPIN_DURATION_MS,
      easing: Easing.bezier(0.2, 0.8, 0.2, 1),
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) {
        rotationRef.current = nextRotation
        setSpinning(false)
        setTargetIndex(chosen)
      }
    })
  }

  const anglePerPlayer = players.length > 0 ? 360 / players.length : 0
  const rotate = rotation.interpolate({ inputRange: [0, 360], outputRange: ['0deg', '360deg'] })

  return (
    <View style={styles.screen}>
      <BackButton onBack={onBack} />
      <Text style={styles.title}>Pico Botella</Text>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Nombre del jugador"
          accessibilityLabel="Nombre del jugador"
          placeholderTextColor={colors.textDim}
          maxLength={20}
          onSubmitEditing={addPlayer}
          submitBehavior="submit"
        />
        <Pressable style={styles.addButton} onPress={addPlayer}>
          <Text style={styles.addLabel}>Agregar</Text>
        </Pressable>
      </View>

      <View style={styles.circle}>
        {players.map((player, index) => {
          const angle = (index * anglePerPlayer * Math.PI) / 180
          const x = Math.sin(angle) * CHIP_RADIUS
          const y = -Math.cos(angle) * CHIP_RADIUS
          return (
            <Pressable
              key={player}
              style={[
                styles.chip,
                { transform: [{ translateX: x }, { translateY: y }] },
                targetIndex === index && styles.chipChosen,
              ]}
              onPress={() => removePlayer(index)}
              accessibilityRole="button"
              accessibilityLabel={`${player}, tocar para quitar`}
            >
              <Text
                style={[styles.chipLabel, targetIndex === index && styles.chipLabelChosen]}
                numberOfLines={1}
              >
                {player}
              </Text>
            </Pressable>
          )
        })}
        <Animated.View style={[styles.bottle, { transform: [{ rotate }] }]}>
          <View style={styles.bottleNeck} />
          <View style={styles.bottleBody} />
        </Animated.View>
      </View>

      {players.length < MIN_BOTTLE_PLAYERS ? (
        <Text style={styles.hint}>Agrega al menos {MIN_BOTTLE_PLAYERS} jugadores</Text>
      ) : (
        <Text style={styles.result} accessibilityLiveRegion="polite">
          {targetIndex !== null ? `La botella eligió a ${players[targetIndex]} 🔥` : ' '}
        </Text>
      )}

      <View style={styles.actionRow}>
        <Pressable
          style={[
            styles.spinButton,
            (spinning || players.length < MIN_BOTTLE_PLAYERS) && styles.spinButtonDisabled,
          ]}
          onPress={spin}
          disabled={spinning || players.length < MIN_BOTTLE_PLAYERS}
        >
          <Text style={styles.spinLabel}>{spinning ? 'Girando…' : 'Girar botella'}</Text>
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
    fontSize: 26,
    fontWeight: '700',
    textAlign: 'center',
  },
  form: {
    flexDirection: 'row',
    gap: 8,
  },
  input: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius,
    backgroundColor: colors.surface,
    color: colors.text,
  },
  addButton: {
    justifyContent: 'center',
    paddingHorizontal: 16,
    borderRadius: radius,
    backgroundColor: colors.surface,
  },
  addLabel: {
    color: colors.text,
    fontWeight: '600',
  },
  circle: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    flexGrow: 1,
  },
  chip: {
    position: 'absolute',
    maxWidth: 100,
    paddingVertical: 5,
    paddingHorizontal: 11,
    borderRadius: 999,
    backgroundColor: colors.surface,
  },
  chipChosen: {
    backgroundColor: colors.fire,
  },
  chipLabel: {
    color: colors.text,
    fontSize: 13,
  },
  chipLabelChosen: {
    fontWeight: '700',
  },
  bottle: {
    alignItems: 'center',
  },
  bottleNeck: {
    width: 14,
    height: 34,
    backgroundColor: '#2e7d4f',
    borderTopLeftRadius: 7,
    borderTopRightRadius: 7,
  },
  bottleBody: {
    width: 38,
    height: 82,
    backgroundColor: '#2f8a57',
    borderTopLeftRadius: 9,
    borderTopRightRadius: 9,
    borderBottomLeftRadius: 17,
    borderBottomRightRadius: 17,
  },
  hint: {
    color: colors.textDim,
    textAlign: 'center',
  },
  result: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '700',
    textAlign: 'center',
    minHeight: 24,
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
