import { useEffect, useRef, useState } from 'react'
import { Animated, Easing, Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import { MIN_BOTTLE_PLAYERS, spinBottle } from '@/domain/bottle'
import type { RandomSource } from '@/domain/random'
import { BackButton } from '../components/BackButton'
import { Bottle } from '../components/Bottle'
import { colors, fonts, radii } from '../theme'

const SPIN_EXTRA_TURNS = 4
const SPIN_DURATION_MS = 3000
const CIRCLE_SIZE = 300
const CHIP_RADIUS = 128

export function BottleScreen({
  random,
  onBack,
  onActivity,
}: {
  random: RandomSource
  onBack: () => void
  onActivity: () => void
}) {
  const [players, setPlayers] = useState<string[]>([])
  const [name, setName] = useState('')
  const [spinning, setSpinning] = useState(false)
  const [pair, setPair] = useState<{ tip: number; base: number } | null>(null)
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
    setPair(null)
  }

  const removePlayer = (index: number) => {
    if (spinning) {
      return
    }
    setPlayers(players.filter((_, i) => i !== index))
    setPair(null)
  }

  const spin = () => {
    if (spinning || players.length < MIN_BOTTLE_PLAYERS) {
      return
    }
    const result = spinBottle(players.length, random)
    const anglePerPlayer = 360 / players.length
    const currentAngle = ((rotationRef.current % 360) + 360) % 360
    const delta = (result.tipIndex * anglePerPlayer - currentAngle + 360) % 360
    const nextRotation = rotationRef.current + SPIN_EXTRA_TURNS * 360 + delta

    setSpinning(true)
    setPair(null)
    onActivity()
    Animated.timing(rotation, {
      toValue: nextRotation,
      duration: SPIN_DURATION_MS,
      easing: Easing.bezier(0.2, 0.8, 0.2, 1),
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) {
        rotationRef.current = nextRotation
        setSpinning(false)
        setPair({ tip: result.tipIndex, base: result.baseIndex })
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
                pair?.tip === index && styles.chipChosen,
                pair?.base === index && styles.chipChosenBase,
              ]}
              onPress={() => removePlayer(index)}
              accessibilityRole="button"
              accessibilityLabel={`${player}, tocar para quitar`}
            >
              <Text
                style={[styles.chipLabel, (pair?.tip === index || pair?.base === index) && styles.chipLabelChosen]}
                numberOfLines={1}
              >
                {player}
              </Text>
            </Pressable>
          )
        })}
        <Animated.View style={[styles.bottle, { transform: [{ rotate }] }]}>
          <Bottle width={46} />
        </Animated.View>
      </View>

      {players.length < MIN_BOTTLE_PLAYERS ? (
        <Text style={styles.hint}>Agrega al menos {MIN_BOTTLE_PLAYERS} jugadores</Text>
      ) : (
        <Text style={styles.result} accessibilityLiveRegion="polite">
          {pair !== null ? `¡${players[pair.tip]} y ${players[pair.base]} se besan!` : ' '}
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
    fontFamily: fonts.display,
    color: colors.text,
    fontSize: 30,
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
    borderRadius: radii.medium,
    backgroundColor: colors.surface,
    color: colors.text,
  },
  addButton: {
    justifyContent: 'center',
    paddingHorizontal: 16,
    borderRadius: radii.medium,
    backgroundColor: colors.surface,
  },
  addLabel: {
    color: colors.text,
    fontFamily: fonts.medium,
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
  chipChosenBase: {
    backgroundColor: colors.violet,
  },
  chipLabel: {
    color: colors.text,
    fontSize: 13,
  },
  chipLabelChosen: {
    fontFamily: fonts.medium,
  },
  bottle: {
    alignItems: 'center',
  },
  hint: {
    color: colors.textDim,
    textAlign: 'center',
  },
  result: {
    color: colors.text,
    fontSize: 17,
    fontFamily: fonts.medium,
    textAlign: 'center',
    minHeight: 24,
  },
  actionRow: {
    alignItems: 'center',
    paddingBottom: 16,
  },
  spinButton: {
    backgroundColor: colors.fire,
    paddingVertical: 17,
    paddingHorizontal: 48,
    borderRadius: radii.pill,
  },
  spinButtonDisabled: {
    opacity: 0.45,
  },
  spinLabel: {
    fontFamily: fonts.medium,
    color: colors.onFire,
    fontSize: 16,
  },
})
