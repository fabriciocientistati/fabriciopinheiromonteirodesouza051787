import { petsEstado } from '../../estado/petsEstado'
import { PetsServico } from '../../infraestrutura/servicos/PetsServico'
import type { Pet } from '../../dominio/modelos/Pet'
import type { Tutor } from '../../dominio/modelos/Tutor'
import { tutoresServico } from '../../infraestrutura/servicos/TutoresServico'
import { erroEh401, mensagemErro } from '../utils/errosHttp'
import { MENSAGENS_ERRO } from '../utils/mensagensErro'

const petsServico = new PetsServico()

class PetsFacade {
  readonly estado$ = petsEstado.estado$
  private readonly cacheTutores = new Map<number, Tutor>()
  private readonly cacheTutoresPromise = new Map<number, Promise<Tutor>>()

  obterSnapshot() {
    return petsEstado.obterSnapshot()
  }

  private obterTutorDetalhe(id: number): Promise<Tutor> {
    const emCache = this.cacheTutores.get(id)
    if (emCache) {
      return Promise.resolve(emCache)
    }

    const emAndamento = this.cacheTutoresPromise.get(id)
    if (emAndamento) {
      return emAndamento
    }

    const promessa = tutoresServico
      .buscarPorId(id)
      .then(tutor => {
        this.cacheTutores.set(id, tutor)
        return tutor
      })
      .finally(() => {
        this.cacheTutoresPromise.delete(id)
      })

    this.cacheTutoresPromise.set(id, promessa)
    return promessa
  }

  async carregarTutoresDetalhe(tutores: Tutor[]): Promise<{
    tutores: Tutor[]
    falhaIds: number[]
  }> {
    if (tutores.length === 0) {
      return { tutores: [], falhaIds: [] }
    }

    const idsUnicos = Array.from(new Set(tutores.map(tutor => tutor.id)))
    const resultados = await Promise.allSettled(
      idsUnicos.map(async id => {
        await this.obterTutorDetalhe(id)
        return id
      }),
    )

    const falhaIds = resultados.flatMap((resultado, indice) =>
      resultado.status === 'rejected' ? [idsUnicos[indice]] : [],
    )

    const tutoresOrdenados = tutores.map(tutor => {
      const detalhado = this.cacheTutores.get(tutor.id)
      return detalhado ?? tutor
    })

    return { tutores: tutoresOrdenados, falhaIds }
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
      petsEstado.definirErro(mensagemErro(erro, MENSAGENS_ERRO.PETS_CARREGAR))
    }
  }

async criar(dados: Omit<Pet, 'id'>) {
  try {
    petsEstado.definirCriando()

    const petCriado = await petsServico.criar(dados)

    petsEstado.definirCriado()
    return petCriado
  } catch (erro) {
    const mensagem = mensagemErro(erro, MENSAGENS_ERRO.PETS_CRIAR)
    petsEstado.definirErro(mensagem)
    throw new Error(mensagem)
  }
}

async atualizar(id: number, dados: Partial<Pet>) {
  try {
    petsEstado.definirCriando()
    const pet = await petsServico.atualizar(id, dados)
    petsEstado.definirCriado()
    return pet
  } catch (erro) {
    const mensagem = mensagemErro(erro, MENSAGENS_ERRO.PETS_ATUALIZAR)
    petsEstado.definirErro(mensagem)
    throw new Error(mensagem)
  }
}

async buscarPorId(id: number) {
  try {
    petsEstado.definirCarregandoDetalhe() 
    
    const pet = await petsServico.buscarPorId(id) 
    
    petsEstado.definirDetalhe(pet) 
  } catch (erro) { 
    petsEstado.definirErro(
      mensagemErro(erro, MENSAGENS_ERRO.PETS_DETALHE),
    ) 
  } 
}  

  async recarregarDetalheSilencioso(id: number) {
    try {
      const pet = await petsServico.buscarPorId(id)
      petsEstado.definirDetalhe(pet)
    } catch (erro) {
      petsEstado.definirErro(
        mensagemErro(erro, MENSAGENS_ERRO.PETS_DETALHE),
      )
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
  } catch (erro) {
    const mensagem = mensagemErro(erro, MENSAGENS_ERRO.PETS_CRIAR)
    petsEstado.definirErro(mensagem)
    throw new Error(mensagem)
  }
}

async atualizarFoto(id: number, arquivo: File, fotoIdAnterior?: number | null) {
  try {
    const petAtualizado = await petsServico.adicionarFoto(id, arquivo)
    const fotoNovaId = petAtualizado.foto?.id ?? null

    if (fotoIdAnterior && fotoIdAnterior !== fotoNovaId) {
      await petsServico.removerFoto(id, fotoIdAnterior)
    }

    const estadoAtual = petsEstado.obterSnapshot()
    const itensAtualizados = estadoAtual.itens.map((pet) =>
      pet.id === id ? { ...pet, foto: petAtualizado.foto } : pet,
    )

    petsEstado.definirDados(
      itensAtualizados,
      estadoAtual.pagina,
      estadoAtual.total,
      estadoAtual.tamanhoPagina,
      estadoAtual.contadorPagina,
    )

    petsEstado.definirDetalhe(petAtualizado)
    return petAtualizado
  } catch (erro) {
    const mensagem = mensagemErro(erro, MENSAGENS_ERRO.PETS_ATUALIZAR_FOTO)
    petsEstado.definirErro(mensagem)
    throw new Error(mensagem)
  }
}

async removerPet(id: number) {
  try {
    petsEstado.definirCarregando()

    await petsServico.remover(id)

    petsEstado.definirRemoverDaLista(id)

  } catch (erro) {
    const mensagem = mensagemErro(erro, MENSAGENS_ERRO.PETS_REMOVER)
    petsEstado.definirErro(mensagem)
    throw new Error(mensagem)
  }
}

async removerFoto(petId: number, fotoId: number) {
  try {
    await petsServico.removerFoto(petId, fotoId)
    const estadoAtual = petsEstado.obterSnapshot()
    const itensAtualizados = estadoAtual.itens.map((pet) =>
      pet.id === petId ? { ...pet, foto: undefined } : pet,
    )

    petsEstado.definirDados(
      itensAtualizados,
      estadoAtual.pagina,
      estadoAtual.total,
      estadoAtual.tamanhoPagina,
      estadoAtual.contadorPagina,
    )

    if (estadoAtual.petSelecionado?.id === petId) {
      petsEstado.definirDetalhe({
        ...estadoAtual.petSelecionado,
        foto: undefined,
      })
    }
  } catch (erro) {
    const mensagem = mensagemErro(erro, MENSAGENS_ERRO.PETS_REMOVER_FOTO)
    petsEstado.definirErro(mensagem)
    throw new Error(mensagem)
  }
}

  limpar() {
    petsEstado.limpar()
    this.cacheTutores.clear()
    this.cacheTutoresPromise.clear()
  }
}

export const petsFacade = new PetsFacade()
