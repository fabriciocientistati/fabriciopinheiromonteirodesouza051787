
import type { Pet as PetDto } from '../../dominio/modelos/Pet'
import type { Tutor as TutorDto } from '../../dominio/modelos/Tutor'
import { tutoresEstado } from '../../estado/tutoresEstado'
import { tutoresServico } from '../../infraestrutura/servicos/TutoresServico'
import { PetsServico } from '../../infraestrutura/servicos/PetsServico'
import type { PetVinculadoViewModel } from '../modelos'
import { mapPetParaVinculado, mapTutor, mapTutores } from '../mappers/modelosMapper'
import { erroEh401, mensagemErro } from '../utils/errosHttp'
import { MENSAGENS_ERRO } from '../utils/mensagensErro'
import { normalizarCpf } from '../utils/validacoes'

const petsServico = new PetsServico()

class TutoresFacade {

  readonly estado$ = tutoresEstado.estado$
  private readonly cachePets = new Map<number, PetVinculadoViewModel>()
  private readonly cachePetsPromise = new Map<
    number,
    Promise<PetVinculadoViewModel>
  >()

  obterSnapshot() {
    return tutoresEstado.obterSnapshot()
  }

  private obterPetDetalhe(id: number): Promise<PetVinculadoViewModel> {
    const emCache = this.cachePets.get(id)
    if (emCache) {
      return Promise.resolve(emCache)
    }

    const emAndamento = this.cachePetsPromise.get(id)
    if (emAndamento) {
      return emAndamento
    }

    const promessa = petsServico
      .buscarPorId(id)
      .then((pet: PetDto) => {
        const vinculado = mapPetParaVinculado(pet)
        this.cachePets.set(id, vinculado)
        return vinculado
      })
      .finally(() => {
        this.cachePetsPromise.delete(id)
      })

    this.cachePetsPromise.set(id, promessa)
    return promessa
  }

  async carregarPetsDetalhe(pets: PetVinculadoViewModel[]): Promise<{
    pets: PetVinculadoViewModel[]
    falhaIds: number[]
  }> {
    if (pets.length === 0) {
      return { pets: [], falhaIds: [] }
    }

    const idsUnicos = Array.from(new Set(pets.map(pet => pet.id)))
    const resultados = await Promise.allSettled(
      idsUnicos.map(async id => {
        await this.obterPetDetalhe(id)
        return id
      }),
    )

    const falhaIds = resultados.flatMap((resultado, indice) =>
      resultado.status === 'rejected' ? [idsUnicos[indice]] : [],
    )

    const petsOrdenados = pets.map(pet => {
      const detalhado = this.cachePets.get(pet.id)
      return detalhado ?? pet
    })

    return { pets: petsOrdenados, falhaIds }
  }

  async irParaPagina(pagina: number) {
    tutoresEstado.definirPagina(pagina)
    await this.carregarPagina(pagina)
  }

  async carregarPagina(pagina?: number) {
    try {
      tutoresEstado.definirCarregando()

      const { tamanhoPagina, filtroBusca, pagina: paginaAtual } =
        tutoresEstado.obterSnapshot()
      const paginaSolicitada = pagina ?? paginaAtual

      const {
        content,
        pagina: paginaResposta,
        total,
        tamanhoPagina: tam,
        paginaContador,
      } = await tutoresServico.listar(
        paginaSolicitada,
        tamanhoPagina,
        filtroBusca,
      )

      tutoresEstado.definirDados(
        mapTutores(content),
        paginaResposta,
        total,
        tam,
        paginaContador,
      )
      

    } catch (erro) {
      if (erroEh401(erro)) {
        tutoresEstado.finalizarCarregamento()
        return
      }
      tutoresEstado.definirErro(
        mensagemErro(erro, MENSAGENS_ERRO.TUTORES_CARREGAR),
      )
    }
  }

  definirBusca(busca: string) {
    const buscaNormalizada = busca.trim()
    tutoresEstado.definirBusca(buscaNormalizada === '' ? '' : buscaNormalizada)
    void this.irParaPagina(0)
  }

    proximaPagina() {
    const estadoAtual = tutoresEstado.obterSnapshot()

    const proxima = estadoAtual.pagina + 1
    void this.irParaPagina(proxima)
  }

  paginaAnterior() {
    const estadoAtual = tutoresEstado.obterSnapshot()

    if (estadoAtual.pagina === 0) return

    const anterior = estadoAtual.pagina - 1
    void this.irParaPagina(anterior)
  }

