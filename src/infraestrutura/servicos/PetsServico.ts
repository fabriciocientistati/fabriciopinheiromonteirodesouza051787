import { clienteHttp } from '../http/clienteHttp'
import type { Pet } from '../../dominio/modelos/Pet'

export class PetsServico {
    async listar(pagina: number) {
        const resposta = await clienteHttp.get('/v1/pets', {
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

    async criar(dados: Omit<Pet, 'id'>): Promise<Pet> {
        const response = await clienteHttp.post('/v1/pets', dados)
        return response.data
    }

    async atualizar(id: number, dados: Omit<Pet, 'id'>): Promise<Pet> {
        const response = await clienteHttp.put(`/v1/pets/${id}`, dados)
        return response.data
    }

    async remover(id: number): Promise<void> {
        await clienteHttp.delete(`/v1/pets/${id}`)
    }
}