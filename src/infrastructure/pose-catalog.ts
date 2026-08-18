import type { FigureArrangement, FigurePosture, Pose, PoseCatalog, SpiceLevel } from '@/domain/pose'

/**
 * Minimalist stick-figure postures in a 100x100 space: a head circle plus
 * round-stroked paths. Poses place two of them together via a hand-tuned
 * scene so the couple composition always reads clearly.
 */
const POSTURES: Readonly<Record<string, FigurePosture>> = {
  stand: {
    head: { cx: 50, cy: 13, r: 9 },
    paths: [
      'M50 22 C50 34 50 46 50 60',
      'M50 60 C46 74 44 84 41 95',
      'M50 60 C54 74 57 84 60 95',
      'M50 30 C44 38 40 46 37 53',
      'M50 30 C56 38 60 46 63 53',
    ],
  },
  lean: {
    head: { cx: 24, cy: 26, r: 9 },
    paths: [
      'M30 32 C40 38 48 46 53 56',
      'M53 56 C52 70 51 82 50 95',
      'M53 56 C58 69 61 81 64 93',
      'M36 38 C32 48 29 56 27 64',
    ],
  },
  kneel: {
    head: { cx: 50, cy: 24, r: 9 },
    paths: [
      'M50 33 C50 43 50 52 50 62',
      'M50 62 C56 69 58 76 58 84 L71 86',
      'M50 62 C44 69 42 76 42 84 L29 86',
      'M50 40 C45 46 41 52 38 58',
      'M50 40 C55 46 59 52 62 58',
    ],
  },
  allFours: {
    head: { cx: 20, cy: 42, r: 9 },
    paths: [
      'M29 47 C40 44 52 46 62 50',
      'M32 48 C31 58 30 66 29 76',
      'M62 50 C66 58 68 66 68 76',
      'M57 49 C59 60 59 68 58 77',
    ],
  },
  sit: {
    head: { cx: 36, cy: 28, r: 9 },
    paths: [
      'M38 37 C40 47 42 56 43 66',
      'M43 66 C55 68 68 70 80 71',
      'M40 44 C46 50 52 56 58 61',
    ],
  },
  lieBack: {
    head: { cx: 13, cy: 60, r: 9 },
    paths: [
      'M22 60 C34 58 46 58 58 60',
      'M58 60 C68 56 78 53 88 51',
      'M58 60 C68 62 78 64 88 66',
      'M32 60 C36 52 40 47 45 43',
    ],
  },
  legsUp: {
    head: { cx: 18, cy: 72, r: 9 },
    paths: [
      'M27 72 C37 70 47 68 57 68',
      'M57 68 C60 55 63 43 65 30',
      'M57 68 C64 57 70 46 76 36',
      'M34 72 C38 78 42 82 46 86',
    ],
  },
  bridge: {
    head: { cx: 15, cy: 74, r: 9 },
    paths: [
      'M23 71 C38 54 60 52 74 64',
      'M74 64 C73 74 72 84 71 93',
      'M74 64 C78 73 81 82 84 91',
      'M27 74 C28 80 29 86 30 93',
    ],
  },
  straddle: {
    head: { cx: 50, cy: 18, r: 9 },
    paths: [
      'M50 27 C50 36 50 45 50 54',
      'M50 54 C42 58 36 62 33 68 C33 76 34 82 35 88',
      'M50 54 C58 58 64 62 67 68 C67 76 66 82 65 88',
      'M50 34 C44 40 39 45 36 50',
      'M50 34 C56 40 61 45 64 50',
    ],
  },
  wrap: {
    head: { cx: 45, cy: 15, r: 9 },
    paths: [
      'M45 24 C46 36 47 48 48 58',
      'M48 58 C40 52 33 49 27 49',
      'M48 58 C41 60 34 63 29 67',
      'M45 31 C51 37 56 42 60 46',
    ],
  },
  recline: {
    head: { cx: 28, cy: 34, r: 9 },
    paths: [
      'M32 42 C38 50 43 58 47 66',
      'M35 47 C30 55 26 62 23 70',
      'M47 66 C58 70 68 73 78 76',
      'M47 66 C57 74 65 79 74 84',
    ],
  },
}

interface Scene {
  readonly a: string
  readonly b: string
  readonly arrangement: FigureArrangement
  readonly howTo: string
}

