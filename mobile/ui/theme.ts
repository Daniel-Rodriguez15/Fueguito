/**
 * Fueguito brand tokens — manual de marca v1 (agosto 2026).
 * 80% warm blacks, 15% cream text, 5% ember accent. Violet only for
 * player 2 and Fueguito+. No shadows, hairline borders at 7% white.
 */
export const colors = {
  bg: '#100C0B',
  bgCard: '#1A1413',
  surface: '#15100F',
  text: '#F3E9E2',
  textDim: '#8A7A72',
  fire: '#EE6E3E',
  fireBright: '#F79068',
  onFire: '#160D0A',
  violet: '#9A6BE0',
  border: 'rgba(255, 255, 255, 0.07)',
  borderStrong: 'rgba(255, 255, 255, 0.1)',
  // Legacy aliases kept for gradual migration.
  fireDeep: '#EE6E3E',
  truth: '#EE6E3E',
  dare: '#9A6BE0',
} as const

export const fonts = {
  /** Instrument Serif: headings, cards, big numbers. Never below 24px. */
  display: 'InstrumentSerif_400Regular',
  displayItalic: 'InstrumentSerif_400Regular_Italic',
  /** DM Sans: the whole interface. Weights 400 and 500, never 700. */
  body: 'DMSans_400Regular',
  medium: 'DMSans_500Medium',
} as const

export const radii = {
  small: 12,
  medium: 18,
  large: 22,
  pill: 999,
} as const

/** Legacy alias: previous default corner radius. */
export const radius = radii.medium
