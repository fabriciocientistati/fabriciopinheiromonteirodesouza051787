import type { TutorViewModel } from "../../../modelos";
import { Card } from "../../../componentes/ui/Card";
import { formatarTelefone } from "../../../utils/validacoes";

interface Props {
  tutor: TutorViewModel;
}

export function CardTutor({ tutor }: Props) {
  const telefoneFormatado = formatarTelefone(tutor.telefone);

  return (
    <Card className="p-6">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
        <img
          src={tutor.foto?.url || "/sem-foto.png"}
          alt={tutor.nome}
          className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border mx-auto sm:mx-0"
        />

        <div className="space-y-2 text-center sm:text-left break-words">
          <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900 tracking-tight">
            {tutor.nome}
          </h2>
          <p><strong>Telefone:</strong> {telefoneFormatado}</p>
          <p><strong>Endereço:</strong> {tutor.endereco}</p>
        </div>
      </div>
    </Card>
  );
}
