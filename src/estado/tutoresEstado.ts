import { BehaviorSubject } from 'rxjs'
import type { PetVinculadoViewModel, TutorViewModel } from '../aplicacao/modelos'

export type TutoresViewEstado = {
  itens: TutorViewModel[]
  carregando: boolean
  criando?: boolean
  erro: string | null
  pagina: number
  total: number
  tamanhoPagina: number
  contadorPagina: number
  tutorSelecionado?: TutorViewModel | null
  filtroBusca: string
  petsVinculados: PetVinculadoViewModel[]
  petsDisponiveis: PetVinculadoViewModel[]
}

const estadoInicial: TutoresViewEstado = {
  itens: [],
  carregando: false,
  pagina: 0,
  total: 0,
  erro: null,
  tamanhoPagina: 10,
  contadorPagina: 0,
  tutorSelecionado: null,
  filtroBusca: '',
  petsVinculados: [],
  petsDisponiveis: [] as PetVinculadoViewModel[],
}

class TutoresEstado {
  private readonly estadoInterno$ =
    new BehaviorSubject<TutoresViewEstado>(estadoInicial)

  readonly estado$ = this.estadoInterno$.asObservable()

  obterSnapshot() {
    return this.estadoInterno$.value
  }

  definirCarregando() {
    this.estadoInterno$.next({
      ...this.estadoInterno$.value,
      carregando: true,
      erro: null,
    })
  }

  finalizarCarregamento() {
    this.estadoInterno$.next({
      ...this.estadoInterno$.value,
      carregando: false,
      erro: null,
    })
  }

  definirPetsDisponiveis(pets: PetVinculadoViewModel[]) {
    this.estadoInterno$.next({
      ...this.estadoInterno$.value,
      petsDisponiveis: pets,
    })
  }

  definirCriando() {
    this.estadoInterno$.next({
      ...this.estadoInterno$.value,
      criando: true,
      erro: null,
    })
  }

  definirCriado() {
    this.estadoInterno$.next({
      ...this.estadoInterno$.value,
      criando: false,
    })
  }

  definirDados(
    itens: TutorViewModel[],
    pagina: number,
    total: number,
    tamanhoPagina: number,
    contadorPagina: number
  ) {
    this.estadoInterno$.next({
      ...this.estadoInterno$.value,
      itens,
      pagina,
      total,
      tamanhoPagina,
      contadorPagina,
      carregando: false,
      erro: null,
    })
  }

  definirRemoverDaLista(idTutor: number) {
    const estadoAtual = this.estadoInterno$.value

    const itensAtualizados = estadoAtual.itens.filter(t => t.id !== idTutor)

    this.atualizar({
      itens: itensAtualizados,
      total: Math.max(0, estadoAtual.total - 1),
      carregando: false,
      erro: undefined,
      tutorSelecionado:
        estadoAtual.tutorSelecionado?.id === idTutor
          ? null
          : estadoAtual.tutorSelecionado,
    })
  }


  definirPagina(pagina: number) {
    this.estadoInterno$.next({
      ...this.estadoInterno$.value,
      pagina,
    })
  }

  definirCarregandoDetalhe() {
    this.estadoInterno$.next({
      ...this.estadoInterno$.value,
      carregando: true,
      erro: null,
      tutorSelecionado: null,
      petsVinculados: [],
    })
  }

  definirBusca(busca: string) {
    this.estadoInterno$.next({
      ...this.estadoInterno$.value,
      filtroBusca: busca,
    })
  }

  definirDetalhe(tutor: TutorViewModel) {
    this.estadoInterno$.next({
      ...this.estadoInterno$.value,
      carregando: false,
      tutorSelecionado: tutor,
    })
  }

  definirPetsVinculados(pets: PetVinculadoViewModel[]) {
    this.estadoInterno$.next({
      ...this.estadoInterno$.value,
      petsVinculados: pets,
    })
  }

  definirErro(mensagem: string) {
    this.estadoInterno$.next({
      ...this.estadoInterno$.value,
      carregando: false,
      erro: mensagem,
    })
  }

  private atualizar(parcial: Partial<TutoresViewEstado>) {
    this.estadoInterno$.next({
      ...this.estadoInterno$.value,
      ...parcial,
    })
  }

  limpar() {
    this.estadoInterno$.next(estadoInicial)
  }
}

export const tutoresEstado = new TutoresEstado()
