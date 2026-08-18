import { useEffect, useRef, useState } from 'react'
import { Animated, Easing, Pressable, StyleSheet, Text, View } from 'react-native'
import type { Pose, PoseCatalog } from '@/domain/pose'
import type { CollectionState } from '@/domain/pose-collection'
import type { RandomSource } from '@/domain/random'
import { randomIndex } from '@/domain/random'
import { rollActionZone, type ActionZoneRoll } from '@/domain/sex-dice'
import { BackButton } from '../components/BackButton'
import { PoseFigure } from '../components/PoseFigure'
import { colors, radius } from '../theme'

const ROLL_DURATION_MS = 600

type DiceMode = 'classic' | 'poses'

function TextDie({ label, value, hint }: { label: string; value: string | null; hint: string }) {
  return (
    <View style={styles.textDie}>
      <Text style={styles.textDieLabel}>{label}</Text>
      <Text style={styles.textDieValue}>{value ?? hint}</Text>
    </View>
  )
}

export function DiceScreen({
  random,
  catalog,
  collection,
  onBack,
  onGoToCollection,
}: {
  random: RandomSource
  catalog: PoseCatalog
  collection: CollectionState
  onBack: () => void
  onGoToCollection: () => void
}) {
  const [mode, setMode] = useState<DiceMode>('classic')
  const [roll, setRoll] = useState<ActionZoneRoll | null>(null)
  const [pose, setPose] = useState<Pose | null>(null)
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

  const unlockedPoses = catalog.getPoses().filter((p) => p.id in collection.entries)

  const startRoll = (onDone: () => void) => {
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
      onDone()
      setRolling(false)
    }, ROLL_DURATION_MS)
  }

  const rollClassic = () => startRoll(() => setRoll(rollActionZone(random)))

  const rollPose = () => {
    if (unlockedPoses.length === 0) {
      return
    }
    startRoll(() => setPose(unlockedPoses[randomIndex(unlockedPoses.length, random)]))
  }

  const selectMode = (next: DiceMode) => {
    if (rolling) {
      return
    }
    setMode(next)
  }

  const rotate = shake.interpolate({ inputRange: [-1, 1], outputRange: ['-5deg', '5deg'] })
  const canRollPoses = unlockedPoses.length > 0

  return (
    <View style={styles.screen}>
      <BackButton onBack={onBack} />
      <Text style={styles.title}>Dados Hot</Text>

      <View style={styles.modeRow}>
        <Pressable
          style={[styles.modeButton, mode === 'classic' && styles.modeButtonActive]}
          onPress={() => selectMode('classic')}
        >
          <Text style={styles.modeLabel}>🎲 Clásico</Text>
        </Pressable>
        <Pressable
          style={[styles.modeButton, mode === 'poses' && styles.modeButtonActive]}
          onPress={() => selectMode('poses')}
        >
          <Text style={styles.modeLabel}>🃏 Poses</Text>
        </Pressable>
      </View>

      <View style={styles.body}>
        {mode === 'classic' ? (
          <Animated.View style={[styles.classicRow, { transform: [{ rotate }] }]}>
            <TextDie label="Acción" value={roll?.action ?? null} hint="?" />
            <TextDie label="Zona" value={roll?.zone ?? null} hint="?" />
          </Animated.View>
        ) : canRollPoses ? (
          <Animated.View style={[styles.poseCard, { transform: [{ rotate }] }]}>
            {pose ? (
              <>
                <PoseFigure art={pose.art} catalog={catalog} size={170} />
                <Text style={styles.poseName}>{pose.name}</Text>
                <Text style={styles.poseDescription}>{pose.description}</Text>
                <Text style={styles.poseSpice}>{'🔥'.repeat(pose.spice)}</Text>
              </>
            ) : (
              <Text style={styles.hint}>Lanza el dado y que la suerte elija la pose</Text>
            )}
          </Animated.View>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.hint}>Todavía no tienen poses desbloqueadas.</Text>
            <Pressable style={styles.linkButton} onPress={onGoToCollection}>
              <Text style={styles.linkLabel}>Ir a la Colección 🎁</Text>
            </Pressable>
          </View>
        )}
      </View>

      {mode === 'classic' && roll && !rolling && (
        <Text style={styles.resultLine} accessibilityLiveRegion="polite">
          {roll.action} {roll.zone} 🔥
        </Text>
      )}

      <View style={styles.actionRow}>
        <Pressable
          style={[
            styles.rollButton,
            (rolling || (mode === 'poses' && !canRollPoses)) && styles.rollButtonDisabled,
          ]}
          onPress={mode === 'classic' ? rollClassic : rollPose}
          disabled={rolling || (mode === 'poses' && !canRollPoses)}
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
    gap: 16,
  },
  title: {
    color: colors.text,
    fontSize: 26,
    fontWeight: '700',
    textAlign: 'center',
  },
  modeRow: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
  },
  modeButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: radius,
    backgroundColor: colors.surface,
  },
  modeButtonActive: {
    backgroundColor: colors.fire,
  },
  modeLabel: {
    color: colors.text,
    fontWeight: '600',
  },
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  classicRow: {
    flexDirection: 'row',
    gap: 16,
  },
  textDie: {
    width: 140,
    height: 140,
    borderRadius: 22,
    backgroundColor: colors.bgCard,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 12,
  },
  textDieLabel: {
    color: colors.textDim,
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  textDieValue: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
  },
  poseCard: {
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.bgCard,
    borderRadius: radius,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 20,
    width: '100%',
  },
  poseName: {
    color: colors.text,
    fontSize: 22,
    fontWeight: '700',
  },
  poseDescription: {
    color: colors.textDim,
    textAlign: 'center',
  },
  poseSpice: {
    fontSize: 16,
  },
  emptyState: {
    alignItems: 'center',
    gap: 12,
  },
  hint: {
    color: colors.textDim,
    textAlign: 'center',
    fontSize: 16,
  },
  linkButton: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: radius,
    backgroundColor: colors.surface,
  },
  linkLabel: {
    color: colors.text,
    fontWeight: '700',
  },
  resultLine: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
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
