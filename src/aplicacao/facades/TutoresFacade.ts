
import type { Tutor } from '../../dominio/modelos/Tutor'
import type { Pet } from '../../dominio/modelos/Pet'
import type { PetVinculado } from '../../dominio/modelos/PetVinculado'
import { tutoresEstado } from '../../estado/tutoresEstado'
import { tutoresServico } from '../../infraestrutura/servicos/TutoresServico'
import { PetsServico } from '../../infraestrutura/servicos/PetsServico'
import { erroEh401 } from '../utils/errosHttp'
import { normalizarCpf } from '../utils/validacoes'

const ERRO_CPF_DUPLICADO = 'CPF já cadastrado.'
const ERRO_CPF_VALIDACAO = 'Não foi possível validar o CPF.'
const petsServico = new PetsServico()

class TutoresFacade {

  readonly estado$ = tutoresEstado.estado$
  private readonly cachePets = new Map<number, PetVinculado>()
  private readonly cachePetsPromise = new Map<number, Promise<PetVinculado>>()

  obterSnapshot() {
    return tutoresEstado.obterSnapshot()
  }

  private mapearParaPetVinculado(pet: Pet): PetVinculado {
    return {
      id: pet.id,
      nome: pet.nome,
      raca: pet.raca ?? '',
      idade: pet.idade ?? 0,
      foto: pet.foto,
    }
  }

  private obterPetDetalhe(id: number): Promise<PetVinculado> {
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
      .then(pet => {
        const vinculado = this.mapearParaPetVinculado(pet)
        this.cachePets.set(id, vinculado)
        return vinculado
      })
      .finally(() => {
        this.cachePetsPromise.delete(id)
      })

    this.cachePetsPromise.set(id, promessa)
    return promessa
  }

