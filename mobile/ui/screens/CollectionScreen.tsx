import { useEffect, useRef, useState } from 'react'
import { Animated, FlatList, Modal, Pressable, StyleSheet, Text, View } from 'react-native'
import type { PoseCollectionService } from '@/application/pose-collection-service'
import type { Pose, PoseCatalog } from '@/domain/pose'
import { unlockedCount, type CollectionState, type PoseRating } from '@/domain/pose-collection'
import { BackButton } from '../components/BackButton'
import { PoseFigure } from '../components/PoseFigure'
import { ScratchCard } from '../components/ScratchCard'
import { SpiceRating } from '../components/SpiceRating'
import { colors, radius } from '../theme'

const CARD_WIDTH = 260
const CARD_HEIGHT = 360

export function CollectionScreen({
  catalog,
  service,
  collection,
  ready,
  onCollectionChange,
  onBack,
}: {
  catalog: PoseCatalog
  service: PoseCollectionService
  collection: CollectionState
  ready: boolean
  onCollectionChange: (state: CollectionState) => void
  onBack: () => void
}) {
  const [fresh, setFresh] = useState<Pose | null>(null)
  const [scratchDone, setScratchDone] = useState(false)
  const [detail, setDetail] = useState<Pose | null>(null)
  const [unlocking, setUnlocking] = useState(false)

  const poses = catalog.getPoses()
  const total = poses.length
  const owned = unlockedCount(collection)

  const unlock = async () => {
    if (unlocking || !ready) {
      return
    }
    setUnlocking(true)
    try {
      const result = await service.unlock(collection)
      if (result) {
        onCollectionChange(result.state)
        setScratchDone(false)
        setFresh(result.pose)
      }
    } finally {
      setUnlocking(false)
    }
  }

  const rate = async (pose: Pose, rating: PoseRating) => {
    const next = await service.rate(collection, pose.id, rating)
    onCollectionChange(next)
  }

  const closeModal = () => {
    setFresh(null)
    setDetail(null)
  }

  const modalPose = fresh ?? detail
  const showContent = detail !== null || scratchDone

  return (
    <View style={styles.screen}>
      <BackButton onBack={onBack} />
      <Text style={styles.title}>Colección</Text>
      <Text style={styles.counter}>
        {owned} / {total} poses descubiertas
      </Text>

      <FlatList
        data={poses}
        keyExtractor={(pose) => pose.id}
        numColumns={3}
        columnWrapperStyle={styles.gridRow}
        contentContainerStyle={styles.grid}
        renderItem={({ item }) => {
          const entry = collection.entries[item.id]
          const isOwned = entry !== undefined
          return (
            <Pressable
              style={[styles.slot, !isOwned && styles.slotLocked]}
              onPress={isOwned ? () => setDetail(item) : undefined}
              accessibilityLabel={isOwned ? item.name : 'Pose bloqueada'}
            >
              {isOwned ? (
                <>
                  <PoseFigure art={item.art} catalog={catalog} size={72} />
                  <Text style={styles.slotName} numberOfLines={1}>
                    {item.name}
                  </Text>
                  <Text style={styles.slotRating}>
                    {entry.rating !== null ? '🔥'.repeat(entry.rating) : '· · ·'}
                  </Text>
                </>
              ) : (
                <Text style={styles.slotQuestion}>?</Text>
              )}
            </Pressable>
          )
        }}
      />

      <View style={styles.actionRow}>
        <Pressable
          style={[styles.unlockButton, (!ready || unlocking || owned >= total) && styles.unlockDisabled]}
          onPress={unlock}
          disabled={!ready || unlocking || owned >= total}
        >
          <Text style={styles.unlockLabel}>
            {owned >= total ? 'Colección completa 🏆' : 'Nueva pose 🎁'}
          </Text>
        </Pressable>
      </View>

      <Modal visible={modalPose !== null} transparent animationType="fade" onRequestClose={closeModal}>
        <View style={styles.modalBackdrop}>
          {modalPose && (
            <View style={styles.modalCard}>
              {fresh && !scratchDone ? (
                <ScratchCard
                  width={CARD_WIDTH}
                  height={CARD_HEIGHT}
                  onRevealed={() => setScratchDone(true)}
                >
                  <PoseReveal pose={modalPose} catalog={catalog} />
                </ScratchCard>
              ) : (
                <View style={{ width: CARD_WIDTH, height: CARD_HEIGHT }}>
                  <PoseReveal pose={modalPose} catalog={catalog} />
                </View>
              )}

              {fresh && scratchDone && <SuccessBanner />}

              {showContent && (
                <View style={styles.ratingBlock}>
                  <Text style={styles.ratingLabel}>¿Qué calificación le dan?</Text>
                  <SpiceRating
                    value={collection.entries[modalPose.id]?.rating ?? null}
                    onChange={(rating) => rate(modalPose, rating)}
                  />
                </View>
              )}

              <Pressable style={styles.closeButton} onPress={closeModal}>
                <Text style={styles.closeLabel}>{showContent ? 'Guardar y cerrar' : 'Cerrar'}</Text>
              </Pressable>
            </View>
          )}
        </View>
      </Modal>
    </View>
  )
}

