import { petsEstado } from '../../estado/petsEstado'
import { PetsServico } from '../../infraestrutura/servicos/PetsServico'
import type { Pet } from '../../dominio/modelos/Pet'
import { erroEh401 } from '../utils/errosHttp'

const petsServico = new PetsServico()

class PetsFacade {
  readonly estado$ = petsEstado.estado$

  obterSnapshot() {
    return petsEstado.obterSnapshot()
  }

  async irParaPagina(pagina: number) {
    petsEstado.definirPagina(pagina)
    await this.carregarPagina(pagina)
  }

  async carregarPagina(pagina?: number) {
    try {
      petsEstado.definirCarregando()
    const { tamanhoPagina, filtroBusca, pagina: paginaAtual } =
        petsEstado.obterSnapshot()
      const paginaSolicitada = pagina ?? paginaAtual

      const {
        content,
        pagina: paginaResposta,
        total,
        tamanhoPagina: tam,
        paginaContador,
      } = await petsServico.listar(
        paginaSolicitada,
        tamanhoPagina,
        filtroBusca,
      )

      petsEstado.definirDados(
        content,
        paginaResposta,
        total,
        tam,
        paginaContador,
      )
      

    } catch (erro) {
      if (erroEh401(erro)) {
        petsEstado.finalizarCarregamento()
        return
      }
        petsEstado.definirErro('Erro ao carregar pets')
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

async definirBusca(busca: string) {
      const buscaNormalizada = busca.trim()

      petsEstado.definirBusca(buscaNormalizada === '' ? '' : buscaNormalizada)

      await this.irParaPagina(0)
    }

    proximaPagina() {
    const estadoAtual = petsEstado.obterSnapshot()

    const proxima = estadoAtual.pagina + 1
    void this.irParaPagina(proxima)
  }

  paginaAnterior() {
    const estadoAtual = petsEstado.obterSnapshot()

    if (estadoAtual.pagina === 0) return

    const anterior = estadoAtual.pagina - 1
    void this.irParaPagina(anterior)
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
    petsEstado.definirCarregando()

    await petsServico.remover(id)

    petsEstado.definirRemoverDaLista(id)

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
