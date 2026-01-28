import { BehaviorSubject } from 'rxjs'
import type { Pet } from '../dominio/modelos/Pet'

export type PetsViewEstado = {
  itens: Pet[]
  carregando: boolean
  criando?: boolean
  erro?: string
  pagina: number
  total: number
  petSelecionado?: Pet | null
}

const estadoInicial: PetsViewEstado = {
  itens: [],
  carregando: false,
  pagina: 0,
  total: 0,
  petSelecionado: null
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


  definirDados(itens: Pet[], pagina: number, total: number) {
    this.estadoInterno$.next({
      ...this.estadoInterno$.value,
      itens,
      pagina,
      total,
      carregando: false,
      erro: undefined,
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

export const petsEstado = new PetsEstado()
