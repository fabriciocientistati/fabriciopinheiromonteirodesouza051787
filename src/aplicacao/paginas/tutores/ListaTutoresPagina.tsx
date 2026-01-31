import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { tutoresFacade } from '../../facades/TutoresFacade'
import { useObservable } from '../../hooks/useObservable'
import { CardTutor } from './componentes/CardTutor'

export function ListaTutoresPagina() {
  const navigate = useNavigate()
  const estado = useObservable(
    tutoresFacade.estado$,
    tutoresFacade.obterSnapshot(),
  )

  useEffect(() => {
    tutoresFacade.carregarPagina(estado.pagina)
  }, [estado.pagina])

  const podeIrAnterior = estado.pagina > 0
  const podeIrProxima = estado.pagina + 1 < estado.contadorPagina

  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">Tutores</h1>

        <button
          onClick={() => navigate('/tutores/novo')}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Novo Tutor
        </button>
      </div>

      {estado.carregando && <p>Carregando...</p>}
      {estado.erro && <p className="text-red-600">{estado.erro}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {estado.itens.map((tutor) => (
          <CardTutor
            key={tutor.id}
            tutor={tutor}
            onClick={() => navigate(`/tutores/${tutor.id}`)}
          />
        ))}
      </div>

      <div className="flex gap-2 mt-4">
        <button
          disabled={!podeIrAnterior}
          onClick={() => tutoresFacade.irParaPagina(estado.pagina - 1)}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Anterior
        </button>

        <button
          disabled={!podeIrProxima}
          onClick={() => tutoresFacade.irParaPagina(estado.pagina + 1)}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Próxima
        </button>
      </div>
    </div>
  )
}