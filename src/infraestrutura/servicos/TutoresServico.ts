import { clienteHttp } from '../http/clienteHttp'
import type { Tutor } from '../../dominio/modelos/Tutor'
import type { PetVinculado } from '../../dominio/modelos/PetVinculado'

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
    total?: number
    pageCount?: number
    totalPages?: number
    totalElements?: number
    number?: number
    itens?: T[]
    items?: T[]
    data?: T[]
}

export class TutoresServico {
    async listar(
        pagina: number,
        tamanhoPagina: number,
        busca?: string
    ): Promise<RespostaPaginada<Tutor>> {

        const filtro = busca?.trim() || undefined
        const resposta = await clienteHttp.get<RespostaPaginadaApi<Tutor> | Tutor[]>('/v1/tutores', {
        params: {
            page: pagina,
            size: tamanhoPagina,
            nome: filtro,
        }
        })

        const raw = resposta.data
        const data: RespostaPaginadaApi<Tutor> = Array.isArray(raw) ? { content: raw } : raw
        const content = data.content ?? data.itens ?? data.items ?? data.data ?? []

        const paginaAtual = data.pagina ?? data.page ?? data.number ?? 0
        const tamanhoAtual = data.tamanhoPagina ?? data.size ?? content.length
        const total = data.total ?? data.totalElements ?? content.length
        const paginaContador =
        data.pageCount ??
        data.paginaContador ??
        data.totalPages ??
        (tamanhoAtual > 0 ? Math.ceil(total / tamanhoAtual) : 0)

        return {
        content,
        pagina: paginaAtual,
        tamanhoPagina: tamanhoAtual,
        total,
        paginaContador
        }
    }

    async criar(tutor: Omit<Tutor, 'id' | 'foto'>): Promise<Tutor> {      
        const resposta = await clienteHttp.post('/v1/tutores', tutor)    
        return resposta.data
    }

    async atualizar(id: number, tutor: Omit<Tutor, 'id' | 'foto'>): Promise<Tutor> {
        const resposta = await clienteHttp.put(`/v1/tutores/${id}`, tutor)
        return resposta.data
    }

    async atualizarFoto(id: number, arquivo: File): Promise<Tutor> {
      const formData = new FormData()
      formData.append('foto', arquivo)
  
      const resposta = await clienteHttp.post<Tutor>(
        `/v1/tutores/${id}/fotos`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      )
  
      return resposta.data
    }  

    async buscarPorId(id: number): Promise<Tutor> {
        const resposta = await clienteHttp.get(`/v1/tutores/${id}`)
        return resposta.data
    }
    
    async listarPetsVinculados(idTutor: number): Promise<PetVinculado[]> {
    const resposta = await clienteHttp.get('/v1/pets', {
        params: { tutorId: idTutor }
    })

    const data = resposta.data as
        | PetVinculado[]
        | { content?: PetVinculado[] }

    if (Array.isArray(data)) {
        return data
    }

    return data.content ?? []
    }

    async listarPets(nome?: string) {
        const resposta = await clienteHttp.get('/v1/pets', {
            params: {
            nome: nome || undefined
            }
        })

        return resposta.data.content ?? resposta.data ?? []
        }

    async vincularPet(idTutor: number, idPet: number): Promise<void> {
        await clienteHttp.post(`/v1/tutores/${idTutor}/pets/${idPet}`)
    }

    async removerVinculo(idTutor: number, idPet: number): Promise<void> {
        await clienteHttp.delete(`/v1/tutores/${idTutor}/pets/${idPet}`)
    }

    async remover(id: number) {
        await clienteHttp.delete(`/v1/tutores/${id}`)
    }   

    async removerFoto(tutorId: number, fotoId: number): Promise<void> {
        await clienteHttp.delete(`/v1/tutores/${tutorId}/fotos/${fotoId}`)
    }
}

export const tutoresServico = new TutoresServico()
