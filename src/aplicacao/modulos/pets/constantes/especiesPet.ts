export const ESPECIES_PET = [
  'Cachorro',
  'Gato',
  'Ave',
  'Peixe',
  'Roedor',
  'Reptil',
  'Coelho',
  'Equino',
  'Outro',
] as const

export type EspeciePet = typeof ESPECIES_PET[number]
