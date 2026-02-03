import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { petsFacade } from '../../facades/PetsFacade'
import { Titulo } from '../../componentes/ui/Titulo'
import { Input } from '../../componentes/ui/Input'
import { Botao } from '../../componentes/ui/Botao'
import { ListaPets } from './componentes/ListaPets'
import { usePetsEstado } from '../../hooks/usePetsEstado'
import { useAutenticacao } from '../../hooks/useAutenticacao'

const TEMPO_DEBOUNCE = 400

export function ListaPetsPagina() {
  const navigate = useNavigate()
  const location = useLocation()

  const { itens, carregando, erro, pagina, total, tamanhoPagina } =
    usePetsEstado()
  const { versaoToken, autenticado } = useAutenticacao()

  const paginaAtual = pagina + 1
  const totalPaginas =
    tamanhoPagina > 0 ? Math.ceil(total / tamanhoPagina) : 1

  const [busca, setBusca] = useState('')
  const primeiraBuscaRef = useRef(true)

  const mensagemSucesso =
    (location.state as { mensagemSucesso?: string } | null)
      ?.mensagemSucesso ?? null

  useEffect(() => {
    if (!mensagemSucesso) return

    const timeout = setTimeout(() => {
      navigate(location.pathname, { replace: true, state: null })
    }, 3000)

    return () => clearTimeout(timeout)
  }, [mensagemSucesso, location.pathname, navigate])

  useEffect(() => {
    petsFacade.definirBusca('')
  }, [])

  useEffect(() => {
    if (!autenticado || versaoToken === 0) return
    void petsFacade.carregarPagina()
  }, [autenticado, versaoToken])

  useEffect(() => {
    if (primeiraBuscaRef.current) {
      primeiraBuscaRef.current = false
      return
    }

    const timeout = setTimeout(() => {
      petsFacade.definirBusca(busca.trim())
    }, TEMPO_DEBOUNCE)

    return () => clearTimeout(timeout)
  }, [busca])

  return (
    <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 space-y-10">
      {mensagemSucesso && (
        <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-md px-4 py-3">
          {mensagemSucesso}
        </div>
      )}

      {erro && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-md px-4 py-3">
          {erro}
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <Titulo>Lista de Pets</Titulo>

        <Botao
          variante="sucesso"
          onClick={() => navigate('/pets/novo')}
        >
          Novo Pet
        </Botao>
      </div>

      <section className="space-y-4">
        <h3 className="text-sm font-semibold text-gray-700 uppercase">
          Filtro de Busca
        </h3>

        <Input
          placeholder="Buscar pet por nome"
          value={busca}
          onChange={e => setBusca(e.target.value)}
        />
      </section>

      <section className="bg-white border rounded-lg shadow-sm p-4 relative">
        {carregando && itens.length > 0 && (
          <div className="absolute right-3 top-3 text-xs text-gray-500 bg-white/90 px-2 py-1 rounded">
            Atualizando lista...
          </div>
        )}
        {itens.length === 0 ? (
          <p className="text-center text-gray-600 py-4">
            {carregando ? 'Carregando pets...' : 'Não há pets cadastrados.'}
          </p>
        ) : (
          <>
            <ListaPets
              pets={itens}
              onSelecionar={id => navigate(`/pets/${id}`)}
              onEditar={id => navigate(`/pets/${id}/editar`)}
              onExcluir={petsFacade.removerPet}
            />
          </>
        )}
      </section>

      <section className="flex flex-wrap items-center gap-4 text-sm bg-gray-50 p-4 rounded-lg border max-w-xl">
        <Botao
          disabled={pagina === 0}
          variante="secundario"
          onClick={() => petsFacade.paginaAnterior()}
        >
          Anterior
        </Botao>

        <span>
          Página <strong>{paginaAtual}</strong> de{' '}
          <strong>{totalPaginas}</strong>
        </span>

        <Botao
          disabled={paginaAtual >= totalPaginas}
          variante="secundario"
          onClick={() => petsFacade.proximaPagina()}
        >
          Próxima
        </Botao>

        <span className="ml-2 text-gray-600">
          Total de pets: {total}
        </span>
      </section>
    </div>
  )
}
