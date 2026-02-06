import type { TutorViewModel } from "../../../modelos";
import { Card } from "../../../componentes/ui/Card";
import { ImagemAvatar } from "../../../componentes/ui/ImagemAvatar";
import { formatarTelefone } from "../../../utils/validacoes";

interface Props {
  tutor: TutorViewModel;
}

export function CardTutor({ tutor }: Props) {
  const telefoneFormatado = formatarTelefone(tutor.telefone);

  return (
    <Card className="p-6">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
        <ImagemAvatar
          src={tutor.foto?.url}
          alt={tutor.nome}
          className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border mx-auto sm:mx-0 bg-white"
        />

        <div className="space-y-2 text-center sm:text-left break-words">
          <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
            Nome do TUTOR
          </p>

          <div className="inline-block max-w-full rounded-xl bg-slate-50 px-4 py-2">
            <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900 tracking-tight">
              <span className="border-l-4 border-slate-900 pl-3">{tutor.nome}</span>
            </h2>
          </div>

          <p className="text-slate-700">
            <strong>Telefone:</strong> {telefoneFormatado}
          </p>

          <p className="text-slate-700">
            <strong>Endereço:</strong> {tutor.endereco}
          </p>
        </div>
      </div>
    </Card>
  )
}
