import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { petsFacade } from '../../facades/PetsFacade'
import type { PetsViewEstado } from '../../../estado/petsEstado'

export function DetalhePet() {
  const { id } = useParams()
  const [estado, setEstado] = useState<PetsViewEstado | null>(null)

  useEffect(() => {
    const inscricao = petsFacade.estado$.subscribe(setEstado)

    if (id) {
      // próxima etapa: buscar pet por id
      // petsFacade.buscarPorId(Number(id))
    }

    return () => {
      inscricao.unsubscribe()
    }
  }, [id])

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
      <h1>Detalhe do Pet</h1>
      <p>ID: {id}</p>
    </div>
  )
}
