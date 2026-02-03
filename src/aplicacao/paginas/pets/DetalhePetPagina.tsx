import { useNavigate, useParams } from 'react-router-dom'
import { petsFacade } from '../../facades/PetsFacade'
import { useObservable } from '../../hooks/useObservable'
import { useEffect } from 'react'
import { Botao } from '../../componentes/ui/Botao'
import { DetalhePet } from './componentes/DetalhePet'
import { useAutenticacao } from '../../hooks/useAutenticacao'

export function DetalhePetPagina() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { versaoToken } = useAutenticacao()

  const estado = useObservable(
    petsFacade.estado$,
    petsFacade.obterSnapshot()
  )

  useEffect(() => {
    if (id) {
      petsFacade.buscarPorId(Number(id))
    }
  }, [id, versaoToken])

  if (estado.carregando || !estado.petSelecionado) {
    return <p className="px-4 py-6 sm:p-8">Carregando pet...</p>
  }

  return (
    <div className="px-4 py-6 sm:p-8 max-w-4xl mx-auto space-y-8">
      <DetalhePet
        pet={estado.petSelecionado}
        tutores={estado.petSelecionado.tutores ?? []}
      />

      <div className="flex justify-center sm:justify-start">
        <Botao variante="primario" onClick={() => navigate('/pets')}>
          Voltar para lista
        </Botao>
      </div>
    </div>
  )
}
