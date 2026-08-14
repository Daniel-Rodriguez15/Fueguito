import type { PromptRepository } from '@/domain/prompt-repository'
import type { Prompt } from '@/domain/truth-or-dare'

const TRUTHS: readonly string[] = [
  '¿Cuál es tu crush secreto en esta sala?',
  '¿Cuál fue tu peor cita?',
  '¿A quién de aquí le darías un beso?',
  '¿Qué es lo más atrevido que has hecho por amor?',
  '¿Cuál es tu mayor red flag en una relación?',
  '¿Alguna vez escribiste a un ex arrepintiéndote después?',
  '¿Qué es lo más vergonzoso que hay en tu galería?',
  '¿Quién de esta sala te parece más atractivo?',
  '¿Cuál fue tu peor beso?',
  '¿Alguna vez fingiste que te gustaba alguien?',
  '¿Qué mentira has dicho para salir de una cita?',
  '¿Cuál es tu fantasía de viaje romántico?',
  '¿A quién stalkeas más en redes?',
  '¿Qué canción te recuerda a un amor pasado?',
  '¿Cuál ha sido tu momento más incómodo en una fiesta?',
  '¿Alguna vez te enamoraste de alguien prohibido?',
  '¿Qué es lo primero que miras en alguien que te gusta?',
  '¿Cuál es el secreto que nunca le contaste a tus amigos?',
  '¿Alguna vez diste un beso que te arrepentiste al instante?',
  '¿Qué apodo cariñoso te han puesto que te da vergüenza?',
]

const DARES: readonly string[] = [
  'Dale un abrazo de 10 segundos a la persona de tu derecha.',
  'Manda un audio cantando a la última persona con la que chateaste.',
  'Baila 30 segundos sin música.',
  'Deja que el grupo publique una historia en tu Instagram.',
  'Imita a alguien de la sala hasta que adivinen quién es.',
  'Di un piropo a cada persona del grupo.',
  'Habla con acento extranjero hasta tu próximo turno.',
  'Muestra la última foto de tu galería.',
  'Dile a la persona de tu izquierda tu primera impresión de ella.',
  'Haz 10 sentadillas mientras dices el nombre de tu crush.',
  'Deja que alguien revise tus últimos 3 emojis más usados.',
  'Susurra algo bonito al oído de la persona que elija el grupo.',
  'Cuenta un chiste; si nadie se ríe, cumple otro reto.',
  'Camina como modelo de pasarela por toda la sala.',
  'Deja que el grupo te despeine y quédate así una ronda.',
  'Mira fijo a los ojos a alguien por 30 segundos sin reírte.',
  'Manda un "te extraño" a un contacto que elija el grupo.',
  'Declara tu amor dramáticamente a un objeto de la sala.',
  'Haz tu mejor cara de seducción a la cámara de alguien.',
  'Intercambia una prenda con la persona de tu derecha por una ronda.',
]

const PROMPTS: readonly Prompt[] = [
  ...TRUTHS.map((text): Prompt => ({ kind: 'truth', text })),
  ...DARES.map((text): Prompt => ({ kind: 'dare', text })),
]

export function createStaticPromptRepository(): PromptRepository {
  return {
    getPrompts: () => PROMPTS,
  }
}
