import { describe, expect, it, vi, beforeEach } from 'vitest'
import { tutoresServico } from './TutoresServico'
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

describe('TutoresServico.listar', () => {
  beforeEach(() => {
    mockedGet.mockReset()
  })

  it('normaliza resposta com content e metadados', async () => {
    mockedGet.mockResolvedValue({
      data: {
        content: [{ id: 1, nome: 'Ana' }],
        page: 0,
        size: 10,
        totalElements: 10,
        totalPages: 1,
      },
    })

    const resultado = await tutoresServico.listar(0, 10, '')

    expect(resultado.content).toHaveLength(1)
    expect(resultado.total).toBe(10)
    expect(resultado.tamanhoPagina).toBe(10)
    expect(resultado.pagina).toBe(0)
    expect(resultado.paginaContador).toBe(1)
  })

  it('normaliza resposta usando itens quando content nao existe', async () => {
    mockedGet.mockResolvedValue({
      data: {
        itens: [{ id: 2, nome: 'Joao' }],
        pagina: 2,
        tamanhoPagina: 5,
        total: 11,
        paginaContador: 3,
      },
    })

    const resultado = await tutoresServico.listar(2, 5, 'jo')

    expect(resultado.content).toHaveLength(1)
    expect(resultado.total).toBe(11)
    expect(resultado.tamanhoPagina).toBe(5)
    expect(resultado.pagina).toBe(2)
    expect(resultado.paginaContador).toBe(3)
  })
})
