import { useMemo, useRef, useState } from 'react'
import { PanResponder, StyleSheet, Text, View } from 'react-native'
import type { ReactNode } from 'react'
import { colors } from '../theme'

const GRID_COLS = 9
const GRID_ROWS = 11
const REVEAL_THRESHOLD = 0.55

/**
 * Scratch-off cover: a grid of opaque cells over the content that vanish
 * under the finger. Past the threshold the whole cover clears.
 */
export function ScratchCard({
  width,
  height,
  onRevealed,
  children,
}: {
  width: number
  height: number
  onRevealed: () => void
  children: ReactNode
}) {
  const [scratched, setScratched] = useState<ReadonlySet<number>>(new Set())
  const [revealed, setRevealed] = useState(false)
  const scratchedRef = useRef<Set<number>>(new Set())
  const revealedRef = useRef(false)

  const cellWidth = width / GRID_COLS
  const cellHeight = height / GRID_ROWS

  const panResponder = useMemo(() => {
    const scratchAt = (locationX: number, locationY: number) => {
      if (revealedRef.current) {
        return
      }
      const col = Math.floor(locationX / cellWidth)
      const row = Math.floor(locationY / cellHeight)
      if (col < 0 || col >= GRID_COLS || row < 0 || row >= GRID_ROWS) {
        return
      }
      const next = new Set(scratchedRef.current)
      for (const dc of [-1, 0, 1]) {
        for (const dr of [-1, 0, 1]) {
          const c = col + dc
          const r = row + dr
          if (c >= 0 && c < GRID_COLS && r >= 0 && r < GRID_ROWS) {
            next.add(r * GRID_COLS + c)
          }
        }
      }
      scratchedRef.current = next
      setScratched(next)
      if (next.size / (GRID_COLS * GRID_ROWS) >= REVEAL_THRESHOLD) {
        revealedRef.current = true
        setRevealed(true)
        onRevealed()
      }
    }

    return PanResponder.create({
      onStartShouldSetPanResponder: () => !revealedRef.current,
      onMoveShouldSetPanResponder: () => !revealedRef.current,
      onPanResponderGrant: (event) =>
        scratchAt(event.nativeEvent.locationX, event.nativeEvent.locationY),
      onPanResponderMove: (event) =>
        scratchAt(event.nativeEvent.locationX, event.nativeEvent.locationY),
    })
  }, [cellWidth, cellHeight, onRevealed])

  const cells = useMemo(() => Array.from({ length: GRID_COLS * GRID_ROWS }, (_, i) => i), [])

  return (
    <View style={{ width, height }}>
      {children}
      {!revealed && (
        <View style={StyleSheet.absoluteFill} {...panResponder.panHandlers}>
          <View style={styles.cover}>
            {cells.map((index) =>
              scratched.has(index) ? (
                <View key={index} style={{ width: cellWidth, height: cellHeight }} />
              ) : (
                <View
                  key={index}
                  style={[
                    styles.cell,
                    { width: cellWidth, height: cellHeight },
                    index % 3 === 0 && styles.cellAlt,
                  ]}
                />
              ),
            )}
          </View>
          {scratched.size === 0 && (
            <View style={styles.hintWrap} pointerEvents="none">
              <Text style={styles.hint}>Raspa con el dedo ✨</Text>
            </View>
          )}
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  cover: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    overflow: 'hidden',
    borderRadius: 16,
  },
  cell: {
    backgroundColor: '#6d5560',
  },
  cellAlt: {
    backgroundColor: '#7a5f6c',
  },
  hintWrap: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hint: {
    color: colors.text,
    fontWeight: '700',
    fontSize: 16,
  },
})
