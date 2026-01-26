import { clienteHttp } from "../http/clienteHttp";
import type { CredenciaisLogin, TokenAutenticacao } from "../../dominio/modelos/Autenticacao";

export class AutenticacaoServico {
    async login(credenciais: CredenciaisLogin): Promise<TokenAutenticacao> {
        const resposta = await clienteHttp.post<TokenAutenticacao>('/autenticacao/login', credenciais)
        return resposta.data
    }

    async refreshToken(refreshToken: string): Promise<TokenAutenticacao> {
        const resposta = await clienteHttp.post<TokenAutenticacao>('/autenticacao/refresh', 
            null, {
                headers: {
                    Authorization: `Bearer ${refreshToken}`
                }
        })
        return resposta.data
    }
}

