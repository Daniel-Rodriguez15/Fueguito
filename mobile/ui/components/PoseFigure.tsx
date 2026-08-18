import Svg, { Circle, G, Line, Path } from 'react-native-svg'
import type { PoseArt, PoseCatalog } from '@/domain/pose'
import { colors } from '../theme'

const FIGURE_A_COLOR = colors.truth
const FIGURE_B_COLOR = colors.dare

function figureTransform(x: number, y: number, rotation: number, mirrored: boolean): string {
  const mirror = mirrored ? ' translate(100 0) scale(-1 1)' : ''
  return `translate(${x} ${y}) rotate(${rotation} 50 50)${mirror}`
}

function FigureGroup({
  postureId,
  catalog,
  color,
  transform,
}: {
  postureId: string
  catalog: PoseCatalog
  color: string
  transform: string
}) {
  const posture = catalog.getPostures()[postureId]
  if (!posture) {
    return null
  }
  return (
    <G transform={transform}>
      <Circle cx={posture.head.cx} cy={posture.head.cy} r={posture.head.r} fill={color} />
      {posture.paths.map((d) => (
        <Path
          key={d}
          d={d}
          stroke={color}
          strokeWidth={8}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      ))}
    </G>
  )
}

/** Minimalist two-figure pictogram for a pose, pure vector art. */
export function PoseFigure({
  art,
  catalog,
  size = 160,
}: {
  art: PoseArt
  catalog: PoseCatalog
  size?: number
}) {
  const { dx, dy, rotation, mirrored } = art.arrangement
  return (
    <Svg width={size} height={size * 0.85} viewBox="-10 -15 160 135">
      <Line
        x1={-2}
        y1={112}
        x2={142}
        y2={112}
        stroke={colors.border}
        strokeWidth={4}
        strokeLinecap="round"
      />
      <FigureGroup
        postureId={art.a}
        catalog={catalog}
        color={FIGURE_A_COLOR}
        transform={figureTransform(10, 10, 0, false)}
      />
      <FigureGroup
        postureId={art.b}
        catalog={catalog}
        color={FIGURE_B_COLOR}
        transform={figureTransform(10 + dx, 10 + dy, rotation, mirrored)}
      />
    </Svg>
  )
}
