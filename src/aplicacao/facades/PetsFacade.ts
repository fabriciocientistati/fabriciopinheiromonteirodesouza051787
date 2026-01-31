import { petsEstado } from '../../estado/petsEstado'
import { PetsServico } from '../../infraestrutura/servicos/PetsServico'
import type { Pet } from '../../dominio/modelos/Pet'

const petsServico = new PetsServico()

class PetsFacade {
  readonly estado$ = petsEstado.estado$

  obterSnapshot() {
    return petsEstado.obterSnapshot()
  }

  async listar(Qtdpagina = 0) {
    try {
      petsEstado.definirCarregando()

      const { content,pagina,total,tamanhoPagina,paginaContador } =
        await petsServico.listar(Qtdpagina, petsEstado.obterSnapshot().tamanhoPagina)

        petsEstado.definirDados(content, pagina, total, tamanhoPagina, paginaContador)

    } catch {
      petsEstado.definirErro('Erro ao carregar lista de pets')
    }
  }

  async irParaPagina(Qtdpagina: number) {
  petsEstado.definirPagina(Qtdpagina)
  await this.listar(Qtdpagina)
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

async atualizarFoto(id: number, arquivo: File, fotoIdAnterior?: number | null) {
  try {
    const petAtualizado = await petsServico.adicionarFoto(id, arquivo)
    const fotoNovaId = petAtualizado.foto?.id ?? null

    if (fotoIdAnterior && fotoIdAnterior !== fotoNovaId) {
      await petsServico.removerFoto(id, fotoIdAnterior)
    }

    petsEstado.definirDetalhe(petAtualizado)
    return petAtualizado
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
    throw new Error('Erro ao remover foto')
  }
}

  limpar() {
    petsEstado.limpar()
  }
}

export const petsFacade = new PetsFacade()
