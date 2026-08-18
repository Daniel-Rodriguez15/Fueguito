import { useMemo, useRef, useState } from 'react'
import { PanResponder, StyleSheet, Text, View } from 'react-native'
import type { ReactNode } from 'react'
import Svg, { Circle, Defs, LinearGradient, Mask, Rect, Stop } from 'react-native-svg'
import { colors } from '../theme'

const BRUSH_RADIUS = 22
const REVEAL_THRESHOLD = 0.5
const COVERAGE_COLS = 8
const COVERAGE_ROWS = 10
const MAX_POINTS = 400

interface Point {
  readonly x: number
  readonly y: number
}

/**
 * Scratch-off foil: an SVG cover erased through a mask of round brush
 * strokes that follow the finger. Past the threshold the cover clears.
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
  const [points, setPoints] = useState<readonly Point[]>([])
  const [revealed, setRevealed] = useState(false)
  const pointsRef = useRef<Point[]>([])
  const coverageRef = useRef<Set<number>>(new Set())
  const revealedRef = useRef(false)

  const panResponder = useMemo(() => {
    const scratchAt = (x: number, y: number) => {
      if (revealedRef.current || x < 0 || y < 0 || x > width || y > height) {
        return
      }
      if (pointsRef.current.length < MAX_POINTS) {
        pointsRef.current = [...pointsRef.current, { x, y }]
        setPoints(pointsRef.current)
      }
      const col = Math.min(COVERAGE_COLS - 1, Math.floor((x / width) * COVERAGE_COLS))
      const row = Math.min(COVERAGE_ROWS - 1, Math.floor((y / height) * COVERAGE_ROWS))
      coverageRef.current.add(row * COVERAGE_COLS + col)
      if (coverageRef.current.size / (COVERAGE_COLS * COVERAGE_ROWS) >= REVEAL_THRESHOLD) {
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
  }, [width, height, onRevealed])

  return (
    <View style={{ width, height }}>
      {children}
      {!revealed && (
        <View style={StyleSheet.absoluteFill} {...panResponder.panHandlers}>
          <Svg width={width} height={height} pointerEvents="none">
            <Defs>
              <LinearGradient id="foil" x1="0" y1="0" x2="1" y2="1">
                <Stop offset="0" stopColor="#8a6273" />
                <Stop offset="0.5" stopColor="#6d4d5d" />
                <Stop offset="1" stopColor="#553a49" />
              </LinearGradient>
              <Mask id="scratch">
                <Rect x={0} y={0} width={width} height={height} fill="#fff" />
                {points.map((point, index) => (
                  <Circle key={index} cx={point.x} cy={point.y} r={BRUSH_RADIUS} fill="#000" />
                ))}
              </Mask>
            </Defs>
            <Rect
              x={0}
              y={0}
              width={width}
              height={height}
              rx={16}
              fill="url(#foil)"
              mask="url(#scratch)"
            />
          </Svg>
          {points.length === 0 && (
            <View style={styles.hintWrap} pointerEvents="none">
              <Text style={styles.hintIcon}>🎁</Text>
              <Text style={styles.hint}>Raspa con el dedo</Text>
            </View>
          )}
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  hintWrap: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  hintIcon: {
    fontSize: 34,
  },
  hint: {
    color: colors.text,
    fontWeight: '700',
    fontSize: 16,
  },
})
