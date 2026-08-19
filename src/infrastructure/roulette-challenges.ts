export interface RouletteChallenge {
  readonly text: string
  readonly seconds: number
}

/** Quick timed micro-challenges for the fast roulette. */
export const ROULETTE_CHALLENGES: readonly RouletteChallenge[] = [
  { text: 'Beso lento, sin usar las manos', seconds: 30 },
  { text: 'Masaje de cuello a tu pareja', seconds: 60 },
  { text: 'Mirarse a los ojos sin reírse', seconds: 30 },
  { text: 'Susurrar al oído lo que harías después', seconds: 20 },
  { text: 'Besos por el cuello, solo el cuello', seconds: 30 },
  { text: 'Abrazo completo sin soltar', seconds: 45 },
  { text: 'Caricias solo con la punta de los dedos', seconds: 40 },
  { text: 'Baile pegado, con o sin música', seconds: 45 },
  { text: 'Besar cada dedo de la mano del otro', seconds: 30 },
  { text: 'Decir tres cosas que te vuelven loco del otro', seconds: 30 },
  { text: 'Morder suavemente el labio del otro', seconds: 15 },
  { text: 'Masaje de manos con contacto visual', seconds: 45 },
  { text: 'Recorrer la espalda del otro con besos', seconds: 40 },
  { text: 'Quitarse una prenda... lentamente', seconds: 20 },
  { text: 'Respirar al mismo ritmo, frente con frente', seconds: 30 },
  { text: 'El que se ría primero cumple una prenda', seconds: 30 },
  { text: 'Besos en los párpados y la frente', seconds: 20 },
  { text: 'Describir la primera cita con lujo de detalle', seconds: 45 },
  { text: 'Sostener al otro en un abrazo por la espalda', seconds: 40 },
  { text: 'Turnarse para besar donde el otro señale', seconds: 45 },
  { text: 'Jugar a las escondidas con un beso de premio', seconds: 60 },
  { text: 'Decirle al oído tu recuerdo más picante juntos', seconds: 30 },
  { text: 'Caricias en el pelo, ojos cerrados', seconds: 40 },
  { text: 'Un cumplido por cada parte del cuerpo que toques', seconds: 45 },
]
