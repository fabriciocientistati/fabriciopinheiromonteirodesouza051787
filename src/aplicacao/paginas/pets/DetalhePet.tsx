import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { petsFacade } from '../../facades/PetsFacade'
import type { PetsViewEstado } from '../../../estado/petsEstado'

export function DetalhePet() {
  const { id } = useParams()
  const [estado, setEstado] = useState<PetsViewEstado | null>(null)

  useEffect(() => {
    const sub = petsFacade.estado$.subscribe(setEstado)

    if (id) {
      petsFacade.buscarPorId(Number(id))
    }

    return () => sub.unsubscribe()
  }, [id])

  if (!estado) return <p>Inicializando...</p>
  if (estado.carregando) return <p>Carregando...</p>
  if (estado.erro) return <p>{estado.erro}</p>
  if (!estado.petSelecionado) return <p>Pet não encontrado.</p>

  const pet = estado.petSelecionado

  return (
    <div>
      <h1>Detalhe do Pet</h1>

      {pet.foto?.url && (
        <img
          src={pet.foto.url}
          alt={pet.nome}
          className="w-48 h-48 object-cover rounded-lg mb-4"
        />
      )}

      <p><strong>Nome:</strong> {pet.nome}</p>
      <p><strong>Raça:</strong> {pet.raca}</p>
      <p><strong>Idade:</strong> {pet.idade}</p>

      <h2 className="mt-4 font-semibold">Tutores</h2>

      {pet.tutores && pet.tutores.length > 0 ? (
        <ul className="mt-2">
          {pet.tutores.map(tutor => (
            <li key={tutor.id} className="mb-4">
              <p><strong>{tutor.nome}</strong></p>
              <p>{tutor.email}</p>
              <p>{tutor.telefone}</p>

              {tutor.foto?.url && (
                <img
                  src={tutor.foto.url}
                  alt={tutor.nome}
                  className="w-20 h-20 object-cover rounded-full mt-2"
                />
              )}  
            </li>
          ))}
        </ul>
      ) : (
        <p>Nenhum tutor associado.</p>
      )}
    </div>
  )
}
