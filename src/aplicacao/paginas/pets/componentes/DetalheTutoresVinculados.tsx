import { useState } from 'react'
import type { Tutor } from '../../../../dominio/modelos/Tutor'
import { Card } from '../../../componentes/ui/Card'
import { Secao } from '../../../componentes/ui/Secao'
import { Botao } from '../../../componentes/ui/Botao'
import { Modal } from '../../../componentes/ui/Modal'
import { tutoresFacade } from '../../../facades/TutoresFacade'
import { petsFacade } from '../../../facades/PetsFacade'
import { VincularTutorModal } from './VincularTutorModal'
import { formatarTelefone } from '../../../utils/validacoes'

interface Props {
  petId: number
  tutores: Tutor[]
}

export function DetalheTutoresVinculados({ petId, tutores }: Props) {
  const [vincularAberto, setVincularAberto] = useState(false)
  const [tutorParaDesvincular, setTutorParaDesvincular] =
    useState<Tutor | null>(null)

  return (
    <Secao titulo="Tutores Vinculados">
      <div className="flex justify-center sm:justify-end">
        <Botao
          variante="sucesso"
          onClick={() => setVincularAberto(true)}
          className="w-full sm:w-auto"
        >
          Vincular Tutor
        </Botao>
      </div>

      {tutores.length === 0 ? (
        <p className="text-gray-500">
          Nenhum tutor vinculado a este pet.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tutores.map(tutor => (
            <Card
              key={tutor.id}
              className="flex flex-col sm:flex-row sm:items-center gap-4 p-4"
            >
              <img
                src={tutor.foto?.url || '/sem-foto.png'}
                alt={tutor.nome}
                className="w-16 h-16 rounded-full object-cover border mx-auto sm:mx-0"
              />

              <div className="flex-1 text-center sm:text-left">
                <p className="font-medium">{tutor.nome}</p>
                <p className="text-sm text-gray-600">
                  {formatarTelefone(tutor.telefone)}
                </p>
              </div>

              <Botao
                variante="perigo"
                onClick={() => setTutorParaDesvincular(tutor)}
                className="w-full sm:w-auto"
              >
                Desvincular
              </Botao>
            </Card>
          ))}
        </div>
      )}

      <Modal
        aberto={!!tutorParaDesvincular}
        titulo="Desvincular tutor"
        onFechar={() => setTutorParaDesvincular(null)}
        onConfirmar={async () => {
          if (!tutorParaDesvincular) return
          await tutoresFacade.removerVinculo(
            tutorParaDesvincular.id,
            petId
          )
          await petsFacade.buscarPorId(petId)
          setTutorParaDesvincular(null)
        }}
      >
        Deseja realmente desvincular o tutor{' '}
        <strong>{tutorParaDesvincular?.nome}</strong> deste pet?
      </Modal>

      <VincularTutorModal
        aberto={vincularAberto}
        onFechar={() => setVincularAberto(false)}
        onVincular={async idTutor => {
          await tutoresFacade.vincularPet(idTutor, petId)
          await petsFacade.buscarPorId(petId)
        }}
        tutoresVinculados={tutores}
      />
    </Secao>
  )
}