  async buscarPorId(id: number) {
    try {
      tutoresEstado.definirCarregandoDetalhe() 
      
      const tutor = await tutoresServico.buscarPorId(id) 
      
      tutoresEstado.definirDetalhe(mapTutor(tutor, { incluirPets: true })) 
    } catch (erro) { 
      tutoresEstado.definirErro(
        mensagemErro(erro, MENSAGENS_ERRO.TUTORES_DETALHE),
      ) 
    } 
  }  

  async carregarDetalhe(id: number) {
    try {
      tutoresEstado.definirCarregandoDetalhe()

      const tutor = await tutoresServico.buscarPorId(id)
      const tutorMapeado = mapTutor(tutor, { incluirPets: true })

      tutoresEstado.definirDetalhe(tutorMapeado)

      const pets = tutorMapeado.pets ?? []
      tutoresEstado.definirPetsVinculados(pets)

    } catch (erro) {
      tutoresEstado.definirErro(
        mensagemErro(erro, MENSAGENS_ERRO.TUTORES_DETALHE),
      )
    }
  }

  async carregarPetsDisponiveis(nome: string) {
    const pets = await tutoresServico.listarPets(nome)
    tutoresEstado.definirPetsDisponiveis(
      (pets as PetDto[]).map(mapPetParaVinculado),
    )
  }


  async criar(tutor: Omit<TutorDto, 'id' | 'foto'>) {
    try {
      tutoresEstado.definirCriando()

      try {
        const cpfDuplicado = await this.cpfJaExiste(tutor.cpf)
        if (cpfDuplicado) {
          tutoresEstado.definirCriado()
          tutoresEstado.definirErro(MENSAGENS_ERRO.CPF_DUPLICADO)
          throw new Error(MENSAGENS_ERRO.CPF_DUPLICADO)
        }
      } catch (erroValidacao) {
        if (
          erroValidacao instanceof Error &&
          erroValidacao.message === MENSAGENS_ERRO.CPF_DUPLICADO
        ) {
          throw erroValidacao
        }

        tutoresEstado.definirCriado()
        tutoresEstado.definirErro(MENSAGENS_ERRO.CPF_VALIDACAO)
        throw new Error(MENSAGENS_ERRO.CPF_VALIDACAO)
      }

      const novoTutor = await tutoresServico.criar(tutor)
      const tutorMapeado = mapTutor(novoTutor, { incluirPets: true })

      tutoresEstado.definirCriado()
      return tutorMapeado

    } catch (erro) {
      if (
        erro instanceof Error &&
        (erro.message === MENSAGENS_ERRO.CPF_DUPLICADO ||
          erro.message === MENSAGENS_ERRO.CPF_VALIDACAO)
      ) {
        throw erro
      }

      const mensagem = mensagemErro(erro, MENSAGENS_ERRO.TUTORES_CRIAR)
      tutoresEstado.definirErro(mensagem)
      throw new Error(mensagem)
    }
  }

  async atualizar(id: number, tutor: Omit<TutorDto, 'id' | 'foto'>) {
    try {
      tutoresEstado.definirCriando()

      try {
        const cpfDuplicado = await this.cpfJaExiste(tutor.cpf, id)
        if (cpfDuplicado) {
          tutoresEstado.definirCriado()
          tutoresEstado.definirErro(MENSAGENS_ERRO.CPF_DUPLICADO)
          throw new Error(MENSAGENS_ERRO.CPF_DUPLICADO)
        }
      } catch (erroValidacao) {
        if (
          erroValidacao instanceof Error &&
          erroValidacao.message === MENSAGENS_ERRO.CPF_DUPLICADO
        ) {
          throw erroValidacao
        }

        tutoresEstado.definirCriado()
        tutoresEstado.definirErro(MENSAGENS_ERRO.CPF_VALIDACAO)
        throw new Error(MENSAGENS_ERRO.CPF_VALIDACAO)
      }

      const atualizado = await tutoresServico.atualizar(id, tutor)
      const tutorMapeado = mapTutor(atualizado, { incluirPets: true })

      tutoresEstado.definirCriado()
      return tutorMapeado

    } catch (erro) {
      if (
        erro instanceof Error &&
        (erro.message === MENSAGENS_ERRO.CPF_DUPLICADO ||
          erro.message === MENSAGENS_ERRO.CPF_VALIDACAO)
      ) {
        throw erro
      }

      const mensagem = mensagemErro(erro, MENSAGENS_ERRO.TUTORES_ATUALIZAR)
      tutoresEstado.definirErro(mensagem)
      throw new Error(mensagem)
    }
  }

