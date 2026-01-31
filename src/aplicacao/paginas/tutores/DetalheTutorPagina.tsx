import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { tutoresFacade } from '../../facades/TutoresFacade'
import { useObservable } from '../../hooks/useObservable'
import { ListaPetsVinculados } from './componentes/ListaPetsVinculados'
import { VincularPetModal } from './componentes/VincularPetModal'

export function DetalheTutorPagina() {
  const { id } = useParams()
  const navigate = useNavigate()
  const estado = useObservable(
    tutoresFacade.estado$,
    tutoresFacade.obterSnapshot(),
  )

  const [modalAberto, setModalAberto] = useState(false)

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
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">Detalhes do Tutor</h1>

        <button
          onClick={() => navigate(`/tutores/${tutor.id}/editar`)}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Editar
        </button>
      </div>

      {estado.erro && <p className="text-red-600">{estado.erro}</p>}

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
          <p><strong>Endereço:</strong> {tutor.endereco}</p>
          <p><strong>CPF:</strong> {tutor.cpf}</p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Pets Vinculados</h2>

          <button
            onClick={() => setModalAberto(true)}
            className="px-4 py-2 bg-green-600 text-white rounded"
          >
            Vincular Pet
          </button>
        </div>

        <ListaPetsVinculados
          pets={estado.petsVinculados}
          onRemover={(idPet) => tutoresFacade.removerVinculo(tutor.id, idPet)}
        />
      </div>

      <VincularPetModal
        aberto={modalAberto}
        onFechar={() => setModalAberto(false)}
        onVincular={async (idPet) => {
          await tutoresFacade.vincularPet(tutor.id, idPet)
          setModalAberto(false)
        }}
      />
    </div>
  )
}