  async carregarPetsDetalhe(pets: PetVinculado[]): Promise<{
    pets: PetVinculado[]
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
        content,
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
        tutoresEstado.definirErro('Erro ao carregar tutores')
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
      
      const pet = await tutoresServico.buscarPorId(id) 
      
      tutoresEstado.definirDetalhe(pet) 
    } catch { 
      tutoresEstado.definirErro('Erro ao carregar detalhes do tutor') 
    } 
  }  

  async carregarDetalhe(id: number) {
    try {
      tutoresEstado.definirCarregandoDetalhe()

      const tutor = await tutoresServico.buscarPorId(id)

      tutoresEstado.definirDetalhe(tutor)

      const pets = tutor.pets ?? []
      tutoresEstado.definirPetsVinculados(pets)

    } catch {
      tutoresEstado.definirErro('Erro ao carregar detalhes do tutor')
    }
  }

  async carregarPetsDisponiveis(nome: string) {
    const pets = await tutoresServico.listarPets(nome)
    tutoresEstado.definirPetsDisponiveis(pets)
  }


  async criar(tutor: Omit<Tutor, 'id' | 'foto'>) {
    try {
      tutoresEstado.definirCriando()

      try {
        const cpfDuplicado = await this.cpfJaExiste(tutor.cpf)
        if (cpfDuplicado) {
          tutoresEstado.definirCriado()
          tutoresEstado.definirErro(ERRO_CPF_DUPLICADO)
          throw new Error(ERRO_CPF_DUPLICADO)
        }
      } catch (erroValidacao) {
        if (erroValidacao instanceof Error && erroValidacao.message === ERRO_CPF_DUPLICADO) {
          throw erroValidacao
        }

        tutoresEstado.definirCriado()
        tutoresEstado.definirErro(ERRO_CPF_VALIDACAO)
        throw new Error(ERRO_CPF_VALIDACAO)
      }

      const novoTutor = await tutoresServico.criar(tutor)

      tutoresEstado.definirCriado()
      return novoTutor

    } catch (erro) {
      if (
        erro instanceof Error &&
        (erro.message === ERRO_CPF_DUPLICADO ||
          erro.message === ERRO_CPF_VALIDACAO)
      ) {
        throw erro
      }

      tutoresEstado.definirErro('Erro ao criar tutor')
      throw Error('Erro ao criar tutor')
    }
  }

  async atualizar(id: number, tutor: Omit<Tutor, 'id' | 'foto'>) {
    try {
      tutoresEstado.definirCriando()

      try {
        const cpfDuplicado = await this.cpfJaExiste(tutor.cpf, id)
        if (cpfDuplicado) {
          tutoresEstado.definirCriado()
          tutoresEstado.definirErro(ERRO_CPF_DUPLICADO)
          throw new Error(ERRO_CPF_DUPLICADO)
        }
      } catch (erroValidacao) {
        if (
          erroValidacao instanceof Error &&
          erroValidacao.message === ERRO_CPF_DUPLICADO
        ) {
          throw erroValidacao
        }

        tutoresEstado.definirCriado()
        tutoresEstado.definirErro(ERRO_CPF_VALIDACAO)
        throw new Error(ERRO_CPF_VALIDACAO)
      }

      const atualizado = await tutoresServico.atualizar(id, tutor)

      tutoresEstado.definirCriado()
      return atualizado

    } catch (erro) {
      if (
        erro instanceof Error &&
        (erro.message === ERRO_CPF_DUPLICADO ||
          erro.message === ERRO_CPF_VALIDACAO)
      ) {
        throw erro
      }

      tutoresEstado.definirErro('Erro ao atualizar tutor')
      throw new Error('Erro ao atualizar tutor')
    }
  }

  async atualizarFoto(
    id: number,
    arquivo: File,
    fotoIdAnterior?: number | null,
  ) {
    try {
      const tutorAtualizado = await tutoresServico.atualizarFoto(id, arquivo)
      const fotoNovaId = tutorAtualizado.foto?.id ?? null

      if (fotoIdAnterior && fotoIdAnterior !== fotoNovaId) {
        await tutoresServico.removerFoto(id, fotoIdAnterior)
      }

      const estadoAtual = tutoresEstado.obterSnapshot()
      const itensAtualizados = estadoAtual.itens.map((tutor) =>
        tutor.id === id ? { ...tutor, foto: tutorAtualizado.foto } : tutor,
      )

      tutoresEstado.definirDados(
        itensAtualizados,
        estadoAtual.pagina,
        estadoAtual.total,
        estadoAtual.tamanhoPagina,
        estadoAtual.contadorPagina,
      )

      tutoresEstado.definirDetalhe(tutorAtualizado)
    } catch{
      tutoresEstado.definirErro('Erro ao enviar foto do tutor')
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
    } catch {
      tutoresEstado.definirErro('Erro ao remover foto do tutor')
      throw new Error('Erro ao remover foto do tutor')
    }
  }

  async vincularPet(idTutor: number, idPet: number) {
    try {
      await tutoresServico.vincularPet(idTutor, idPet)

      const tutorAtualizado = await tutoresServico.buscarPorId(idTutor)

      tutoresEstado.definirDetalhe(tutorAtualizado)
      tutoresEstado.definirPetsVinculados(tutorAtualizado.pets ?? [])

    } catch {
      tutoresEstado.definirErro('Erro ao vincular pet ao tutor')
    }
  }

  async removerTutor(id: number){
    try {
      tutoresEstado.definirCarregando()

      await tutoresServico.remover(id)

      tutoresEstado.definirRemoverDaLista(id)

    } catch {
      tutoresEstado.definirErro('Erro ao remover tutor')
      throw new Error('Erro ao remover tutor')
    }
  }

  async removerVinculo(idTutor: number, idPet: number) {
    try {
      await tutoresServico.removerVinculo(idTutor, idPet)

      const tutorAtualizado = await tutoresServico.buscarPorId(idTutor)

      tutoresEstado.definirDetalhe(tutorAtualizado) 
      tutoresEstado.definirPetsVinculados(tutorAtualizado.pets ?? [])

    } catch {
      tutoresEstado.definirErro('Erro ao remover vÃ­nculo do pet')
    }
  }

  limparEstado() {
    tutoresEstado.limpar()
    this.cachePets.clear()
    this.cachePetsPromise.clear()
  }

  private async cpfJaExiste(cpf: string, idIgnorado?: number): Promise<boolean> {
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





