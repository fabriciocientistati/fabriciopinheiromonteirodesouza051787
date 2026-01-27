import type { Foto } from './Foto'
import type { Tutor } from './Tutor'

export interface Pet {
  id: number
  nome: string
  raca?: string
  idade?: number 
  foto?: Foto
  tutores?: Tutor[]
}
