import { StyleSheet, View } from 'react-native'
import { colors } from '../theme'

const PIPS_BY_VALUE: Record<number, readonly number[]> = {
  1: [4],
  2: [0, 8],
  3: [0, 4, 8],
  4: [0, 2, 6, 8],
  5: [0, 2, 4, 6, 8],
  6: [0, 2, 3, 5, 6, 8],
}

const CELLS = Array.from({ length: 9 }, (_, index) => index)

export function Die({ value }: { value: number | null }) {
  const pips = value === null ? [] : (PIPS_BY_VALUE[value] ?? [])
  return (
    <View
      style={styles.die}
      accessibilityRole="image"
      accessibilityLabel={value === null ? 'Dado sin lanzar' : `Dado: ${value}`}
    >
      {CELLS.map((cell) => (
        <View key={cell} style={styles.cell}>
          {pips.includes(cell) ? <View style={styles.pip} /> : null}
        </View>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  die: {
    width: 88,
    height: 88,
    padding: 10,
    borderRadius: 18,
    backgroundColor: '#f3edef',
    flexDirection: 'row',
    flexWrap: 'wrap',
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.45,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  cell: {
    width: '33.33%',
    height: '33.33%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pip: {
    width: 13,
    height: 13,
    borderRadius: 7,
    backgroundColor: colors.bgCard,
  },
})
