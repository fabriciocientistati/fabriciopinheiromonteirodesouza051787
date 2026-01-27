import { petsEstado } from '../../estado/petsEstado'
import { PetsServico } from '../../infraestrutura/servicos/PetsServico'

const petsServico = new PetsServico()

class PetsFacade {
  readonly estado$ = petsEstado.estado$

  async listar(pagina = 0) {
    try {
      petsEstado.definirCarregando()

      const resposta = await petsServico.listar(pagina, 10)

      petsEstado.definirDados(
        resposta.content,
        resposta.page,
        resposta.total,
      )
    } catch {
      petsEstado.definirErro('Erro ao carregar lista de pets')
    }
  }

  limpar() {
    petsEstado.limpar()
  }
}

export const petsFacade = new PetsFacade()
