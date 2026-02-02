
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
  onEditar: (id: number) => void
  onExcluir: (id: number) => Promise<void>
}

export function ListaTutores({
  tutores,
  onSelecionar,
  onEditar,
  onExcluir,
}: ListaTutoresProps) {
  const [tutorParaExcluir, setTutorParaExcluir] = useState<Tutor | null>(null)
  const [tutorParaVincular, setTutorParaVincular] = useState<Tutor | null>(null)
  
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tutores.map(tutor => (
        <Card className="p-4 flex flex-col sm:flex-row sm:items-start gap-6 min-h-[240px]">

          <div className="flex flex-col items-center sm:items-start text-center sm:text-left sm:w-1/2">
            {tutor.foto?.url ? (
              <img
                src={tutor.foto.url}
                alt={`Foto do tutor ${tutor.nome}`}
                className="w-20 h-20 rounded-full object-cover border"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-sm">
                Sem foto
              </div>
            )}

            <div className="mt-3 space-y-1 w-full">
              <h3 className="text-lg font-semibold text-gray-800 break-words">
                {tutor.nome}
              </h3>
              <p className="text-sm text-gray-600 break-words">{tutor.email}</p>
              <p className="text-sm text-gray-600 break-words">{tutor.telefone}</p>
            </div>
          </div>

          <div className="flex flex-col gap-2 w-full sm:w-1/2">
            <Botao variante="sucesso" onClick={() => setTutorParaVincular(tutor)} className="w-full">
              Vincular Pet
            </Botao>
            <Botao onClick={() => onSelecionar(tutor.id)} className="w-full">
              Detalhar
            </Botao>
            <Botao variante="laranja" onClick={() => onEditar(tutor.id)} className="w-full">
              Editar
            </Botao>
            <Botao variante="perigo" onClick={() => setTutorParaExcluir(tutor)} className="w-full">
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
