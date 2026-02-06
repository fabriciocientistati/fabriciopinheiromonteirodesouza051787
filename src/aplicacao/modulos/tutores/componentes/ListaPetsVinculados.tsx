import type { PetVinculadoViewModel } from "../../../modelos"
import { Botao } from "../../../componentes/ui/Botao"
import { ImagemAvatar } from "../../../componentes/ui/ImagemAvatar"

export function ListaPetsVinculados({
  pets,
  onRemover,
}: {
  pets: PetVinculadoViewModel[]
  onRemover: (idPet: number) => void
}) {
  if (pets.length === 0) {
    return <p className="text-gray-600">Nenhum pet vinculado.</p>
  }

  return (
    <ul className="space-y-2 mt-2">
      {pets.map((pet) => (
        <li
          key={pet.id}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border p-3 rounded"
        >
          <div className="flex items-center gap-3">
            <ImagemAvatar
              src={pet.foto?.url}
              alt={pet.nome}
              className="w-12 h-12 rounded-full object-cover border bg-white"
            />

            <div>
              <p className="font-semibold">{pet.nome}</p>
              <p className="text-sm text-gray-600">
                {(pet.raca ?? 'Espécie não informada')} - {pet.idade} anos
              </p>
            </div>
          </div>

          <Botao
            variante="perigo"
            type="button"
            onClick={() => onRemover(pet.id)}
            className="w-full sm:w-auto"
          >
            Remover
          </Botao>
        </li>
      ))}
    </ul>
  )
}
