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
      petsFacade.buscarPorId(Number(id))
    }

    return () => inscricao.unsubscribe()
  }, [id])

  if (!estado) return <p>Inicializando...</p>
  if (estado.carregando) return <p>Carregando...</p>
  if (estado.erro) return <p>{estado.erro}</p>
  if (!estado.petSelecionado) return <p>Pet não encontrado.</p>

  const pet = estado.petSelecionado

  return (
    <div>
      <h1>Detalhe do Pet</h1>
      <p><strong>Nome:</strong> {pet.nome}</p>
      <p><strong>Raça:</strong> {pet.raca}</p>
      <p><strong>Idade:</strong> {pet.idade}</p>
    </div>
  )
}
