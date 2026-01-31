import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { tutoresFacade } from "../../facades/TutoresFacade";
import { useObservable } from "../../hooks/useObservable";
import { Card } from "../../componentes/ui/Card";
import { Botao } from "../../componentes/ui/Botao";
import { Titulo } from "../../componentes/ui/Titulo";
import { Secao } from "../../componentes/ui/Secao";
import { VincularPetModal } from "./componentes/VincularPetModal";

export function DetalheTutorPagina() {
  const { id } = useParams();
  const navigate = useNavigate();
  const estado = useObservable(
    tutoresFacade.estado$,
    tutoresFacade.obterSnapshot(),
  );

  const [modalAberto, setModalAberto] = useState(false);

  useEffect(() => {
    if (id) {
      tutoresFacade.carregarDetalhe(Number(id));
    }
  }, [id]);

  const tutor = estado.tutorSelecionado;

  if (estado.carregando || !tutor) {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <p className="text-gray-500">Carregando dados do tutor...</p>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-10 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <Botao variante="primario" onClick={() => navigate("/tutores")}>
          Voltar
        </Botao>

        <Botao
          variante="laranja"
          onClick={() => navigate(`/tutores/${tutor.id}/editar`)}
        >
          Editar
        </Botao>
      </div>

      <div className="flex justify-between items-center">
        <Titulo>Detalhes do Tutor</Titulo>
      </div>

      <Card className="p-6">
        <div className="flex items-center gap-6">
          <img
            src={tutor.foto?.url || "/sem-foto.png"}
            alt={tutor.nome}
            className="w-28 h-28 rounded-full object-cover border border-gray-200"
          />

          <div className="space-y-2">
            <p className="text-lg font-medium text-gray-900">{tutor.nome}</p>
            <p className="text-gray-700">
              <strong>Email:</strong> {tutor.email}
            </p>
            <p className="text-gray-700">
              <strong>Telefone:</strong> {tutor.telefone}
            </p>
            <p className="text-gray-700">
              <strong>Endereço:</strong> {tutor.endereco}
            </p>
            <p className="text-gray-700">
              <strong>CPF:</strong> {tutor.cpf}
            </p>
          </div>
        </div>
      </Card>

      <Secao titulo="Pets Vinculados">
        <div className="flex justify-end mb-4">
          <Botao variante="primario" onClick={() => setModalAberto(true)}>
            Vincular Pet
          </Botao>
        </div>

        {estado.petsVinculados.length === 0 ? (
          <p className="text-gray-500">Nenhum pet vinculado a este tutor.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {estado.petsVinculados.map((pet) => (
              <Card key={pet.id} className="flex items-center gap-4 p-4">
                <img
                  src={pet.foto?.url || "/sem-foto.png"}
                  alt={pet.nome}
                  className="w-16 h-16 rounded-full object-cover border border-gray-200"
                />

                <div className="flex-1">
                  <p className="font-medium text-gray-900">{pet.nome}</p>
                  <p className="text-sm text-gray-600">{pet.raca}</p>
                  <p className="text-sm text-gray-600">{pet.idade} anos</p>
                </div>

                <Botao
                  variante="perigo"
                  onClick={() => tutoresFacade.removerVinculo(tutor.id, pet.id)}
                >
                  Remover
                </Botao>
              </Card>
            ))}
          </div>
        )}
      </Secao>

      <VincularPetModal
        aberto={modalAberto}
        onFechar={() => setModalAberto(false)}
        onVincular={async (idPet) => {
          await tutoresFacade.vincularPet(tutor.id, idPet);
          setModalAberto(false);
        }}
      />
    </div>
  );
}
