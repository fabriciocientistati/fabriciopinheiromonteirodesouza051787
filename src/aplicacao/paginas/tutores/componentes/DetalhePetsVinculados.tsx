import type { PetVinculado } from "../../../../dominio/modelos/PetVinculado";
import { Card } from "../../../componentes/ui/Card";
import { Secao } from "../../../componentes/ui/Secao";


interface Props {
  pets: PetVinculado[];
}

export function DetalhePetsVinculados({ pets }: Props) {
  return (
    <Secao titulo="Pets Vinculados">
      {pets.length === 0 ? (
        <p className="text-gray-500">
          Nenhum pet vinculado a este tutor.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {pets.map((pet) => (
            <Card key={pet.id} className="flex gap-4 p-4">
              <img
                src={pet.foto?.url || "/sem-foto.png"}
                alt={pet.nome}
                className="w-16 h-16 rounded-full"
              />

              <div>
                <p className="font-medium">{pet.nome}</p>
                <p className="text-sm text-gray-600">{pet.raca}</p>
                <p className="text-sm text-gray-600">
                  {pet.idade} anos
                </p>
              </div>
            </Card>
          ))}
        </div>
      )}
    </Secao>
  );
}
