import type { ImageSourcePropType } from 'react-native'

/**
 * Scene illustrations by Seedfeeder, Wikimedia Commons (CC BY-SA / GFDL).
 * One consistent style across the whole catalog; scenes without an entry
 * fall back to the vector pictogram.
 */
export const POSE_IMAGES: Readonly<Record<string, ImageSourcePropType>> = {
  missionary: require('../assets/poses/missionary.png'),
  spoon: require('../assets/poses/spoon.png'),
  rider: require('../assets/poses/rider.png'),
  doggy: require('../assets/poses/doggy.png'),
  hugStand: require('../assets/poses/hugStand.png'),
  lapChair: require('../assets/poses/lapChair.png'),
  bridgeUp: require('../assets/poses/bridgeUp.png'),
  faceToFace: require('../assets/poses/faceToFace.png'),
  sixtynine: require('../assets/poses/sixtynine.png'),
}

export const POSE_IMAGE_CREDIT = 'Ilustraciones: Seedfeeder · Wikimedia Commons · CC BY-SA'
