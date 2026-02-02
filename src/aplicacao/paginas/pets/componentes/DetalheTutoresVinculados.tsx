import type { Tutor } from '../../../../dominio/modelos/Tutor'
import { Card } from '../../../componentes/ui/Card'
import { Secao } from '../../../componentes/ui/Secao'

interface Props {
  tutores: Tutor[]
}

export function DetalheTutoresVinculados({ tutores }: Props) {
  return (
    <Secao titulo="Tutores Vinculados">
      {tutores.length === 0 ? (
        <p className="text-gray-500">
          Nenhum tutor vinculado a este pet.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tutores.map(tutor => (
            <Card
              key={tutor.id}
              className="flex flex-col sm:flex-row sm:items-center gap-4 p-4"
            >
              <img
                src={tutor.foto?.url || '/sem-foto.png'}
                alt={tutor.nome}
                className="w-16 h-16 rounded-full object-cover border mx-auto sm:mx-0"
              />

              <div className="text-center sm:text-left">
                <p className="font-medium">{tutor.nome}</p>
                <p className="text-sm text-gray-600">
                  {tutor.email}
                </p>
                <p className="text-sm text-gray-600">
                  {tutor.telefone}
                </p>
              </div>
            </Card>
          ))}
        </div>
      )}
    </Secao>
  )
}
