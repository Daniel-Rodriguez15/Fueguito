import { Pressable, StyleSheet, View } from 'react-native'
import type { PoseRating } from '@/domain/pose-collection'
import { Flame } from './Flame'

const VALUES: readonly PoseRating[] = [1, 2, 3, 4, 5]

/** 1-5 rating rendered as brand flames. */
export function SpiceRating({
  value,
  onChange,
  size = 26,
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
          <Flame
            size={size}
            variant={value !== null && rating <= value ? 'filled' : 'dim'}
            intensity={value ?? 0}
          />
        </Pressable>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 6,
  },
})
