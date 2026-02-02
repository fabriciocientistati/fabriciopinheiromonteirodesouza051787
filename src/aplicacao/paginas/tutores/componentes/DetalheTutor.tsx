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
    <>
      <Titulo>Detalhes do Tutor</Titulo>

      <CardTutor tutor={tutor} />

      <DetalhePetsVinculados pets={pets} />
    </>
  );
}
