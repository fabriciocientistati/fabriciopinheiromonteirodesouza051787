import type { FotoViewModel } from './FotoViewModel'
import type { TutorViewModel } from './TutorViewModel'

export interface PetViewModel {
  id: number
  nome: string
  especie?: string
  raca?: string
  idade?: number
  foto?: FotoViewModel
  tutores?: TutorViewModel[]
}
