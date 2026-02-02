import type { Tutor } from "../../../../dominio/modelos/Tutor";
import { Card } from "../../../componentes/ui/Card";

interface Props {
  tutor: Tutor;
}

export function CardTutor({ tutor }: Props) {
  return (
    <Card className="p-6">
      <div className="flex items-center gap-6">
        <img
          src={tutor.foto?.url || "/sem-foto.png"}
          alt={tutor.nome}
          className="w-28 h-28 rounded-full object-cover border"
        />

        <div className="space-y-2">
          <p className="text-lg font-medium">{tutor.nome}</p>
          <p><strong>Email:</strong> {tutor.email}</p>
          <p><strong>Telefone:</strong> {tutor.telefone}</p>
          <p><strong>Endereço:</strong> {tutor.endereco}</p>
          <p><strong>CPF:</strong> {tutor.cpf}</p>
        </div>
      </div>
    </Card>
  );
}
