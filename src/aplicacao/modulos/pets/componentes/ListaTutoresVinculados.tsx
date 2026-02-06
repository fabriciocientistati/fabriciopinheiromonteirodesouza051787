import type { TutorViewModel } from '../../../modelos'
import { Botao } from '../../../componentes/ui/Botao'
import { ImagemAvatar } from '../../../componentes/ui/ImagemAvatar'
import { formatarTelefone } from '../../../utils/validacoes'

export function ListaTutoresVinculados({
  tutores,
  onRemover,
}: {
  tutores: TutorViewModel[]
  onRemover: (idTutor: number) => void
}) {
  if (tutores.length === 0) {
    return <p className="text-gray-600">Nenhum tutor vinculado.</p>
  }

  return (
    <ul className="space-y-2 mt-2">
      {tutores.map((tutor) => (
        <li
          key={tutor.id}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border p-3 rounded"
        >
          <div className="flex items-center gap-3">
            <ImagemAvatar
              src={tutor.foto?.url}
              alt={tutor.nome}
              className="w-12 h-12 rounded-full object-cover border bg-white"
            />

            <div>
              <p className="font-semibold">{tutor.nome}</p>
              <p className="text-sm text-gray-600">
                {formatarTelefone(tutor.telefone)}
              </p>
            </div>
          </div>

          <Botao
            variante="perigo"
            type="button"
            onClick={() => onRemover(tutor.id)}
            className="w-full sm:w-auto"
          >
            Remover
          </Botao>
        </li>
      ))}
    </ul>
  )
}
