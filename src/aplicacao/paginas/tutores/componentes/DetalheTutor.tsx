import type { PetVinculado } from "../../../../dominio/modelos/PetVinculado";
import type { Tutor } from "../../../../dominio/modelos/Tutor";
import { Titulo } from "../../../componentes/ui/Titulo";
import { CardTutor } from "./CardTutor";
import { DetalhePetsVinculados } from "./DetalhePetsVinculados";


interface Props {
  tutor: Tutor;
  pets: PetVinculado[];
}

export function DetalheTutor({ tutor, pets }: Props) {
  return (
    <div className="space-y-6">
      <div className="text-center sm:text-left">
        <Titulo>Detalhes do Tutor</Titulo>
      </div>

      <CardTutor tutor={tutor} />

      <DetalhePetsVinculados tutorId={tutor.id} pets={pets} />
    </div>
  );
}
