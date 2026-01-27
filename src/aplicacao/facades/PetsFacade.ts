import type { Pet } from "../../dominio/modelos/Pet"
import { PetsServico } from "../../infraestrutura/servicos/PetsServico"

export class PetsFacade {
  private servico = new PetsServico()

  listar(pagina: number) {
    return this.servico.listar(pagina)
  }

  obterPorId(id: number) {
    return this.servico.obterPorId(id)
  }

  criar(dados: Omit<Pet, 'id'>) {
    return this.servico.criar(dados)
  }

  atualizar(id: number, dados: Omit<Pet, 'id'>) {
    return this.servico.atualizar(id, dados)
  }

  remover(id: number) {
    return this.servico.remover(id)
  }
}
