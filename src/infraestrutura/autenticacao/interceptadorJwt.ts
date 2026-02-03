
import type { AxiosError, AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios'
import { clienteHttp } from '../http/clienteHttp'
import { autenticacaoServico } from '../servicos/AutenticacaoServico'
import {
  obterAccessToken,
  obterRefreshToken,
  salvarTokens,
  limparTokens,
} from './armazenamentoToken'
import { autenticacaoEstado } from '../../estado/autenticacaoEstado'

interface RequisicaoComRetry extends AxiosRequestConfig {
  _retry?: boolean
}

type ItemFila = {
  resolver: (valor: unknown) => void
  rejeitar: (erro: unknown) => void
  config: RequisicaoComRetry
}

let atualizandoToken = false
let filaRequisicoes: ItemFila[] = []

function processarFila(token: string) {
  filaRequisicoes.forEach(({ resolver, config }) => {
    if (config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    resolver(clienteHttp(config))
  })
  filaRequisicoes = []
}

function rejeitarFila(erro: unknown) {
  filaRequisicoes.forEach(({ rejeitar }) => rejeitar(erro))
  filaRequisicoes = []
}

export function configurarInterceptadorJwt() {
  clienteHttp.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const token = obterAccessToken()
      const url = config.url ?? ''

      const rotasPublicas = ['/autenticacao/login', '/autenticacao/refresh']
      const ehRotaPublica = rotasPublicas.some(rota => url.includes(rota))

      if (token && !ehRotaPublica) {
        config.headers.Authorization = `Bearer ${token}`
      }

      return config
    },
  )

  clienteHttp.interceptors.response.use(
    response => response,
    async (erro: AxiosError) => {
      const originalRequest = erro.config as RequisicaoComRetry
      const url = originalRequest.url ?? ''
      const rotasPublicas = ['/autenticacao/login', '/autenticacao/refresh']
      const ehRotaPublica = rotasPublicas.some(rota => url.includes(rota))

      if (
        erro.response?.status === 401 &&
        !originalRequest._retry &&
        !ehRotaPublica
      ) {
        originalRequest._retry = true

        if (atualizandoToken) {
          return new Promise((resolve, reject) => {
            filaRequisicoes.push({
              resolver: resolve,
              rejeitar: reject,
              config: originalRequest,
            })
          })
        }

        atualizandoToken = true

        try {
          const refreshToken = obterRefreshToken()

          if (!refreshToken) {
            throw new Error('Refresh token ausente')
          }

          const resposta = await autenticacaoServico.refreshToken(refreshToken)

          salvarTokens(resposta.access_token, resposta.refresh_token)

          autenticacaoEstado.definirAutenticado(
            resposta.access_token,
            resposta.refresh_token,
          )
          autenticacaoEstado.registrarAtualizacaoToken()

          processarFila(resposta.access_token)

          if (originalRequest.headers) {
            originalRequest.headers.Authorization =
              `Bearer ${resposta.access_token}`
          }

          return clienteHttp(originalRequest)
        } catch (erroRefresh) {
          limparTokens()
          autenticacaoEstado.deslogar()
          rejeitarFila(erroRefresh)

          window.dispatchEvent(new CustomEvent('auth:logout'))

          return Promise.reject(erroRefresh)
        } finally {
          atualizandoToken = false
        }
      }

      return Promise.reject(erro)
    },
  )
}
