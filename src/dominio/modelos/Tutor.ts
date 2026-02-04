import type { Foto } from './Foto'
import type { PetVinculado } from './PetVinculado'

export interface Tutor {
  id: number
  nome: string
  email?: string | null
  telefone: string
  endereco: string
  cpf?: string | null
  foto?: Foto
  pets?: PetVinculado[]
}
