import { useEffect, useState } from 'react'
import { PetsFacade } from '../../facades/PetsFacade'
import type { Pet } from '../../../dominio/modelos/Pet'

const petsFacade = new PetsFacade()

export default function ListaPets() {
  const [pets, setPets] = useState<Pet[]>([])
  const [pagina, setPagina] = useState(0)
  const [erro, setErro] = useState<string | null>(null)

  useEffect(() => {
    async function carregarPets() {
      try {
        const resposta = await petsFacade.listar(pagina)
        setPets(resposta.content)
      } catch (e) {
        console.error(e)
        setErro('Erro ao carregar pets')
      }
    }

    carregarPets()
  }, [pagina])

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">
        Lista de Pets
      </h1>

      {erro && <p className="text-red-600">{erro}</p>}

      <ul className="space-y-2">
        {pets.map(pet => (
          <li key={pet.id} className="border p-2 rounded">
            <strong>{pet.nome}</strong>
            {pet.idade !== undefined && (
              <span> — {pet.idade} anos</span>
            )}
          </li>
        ))}
      </ul>

      <div className="mt-4 flex gap-2">
        <button
          onClick={() => setPagina(p => Math.max(p - 1, 0))}
          className="px-3 py-1 border rounded"
        >
          Anterior
        </button>

        <button
          onClick={() => setPagina(p => p + 1)}
          className="px-3 py-1 border rounded"
        >
          Próxima
        </button>
      </div>
    </div>
  )
}
