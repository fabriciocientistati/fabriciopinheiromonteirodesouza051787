import type { FotoViewModel } from './FotoViewModel'

export interface PetVinculadoViewModel {
  id: number
  nome: string
  raca: string
  idade: number
  foto?: FotoViewModel
}
