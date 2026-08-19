import { Pressable, StyleSheet } from 'react-native'
import Svg, { Path } from 'react-native-svg'
import { colors } from '../theme'

export function BackButton({ onBack }: { onBack: () => void }) {
  return (
    <Pressable
      onPress={onBack}
      style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
      hitSlop={10}
      accessibilityRole="button"
      accessibilityLabel="Volver"
    >
      <Svg width={18} height={18} viewBox="0 0 18 18">
        <Path
          d="M11.5 3.5 L6 9 L11.5 14.5"
          stroke={colors.text}
          strokeWidth={2.4}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </Svg>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  button: {
    alignSelf: 'flex-start',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonPressed: {
    borderColor: colors.fire,
    backgroundColor: colors.bgCard,
  },
})
