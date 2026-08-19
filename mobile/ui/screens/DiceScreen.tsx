import { useEffect, useRef, useState } from 'react'
import { Animated, Easing, Pressable, StyleSheet, Text, View } from 'react-native'
import type { Pose, PoseCatalog } from '@/domain/pose'
import type { CollectionState } from '@/domain/pose-collection'
import type { RandomSource } from '@/domain/random'
import { randomIndex } from '@/domain/random'
import { rollActionZone, type ActionZoneRoll } from '@/domain/sex-dice'
import { BackButton } from '../components/BackButton'
import { PoseArt } from '../components/PoseArt'
import { SpiceDots } from '../components/SpiceDots'
import { colors, fonts, radii } from '../theme'

const ROLL_DURATION_MS = 600

type DiceMode = 'classic' | 'poses'

function TextDie({ label, value }: { label: string; value: string | null }) {
  return (
    <View style={styles.textDie}>
      <View style={styles.textDieCorner}>
        <View style={styles.textDiePip} />
      </View>
      <Text style={styles.textDieLabel}>{label}</Text>
      <Text style={styles.textDieValue}>{value ?? '—'}</Text>
      <View style={[styles.textDieCorner, styles.textDieCornerBottom]}>
        <View style={styles.textDiePip} />
      </View>
    </View>
  )
}

export function DiceScreen({
  random,
  catalog,
  collection,
  onBack,
  onGoToCollection,
  onActivity,
}: {
  random: RandomSource
  catalog: PoseCatalog
  collection: CollectionState
  onBack: () => void
  onGoToCollection: () => void
  onActivity: () => void
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
    onActivity()
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
      <Text style={styles.title}>Dados</Text>

      <View style={styles.modeRow}>
        <Pressable
          style={[styles.modeButton, mode === 'classic' && styles.modeButtonActive]}
          onPress={() => selectMode('classic')}
        >
          <Text style={[styles.modeLabel, mode === 'classic' && styles.modeLabelActive]}>Clásico</Text>
        </Pressable>
        <Pressable
          style={[styles.modeButton, mode === 'poses' && styles.modeButtonActive]}
          onPress={() => selectMode('poses')}
        >
          <Text style={[styles.modeLabel, mode === 'poses' && styles.modeLabelActive]}>Poses</Text>
        </Pressable>
      </View>

      <View style={styles.body}>
        {mode === 'classic' ? (
          <Animated.View style={[styles.classicRow, { transform: [{ rotate }] }]}>
            <TextDie label="Acción" value={roll?.action ?? null} />
            <TextDie label="Zona" value={roll?.zone ?? null} />
          </Animated.View>
        ) : canRollPoses ? (
          <Animated.View style={[styles.poseCard, { transform: [{ rotate }] }]}>
            {pose ? (
              <>
                <PoseArt pose={pose} catalog={catalog} size={170} animated />
                <Text style={styles.poseName}>{pose.name}</Text>
                <Text style={styles.poseDescription}>{pose.description}</Text>
                <Text style={styles.poseHowTo}>{pose.howTo}</Text>
                <SpiceDots spice={pose.spice} />
              </>
            ) : (
              <Text style={styles.hint}>Lanza el dado y que la suerte elija la pose</Text>
            )}
          </Animated.View>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.hint}>Todavía no tienen poses desbloqueadas.</Text>
            <Pressable style={styles.linkButton} onPress={onGoToCollection}>
              <Text style={styles.linkLabel}>Ir a la Colección</Text>
            </Pressable>
          </View>
        )}
      </View>

      {mode === 'classic' && roll && !rolling && (
        <Text style={styles.resultLine} accessibilityLiveRegion="polite">
          {roll.action} {roll.zone}
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
    fontFamily: fonts.display,
    color: colors.text,
    fontSize: 30,
    textAlign: 'center',
  },
  modeRow: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
  },
  modeButton: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: radii.pill,
    backgroundColor: colors.bgCard,
    borderWidth: 1,
    borderColor: colors.borderStrong,
  },
  modeButtonActive: {
    backgroundColor: colors.fire,
    borderColor: colors.fire,
  },
  modeLabel: {
    fontFamily: fonts.medium,
    color: colors.textDim,
    fontSize: 13,
  },
  modeLabelActive: {
    color: colors.onFire,
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
    width: 150,
    height: 170,
    borderRadius: radii.large,
    backgroundColor: colors.bgCard,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    padding: 14,
  },
  textDieCorner: {
    position: 'absolute',
    top: 10,
    left: 10,
  },
  textDieCornerBottom: {
    top: undefined,
    left: undefined,
    bottom: 10,
    right: 10,
  },
  textDiePip: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.fire,
  },
  textDieValue: {
    fontFamily: fonts.display,
    color: colors.text,
    fontSize: 26,
    lineHeight: 31,
    textAlign: 'center',
  },
  textDieLabel: {
    fontFamily: fonts.body,
    color: colors.textDim,
    fontSize: 11.5,
    textTransform: 'uppercase',
    letterSpacing: 2.3,
  },
  poseCard: {
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.bgCard,
    borderRadius: radii.medium,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 20,
    width: '100%',
  },
  poseName: {
    color: colors.text,
    fontSize: 22,
    fontFamily: fonts.medium,
  },
  poseDescription: {
    color: colors.textDim,
    textAlign: 'center',
  },
  poseHowTo: {
    color: colors.textDim,
    textAlign: 'center',
    fontSize: 12,
    fontStyle: 'italic',
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
    borderRadius: radii.medium,
    backgroundColor: colors.surface,
  },
  linkLabel: {
    color: colors.text,
    fontFamily: fonts.medium,
  },
  resultLine: {
    color: colors.text,
    fontSize: 18,
    fontFamily: fonts.medium,
    textAlign: 'center',
  },
  actionRow: {
    alignItems: 'center',
    paddingBottom: 16,
  },
  rollButton: {
    backgroundColor: colors.fire,
    paddingVertical: 17,
    paddingHorizontal: 48,
    borderRadius: radii.pill,
  },
  rollButtonDisabled: {
    opacity: 0.45,
  },
  rollLabel: {
    fontFamily: fonts.medium,
    color: colors.onFire,
    fontSize: 16,
  },
})
