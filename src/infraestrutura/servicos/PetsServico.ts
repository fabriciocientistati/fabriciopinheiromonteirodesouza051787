import { clienteHttp } from '../http/clienteHttp'
import type { Pet } from '../../dominio/modelos/Pet'

export interface RespostaPaginada<T> {
  content: T[]
  pagina: number
  tamanhoPagina: number
  total: number
  paginaContador: number
}

export interface RespostaPaginadaApi<T> extends Partial<RespostaPaginada<T>> {
  page?: number
  size?: number
  totalPages?: number
  totalElements?: number
  number?: number
  itens?: T[]
  items?: T[]
  data?: T[]
}

export class PetsServico {
  async listar(
    pagina: number,
    tamanhoPagina: number,
    busca?: string,
  ): Promise<RespostaPaginada<Pet>> {
    const filtro = busca?.trim() || undefined
    const resposta = await clienteHttp.get<RespostaPaginadaApi<Pet> | Pet[]>('/v1/pets', {
      params: {
        page: pagina,
        size: tamanhoPagina,
        pagina: pagina,
        tamanhoPagina: tamanhoPagina,
        busca: filtro,
        nome: filtro,
        name: filtro,
        q: filtro,
      },
    })

    const raw = resposta.data
    const data: RespostaPaginadaApi<Pet> = Array.isArray(raw) ? { content: raw } : raw
    const content = data.content ?? data.itens ?? data.items ?? data.data ?? []

    const paginaAtual = data.pagina ?? data.page ?? data.number ?? 0
    const tamanhoAtual = data.tamanhoPagina ?? data.size ?? content.length
    const total = data.total ?? data.totalElements ?? content.length
    const paginaContador =
      data.paginaContador ??
      data.totalPages ??
      (tamanhoAtual > 0 ? Math.ceil(total / tamanhoAtual) : 0)

    return {
      content,
      pagina: paginaAtual,
      tamanhoPagina: tamanhoAtual,
      total,
      paginaContador,
    }
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
    formData.append('foto', arquivo)

    const resposta = await clienteHttp.post<Pet>(
      `/v1/pets/${id}/fotos`,
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
    await clienteHttp.delete(`/v1/pets/${petId}/fotos/${fotoId}`)
  }
}

export const petsServico = new PetsServico()
