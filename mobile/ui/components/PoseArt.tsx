import { Image, StyleSheet, View } from 'react-native'
import type { Pose, PoseCatalog } from '@/domain/pose'
import { POSE_IMAGES } from '../pose-images'
import { PoseFigure } from './PoseFigure'

/** Illustration when the scene has one; vector pictogram fallback otherwise. */
export function PoseArt({
  pose,
  catalog,
  size = 160,
}: {
  pose: Pose
  catalog: PoseCatalog
  size?: number
}) {
  const image = POSE_IMAGES[pose.scene]
  if (!image) {
    return <PoseFigure art={pose.art} catalog={catalog} size={size} />
  }
  return (
    <View style={[styles.frame, { width: size, height: size * 0.8 }]}>
      <Image source={image} style={styles.image} resizeMode="contain" />
    </View>
  )
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
