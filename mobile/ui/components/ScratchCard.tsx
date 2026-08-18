import { useMemo, useRef, useState } from 'react'
import { Animated, PanResponder, StyleSheet, Text, Vibration, View } from 'react-native'
import type { ReactNode } from 'react'
import * as Haptics from 'expo-haptics'
import Svg, { Defs, LinearGradient, Mask, Path, Rect, Stop } from 'react-native-svg'
import { colors } from '../theme'

const BRUSH_WIDTH = 46
const REVEAL_THRESHOLD = 0.45
const COVERAGE_COLS = 8
const COVERAGE_ROWS = 10
const MIN_POINT_DISTANCE = 5
const FADE_OUT_MS = 350

interface Point {
  readonly x: number
  readonly y: number
}

function strokePath(stroke: readonly Point[]): string {
  if (stroke.length === 0) {
    return ''
  }
  const [first, ...rest] = stroke
  // A lone tap still paints a dot thanks to the round line cap.
  if (rest.length === 0) {
    return `M${first.x} ${first.y} L${first.x + 0.1} ${first.y}`
  }
  return `M${first.x} ${first.y} ${rest.map((p) => `L${p.x} ${p.y}`).join(' ')}`
}

/**
 * Scratch-off foil: an SVG cover erased by continuous brush strokes that
 * follow the finger. Past the threshold it fades out with a haptic tick.
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
  const [strokes, setStrokes] = useState<ReadonlyArray<readonly Point[]>>([])
  const [gone, setGone] = useState(false)
  const strokesRef = useRef<Point[][]>([])
  const pointCountRef = useRef(0)
  const coverageRef = useRef<Set<number>>(new Set())
  const revealedRef = useRef(false)
  const fade = useRef(new Animated.Value(1)).current

  const panResponder = useMemo(() => {
    const addPoint = (x: number, y: number, newStroke: boolean) => {
      if (revealedRef.current || x < 0 || y < 0 || x > width || y > height) {
        return
      }
      if (newStroke) {
        strokesRef.current.push([{ x, y }])
      } else {
        const current = strokesRef.current[strokesRef.current.length - 1]
        if (!current) {
          strokesRef.current.push([{ x, y }])
        } else {
          const last = current[current.length - 1]
          if (Math.hypot(x - last.x, y - last.y) < MIN_POINT_DISTANCE) {
            return
          }
          current.push({ x, y })
        }
      }
      setStrokes(strokesRef.current.map((stroke) => [...stroke]))

      pointCountRef.current += 1
      if (pointCountRef.current % 6 === 0) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {})
      }

      const col = Math.min(COVERAGE_COLS - 1, Math.floor((x / width) * COVERAGE_COLS))
      const row = Math.min(COVERAGE_ROWS - 1, Math.floor((y / height) * COVERAGE_ROWS))
      coverageRef.current.add(row * COVERAGE_COLS + col)
      if (coverageRef.current.size / (COVERAGE_COLS * COVERAGE_ROWS) >= REVEAL_THRESHOLD) {
        revealedRef.current = true
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {})
        Vibration.vibrate(120)
        Animated.timing(fade, {
          toValue: 0,
          duration: FADE_OUT_MS,
          useNativeDriver: true,
        }).start(() => {
          setGone(true)
          onRevealed()
        })
      }
    }

    return PanResponder.create({
      onStartShouldSetPanResponder: () => !revealedRef.current,
      onMoveShouldSetPanResponder: () => !revealedRef.current,
      onPanResponderGrant: (event) =>
        addPoint(event.nativeEvent.locationX, event.nativeEvent.locationY, true),
      onPanResponderMove: (event) =>
        addPoint(event.nativeEvent.locationX, event.nativeEvent.locationY, false),
    })
  }, [width, height, onRevealed, fade])

  return (
    <View style={{ width, height }}>
      {children}
      {!gone && (
        <Animated.View style={[StyleSheet.absoluteFill, { opacity: fade }]} {...panResponder.panHandlers}>
          <Svg width={width} height={height} pointerEvents="none">
            <Defs>
              <LinearGradient id="foil" x1="0" y1="0" x2="1" y2="1">
                <Stop offset="0" stopColor="#8a6273" />
                <Stop offset="0.45" stopColor="#6d4d5d" />
                <Stop offset="0.55" stopColor="#7d5a6b" />
                <Stop offset="1" stopColor="#553a49" />
              </LinearGradient>
              <Mask id="scratch">
                <Rect x={0} y={0} width={width} height={height} fill="#fff" />
                {strokes.map((stroke, index) => (
                  <Path
                    key={index}
                    d={strokePath(stroke)}
                    stroke="#000"
                    strokeWidth={BRUSH_WIDTH}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
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
          {strokes.length === 0 && (
            <View style={styles.hintWrap} pointerEvents="none">
              <Text style={styles.hintIcon}>🎁</Text>
              <Text style={styles.hint}>Raspa con el dedo</Text>
            </View>
          )}
        </Animated.View>
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
