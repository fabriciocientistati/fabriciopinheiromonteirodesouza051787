import type { Tutor } from "../../../../dominio/modelos/Tutor";
import { Card } from "../../../componentes/ui/Card";
import { formatarCpf, formatarTelefone, normalizarCpf } from "../../../utils/validacoes";

interface Props {
  tutor: Tutor;
}

export function CardTutor({ tutor }: Props) {
  const telefoneFormatado = formatarTelefone(tutor.telefone);
  const cpfFormatado = formatarCpf(normalizarCpf(tutor.cpf));

  return (
    <Card className="p-6">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
        <img
          src={tutor.foto?.url || "/sem-foto.png"}
          alt={tutor.nome}
          className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border mx-auto sm:mx-0"
        />

        <div className="space-y-2 text-center sm:text-left break-words">
          <p className="text-lg font-medium">{tutor.nome}</p>
          <p><strong>Email:</strong> {tutor.email}</p>
          <p><strong>Telefone:</strong> {telefoneFormatado}</p>
          <p><strong>Endereço:</strong> {tutor.endereco}</p>
          <p><strong>CPF:</strong> {cpfFormatado}</p>
        </div>
      </div>
    </Card>
  );
}
