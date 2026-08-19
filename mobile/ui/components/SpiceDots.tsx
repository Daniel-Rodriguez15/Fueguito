import { StyleSheet, View } from 'react-native'
import { Flame } from './Flame'
import type { SpiceLevel } from '@/domain/pose'

/** Spice level 1-3 shown as brand flames. */
export function SpiceDots({ spice, size = 18 }: { spice: SpiceLevel; size?: number }) {
  return (
    <View style={styles.row}>
      {[1, 2, 3].map((level) => (
        <Flame key={level} size={size} variant={level <= spice ? 'filled' : 'dim'} />
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 4,
  },
})
