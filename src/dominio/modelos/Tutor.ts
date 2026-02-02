import type { Foto } from './Foto'
import type { PetVinculado } from './PetVinculado'

export interface Tutor {
  id: number
  nome: string
  email: string
  telefone: string
  endereco: string
  cpf: string
  foto?: Foto
  pets?: PetVinculado[]
}
