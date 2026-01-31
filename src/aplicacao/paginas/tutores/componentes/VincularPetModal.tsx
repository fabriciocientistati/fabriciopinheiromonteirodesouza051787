import { useEffect } from 'react'
import { petsFacade } from '../../../facades/PetsFacade'
import { useObservable } from '../../../hooks/useObservable'

export function VincularPetModal({
  aberto,
  onFechar,
  onVincular,
}: {
  aberto: boolean
  onFechar: () => void
  onVincular: (idPet: number) => Promise<void>
}) {
  const estadoPets = useObservable(
    petsFacade.estado$,
    petsFacade.obterSnapshot(),
  )

  useEffect(() => {
    if (aberto) {
      petsFacade.irParaPagina(0)
    }
  }, [aberto])

  if (!aberto) return null

  const podeIrAnterior = estadoPets.pagina > 0
  const podeIrProxima = estadoPets.pagina + 1 < estadoPets.contadorPagina

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-lg space-y-4">
        <h2 className="text-lg font-semibold">Vincular Pet</h2>

        {estadoPets.carregando && <p>Carregando pets...</p>}
        {estadoPets.erro && <p className="text-red-600">{estadoPets.erro}</p>}

        <ul className="space-y-2 max-h-64 overflow-auto">
          {estadoPets.itens.map((pet) => (
            <li
              key={pet.id}
              className="flex justify-between items-center border p-3 rounded"
            >
              <div>
                <p className="font-semibold">{pet.nome}</p>
                <p className="text-sm text-gray-600">{pet.raca ?? 'Sem raça'}</p>
              </div>

              <button
                onClick={() => onVincular(pet.id)}
                className="px-3 py-1 bg-green-600 text-white rounded"
              >
                Vincular
              </button>
            </li>
          ))}
        </ul>

        <div className="flex justify-between mt-4">
          <button
            disabled={!podeIrAnterior}
            onClick={() => petsFacade.irParaPagina(estadoPets.pagina - 1)}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Anterior
          </button>

          <button
            disabled={!podeIrProxima}
            onClick={() => petsFacade.irParaPagina(estadoPets.pagina + 1)}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Próxima
          </button>
        </div>

        <button
          onClick={onFechar}
          className="w-full px-4 py-2 bg-gray-300 rounded"
        >
          Fechar
        </button>
      </div>
    </div>
  )
}