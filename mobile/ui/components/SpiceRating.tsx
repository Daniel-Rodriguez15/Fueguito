import { Pressable, StyleSheet, Text, View } from 'react-native'
import type { PoseRating } from '@/domain/pose-collection'

const VALUES: readonly PoseRating[] = [1, 2, 3, 4, 5]

/** 1-5 rating rendered as flames. */
export function SpiceRating({
  value,
  onChange,
  size = 28,
}: {
  value: PoseRating | null
  onChange?: (rating: PoseRating) => void
  size?: number
}) {
  return (
    <View style={styles.row} accessibilityRole="adjustable" accessibilityLabel="Calificación">
      {VALUES.map((rating) => (
        <Pressable
          key={rating}
          onPress={onChange ? () => onChange(rating) : undefined}
          disabled={!onChange}
          hitSlop={6}
        >
          <Text style={[styles.flame, { fontSize: size }, value !== null && rating <= value ? null : styles.off]}>
            🔥
          </Text>
        </Pressable>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 4,
  },
  flame: {
    opacity: 1,
  },
  off: {
    opacity: 0.25,
  },
})