  async atualizarFoto(
    id: number,
    arquivo: File,
    fotoIdAnterior?: number | null,
  ) {
    try {
      const tutorAtualizado = await tutoresServico.atualizarFoto(id, arquivo)
      const tutorMapeado = mapTutor(tutorAtualizado, { incluirPets: true })
      const fotoNovaId = tutorMapeado.foto?.id ?? null

      if (fotoIdAnterior && fotoIdAnterior !== fotoNovaId) {
        await tutoresServico.removerFoto(id, fotoIdAnterior)
      }

      const estadoAtual = tutoresEstado.obterSnapshot()
      const itensAtualizados = estadoAtual.itens.map((tutor) =>
        tutor.id === id ? { ...tutor, foto: tutorMapeado.foto } : tutor,
      )

      tutoresEstado.definirDados(
        itensAtualizados,
        estadoAtual.pagina,
        estadoAtual.total,
        estadoAtual.tamanhoPagina,
        estadoAtual.contadorPagina,
      )

      tutoresEstado.definirDetalhe(tutorMapeado)
    } catch (erro) {
      tutoresEstado.definirErro(
        mensagemErro(erro, MENSAGENS_ERRO.TUTORES_ATUALIZAR_FOTO),
      )
    }
  }

  async removerFoto(tutorId: number, fotoId: number) {
    try {
      await tutoresServico.removerFoto(tutorId, fotoId)
      const estadoAtual = tutoresEstado.obterSnapshot()
      const itensAtualizados = estadoAtual.itens.map((tutor) =>
        tutor.id === tutorId ? { ...tutor, foto: undefined } : tutor,
      )

      tutoresEstado.definirDados(
        itensAtualizados,
        estadoAtual.pagina,
        estadoAtual.total,
        estadoAtual.tamanhoPagina,
        estadoAtual.contadorPagina,
      )

      if (estadoAtual.tutorSelecionado?.id === tutorId) {
        tutoresEstado.definirDetalhe({
          ...estadoAtual.tutorSelecionado,
          foto: undefined,
        })
      }
    } catch (erro) {
      const mensagem = mensagemErro(
        erro,
        MENSAGENS_ERRO.TUTORES_REMOVER_FOTO,
      )
      tutoresEstado.definirErro(mensagem)
      throw new Error(mensagem)
    }
  }

  async vincularPet(idTutor: number, idPet: number) {
    try {
      await tutoresServico.vincularPet(idTutor, idPet)

      const tutorAtualizado = await tutoresServico.buscarPorId(idTutor)
      const tutorMapeado = mapTutor(tutorAtualizado, { incluirPets: true })

      tutoresEstado.definirDetalhe(tutorMapeado)
      tutoresEstado.definirPetsVinculados(tutorMapeado.pets ?? [])

    } catch (erro) {
      tutoresEstado.definirErro(
        mensagemErro(erro, MENSAGENS_ERRO.TUTORES_VINCULAR_PET),
      )
    }
  }

  async removerTutor(id: number){
    try {
      tutoresEstado.definirCarregando()

      await tutoresServico.remover(id)

      tutoresEstado.definirRemoverDaLista(id)

    } catch (erro) {
      const mensagem = mensagemErro(erro, MENSAGENS_ERRO.TUTORES_REMOVER)
      tutoresEstado.definirErro(mensagem)
      throw new Error(mensagem)
    }
  }

  async removerVinculo(idTutor: number, idPet: number) {
    try {
      await tutoresServico.removerVinculo(idTutor, idPet)

      const tutorAtualizado = await tutoresServico.buscarPorId(idTutor)
      const tutorMapeado = mapTutor(tutorAtualizado, { incluirPets: true })

      tutoresEstado.definirDetalhe(tutorMapeado) 
      tutoresEstado.definirPetsVinculados(tutorMapeado.pets ?? [])

    } catch (erro) {
      tutoresEstado.definirErro(
        mensagemErro(erro, MENSAGENS_ERRO.TUTORES_REMOVER_VINCULO),
      )
    }
  }

  limparEstado() {
    tutoresEstado.limpar()
    this.cachePets.clear()
    this.cachePetsPromise.clear()
  }

  private async cpfJaExiste(cpf?: string | null, idIgnorado?: number): Promise<boolean> {
    const cpfNormalizado = normalizarCpf(cpf)
    if (!cpfNormalizado) return false

    const tamanhoPagina = 50
    let pagina = 0
    let totalPaginas = 1

    while (pagina < totalPaginas) {
      const resposta = await tutoresServico.listar(pagina, tamanhoPagina)
      const existe = resposta.content.some(
        tutor =>
          normalizarCpf(tutor.cpf) === cpfNormalizado &&
          tutor.id !== idIgnorado,
      )

      if (existe) return true

      totalPaginas = resposta.paginaContador || totalPaginas
      pagina += 1

      if (resposta.content.length === 0) break
    }

    return false
  }
}

export const tutoresFacade = new TutoresFacade()





