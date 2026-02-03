import { describe, expect, it, vi, beforeEach } from 'vitest'
import { petsServico } from './PetsServico'
import { clienteHttp } from '../http/clienteHttp'

vi.mock('../http/clienteHttp', () => ({
  clienteHttp: {
    get: vi.fn(),
  },
}))

const mockedGet = clienteHttp.get as unknown as {
  mockResolvedValue: (value: unknown) => void
  mockReset: () => void
  mock: { calls: unknown[][] }
}

describe('PetsServico.listar', () => {
  beforeEach(() => {
    mockedGet.mockReset()
  })

  it('normaliza resposta quando a API retorna array simples', async () => {
    mockedGet.mockResolvedValue({ data: [{ id: 1, nome: 'Rex' }] })

    const resultado = await petsServico.listar(0, 10, '')

    expect(resultado.content).toHaveLength(1)
    expect(resultado.total).toBe(1)
    expect(resultado.tamanhoPagina).toBe(1)
    expect(resultado.pagina).toBe(0)
    expect(resultado.paginaContador).toBe(1)
  })

  it('normaliza resposta paginada com metadados', async () => {
    mockedGet.mockResolvedValue({
      data: {
        content: [{ id: 2, nome: 'Toto' }],
        page: 1,
        size: 10,
        totalElements: 21,
        totalPages: 3,
      },
    })

    const resultado = await petsServico.listar(1, 10, 'to')

    expect(resultado.content).toHaveLength(1)
    expect(resultado.total).toBe(21)
    expect(resultado.tamanhoPagina).toBe(10)
    expect(resultado.pagina).toBe(1)
    expect(resultado.paginaContador).toBe(3)
  })
})
