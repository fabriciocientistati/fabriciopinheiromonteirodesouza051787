
import { useState } from 'react'
import type { Tutor } from '../../../../dominio/modelos/Tutor'
import { Botao } from '../../../componentes/ui/Botao'
import { Card } from '../../../componentes/ui/Card'
import { Modal } from '../../../componentes/ui/Modal'
import { VincularPetModal } from './VincularPetModal'
import { tutoresFacade } from '../../../facades/TutoresFacade'

interface ListaTutoresProps {
  tutores: Tutor[]
  onSelecionar: (id: number) => void
  onExcluir: (id: number) => Promise<void>
}

export function ListaTutores({
  tutores,
  onSelecionar,
  onExcluir,
}: ListaTutoresProps) {
  const [tutorParaExcluir, setTutorParaExcluir] = useState<Tutor | null>(null)
  const [tutorParaVincular, setTutorParaVincular] = useState<Tutor | null>(null)
  
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tutores.map(tutor => (
          <Card
            key={tutor.id}
            className="p-4 flex flex-col gap-3 border rounded-lg shadow-sm hover:shadow-md transition h-full"
          >
            {tutor.foto?.url && (
              <img
                src={tutor.foto.url}
                alt={`Foto do tutor ${tutor.nome}`}
                className="w-20 h-20 rounded-full object-cover border mx-auto"
              />
            )}

            <div className="text-center space-y-1">
              <h3 className="text-lg font-semibold text-gray-800">
                {tutor.nome}
              </h3>

              <p className="text-sm text-gray-600">{tutor.email}</p>
              <p className="text-sm text-gray-600">{tutor.telefone}</p>
            </div>

            <div className="flex flex-wrap justify-center gap-2 mt-2">
              <Botao variante="sucesso" onClick={() => setTutorParaVincular(tutor)} className="w-full sm:w-auto">
                Vincular Pet
              </Botao>

              <Botao onClick={() => onSelecionar(tutor.id)} className="w-full sm:w-auto">
                Detalhar
              </Botao>

              <Botao
                variante="laranja"
                onClick={() => onSelecionar(tutor.id)}
                className="w-full sm:w-auto"
              >
                Editar
              </Botao>

              <Botao
                variante="perigo"
                onClick={() => setTutorParaExcluir(tutor)}
                className="w-full sm:w-auto"
              >
                Excluir
              </Botao>
            </div>
          </Card>
        ))}
      </div>

      <VincularPetModal
        aberto={!!tutorParaVincular}
        onFechar={() => setTutorParaVincular(null)}
        onVincular={async (idPet) => {
          if (!tutorParaVincular) return
          await tutoresFacade.vincularPet(tutorParaVincular.id, idPet)
          setTutorParaVincular(null)
        }}
      />

      <Modal
        aberto={!!tutorParaExcluir}
        titulo="Excluir tutor"
        onFechar={() => setTutorParaExcluir(null)}
        onConfirmar={async () => {
          if (!tutorParaExcluir) return
          await onExcluir(tutorParaExcluir.id)
          setTutorParaExcluir(null)
        }}
      >
        Deseja realmente excluir o tutor{' '}
        <strong>{tutorParaExcluir?.nome}</strong>?
      </Modal>
    </>
  )
}
