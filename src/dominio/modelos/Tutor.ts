import type { Foto } from './Foto'
import type { Pet } from './Pet'

export interface Tutor {
    id: number
    nome: string
    email?: string
    telefone?: string
    endereco?: string
    cpf?: number
    foto?: Foto
    PETS?: Pet[]
}