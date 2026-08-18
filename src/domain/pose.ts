/**
 * A figure posture is a minimalist pictogram: a head plus stroked paths,
 * drawn in a 100x100 local coordinate space. Rendering is UI-layer work;
 * the domain only carries the data.
 */
export interface FigurePosture {
  readonly head: { readonly cx: number; readonly cy: number; readonly r: number }
  readonly paths: readonly string[]
}

/** Placement of the second figure relative to the first. */
export interface FigureArrangement {
  readonly dx: number
  readonly dy: number
  readonly rotation: number
  readonly mirrored: boolean
}

export type SpiceLevel = 1 | 2 | 3

export interface PoseArt {
  readonly a: string
  readonly b: string
  readonly arrangement: FigureArrangement
}

export interface Pose {
  readonly id: string
  readonly name: string
  /** Scene archetype key; UIs may map it to richer artwork. */
  readonly scene: string
  readonly description: string
  /** Short practical instructions on how to set up the pose. */
  readonly howTo: string
  readonly spice: SpiceLevel
  readonly art: PoseArt
}

/** Port: where the pose catalog comes from. Implemented in infrastructure. */
export interface PoseCatalog {
  getPoses(): readonly Pose[]
  getPostures(): Readonly<Record<string, FigurePosture>>
}