/** Hand-tuned couple compositions; every pose maps to one of these. */
const SCENES: Readonly<Record<string, Scene>> = {
  missionary: {
    a: 'lieBack',
    b: 'allFours',
    arrangement: { dx: 2, dy: -26, rotation: 0, mirrored: false },
    howTo: 'Quien está abajo se acuesta boca arriba; su pareja se apoya encima sobre las manos.',
  },
  spoon: {
    a: 'lieBack',
    b: 'lieBack',
    arrangement: { dx: 10, dy: -18, rotation: 0, mirrored: false },
    howTo: 'De costado, ambos mirando hacia el mismo lado, uno pegado detrás del otro.',
  },
  rider: {
    a: 'lieBack',
    b: 'straddle',
    arrangement: { dx: 10, dy: -24, rotation: 0, mirrored: false },
    howTo: 'Una persona acostada boca arriba; la otra se sienta a horcajadas encima.',
  },
  doggy: {
    a: 'allFours',
    b: 'kneel',
    arrangement: { dx: 34, dy: -6, rotation: 0, mirrored: false },
    howTo: 'Una persona en cuatro apoyos; la otra de rodillas detrás.',
  },
  hugStand: {
    a: 'stand',
    b: 'stand',
    arrangement: { dx: 20, dy: 0, rotation: 0, mirrored: true },
    howTo: 'De pie, frente a frente, cuerpo contra cuerpo.',
  },
  wallCarry: {
    a: 'stand',
    b: 'wrap',
    arrangement: { dx: 12, dy: -2, rotation: 0, mirrored: true },
    howTo: 'De pie contra una pared; una persona rodea a la otra con las piernas.',
  },
  lotus: {
    a: 'sit',
    b: 'straddle',
    arrangement: { dx: 0, dy: -14, rotation: 0, mirrored: false },
    howTo: 'Sentados frente a frente, piernas entrelazadas, meciéndose juntos.',
  },
  lapChair: {
    a: 'sit',
    b: 'straddle',
    arrangement: { dx: 6, dy: -18, rotation: 0, mirrored: true },
    howTo: 'Una persona sentada; la otra se sienta encima dándole la espalda.',
  },
  legsHigh: {
    a: 'legsUp',
    b: 'kneel',
    arrangement: { dx: 40, dy: -8, rotation: 0, mirrored: false },
    howTo: 'Una persona boca arriba con las piernas en alto; la otra de rodillas frente a ella.',
  },
  bridgeUp: {
    a: 'bridge',
    b: 'kneel',
    arrangement: { dx: 30, dy: -10, rotation: 0, mirrored: false },
    howTo: 'Una persona eleva las caderas en puente; la otra de rodillas entre sus piernas.',
  },
  faceToFace: {
    a: 'lieBack',
    b: 'lieBack',
    arrangement: { dx: 6, dy: -12, rotation: 0, mirrored: true },
    howTo: 'Acostados de costado, frente a frente, piernas entrelazadas.',
  },
  wheelbarrow: {
    a: 'allFours',
    b: 'stand',
    arrangement: { dx: 42, dy: -16, rotation: 0, mirrored: false },
    howTo: 'Una persona en cuatro apoyos; la otra, de pie, la sostiene por las piernas.',
  },
  throne: {
    a: 'recline',
    b: 'straddle',
    arrangement: { dx: 10, dy: -16, rotation: 0, mirrored: false },
    howTo: 'Una persona reclinada apoyada en los brazos; la otra se sienta encima.',
  },
  standBack: {
    a: 'lean',
    b: 'stand',
    arrangement: { dx: 30, dy: -4, rotation: 0, mirrored: false },
    howTo: 'Una persona inclinada hacia adelante con apoyo; la otra de pie detrás.',
  },
}

// [name, description, spice, scene]
type PoseDef = readonly [string, string, SpiceLevel, string]

