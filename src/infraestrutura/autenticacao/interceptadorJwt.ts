import type { AxiosRequestConfig } from 'axios'
import { AutenticacaoServico } from '../servicos/AutenticacaoServico'
import { clienteHttp } from '../http/clienteHttp'
import {
  obterAccessToken,
  obterRefreshToken,
  salvarTokens,
  limparTokens,
} from './armazenamentoToken'

const autenticacaoServico = new AutenticacaoServico()

let atualizandoToken = false
let filaRequisicoes: Array<(token: string) => void> = []

function processarFila(token: string) {
  filaRequisicoes.forEach(callback => callback(token))
  filaRequisicoes = []
}

export function configurarInterceptadorJwt() {
  clienteHttp.interceptors.request.use(config => {
    const token = obterAccessToken()
    const url = config.url ?? ''

    const rotasPublicas = ['/autenticacao/login', '/autenticacao/refresh']
    const ehRotaPublica = rotasPublicas.some(rota => url.includes(rota))

    if (token && !ehRotaPublica) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  })

  clienteHttp.interceptors.response.use(
    response => response,
    async erro => {
      const originalRequest = erro.config as AxiosRequestConfig & { _retry?: boolean }

      if (erro.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true

        if (atualizandoToken) {
          return new Promise(resolve => {
            filaRequisicoes.push((token: string) => {
              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${token}`
              }
              resolve(clienteHttp(originalRequest))
            })
          })
        }

        atualizandoToken = true

        try {
          const refreshToken = obterRefreshToken()
          if (!refreshToken) throw new Error('Refresh token ausente')

          const resposta =
            await autenticacaoServico.refreshToken(refreshToken)

          salvarTokens(
            resposta.access_token,
            resposta.refresh_token,
          )

          processarFila(resposta.access_token)

          if (originalRequest.headers) {
            originalRequest.headers.Authorization =
              `Bearer ${resposta.access_token}`
          }

          return clienteHttp(originalRequest)
        } catch {
          limparTokens()
          return Promise.reject(erro)
        } finally {
          atualizandoToken = false
        }
      }

      return Promise.reject(erro)
    },
  )
}
