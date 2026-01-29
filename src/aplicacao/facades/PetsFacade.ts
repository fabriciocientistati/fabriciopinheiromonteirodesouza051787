import { petsEstado } from '../../estado/petsEstado'
import { PetsServico } from '../../infraestrutura/servicos/PetsServico'
import type { Pet } from '../../dominio/modelos/Pet'

const petsServico = new PetsServico()

class PetsFacade {
  readonly estado$ = petsEstado.estado$

  obterSnapshot() {
    return petsEstado.obterSnapshot()
  }

  async listar(pagina = 0) {
    try {
      petsEstado.definirCarregando()

      const resposta = await petsServico.listar(pagina, 10)

      petsEstado.definirDados(
        resposta.content,
        resposta.pagina,
        resposta.total,
        resposta.tamanhoPagina,
        resposta.paginaContador
      )
    } catch {
      petsEstado.definirErro('Erro ao carregar lista de pets')
    }
  }

  async irParaPagina(pagina: number) {
  petsEstado.definirPagina(pagina)
  await this.listar(pagina)
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

async atualizar(id: number, dados: Partial<Pet>) {
  try {
    petsEstado.definirCriando()
    const pet = await petsServico.atualizar(id, dados)
    petsEstado.definirCriado()
    return pet
  } catch {
    petsEstado.definirErro('Erro ao atualizar pet')
    throw new Error('Erro ao atualizar pet')
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

async atualizarFoto(id: number, arquivo: File) {
  try {
    await petsServico.adicionarFoto(id, arquivo)
  } catch {
    petsEstado.definirErro('Erro ao atualizar foto')
    throw new Error('Erro ao atualizar foto')
  }
}

async removerPet(id: number) {
  try {
    await petsServico.remover(id)
  } catch {
    petsEstado.definirErro('Erro ao remover pet')
    throw new Error('Erro ao remover pet')
  }
}

async removerFoto(petId: number, fotoId: number) {
  try {
    await petsServico.removerFoto(petId, fotoId)
  } catch {
    petsEstado.definirErro('Erro ao remover foto')
    throw new Error('Erro ao remover pet')
  }
}

  limpar() {
    petsEstado.limpar()
  }
}

export const petsFacade = new PetsFacade()
