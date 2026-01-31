import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { autenticacaoEstadoFacade } from '../../facades/AutenticacaoFacade'
import { useAutenticacao } from '../../hooks/useAutenticacao'

export function Login() {
  const navigate = useNavigate()
  const estado = useAutenticacao()

  const [nomeUsuario, setNomeUsuario] = useState('')
  const [senhaUsuario, setSenhaUsuario] = useState('')

  useEffect(() => {
    if (estado.autenticado) {
      navigate('/', { replace: true })
    }
  }, [estado.autenticado])

  function enviar(e: React.FormEvent) {
    e.preventDefault()

    autenticacaoEstadoFacade.login({
      username: nomeUsuario,
      password: senhaUsuario,
    })
  }

  return (
    <div>
      <h1>Login</h1>

      <form onSubmit={enviar}>
        <input
          placeholder="Nome do usuário"
          value={nomeUsuario}
          onChange={e => setNomeUsuario(e.target.value)}
        />

        <input
          type="password"
          placeholder="Senha"
          value={senhaUsuario}
          onChange={e => setSenhaUsuario(e.target.value)}
        />

        {estado.erro && <p>{estado.erro}</p>}

        <button type="submit">Entrar</button>
      </form>
    </div>
  )
}
