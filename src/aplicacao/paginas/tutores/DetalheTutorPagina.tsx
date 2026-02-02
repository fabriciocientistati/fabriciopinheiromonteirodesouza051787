import { useParams } from "react-router-dom";
import { tutoresFacade } from "../../facades/TutoresFacade";
import { useObservable } from "../../hooks/useObservable";
import { useEffect } from "react";
import { DetalheTutor } from "./componentes/DetalheTutor";

export function DetalheTutorPagina() {
  const { id } = useParams();

  const estado = useObservable(
    tutoresFacade.estado$,
    tutoresFacade.obterSnapshot()
  );

  useEffect(() => {
    if (id) {
      tutoresFacade.carregarDetalhe(Number(id));
    }
  }, [id]);

  if (estado.carregando || !estado.tutorSelecionado) {
    return <p className="p-8">Carregando tutor...</p>;
  }

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <DetalheTutor
        tutor={estado.tutorSelecionado}
        pets={estado.petsVinculados}
      />
    </div>
  );
}
