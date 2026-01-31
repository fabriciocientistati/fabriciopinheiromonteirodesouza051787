
export type PetVinculado = {
  id: number
  nome: string
  raca: string
  idade: number
  foto?: {
    id: number
    nome: string
    contentType: string
    url: string
  }
}