const POSE_DEFS: readonly PoseDef[] = [
  ['El Clásico', 'Cara a cara, sin apuro y con todo el contacto', 1, 'missionary'],
  ['La Cucharita', 'De costado, un abrazo que sube de temperatura', 1, 'spoon'],
  ['La Amazona', 'Una persona guía desde arriba, la otra disfruta la vista', 2, 'rider'],
  ['El Perrito', 'Un clásico intenso, en cuatro apoyos', 2, 'doggy'],
  ['El Loto', 'Sentados, entrelazados, respirando al mismo ritmo', 1, 'lotus'],
  ['La Silla', 'Una persona sentada, la otra toma el control encima', 2, 'lapChair'],
  ['El Abrazo de Pie', 'De pie, cuerpo contra cuerpo, sin escapatoria', 1, 'hugStand'],
  ['La Pared', 'De pie contra la pared, urgente y sin protocolo', 3, 'wallCarry'],
  ['El Puente', 'Caderas arriba: arquitectura al servicio del placer', 3, 'bridgeUp'],
  ['La Carretilla', 'Equilibrio, fuerza y mucha risa nerviosa', 3, 'wheelbarrow'],
  ['La V', 'Piernas arriba, ángulo de máxima cercanía', 3, 'legsHigh'],
  ['El Trono', 'Reclinado como en un trono, la otra persona reina igual', 2, 'throne'],
  ['La Mariposa', 'Al borde de la cama, piernas al vuelo', 3, 'legsHigh'],
  ['El Espejo', 'De costado, frente a frente, copiando cada gesto', 1, 'faceToFace'],
  ['El Columpio', 'Sostenidos en el aire, puro vértigo', 3, 'wallCarry'],
  ['La Siesta', 'Lento, perezoso y pegajoso como domingo de lluvia', 1, 'spoon'],
  ['El Jinete Invertido', 'De espaldas arriba: otra vista, otro mapa', 3, 'lapChair'],
  ['La Cobra', 'Una espalda que se arquea, unas manos que aprietan', 2, 'doggy'],
  ['El Sofá', 'El respaldo del sofá tiene usos no documentados', 2, 'standBack'],
  ['La Bailarina', 'Una pierna arriba, elegancia con picardía', 2, 'hugStand'],
  ['El Ancla', 'Bien agarrados: nadie se va a ninguna parte', 2, 'lotus'],
  ['La Ola', 'Un vaivén que empieza suave y termina tsunami', 2, 'missionary'],
  ['El Nudo', 'Piernas entrelazadas: matemáticamente inseparables', 2, 'faceToFace'],
  ['La Llave', 'Una pierna que cruza y cierra el candado', 2, 'spoon'],
  ['El Faro', 'De rodillas, erguidos, alumbrándose de cerca', 1, 'hugStand'],
  ['La Góndola', 'Remando juntos, despacio, hasta llegar', 2, 'throne'],
  ['El Tornillo', 'Piernas juntas hacia un lado: giro y presión', 3, 'legsHigh'],
  ['El Delfín', 'Caderas elevadas, un salto limpio al placer', 3, 'bridgeUp'],
  ['La Sirena', 'Piernas juntas y cuerpo de canto de sirena', 2, 'legsHigh'],
  ['El Volcán', 'Empieza dormido, termina en erupción', 3, 'rider'],
  ['La Luna', 'Curvados como luna creciente, encajan perfecto', 1, 'spoon'],
  ['El Amanecer', 'Despacio, con la luz entrando por la ventana', 1, 'missionary'],
  ['La Escalera', 'Un escalón de diferencia lo cambia todo', 2, 'standBack'],
  ['El Tobogán', 'Deslizarse lento, frenar está prohibido', 2, 'throne'],
  ['El Péndulo', 'Un ritmo que hipnotiza a los dos', 2, 'lotus'],
  ['La Balanza', 'Peso compartido, placer equilibrado', 2, 'lapChair'],
  ['El Compás', 'Una pierna extendida dibuja el círculo perfecto', 2, 'legsHigh'],
  ['La Tijera', 'Piernas cruzadas en X, fricción de precisión', 3, 'faceToFace'],
  ['El Arco', 'Espalda arqueada, cuerda tensa, flecha lista', 3, 'bridgeUp'],
  ['La Flecha', 'Directo al blanco, sin rodeos', 2, 'legsHigh'],
  ['El Reloj de Arena', 'Tomarse el tiempo: cada grano cuenta', 1, 'lotus'],
  ['La Copa', 'Brindis de cuerpos, borde con borde', 2, 'lotus'],
  ['El Candado', 'Piernas que abrazan y no sueltan', 2, 'missionary'],
  ['La Enredadera', 'Trepados uno al otro, creciendo juntos', 2, 'wallCarry'],
  ['El Trapecio', 'Confianza ciega y manos firmes', 3, 'throne'],
  ['La Cumbre', 'La cima se conquista de a dos', 3, 'legsHigh'],
  ['El Remolino', 'Giran, cambian, no se sueltan', 2, 'rider'],
  ['La Marea', 'Sube y baja con paciencia de océano', 1, 'spoon'],
  ['El Eclipse', 'Un cuerpo cubre al otro: sentidos al máximo', 2, 'missionary'],
  ['La Chispa', 'Corto, intenso, incendiario', 3, 'wallCarry'],
  ['El Fuego Cruzado', 'Atacan los dos al mismo tiempo, nadie se rinde', 3, 'lapChair'],
  ['La Fusión', 'Tan cerca que no se sabe dónde empieza cada uno', 2, 'lotus'],
  ['El Imán', 'Se separan un centímetro y vuelven a chocar', 2, 'hugStand'],
  ['La Órbita', 'Girar alrededor del otro hasta caer atraídos', 2, 'rider'],
  ['El Cometa', 'Aparece de repente y deja huella', 3, 'wheelbarrow'],
  ['La Galaxia', 'Constelación privada de dos estrellas', 1, 'faceToFace'],
  ['El Terremoto', 'Advertencia: mueve estructuras', 3, 'doggy'],
  ['La Tormenta', 'Truenos, relámpagos y sábanas revueltas', 3, 'legsHigh'],
  ['El Rayo', 'Fulminante: cae dos veces en el mismo lugar', 3, 'doggy'],
  ['La Brasa', 'Fuego lento que no se apaga nunca', 1, 'spoon'],
  ['El Horno', 'Precalentado desde la tarde', 2, 'standBack'],
  ['La Fogata', 'Alrededor del fuego, historias y manos inquietas', 1, 'lotus'],
  ['El Verano', 'Calor, piel y cero ropa de abrigo', 2, 'rider'],
  ['El Atardecer', 'La hora dorada también existe en la cama', 1, 'throne'],
  ['La Medianoche', 'Cuando la casa duerme, ustedes no', 2, 'missionary'],
  ['El Susurro', 'Todo al oído, todo despacio', 1, 'spoon'],
  ['La Caricia', 'Manos que memorizan cada centímetro', 1, 'missionary'],
  ['El Suspiro', 'El que se escapa sin permiso', 1, 'lotus'],
  ['La Tentación', 'Prohibido tocar... por ahora', 2, 'standBack'],
  ['El Deseo', 'Decirlo mirándose: sin palabras no vale', 2, 'hugStand'],
  ['La Locura', 'Improvisada, urgente, inolvidable', 3, 'wallCarry'],
  ['El Vértigo', 'Al borde de la cama, literal', 3, 'throne'],
  ['La Aventura', 'Fuera de la habitación: elijan el territorio', 3, 'standBack'],
  ['El Secreto', 'Ese que solo ustedes dos conocen', 2, 'spoon'],
  ['La Promesa', 'Anotada hoy, cumplida esta noche', 1, 'faceToFace'],
  ['El Capricho', 'Hoy manda una sola persona: obedecer', 3, 'rider'],
  ['La Travesura', 'Con culpa cero y sonrisa de más', 2, 'lapChair'],
  ['El Desafío', 'Quien se ría primero, pierde la ropa', 2, 'lotus'],
  ['La Conquista', 'Territorio nuevo, bandera plantada', 3, 'doggy'],
  ['El Hechizo', 'Imposible resistirse: magia de contacto', 2, 'missionary'],
  ['La Pasión', 'Sin coreografía: puro instinto', 3, 'missionary'],
  ['El Frenesí', 'Ritmo alto, pulso más alto', 3, 'doggy'],
  ['La Fiebre', 'Temperatura que no baja con nada', 3, 'legsHigh'],
  ['El Delirio', 'Perder la cabeza está permitido', 3, 'bridgeUp'],
  ['La Osadía', 'Eso que no se cuenta en la cena familiar', 3, 'wheelbarrow'],
  ['El Impulso', 'Sin pensar: tres, dos, uno', 2, 'hugStand'],
  ['La Descarga', 'Electricidad estática de cuerpos', 3, 'wallCarry'],
  ['El Choque', 'Frontal, con airbags desactivados', 3, 'lotus'],
  ['La Colisión', 'Dos trayectorias, un solo punto de impacto', 3, 'lapChair'],
  ['El Abismo', 'Mirarse al borde y saltar juntos', 2, 'throne'],
  ['La Cima', 'Se llega sin oxígeno y sin apuro', 3, 'rider'],
  ['El Límite', 'Hoy se corre un poquito más allá', 3, 'legsHigh'],
  ['La Frontera', 'Cruzarla requiere pasaporte mutuo', 2, 'doggy'],
  ['El Paraíso', 'No hace falta morirse para llegar', 2, 'spoon'],
  ['La Gloria', 'Aplausos internos garantizados', 3, 'bridgeUp'],
  ['El Éxtasis', 'La última carta del mazo por algo es', 3, 'rider'],
  ['La Confesión', 'Primero se dice, después se hace', 1, 'faceToFace'],
  ['El Regalo', 'Desenvolver despacio, sin romper el moño', 1, 'hugStand'],
  ['La Cosecha', 'Todo lo sembrado en la semana se cosecha hoy', 2, 'rider'],
  ['La Primera Vez', 'Como la primera vez, sabiendo todo lo que ya saben', 1, 'missionary'],
]

const POSES: readonly Pose[] = POSE_DEFS.map(([name, description, spice, sceneKey], index) => {
  const scene = SCENES[sceneKey]
  if (!scene) {
    throw new Error(`Unknown scene "${sceneKey}" for pose "${name}"`)
  }
  return {
    id: `pose-${String(index + 1).padStart(3, '0')}`,
    name,
    description,
    howTo: scene.howTo,
    spice,
    art: { a: scene.a, b: scene.b, arrangement: scene.arrangement },
  }
})

export function createStaticPoseCatalog(): PoseCatalog {
  return {
    getPoses: () => POSES,
    getPostures: () => POSTURES,
  }
}
