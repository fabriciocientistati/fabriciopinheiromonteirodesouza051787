import { clienteHttp } from '../http/clienteHttp'
import type { Pet } from '../../dominio/modelos/Pet'

export interface RespostaPaginada<T> {
  content: T[]
  page: number
  size: number
  total: number
  pageCount: number
}

export class PetsServico {
  async listar(
    pagina: number,
    tamanhoPagina: number,
  ): Promise<RespostaPaginada<Pet>> {
    const resposta = await clienteHttp.get<RespostaPaginada<Pet>>('/v1/pets', {
      params: {
        page: pagina,
        size: tamanhoPagina,
      },
    })

    return resposta.data
  }

  async buscarPorId(id: number): Promise<Pet> {
    const resposta = await clienteHttp.get<Pet>(`/v1/pets/${id}`)
    return resposta.data
  }

  async criar(dados: Omit<Pet, 'id'>): Promise<Pet> {
    const resposta = await clienteHttp.post<Pet>('/v1/pets', dados)
    return resposta.data
  }

  async atualizar(id: number, dados: Partial<Pet>): Promise<Pet> {
    const resposta = await clienteHttp.put<Pet>(`/v1/pets/${id}`, dados)
    return resposta.data
  }

  async remover(id: number): Promise<void> {
    await clienteHttp.delete(`/v1/pets/${id}`)
  }

  async adicionarFoto(id: number, arquivo: File): Promise<Pet> {
    const formData = new FormData()
    formData.append('arquivo', arquivo)

    const resposta = await clienteHttp.post<Pet>(
      `/v1/pets/${id}/foto`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    )

    return resposta.data
  }

  async removerFoto(petId: number, fotoId: number): Promise<void> {
    await clienteHttp.delete(`/v1/pets/${petId}/foto/${fotoId}`)
  }
}

export const petsServico = new PetsServico()
