import { petsEstado } from '../../estado/petsEstado'
import { PetsServico } from '../../infraestrutura/servicos/PetsServico'
import type { Pet } from '../../dominio/modelos/Pet'

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

async criar(dados: Omit<Pet, 'id'>) {
  try {
    petsEstado.definirCriando()

    const petCriado = await petsServico.criar(dados)

    petsEstado.definirCriado()
    return petCriado
  } catch {
    petsEstado.definirErro('Erro ao criar pet')
    throw new Error('Erro ao criar pet')
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

async criarComImagem(dados: Omit<Pet, 'id'>, arquivo?: File) {
  try {
    petsEstado.definirCriando()

    const petCriado = await petsServico.criar(dados)

    if (arquivo) {
      await petsServico.adicionarFoto(petCriado.id, arquivo)
    }

    petsEstado.definirCriado()

    return petCriado
  } catch {
    petsEstado.definirErro('Erro ao criar pet')
    throw new Error('Erro ao criar pet')
  }
}

  limpar() {
    petsEstado.limpar()
  }
}

export const petsFacade = new PetsFacade()
