import { BehaviorSubject } from 'rxjs';

export type EstadoAutenticacao = {
    carregando: boolean
    autenticado: boolean
    erro?: string
    token?: string
    refreshToken?: string
}

const estadoInicial: EstadoAutenticacao = {
    carregando: true,
    autenticado: false,
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
            carregando: false,
            autenticado: true,
            token,
            refreshToken,
        })
    }

    definirErro(erro: string) {
        this.estadoInterno$.next({
            ...this.estadoInterno$.value,
            carregando: false,
            erro,
        })
    }

    deslogar() {
        this.estadoInterno$.next(estadoInicial)
    }
}

export const autenticacaoEstado = new GerenteAutenticacaoEstado()