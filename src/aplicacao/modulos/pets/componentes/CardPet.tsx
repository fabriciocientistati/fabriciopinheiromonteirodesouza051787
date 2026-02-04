import type { Pet } from '../../../../dominio/modelos/Pet'
import { Card } from '../../../componentes/ui/Card'

interface Props {
  pet: Pet
}

export function CardPet({ pet }: Props) {
  const racaTexto = pet.raca ?? 'Raça não informada'
  const idadeTexto = pet.idade != null ? `${pet.idade} anos` : 'Idade não informada'

  return (
    <Card className="p-6">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
        <img
          src={pet.foto?.url || '/sem-foto.png'}
          alt={pet.nome}
          className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border mx-auto sm:mx-0"
        />

        <div className="space-y-2 text-center sm:text-left break-words">
          <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900 tracking-tight">
            {pet.nome}
          </h2>
          <p>
            <strong>Espécie:</strong> {racaTexto}
          </p>
          <p>
            <strong>Idade:</strong> {idadeTexto}
          </p>
        </div>
      </div>
    </Card>
  )
}
