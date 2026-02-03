import { useEffect, useMemo, useRef, useState } from "react";
import type { PetVinculado } from "../../../../dominio/modelos/PetVinculado";
import { petsFacade } from "../../../facades/PetsFacade";
import { useObservable } from "../../../hooks/useObservable";
import { Card } from "../../../componentes/ui/Card";
import { Botao } from "../../../componentes/ui/Botao";
import { Input } from "../../../componentes/ui/Input";

const TEMPO_DEBOUNCE_MS = 300;

export function VincularPetModal({
  aberto,
  onFechar,
  onVincular,
  petsVinculados = [],
}: {
  aberto: boolean;
  onFechar: () => void;
  onVincular: (idPet: number) => Promise<void>;
  petsVinculados?: PetVinculado[];
}) {
  const estadoPets = useObservable(
    petsFacade.estado$,
    petsFacade.obterSnapshot(),
  );

  const [busca, setBusca] = useState("");
  const [mensagemSucesso, setMensagemSucesso] = useState("");
  const timeoutSucessoRef = useRef<number | null>(null);

  const petsVinculadosIds = useMemo(
    () => new Set(petsVinculados.map((pet) => pet.id)),
    [petsVinculados],
  );
  
  useEffect(() => {
    if (!aberto) return;

    const timeout = setTimeout(() => {
      petsFacade.definirBusca(busca.trim());
    }, TEMPO_DEBOUNCE_MS);

    return () => clearTimeout(timeout);
  }, [busca, aberto]);

  async function vincularPet(idPet: number) {
    if (petsVinculadosIds.has(idPet)) return;

    await onVincular(idPet);
    setMensagemSucesso("Pet vinculado com sucesso.");
    if (timeoutSucessoRef.current) {
      window.clearTimeout(timeoutSucessoRef.current);
    }
    timeoutSucessoRef.current = window.setTimeout(() => {
      setMensagemSucesso("");
      timeoutSucessoRef.current = null;
    }, 2000);
    setBusca("");
    petsFacade.definirBusca("");
  }

  function fecharModal() {
    if (timeoutSucessoRef.current) {
      window.clearTimeout(timeoutSucessoRef.current);
      timeoutSucessoRef.current = null;
    }
    setMensagemSucesso("");
    setBusca("");
    petsFacade.definirBusca("");
    onFechar();
  }

  if (!aberto) return null;
  

  const podeIrAnterior = estadoPets.pagina > 0;
  const podeIrProxima = estadoPets.pagina + 1 < estadoPets.contadorPagina;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 sm:p-6">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg lg:max-w-2xl xl:max-w-3xl p-4 sm:p-6 space-y-4 max-h-[90vh] overflow-hidden">
        <h2 className="text-lg font-semibold">Vincular Pet</h2>

        <Input
          placeholder="Buscar pets..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="w-full"
        />

        {mensagemSucesso && (
          <p className="text-emerald-600 text-sm">{mensagemSucesso}</p>
        )}

        {estadoPets.carregando && (
          <p className="text-gray-500">Carregando pets...</p>
        )}
        {estadoPets.erro && <p className="text-red-600">{estadoPets.erro}</p>}

        <ul className="space-y-2 max-h-64 sm:max-h-72 lg:max-h-80 overflow-y-auto">
          {estadoPets.itens.map((pet) => {
            const vinculado = petsVinculadosIds.has(pet.id);

            return (
              <Card
                key={pet.id}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3"
              >
                <div className="flex items-center gap-3 sm:gap-4">
                  <img
                    src={pet.foto?.url || "/sem-foto.png"}
                    alt={pet.nome}
                    className="w-12 h-12 rounded-full object-cover border"
                  />

                  <div className="text-center sm:text-left">
                    <p className="font-semibold">{pet.nome}</p>
                    <p className="text-sm text-gray-600">
                      {pet.raca ?? "Sem raça"}
                    </p>
                  </div>
                </div>

                <Botao
                  variante="sucesso"
                  disabled={vinculado}
                  onClick={() => vincularPet(pet.id)}
                  className="w-full sm:w-auto"
                >
                  {vinculado ? "Vinculado" : "Vincular"}
                </Botao>
              </Card>
            );
          })}
        </ul>

        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mt-6">
          <Botao
            variante="secundario"
            disabled={!podeIrAnterior}
            onClick={() => petsFacade.irParaPagina(0)}
          >
            «
          </Botao>

          <Botao
            variante="secundario"
            disabled={!podeIrAnterior}
            onClick={() => petsFacade.irParaPagina(estadoPets.pagina - 1)}
          >
            ‹
          </Botao>

          <span className="text-sm text-gray-700">
            Página <strong>{estadoPets.pagina + 1}</strong> de{" "}
            <strong>{estadoPets.contadorPagina}</strong>
          </span>

          <Botao
            variante="secundario"
            disabled={!podeIrProxima}
            onClick={() => petsFacade.irParaPagina(estadoPets.pagina + 1)}
          >
            ›
          </Botao>

          <Botao
            variante="secundario"
            disabled={!podeIrProxima}
            onClick={() =>
              petsFacade.irParaPagina(estadoPets.contadorPagina - 1)
            }
          >
            »
          </Botao>
        </div>

        <Botao variante="perigo" onClick={fecharModal} className="w-full sm:w-auto sm:self-end">
          Fechar
        </Botao>
      </div>
    </div>
  );
}
