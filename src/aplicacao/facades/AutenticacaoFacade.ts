import { autenticacaoEstado } from '../../estado/autenticacaoEstado'
import type { CredenciaisLogin } from '../../dominio/modelos/Autenticacao'
import { autenticacaoServico } from '../../infraestrutura/servicos/AutenticacaoServico'
import { petsFacade } from './PetsFacade'
import { tutoresFacade } from './TutoresFacade'
import { mensagemErro } from '../utils/errosHttp'
import { MENSAGENS_ERRO } from '../utils/mensagensErro'
import {
  limparTokens,
  obterAccessToken,
  obterRefreshToken,
  salvarTokens,
} from '../../infraestrutura/autenticacao/armazenamentoToken'

class AutenticacaoFacade {
  async login(credenciais: CredenciaisLogin) {
    autenticacaoEstado.limparErro()
    autenticacaoEstado.definirCarregando();

    try {
      const resposta = await autenticacaoServico.login(credenciais);

      salvarTokens(resposta.access_token, resposta.refresh_token);

      autenticacaoEstado.definirAutenticado(
        resposta.access_token,
        resposta.refresh_token
      );
    } catch (erro) {
      limparTokens()
      autenticacaoEstado.definirErro(
        mensagemErro(erro, MENSAGENS_ERRO.CREDENCIAIS_INVALIDAS),
      )
    } finally {
      autenticacaoEstado.finalizarCarregamento();
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
    petsFacade.limpar()
    tutoresFacade.limparEstado()
  }

  obterSnapshot() {
    return autenticacaoEstado.obterSnapshot()
  }
}

export const autenticacaoFacade = new AutenticacaoFacade()
