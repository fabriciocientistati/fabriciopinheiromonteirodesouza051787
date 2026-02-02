import { BehaviorSubject } from 'rxjs'
import type { Pet } from '../dominio/modelos/Pet'

export type PetsViewEstado = {
  itens: Pet[]
  carregando: boolean
  criando?: boolean
  erro?: string
  pagina: number
  total: number
  tamanhoPagina: number
  contadorPagina: number
  petSelecionado?: Pet | null
  filtroBusca: string
}

const estadoInicial: PetsViewEstado = {
  itens: [],
  carregando: false,
  pagina: 0,
  total: 0,
  tamanhoPagina: 10,
  contadorPagina: 0,
  petSelecionado: null,
  filtroBusca: '',
}

class PetsEstado {
  private readonly estadoInterno$ =
    new BehaviorSubject<PetsViewEstado>(estadoInicial)

  readonly estado$ = this.estadoInterno$.asObservable()

  obterSnapshot() {
    return this.estadoInterno$.value
  }

  definirCarregando() {
    this.estadoInterno$.next({
      ...this.estadoInterno$.value,
      carregando: true,
      erro: undefined,
    })
  }

  definirCriando() {
    this.estadoInterno$.next({
      ...this.estadoInterno$.value,
      criando: true,
      erro: undefined,
    })
  }

  definirCriado() {
    this.estadoInterno$.next({
      ...this.estadoInterno$.value,
      criando: false,
    })
  }


  definirDados(itens: Pet[], pagina: number, total: number, tamanhoPagina: number, contadorPagina: number) {
    this.estadoInterno$.next({
      ...this.estadoInterno$.value,
      itens,
      pagina,
      total,
      tamanhoPagina,
      contadorPagina,
      carregando: false,
      erro: undefined,
    })
  }

  definirRemoverDaLista(idPet: number) {
    const estadoAtual = this.estadoInterno$.value

    const itensAtualizados = estadoAtual.itens.filter(t => t.id !== idPet)

    this.atualizar({
      itens: itensAtualizados,
      total: Math.max(0, estadoAtual.total - 1),
      carregando: false,
      erro: undefined,
      petSelecionado:
        estadoAtual.petSelecionado?.id === idPet
          ? null
          : estadoAtual.petSelecionado,
    })
  }

  definirPagina(pagina: number) {
    this.estadoInterno$.next({
      ...this.estadoInterno$.value,
      pagina
    })
  }

  definirCarregandoDetalhe() {
    this.estadoInterno$.next({ 
      ...this.estadoInterno$.value, 
      carregando: true, 
      erro: undefined, 
      petSelecionado: null, 
    }) 
  }

  definirDetalhe(pet: Pet) { 
    this.estadoInterno$.next({ 
      ...this.estadoInterno$.value, 
      carregando: false, 
      petSelecionado: pet, 
    }) 
  }

  definirBusca(busca: string) {
    this.estadoInterno$.next({
      ...this.estadoInterno$.value,
      filtroBusca: busca,
    })
  }

  definirErro(mensagem: string) {
    this.estadoInterno$.next({
      ...this.estadoInterno$.value,
      carregando: false,
      erro: mensagem,
    })
  }

  private atualizar(parcial: Partial<PetsViewEstado>) {
      this.estadoInterno$.next({
        ...this.estadoInterno$.value,
        ...parcial,
      })
    }

  limpar() {
    this.estadoInterno$.next(estadoInicial)
  }
}

export const petsEstado = new PetsEstado()