function SuccessBanner() {
  const scale = useRef(new Animated.Value(0.3)).current
  const opacity = useRef(new Animated.Value(0)).current

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scale, { toValue: 1, friction: 4, tension: 80, useNativeDriver: true }),
      Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: true }),
    ]).start()
  }, [scale, opacity])

  return (
    <Animated.View style={[styles.successBanner, { opacity, transform: [{ scale }] }]}>
      <Text style={styles.successText}>🎉 ¡Nueva pose desbloqueada!</Text>
    </Animated.View>
  )
}

function PoseReveal({ pose, catalog }: { pose: Pose; catalog: PoseCatalog }) {
  return (
    <View style={styles.reveal}>
      <PoseFigure art={pose.art} catalog={catalog} size={170} />
      <Text style={styles.revealName}>{pose.name}</Text>
      <Text style={styles.revealDescription}>{pose.description}</Text>
      <Text style={styles.revealHowTo}>{pose.howTo}</Text>
      <Text style={styles.revealSpice}>{'🔥'.repeat(pose.spice)}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 20,
    gap: 12,
  },
  title: {
    color: colors.text,
    fontSize: 26,
    fontWeight: '700',
    textAlign: 'center',
  },
  counter: {
    color: colors.textDim,
    textAlign: 'center',
  },
  grid: {
    paddingBottom: 12,
    gap: 10,
  },
  gridRow: {
    gap: 10,
  },
  slot: {
    flex: 1,
    maxWidth: '32.5%',
    aspectRatio: 0.82,
    borderRadius: 14,
    backgroundColor: colors.bgCard,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    padding: 6,
  },
  slotLocked: {
    backgroundColor: colors.surface,
  },
  slotQuestion: {
    color: colors.textDim,
    fontSize: 34,
    fontWeight: '800',
  },
  slotName: {
    color: colors.text,
    fontSize: 11,
    fontWeight: '600',
  },
  slotRating: {
    color: colors.textDim,
    fontSize: 9,
  },
  actionRow: {
    alignItems: 'center',
    paddingBottom: 10,
  },
  unlockButton: {
    backgroundColor: colors.fire,
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: radius,
  },
  unlockDisabled: {
    opacity: 0.45,
  },
  unlockLabel: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  modalCard: {
    backgroundColor: colors.bg,
    borderRadius: radius,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 20,
    alignItems: 'center',
    gap: 16,
  },
  reveal: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: colors.bgCard,
    borderRadius: 16,
    padding: 14,
  },
  revealName: {
    color: colors.text,
    fontSize: 21,
    fontWeight: '700',
    textAlign: 'center',
  },
  revealDescription: {
    color: colors.textDim,
    textAlign: 'center',
    fontSize: 13,
  },
  revealHowTo: {
    color: colors.textDim,
    textAlign: 'center',
    fontSize: 11,
    fontStyle: 'italic',
  },
  revealSpice: {
    fontSize: 15,
  },
  successBanner: {
    backgroundColor: colors.fire,
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 18,
  },
  successText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 15,
  },
  ratingBlock: {
    alignItems: 'center',
    gap: 8,
  },
  ratingLabel: {
    color: colors.textDim,
  },
  closeButton: {
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: radius,
    backgroundColor: colors.surface,
  },
  closeLabel: {
    color: colors.text,
    fontWeight: '700',
  },
})
