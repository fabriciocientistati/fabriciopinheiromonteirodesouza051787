import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { tutoresFacade } from '../../../facades/TutoresFacade'
import { useTutoresEstado } from '../hooks/useTutoresEstado'
import { Titulo } from '../../../componentes/ui/Titulo'
import { Input } from '../../../componentes/ui/Input'
import { Botao } from '../../../componentes/ui/Botao'
import { Toast } from '../../../componentes/ui/Toast'
import { ListaTutores } from '../componentes/ListaTutores'
import { useAutenticacao } from '../../../hooks/useAutenticacao'

const TEMPO_DEBOUNCE = 400

export function ListaTutoresPagina() {
  const navigate = useNavigate()
  const location = useLocation()
  const { itens, carregando, erro, pagina, total, tamanhoPagina, filtroBusca } = useTutoresEstado()
  const { versaoToken, autenticado } = useAutenticacao()

  const paginaAtual = pagina + 1
  const totalPaginas = tamanhoPagina > 0 ? Math.ceil(total / tamanhoPagina) : 1

  const [busca, setBusca] = useState(filtroBusca)
  const [paginaIr, setPaginaIr] = useState('')
  const inicializouRef = useRef(false)
  const debounceRef = useRef<number | undefined>(undefined)
  const ignorarDebounceRef = useRef(false)
  const filtroInicialRef = useRef(filtroBusca)
  const filtroAtivo = filtroBusca.trim() !== ''

  const mensagemSucesso =
    (location.state as { mensagemSucesso?: string } | null)
      ?.mensagemSucesso ?? null

  useEffect(() => {
    if (!autenticado) return
    if (!inicializouRef.current) {
      inicializouRef.current = true
      if (filtroInicialRef.current.trim() === '') {
        // Primeira carga: limpa busca e carrega pagina 0 uma unica vez.
        void tutoresFacade.definirBusca('')
        return
      }
      // Primeira carga com filtro ativo: carrega pagina atual com filtro.
      void tutoresFacade.carregarPagina()
      return
    }
    // Recarrega dados quando o token muda, sem resetar a busca atual.
    void tutoresFacade.carregarPagina()
  }, [autenticado, versaoToken])

  useEffect(() => {
    const container = document.querySelector('main') as HTMLElement | null
    if (container) {
      container.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [pagina])

  const aplicarBusca = (valor?: string) => {
    const buscaNormalizada = (valor ?? busca).trim()
    if (debounceRef.current) {
      window.clearTimeout(debounceRef.current)
      debounceRef.current = undefined
    }
    tutoresFacade.definirBusca(buscaNormalizada)
    setPaginaIr('')
  }

  const limparBusca = () => {
    ignorarDebounceRef.current = true
    setBusca('')
    aplicarBusca('')
  }

  const irParaPagina = () => {
    const numero = Number(paginaIr)
    if (!Number.isFinite(numero)) return
    const paginaAlvo = Math.min(Math.max(Math.trunc(numero), 1), totalPaginas)
    if (paginaAlvo === paginaAtual) {
      setPaginaIr('')
      return
    }
    tutoresFacade.irParaPagina(paginaAlvo - 1)
    setPaginaIr('')
  }

  useEffect(() => {
    const buscaNormalizada = busca.trim()
    if (ignorarDebounceRef.current) {
      ignorarDebounceRef.current = false
      return
    }
    if (buscaNormalizada === filtroBusca) return

    if (debounceRef.current) {
      window.clearTimeout(debounceRef.current)
    }

    debounceRef.current = window.setTimeout(() => {
      tutoresFacade.definirBusca(buscaNormalizada)
    }, TEMPO_DEBOUNCE)

    return () => {
      if (debounceRef.current) {
        window.clearTimeout(debounceRef.current)
      }
    }
  }, [busca, filtroBusca])

  const renderSkeletons = () => (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="animate-pulse bg-white border rounded-lg shadow-sm p-4"
        >
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gray-200" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-3 bg-gray-200 rounded w-1/2" />
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <div className="h-8 bg-gray-200 rounded" />
            <div className="h-8 bg-gray-200 rounded" />
            <div className="h-8 bg-gray-200 rounded" />
          </div>
        </div>
      ))}
    </div>
  )

  const renderNavegacao = (compacto: boolean) => (
    <section className={compacto ? 'space-y-1' : 'space-y-2'}>
      <h3
        className={
          compacto
            ? 'sr-only'
            : 'text-sm font-semibold text-gray-700 uppercase tracking-wide text-center sm:text-left'
        }
      >
        Navegação
      </h3>

      <div
        className={
          'flex flex-wrap justify-center sm:justify-start items-center rounded-lg border max-w-xl ' +
          (compacto
            ? 'gap-3 text-xs bg-gray-50/70 p-3'
            : 'gap-4 text-sm bg-gray-50 p-4')
        }
      >
        <Botao
          disabled={pagina === 0}
          onClick={() => {
            setPaginaIr('')
            tutoresFacade.paginaAnterior()
          }}
          variante="secundario"
        >
          Anterior
        </Botao>

        <span className="text-gray-700">
          Página <strong>{paginaAtual}</strong> de <strong>{totalPaginas}</strong>
        </span>

        <Botao
          disabled={paginaAtual >= totalPaginas}
          onClick={() => {
            setPaginaIr('')
            tutoresFacade.proximaPagina()
          }}
          variante="secundario"
        >
          Próxima
        </Botao>

        <span className="ml-2 text-gray-600">
          Total de tutores: {total}
        </span>
      </div>

      {!compacto && (
        <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
          <span>Ir para página:</span>
          <input
            type="number"
            aria-label="Ir para página"
            min={1}
            max={totalPaginas}
            value={paginaIr}
            onChange={e => setPaginaIr(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                e.preventDefault()
                irParaPagina()
              }
            }}
            className="w-20 rounded-md border border-gray-300 px-2 py-1 text-sm"
          />
          <Botao
            variante="secundario"
            className="px-3 py-1 text-sm"
            onClick={irParaPagina}
          >
            Ir
          </Botao>
        </div>
      )}
    </section>
  )

  return (
    <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 space-y-10">
      {mensagemSucesso && (
        <Toast
          mensagem={mensagemSucesso}
          tipo="sucesso"
          tempoMs={3000}
          onFechar={() =>
            navigate(location.pathname, { replace: true, state: null })
          }
        />
      )}

      {erro && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-md px-4 py-3 text-center sm:text-left space-y-2">
          <p>{erro}</p>
          <div className="flex justify-center sm:justify-start">
            <Botao variante="secundario" onClick={() => tutoresFacade.carregarPagina()}>
              Tentar novamente
            </Botao>
          </div>
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
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <svg
                  aria-hidden="true"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="h-4 w-4"
                >
                  <path d="M12.9 14.32a8 8 0 1 1 1.414-1.414l3.387 3.387-1.414 1.414-3.387-3.387zM8 14a6 6 0 1 0 0-12 6 6 0 0 0 0 12z" />
                </svg>
              </span>
              <Input
                placeholder="Buscar tutor por nome"
                value={busca}
                onChange={e => {
                  setBusca(e.target.value)
                  if (paginaIr) setPaginaIr('')
                }}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    aplicarBusca()
                  }
                }}
                className="w-full pl-10 pr-10 bg-white shadow-sm border-gray-200 focus:border-[#193282] focus:ring-[#193282]/20"
              />
              {busca.trim() !== '' && (
                <button
                  type="button"
                  onClick={limparBusca}
                  aria-label="Limpar busca"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  X
                </button>
              )}
            </div>
            {filtroAtivo && (
              <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-gray-600">
                <span className="inline-flex items-center gap-1 rounded-full bg-[#e8eefc] text-[#193282] border border-[#d6e0fb] px-2 py-1">
                  Filtro ativo: <strong className="font-medium">{filtroBusca}</strong>
                </span>
                <button
                  type="button"
                  onClick={limparBusca}
                  className="text-[#193282] hover:text-[#1f3da0] underline"
                >
                  Limpar filtro
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {renderNavegacao(true)}

      <section className="space-y-2">
        <div className="bg-white border rounded-lg shadow-sm p-2 sm:p-4 relative">
          {carregando && itens.length > 0 && (
            <div className="absolute right-3 top-3 text-xs text-gray-500 bg-white/90 px-2 py-1 rounded">
              Atualizando lista...
            </div>
          )}
          {carregando && itens.length === 0 ? (
            renderSkeletons()
          ) : itens.length === 0 ? (
            <div className="text-center text-gray-600 py-6 space-y-3">
              <p>Não há tutores cadastrados.</p>
              <Botao variante="sucesso" onClick={() => navigate('/tutores/novo')}>
                Cadastrar tutor
              </Botao>
            </div>
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

      {renderNavegacao(false)}
    </div>
  )
}





