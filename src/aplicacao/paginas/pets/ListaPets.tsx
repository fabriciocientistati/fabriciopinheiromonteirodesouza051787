import { useEffect, useState } from 'react'
import { petsFacade } from '../../facades/PetsFacade'
import type { PetsViewEstado } from '../../../estado/petsEstado'

export function ListaPets() {
  const [estado, setEstado] = useState<PetsViewEstado | null>(null)

  useEffect(() => {
    const inscricao = petsFacade.estado$.subscribe(setEstado)

    petsFacade.listar(0)

    return () => {
      inscricao.unsubscribe()
    }
  }, [])

  if (!estado) {
    return <p>Inicializando...</p>
  }

  if (estado.carregando) {
    return <p>Carregando...</p>
  }

  if (estado.erro) {
    return <p>{estado.erro}</p>
  }

  return (
    <div>
      <h1>Lista de Pets</h1>

      {estado.itens.map(pet => (
        <div key={pet.id}>
          {pet.nome}
        </div>
      ))}
    </div>
  )
}
