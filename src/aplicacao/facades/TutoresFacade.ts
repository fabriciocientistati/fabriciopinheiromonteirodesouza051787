
import type { Tutor } from '../../dominio/modelos/Tutor'
import { tutoresEstado } from '../../estado/tutoresEstado'
import { tutoresServico } from '../../infraestrutura/servicos/TutoresServico'

class TutoresFacade {

  readonly estado$ = tutoresEstado.estado$

  async carregarPagina(Qtdpagina = 0) {
    try {
      tutoresEstado.definirCarregando()

      const { content,pagina,total,tamanhoPagina,paginaContador } =
        await tutoresServico.listar(Qtdpagina, tutoresEstado.obterSnapshot().tamanhoPagina)

        tutoresEstado.definirDados(content, pagina, total, tamanhoPagina, paginaContador)

    } catch {
      tutoresEstado.definirErro('Erro ao carregar tutores')
    }
  }

  async carregarDetalhe(id: number) {
    try {
      tutoresEstado.definirCarregandoDetalhe()

      const tutor = await tutoresServico.buscarPorId(id)
      tutoresEstado.definirDetalhe(tutor)

      const pets = await tutoresServico.listarPetsVinculados(id)
      tutoresEstado.definirPetsVinculados(pets)

    } catch {
      tutoresEstado.definirErro('Erro ao carregar detalhes do tutor')
    }
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

      const pets = await tutoresServico.listarPetsVinculados(idTutor)
      tutoresEstado.definirPetsVinculados(pets)

    } catch {
      tutoresEstado.definirErro('Erro ao vincular pet ao tutor')
    }
  }

  async removerVinculo(idTutor: number, idPet: number) {
    try {
      await tutoresServico.removerVinculo(idTutor, idPet)

      const pets = await tutoresServico.listarPetsVinculados(idTutor)
      tutoresEstado.definirPetsVinculados(pets)

    } catch {
      tutoresEstado.definirErro('Erro ao remover vínculo do pet')
    }
  }

  limparEstado() {
    tutoresEstado.limpar()
  }
}

export const tutoresFacade = new TutoresFacade()
