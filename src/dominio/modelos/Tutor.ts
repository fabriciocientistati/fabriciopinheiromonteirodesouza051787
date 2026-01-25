import type { Foto } from './Foto'

export interface Tutor {
    id: number
    nome: string
    email: string
    telefone: string
    endereco: string
    cpf?: number
    foto?: Foto
}