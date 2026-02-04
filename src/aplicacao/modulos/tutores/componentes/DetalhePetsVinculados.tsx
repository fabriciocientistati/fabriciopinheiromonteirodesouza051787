import { useEffect, useMemo, useState } from "react";
import type { PetVinculado } from "../../../../dominio/modelos/PetVinculado";
import { Card } from "../../../componentes/ui/Card";
import { Secao } from "../../../componentes/ui/Secao";
import { Botao } from "../../../componentes/ui/Botao";
import { Modal } from "../../../componentes/ui/Modal";
import { tutoresFacade } from "../../../facades/TutoresFacade";
import { VincularPetModal } from "./VincularPetModal";


interface Props {
  tutorId: number;
  pets: PetVinculado[];
}

export function DetalhePetsVinculados({ tutorId, pets }: Props) {
  const [vincularAberto, setVincularAberto] = useState(false);
  const [petParaDesvincular, setPetParaDesvincular] =
    useState<PetVinculado | null>(null);
  const [petsDetalhe, setPetsDetalhe] = useState<PetVinculado[] | null>(null);
  const [carregandoDetalhes, setCarregandoDetalhes] = useState(false);
  const [erroDetalhes, setErroDetalhes] = useState<string | null>(null);

  const idsPets = useMemo(
    () => pets.map((pet) => pet.id).join(","),
    [pets],
  );

  useEffect(() => {
    let ativo = true;

    if (pets.length === 0) {
      setPetsDetalhe([]);
      setCarregandoDetalhes(false);
      setErroDetalhes(null);
      return;
    }

    setCarregandoDetalhes(true);
    setErroDetalhes(null);

    const carregarDetalhes = async () => {
      try {
        const { pets: detalhes, falhaIds } =
          await tutoresFacade.carregarPetsDetalhe(pets);

        if (!ativo) return;

        setPetsDetalhe(detalhes);
        if (falhaIds.length > 0) {
          setErroDetalhes(
            "Não foi possível carregar os dados completos de alguns pets.",
          );
        }
      } catch {
        if (!ativo) return;
        setErroDetalhes("Não foi possível carregar os dados dos pets.");
        setPetsDetalhe(pets);
      } finally {
        if (ativo) {
          setCarregandoDetalhes(false);
        }
      }
    };

    void carregarDetalhes();

    return () => {
      ativo = false;
    };
  }, [tutorId, idsPets, pets]);

  const petsExibidos = petsDetalhe ?? pets;

  return (
    <Secao titulo="Pets Vinculados">
      {carregandoDetalhes && (
        <p className="text-sm text-gray-500">
          Carregando dados dos pets...
        </p>
      )}

      {erroDetalhes && (
        <p className="text-sm text-red-600">{erroDetalhes}</p>
      )}

      <div className="flex justify-center sm:justify-end">
        <Botao
          variante="sucesso"
          onClick={() => setVincularAberto(true)}
          className="w-full sm:w-auto"
        >
          Vincular Pet
        </Botao>
      </div>

      {petsExibidos.length === 0 ? (
        <p className="text-gray-500">
          Nenhum pet vinculado a este tutor.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {petsExibidos.map((pet) => (
            <Card
              key={pet.id}
              className="flex flex-col sm:flex-row sm:items-center gap-4 p-4"
            >
              <img
                src={pet.foto?.url || "/sem-foto.png"}
                alt={pet.nome}
                className="w-16 h-16 rounded-full object-cover border mx-auto sm:mx-0"
              />

              <div className="flex-1 text-center sm:text-left">
                <p className="text-base sm:text-lg font-semibold text-slate-900">
                  {pet.nome}
                </p>
                <p className="text-sm text-gray-600">{pet.raca}</p>
                <p className="text-sm text-gray-600">
                  {pet.idade} anos
                </p>
              </div>

              <Botao
                variante="perigo"
                onClick={() => setPetParaDesvincular(pet)}
                className="w-full sm:w-auto"
              >
                Desvincular
              </Botao>
            </Card>
          ))}
        </div>
      )}

      <Modal
        aberto={!!petParaDesvincular}
        titulo="Desvincular pet"
        onFechar={() => setPetParaDesvincular(null)}
        onConfirmar={async () => {
          if (!petParaDesvincular) return;
          await tutoresFacade.removerVinculo(tutorId, petParaDesvincular.id);
          setPetParaDesvincular(null);
        }}
      >
        Deseja realmente desvincular o pet{" "}
        <strong>{petParaDesvincular?.nome}</strong> deste tutor?
      </Modal>

      <VincularPetModal
        aberto={vincularAberto}
        onFechar={() => setVincularAberto(false)}
        onVincular={async (idPet) => {
          await tutoresFacade.vincularPet(tutorId, idPet);
        }}
        petsVinculados={pets}
      />
    </Secao>
  );
}
