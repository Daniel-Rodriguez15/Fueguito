import type { FigurePosture, Pose, PoseCatalog, SpiceLevel } from '@/domain/pose'

/**
 * Minimalist stick-figure postures in a 100x100 space: a head circle plus
 * round-stroked paths. Poses place two of them together via an arrangement.
 */
const POSTURES: Readonly<Record<string, FigurePosture>> = {
  stand: {
    head: { cx: 50, cy: 14, r: 9 },
    paths: ['M50 23 L50 62', 'M50 62 L42 95', 'M50 62 L58 95', 'M50 32 L38 52', 'M50 32 L62 52'],
  },
  lean: {
    head: { cx: 30, cy: 20, r: 9 },
    paths: ['M35 27 L55 55', 'M55 55 L50 95', 'M55 55 L64 92', 'M42 35 L30 60'],
  },
  kneel: {
    head: { cx: 50, cy: 26, r: 9 },
    paths: ['M50 35 L50 65', 'M50 65 L58 86 L70 88', 'M50 65 L42 86 L30 88', 'M50 42 L38 58', 'M50 42 L62 58'],
  },
  allFours: {
    head: { cx: 22, cy: 40, r: 9 },
    paths: ['M30 45 L62 50', 'M34 47 L30 74', 'M62 50 L68 74', 'M58 50 L58 76'],
  },
  sit: {
    head: { cx: 38, cy: 30, r: 9 },
    paths: ['M40 39 L44 66', 'M44 66 L78 70', 'M42 46 L56 62'],
  },
  lieBack: {
    head: { cx: 14, cy: 60, r: 9 },
    paths: ['M23 60 L60 60', 'M60 60 L88 52', 'M60 60 L88 66', 'M32 60 L44 46'],
  },
  legsUp: {
    head: { cx: 20, cy: 70, r: 9 },
    paths: ['M29 70 L58 68', 'M58 68 L66 30', 'M58 68 L74 34', 'M36 70 L46 84'],
  },
  bridge: {
    head: { cx: 16, cy: 72, r: 9 },
    paths: ['M24 70 Q50 48 74 66', 'M74 66 L70 92', 'M74 66 L84 90', 'M28 72 L30 92'],
  },
  straddle: {
    head: { cx: 50, cy: 20, r: 9 },
    paths: ['M50 29 L50 55', 'M50 55 L34 66 L36 82', 'M50 55 L66 66 L64 82', 'M50 36 L36 50', 'M50 36 L64 50'],
  },
  wrap: {
    head: { cx: 46, cy: 16, r: 9 },
    paths: ['M46 25 L48 60', 'M48 60 L30 52', 'M48 60 L32 66', 'M46 32 L60 44'],
  },
  squat: {
    head: { cx: 50, cy: 34, r: 9 },
    paths: ['M50 43 L50 64', 'M50 64 L32 70 L36 88', 'M50 64 L68 70 L64 88', 'M50 48 L34 58'],
  },
  recline: {
    head: { cx: 30, cy: 36, r: 9 },
    paths: ['M34 44 L48 68', 'M38 50 L24 70', 'M48 68 L82 74', 'M48 68 L78 84'],
  },
}

// [name, description, spice, postureA, postureB, dx, dy, rotation, mirrored]
type PoseDef = readonly [string, string, SpiceLevel, string, string, number, number, number, boolean]

