import { BehaviorSubject } from 'rxjs';

export type EstadoAutenticacao = {
    carregando: boolean
    autenticado: boolean
    erro?: string
    token?: string
    refreshToken?: string
    versaoToken: number
}

const estadoInicial: EstadoAutenticacao = {
    carregando: false,
    autenticado: false,
    versaoToken: 0,
}

class GerenteAutenticacaoEstado {
    private readonly estadoInterno$ = new BehaviorSubject<EstadoAutenticacao>(estadoInicial)
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

    definirAutenticado(token: string, refreshToken: string) {
        this.estadoInterno$.next({
            ...this.estadoInterno$.value,
            carregando: false,
            autenticado: true,
            token,
            refreshToken,
            erro: undefined,
        })
    }

    limparErro() {
        this.estadoInterno$.next({
            ...this.estadoInterno$.value,
            erro: undefined,
        })
    }

    registrarAtualizacaoToken() {
        this.estadoInterno$.next({
            ...this.estadoInterno$.value,
            versaoToken: this.estadoInterno$.value.versaoToken + 1,
        })
    }

    finalizarCarregamento() {
        this.estadoInterno$.next({
            ...this.estadoInterno$.value, 
            carregando: false 
        })
    }

    definirErro(erro: string) {
        this.estadoInterno$.next({
            ...this.estadoInterno$.value,
            carregando: false,
            autenticado: false,
            token: undefined,
            refreshToken: undefined,
            erro: erro,
        })
    }

    deslogar() {
        this.estadoInterno$.next(estadoInicial)
    }
}

export const autenticacaoEstado = new GerenteAutenticacaoEstado()
