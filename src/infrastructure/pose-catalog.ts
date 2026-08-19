import type { FigurePosture, Pose, PoseCatalog, SpiceLevel } from '@/domain/pose'

/**
 * Fallback pictogram postures. Every pose in this catalog ships with real
 * artwork mapped by its scene key in the UI layer, so these only render if
 * an image is ever missing.
 */
const POSTURES: Readonly<Record<string, FigurePosture>> = {
  figureA: {
    head: { cx: 30, cy: 70, r: 8 },
    paths: [
      'M39 72 C50 74 60 76 70 78',
      'M70 78 C80 82 88 86 94 92',
      'M70 78 C78 86 82 92 84 98',
      'M48 73 C54 70 60 68 66 67',
    ],
  },
  figureB: {
    head: { cx: 110, cy: 70, r: 8 },
    paths: [
      'M101 72 C90 74 80 76 70 78',
      'M70 78 C62 84 58 90 56 96',
      'M70 78 C64 88 62 94 62 100',
      'M92 73 C86 70 80 68 74 67',
    ],
  },
}

const FALLBACK_ART = {
  a: 'figureA',
  b: 'figureB',
  arrangement: { dx: 0, dy: 0, rotation: 0, mirrored: false },
} as const

// [scene/slug, name, description, howTo, spice]
type PoseDef = readonly [string, string, string, string, SpiceLevel]

const POSE_DEFS: readonly PoseDef[] = [
  // 1. Clásicos
  ['misionero-el', 'Misionero (él encima)', 'El clásico de los clásicos, cara a cara', 'Ella acostada boca arriba; él encima, apoyado en los brazos.', 1],
  ['misionero-ella', 'Misionero (ella encima)', 'El clásico invertido: ella toma el mando', 'Él acostado boca arriba; ella se recuesta encima, cara a cara.', 1],
  ['molinillo', 'Molinillo de Viento', 'Un giro inesperado sobre el clásico', 'Él encima pero girado, con las piernas hacia los hombros de ella.', 2],
  ['amazona-silla', 'Amazona en Silla', 'Ella reina, la silla es el trono', 'Él sentado en una silla; ella encima, de frente o de espaldas.', 2],
  // 2. Estimulación del clítoris
  ['vaquera', 'La Vaquera', 'Ella arriba, control total del ritmo', 'Él acostado; ella se sienta a horcajadas y marca el ritmo.', 2],
  ['perrito', 'El Perrito', 'Intenso, profundo y sin vueltas', 'Ella en cuatro apoyos; él de rodillas detrás.', 2],
  ['catapulta', 'La Catapulta', 'Piernas al hombro y puntería fina', 'Ella acostada con las piernas sobre los hombros de él, que va de rodillas.', 3],
  ['ventilador', 'El Ventilador', 'Ella de espaldas, apoyada y en ángulo', 'Ella de espaldas a él, inclinada hacia adelante con apoyo.', 2],
  ['montana-magica', 'La Montaña Mágica', 'Almohadas de por medio, ángulo perfecto', 'Ella boca abajo sobre una pila de almohadas; él detrás.', 2],
  // 3. Punto G / Punto P
  ['vaquera-reves', 'Vaquera del Revés', 'Ella arriba mirando hacia los pies', 'Él acostado; ella encima de espaldas, apoyada en las manos.', 2],
  ['doble-p', 'La Doble P', 'Placer y profundidad en un solo movimiento', 'Ella acostada de lado; él la abraza desde atrás elevándole una pierna.', 3],
  // 4. Sexo oral
  ['sesenta-nueve', 'El 69', 'Dar y recibir, exactamente al mismo tiempo', 'Acostados en direcciones opuestas, cada boca a la altura del otro.', 3],
  ['sacacorchos', 'El Sacacorchos', 'De rodillas, con él de pie', 'Él de pie; ella de rodillas frente a él.', 3],
  ['silla-reina', 'La Silla de la Reina', 'Ella sentada sobre su cara: majestad total', 'Él acostado; ella se arrodilla sobre su boca, de frente.', 3],
  ['sirena', 'La Sirena', 'Piernas arriba, boca a la obra', 'Ella acostada con las caderas elevadas y piernas juntas hacia arriba; él la atiende.', 3],
  ['flautista', 'El Flautista', 'Un solo de flauta con él recostado', 'Él recostado y relajado; ella acostada entre sus piernas.', 3],
  // 5. Penetración profunda
  ['perrito-sofa', 'El Perrito en el Sofá', 'El respaldo del sofá, bien aprovechado', 'Ella arrodillada apoyada en el respaldo; él detrás de pie o de rodillas.', 3],
  ['borde-cama', 'Borde de la Cama', 'El filo de la cama como aliado', 'Ella acostada al borde con las piernas en alto; él de pie.', 3],
  ['ele', 'La L', 'Cuerpos en ángulo recto, encaje perfecto', 'Ella acostada con las piernas en L sobre él, que va de costado.', 3],
  ['profunda', 'La Profunda', 'El nombre lo dice todo', 'Ella acostada con las rodillas al pecho; él encima.', 3],
  // 6. Sexo anal
  ['cucharita-anal', 'Cucharita Anal', 'La cucharita, versión atrevida', 'De costado, él detrás de ella, bien pegados.', 3],
  ['vaquera-anal', 'Vaquera Anal', 'Ella arriba y al mando, versión atrevida', 'Él acostado; ella encima de espaldas controlando el ritmo.', 3],
  ['h-anal', 'La H Anal', 'De pie e inclinados, versión atrevida', 'Ella inclinada con apoyo; él de pie detrás.', 3],
  ['borde-cama-anal', 'Borde de la Cama Anal', 'El borde de la cama, versión atrevida', 'Ella boca abajo al borde de la cama; él de pie detrás.', 3],
  // 7. Especiales
  ['balancin', 'El Balancín', 'Un vaivén sentado, meciéndose juntos', 'Él sentado reclinado hacia atrás; ella encima, ambos se mecen.', 2],
  ['cucharita', 'La Cucharita Clásica', 'El abrazo de costado que nunca falla', 'De costado, mirando al mismo lado, él detrás de ella.', 1],
  ['cucharita-invertida', 'La Cucharita Invertida', 'Cucharita cara a cara', 'De costado, frente a frente, piernas entrelazadas.', 1],
  ['h', 'La H', 'De pie, ella inclinada: pura conexión', 'Ella de pie inclinada hacia adelante con apoyo; él de pie detrás.', 2],
  ['tijera', 'La Tijera', 'Piernas cruzadas en X, fricción precisa', 'Acostados, piernas entrelazadas en tijera, cuerpos en ángulo.', 2],
  ['ascensor', 'El Ascensor', 'Sostenida en el aire: fuerza y vértigo', 'Él de pie la sostiene; ella lo rodea con las piernas.', 3],
]

const POSES: readonly Pose[] = POSE_DEFS.map(([scene, name, description, howTo, spice]) => ({
  id: `pose-${scene}`,
  name,
  scene,
  description,
  howTo,
  spice,
  art: FALLBACK_ART,
}))

export function createStaticPoseCatalog(): PoseCatalog {
  return {
    getPoses: () => POSES,
    getPostures: () => POSTURES,
  }
}
