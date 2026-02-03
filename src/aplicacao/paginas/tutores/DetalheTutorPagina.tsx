import { useNavigate, useParams } from "react-router-dom";
import { tutoresFacade } from "../../facades/TutoresFacade";
import { useObservable } from "../../hooks/useObservable";
import { useEffect } from "react";
import { DetalheTutor } from "./componentes/DetalheTutor";
import { Botao } from "../../componentes/ui/Botao";
import { useAutenticacao } from "../../hooks/useAutenticacao";

export function DetalheTutorPagina() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { versaoToken } = useAutenticacao();

  const estado = useObservable(
    tutoresFacade.estado$,
    tutoresFacade.obterSnapshot()
  );

  useEffect(() => {
    if (id) {
      tutoresFacade.carregarDetalhe(Number(id));
    }
  }, [id, versaoToken]);

  if (estado.carregando || !estado.tutorSelecionado) {
    return <p className="px-4 py-6 sm:p-8">Carregando tutor...</p>;
  }

  return (
    <div className="px-4 py-6 sm:p-8 max-w-4xl mx-auto space-y-8">
      <DetalheTutor
        tutor={estado.tutorSelecionado}
        pets={estado.petsVinculados}
      />
      <div className="flex justify-center sm:justify-start">
        <Botao variante="primario" onClick={() => navigate("/tutores")}>
          Voltar para lista
        </Botao>
      </div>
    </div>
  );
}
