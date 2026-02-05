import type { PetViewModel, TutorViewModel } from '../../../modelos'
import { Titulo } from '../../../componentes/ui/Titulo'
import { CardPet } from './CardPet'
import { DetalheTutoresVinculados } from './DetalheTutoresVinculados'

interface Props {
  pet: PetViewModel
  tutores: TutorViewModel[]
}

export function DetalhePet({ pet, tutores }: Props) {
  return (
    <div className="space-y-6">
      <div className="text-center sm:text-left">
        <Titulo>Detalhes do Pet</Titulo>
      </div>

      <CardPet pet={pet} />

      <DetalheTutoresVinculados petId={pet.id} tutores={tutores} />
    </div>
  )
}
