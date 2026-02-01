import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { tutoresFacade } from '../../facades/TutoresFacade'
import { useTutoresEstado } from '../../hooks/useTutoresEstado'
import { Titulo } from '../../componentes/ui/Titulo'
import { Input } from '../../componentes/ui/Input'
import { Botao } from '../../componentes/ui/Botao'
import { ListaTutores } from './componentes/ListarTutores'

const TEMPO_DEBOUNCE = 400

export function ListaTutoresPagina() {
  const navigate = useNavigate()
  const { itens, carregando, erro, pagina, total, tamanhoPagina } = useTutoresEstado()

  const paginaAtual = pagina + 1
  const totalPaginas = tamanhoPagina > 0 ? Math.ceil(total / tamanhoPagina) : 1

  const [busca, setBusca] = useState('')

  useEffect(() => {
    tutoresFacade.definirBusca('')
    tutoresFacade.irParaPagina(0)
    tutoresFacade.carregarPagina()
  }, [])

  useEffect(() => {
    const timeout = setTimeout(() => {
      tutoresFacade.definirBusca(busca.trim())
      tutoresFacade.irParaPagina(0)
      tutoresFacade.carregarPagina()
    }, TEMPO_DEBOUNCE)

    return () => clearTimeout(timeout)
  }, [busca])

  if (carregando)
    return <p className="text-gray-600 text-sm">Carregando tutores...</p>

  if (erro)
    return <p className="text-red-600 text-sm">{erro}</p>

  return (
    <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 space-y-10">
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
        <div className="bg-white border rounded-lg shadow-sm p-2 sm:p-4">
          <ListaTutores
            tutores={itens}
            onSelecionar={id => navigate(`/tutores/${id}`)}
            onExcluir={tutoresFacade.removerTutor}
          />
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
