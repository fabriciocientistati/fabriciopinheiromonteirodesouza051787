import type { FotoViewModel } from './FotoViewModel'
import type { PetVinculadoViewModel } from './PetVinculadoViewModel'

export interface TutorViewModel {
  id: number
  nome: string
  email?: string | null
  telefone: string
  endereco: string
  cpf?: string | null
  foto?: FotoViewModel
  pets?: PetVinculadoViewModel[]
}
