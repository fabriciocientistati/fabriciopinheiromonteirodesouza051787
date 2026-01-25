import { clienteHttp } from '../http/clienteHttp'
import type { Tutor } from '../../dominio/modelos/Tutor'

export class TutoresServico {
    async listar(pagina: number): Promise<Tutor[]> {
        const response = await clienteHttp.get<Tutor[]>('/v1/tutores', {
            params: {
                page: pagina,
                size: 10
            }
        }) 
        return response.data
    }

    async obterPorId(id: number): Promise<Tutor> {
        const response = await clienteHttp.get<Tutor>(`/v1/tutores/${id}`)
        return response.data
    }

    async criar(dados: Partial<Tutor>): Promise<Tutor> {
        const response = await clienteHttp.post<Tutor>('/v1/tutores', dados)
        return response.data
    }

    async atualizar(id: number, dados: Partial<Tutor>): Promise<Tutor> {
        const response = await clienteHttp.put<Tutor>(`/v1/tutores/${id}`, dados)
        return response.data
    }

    async remover(id: number) {
        await clienteHttp.delete(`/v1/tutores/${id}`)
    }
}
