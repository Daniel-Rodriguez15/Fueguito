import { StyleSheet, Text, View } from 'react-native'
import Svg, { Defs, LinearGradient, Path, Stop } from 'react-native-svg'
import { colors } from '../theme'

const FLAME_PATH =
  'M12 1 C15 6 19 10 19 16 C19 21.4 15.9 25 12 25 C8.1 25 5 21.4 5 16 C5 12.4 6.8 9.8 8.6 7 C9.3 8.9 10.5 9.6 11 7.8 C11.5 5.8 11.6 3.6 12 1 Z'

/**
 * Duolingo-style flame. Filled variant encloses an optional label;
 * outline variant marks "today, still unplayed".
 */
export function Flame({
  size = 26,
  label,
  variant = 'filled',
  intensity = 0,
}: {
  size?: number
  label?: string
  variant?: 'filled' | 'outline' | 'dim'
  intensity?: number
}) {
  const height = size * (26 / 24)
  // Hotter gradient as the streak grows.
  const hot = Math.min(intensity, 30) / 30
  const top = variant === 'filled' ? blend('#F79068', '#EE6E3E', hot) : 'transparent'
  const bottom = variant === 'filled' ? blend('#EE6E3E', '#C24E28', hot) : 'transparent'

  return (
    <View style={[styles.wrap, { width: size, height }]}>
      <Svg width={size} height={height} viewBox="0 0 24 26">
        <Defs>
          <LinearGradient id="flame" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={top} />
            <Stop offset="1" stopColor={bottom} />
          </LinearGradient>
        </Defs>
        <Path
          d={FLAME_PATH}
          fill={variant === 'filled' ? 'url(#flame)' : 'none'}
          stroke={variant === 'outline' ? colors.fire : variant === 'dim' ? colors.border : 'none'}
          strokeWidth={variant === 'filled' ? 0 : 1.8}
        />
      </Svg>
      {label !== undefined && (
        <Text
          style={[
            styles.label,
            // Anchor the text to the flame belly's visual center (y ≈ 16/26).
            { fontSize: size * 0.42, lineHeight: size * 0.5, top: size * 0.42 },
            variant !== 'filled' && styles.labelDim,
          ]}
        >
          {label}
        </Text>
      )}
    </View>
  )
}

function blend(from: string, to: string, t: number): string {
  const a = hex(from)
  const b = hex(to)
  const mix = a.map((v, i) => Math.round(v + (b[i] - v) * t))
  return `rgb(${mix[0]}, ${mix[1]}, ${mix[2]})`
}

function hex(color: string): number[] {
  return [1, 3, 5].map((i) => parseInt(color.slice(i, i + 2), 16))
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
    color: '#160D0A',
    fontWeight: '500',
    fontVariant: ['tabular-nums'],
    includeFontPadding: false,
  },
  labelDim: {
    color: colors.textDim,
    fontWeight: '400',
  },
})
