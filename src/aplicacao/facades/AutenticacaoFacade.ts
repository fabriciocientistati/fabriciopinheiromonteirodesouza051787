import { autenticacaoEstado } from '../../estado/autenticacaoEstado'
import type { CredenciaisLogin } from '../../dominio/modelos/Autenticacao'
import { autenticacaoServico } from '../../infraestrutura/servicos/AutenticacaoServico'
import {
  limparTokens,
  obterAccessToken,
  obterRefreshToken,
  salvarTokens,
} from '../../infraestrutura/autenticacao/armazenamentoToken'

class AutenticacaoFacade {
  async login(credenciais: CredenciaisLogin) {
    try {
      autenticacaoEstado.definirCarregando()

      const resposta = await autenticacaoServico.login(credenciais)

      salvarTokens(resposta.access_token, resposta.refresh_token)

      autenticacaoEstado.definirAutenticado(
        resposta.access_token,
        resposta.refresh_token
      )
    } catch {
      autenticacaoEstado.definirErro('Credenciais invalidas')
    }
  }

  restaurarSessao() {
    const token = obterAccessToken()
    const refreshToken = obterRefreshToken()

    if (token && refreshToken) {
      autenticacaoEstado.definirAutenticado(token, refreshToken)
    }
  }

  logout() {
    limparTokens()
    autenticacaoEstado.deslogar()
  }
}

export const autenticacaoEstadoFacade = new AutenticacaoFacade()
