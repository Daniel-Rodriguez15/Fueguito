import Svg, { Circle, Line, Path, Rect } from 'react-native-svg'
import { colors } from '../theme'

export type GameIconId =
  | 'truth-or-dare'
  | 'dice'
  | 'collection'
  | 'most-likely'
  | 'roulette'
  | 'bottle'

const STROKE = 1.6

/**
 * Brand iconography: pure geometry on a 24px grid, 1.6px stroke, rounded
 * corners. One shape per game, a single filled dot as emphasis.
 */
export function GameIcon({ id, size = 30 }: { id: GameIconId; size?: number }) {
  const common = { fill: 'none', strokeWidth: STROKE } as const
  return (
    <Svg width={size} height={size} viewBox="0 0 26 26">
      {id === 'truth-or-dare' && (
        <>
          <Circle cx={10} cy={13} r={7.2} stroke={colors.fire} {...common} />
          <Circle cx={16.5} cy={13} r={7.2} stroke={colors.text} opacity={0.55} {...common} />
        </>
      )}
      {id === 'dice' && (
        <>
          <Rect x={4} y={4} width={18} height={18} rx={4.5} stroke={colors.fire} {...common} />
          <Circle cx={9.5} cy={9.5} r={1.7} fill={colors.text} />
          <Circle cx={13} cy={13} r={1.7} fill={colors.text} />
          <Circle cx={16.5} cy={16.5} r={1.7} fill={colors.text} />
        </>
      )}
      {id === 'collection' && (
        <Rect
          x={13}
          y={2.6}
          width={14.7}
          height={14.7}
          rx={3}
          transform="rotate(45 13 2.6)"
          stroke={colors.fire}
          {...common}
        />
      )}
      {id === 'most-likely' && (
        <>
          <Path d="M13 4 L22 20 L4 20 Z" stroke={colors.fire} strokeLinejoin="round" {...common} />
          <Circle cx={13} cy={15.5} r={1.7} fill={colors.text} />
        </>
      )}
      {id === 'roulette' && (
        <>
          <Circle cx={13} cy={13} r={9} stroke={colors.fire} {...common} />
          <Line x1={13} y1={13} x2={13} y2={7.5} stroke={colors.text} strokeWidth={STROKE} strokeLinecap="round" />
          <Line x1={13} y1={13} x2={17} y2={15} stroke={colors.fire} strokeWidth={STROKE} strokeLinecap="round" />
        </>
      )}
      {id === 'bottle' && (
        <>
          <Path
            d="M11 3.5 H15 V8 C17.5 9.5 19 12 19 15.5 C19 19.6 16.3 22.5 13 22.5 C9.7 22.5 7 19.6 7 15.5 C7 12 8.5 9.5 11 8 Z"
            stroke={colors.fire}
            strokeLinejoin="round"
            {...common}
          />
          <Circle cx={13} cy={15.5} r={1.7} fill={colors.text} />
        </>
      )}
    </Svg>
  )
}
