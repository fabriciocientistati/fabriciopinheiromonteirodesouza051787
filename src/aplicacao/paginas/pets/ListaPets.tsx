import { useEffect, useState } from 'react'
import { petsFacade } from '../../facades/PetsFacade'
import type { PetsViewEstado } from '../../../estado/petsEstado'

const TAMANHO_PAGINA = 10

export function ListaPets() {
  const [estado, setEstado] = useState<PetsViewEstado | null>(null)

  useEffect(() => {
    const inscricao = petsFacade.estado$.subscribe(setEstado)
    petsFacade.listar(0)

    return () => inscricao.unsubscribe()
  }, [])

  if (!estado) return <p>Inicializando...</p>
  if (estado.carregando) return <p>Carregando...</p>
  if (estado.erro) return <p>{estado.erro}</p>

  const totalPaginas = Math.ceil(estado.total / TAMANHO_PAGINA)

  return (
    <div>
      <h1>Lista de Pets</h1>

      <ul>
        {estado.itens.map(pet => (
          <li key={pet.id}>{pet.nome}</li>
        ))}
      </ul>

      <div style={{ marginTop: 16 }}>
        <button
          disabled={estado.pagina === 0}
          onClick={() => petsFacade.listar(estado.pagina - 1)}
        >
          Anterior
        </button>

        <span style={{ margin: '0 8px' }}>
          Página {estado.pagina + 1} de {totalPaginas}
        </span>

        <button
          disabled={estado.pagina + 1 >= totalPaginas}
          onClick={() => petsFacade.listar(estado.pagina + 1)}
        >
          Próxima
        </button>
      </div>
    </div>
  )
}
