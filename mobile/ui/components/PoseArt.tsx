import { useEffect, useRef } from 'react'
import { Animated, Easing, Image, StyleSheet, View } from 'react-native'
import type { Pose, PoseCatalog } from '@/domain/pose'
import { POSE_IMAGES } from '../pose-images'
import { PoseFigure } from './PoseFigure'

/** Illustration when the scene has one; vector pictogram fallback otherwise. */
export function PoseArt({
  pose,
  catalog,
  size = 160,
  animated = false,
}: {
  pose: Pose
  catalog: PoseCatalog
  size?: number
  animated?: boolean
}) {
  const scale = useRef(new Animated.Value(animated ? 0.85 : 1)).current
  const float = useRef(new Animated.Value(0)).current

  useEffect(() => {
    if (!animated) {
      return
    }
    Animated.spring(scale, { toValue: 1, friction: 4, tension: 90, useNativeDriver: true }).start()
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(float, {
          toValue: 1,
          duration: 1400,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(float, {
          toValue: 0,
          duration: 1400,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    )
    loop.start()
    return () => {
      loop.stop()
      float.stopAnimation()
      scale.stopAnimation()
    }
  }, [animated, scale, float])

  const translateY = float.interpolate({ inputRange: [0, 1], outputRange: [0, -5] })
  const image = POSE_IMAGES[pose.scene]

  const content = image ? (
    <View style={[styles.frame, { width: size, height: size * 0.8 }]}>
      <Image source={image} style={styles.image} resizeMode="contain" />
    </View>
  ) : (
    <PoseFigure art={pose.art} catalog={catalog} size={size} />
  )

  if (!animated) {
    return content
  }
  return <Animated.View style={{ transform: [{ scale }, { translateY }] }}>{content}</Animated.View>
}

const styles = StyleSheet.create({
  frame: {
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#f6f1ea',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
})