const POSE_DEFS: readonly PoseDef[] = [
  ['El Clásico', 'Cara a cara, sin apuro y con todo el contacto', 1, 'lieBack', 'lean', 10, -14, 0, false],
  ['La Cucharita', 'De costado, un abrazo que sube de temperatura', 1, 'lieBack', 'lieBack', 6, -10, 0, false],
  ['La Amazona', 'Una persona guía desde arriba, la otra disfruta la vista', 2, 'lieBack', 'straddle', 18, -24, 0, false],
  ['El Perrito', 'Un clásico intenso, en cuatro apoyos', 2, 'allFours', 'kneel', 34, -4, 0, false],
  ['El Loto', 'Sentados, entrelazados, respirando al mismo ritmo', 1, 'sit', 'straddle', 8, -18, 0, false],
  ['La Silla', 'Una persona sentada, la otra toma el control encima', 2, 'sit', 'straddle', 10, -22, 0, true],
  ['El Abrazo de Pie', 'De pie, cuerpo contra cuerpo, sin escapatoria', 1, 'stand', 'stand', 16, 0, 0, true],
  ['La Pared', 'De pie contra la pared, urgente y sin protocolo', 3, 'stand', 'wrap', 14, -4, 0, true],
  ['El Puente', 'Caderas arriba: arquitectura al servicio del placer', 3, 'bridge', 'kneel', 28, -8, 0, false],
  ['La Carretilla', 'Equilibrio, fuerza y mucha risa nerviosa', 3, 'allFours', 'stand', 38, -22, 0, false],
  ['La V', 'Piernas arriba, ángulo de máxima cercanía', 3, 'legsUp', 'kneel', 30, -10, 0, false],
  ['El Trono', 'Reclinado como en un trono, la otra persona reina igual', 2, 'recline', 'straddle', 16, -18, 0, false],
  ['La Mariposa', 'Al borde de la cama, piernas al vuelo', 3, 'legsUp', 'stand', 34, -20, 0, false],
  ['El Espejo', 'De costado, frente a frente, copiando cada gesto', 1, 'lieBack', 'lieBack', 4, 12, 180, true],
  ['El Columpio', 'Sostenidos en el aire, puro vértigo', 3, 'stand', 'wrap', 12, -2, 0, true],
  ['La Siesta', 'Lento, perezoso y pegajoso como domingo de lluvia', 1, 'lieBack', 'lieBack', 12, -8, 0, false],
  ['El Jinete Invertido', 'De espaldas arriba: otra vista, otro mapa', 3, 'lieBack', 'straddle', 20, -22, 0, true],
  ['La Cobra', 'Una espalda que se arquea, unas manos que aprietan', 2, 'lieBack', 'allFours', 8, -12, 0, false],
  ['El Sofá', 'El respaldo del sofá tiene usos no documentados', 2, 'lean', 'stand', 26, -6, 0, false],
  ['La Bailarina', 'Una pierna arriba, elegancia con picardía', 2, 'stand', 'stand', 14, -2, 8, true],
  ['El Ancla', 'Bien agarrados: nadie se va a ninguna parte', 2, 'sit', 'wrap', 10, -16, 0, true],
  ['La Ola', 'Un vaivén que empieza suave y termina tsunami', 2, 'lieBack', 'lean', 14, -18, 0, false],
  ['El Nudo', 'Piernas entrelazadas: matemáticamente inseparables', 2, 'sit', 'sit', 12, 2, 180, true],
  ['La Llave', 'Una pierna que cruza y cierra el candado', 2, 'lieBack', 'lieBack', 10, -6, 12, false],
  ['El Faro', 'De rodillas, erguidos, alumbrándose de cerca', 1, 'kneel', 'kneel', 18, 0, 0, true],
  ['La Góndola', 'Remando juntos, despacio, hasta llegar', 2, 'recline', 'sit', 20, -10, 0, false],
  ['El Tornillo', 'Piernas juntas hacia un lado: giro y presión', 3, 'lieBack', 'kneel', 24, -12, 20, false],
  ['El Delfín', 'Caderas elevadas, un salto limpio al placer', 3, 'bridge', 'stand', 30, -16, 0, false],
  ['La Sirena', 'Piernas juntas y cuerpo de canto de sirena', 2, 'lieBack', 'kneel', 26, -8, 0, false],
  ['El Volcán', 'Empieza dormido, termina en erupción', 3, 'lieBack', 'straddle', 16, -26, 0, false],
  ['La Luna', 'Curvados como luna creciente, encajan perfecto', 1, 'lieBack', 'lieBack', 8, -12, 8, false],
  ['El Amanecer', 'Despacio, con la luz entrando por la ventana', 1, 'lieBack', 'lean', 6, -16, 0, false],
  ['La Escalera', 'Un escalón de diferencia lo cambia todo', 2, 'kneel', 'stand', 22, -12, 0, false],
  ['El Tobogán', 'Deslizarse lento, frenar está prohibido', 2, 'recline', 'lieBack', 18, -6, 0, false],
  ['El Péndulo', 'Un ritmo que hipnotiza a los dos', 2, 'sit', 'straddle', 6, -20, 0, false],
  ['La Balanza', 'Peso compartido, placer equilibrado', 2, 'recline', 'straddle', 12, -16, 0, true],
  ['El Compás', 'Una pierna extendida dibuja el círculo perfecto', 2, 'lieBack', 'legsUp', 22, -4, 0, true],
  ['La Tijera', 'Piernas cruzadas en X, fricción de precisión', 3, 'lieBack', 'lieBack', 14, 6, 160, true],
  ['El Arco', 'Espalda arqueada, cuerda tensa, flecha lista', 3, 'bridge', 'kneel', 24, -10, 0, true],
  ['La Flecha', 'Directo al blanco, sin rodeos', 2, 'legsUp', 'lean', 28, -14, 0, false],
  ['El Reloj de Arena', 'Tomarse el tiempo: cada grano cuenta', 1, 'sit', 'sit', 14, 0, 0, true],
  ['La Copa', 'Brindis de cuerpos, borde con borde', 2, 'sit', 'straddle', 12, -18, 6, false],
  ['El Candado', 'Piernas que abrazan y no sueltan', 2, 'lieBack', 'wrap', 14, -14, 0, false],
  ['La Enredadera', 'Trepados uno al otro, creciendo juntos', 2, 'stand', 'wrap', 10, -6, 0, false],
  ['El Trapecio', 'Confianza ciega y manos firmes', 3, 'recline', 'legsUp', 22, -12, 0, true],
  ['La Cumbre', 'La cima se conquista de a dos', 3, 'kneel', 'legsUp', 26, -6, 0, false],
  ['El Remolino', 'Giran, cambian, no se sueltan', 2, 'lieBack', 'straddle', 14, -20, 30, false],
  ['La Marea', 'Sube y baja con paciencia de océano', 1, 'lieBack', 'lieBack', 10, -10, 4, false],
  ['El Eclipse', 'Un cuerpo cubre al otro: oscuridad total, sentidos al máximo', 2, 'lieBack', 'lean', 8, -18, 0, true],
  ['La Chispa', 'Corto, intenso, incendiario', 3, 'stand', 'wrap', 16, -2, 4, true],
  ['El Fuego Cruzado', 'Atacan los dos al mismo tiempo, nadie se rinde', 3, 'sit', 'straddle', 8, -16, 180, true],
  ['La Fusión', 'Tan cerca que no se sabe dónde empieza cada uno', 2, 'sit', 'wrap', 8, -14, 0, false],
  ['El Imán', 'Se separan un centímetro y vuelven a chocar', 2, 'stand', 'stand', 12, 0, 0, true],
  ['La Órbita', 'Girar alrededor del otro hasta caer atraídos', 2, 'lieBack', 'straddle', 24, -18, 45, false],
  ['El Cometa', 'Aparece de repente y deja huella', 3, 'allFours', 'stand', 34, -16, 0, false],
  ['La Galaxia', 'Constelación privada de dos estrellas', 1, 'lieBack', 'lieBack', 16, -4, 350, false],
  ['El Terremoto', 'Advertencia: mueve estructuras', 3, 'allFours', 'kneel', 30, -8, 0, false],
  ['La Tormenta', 'Truenos, relámpagos y sábanas revueltas', 3, 'legsUp', 'lean', 24, -18, 0, false],
  ['El Rayo', 'Fulminante: cae dos veces en el mismo lugar', 3, 'lieBack', 'kneel', 20, -14, 0, true],
  ['La Brasa', 'Fuego lento que no se apaga nunca', 1, 'lieBack', 'lieBack', 8, -8, 0, true],
  ['El Horno', 'Precalentado desde la tarde', 2, 'lean', 'kneel', 24, -10, 0, false],
  ['La Fogata', 'Alrededor del fuego, historias y manos inquietas', 1, 'sit', 'sit', 10, -2, 0, false],
  ['El Verano', 'Calor, piel y cero ropa de abrigo', 2, 'lieBack', 'straddle', 12, -24, 0, false],
  ['El Atardecer', 'La hora dorada también existe en la cama', 1, 'recline', 'sit', 16, -8, 0, false],
  ['La Medianoche', 'Cuando la casa duerme, ustedes no', 2, 'lieBack', 'lean', 12, -12, 0, false],
  ['El Susurro', 'Todo al oído, todo despacio', 1, 'lieBack', 'lieBack', 4, -8, 0, false],
  ['La Caricia', 'Manos que memorizan cada centímetro', 1, 'lieBack', 'kneel', 18, -10, 0, false],
  ['El Suspiro', 'El que se escapa sin permiso', 1, 'sit', 'wrap', 6, -12, 0, true],
  ['La Tentación', 'Prohibido tocar... por ahora', 2, 'stand', 'kneel', 20, 14, 0, true],
  ['El Deseo', 'Decirlo mirándose: sin palabras no vale', 2, 'kneel', 'kneel', 16, 0, 0, true],
  ['La Locura', 'Improvisada, urgente, inolvidable', 3, 'stand', 'wrap', 18, -6, 8, true],
  ['El Vértigo', 'Al borde de la cama, literal', 3, 'recline', 'straddle', 20, -14, 0, false],
  ['La Aventura', 'Fuera de la habitación: elijan el territorio', 3, 'lean', 'stand', 28, -4, 0, false],
  ['El Secreto', 'Ese que solo ustedes dos conocen', 2, 'lieBack', 'lieBack', 6, -14, 0, false],
  ['La Promesa', 'Anotada hoy, cumplida esta noche', 1, 'sit', 'sit', 12, -4, 0, true],
  ['El Capricho', 'Hoy manda una sola persona: obedecer', 3, 'lieBack', 'straddle', 10, -20, 0, true],
  ['La Travesura', 'Con culpa cero y sonrisa de más', 2, 'squat', 'kneel', 22, -6, 0, false],
  ['El Desafío', 'Quien se ría primero, pierde la ropa', 2, 'kneel', 'straddle', 14, -10, 0, false],
  ['La Conquista', 'Territorio nuevo, bandera plantada', 3, 'allFours', 'lean', 30, -12, 0, false],
  ['El Hechizo', 'Imposible resistirse: magia de contacto', 2, 'lieBack', 'kneel', 16, -16, 0, false],
  ['La Pasión', 'Sin coreografía: puro instinto', 3, 'lieBack', 'lean', 10, -20, 0, false],
  ['El Frenesí', 'Ritmo alto, pulso más alto', 3, 'allFours', 'kneel', 32, -6, 6, false],
  ['La Fiebre', 'Temperatura que no baja con nada', 3, 'legsUp', 'kneel', 28, -12, 0, true],
  ['El Delirio', 'Perder la cabeza está permitido', 3, 'bridge', 'straddle', 26, -18, 0, false],
  ['La Osadía', 'Eso que no se cuenta en la cena familiar', 3, 'squat', 'lieBack', 18, 8, 0, false],
  ['El Impulso', 'Sin pensar: tres, dos, uno', 2, 'stand', 'lean', 24, -2, 0, true],
  ['La Descarga', 'Electricidad estática de cuerpos', 3, 'legsUp', 'stand', 30, -24, 0, true],
  ['El Choque', 'Frontal, con airbags desactivados', 3, 'kneel', 'straddle', 12, -12, 0, true],
  ['La Colisión', 'Dos trayectorias, un solo punto de impacto', 3, 'sit', 'straddle', 10, -20, 4, true],
  ['El Abismo', 'Mirarse al borde y saltar juntos', 2, 'recline', 'kneel', 22, -8, 0, false],
  ['La Cima', 'Se llega sin oxígeno y sin apuro', 3, 'lieBack', 'straddle', 14, -22, 8, false],
  ['El Límite', 'Hoy se corre un poquito más allá', 3, 'legsUp', 'lean', 26, -16, 4, false],
  ['La Frontera', 'Cruzarla requiere pasaporte mutuo', 2, 'lieBack', 'kneel', 22, -10, 10, false],
  ['El Paraíso', 'No hace falta morirse para llegar', 2, 'lieBack', 'lieBack', 10, -12, 6, false],
  ['La Gloria', 'Aplausos internos garantizados', 3, 'bridge', 'kneel', 26, -12, 6, false],
  ['El Éxtasis', 'La última carta del mazo por algo es', 3, 'legsUp', 'straddle', 24, -20, 0, false],
  ['La Confesión', 'Primero se dice, después se hace', 1, 'sit', 'sit', 8, -6, 0, false],
  ['El Regalo', 'Desenvolver despacio, sin romper el moño', 1, 'stand', 'kneel', 18, 10, 0, false],
  ['La Cosecha', 'Todo lo sembrado en la semana se cosecha hoy', 2, 'lieBack', 'straddle', 18, -18, 350, false],
  ['La Primera Vez', 'Como la primera vez, pero sabiendo todo lo que ya saben', 1, 'lieBack', 'lean', 8, -14, 4, false],
]

const POSES: readonly Pose[] = POSE_DEFS.map(
  ([name, description, spice, a, b, dx, dy, rotation, mirrored], index) => ({
    id: `pose-${String(index + 1).padStart(3, '0')}`,
    name,
    description,
    spice,
    art: { a, b, arrangement: { dx, dy, rotation, mirrored } },
  }),
)

export function createStaticPoseCatalog(): PoseCatalog {
  return {
    getPoses: () => POSES,
    getPostures: () => POSTURES,
  }
}
