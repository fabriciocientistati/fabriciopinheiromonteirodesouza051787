import { clienteHttp } from '../http/clienteHttp'
import type { Pet } from '../../dominio/modelos/Pet'

export class PetsServico {
    async listar(pagina: number): Promise<Pet[]> {
        const resposta = await clienteHttp.get<Pet[]>('/v1/pets', {
        params: {
            page: pagina,
            size: 10
        },
        })

        return resposta.data
        }

    async obterPorId(id: number): Promise<Pet> {
        const resposta = await clienteHttp.get<Pet>(`/v1/pets/${id}`)
        return resposta.data
    }

    async criar(dados: Partial<Pet>): Promise<Pet> {
        const resposta = await clienteHttp.post<Pet>(`/v1/pets`, dados)
        return resposta.data
    }

    async atualizar(id: number, dados: Partial<Pet>): Promise<Pet> {
        const resposta = await clienteHttp.put<Pet>(`/v1/pets/${id}`, dados)
        return resposta.data
    }

    async remover(id: number) {
        await clienteHttp.delete(`/v1/pets/${id}`)
    }
}