import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AutenticacaoServico } from '../../../infraestrutura/servicos/AutenticacaoServico'
import { salvarTokens } from '../../../infraestrutura/autenticacao/armazenamentoToken'

export default function LoginPagina() {
  const [usuario, setUsuario] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState<string | null>(null)
  const [carregando, setCarregando] = useState(false)

  const navigate = useNavigate()
  const autenticacaoServico = new AutenticacaoServico()

  async function realizarLogin(e: React.FormEvent) {
    e.preventDefault()
    setErro(null)
    setCarregando(true)

    try {
      const resposta = await autenticacaoServico.login({
        username: usuario,
        password: senha,
      })

      salvarTokens(
        resposta.access_token,
        resposta.refresh_token,
      )

      navigate('/', { replace: true })
    } catch {
      setErro('Usuário ou senha inválidos')
    } finally {
      setCarregando(false)
    }
  }

  return (
    <form onSubmit={realizarLogin}>
      <h1>Login</h1>

      <input
        placeholder="Usuário"
        value={usuario}
        onChange={e => setUsuario(e.target.value)}
      />

      <input
        type="password"
        placeholder="Senha"
        value={senha}
        onChange={e => setSenha(e.target.value)}
      />

      {erro && <p>{erro}</p>}

      <button type="submit" disabled={carregando}>
        {carregando ? 'Entrando...' : 'Entrar'}
      </button>
    </form>
  )
}
