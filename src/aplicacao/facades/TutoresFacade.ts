
import type { Tutor } from '../../dominio/modelos/Tutor'
import { tutoresEstado } from '../../estado/tutoresEstado'
import { tutoresServico } from '../../infraestrutura/servicos/TutoresServico'
import { erroEh401 } from '../utils/errosHttp'

class TutoresFacade {

  readonly estado$ = tutoresEstado.estado$

  obterSnapshot() {
    return tutoresEstado.obterSnapshot()
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

      const novoTutor = await tutoresServico.criar(tutor)

      tutoresEstado.definirCriado()
      return novoTutor

    } catch {
      tutoresEstado.definirErro('Erro ao criar tutor')
      throw Error('Erro ao criar tutor')
    }
  }

  async atualizar(id: number, tutor: Omit<Tutor, 'id' | 'foto'>) {
    try {
      tutoresEstado.definirCriando()

      const atualizado = await tutoresServico.atualizar(id, tutor)

      tutoresEstado.definirCriado()
      return atualizado

    } catch  {
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

      if (fotoIdAnterior && fotoNovaId && fotoIdAnterior !== fotoNovaId) {
        await tutoresServico.removerFoto(id, fotoIdAnterior)
      }

      tutoresEstado.definirDetalhe(tutorAtualizado)
    } catch{
      tutoresEstado.definirErro('Erro ao enviar foto do tutor')
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
      tutoresEstado.definirErro('Erro ao remover vínculo do pet')
    }
  }

  limparEstado() {
    tutoresEstado.limpar()
  }
}

export const tutoresFacade = new TutoresFacade()
