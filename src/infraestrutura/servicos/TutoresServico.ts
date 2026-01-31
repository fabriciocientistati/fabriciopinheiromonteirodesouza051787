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

export class TutoresServico {
    async listar(
        pagina: number,
        tamanhoPagina: number,
    ): Promise<RespostaPaginada<Tutor>> {
        const resposta = await clienteHttp.get<RespostaPaginada<Tutor>>('/v1/tutores', {
            params: {
            page: pagina,
            size: tamanhoPagina,
            pagina: pagina,
            tamanhoPagina: tamanhoPagina,
            }
        }) 
        
        const data = resposta.data as Partial<RespostaPaginada<Tutor>> & {
            page?: number
            size?: number
            totalPages?: number
            totalElements?: number
            number?: number
            itens?: Tutor[]    
        }

        const paginaAtual = data.pagina ?? data.page ?? data.number ?? 0
        const tamanhoAtual = data.tamanhoPagina ?? data.size ?? 0
        const total = data.total ?? data.totalElements ?? 0
        const paginaContador =
        data.paginaContador ??
        data.totalPages ??
        (tamanhoAtual > 0 ? Math.ceil(total / tamanhoAtual) : 0)

        return {
            content: data.content ?? data.itens ?? [],
            pagina: paginaAtual,
            tamanhoPagina: tamanhoAtual,
            total,
            paginaContador,
        } 
    }

    async buscarPorId(id: number): Promise<Tutor> {
        const resposta = await clienteHttp.get<Tutor>(`/v1/tutores/${id}`)
        return resposta.data
    }

    async criar(dados: Partial<Tutor>): Promise<Tutor> {
        const resposta = await clienteHttp.post<Tutor>('/v1/tutores', dados)
        return resposta.data
    }

    async atualizar(id: number, dados: Partial<Tutor>): Promise<Tutor> {
        const resposta = await clienteHttp.put<Tutor>(`/v1/tutores/${id}`, dados)
        return resposta.data
    }

    async adicionarFoto(id: number, arquivo: File): Promise<Tutor> {
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

    async listarPetsVinculados(idTutor: number): Promise<PetVinculado[]> {
        const resposta = await clienteHttp.get(`/v1/tutores/${idTutor}/pets`)
        return resposta.data
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
