import { useEffect, useState } from "react";
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
}: {
  aberto: boolean;
  onFechar: () => void;
  onVincular: (idPet: number) => Promise<void>;
}) {
  const estadoPets = useObservable(
    petsFacade.estado$,
    petsFacade.obterSnapshot(),
  );

  const [busca, setBusca] = useState(estadoPets.filtroBusca ?? "");

  useEffect(() => {
    if (!aberto) return;

    const timeout = setTimeout(() => {
      petsFacade.definirBusca(busca.trim());
      petsFacade.irParaPagina(0);
    }, TEMPO_DEBOUNCE_MS);

    return () => clearTimeout(timeout);
  }, [busca, aberto]);

  useEffect(() => {
    if (aberto) {
      petsFacade.irParaPagina(0);
    }
  }, [aberto]);

  if (!aberto) return null;

  const podeIrAnterior = estadoPets.pagina > 0;
  const podeIrProxima = estadoPets.pagina + 1 < estadoPets.contadorPagina;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-lg space-y-4">
        <h2 className="text-lg font-semibold">Vincular Pet</h2>

        <Input
          placeholder="Buscar pets..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="w-full"
        />

        {estadoPets.carregando && (
          <p className="text-gray-500">Carregando pets...</p>
        )}
        {estadoPets.erro && <p className="text-red-600">{estadoPets.erro}</p>}

        <ul className="space-y-2 max-h-64 overflow-auto">
          {estadoPets.itens.map((pet) => (
            <Card
              key={pet.id}
              className="flex justify-between items-center p-3"
            >
              <div className="flex items-center gap-3">
                <img
                  src={pet.foto?.url || "/sem-foto.png"}
                  alt={pet.nome}
                  className="w-12 h-12 rounded-full object-cover border"
                />

                <div>
                  <p className="font-semibold">{pet.nome}</p>
                  <p className="text-sm text-gray-600">
                    {pet.raca ?? "Sem raça"}
                  </p>
                </div>
              </div>

              <Botao variante="sucesso" onClick={() => onVincular(pet.id)}>
                Vincular
              </Botao>
            </Card>
          ))}
        </ul>

        <div className="flex items-center justify-center gap-4 mt-8">
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

          <span className="text-sm">
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

        <Botao variante="perigo" onClick={onFechar} className="w-full">
          Fechar
        </Botao>
      </div>
    </div>
  );
}
