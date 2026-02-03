import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { tutoresFacade } from '../../facades/TutoresFacade'
import { useTutoresEstado } from '../../hooks/useTutoresEstado'
import { Titulo } from '../../componentes/ui/Titulo'
import { Input } from '../../componentes/ui/Input'
import { Botao } from '../../componentes/ui/Botao'
import { ListaTutores } from './componentes/ListaTutores'
import { useAutenticacao } from '../../hooks/useAutenticacao'

const TEMPO_DEBOUNCE = 400

export function ListaTutoresPagina() {
  const navigate = useNavigate()
  const location = useLocation()
  const { itens, carregando, erro, pagina, total, tamanhoPagina } = useTutoresEstado()
  const { versaoToken, autenticado } = useAutenticacao()

  const paginaAtual = pagina + 1
  const totalPaginas = tamanhoPagina > 0 ? Math.ceil(total / tamanhoPagina) : 1

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
    tutoresFacade.definirBusca('')
  }, [])

  useEffect(() => {
    if (!autenticado || versaoToken === 0) return
    void tutoresFacade.carregarPagina()
  }, [autenticado, versaoToken])

  useEffect(() => {
    if (primeiraBuscaRef.current) {
      primeiraBuscaRef.current = false
      return
    }

    const timeout = setTimeout(() => {
      tutoresFacade.definirBusca(busca.trim())
    }, TEMPO_DEBOUNCE)

    return () => clearTimeout(timeout)
  }, [busca])

  return (
    <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 space-y-10">
      {mensagemSucesso && (
        <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-md px-4 py-3 text-center sm:text-left">
          {mensagemSucesso}
        </div>
      )}

      {erro && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-md px-4 py-3 text-center sm:text-left">
          {erro}
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <Titulo>Lista de Tutores</Titulo>

        <Botao
          variante="sucesso"
          onClick={() => navigate('/tutores/novo')}
          className="w-full sm:w-auto"
        >
          Novo Tutor
        </Botao>
      </div>

      <section className="space-y-4">
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide text-center sm:text-left">
          Filtro de Busca
        </h3>

        <div className="flex justify-center sm:justify-start">
          <div className="w-full max-w-2xl">
            <Input
              placeholder="Buscar tutor por nome"
              value={busca}
              onChange={e => setBusca(e.target.value)}
              className="w-full"
            />
          </div>
        </div>
      </section>

      <section className="space-y-2">
        <div className="bg-white border rounded-lg shadow-sm p-2 sm:p-4 relative">
          {carregando && itens.length > 0 && (
            <div className="absolute right-3 top-3 text-xs text-gray-500 bg-white/90 px-2 py-1 rounded">
              Atualizando lista...
            </div>
          )}
          {itens.length === 0 ? (
            <p className="text-center text-gray-600 py-4">
              {carregando ? 'Carregando tutores...' : 'Não há tutores cadastrados.'}
            </p>
          ) : (
            <>
              <ListaTutores
                tutores={itens}
                onSelecionar={id => navigate(`/tutores/${id}`)}
                onEditar={id => navigate(`/tutores/${id}/editar`)}
                onExcluir={tutoresFacade.removerTutor}
              />
            </>
          )}
        </div>
      </section>

      <section className="space-y-2">
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide text-center sm:text-left">
          Navegação
        </h3>

        <div className="flex flex-wrap justify-center sm:justify-start items-center gap-4 text-sm bg-gray-50 p-4 rounded-lg border max-w-xl">
          <Botao
            disabled={pagina === 0}
            onClick={() => tutoresFacade.paginaAnterior()}
            variante="secundario"
          >
            Anterior
          </Botao>

          <span className="text-gray-700">
            Página <strong>{paginaAtual}</strong> de <strong>{totalPaginas}</strong>
          </span>

          <Botao
            disabled={paginaAtual >= totalPaginas}
            onClick={() => tutoresFacade.proximaPagina()}
            variante="secundario"
          >
            Próxima
          </Botao>

          <span className="ml-2 text-gray-600">
            Total de tutores: {total}
          </span>
        </div>
      </section>
    </div>
  )
}
