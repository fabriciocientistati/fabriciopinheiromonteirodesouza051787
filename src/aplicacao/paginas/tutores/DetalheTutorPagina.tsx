import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { tutoresFacade } from '../../facades/TutoresFacade'
import { useObservable } from '../../hooks/useObservable'

export function DetalheTutorPagina() {
  const { id } = useParams()
  const navigate = useNavigate()
  const estado = useObservable(
    tutoresFacade.estado$,
    tutoresFacade.obterSnapshot(),
  )

  useEffect(() => {
    if (id) {
      tutoresFacade.carregarDetalhe(Number(id))
    }
  }, [id])

  const tutor = estado.tutorSelecionado

  if (estado.carregando || !tutor) {
    return <p className="p-6">Carregando dados do tutor...</p>
  }

  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">Detalhes do Tutor</h1>

        <button
          onClick={() => navigate(`/tutores/${tutor.id}/editar`)}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Editar
        </button>
      </div>

      <div className="flex items-center gap-6">
        <img
          src={tutor.foto?.url || '/sem-foto.png'}
          alt={tutor.nome}
          className="w-24 h-24 rounded-full object-cover"
        />

        <div className="space-y-1">
          <p><strong>Nome:</strong> {tutor.nome}</p>
          <p><strong>Email:</strong> {tutor.email}</p>
          <p><strong>Telefone:</strong> {tutor.telefone}</p>
          <p><strong>Endereco:</strong> {tutor.endereco}</p>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold mt-6">Pets Vinculados</h2>

        {estado.petsVinculados.length === 0 ? (
          <p className="text-gray-600">Nenhum pet vinculado.</p>
        ) : (
          <ul className="space-y-2 mt-2">
            {estado.petsVinculados.map((pet) => (
              <li key={pet.id} className="flex justify-between items-center border p-3 rounded">
                <div>
                  <p className="font-semibold">{pet.nome}</p>
                  <p className="text-sm text-gray-600">{pet.especie} — {pet.idade} anos</p>
                </div>

                <button
                  onClick={() => tutoresFacade.removerVinculo(tutor.id, pet.id)}
                  className="px-3 py-1 bg-red-500 text-white rounded"
                >
                  Remover
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}