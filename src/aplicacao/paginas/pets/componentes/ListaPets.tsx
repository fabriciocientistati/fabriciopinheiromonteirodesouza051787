import { useState } from 'react'
import type { Pet } from '../../../../dominio/modelos/Pet'
import { Card } from '../../../componentes/ui/Card'
import { Botao } from '../../../componentes/ui/Botao'
import { Modal } from '../../../componentes/ui/Modal'

interface ListaPetsProps {
  pets: Pet[]
  onSelecionar: (id: number) => void
  onEditar: (id: number) => void
  onExcluir: (id: number) => Promise<void>
}

export function ListaPets({
  pets,
  onSelecionar,
  onEditar,
  onExcluir,
}: ListaPetsProps) {
  const [petParaExcluir, setPetParaExcluir] = useState<Pet | null>(null)

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {pets.map(pet => (
          <Card
            key={pet.id}
            className="p-4 flex flex-col sm:flex-row sm:items-start gap-6 min-h-[240px] hover:shadow-md transition"
          >
            <div className="flex flex-col items-center sm:items-start text-center sm:text-left sm:w-1/2">
              {pet.foto?.url ? (
                <img
                  src={pet.foto.url}
                  alt={`Foto do pet ${pet.nome}`}
                  className="w-20 h-20 rounded-full object-cover border"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-sm">
                  Sem foto
                </div>
              )}

              <div className="mt-3 space-y-1 w-full">
                <h3 className="text-lg font-semibold text-gray-800 break-words">{pet.nome}</h3>
                <p className="text-sm text-gray-600 break-words">
                  {pet.raca} • {pet.idade} anos
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-2 w-full sm:w-1/2">
              <Botao onClick={() => onSelecionar(pet.id)} className="w-full">
                Detalhar
              </Botao>

              <Botao variante="laranja" onClick={() => onEditar(pet.id)} className="w-full">
                Editar
              </Botao>

              <Botao variante="perigo" onClick={() => setPetParaExcluir(pet)} className="w-full">
                Excluir
              </Botao>
            </div>
          </Card>

        ))}
      </div>

      <Modal
        aberto={!!petParaExcluir}
        titulo="Excluir pet"
        onFechar={() => setPetParaExcluir(null)}
        onConfirmar={async () => {
          if (!petParaExcluir) return
          await onExcluir(petParaExcluir.id)
          setPetParaExcluir(null)
        }}
      >
        Deseja realmente excluir o pet{' '}
        <strong>{petParaExcluir?.nome}</strong>?
      </Modal>
    </>
  )
}
