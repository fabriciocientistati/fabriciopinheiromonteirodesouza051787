import type { PetVinculado } from "../../../../dominio/modelos/PetVinculado"


export function ListaPetsVinculados({
  pets,
  onRemover
}: {
  pets: PetVinculado[]
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
          className="flex justify-between items-center border p-3 rounded"
        >
          <div>
            <p className="font-semibold">{pet.nome}</p>
            <p className="text-sm text-gray-600">
              {pet.especie} — {pet.idade} anos
            </p>
          </div>

          <button onClick={() => onRemover(pet.id)}
            className="px-3 py-1 bg-red-500 text-white rounded"
          >
            Remover
          </button>
        </li>
      ))}
    </ul>
  )
}
