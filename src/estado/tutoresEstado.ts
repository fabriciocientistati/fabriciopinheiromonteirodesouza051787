import { BehaviorSubject } from 'rxjs'
import type { Tutor } from '../dominio/modelos/Tutor'
import type { PetVinculado } from '../dominio/modelos/PetVinculado'

export type TutoresViewEstado = {
  itens: Tutor[]
  carregando: boolean
  criando?: boolean
  erro: string | null
  pagina: number
  total: number
  tamanhoPagina: number
  contadorPagina: number
  tutorSelecionado?: Tutor | null
  filtroBusca: string
  petsVinculados: PetVinculado[]
  petsDisponiveis: PetVinculado[]
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
  petsDisponiveis: [] as PetVinculado[],
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

  definirPetsDisponiveis(pets: PetVinculado[]) {
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
    itens: Tutor[],
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

  definirDetalhe(tutor: Tutor) {
    this.estadoInterno$.next({
      ...this.estadoInterno$.value,
      carregando: false,
      tutorSelecionado: tutor,
    })
  }

  definirPetsVinculados(pets: PetVinculado[]) {
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

  limpar() {
    this.estadoInterno$.next(estadoInicial)
  }
}

export const tutoresEstado = new TutoresEstado()
