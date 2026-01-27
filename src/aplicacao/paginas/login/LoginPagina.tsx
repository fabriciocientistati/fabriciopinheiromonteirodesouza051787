import { useState } from 'react'
import { AutenticacaoServico } from '../../../infraestrutura/servicos/AutenticacaoServico'
import { PetsServico } from '../../../infraestrutura/servicos/PetsServico'
import { salvarTokens } from '../../../infraestrutura/autenticacao/armazenamentoToken'
import type { CredenciaisLogin } from '../../../dominio/modelos/Autenticacao'

const autenticacaoServico = new AutenticacaoServico()
const petsServico = new PetsServico()

export default function TesteAutenticacao() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [mensagem, setMensagem] = useState<string | null>(null)

  async function fazerLogin() {
    try {
      const credenciais: CredenciaisLogin = {
        username,
        password,
      }

      const resposta = await autenticacaoServico.login(credenciais)

      salvarTokens(
        resposta.access_token,
        resposta.refresh_token
      )

      console.log('Tokens salvos no storage:', resposta)
      setMensagem('Login realizado com sucesso')
    } catch (erro) {
      console.error(erro)
      setMensagem('Erro ao realizar login')
    }
  }

  async function testarRequisicaoProtegida() {
    try {
      const pets = await petsServico.listar(0)
      console.log('Resposta da API protegida:', pets)
      setMensagem('Requisição protegida executada com sucesso')
    } catch (erro) {
      console.error(erro)
      setMensagem('Erro na requisição protegida')
    }
  }

  return (
    <div className="p-6 max-w-md space-y-4">
      <h1 className="text-xl font-semibold">
        Teste de Autenticação
      </h1>

      <input
        className="border p-2 w-full"
        placeholder="Usuário"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <input
        className="border p-2 w-full"
        type="password"
        placeholder="Senha"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        onClick={fazerLogin}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Fazer login
      </button>

      <button
        onClick={testarRequisicaoProtegida}
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        Testar requisição protegida
      </button>

      {mensagem && <p>{mensagem}</p>}
    </div>
  )
}

