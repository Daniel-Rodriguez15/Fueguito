import type { FigureArrangement, FigurePosture, Pose, PoseCatalog, SpiceLevel } from '@/domain/pose'

/**
 * Minimalist stick-figure postures in a 100x100 space: a head circle plus
 * round-stroked paths. Poses place two of them together via a hand-tuned
 * scene so the couple composition always reads clearly.
 */
const POSTURES: Readonly<Record<string, FigurePosture>> = {
  missionaryBottom: {
    head: { cx: 12, cy: 78, r: 8 },
    paths: [
      'M21 79 C38 78 54 78 70 80',
      'M70 80 C82 75 92 72 102 70',
      'M70 80 C84 82 96 83 110 83',
      'M36 79 C41 72 46 68 52 65',
    ],
  },
  missionaryTop: {
    head: { cx: 26, cy: 44, r: 8 },
    paths: [
      'M35 47 C52 53 68 58 84 62',
      'M41 49 C39 61 37 71 36 82',
      'M84 62 C94 68 102 74 110 80',
      'M80 60 C92 62 102 66 112 72',
    ],
  },
  spoonBack: {
    head: { cx: 18, cy: 56, r: 8 },
    paths: [
      'M26 60 C40 63 53 67 66 71',
      'M66 71 C76 73 82 79 84 87',
      'M66 71 C72 79 74 86 74 93',
      'M38 62 C44 68 50 72 56 75',
    ],
  },
  spoonFront: {
    head: { cx: 32, cy: 72, r: 8 },
    paths: [
      'M40 75 C52 78 63 80 74 82',
      'M74 82 C84 83 90 88 92 96',
      'M74 82 C80 88 82 93 82 98',
      'M50 77 C56 72 62 70 68 69',
    ],
  },
  riderBottom: {
    head: { cx: 14, cy: 84, r: 8 },
    paths: [
      'M23 84 C44 82 64 82 85 84',
      'M85 84 C96 80 106 78 116 76',
      'M85 84 C96 86 106 87 118 87',
      'M45 83 C50 74 54 68 58 62',
    ],
  },
  riderTop: {
    head: { cx: 70, cy: 26, r: 8 },
    paths: [
      'M70 35 C70 44 70 52 70 60',
      'M70 60 C60 64 54 70 52 78',
      'M70 60 C80 64 86 70 88 78',
      'M70 42 C63 48 58 52 55 57',
      'M70 42 C77 48 82 52 85 57',
    ],
  },
  doggyFront: {
    head: { cx: 18, cy: 50, r: 8 },
    paths: [
      'M27 54 C41 52 54 53 66 57',
      'M32 56 C31 70 30 84 30 96',
      'M66 57 C71 70 72 84 72 96',
      'M61 56 C64 70 64 84 63 96',
    ],
  },
  doggyBack: {
    head: { cx: 92, cy: 34, r: 8 },
    paths: [
      'M92 43 C92 52 92 60 92 68',
      'M92 68 C98 74 100 82 100 90 L110 92',
      'M92 68 C86 74 84 82 84 90 L74 92',
      'M92 48 C86 52 80 55 74 58',
      'M92 48 C98 54 100 60 100 66',
    ],
  },
  hugLeft: {
    head: { cx: 56, cy: 16, r: 8 },
    paths: [
      'M56 25 C56 42 56 58 56 74',
      'M56 74 C52 84 50 92 48 100',
      'M56 74 C60 84 62 92 64 100',
      'M56 32 C62 36 68 40 72 44',
    ],
  },
  hugRight: {
    head: { cx: 78, cy: 16, r: 8 },
    paths: [
      'M78 25 C78 42 78 58 78 74',
      'M78 74 C74 84 72 92 70 100',
      'M78 74 C82 84 84 92 86 100',
      'M78 32 C72 36 66 40 62 44',
    ],
  },
  carryBase: {
    head: { cx: 60, cy: 18, r: 8 },
    paths: [
      'M60 27 C60 44 60 60 60 76',
      'M60 76 C55 85 53 92 51 100',
      'M60 76 C65 85 67 92 69 100',
      'M60 34 C68 38 74 42 78 48',
      'M60 40 C68 44 74 48 78 54',
    ],
  },
  carried: {
    head: { cx: 88, cy: 22, r: 8 },
    paths: [
      'M88 31 C87 42 86 52 84 62',
      'M84 62 C76 58 68 55 62 54',
      'M84 62 C78 66 70 68 64 68',
      'M88 36 C80 34 72 32 66 30',
    ],
  },
  lotusBase: {
    head: { cx: 54, cy: 34, r: 8 },
    paths: [
      'M54 43 C54 54 54 64 54 74',
      'M54 74 C44 78 36 82 30 82 C36 88 46 90 54 90',
      'M54 74 C64 78 72 82 78 82 C72 88 62 90 54 90',
      'M54 50 C62 52 68 56 72 60',
    ],
  },
  lotusTop: {
    head: { cx: 76, cy: 22, r: 8 },
    paths: [
      'M76 31 C76 42 76 52 76 62',
      'M76 62 C66 66 58 68 48 68',
      'M76 62 C70 70 62 74 54 76',
      'M76 38 C68 40 62 42 58 46',
    ],
  },
  chairBase: {
    head: { cx: 46, cy: 30, r: 8 },
    paths: [
      'M46 39 C47 50 48 60 48 70',
      'M48 70 C60 71 70 72 80 72',
      'M80 72 C81 81 81 90 81 98',
      'M47 46 C54 50 60 54 66 58',
    ],
  },
  chairTop: {
    head: { cx: 76, cy: 26, r: 8 },
    paths: [
      'M76 35 C77 46 78 56 78 66',
      'M78 66 C86 74 90 84 92 96',
      'M78 66 C82 76 84 86 84 98',
      'M76 42 C84 44 90 46 96 50',
    ],
  },
  legsHighBottom: {
    head: { cx: 16, cy: 80, r: 8 },
    paths: [
      'M25 81 C38 80 51 80 64 80',
      'M64 80 C70 66 76 52 82 40',
      'M64 80 C74 68 82 58 90 48',
      'M40 80 C44 87 48 92 52 96',
    ],
  },
  legsHighKneel: {
    head: { cx: 104, cy: 34, r: 8 },
    paths: [
      'M104 43 C104 52 104 61 104 70',
      'M104 70 C110 76 112 84 112 92 L122 94',
      'M104 70 C98 76 96 84 96 92 L86 94',
      'M104 48 C98 46 92 44 88 44',
    ],
  },
  bridgeBase: {
    head: { cx: 16, cy: 84, r: 8 },
    paths: [
      'M24 82 C40 62 62 60 78 72',
      'M78 72 C80 82 80 90 80 98',
      'M78 72 C86 80 90 88 92 96',
      'M28 84 C29 90 30 95 30 100',
    ],
  },
  bridgeKneel: {
    head: { cx: 104, cy: 40, r: 8 },
    paths: [
      'M104 49 C104 58 104 66 104 74',
      'M104 74 C110 80 112 86 112 94 L120 96',
      'M104 74 C98 80 96 86 96 94 L88 96',
      'M104 54 C98 56 92 60 88 64',
    ],
  },
  faceLeft: {
    head: { cx: 30, cy: 70, r: 8 },
    paths: [
      'M39 72 C50 74 60 76 70 78',
      'M70 78 C80 82 88 86 94 92',
      'M70 78 C78 86 82 92 84 98',
      'M48 73 C54 70 60 68 66 67',
    ],
  },
  faceRight: {
    head: { cx: 110, cy: 70, r: 8 },
    paths: [
      'M101 72 C90 74 80 76 70 78',
      'M70 78 C62 84 58 90 56 96',
      'M70 78 C64 88 62 94 62 100',
      'M92 73 C86 70 80 68 74 67',
    ],
  },
  wheelFront: {
    head: { cx: 16, cy: 56, r: 8 },
    paths: [
      'M25 60 C39 58 53 60 68 64',
      'M30 62 C29 74 28 86 28 98',
      'M36 62 C35 76 34 88 34 98',
      'M68 64 C79 62 90 60 100 58',
      'M68 64 C80 66 91 66 102 64',
    ],
  },
  wheelHolder: {
    head: { cx: 108, cy: 20, r: 8 },
    paths: [
      'M108 29 C108 44 108 58 108 72',
      'M108 72 C103 82 101 92 99 100',
      'M108 72 C113 82 115 92 117 100',
      'M108 36 C104 44 101 50 100 56',
    ],
  },
  throneBase: {
    head: { cx: 22, cy: 48, r: 8 },
    paths: [
      'M28 55 C36 62 42 70 46 78',
      'M32 58 C26 66 22 74 20 82',
      'M46 78 C60 82 72 84 86 86',
      'M46 78 C58 88 66 92 76 96',
    ],
  },
  throneTop: {
    head: { cx: 72, cy: 28, r: 8 },
    paths: [
      'M72 37 C72 46 72 54 72 62',
      'M72 62 C62 66 56 72 54 80',
      'M72 62 C82 66 88 72 90 80',
      'M72 44 C66 48 60 50 56 52',
    ],
  },
  leanFront: {
    head: { cx: 30, cy: 38, r: 8 },
    paths: [
      'M36 44 C46 50 54 58 58 66',
      'M40 47 C36 56 33 64 31 72',
      'M58 66 C57 78 56 88 55 100',
      'M58 66 C63 78 66 88 68 98',
    ],
  },
  leanBack: {
    head: { cx: 92, cy: 22, r: 8 },
    paths: [
      'M92 31 C92 46 92 60 91 74',
      'M91 74 C86 84 84 92 82 100',
      'M91 74 C96 84 98 92 100 100',
      'M92 38 C85 42 79 46 74 52',
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
    a: 'missionaryBottom',
    b: 'missionaryTop',
    arrangement: { dx: 0, dy: 0, rotation: 0, mirrored: false },
    howTo: 'Quien está abajo se acuesta boca arriba; su pareja se apoya encima sobre las manos.',
  },
  spoon: {
    a: 'spoonFront',
    b: 'spoonBack',
    arrangement: { dx: 0, dy: 0, rotation: 0, mirrored: false },
    howTo: 'De costado, ambos mirando hacia el mismo lado, uno pegado detrás del otro.',
  },
  rider: {
    a: 'riderBottom',
    b: 'riderTop',
    arrangement: { dx: 0, dy: 0, rotation: 0, mirrored: false },
    howTo: 'Una persona acostada boca arriba; la otra se sienta a horcajadas encima.',
  },
  doggy: {
    a: 'doggyFront',
    b: 'doggyBack',
    arrangement: { dx: 0, dy: 0, rotation: 0, mirrored: false },
    howTo: 'Una persona en cuatro apoyos; la otra de rodillas detrás.',
  },
  hugStand: {
    a: 'hugLeft',
    b: 'hugRight',
    arrangement: { dx: 0, dy: 0, rotation: 0, mirrored: false },
    howTo: 'De pie, frente a frente, cuerpo contra cuerpo.',
  },
  wallCarry: {
    a: 'carryBase',
    b: 'carried',
    arrangement: { dx: 0, dy: 0, rotation: 0, mirrored: false },
    howTo: 'De pie contra una pared; una persona rodea a la otra con las piernas.',
  },
  lotus: {
    a: 'lotusBase',
    b: 'lotusTop',
    arrangement: { dx: 0, dy: 0, rotation: 0, mirrored: false },
    howTo: 'Sentados frente a frente, piernas entrelazadas, meciéndose juntos.',
  },
  lapChair: {
    a: 'chairBase',
    b: 'chairTop',
    arrangement: { dx: 0, dy: 0, rotation: 0, mirrored: false },
    howTo: 'Una persona sentada; la otra se sienta encima dándole la espalda.',
  },
  legsHigh: {
    a: 'legsHighBottom',
    b: 'legsHighKneel',
    arrangement: { dx: 0, dy: 0, rotation: 0, mirrored: false },
    howTo: 'Una persona boca arriba con las piernas en alto; la otra de rodillas frente a ella.',
  },
  bridgeUp: {
    a: 'bridgeBase',
    b: 'bridgeKneel',
    arrangement: { dx: 0, dy: 0, rotation: 0, mirrored: false },
    howTo: 'Una persona eleva las caderas en puente; la otra de rodillas entre sus piernas.',
  },
  faceToFace: {
    a: 'faceLeft',
    b: 'faceRight',
    arrangement: { dx: 0, dy: 0, rotation: 0, mirrored: false },
    howTo: 'Acostados de costado, frente a frente, piernas entrelazadas.',
  },
  wheelbarrow: {
    a: 'wheelFront',
    b: 'wheelHolder',
    arrangement: { dx: 0, dy: 0, rotation: 0, mirrored: false },
    howTo: 'Una persona en cuatro apoyos; la otra, de pie, la sostiene por las piernas.',
  },
  throne: {
    a: 'throneBase',
    b: 'throneTop',
    arrangement: { dx: 0, dy: 0, rotation: 0, mirrored: false },
    howTo: 'Una persona reclinada apoyada en los brazos; la otra se sienta encima.',
  },
  standBack: {
    a: 'leanFront',
    b: 'leanBack',
    arrangement: { dx: 0, dy: 0, rotation: 0, mirrored: false },
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
