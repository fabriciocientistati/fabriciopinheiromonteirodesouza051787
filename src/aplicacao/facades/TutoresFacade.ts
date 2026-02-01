
import type { Tutor } from '../../dominio/modelos/Tutor'
import { tutoresEstado } from '../../estado/tutoresEstado'
import { tutoresServico } from '../../infraestrutura/servicos/TutoresServico'

class TutoresFacade {

  readonly estado$ = tutoresEstado.estado$

  obterSnapshot() {
    return tutoresEstado.obterSnapshot()
  }

  irParaPagina(pagina: number) {
    tutoresEstado.definirPagina(pagina)
  }

  async carregarPagina(Qtdpagina = 0) {
    try {
      tutoresEstado.definirCarregando()

      const { tamanhoPagina, filtroBusca } = tutoresEstado.obterSnapshot()

      const { content, pagina, total, tamanhoPagina: tam, paginaContador } =
        await tutoresServico.listar(Qtdpagina, tamanhoPagina, filtroBusca)

      tutoresEstado.definirDados(content, pagina, total, tam, paginaContador)
      

    } catch {
      tutoresEstado.definirErro('Erro ao carregar tutores')
    }
  }

  definirBusca(busca: string) {
    tutoresEstado.definirBusca(busca)
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

  async atualizarFoto(id: number, arquivo: File) {
    try {
      await tutoresServico.atualizarFoto(id, arquivo)
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

  async removerTutor(id: number) {
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
