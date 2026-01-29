import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { petsFacade } from '../../facades/PetsFacade'
import type { PetsViewEstado } from '../../../estado/petsEstado'

export function ListaPets() {
  const [estado, setEstado] = useState<PetsViewEstado>({
    itens: [],
    carregando: false,
    pagina: 0,
    total: 0,
    tamanhoPagina: 0,
    contadorPagina: 0,
    petSelecionado: null
  })

  useEffect(() => {
    petsFacade.listar()

    const sub = petsFacade.estado$.subscribe(novoEstado => {
      setEstado(novoEstado)
    })

    return () => sub.unsubscribe()
  }, [])

  async function excluirPet(id: number) {
    const confirmar = confirm('Tem certeza que deseja excluir este pet?')
    if (!confirmar) return

    try {
      await petsFacade.removerPet(id)
      petsFacade.listar() 
    } catch {
      alert('Erro ao remover pet')
    }
  }

  function proximaPagina() {
    if (estado.pagina + 1 < estado.contadorPagina) {
      petsFacade.irParaPagina(estado.pagina + 1)
    }
  }

  function paginaAnterior() {
    if (estado.pagina > 0) {
      petsFacade.irParaPagina(estado.pagina - 1)
    }
  }

  if (estado.carregando) {
    return <p>Carregando...</p>
  }

  return (
    <div>
      <h1>Lista de Pets</h1>

      <Link to="/pets/novo">Criar novo pet</Link>

      {estado.itens.length === 0 && <p>Nenhum pet encontrado.</p>}

      <ul>
        {estado.itens.map(pet => (
          <li key={pet.id}>
            {pet.nome} — {pet.raca} — {pet.idade} anos

            <Link to={`/pets/${pet.id}`}> Ver </Link>

            <Link to={`/pets/${pet.id}/editar`}> Atualizar </Link>

            <button onClick={() => excluirPet(pet.id)}>
              Excluir
            </button>
          </li>
        ))}
      </ul>

      <div> 
        <button disabled={estado.pagina === 0} onClick={paginaAnterior}> 
          Anterior 
        </button> 
        <span> 
          Página {estado.pagina + 1} de {estado.contadorPagina} 
        </span> 
        <button disabled={estado.pagina + 1 >= estado.contadorPagina} onClick={proximaPagina}> 
          Próxima 
        </button> 
      </div> 
        
    </div>
  )
}
