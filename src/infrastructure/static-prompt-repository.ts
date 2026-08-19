import type { PromptRepository } from '@/domain/prompt-repository'
import type { IntensityLevel, Prompt, PromptKind } from '@/domain/truth-or-dare'

const SOFT_TRUTHS: readonly string[] = [
  '¿Qué fue lo primero que pensaste de mí cuando me conociste?',
  '¿Cuál es tu recuerdo favorito de nosotros dos?',
  '¿Qué canción te recuerda a mí?',
  '¿Qué es lo que más te gusta de cómo te trato?',
  '¿Cuál fue el momento en que supiste que te gustaba?',
  '¿Qué detalle mío te parece adorable y nunca me dijiste?',
  '¿Qué cita soñada te gustaría que hagamos?',
  '¿Qué te pone nervioso o nerviosa de mí todavía?',
  '¿Cuál es tu apodo secreto para mí en tu cabeza?',
  '¿Qué es lo más romántico que harías por mí sin que te lo pida?',
]

const SOFT_DARES: readonly string[] = [
  'Dame un abrazo de 20 segundos sin decir nada.',
  'Dime tres cosas que amas de mí mirándome a los ojos.',
  'Dame un beso en la frente y otro donde quieras.',
  'Baila conmigo 30 segundos sin música.',
  'Hazme un masaje de manos mientras me cuentas tu día.',
  'Susúrrame algo lindo al oído.',
  'Recrea nuestro primer beso.',
  'Escríbeme un piropo y léelo en voz alta.',
  'Dame de comer algo con los ojos vendados.',
  'Abrázame por la espalda durante un minuto entero.',
]

const SPICY_TRUTHS: readonly string[] = [
  '¿Qué parte de mi cuerpo te gusta más y por qué?',
  '¿Dónde fue el lugar más arriesgado donde quisiste besarme?',
  '¿Qué prenda mía te gustaría que use más seguido?',
  '¿Qué fantasía conmigo todavía no me contaste?',
  '¿Qué es lo primero que me miras cuando me ves llegar?',
  '¿Cuál fue el beso que más te gustó de todos los que nos dimos?',
  '¿Qué escena de película te gustaría recrear conmigo?',
  '¿En qué momento del día piensas más en mí?',
  '¿Qué te gustaría que te haga más seguido?',
  '¿Cuál es tu recuerdo más picante de nosotros?',
]

const SPICY_DARES: readonly string[] = [
  'Besa mi cuello durante 15 segundos.',
  'Dime al oído qué harías si estuviéramos solos ahora mismo.',
  'Quítame una prenda con delicadeza.',
  'Hazme un masaje en la espalda de dos minutos.',
  'Muerde suavemente mi labio.',
  'Recorre mi brazo con besos, de la mano al hombro.',
  'Elige una canción y báilamela solo a mí.',
  'Besa tres lugares de mi cuerpo que tú elijas.',
  'Miradas fijas: el primero que se ría paga una prenda.',
  'Describe con detalle cómo sería una noche perfecta conmigo.',
]

const FIRE_TRUTHS: readonly string[] = [
  '¿Cuál es tu fantasía más atrevida conmigo?',
  '¿Qué lugar fuera de casa te tienta para una aventura?',
  '¿Qué es lo más osado que te gustaría probar juntos?',
  '¿Qué te vuelve loco o loca que yo haga cuando estamos solos?',
  '¿Cuál fue la vez que más me deseaste?',
  '¿Qué juego o rol te gustaría que probemos?',
  '¿Qué parte de tu cuerpo quieres que explore más?',
  '¿Qué límite te gustaría empujar esta noche?',
  '¿Cómo me seducirías si fuéramos desconocidos en un bar?',
  '¿Qué es lo que nunca te animaste a pedirme?',
]

const FIRE_DARES: readonly string[] = [
  'Besa mi zona favorita — adivina cuál es.',
  'Susúrrame tu fantasía más atrevida con todos los detalles.',
  'Dame un masaje donde yo elija, con los ojos vendados.',
  'Recorre mi cuerpo solo con la punta de los dedos, un minuto.',
  'Interpretemos desconocidos que se acaban de conocer.',
  'Elige tres zonas mías y bésalas lentamente.',
  'Deja que te quite una prenda como yo quiera.',
  'Dime tres cosas que quieres que pasen esta noche.',
  'Un minuto de besos sin usar las manos.',
  'Sella un pacto: cumplir hoy la fantasía que saque esta carta.',
]

function toPrompts(
  texts: readonly string[],
  kind: PromptKind,
  level: IntensityLevel,
): readonly Prompt[] {
  return texts.map((text) => ({ kind, level, text }))
}

const PROMPTS: readonly Prompt[] = [
  ...toPrompts(SOFT_TRUTHS, 'truth', 'soft'),
  ...toPrompts(SOFT_DARES, 'dare', 'soft'),
  ...toPrompts(SPICY_TRUTHS, 'truth', 'spicy'),
  ...toPrompts(SPICY_DARES, 'dare', 'spicy'),
  ...toPrompts(FIRE_TRUTHS, 'truth', 'fire'),
  ...toPrompts(FIRE_DARES, 'dare', 'fire'),
]

export function createStaticPromptRepository(): PromptRepository {
  return {
    getPrompts: () => PROMPTS,
  }
}
