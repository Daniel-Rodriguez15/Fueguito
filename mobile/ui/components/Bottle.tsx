import Svg, { Defs, LinearGradient, Path, Rect, Stop } from 'react-native-svg'

/** Glass bottle pictogram pointing up; the parent rotates it when spinning. */
export function Bottle({ width = 46 }: { width?: number }) {
  const height = width * (120 / 46)
  return (
    <Svg width={width} height={height} viewBox="0 0 46 120">
      <Defs>
        <LinearGradient id="glass" x1="0" y1="0" x2="1" y2="0">
          <Stop offset="0" stopColor="#4fb076" />
          <Stop offset="0.5" stopColor="#2e8a55" />
          <Stop offset="1" stopColor="#1d6a3e" />
        </LinearGradient>
        <LinearGradient id="cap" x1="0" y1="0" x2="1" y2="0">
          <Stop offset="0" stopColor="#f0c060" />
          <Stop offset="1" stopColor="#c78f2d" />
        </LinearGradient>
      </Defs>

      <Rect x={15} y={0} width={16} height={9} rx={3} fill="url(#cap)" />
      <Path
        d="M17 9 L17 30 C17 38 7 41 6 51 L6 104 Q6 118 23 118 Q40 118 40 104 L40 51 C39 41 29 38 29 30 L29 9 Z"
        fill="url(#glass)"
      />
      <Rect x={10} y={56} width={5} height={44} rx={2.5} fill="rgba(255, 255, 255, 0.3)" />
      <Rect x={11} y={62} width={24} height={26} rx={5} fill="#F3E9E2" />
      <Path
        d="M23 66 C24.5 68.5 26.5 70.5 26.5 73.5 C26.5 76.2 25 78 23 78 C21 78 19.5 76.2 19.5 73.5 C19.5 71.7 20.4 70.4 21.3 69 C21.7 70 22.3 70.3 22.5 69.4 C22.7 68.4 22.8 67.3 23 66 Z"
        fill="#EE6E3E"
      />
    </Svg>
  )
}
