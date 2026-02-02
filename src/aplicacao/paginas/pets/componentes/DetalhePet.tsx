import type { Pet } from '../../../../dominio/modelos/Pet'
import type { Tutor } from '../../../../dominio/modelos/Tutor'
import { Titulo } from '../../../componentes/ui/Titulo'
import { CardPet } from './CardPet'
import { DetalheTutoresVinculados } from './DetalheTutoresVinculados'

interface Props {
  pet: Pet
  tutores: Tutor[]
}

export function DetalhePet({ pet, tutores }: Props) {
  return (
    <div className="space-y-6">
      <div className="text-center sm:text-left">
        <Titulo>Detalhes do Pet</Titulo>
      </div>

      <CardPet pet={pet} />

      <DetalheTutoresVinculados tutores={tutores} />
    </div>
  )
}
