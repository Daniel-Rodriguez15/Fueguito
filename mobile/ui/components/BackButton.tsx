import { Pressable, StyleSheet, Text } from 'react-native'
import { colors } from '../theme'

export function BackButton({ onBack }: { onBack: () => void }) {
  return (
    <Pressable onPress={onBack} style={styles.button} hitSlop={12}>
      <Text style={styles.label}>← Volver</Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  button: {
    alignSelf: 'flex-start',
    paddingVertical: 4,
  },
  label: {
    color: colors.textDim,
    fontSize: 16,
  },
})
