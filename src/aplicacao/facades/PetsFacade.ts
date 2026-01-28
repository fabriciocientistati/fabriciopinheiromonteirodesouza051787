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

async buscarPorId(id: number) {
  try {
    petsEstado.definirCarregandoDetalhe() 
    
    const pet = await petsServico.buscarPorId(id) 
    
    petsEstado.definirDetalhe(pet) 
  } catch { 
    petsEstado.definirErro('Erro ao carregar detalhes do pet') 
  } 
}  

  limpar() {
    petsEstado.limpar()
  }
}

export const petsFacade = new PetsFacade()
