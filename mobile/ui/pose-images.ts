import type { ImageSourcePropType } from 'react-native'

/**
 * Scene illustrations from Wikimedia Commons (CC BY-SA / GFDL licensed).
 * Scenes without an entry fall back to the vector pictogram.
 */
export const POSE_IMAGES: Readonly<Record<string, ImageSourcePropType>> = {
  missionary: require('../assets/poses/missionary.png'),
  spoon: require('../assets/poses/spoon.png'),
  rider: require('../assets/poses/rider.png'),
  doggy: require('../assets/poses/doggy.png'),
  hugStand: require('../assets/poses/hugStand.png'),
  wallCarry: require('../assets/poses/wallCarry.png'),
  lotus: require('../assets/poses/lotus.png'),
  lapChair: require('../assets/poses/lapChair.png'),
  legsHigh: require('../assets/poses/legsHigh.png'),
  bridgeUp: require('../assets/poses/bridgeUp.png'),
  faceToFace: require('../assets/poses/faceToFace.png'),
  standBack: require('../assets/poses/standBack.png'),
}

export const POSE_IMAGE_CREDIT = 'Ilustraciones: Wikimedia Commons · CC BY-SA'
